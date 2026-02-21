import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, dismissCookies, cleanText, toAbsolute, safeDate, inferEndDateFromText, applyDefaultDuration } from './utils';

const SHOTGUN_MONTHS: Record<string, number> = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    sept: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
};

function parseShotgunDateText(input?: string): string {
    const text = (input || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';

    const explicit = safeDate(text);
    if (explicit) return explicit;

    const now = new Date();
    let year = now.getUTCFullYear();

    const withTime = text.match(/(?:mon|tue|wed|thu|fri|sat|sun),?\s+([a-z]{3,9})\s+(\d{1,2})(?:\s*\|\s*(\d{1,2}):(\d{2})\s*(am|pm))?/i);
    if (withTime) {
        const month = SHOTGUN_MONTHS[(withTime[1] || '').toLowerCase()];
        const day = Number.parseInt(withTime[2] || '0', 10);
        if (!Number.isNaN(month) && day > 0) {
            let hour = withTime[3] ? Number.parseInt(withTime[3], 10) : 20;
            const minute = withTime[4] ? Number.parseInt(withTime[4], 10) : 0;
            const ampm = (withTime[5] || '').toLowerCase();
            if (ampm === 'pm' && hour < 12) hour += 12;
            if (ampm === 'am' && hour === 12) hour = 0;
            let dt = new Date(Date.UTC(year, month, day, hour, minute, 0));
            if (dt.getTime() + 1000 * 60 * 60 * 24 * 120 < now.getTime()) {
                year += 1;
                dt = new Date(Date.UTC(year, month, day, hour, minute, 0));
            }
            return dt.toISOString();
        }
    }

    const range = text.match(/([a-z]{3,9})\s+(\d{1,2})\s*[–-]\s*(\d{1,2})/i);
    if (range) {
        const month = SHOTGUN_MONTHS[(range[1] || '').toLowerCase()];
        const day = Number.parseInt(range[2] || '0', 10);
        if (!Number.isNaN(month) && day > 0) {
            let dt = new Date(Date.UTC(year, month, day, 20, 0, 0));
            if (dt.getTime() + 1000 * 60 * 60 * 24 * 120 < now.getTime()) {
                year += 1;
                dt = new Date(Date.UTC(year, month, day, 20, 0, 0));
            }
            return dt.toISOString();
        }
    }

    return '';
}

/**
 * Parse end date from Shotgun date range text like "Mar 15–17"
 * Returns empty string if no range found.
 */
function parseShotgunEndDate(input?: string): string {
    const text = (input || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';

    const now = new Date();
    let year = now.getUTCFullYear();

    const range = text.match(/([a-z]{3,9})\s+(\d{1,2})\s*[–-]\s*(\d{1,2})/i);
    if (range) {
        const month = SHOTGUN_MONTHS[(range[1] || '').toLowerCase()];
        const endDay = Number.parseInt(range[3] || '0', 10);
        if (!Number.isNaN(month) && endDay > 0) {
            let dt = new Date(Date.UTC(year, month, endDay, 23, 59, 0));
            if (dt.getTime() + 1000 * 60 * 60 * 24 * 120 < now.getTime()) {
                year += 1;
                dt = new Date(Date.UTC(year, month, endDay, 23, 59, 0));
            }
            return dt.toISOString();
        }
    }

    const dmy = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
    if (dmy) {
        const day = Number.parseInt(dmy[1] || '0', 10);
        const month = Number.parseInt(dmy[2] || '0', 10) - 1;
        const parsedYear = dmy[3] ? Number.parseInt(dmy[3], 10) : year;
        if (month >= 0 && month < 12 && day > 0) {
            const fixedYear = parsedYear < 100 ? 2000 + parsedYear : parsedYear;
            return new Date(Date.UTC(fixedYear, month, day, 20, 0, 0)).toISOString();
        }
    }

    return '';
}

async function hydrateShotgunDetails(events: Event[]): Promise<void> {
    const targets = events.filter(
        (e) =>
            !e.description
            || e.description === 'Ver detalhes'
            || !e.image
            || e.image.includes('placeholder')
            || !e.date
            || !e.endDate
            || !e.price,
    );
    if (!targets.length) return;

    const concurrency = 6;
    let idx = 0;

    const worker = async () => {
        while (idx < targets.length) {
            const ev = targets[idx++];
            try {
                const { data } = await axios.get(ev.url, { headers: { 'User-Agent': DEFAULT_UA }, timeout: 12000 });
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
                        $('meta[property="og:description"], meta[name="description"]').attr('content') ||
                        $('[class*="description"], .event-description, article p')
                            .map((_, el) => $(el).text())
                            .get()
                            .join(' ') ||
                        $('body').text();
                    if (desc) ev.description = cleanText(desc).substring(0, 240);
                }

                if (!ev.date || !ev.endDate) {
                    const ldHtml = $('script[type="application/ld+json"]').first().html();
                    if (ldHtml) {
                        try {
                            const ld = JSON.parse(ldHtml);
                            const items = Array.isArray(ld) ? ld : [ld];
                            const withDate = items.find((i: any) => i.startDate) as any;
                            if (withDate?.startDate && !ev.date) {
                                const normalized = safeDate(withDate.startDate);
                                if (normalized) ev.date = normalized;
                            }
                            if (withDate?.endDate && !ev.endDate) {
                                const normalizedEnd = safeDate(withDate.endDate);
                                if (normalizedEnd) ev.endDate = normalizedEnd;
                            }
                        } catch {
                            /* ignore */
                        }
                    }
                    if (!ev.date) {
                        const metaDate =
                            $('meta[itemprop="startDate"], meta[property="event:start_time"], meta[name="startDate"]').attr('content') || '';
                        const normalized = safeDate(metaDate || undefined);
                        if (normalized) ev.date = normalized;
                    }
                    if (!ev.endDate) {
                        const metaEnd =
                            $('meta[itemprop="endDate"], meta[property="event:end_time"]').attr('content') || '';
                        const normalizedEnd = safeDate(metaEnd || undefined);
                        if (normalizedEnd) ev.endDate = normalizedEnd;
                    }
                }

                if (!ev.price) {
                    const priceText =
                        $('meta[property="product:price:amount"], meta[itemprop="price"]').attr('content') ||
                        $('body').text();
                    const match = priceText.replace(/\s+/g, ' ').match(/(Free|Gratuito|Grátis)|(\d+[.,]?\d*)\s*€?/i);
                    if (match) {
                        if (match[1]) ev.price = 'Grátis';
                        else if (match[2]) ev.price = `${match[2].replace(',', '.')}€`;
                    }
                }

                // New Heuristic Phase 2: Infer End Date (HTTP)
                if (ev.date && !ev.endDate) {
                    const textScan = (ev.description || '') + ' ' + $('body').text();
                    const inferred = inferEndDateFromText(textScan, new Date(ev.date));
                    if (inferred) ev.endDate = inferred.toISOString();
                    else applyDefaultDuration(ev, 6);
                }

                if (!ev.image || ev.image.includes('placeholder')) {
                    const ogImg =
                        $('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"]').attr('content') ||
                        $('img').first().attr('src') ||
                        '';
                    if (ogImg) ev.image = toAbsolute(ogImg, new URL(ev.url).origin);
                }
            } catch {
                /* swallow */
            }
        }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    const stillMissing = targets.filter(
        (e) =>
            !e.description
            || e.description === 'Ver detalhes'
            || !e.price
            || !e.image
            || e.image.includes('placeholder')
            || !e.date
            || !e.endDate,
    );
    if (!stillMissing.length) return;

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        let page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const ev of stillMissing) {
            try {
                if (page.isClosed()) {
                    page = await browser.newPage({ userAgent: DEFAULT_UA });
                }

                await page.goto(ev.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                await page.waitForTimeout(800);

                if (!ev.description || ev.description === 'Ver detalhes') {
                    const desc = await page.evaluate(() => {
                        const meta = document.querySelector('meta[name="description"], meta[property="og:description"]') as HTMLMetaElement | null;
                        const body = document.querySelector('[class*="description"], article, main') as HTMLElement | null;
                        return meta?.content || body?.innerText || '';
                    });
                    if (desc) ev.description = cleanText(desc).substring(0, 240);
                }

                if (!ev.date) {
                    const text = await page.evaluate(() => {
                        const ld = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
                        if (ld?.textContent) {
                            try {
                                const data = JSON.parse(ld.textContent);
                                const arr = Array.isArray(data) ? data : [data];
                                const found = arr.find((d: any) => d.startDate);
                                if (found?.startDate) return found.startDate as string;
                            } catch {
                                /* ignore */
                            }
                        }
                        const meta = document.querySelector('meta[itemprop="startDate"], meta[property="event:start_time"], meta[name="startDate"]') as HTMLMetaElement | null;
                        return meta?.content || '';
                    });
                    const normalized = safeDate(text || undefined);
                    if (normalized) ev.date = normalized;
                }

                if (!ev.endDate) {
                    const text = await page.evaluate(() => {
                        const ld = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
                        if (ld?.textContent) {
                            try {
                                const data = JSON.parse(ld.textContent);
                                const arr = Array.isArray(data) ? data : [data];
                                const found = arr.find((d: any) => d.endDate);
                                if (found?.endDate) return found.endDate as string;
                            } catch {
                                /* ignore */
                            }
                        }
                        const meta = document.querySelector('meta[itemprop="endDate"], meta[property="event:end_time"], meta[name="endDate"]') as HTMLMetaElement | null;
                        return meta?.content || '';
                    });
                    const normalizedEnd = safeDate(text || undefined);
                    if (normalizedEnd) ev.endDate = normalizedEnd;
                }

                if (!ev.price) {
                    const text = await page.evaluate(() => document.body.innerText || '');
                    const match = text.replace(/\s+/g, ' ').match(/(Free|Gratuito|Grátis)|(\d+[.,]?\d*)\s*€?/i);
                    if (match) {
                        if (match[1]) ev.price = 'Grátis';
                        else if (match[2]) ev.price = `${match[2].replace(',', '.')}€`;
                    }
                }

                // New Heuristic Phase 2: Infer End Date (Playwright)
                if (ev.date && !ev.endDate) {
                    const text = await page.evaluate(() => document.body.innerText || '');
                    const inferred = inferEndDateFromText(ev.description + ' ' + text, new Date(ev.date));
                    if (inferred) ev.endDate = inferred.toISOString();
                    else applyDefaultDuration(ev, 6);
                }

                if (!ev.image || ev.image.includes('placeholder')) {
                    const img = await page.evaluate(() => {
                        const meta = document.querySelector('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"]') as HTMLMetaElement | null;
                        const tag = document.querySelector('img') as HTMLImageElement | null;
                        return meta?.content || tag?.src || '';
                    });
                    if (img) ev.image = toAbsolute(img, new URL(ev.url).origin);
                }
            } catch {
                /* per-item */
            }
        }
    } catch {
        /* swallow */
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch {
                /* ignore close errors */
            }
        }
    }
}

export async function scrapeShotgun(): Promise<Event[]> {
    let browser;

    // Only use shotgun.live (shotgun.pt is geoblocked)
    // Try Lisbon-specific searches first, then Portugal, then global
    const urls = [
        'https://shotgun.live/en/cities/lisbon',
        'https://shotgun.live/en/events?search=lisboa',
        'https://shotgun.live/en/events?search=lisbon',
        'https://shotgun.live/en/events?search=portugal',
        'https://shotgun.live/en/events',
        'https://shotgun.live/events/-/2',
        'https://shotgun.live/events/-/3',
        'https://shotgun.live/events/-/4',
    ];

    const byUrl = new Map<string, Event>();

    try {
        browser = await chromium.launch({ headless: true });
        let page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const url of urls) {
            try {
                if (page.isClosed()) {
                    page = await browser.newPage({ userAgent: DEFAULT_UA });
                }

                console.log('[Shotgun] Trying ' + url + '...');
                await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
                await dismissCookies(page);
                await page.waitForTimeout(2000);

                let stableRounds = 0;
                let lastCount = -1;
                for (let i = 0; i < 18 && stableRounds < 3; i++) {
                    const count = await page.evaluate(() => document.querySelectorAll('a[href*="/events/"]').length);
                    if (count <= lastCount) stableRounds++;
                    else stableRounds = 0;
                    lastCount = count;

                    const clicked = await page.evaluate(() => {
                        const labels = ['load more', 'show more', 'more events', 'see more', 'ver mais'];
                        const nodes = Array.from(document.querySelectorAll('button, a')) as Array<HTMLButtonElement | HTMLAnchorElement>;
                        const target = nodes.find((n) => {
                            const text = (n.textContent || '').toLowerCase();
                            return labels.some((l) => text.includes(l));
                        });
                        if (target) {
                            target.click();
                            return true;
                        }
                        return false;
                    });

                    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.4));
                    await page.waitForTimeout(clicked ? 1200 : 800);
                }

                const cards = await page.evaluate(() => {
                    const results: { title: string; url: string; img: string; desc: string; loc: string; dateText: string; priceText: string }[] = [];
                    const seen = new Set<string>();

                    document.querySelectorAll('a[href*="/events/"]').forEach((el) => {
                        const a = el as HTMLAnchorElement;
                        if (!a.href || seen.has(a.href)) return;
                        if (a.href.includes('/login') || a.href.includes('/signup') || a.href.includes('/events?')) return;
                        seen.add(a.href);

                        // Get just the first line of text as title (before metadata like location/date)
                        const fullText = a.innerText || '';
                        const firstLine = fullText.split('\n')[0].trim();
                        const img = (a.querySelector('img') as HTMLImageElement)?.src || '';
                        const timeNode = a.querySelector('time') as HTMLTimeElement | null;
                        const dateText =
                            timeNode?.getAttribute('datetime') ||
                            timeNode?.textContent?.trim() ||
                            fullText.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+[A-Za-z]{3,9}\s+\d{1,2}(?:\s*\|\s*\d{1,2}:\d{2}\s*(?:AM|PM))?/i)?.[0] ||
                            fullText.match(/[A-Za-z]{3,9}\s+\d{1,2}\s*[–-]\s*\d{1,2}/i)?.[0] ||
                            fullText.match(/\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/)?.[0] ||
                            '';
                        const loc =
                            fullText.match(/\b([A-Za-zÀ-ÿ'’\-. ]+),\s*(Portugal|Brazil|Spain|France|Italy|Germany|UK|United Kingdom)\b/i)?.[0] ||
                            fullText.match(/\b(Lisboa|Lisbon|Porto|Faro|Set[úu]bal|Almada)\b/i)?.[0] ||
                            '';
                        const priceText = fullText.match(/(€\s*\d+[.,]?\d*|\d+[.,]?\d*\s*€|Free|Waiting list|Sold out)/i)?.[0] || '';

                        if (firstLine && firstLine.length > 3 && firstLine.length < 200) {
                            results.push({ title: firstLine, url: a.href, img, desc: fullText, loc, dateText, priceText });
                        }
                    });

                    return results;
                });

                if (cards.length > 0) {
                    const events = cards.map((c) =>
                        makeEvent({
                            title: c.title,
                            description: c.desc,
                            date: parseShotgunDateText(c.dateText || c.desc),
                            endDate: parseShotgunEndDate(c.dateText || c.desc),
                            location: c.loc || (url.includes('/cities/lisbon') ? 'Lisboa' : ''),
                            url: c.url,
                            image: c.img,
                            price: c.priceText || undefined,
                            source: 'Shotgun',
                        }),
                    );
                    await hydrateShotgunDetails(events);
                    events.forEach((ev) => {
                        if (ev.url && !byUrl.has(ev.url)) byUrl.set(ev.url, ev);
                    });
                    console.log('[Shotgun] ' + events.length + ' events from ' + url);
                }
            } catch (err: any) {
                console.warn('[Shotgun] ' + url + ': ' + (err.message || '').substring(0, 50));
                try {
                    if (!page.isClosed()) {
                        await page.close();
                    }
                } catch {
                    /* ignore close errors */
                }
                page = await browser.newPage({ userAgent: DEFAULT_UA });
            }
        }
    } catch (err: any) {
        console.warn('[Shotgun] Browser bootstrap: ' + (err.message || '').substring(0, 60));
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch {
                /* ignore close errors */
            }
        }
    }

    const events = Array.from(byUrl.values());
    if (events.length === 0) {
        console.warn('[Shotgun] All URLs failed');
    }
    return events;
}
