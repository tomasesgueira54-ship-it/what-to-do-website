import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, dismissCookies, cleanText, toAbsolute, safeDate } from './utils';

async function hydrateShotgunDetails(events: Event[]): Promise<void> {
    const targets = events.filter((e) => !e.description || e.description === 'Ver detalhes' || !e.image || e.image.includes('placeholder'));
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

                if (!ev.date) {
                    const startDate = $('script[type="application/ld+json"]').first().html();
                    if (startDate) {
                        try {
                            const ld = JSON.parse(startDate);
                            const items = Array.isArray(ld) ? ld : [ld];
                            const withDate = items.find((i: any) => i.startDate) as any;
                            if (withDate?.startDate) {
                                const normalized = safeDate(withDate.startDate);
                                if (normalized) ev.date = normalized;
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
                }

                if (!ev.price) {
                    const priceText =
                        $('meta[property="product:price:amount"], meta[itemprop="price"]').attr('content') ||
                        $('body').text();
                    const match = priceText.replace(/\s+/g, ' ').match(/(Free|Gratuito|Grátis)|(\d+[.,]?\d*)\s*€?/i);
                    if (match) {
                        if (match[1]) ev.price = 'Free';
                        else if (match[2]) ev.price = `${match[2].replace(',', '.')}€`;
                    }
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
        (e) => !e.description || e.description === 'Ver detalhes' || !e.price || !e.image || e.image.includes('placeholder'),
    );
    if (!stillMissing.length) return;

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const ev of stillMissing) {
            try {
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

                if (!ev.price) {
                    const text = await page.evaluate(() => document.body.innerText || '');
                    const match = text.replace(/\s+/g, ' ').match(/(Free|Gratuito|Grátis)|(\d+[.,]?\d*)\s*€?/i);
                    if (match) {
                        if (match[1]) ev.price = 'Free';
                        else if (match[2]) ev.price = `${match[2].replace(',', '.')}€`;
                    }
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
        if (browser) await browser.close();
    }
}

export async function scrapeShotgun(): Promise<Event[]> {
    let browser;

    // Only use shotgun.live (shotgun.pt is geoblocked)
    // Try Lisbon-specific searches first, then Portugal, then global
    const urls = [
        'https://shotgun.live/en/events?search=lisboa',
        'https://shotgun.live/en/events?search=lisbon',
        'https://shotgun.live/en/events?search=portugal',
        'https://shotgun.live/en/events',
    ];

    for (const url of urls) {
        try {
            browser = await chromium.launch({ headless: true });
            const page = await browser.newPage({ userAgent: DEFAULT_UA });

            console.log('[Shotgun] Trying ' + url + '...');
            await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
            await dismissCookies(page);
            await page.waitForTimeout(2000);

            // Scroll to load more
            for (let i = 0; i < 5; i++) {
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
                await page.waitForTimeout(800);
            }

            const cards = await page.evaluate(() => {
                const results: { title: string; url: string; img: string; desc: string; loc: string }[] = [];
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

                    if (firstLine && firstLine.length > 3 && firstLine.length < 200) {
                        results.push({ title: firstLine, url: a.href, img, desc: '', loc: '' });
                    }
                });

                return results;
            });

            await browser.close();
            browser = undefined;

            if (cards.length > 0) {
                const events = cards.slice(0, 30).map((c) =>
                    makeEvent({
                        title: c.title,
                        description: c.desc,
                        url: c.url,
                        image: c.img,
                        source: 'Shotgun',
                    }),
                );
                await hydrateShotgunDetails(events);
                console.log('[Shotgun] ' + events.length + ' events from ' + url);
                return events;
            }
        } catch (err: any) {
            console.warn('[Shotgun] ' + url + ': ' + (err.message || '').substring(0, 50));
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        }
    }

    console.warn('[Shotgun] All URLs failed');
    return [];
}
