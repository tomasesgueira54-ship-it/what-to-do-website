import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';
import { DEFAULT_UA, makeEvent, titleFromSlug, dismissCookies, toAbsolute, cleanText, safeDate, extractPriceFromHtml } from './utils';

const BASE = 'https://www.bol.pt';
const BOL_FALLBACK_IMAGE = '/images/placeholder-card.svg';

function isBOLJunk(url: string, title: string): boolean {
    const u = url.toLowerCase();
    const t = title.toLowerCase();
    return (
        u.includes('pesquisa') ||
        u.includes('listagemclassificacoes') ||
        t === 'pesquisar' ||
        t === 'avançada'
    );
}

function extractPrice(raw: string): string | undefined {
    const text = (raw || '').replace(/\s+/g, ' ').trim();
    if (!text) return undefined;

    if (/(gratuit|grátis|gratis|free)/i.test(text)) return 'Grátis';

    const currencyMatch = text.match(/(?:€|eur)\s*(\d{1,4}(?:[.,]\d{1,2})?)|(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|eur)/i);
    const value = currencyMatch?.[1] || currencyMatch?.[2];
    if (value) {
        const num = Number.parseFloat(value.replace(',', '.'));
        if (Number.isFinite(num) && num >= 0 && num <= 10000 && num < 9000) {
            const normalized = Number.isInteger(num) ? `${num}` : num.toFixed(2);
            return `${normalized}€`;
        }
    }

    const contextual = text.match(/(?:preço|price|bilhete|ticket|desde|a partir de)\D{0,20}(\d{1,4}(?:[.,]\d{1,2})?)/i);
    if (contextual) {
        const num = Number.parseFloat(contextual[1].replace(',', '.'));
        if (Number.isFinite(num) && num >= 0 && num <= 10000 && num < 9000) {
            const normalized = Number.isInteger(num) ? `${num}` : num.toFixed(2);
            return `${normalized}€`;
        }
    }

    return undefined;
}

function extractSubtitleFromBlock(text: string, title: string): string | undefined {
    const lines = (text || '')
        .split(/\n+/)
        .map((line) => cleanText(line))
        .filter(Boolean);

    const normalizedTitle = cleanText(title).toLowerCase();
    const subtitle = lines.find((line) => {
        const value = line.toLowerCase();
        return value !== normalizedTitle && value.length >= 12;
    });

    return subtitle ? subtitle.substring(0, 180) : undefined;
}

async function hydrateBOLDetails(events: Event[]): Promise<void> {
    const targets = events.filter(
        (e) => !e.subtitle || !e.price || !e.description || e.description === 'Ver detalhes' || !e.image || e.image.includes('placeholder'),
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
                        $('meta[property="product:price:amount"]').attr('content') ||
                        $('[class*="preco"], [class*="preço"], [class*="price"], .info-preco, .precos, [itemprop="price"]')
                            .first()
                            .text() ||
                        '';
                    let price = extractPrice(priceText);

                    if (!price) {
                        const detailedPriceText =
                            $('#EventDescription, .event-description, .descricao-evento, .descricao, article, [class*="descricao"]')
                                .first()
                                .text() ||
                            '';

                        price = extractPrice(detailedPriceText);

                        if (!price) {
                            const htmlPrice = extractPriceFromHtml($.html());
                            if (htmlPrice) price = htmlPrice;
                        }
                    }

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

                if (!ev.subtitle) {
                    const subtitle =
                        $('.subtitulo, .subtitulo-evento, .subtitle, .event-subtitle, [class*="subtitulo"], [class*="subtitle"]').first().text() ||
                        $('h1').first().nextAll('h2, p, div').first().text() ||
                        '';

                    const fallback = subtitle || extractSubtitleFromBlock($('body').text(), ev.title) || '';
                    const cleaned = cleanText(fallback);
                    if (cleaned && cleaned.toLowerCase() !== ev.title.toLowerCase()) {
                        ev.subtitle = cleaned.substring(0, 180);
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
                /* ignore */
            }
        }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    const stillMissing = targets.filter((e) => !e.image || e.image.includes('placeholder'));
    if (!stillMissing.length) return;

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const ev of stillMissing) {
            try {
                await page.goto(ev.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                await dismissCookies(page);
                await page.waitForTimeout(800);
                // Small scroll to trigger lazy images
                for (let i = 0; i < 3; i++) {
                    await page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));
                    await page.waitForTimeout(400);
                }

                const img = await page.evaluate(() => {
                    const take = (v?: string | null) => (v && v.trim() ? v.trim() : '');
                    const metas = Array.from(
                        document.querySelectorAll('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"], meta[itemprop="image"]'),
                    ) as HTMLMetaElement[];
                    const metaImg = metas.map((m) => take(m.content)).find(Boolean);

                    const imgs = Array.from(document.images) as HTMLImageElement[];
                    const imgSrc = imgs
                        .map((i) => take(i.currentSrc || i.src || i.getAttribute('data-src') || i.getAttribute('data-lazy')))
                        .find(Boolean);

                    const linkImage = take((document.querySelector('link[rel="image_src"]') as HTMLLinkElement | null)?.href);

                    const bgImg = Array.from(document.querySelectorAll<HTMLElement>('*'))
                        .map((el) => getComputedStyle(el).backgroundImage || '')
                        .map((bg) => bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''))
                        .find((v) => v && v !== 'none');

                    return metaImg || imgSrc || linkImage || bgImg || '';
                });

                if (img) {
                    ev.image = toAbsolute(img, new URL(ev.url).origin);
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

    targets.forEach((ev) => {
        if (!ev.price) ev.price = 'Check site';
        if (!ev.image || ev.image.includes('placeholder')) ev.image = BOL_FALLBACK_IMAGE;
    });
}

export async function scrapeBOL(): Promise<Event[]> {
    // ── Strategy 1: HTTP + Cheerio ──
    for (const pageUrl of ['https://www.bol.pt/', 'https://www.bol.pt/Comprar/Bilhetes']) {
        try {
            const { data: html } = await axios.get(pageUrl, {
                headers: { 'User-Agent': DEFAULT_UA },
                timeout: 15000,
            });
            const $ = cheerio.load(html);
            const events: Event[] = [];
            const seen = new Set<string>();

            $(
                'a[href*="EventId"], a[href*="/comprar/"], a[href*="/Comprar/"], a[href*="/evento/"], a[href*="/bilhetes/"]',
            ).each((_, el) => {
                let href = toAbsolute($(el).attr('href') || '', BASE);
                if (href.includes('javascript:')) return;
                if (seen.has(href)) return;
                seen.add(href);

                const title =
                    $(el).find('h2, h3, h4, .title, .name, span').first().text().trim() ||
                    $(el).text().trim().split('\n')[0].trim();
                const img = toAbsolute($(el).find('img').first().attr('src') || '', BASE);
                const subtitle = extractSubtitleFromBlock($(el).text(), title);

                if (title && title.length > 2 && !isBOLJunk(href, title)) {
                    const event = makeEvent({
                        title: title || titleFromSlug(href),
                        url: href,
                        image: img,
                        source: 'BOL',
                        location: 'Portugal',
                        description: title,
                    });
                    if (subtitle) event.subtitle = subtitle;
                    events.push(event);
                }
            });

            // Also try general card patterns
            if (events.length === 0) {
                $('article, .card, .destaque, .produto, .event, .espetaculo').each((_, el) => {
                    const $el = $(el);
                    const link = $el.find('a').first().attr('href') || '';
                    if (!link) return;
                    const fullUrl = toAbsolute(link, BASE);
                    if (seen.has(fullUrl)) return;
                    seen.add(fullUrl);

                    const title = $el.find('h2, h3, h4, .title').first().text().trim();
                    const img = toAbsolute($el.find('img').first().attr('src') || '', BASE);
                    const subtitle = extractSubtitleFromBlock($el.text(), title);
                    if (title && !isBOLJunk(fullUrl, title)) {
                        const event = makeEvent({
                            title,
                            url: fullUrl,
                            image: img,
                            source: 'BOL',
                            location: 'Portugal',
                            description: title,
                        });
                        if (subtitle) event.subtitle = subtitle;
                        events.push(event);
                    }
                });
            }

            if (events.length > 0) {
                await hydrateBOLDetails(events);
                console.log('[BOL] ' + events.length + ' events from ' + pageUrl + ' (HTTP)');
                return events;
            }
        } catch (err: any) {
            console.warn('[BOL] HTTP ' + pageUrl + ': ' + (err.message || '').substring(0, 60));
        }
    }

    // ── Strategy 2: Playwright ──
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ userAgent: DEFAULT_UA });

        for (const url of ['https://www.bol.pt/', 'https://www.bol.pt/Comprar/Bilhetes']) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
                await dismissCookies(page);
                await page.waitForTimeout(2000);

                const cards = await page.evaluate(() => {
                    const results: { title: string; subtitle?: string; url: string; img: string }[] = [];
                    const seen = new Set<string>();

                    document
                        .querySelectorAll(
                            'a[href*="EventId"], a[href*="/comprar/"], a[href*="/Comprar/"], a[href*="/evento/"], .event a, .produto a, article a, .card a, .destaque a',
                        )
                        .forEach((el) => {
                            const a = (el.tagName === 'A' ? el : el.querySelector('a')) as HTMLAnchorElement;
                            if (!a || !a.href || a.href.includes('javascript:') || seen.has(a.href)) return;
                            seen.add(a.href);
                            const title =
                                (el.querySelector('h2, h3, h4, .title, .name') || el).textContent
                                    ?.trim()
                                    .split('\n')[0]
                                    ?.trim() || '';
                            const subtitle = (el.textContent || '')
                                .split(/\n+/)
                                .map((line) => line.trim())
                                .find((line) => line && line.length >= 12 && line.toLowerCase() !== title.toLowerCase()) || '';
                            const img = (el.querySelector('img') as HTMLImageElement)?.src || '';
                            if (title.length > 2 && !isBOLJunk(a.href, title)) results.push({ title, subtitle, url: a.href, img });
                        });
                    return results;
                });

                if (cards.length > 0) {
                    await browser.close();
                    const events = cards.slice(0, 30).map((c) => {
                        const event = makeEvent({
                            title: c.title,
                            url: c.url,
                            image: c.img,
                            source: 'BOL',
                            location: 'Portugal',
                            description: c.title,
                        });
                        if (c.subtitle) event.subtitle = cleanText(c.subtitle).substring(0, 180);
                        return event;
                    });
                    await hydrateBOLDetails(events);
                    console.log('[BOL] ' + events.length + ' events from ' + url + ' (Playwright)');
                    return events;
                }
            } catch {
                /* try next URL */
            }
        }

        await browser.close();
        return [];
    } catch (err: any) {
        console.error('[BOL] ' + err.message);
        if (browser) await browser.close();
        return [];
    }
}
