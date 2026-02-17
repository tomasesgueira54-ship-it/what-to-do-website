import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies, extractPriceFromHtml } from './utils';

export async function scrapeMeetup(): Promise<Event[]> {
    // ── Strategy 1: HTTP + Cheerio ──
    try {
        const { data: html } = await axios.get(
            'https://www.meetup.com/find/?location=pt--Lisbon&source=EVENTS&eventType=inPerson',
            {
                headers: { 'User-Agent': DEFAULT_UA, 'Accept-Language': 'en-US,en;q=0.9' },
                timeout: 15000,
            },
        );
        const $ = cheerio.load(html);
        const events: Event[] = [];
        const seen = new Set<string>();

        // JSON-LD
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const ld = JSON.parse($(el).html() || '');
                const items = Array.isArray(ld) ? ld : [ld];
                for (const item of items) {
                    if (item['@type'] === 'Event' && item.url && !seen.has(item.url)) {
                        seen.add(item.url);
                        const priceFromLd = item.offers?.price || item.offers?.priceSpecification?.price || (Array.isArray(item.offers) && item.offers[0]?.price) || undefined;
                        events.push(
                            makeEvent({
                                title: item.name,
                                description: item.description,
                                date: item.startDate,
                                location: (item.location && item.location.name) || '',
                                image: item.image,
                                source: 'Meetup',
                                url: item.url,
                                price: priceFromLd ? (typeof priceFromLd === 'number' ? `${priceFromLd}€` : String(priceFromLd)) : undefined,
                            }),
                        );
                    }
                }
            } catch {
                /* ld+json parse error */
            }
        });

        // Parse event links
        $('a[href*="/events/"]').each((_, el) => {
            const href = $(el).attr('href') || '';
            if (!href || seen.has(href) || !href.includes('meetup.com')) return;
            seen.add(href);
            const title =
                $(el).find('h2, h3, h4, [class*="title"]').first().text().trim() ||
                $(el).text().trim().split('\n')[0].trim();
            if (title && title.length > 3) {
                events.push(
                    makeEvent({
                        title,
                        source: 'Meetup',
                        url: href.startsWith('http') ? href : 'https://www.meetup.com' + href,
                    }),
                );
            }
        });

        if (events.length > 0) {
            events.forEach((ev) => {
                if (!ev.price) ev.price = 'Check site';
            });
            console.log('[Meetup] ' + events.length + ' events (HTTP)');
            return events;
        }
    } catch (err: any) {
        console.warn('[Meetup] HTTP: ' + (err.message || '').substring(0, 60));
    }

    // ── Strategy 2: Playwright ──
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        await page.goto(
            'https://www.meetup.com/find/?location=pt--Lisbon&source=EVENTS&eventType=inPerson',
            { waitUntil: 'networkidle', timeout: 30000 },
        );
        await dismissCookies(page);
        await page.waitForTimeout(3000);

        // Scroll for lazy content
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(1000);
        }

        const cards = await page.evaluate(() => {
            const results: { title: string; url: string; img: string; date: string; loc: string; price?: string }[] = [];
            const seen = new Set<string>();

            const selectors = [
                '[data-eventid]',
                '[id*="event-card"]',
                '[class*="eventCard"]',
                '[class*="SearchEvent"]',
                'a[href*="/events/"]',
                '[data-testid*="event"]',
                '.searchResult',
            ];

            for (const sel of selectors) {
                document.querySelectorAll(sel).forEach((el) => {
                    const a = (el.tagName === 'A' ? el : el.querySelector('a[href*="/events/"]')) as HTMLAnchorElement;
                    if (!a || !a.href || seen.has(a.href)) return;
                    if (!a.href.includes('/events/')) return;
                    seen.add(a.href);

                    const titleEl = el.querySelector('h2, h3, h4, [class*="title"]');
                    const title = (titleEl || a).textContent?.trim().split('\n')[0]?.trim() || '';
                    const img = (el.querySelector('img') as HTMLImageElement)?.src || '';
                    const timeEl = el.querySelector('time') as HTMLTimeElement | null;
                    const date = timeEl?.getAttribute('datetime') || timeEl?.textContent?.trim() || '';
                    const loc = el.querySelector('[class*="venue"], [class*="location"]')?.textContent?.trim() || '';

                    // try to detect price on the card
                    const priceText = (el.querySelector('[class*="price"], .price, [data-testid*="price"]')?.textContent || el.textContent || '').trim();
                    const priceMatch = priceText.match(/(?:€\s*|\b)(\d{1,3}(?:[.,]\d{2})?)(?:\s*€)?/);
                    const cardPrice = priceMatch ? (priceMatch[1].replace(',', '.') + '€') : (/\bfree|gratuito|grátis|gratis\b/i.test(priceText) ? 'Grátis' : '');

                    if (title.length > 3) results.push({ title, url: a.href, img, date, loc, price: cardPrice });
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
                source: 'Meetup',
                price: c.price || undefined,
            }),
        );

        events.forEach((ev) => {
            if (!ev.price) ev.price = 'Check site';
        });

        console.log('[Meetup] ' + events.length + ' events (Playwright)');
        return events;
    } catch (err: any) {
        console.error('[Meetup] ' + err.message);
        if (browser) await browser.close();
        return [];
    }
}
