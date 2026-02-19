import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies, toAbsolute, cleanText, safeDate } from './utils';

function normalizeHref(href: string): string {
    if (!href) return '';
    if (href.startsWith('http')) return href;
    if (href.startsWith('//')) return `https:${href}`;
    if (href.startsWith('/')) return `https://xceed.me${href}`;
    return `https://xceed.me/${href.replace(/^\.\//, '')}`;
}

function titleFromXceedUrl(url: string): string {
    try {
        const pathname = new URL(url).pathname;
        const parts = pathname.split('/').filter(Boolean);
        const eventIndex = parts.findIndex((p) => p === 'event');
        if (eventIndex >= 0 && parts[eventIndex + 1]) {
            const slug = parts[eventIndex + 1];
            return slug
                .replace(/[-_]+/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())
                .trim();
        }
    } catch {
        /* noop */
    }
    return titleFromSlug(url);
}

function extractCardsFromHtml(html: string): Array<{ title: string; url: string; image?: string; location?: string; date?: string; price?: string }> {
    const $ = cheerio.load(html);
    const out: Array<{ title: string; url: string; image?: string; location?: string; date?: string; price?: string }> = [];
    const seen = new Set<string>();

    $('a[href*="/event/"]').each((_, el) => {
        const href = normalizeHref($(el).attr('href') || '');
        if (!href || seen.has(href)) return;
        seen.add(href);

        const title =
            cleanText($(el).find('h1, h2, h3, h4, [class*="title"], [class*="name"]').first().text()) ||
            cleanText($(el).text().split('\n')[0] || '') ||
            titleFromSlug(href);

        if (!title || title.length < 3) return;

        const image = normalizeHref($(el).find('img').first().attr('src') || '');
        const cardText = cleanText($(el).text());
        const locationMatch = cardText.match(/\b(Lisbon|Lisboa|Porto|Faro|Set[úu]bal|Almada)\b/i);
        const dateMatch = cardText.match(/\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b/i);
        const priceMatch = cardText.match(/(FROM\s+\d+[.,]?\d*€|\d+[.,]?\d*€|SEE EVENT|FREE|GR[AÁ]TIS)/i);

        out.push({
            title,
            url: href,
            image,
            location: locationMatch ? locationMatch[1] : 'Lisboa',
            date: dateMatch ? dateMatch[0] : '',
            price: priceMatch ? priceMatch[0] : '',
        });
    });

    return out;
}

function isSuspiciousIsoDate(value?: string): boolean {
    if (!value) return true;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return true;
    const year = d.getUTCFullYear();
    const nowYear = new Date().getUTCFullYear();
    return year < nowYear - 1 || year > nowYear + 3;
}

function isNoisyTitle(value?: string): boolean {
    const t = cleanText(value || '');
    if (!t) return true;
    if (t.length > 120) return true;
    if (/\bfrom\s+\d|\b\d{1,2}:\d{2}\s*(am|pm)|\bfree\b|\bgr[aá]tis\b/i.test(t)) return true;
    if (/\d{1,2}\s+[A-Za-z]{3,9},?\s*\d{1,2}:\d{2}/i.test(t)) return true;
    return false;
}

function parsePriceToLabel(raw?: string, currency?: string): string {
    if (!raw) return '';
    const num = Number(String(raw).replace(',', '.'));
    if (!Number.isFinite(num)) return '';
    if (num === 0) return 'Grátis';
    const suffix = (currency || '€').toUpperCase() === 'EUR' ? '€' : currency || '€';
    const formatted = Number.isInteger(num) ? `${num}` : `${num.toFixed(2)}`;
    return `${formatted}${suffix}`;
}

async function hydrateXceedDetails(events: Event[]): Promise<void> {
    const targets = events;
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

                const ldNodes = $('script[type="application/ld+json"]').toArray();
                let ldEvent: any = null;
                for (const node of ldNodes) {
                    try {
                        const raw = $(node).html() || '';
                        const parsed = JSON.parse(raw);
                        const arr = Array.isArray(parsed) ? parsed : [parsed];
                        const maybeEvent = arr.find((x: any) => {
                            const t = x?.['@type'];
                            const types = Array.isArray(t) ? t : [t];
                            return types.some((v) => typeof v === 'string' && /event/i.test(v));
                        });
                        if (maybeEvent) {
                            ldEvent = maybeEvent;
                            break;
                        }
                    } catch {
                        /* ignore */
                    }
                }

                const structuredTitle = cleanText(ldEvent?.name || $('meta[property="og:title"]').attr('content') || '');
                if (structuredTitle && (isNoisyTitle(ev.title) || ev.title.length < 4)) {
                    ev.title = structuredTitle;
                }

                if (!ev.description || ev.description === 'Ver detalhes') {
                    const desc =
                        ldEvent?.description ||
                        $('meta[name="description"], meta[property="og:description"]').attr('content') ||
                        $('[class*="description"], article p, main p')
                            .map((_, el) => $(el).text())
                            .get()
                            .join(' ') ||
                        '';
                    if (desc) ev.description = cleanText(desc).substring(0, 240);
                }

                if (!ev.image || ev.image.includes('placeholder')) {
                    const img =
                        ldEvent?.image ||
                        $('meta[property="og:image"], meta[name="twitter:image"], meta[name="og:image"]').attr('content') ||
                        $('img').first().attr('src') ||
                        '';
                    if (img) ev.image = toAbsolute(img, 'https://xceed.me');
                }

                const structuredStartDate = safeDate(ldEvent?.startDate || $('meta[itemprop="startDate"], meta[property="event:start_time"]').first().attr('content') || $('time[datetime]').first().attr('datetime') || undefined);
                if (structuredStartDate && (isSuspiciousIsoDate(ev.date) || !ev.date)) {
                    ev.date = structuredStartDate;
                }

                const structuredEndDate = safeDate(ldEvent?.endDate || $('meta[itemprop="endDate"], meta[property="event:end_time"]').first().attr('content') || undefined);
                if (structuredEndDate) {
                    ev.endDate = structuredEndDate;
                }

                const structuredLocation =
                    cleanText(ldEvent?.location?.name || (Array.isArray(ldEvent?.location) ? ldEvent.location[0]?.name : '') || '') ||
                    cleanText($('[itemprop="location"], [class*="venue"], [class*="location"]').first().text() || '');
                if (structuredLocation) {
                    ev.location = structuredLocation;
                }

                const offers = ldEvent?.offers;
                const offer = Array.isArray(offers) ? offers[0] : offers;
                const structuredPriceLabel = parsePriceToLabel(offer?.price || offer?.priceSpecification?.price, offer?.priceCurrency || offer?.priceSpecification?.priceCurrency);
                if (structuredPriceLabel) {
                    ev.price = structuredPriceLabel;
                }

                if (!ev.price || ev.price === 'Check site') {
                    const body = cleanText($('body').text());
                    const price = body.match(/(FROM\s+\d+[.,]?\d*€|\d+[.,]?\d*€|SEE EVENT|FREE|GR[AÁ]TIS)/i)?.[0] || '';
                    if (price) ev.price = price;
                }
            } catch {
                /* swallow */
            }
        }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

export async function scrapeXceed(): Promise<Event[]> {
    const candidates = [
        'https://xceed.me/en/lisboa/events',
        'https://xceed.me/en/portugal/events',
    ];

    const byUrl = new Map<string, Event>();

    // Strategy 1: HTTP pagination (?page=N)
    for (const baseUrl of candidates) {
        let emptyPages = 0;
        for (let page = 1; page <= 8; page++) {
            const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
            try {
                const { data: html } = await axios.get(url, {
                    headers: { 'User-Agent': DEFAULT_UA, 'Accept-Language': 'en-US,en;q=0.9' },
                    timeout: 15000,
                });

                const cards = extractCardsFromHtml(html);
                let inserted = 0;
                for (const c of cards) {
                    if (!c.url || byUrl.has(c.url)) continue;
                    byUrl.set(
                        c.url,
                        makeEvent({
                            title: titleFromXceedUrl(c.url),
                            source: 'Xceed',
                            url: c.url,
                            image: c.image,
                            location: c.location || 'Lisboa',
                            date: c.date && /\d{4}/.test(c.date) ? c.date : undefined,
                            price: c.price || undefined,
                        }),
                    );
                    inserted++;
                }

                if (inserted === 0) {
                    emptyPages++;
                    if (emptyPages >= 2) break;
                } else {
                    emptyPages = 0;
                }
            } catch {
                emptyPages++;
                if (emptyPages >= 2) break;
            }
        }
    }

    // Strategy 2: Playwright infinite scroll + load more button
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const url of candidates) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
                await dismissCookies(page);
                await page.waitForTimeout(1200);

                let stableRounds = 0;
                let lastCount = -1;

                for (let round = 0; round < 16 && stableRounds < 3; round++) {
                    const count = await page.evaluate(() => document.querySelectorAll('a[href*="/event/"]').length);
                    if (count <= lastCount) stableRounds++;
                    else stableRounds = 0;
                    lastCount = count;

                    const clicked = await page.evaluate(() => {
                        const labels = ['load more', 'show more', 'more events', 'see more', 'ver mais'];
                        const buttons = Array.from(document.querySelectorAll('button, a')) as Array<HTMLButtonElement | HTMLAnchorElement>;
                        const target = buttons.find((b) => {
                            const text = (b.textContent || '').toLowerCase();
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
                    const results: Array<{ title: string; url: string; image?: string; location?: string; date?: string; price?: string }> = [];
                    const seen = new Set<string>();

                    document.querySelectorAll('a[href*="/event/"]').forEach((el) => {
                        const a = el as HTMLAnchorElement;
                        if (!a.href || seen.has(a.href)) return;
                        seen.add(a.href);

                        const titleEl = a.querySelector('h1, h2, h3, h4, [class*="title"], [class*="name"]');
                        const title = (titleEl?.textContent || a.textContent || '').trim().split('\n')[0]?.trim() || '';
                        if (!title || title.length < 3) return;

                        const image = (a.querySelector('img') as HTMLImageElement | null)?.src || '';
                        const txt = (a.textContent || '').replace(/\s+/g, ' ').trim();
                        const location = txt.match(/\b(Lisbon|Lisboa|Porto|Faro|Set[úu]bal|Almada)\b/i)?.[1] || '';
                        const date = txt.match(/\b\d{1,2}\s+[A-Za-z]{3,9}\b/i)?.[0] || '';
                        const price = txt.match(/(FROM\s+\d+[.,]?\d*€|\d+[.,]?\d*€|SEE EVENT|FREE|GR[AÁ]TIS)/i)?.[0] || '';

                        results.push({ title, url: a.href, image, location, date, price });
                    });

                    return results;
                });

                for (const c of cards) {
                    if (!c.url || byUrl.has(c.url)) continue;
                    byUrl.set(
                        c.url,
                        makeEvent({
                            title: titleFromXceedUrl(c.url),
                            source: 'Xceed',
                            url: c.url,
                            image: c.image,
                            location: c.location || 'Lisboa',
                            date: c.date && /\d{4}/.test(c.date) ? c.date : undefined,
                            price: c.price || undefined,
                        }),
                    );
                }
            } catch {
                /* per-url fallback */
            }
        }
    } catch {
        /* swallow */
    } finally {
        if (browser) await browser.close();
    }

    const events = Array.from(byUrl.values());
    if (events.length > 0) {
        await hydrateXceedDetails(events);
        events.forEach((ev) => {
            if (!ev.price) ev.price = 'Check site';
        });
    }

    console.log(`[Xceed] ${events.length} events`);
    return events;
}
