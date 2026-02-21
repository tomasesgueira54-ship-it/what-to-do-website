import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies, cleanText, toAbsolute, safeDate, extractPriceFromHtml, inferEndDateFromText, applyDefaultDuration } from './utils';

async function hydrateAgendaDetails(events: Event[]): Promise<void> {
    const targets = events.filter((e) =>
        !e.description || e.description === 'Ver detalhes'
        || !e.image || e.image.includes('placeholder')
        || !e.date || !e.endDate
    );
    if (targets.length === 0) return;

    const concurrency = 6;
    let index = 0;

    const worker = async () => {
        while (index < targets.length) {
            const ev = targets[index++];
            try {
                const { data } = await axios.get(ev.url, {
                    headers: { 'User-Agent': DEFAULT_UA },
                    timeout: 12000,
                });
                const $ = cheerio.load(data);

                if (!ev.description || ev.description === 'Ver detalhes') {
                    const desc =
                        $('script[type="application/ld+json"]')
                            .map((_, el) => {
                                try {
                                    const data = JSON.parse($(el).html() || '');
                                    return Array.isArray(data) ? data.map((d: any) => d.description).join(' ') : data.description || '';
                                } catch {
                                    return '';
                                }
                            })
                            .get()
                            .join(' ') ||
                        $('article .entry-content p, .post-content p, .post-excerpt, .entry-content p, article p')
                            .map((_, p) => $(p).text())
                            .get()
                            .join(' ') ||
                        $('meta[name="description"], meta[property="og:description"]').first().attr('content') ||
                        $('body').text();
                    if (desc) ev.description = cleanText(desc).substring(0, 240);
                }

                if (!ev.date || !ev.endDate) {
                    const ldWithDate = $('script[type="application/ld+json"]').toArray().find((el) => {
                        try {
                            const data = JSON.parse($(el).html() || '');
                            const arr = Array.isArray(data) ? data : [data];
                            return arr.some((d: any) => d.startDate || d.endDate);
                        } catch {
                            return false;
                        }
                    });

                    if (ldWithDate) {
                        try {
                            const data = JSON.parse($(ldWithDate).html() || '');
                            const arr = Array.isArray(data) ? data : [data];
                            const found = arr.find((d: any) => d.startDate || d.endDate);
                            if (found?.startDate && !ev.date) {
                                const normalized = safeDate(found.startDate);
                                if (normalized) ev.date = normalized;
                            }
                            if (found?.endDate && !ev.endDate) {
                                const normalizedEnd = safeDate(found.endDate);
                                if (normalizedEnd) ev.endDate = normalizedEnd;
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

                    if (!ev.endDate) {
                        const metaEnd =
                            $('meta[itemprop="endDate"], meta[property="event:end_time"], meta[name="endDate"]').attr('content') || '';
                        const normalizedEnd = safeDate(metaEnd || undefined);
                        if (normalizedEnd) ev.endDate = normalizedEnd;
                    }
                }

                // Try to extract a concrete price (JSON-LD offers, meta tags, or body text)
                if (!ev.price || ev.price === 'Check site') {
                    const ldPrice =
                        $('script[type="application/ld+json"]').
                            map((_, el) => {
                                try {
                                    const data = JSON.parse($(el).html() || '');
                                    const arr = Array.isArray(data) ? data : [data];
                                    for (const d of arr) {
                                        if (d && d.offers) {
                                            if (typeof d.offers === 'object' && d.offers.price) return d.offers.price;
                                            if (Array.isArray(d.offers) && d.offers[0]?.price) return d.offers[0].price;
                                        }
                                    }
                                } catch {
                                    return '';
                                }
                                return '';
                            })
                            .get()
                            .find(Boolean) || '';

                    const metaPrice = $('meta[itemprop="price"], meta[property="product:price:amount"]').attr('content') || '';
                    const bodyPrice = extractPriceFromHtml($.html());
                    const chosen = (ldPrice || metaPrice || bodyPrice || '').toString();
                    ev.price = chosen ? chosen : 'Check site';
                }

                if (!ev.image || ev.image.includes('placeholder')) {
                    const ogImg =
                        $('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"]').attr('content') ||
                        $('article img, .post-item img').first().attr('src') ||
                        '';
                    if (ogImg) ev.image = toAbsolute(ogImg, new URL(ev.url).origin);
                }

                // New Heuristic Phase 2: Infer End Date from text if missing
                // Run THIS AFTER we have potentially scraped the date above
                if (ev.date && !ev.endDate) {
                    const textToScan = (ev.description || '') + ' ' + $('body').text();
                    const inferred = inferEndDateFromText(textToScan, new Date(ev.date));
                    if (inferred) {
                        ev.endDate = inferred.toISOString();
                    } else {
                        // Default duration if still missing
                        applyDefaultDuration(ev, 2);
                    }
                }
            } catch {
                /* swallow */
            }
        }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

export async function scrapeAgendaLX(): Promise<Event[]> {
    const allEvents: Event[] = [];
    const seenUrls = new Set<string>();

    // Strategy 1: HTTP + Cheerio (Agenda LX is WordPress = SSR)
    const pages = [
        'https://www.agendalx.pt/',
        'https://www.agendalx.pt/agenda/',
        'https://www.agendalx.pt/events/',
    ];

    for (const pageUrl of pages) {
        try {
            const { data: html } = await axios.get(pageUrl, {
                headers: { 'User-Agent': DEFAULT_UA },
                timeout: 15000,
            });
            const $ = cheerio.load(html);

            // Parse article cards
            $('article, .post-item, .event-item').each((_, el) => {
                const $el = $(el);
                const link = $el.find('a').first().attr('href') || '';
                if (!link || seenUrls.has(link)) return;
                seenUrls.add(link);

                const title = $el.find('h2, h3, .post-title, .entry-title').first().text().trim();
                const image = $el.find('img').first().attr('src') || '';
                const desc = $el.find('.post-excerpt, .entry-content, p').first().text().trim();

                allEvents.push(
                    makeEvent({
                        title: title || titleFromSlug(link),
                        description: desc,
                        url: link,
                        image,
                        source: 'Agenda LX',
                    }),
                );
            });

            // Also grab direct /events/event/ links
            $('a[href*="/events/event/"]').each((_, el) => {
                const href = $(el).attr('href') || '';
                if (!href || seenUrls.has(href)) return;
                seenUrls.add(href);
                allEvents.push(
                    makeEvent({
                        title: titleFromSlug(href),
                        url: href,
                        source: 'Agenda LX',
                    }),
                );
            });
        } catch (err: any) {
            console.warn('[Agenda LX] HTTP ' + pageUrl + ': ' + (err.message || '').substring(0, 60));
        }
    }

    if (allEvents.length > 0) {
        await hydrateAgendaDetails(allEvents);
        allEvents.forEach((ev) => {
            if (!ev.price) ev.price = 'Check site';
        });
        console.log('[Agenda LX] ' + allEvents.length + ' events (HTTP)');
        return allEvents;
    }

    // Strategy 2: Playwright fallback
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });
        await page.goto('https://www.agendalx.pt/', { waitUntil: 'networkidle', timeout: 30000 });
        await dismissCookies(page);
        await page.waitForTimeout(800);

        const cards = await page.$$eval(
            'article, .post-item, .event-item, a[href*="/events/event/"]',
            (nodes: any[]) =>
                nodes
                    .slice(0, 40)
                    .map((n: any) => ({
                        title: (n.querySelector('h2, h3, .post-title, .entry-title') as HTMLElement)?.innerText?.trim() || '',
                        link: (n.querySelector('a') as HTMLAnchorElement)?.href || (n as HTMLAnchorElement).href || '',
                        image: (n.querySelector('img') as HTMLImageElement)?.src || '',
                        desc: (n.querySelector('.post-excerpt, .entry-content, p') as HTMLElement)?.innerText?.trim() || '',
                    }))
                    .filter((c: any) => c.link),
        );

        await browser.close();

        const events = cards.map((c: any) =>
            makeEvent({
                title: c.title || titleFromSlug(c.link),

                description: c.desc,
                url: c.link,
                image: c.image,
                source: 'Agenda LX',
            }),
        );

        await hydrateAgendaDetails(events);
        events.forEach((ev) => {
            if (!ev.price) ev.price = 'Check site';
            if (ev.date && !ev.endDate) applyDefaultDuration(ev, 2);
        });

        console.log('[Agenda LX] ' + events.length + ' events (Playwright)');
        return events;
    } catch (err: any) {
        console.error('[Agenda LX] ' + err.message);
        if (browser) await browser.close();
        return [];
    }
}

