import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies, cleanText, safeDate } from './utils';

function extractPrice(raw: string): string | undefined {
    if (!raw) return undefined;
    const match = raw.replace(/\s+/g, ' ').match(/(Free|Gratuito|Grátis)|(\d+[.,]?\d*)\s*€?/i);
    if (!match) return undefined;
    if (match[1]) return 'Free';
    const num = match[2]?.replace(',', '.');
    return num ? `${num}€` : undefined;
}

async function hydrateEventbriteDetails(events: Event[]): Promise<void> {
    const targets = events.filter(
        (e) => !e.price || !e.description || e.description === 'Ver detalhes' || !e.image || e.image.includes('placeholder'),
    );
    if (!targets.length) return;

    const concurrency = 6;
    let idx = 0;

    const worker = async () => {
        while (idx < targets.length) {
            const ev = targets[idx++];
            try {
                const { data } = await axios.get(ev.url, {
                    headers: { 'User-Agent': DEFAULT_UA, 'Accept-Language': 'en-US,en;q=0.9' },
                    timeout: 12000,
                });
                const $ = cheerio.load(data);

                if (!ev.date) {
                    const ld = $('script[type="application/ld+json"]').first().html();
                    if (ld) {
                        try {
                            const json = JSON.parse(ld);
                            const arr = Array.isArray(json) ? json : [json];
                            const found = arr.find((j: any) => j.startDate) as any;
                            if (found?.startDate) {
                                const normalized = safeDate(found.startDate);
                                if (normalized) ev.date = normalized;
                            }
                        } catch {
                            /* ignore */
                        }
                    }
                    if (!ev.date) {
                        const meta =
                            $('meta[itemprop="startDate"], meta[property="event:start_time"], meta[name="startDate"]').attr('content') || '';
                        const normalized = safeDate(meta || undefined);
                        if (normalized) ev.date = normalized;
                    }
                }

                if (!ev.price) {
                    const ldPrice = $('script[type="application/ld+json"]').first().html();
                    if (ldPrice) {
                        try {
                            const ld = JSON.parse(ldPrice);
                            const offer = (Array.isArray(ld.offers) ? ld.offers[0] : ld.offers) as any;
                            const price = offer?.price || offer?.priceSpecification?.price;
                            if (price) ev.price = `${price}€`;
                        } catch {
                            /* ignore */
                        }
                    }
                    if (!ev.price) {
                        const priceText =
                            $('[class*="price"], [data-testid*="price"], .listing-panel [class*="text"], .structured-content')
                                .first()
                                .text() ||
                            $('body').text();
                        const price = extractPrice(priceText);
                        if (price) ev.price = price;
                    }
                }

                if (!ev.description || ev.description === 'Ver detalhes') {
                    const desc =
                        $('meta[name="description"], meta[property="og:description"]').attr('content') ||
                        $('[data-testid="listing-event-description"] p, .structured-content p')
                            .map((_, el) => $(el).text())
                            .get()
                            .join(' ');
                    if (desc) ev.description = cleanText(desc).substring(0, 240);
                }

                if (!ev.image || ev.image.includes('placeholder')) {
                    const ogImg =
                        $('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"]').attr('content') ||
                        $('img').first().attr('src') ||
                        '';
                    if (ogImg) ev.image = ogImg.startsWith('http') ? ogImg : `https:${ogImg}`;
                }
            } catch {
                /* ignore */
            }
        }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

export async function scrapeEventbrite(): Promise<Event[]> {
    // ── Strategy 1: HTTP + Cheerio (SSR content + JSON-LD) ──
    try {
        const { data: html } = await axios.get('https://www.eventbrite.com/d/portugal--lisbon/all-events/', {
            headers: { 'User-Agent': DEFAULT_UA, 'Accept-Language': 'en-US,en;q=0.9' },
            timeout: 15000,
        });
        const $ = cheerio.load(html);
        const events: Event[] = [];
        const seen = new Set<string>();

        // JSON-LD structured data
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const ld = JSON.parse($(el).html() || '');
                const items = Array.isArray(ld) ? ld : ld.itemListElement || [ld];
                for (const item of items) {
                    const ev = item.item || item;
                    if (ev['@type'] === 'Event' && ev.url && !seen.has(ev.url)) {
                        seen.add(ev.url);
                        events.push(
                            makeEvent({
                                title: ev.name,
                                description: ev.description,
                                date: ev.startDate,
                                location: (ev.location && ev.location.name) || '',
                                image: ev.image,
                                source: 'Eventbrite',
                                url: ev.url,
                            }),
                        );
                    }
                }
            } catch {
                /* ld+json parse error */
            }
        });

        // Also try event card links
        $('a[href*="/e/"]').each((_, el) => {
            const $a = $(el);
            const href = $a.attr('href') || '';
            if (!href || seen.has(href)) return;
            seen.add(href);
            const title =
                $a.find('h2, h3, [data-testid="event-card-title"]').first().text().trim() ||
                $a.text().trim().split('\n')[0].trim();
            const img = $a.find('img').first().attr('src') || '';
            if (title && title.length > 3) {
                events.push(
                    makeEvent({
                        title: title || titleFromSlug(href),
                        url: href.startsWith('http') ? href : 'https://www.eventbrite.com' + href,
                        image: img,
                        source: 'Eventbrite',
                        location: 'Lisboa',
                    }),
                );
            }
        });

        if (events.length > 0) {
            await hydrateEventbriteDetails(events);
            console.log('[Eventbrite] ' + events.length + ' events (HTTP)');
            return events;
        }
    } catch (err: any) {
        console.warn('[Eventbrite] HTTP: ' + (err.message || '').substring(0, 60));
    }

    // ── Strategy 2: Playwright with broad selectors ──
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        await page.goto('https://www.eventbrite.com/d/portugal--lisbon/all-events/', {
            waitUntil: 'networkidle',
            timeout: 30000,
        });
        await dismissCookies(page);
        await page.waitForTimeout(3000);

        // Scroll for lazy loading
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(1000);
        }

        const cards = await page.evaluate(() => {
            const results: { title: string; url: string; img: string; date: string; loc: string }[] = [];
            const seen = new Set<string>();

            const selectors = [
                '[data-testid="event-card"]',
                '.search-event-card-wrapper',
                '.eds-event-card',
                '[class*="EventCard"]',
                'article[class*="event"]',
                'a[href*="/e/"]',
                '.discover-search-desktop-card',
                '[class*="event-card"]',
            ];

            for (const sel of selectors) {
                document.querySelectorAll(sel).forEach((el) => {
                    const a = (el.tagName === 'A' ? el : el.querySelector('a[href*="/e/"]')) as HTMLAnchorElement;
                    if (!a || !a.href || seen.has(a.href)) return;
                    seen.add(a.href);

                    const titleEl = el.querySelector('h2, h3, [data-testid="event-card-title"], [class*="title"]');
                    const title = (titleEl || a).textContent?.trim().split('\n')[0]?.trim() || '';
                    const img = (el.querySelector('img') as HTMLImageElement)?.src || '';
                    const timeEl = el.querySelector('time') as HTMLTimeElement | null;
                    const date = timeEl?.getAttribute('datetime') || timeEl?.textContent?.trim() || '';
                    const loc =
                        el.querySelector('[data-subcontent-key], [class*="location"], [class*="venue"]')?.textContent?.trim() || '';

                    if (title.length > 3) results.push({ title, url: a.href, img, date, loc });
                });
            }
            return results;
        });

        await browser.close();

        const events = cards.slice(0, 30).map((c) =>
            makeEvent({
                title: c.title,
                date: c.date,
                url: c.url,
                image: c.img,
                location: c.loc || 'Lisboa',
                source: 'Eventbrite',
            }),
        );

        await hydrateEventbriteDetails(events);

        console.log('[Eventbrite] ' + events.length + ' events (Playwright)');
        return events;
    } catch (err: any) {
        console.error('[Eventbrite] ' + err.message);
        if (browser) await browser.close();
        return [];
    }
}
