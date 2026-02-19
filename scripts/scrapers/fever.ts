import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies } from './utils';

function isSuspiciousIsoDate(value?: string): boolean {
    if (!value) return true;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return true;
    const year = d.getUTCFullYear();
    const nowYear = new Date().getUTCFullYear();
    return year < nowYear - 1 || year > nowYear + 3;
}

function priceLabel(raw?: string, currency?: string): string {
    if (!raw) return '';
    const num = Number(String(raw).replace(',', '.'));
    if (!Number.isFinite(num)) return '';
    if (num === 0) return 'Grátis';
    const suffix = (currency || '€').toUpperCase() === 'EUR' ? '€' : currency || '€';
    const formatted = Number.isInteger(num) ? `${num}` : `${num.toFixed(2)}`;
    return `${formatted}${suffix}`;
}

function pickBestPriceFromOffers(offers: any): string {
    const list = Array.isArray(offers) ? offers : offers ? [offers] : [];
    const values: number[] = [];
    const currencies: string[] = [];

    for (const offer of list) {
        const raw = offer?.price ?? offer?.priceSpecification?.price;
        const currency = offer?.priceCurrency ?? offer?.priceSpecification?.priceCurrency ?? 'EUR';
        const num = Number(String(raw ?? '').replace(',', '.'));
        if (Number.isFinite(num) && num >= 0) {
            values.push(num);
            currencies.push(String(currency));
        }
    }

    if (!values.length) return '';

    const positives = values.filter((v) => v > 0);
    if (positives.length > 0) {
        const min = Math.min(...positives);
        const idx = values.indexOf(min);
        return priceLabel(String(min), currencies[idx] || 'EUR');
    }

    return 'Grátis';
}

function pickPriceFromText(text: string): string {
    const values: number[] = [];
    const re = /(?:€|eur)\s*(\d{1,4}(?:[.,]\d{1,2})?)|(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|eur)/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const raw = m[1] || m[2];
        const num = Number(String(raw).replace(',', '.'));
        if (Number.isFinite(num) && num >= 0 && num < 10000) values.push(num);
    }

    if (!values.length) return '';
    const positives = values.filter((v) => v > 0);
    if (positives.length > 0) return priceLabel(String(Math.min(...positives)), 'EUR');
    return 'Grátis';
}

async function hydrateFeverDetails(events: Event[]): Promise<void> {
    if (!events.length) return;
    const targets = events.filter(
        (ev) =>
            !ev.description ||
            ev.description === 'Ver detalhes' ||
            !ev.image ||
            ev.image.includes('placeholder') ||
            !ev.price ||
            ev.price === 'Check site' ||
            isSuspiciousIsoDate(ev.date),
    );

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
                            return types.some((v) => typeof v === 'string' && /event|thing|product/i.test(v));
                        });
                        if (maybeEvent) {
                            ldEvent = maybeEvent;
                            break;
                        }
                    } catch {
                        /* ignore */
                    }
                }

                const structuredTitle =
                    String(ldEvent?.name || '').trim() ||
                    String($('meta[property="og:title"], meta[name="twitter:title"]').first().attr('content') || '').trim();
                if (structuredTitle && structuredTitle.length > 3 && structuredTitle.length < 140) {
                    ev.title = structuredTitle;
                }

                if (!ev.description || ev.description === 'Ver detalhes') {
                    const desc =
                        String(ldEvent?.description || '').trim() ||
                        String($('meta[name="description"], meta[property="og:description"]').first().attr('content') || '').trim();
                    if (desc) ev.description = desc.replace(/\s+/g, ' ').trim().substring(0, 240);
                }

                if (!ev.image || ev.image.includes('placeholder')) {
                    const image =
                        String(ldEvent?.image || '').trim() ||
                        String($('meta[property="og:image"], meta[name="twitter:image"]').first().attr('content') || '').trim();
                    if (image) ev.image = image;
                }

                const startDate = ldEvent?.startDate || $('meta[itemprop="startDate"], time[datetime]').first().attr('content') || $('time[datetime]').first().attr('datetime') || '';
                if (startDate && isSuspiciousIsoDate(ev.date)) {
                    const normalized = new Date(startDate);
                    if (!Number.isNaN(normalized.getTime())) ev.date = normalized.toISOString();
                }

                if (!ev.endDate) {
                    const endDateRaw = ldEvent?.endDate || $('meta[itemprop="endDate"], meta[property="event:end_time"]').first().attr('content') || '';
                    if (endDateRaw) {
                        const normalizedEnd = new Date(endDateRaw);
                        if (!Number.isNaN(normalizedEnd.getTime())) ev.endDate = normalizedEnd.toISOString();
                    }
                }

                const structuredPrice = pickBestPriceFromOffers(ldEvent?.offers);
                if (structuredPrice) {
                    ev.price = structuredPrice;
                } else if (!ev.price || ev.price === 'Check site' || ev.price === '0€') {
                    const fallbackTextPrice = pickPriceFromText($('body').text() || '');
                    if (fallbackTextPrice) ev.price = fallbackTextPrice;
                }
            } catch {
                /* swallow */
            }
        }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

function deepFindArrays(obj: any, keys: string[], depth: number = 0): any[] {
    if (!obj || typeof obj !== 'object' || depth > 8) return [];
    let results: any[] = [];
    for (const key of keys) {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
            results.push(...obj[key]);
        }
    }
    for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'object') {
            results.push(...deepFindArrays(obj[k], keys, depth + 1));
        }
    }
    return results;
}

export async function scrapeFever(): Promise<Event[]> {
    const feverPages = [
        'https://feverup.com/pt/lisboa',
        'https://feverup.com/en/lisbon',
    ];
    const byUrl = new Map<string, Event>();

    // ── Strategy 1: HTTP fetch + parse embedded data ──
    for (const baseUrl of feverPages) {
        const pageUrls = [baseUrl, `${baseUrl}?page=2`, `${baseUrl}?page=3`, `${baseUrl}?page=4`];
        for (const url of pageUrls) {
            try {
                const { data: html } = await axios.get(url, {
                    headers: {
                        'User-Agent': DEFAULT_UA,
                        'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8',
                    },
                    timeout: 15000,
                });
                const events: Event[] = [];
                const $ = cheerio.load(html);

                // Try __NEXT_DATA__
                const ndScript = $('script#__NEXT_DATA__').html();
                if (ndScript) {
                    try {
                        const data = JSON.parse(ndScript);
                        const items = deepFindArrays(data, ['plans', 'experiences', 'items', 'events', 'results']);
                        for (const item of items) {
                            const name = item.name || item.title || '';
                            const itemUrl =
                                item.url ||
                                item.web_url ||
                                item.link ||
                                (item.slug ? 'https://feverup.com/pt/lisboa/plans/' + item.slug : '');
                            if (name && itemUrl) {
                                events.push(
                                    makeEvent({
                                        title: name,
                                        description: item.description || item.summary || item.subtitle,
                                        date: item.date || item.start_date || item.startDate,
                                        endDate: item.end_date || item.endDate || item.end_datetime,
                                        location: (item.venue && item.venue.name) || item.location || item.city_name || 'Lisboa',
                                        image: item.image_url || item.cover_image_url || item.image || item.thumbnail,
                                        source: 'Fever',
                                        url: itemUrl,
                                        price: item.price != null && Number(item.price) > 0 ? item.price + '\u20ac' : undefined,
                                    }),
                                );
                            }
                        }
                    } catch {
                        /* __NEXT_DATA__ parse error */
                    }
                }

                // Try plan/experience links from HTML
                if (events.length === 0) {
                    const seen = new Set<string>();
                    $('a[href*="/plans/"], a[href*="/experiences/"], a[href*="/events/"]').each((_, el) => {
                        const href = $(el).attr('href') || '';
                        if (!href || seen.has(href)) return;
                        if (href.includes('/login') || href.includes('/signup')) return;
                        seen.add(href);
                        const fullUrl = href.startsWith('http') ? href : 'https://feverup.com' + href;
                        const title =
                            $(el).find('h2, h3, h4, [class*="title"]').first().text().trim() ||
                            $(el).text().trim().split('\n')[0].trim();
                        events.push(
                            makeEvent({
                                title: title || titleFromSlug(fullUrl),
                                source: 'Fever',
                                url: fullUrl,
                            }),
                        );
                    });
                }

                // Try JSON-LD
                if (events.length === 0) {
                    $('script[type="application/ld+json"]').each((_, el) => {
                        try {
                            const ld = JSON.parse($(el).html() || '');
                            const items = Array.isArray(ld) ? ld : [ld];
                            for (const item of items) {
                                if (item['@type'] === 'Event' || item['@type'] === 'MusicEvent') {
                                    events.push(
                                        makeEvent({
                                            title: item.name,
                                            description: item.description,
                                            date: item.startDate,
                                            endDate: item.endDate,
                                            location: (item.location && item.location.name) || '',
                                            image: item.image,
                                            source: 'Fever',
                                            url: item.url || url,
                                        }),
                                    );
                                }
                            }
                        } catch {
                            /* ld+json parse error */
                        }
                    });
                }

                if (events.length > 0) {
                    events.forEach((ev) => {
                        if (!ev.price || ev.price === '0€') ev.price = 'Check site';
                        if (ev.url && !byUrl.has(ev.url)) byUrl.set(ev.url, ev);
                    });
                    console.log('[Fever] ' + events.length + ' events from ' + url + ' (HTTP)');
                }
            } catch (err: any) {
                console.warn('[Fever] HTTP ' + url + ': ' + (err.message || '').substring(0, 50));
            }
        }
    }

    if (byUrl.size > 0) {
        const events = Array.from(byUrl.values());
        await hydrateFeverDetails(events);
        return events;
    }

    // ── Strategy 2: Playwright with API interception + DOM extraction ──
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ userAgent: DEFAULT_UA });
        const page = await context.newPage();

        const apiEvents: any[] = [];
        page.on('response', async (resp: any) => {
            try {
                const ct = resp.headers()['content-type'] || '';
                const rurl = resp.url();
                if (
                    ct.includes('json') &&
                    (rurl.includes('/plans') ||
                        rurl.includes('/events') ||
                        rurl.includes('/experiences') ||
                        rurl.includes('/search') ||
                        rurl.includes('/catalog') ||
                        rurl.includes('/discover'))
                ) {
                    const json = await resp.json();
                    const items = Array.isArray(json)
                        ? json
                        : json.data || json.results || json.plans || json.items || json.events || [];
                    if (Array.isArray(items)) apiEvents.push(...items);
                }
            } catch {
                /* swallow */
            }
        });

        for (const url of feverPages) {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 35000 });
            await dismissCookies(page);

            let stableRounds = 0;
            let lastCount = -1;
            for (let i = 0; i < 16 && stableRounds < 3; i++) {
                const count = await page.evaluate(() => document.querySelectorAll('a[href*="/plans/"], a[href*="/experiences/"], a[href*="/events/"]').length);
                if (count <= lastCount) stableRounds++;
                else stableRounds = 0;
                lastCount = count;

                await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
                await page.waitForTimeout(850);
            }
        }

        // DOM extraction with broad selectors
        const domLinks = await page.evaluate(() => {
            const results: { title: string; url: string; image: string }[] = [];
            const sels = [
                'a[href*="/plans/"]',
                'a[href*="/experiences/"]',
                'a[href*="/events/"]',
                '[class*="plan"] a',
                '[class*="experience"] a',
                '[class*="event-card"] a',
                '[class*="Plan"] a',
                '[class*="Experience"] a',
            ];
            const seen = new Set<string>();
            for (const sel of sels) {
                document.querySelectorAll(sel).forEach((el) => {
                    const a = (el.tagName === 'A' ? el : el.querySelector('a')) as HTMLAnchorElement;
                    if (!a || !a.href || seen.has(a.href)) return;
                    if (a.href.includes('/login') || a.href.includes('/signup')) return;
                    seen.add(a.href);
                    const titleEl = el.querySelector('h2, h3, h4, [class*="title"], [class*="name"]');
                    const title = (titleEl || el).textContent?.trim().split('\n')[0]?.trim() || '';
                    const img = (el.querySelector('img') as HTMLImageElement)?.src || '';
                    if (title.length > 2) results.push({ title, url: a.href, image: img });
                });
            }
            return results;
        });

        await browser.close();

        const allFound: Event[] = [];
        const seenUrls = new Set<string>();

        // API results
        for (const item of apiEvents) {
            const name = item.name || item.title || '';
            const itemUrl = item.url || item.web_url || '';
            if (name && itemUrl && !seenUrls.has(itemUrl)) {
                seenUrls.add(itemUrl);
                allFound.push(
                    makeEvent({
                        title: name,
                        description: item.description || item.summary,
                        date: item.date || item.start_date || item.startDate,
                        endDate: item.end_date || item.endDate || item.end_datetime,
                        location: (item.venue && item.venue.name) || item.location || 'Lisboa',
                        image: item.image_url || item.cover_image_url || item.image,
                        source: 'Fever',
                        url: itemUrl,
                        price: item.price != null && Number(item.price) > 0 ? item.price + '\u20ac' : undefined,
                    }),
                );
            }
        }

        // DOM results
        for (const d of domLinks) {
            if (!seenUrls.has(d.url)) {
                seenUrls.add(d.url);
                allFound.push(makeEvent({ title: d.title, source: 'Fever', url: d.url, image: d.image }));
            }
        }

        allFound.forEach((ev) => {
            if (!ev.price || ev.price === '0€') ev.price = 'Check site';
        });

        await hydrateFeverDetails(allFound);

        console.log(
            '[Fever] ' +
            allFound.length +
            ' events (Playwright: ' +
            apiEvents.length +
            ' API + ' +
            domLinks.length +
            ' DOM)',
        );
        return allFound;
    } catch (err: any) {
        console.error('[Fever] Playwright: ' + (err.message || '').substring(0, 60));
        if (browser) await browser.close();
    }

    console.warn('[Fever] All strategies failed');
    return [];
}

