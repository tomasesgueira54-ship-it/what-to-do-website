import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies } from './utils';

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
        'https://feverup.com/pt/lisboa/explore',
        'https://feverup.com/en/lisbon',
    ];

    // ── Strategy 1: HTTP fetch + parse embedded data ──
    for (const url of feverPages) {
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
                    for (const item of items.slice(0, 50)) {
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
                                    location: (item.venue && item.venue.name) || item.location || item.city_name || 'Lisboa',
                                    image: item.image_url || item.cover_image_url || item.image || item.thumbnail,
                                    source: 'Fever',
                                    url: itemUrl,
                                    price: item.price != null ? item.price + '\u20ac' : undefined,
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
                    if (!ev.price) ev.price = 'Check site';
                });
                console.log('[Fever] ' + events.length + ' events from ' + url + ' (HTTP)');
                return events;
            }
        } catch (err: any) {
            console.warn('[Fever] HTTP ' + url + ': ' + (err.message || '').substring(0, 50));
        }
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

        await page.goto('https://feverup.com/pt/lisboa', { waitUntil: 'networkidle', timeout: 35000 });
        await dismissCookies(page);

        // Scroll to trigger lazy loading
        for (let i = 0; i < 8; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(800);
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
                        location: (item.venue && item.venue.name) || item.location || 'Lisboa',
                        image: item.image_url || item.cover_image_url || item.image,
                        source: 'Fever',
                        url: itemUrl,
                        price: item.price != null ? item.price + '\u20ac' : undefined,
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
            if (!ev.price) ev.price = 'Check site';
        });

        console.log(
            '[Fever] ' +
            allFound.length +
            ' events (Playwright: ' +
            apiEvents.length +
            ' API + ' +
            domLinks.length +
            ' DOM)',
        );
        return allFound.slice(0, 50);
    } catch (err: any) {
        console.error('[Fever] Playwright: ' + (err.message || '').substring(0, 60));
        if (browser) await browser.close();
    }

    console.warn('[Fever] All strategies failed');
    return [];
}

