import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies, toAbsolute, cleanText, safeDate } from './utils';

const BASE = 'https://www.blueticket.pt';

function extractPrice(raw: string): string | undefined {
    const match = raw.replace(/\s+/g, ' ').match(/(\d+[.,]?\d*)\s*€?/);
    if (!match) return undefined;
    const num = match[1].replace(',', '.');
    return `${num}€`;
}

async function hydrateBlueticketDetails(events: Event[]): Promise<void> {
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
                    headers: { 'User-Agent': DEFAULT_UA },
                    timeout: 12000,
                    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                });
                const $ = cheerio.load(data);

                if (!ev.date) {
                    const ld = $('script[type="application/ld+json"]').first().html();
                    if (ld) {
                        try {
                            const json = JSON.parse(ld);
                            const arr = Array.isArray(json) ? json : [json];
                            const found = arr.find((j: any) => j.startDate);
                            if (found?.startDate) {
                                const normalized = safeDate(found.startDate);
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
                        $('meta[itemprop="price"]').attr('content') ||
                        $('[class*="preco"], [class*="preço"], [class*="price"], .info-preco, .precos')
                            .first()
                            .text() ||
                        $('body').text();
                    const price = extractPrice(priceText);
                    if (price) ev.price = price;
                }

                if (!ev.description || ev.description === 'Ver detalhes') {
                    const desc =
                        $('[class*="descricao"], .descricao, .description, article p')
                            .map((_, el) => $(el).text())
                            .get()
                            .join(' ') ||
                        $('meta[name="description"], meta[property="og:description"]').attr('content') ||
                        '';
                    if (desc) ev.description = cleanText(desc).substring(0, 240);
                }

                if (!ev.image || ev.image.includes('placeholder')) {
                    const ogImg =
                        $('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"]').attr('content') ||
                        $('img').first().attr('src') ||
                        '';
                    if (ogImg) ev.image = toAbsolute(ogImg, new URL(ev.url).origin);
                }
            } catch {
                /* ignore */
            }
        }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    const stillMissing = targets.filter(
        (e) => !e.price || !e.description || e.description === 'Ver detalhes' || !e.image || e.image.includes('placeholder'),
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

                if (!ev.price) {
                    const text = await page.evaluate(() => document.body.innerText || '');
                    const price = extractPrice(text);
                    if (price) ev.price = price;
                }

                if (!ev.description || ev.description === 'Ver detalhes') {
                    const desc = await page.evaluate(() => {
                        const meta = document.querySelector('meta[name="description"], meta[property="og:description"]') as HTMLMetaElement | null;
                        const body = document.querySelector('article') as HTMLElement | null;
                        return meta?.content || body?.innerText || '';
                    });
                    if (desc) ev.description = cleanText(desc).substring(0, 240);
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
                /* swallow per-item */
            }
        }
    } catch {
        /* swallow */
    } finally {
        if (browser) await browser.close();
    }
}

export async function scrapeBlueticket(): Promise<Event[]> {
    // ── Strategy 1: HTTP + Cheerio ──
    for (const pageUrl of ['https://www.blueticket.pt/', 'https://www.blueticket.pt/eventos']) {
        try {
            const { data: html } = await axios.get(pageUrl, {
                headers: { 'User-Agent': DEFAULT_UA },
                timeout: 15000,
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            });
            const $ = cheerio.load(html);
            const events: Event[] = [];
            const seen = new Set<string>();

            $('a[href*="/Evento/"], a[href*="/event/"], a[href*="/bilhetes/"], a[href*="/espetaculo/"]').each(
                (_, el) => {
                    let href = toAbsolute($(el).attr('href') || '', BASE);
                    if (seen.has(href)) return;
                    seen.add(href);

                    const title =
                        $(el).find('h2, h3, h4, .title, .name, span').first().text().trim() ||
                        $(el).text().trim().split('\n')[0].trim();
                    const img = toAbsolute($(el).find('img').first().attr('src') || '', BASE);

                    if (title && title.length > 2) {
                        events.push(
                            makeEvent({
                                title: title || titleFromSlug(href),
                                url: href,
                                image: img,
                                source: 'Blueticket',
                                location: 'Portugal',
                                description: title,
                            }),
                        );
                    }
                },
            );

            // Also try general card/product patterns
            if (events.length === 0) {
                $('article, .card, .produto, .destaque, .event-card').each((_, el) => {
                    const $el = $(el);
                    const link = $el.find('a').first().attr('href') || '';
                    if (!link) return;
                    const fullUrl = toAbsolute(link, BASE);
                    if (seen.has(fullUrl)) return;
                    seen.add(fullUrl);

                    const title = $el.find('h2, h3, h4, .title').first().text().trim();
                    const img = toAbsolute($el.find('img').first().attr('src') || '', BASE);
                    if (title) {
                        events.push(
                            makeEvent({
                                title,
                                url: fullUrl,
                                image: img,
                                source: 'Blueticket',
                                location: 'Portugal',
                                description: title,
                            }),
                        );
                    }
                });
            }

            if (events.length > 0) {
                await hydrateBlueticketDetails(events);
                console.log('[Blueticket] ' + events.length + ' events from ' + pageUrl + ' (HTTP)');
                return events;
            }
        } catch (err: any) {
            console.warn('[Blueticket] HTTP ' + pageUrl + ': ' + (err.message || '').substring(0, 60));
        }
    }

    // ── Strategy 2: Playwright ──
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const url of ['https://www.blueticket.pt/', 'https://www.blueticket.pt/eventos']) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
                await dismissCookies(page);
                await page.waitForTimeout(2000);

                const cards = await page.evaluate(() => {
                    const results: { title: string; url: string; img: string }[] = [];
                    const seen = new Set<string>();

                    document
                        .querySelectorAll(
                            'a[href*="/Evento/"], a[href*="/event/"], a[href*="bilhetes"], .event-card a, .produto a, article a, .card a',
                        )
                        .forEach((el) => {
                            const a = (el.tagName === 'A' ? el : el.querySelector('a')) as HTMLAnchorElement;
                            if (!a || !a.href || seen.has(a.href)) return;
                            seen.add(a.href);
                            const title =
                                (el.querySelector('h2, h3, h4, .title, .name') || el).textContent
                                    ?.trim()
                                    .split('\n')[0]
                                    ?.trim() || '';
                            const img = (el.querySelector('img') as HTMLImageElement)?.src || '';
                            if (title.length > 2) results.push({ title, url: a.href, img });
                        });
                    return results;
                });

                if (cards.length > 0) {
                    await browser.close();
                    const events = cards.slice(0, 30).map((c) =>
                        makeEvent({
                            title: c.title,
                            url: c.url,
                            image: c.img,
                            source: 'Blueticket',
                            location: 'Portugal',
                            description: c.title,
                        }),
                    );
                    await hydrateBlueticketDetails(events);
                    console.log('[Blueticket] ' + events.length + ' events from ' + url + ' (Playwright)');
                    return events;
                }
            } catch {
                /* try next URL */
            }
        }

        await browser.close();
        return [];
    } catch (err: any) {
        console.error('[Blueticket] ' + err.message);
        if (browser) await browser.close();
        return [];
    }
}
