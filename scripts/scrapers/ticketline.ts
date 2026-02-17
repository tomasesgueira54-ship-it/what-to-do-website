import { chromium } from 'playwright';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies, toAbsolute, cleanText, safeDate } from './utils';

const BASE = 'https://www.ticketline.pt';

function extractPrice(raw: string): string | undefined {
    const match = raw.replace(/\s+/g, ' ').match(/(\d+[.,]?\d*)\s*€?/);
    if (!match) return undefined;
    const num = match[1].replace(',', '.');
    return `${num}€`;
}

async function hydrateTicketlineDetails(events: Event[]): Promise<void> {
    const targets = events.filter(
        (e) => !e.price || !e.description || e.description === 'Ver detalhes' || !e.image || e.image.includes('placeholder'),
    );
    if (!targets.length) return;

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const ev of targets) {
            try {
                await page.goto(ev.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                await dismissCookies(page);
                await page.waitForTimeout(800);

                if (!ev.date) {
                    const startDate = await page.evaluate(() => {
                        const ld = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
                        if (ld?.textContent) {
                            try {
                                const data = JSON.parse(ld.textContent);
                                if (Array.isArray(data)) {
                                    const first = data.find((d: any) => d.startDate) as any;
                                    if (first?.startDate) return first.startDate as string;
                                }
                                if ((data as any).startDate) return (data as any).startDate as string;
                                const offer = (data as any).offers || (data as any).event || (data as any).item;
                                if (offer?.startDate) return offer.startDate as string;
                            } catch {
                                /* ignore */
                            }
                        }
                        const meta = document.querySelector('meta[itemprop="startDate"], meta[property="event:start_time"], meta[name="startDate"]') as HTMLMetaElement | null;
                        return meta?.content || '';
                    });
                    const normalized = safeDate(startDate || undefined);
                    if (normalized) ev.date = normalized;
                }

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
                /* per-item */
            }
        }
    } catch {
        /* swallow */
    } finally {
        if (browser) await browser.close();
    }
}

export async function scrapeTicketline(): Promise<Event[]> {
    // Playwright-only to avoid intermittent HTTP parse errors
    const events: Event[] = [];
    const seenUrls = new Set<string>();

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });
        await page.goto('https://www.ticketline.pt/', { waitUntil: 'networkidle', timeout: 25000 });
        await dismissCookies(page);
        await page.waitForTimeout(1000);

        const cards = await page.evaluate(() => {
            const seen = new Set<string>();
            return Array.from(document.querySelectorAll('a[href*="/evento/"]'))
                .map((el) => {
                    const a = el as HTMLAnchorElement;
                    if (seen.has(a.href)) return null;
                    seen.add(a.href);
                    const img = a.querySelector('img') as HTMLImageElement | null;
                    return {
                        href: a.href,
                        imgSrc: img?.src || '',
                        imgAlt: img?.alt || '',
                        text: (a.querySelector('h2, h3, h4, span') as HTMLElement)?.innerText?.trim() || '',
                    };
                })
                .filter(Boolean);
        });

        await browser.close();

        const mapped = (cards.filter(Boolean) as any[])
            .slice(0, 30)
            .map((c: any) => {
                const title = c.text || c.imgAlt || titleFromSlug(c.href);
                return makeEvent({
                    title: title || 'Evento Ticketline',
                    url: c.href,
                    image: toAbsolute(c.imgSrc, BASE),
                    source: 'Ticketline',
                    location: 'Portugal',
                    description: c.text || c.imgAlt || title,
                });
            })
            .filter((e: Event) => e.title.length > 3 && !e.title.startsWith('<'));

        await hydrateTicketlineDetails(mapped);

        console.log('[Ticketline] ' + mapped.length + ' events (Playwright)');
        return mapped;
    } catch (err: any) {
        console.error('[Ticketline] ' + err.message);
        if (browser) await browser.close();
        return [];
    }
}
