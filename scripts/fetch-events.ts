import {
    scrapeAgendaLX,
    scrapeFever,
    scrapeShotgun,
    scrapeXceed,
    scrapeTicketline,
    scrapeEventbrite,
    scrapeMeetup,
    scrapeBlueticket,
    scrapeBOL,
} from './scrapers';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from './types';
import { toAbsolute, cleanText, safeDate, extractPriceFromHtml, applyDefaultDuration } from './scrapers/utils';

function sanitizeText(value: string): string {
    return (value || '')
        .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
        .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
        .replace(/<[^>]*>/g, '') // strip HTML tags that occasionally slip through (e.g. Ticketline banners)
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeTitle(value: string): string {
    return sanitizeText(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function normalizeUrl(url: string): string {
    if (!url) return '';
    try {
        const u = new URL(url.trim());
        const trackingParams = [
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_term',
            'utm_content',
            'fbclid',
            'gclid',
            'mc_cid',
            'mc_eid',
        ];

        trackingParams.forEach((param) => u.searchParams.delete(param));
        u.hash = '';

        const host = u.hostname.replace(/^www\./, '');
        const pathname = u.pathname.replace(/\/+/g, '/').replace(/\/$/, '');
        const search = u.searchParams.toString();

        return `${host}${pathname}${search ? `?${search}` : ''}`.toLowerCase();
    } catch {
        return url.trim().toLowerCase();
    }
}

function isValidEvent(ev: Event): boolean {
    return Boolean(ev.title && ev.date && ev.url && !ev.url.includes('/login'));
}

function normalizeUrlKey(url: string): string {
    try {
        const u = new URL(url.trim());
        return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}`.toLowerCase();
    } catch {
        return url.trim().toLowerCase();
    }
}

function normalizeLocationKey(location?: string): string {
    return sanitizeText(location || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function isGenericLocation(location?: string): boolean {
    const key = normalizeLocationKey(location);
    if (!key) return true;
    return new Set([
        'lisboa',
        'lisbon',
        'portugal',
        'online',
        'unknown',
        'verificar descricao',
        'see description',
    ]).has(key);
}

const PT_MONTHS: Record<string, number> = {
    janeiro: 0,
    fevereiro: 1,
    'março': 2,
    marco: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
};

export function parsePtDate(text: string): string {
    const match = text
        .toLowerCase()
        .match(/(\d{1,2})\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+(\d{4})/);
    if (!match) return '';
    const day = parseInt(match[1], 10);
    const month = PT_MONTHS[match[2]] ?? 0;
    const year = parseInt(match[3], 10);
    const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
    return d.toISOString();
}

function parsePtDateWithOptionalTime(text: string): string {
    const raw = String(text || '');
    if (!raw) return '';

    const dateMatch = raw
        .toLowerCase()
        .match(/(\d{1,2})\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+(\d{4})/);

    if (!dateMatch) return '';

    const day = parseInt(dateMatch[1], 10);
    const month = PT_MONTHS[dateMatch[2]] ?? 0;
    const year = parseInt(dateMatch[3], 10);

    const timeWindow = raw.slice(Math.max(0, dateMatch.index ?? 0), (dateMatch.index ?? 0) + 120);
    const timeMatch = timeWindow.match(/(?:às|as)?\s*(\d{1,2})(?:[:h](\d{2}))?/i);
    const hour = timeMatch ? Math.min(23, Math.max(0, parseInt(timeMatch[1], 10))) : 12;
    const minute = timeMatch && timeMatch[2] ? Math.min(59, Math.max(0, parseInt(timeMatch[2], 10))) : 0;

    return new Date(Date.UTC(year, month, day, hour, minute, 0)).toISOString();
}

function parseJsonLdBlocks($: cheerio.CheerioAPI): any[] {
    const nodes = $('script[type="application/ld+json"]').toArray();
    const out: any[] = [];

    for (const node of nodes) {
        try {
            const raw = $(node).html() || '';
            const parsed = JSON.parse(raw);
            const arr = Array.isArray(parsed) ? parsed : [parsed];
            out.push(...arr);
        } catch {
            /* ignore malformed json-ld */
        }
    }

    return out;
}

function normalizeSingleLine(value?: string): string {
    return sanitizeText(value || '').substring(0, 240);
}

function normalizeLocation(value?: string): string {
    const text = sanitizeText(value || '');
    if (!text) return '';
    return text
        .replace(/\s+-\s+google maps$/i, '')
        .replace(/^local\s*:\s*/i, '')
        .replace(/^venue\s*:\s*/i, '')
        .trim();
}

function sourceSpecificSubtitle($: cheerio.CheerioAPI, eventUrl: string, title?: string): string {
    const host = (() => {
        try {
            return new URL(eventUrl).hostname.toLowerCase();
        } catch {
            return '';
        }
    })();

    const normalizedTitle = normalizeSingleLine(title || '').toLowerCase();
    const unique = (value?: string) => {
        const cleaned = normalizeSingleLine(value || '');
        if (!cleaned) return '';
        if (cleaned.toLowerCase() === normalizedTitle) return '';
        if (isWeakSubtitle(cleaned)) return '';
        return cleaned;
    };

    if (host.includes('bol.pt')) {
        return (
            unique(
                $('.subtitulo, .subtitulo-evento, .subtitle, .event-subtitle, [class*="subtitulo"], [class*="subtitle"]').first().text(),
            ) ||
            unique(
                $('[itemprop="description"], .descricao-evento, #EventDescription, .event-description')
                    .first()
                    .text()
                    .split(/[.!?\n]/)[0],
            ) ||
            ''
        );
    }

    if (host.includes('eventbrite.')) {
        return (
            unique(
                $('[data-testid="event-summary"], [data-testid="event-details"], [class*="event-summary"], [class*="summary"]').first().text(),
            ) ||
            unique($('h1').first().nextAll('p, h2, div').first().text()) ||
            unique($('[data-testid*="event-card-subtitle"], [class*="subtitle"]').first().text()) ||
            ''
        );
    }

    if (host.includes('meetup.com')) {
        return (
            unique(
                $('[data-testid*="event-group"], [data-event-label*="group"], [class*="eventTimeDisplay"], [class*="eventTime"]')
                    .first()
                    .text(),
            ) ||
            unique($('h1').first().nextAll('div, p, h2').first().text()) ||
            unique($('.eventInfo [class*="text"], [class*="venue"], [class*="location"]').first().text()) ||
            ''
        );
    }

    return '';
}

function isWeakSubtitle(value?: string): boolean {
    const text = normalizeSingleLine(value || '').toLowerCase();
    if (!text) return true;
    return [
        'good to know',
        'é bom saber',
        'details',
        'detalhes',
        'learn more',
        'saber mais',
        'more info',
        'informação',
        'informacoes',
        'informações',
        'speakers',
        'speaker',
        'oradores',
        'orador',
    ].includes(text);
}

function deriveSubtitleFromDescription(description?: string, title?: string, location?: string, date?: string): string {
    const normalizedTitle = normalizeSingleLine(title || '').toLowerCase();
    const parts = normalizeSingleLine(description || '')
        .split(/[.!?]\s+/)
        .map((p) => p.trim())
        .filter(Boolean);

    const candidate = parts.find((part) => {
        const value = part.toLowerCase();
        if (value === normalizedTitle) return false;
        if (value.length < 12) return false;
        if (isWeakSubtitle(value)) return false;
        return true;
    });

    if (candidate) return candidate.substring(0, 180);

    const locationText = normalizeSingleLine(location || '');
    const dateText = (() => {
        const normalized = safeDate(date);
        if (!normalized) return '';
        return normalized.substring(0, 10);
    })();

    if (locationText && dateText) return `${locationText} • ${dateText}`.substring(0, 180);
    if (locationText && locationText.toLowerCase() !== normalizedTitle) return locationText.substring(0, 180);

    return '';
}

function extractAddressFromLd(ld: any): string {
    const location = ld?.location;
    const address = Array.isArray(location)
        ? location[0]?.address
        : location?.address || ld?.address;

    if (!address) return '';

    if (typeof address === 'string') return normalizeSingleLine(address);

    const parts = [
        address.streetAddress,
        address.addressLocality,
        address.addressRegion,
        address.postalCode,
        address.addressCountry,
    ]
        .map((p) => sanitizeText(p || ''))
        .filter(Boolean);

    return normalizeSingleLine(parts.join(', '));
}

function extractDetailsFromHtml(html: string, eventUrl: string): {
    title?: string;
    subtitle?: string;
    description?: string;
    date?: string;
    endDate?: string;
    location?: string;
    address?: string;
    image?: string;
    price?: string;
} {
    const $ = cheerio.load(html);
    const ldBlocks = parseJsonLdBlocks($);

    const primaryLd = ldBlocks.find((item: any) => {
        const t = item?.['@type'];
        const types = Array.isArray(t) ? t : [t];
        return types.some((x) => typeof x === 'string' && /event/i.test(x));
    }) || ldBlocks[0];

    const title =
        normalizeSingleLine(primaryLd?.name) ||
        normalizeSingleLine($('meta[property="og:title"], meta[name="og:title"], meta[name="twitter:title"]').first().attr('content')) ||
        normalizeSingleLine($('h1').first().text());

    const sourceSubtitle = sourceSpecificSubtitle($, eventUrl, title);

    const subtitle =
        normalizeSingleLine(
            $('h2, .subtitle, .sub-title, [class*="subtitle"], [class*="subheading"], [class*="sub-header"]').first().text(),
        ) ||
        sourceSubtitle ||
        normalizeSingleLine(primaryLd?.alternateName) ||
        undefined;

    const ldDescription = normalizeSingleLine(primaryLd?.description);
    const metaDescription = normalizeSingleLine($('meta[name="description"], meta[property="og:description"]').first().attr('content'));
    const paragraphDescription = normalizeSingleLine(
        $('article p, main p, [class*="description"] p, [itemprop="description"] p')
            .slice(0, 4)
            .map((_, el) => $(el).text())
            .get()
            .join(' '),
    );

    let description = ldDescription || metaDescription || paragraphDescription;
    if (description && paragraphDescription && description.length < 80 && paragraphDescription.length > description.length + 20) {
        description = paragraphDescription;
    }

    const date =
        safeDate(primaryLd?.startDate) ||
        safeDate($('meta[itemprop="startDate"], meta[property="event:start_time"], time[datetime]').first().attr('content') ||
            $('time[datetime]').first().attr('datetime')) ||
        extractDateFromHtml(html);

    const endDate =
        safeDate(primaryLd?.endDate || primaryLd?.offers?.validThrough) ||
        safeDate($('meta[itemprop="endDate"], meta[property="event:end_time"]').first().attr('content')) ||
        extractEndDateFromHtml(html);

    const location =
        normalizeLocation(primaryLd?.location?.name || (Array.isArray(primaryLd?.location) ? primaryLd.location[0]?.name : '')) ||
        normalizeLocation($('[itemprop="location"], .venue, .location, [class*="venue"], [class*="location"]').first().text()) ||
        '';

    const address =
        extractAddressFromLd(primaryLd) ||
        normalizeSingleLine($('[itemprop="streetAddress"], .address, [class*="address"], [data-testid*="address"]').first().text()) ||
        '';

    const image =
        toAbsolute(
            $('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"], meta[itemprop="image"]').first().attr('content') ||
            $('img').first().attr('src') ||
            '',
            new URL(eventUrl).origin,
        ) || '';

    const ldPrice =
        primaryLd?.offers?.price ||
        (Array.isArray(primaryLd?.offers) ? primaryLd.offers[0]?.price : undefined) ||
        primaryLd?.price ||
        '';

    const price = normalizePriceLabel(ldPrice || $('meta[itemprop="price"], meta[property="product:price:amount"]').first().attr('content') || extractPriceFromHtml(html));

    return {
        title: title || undefined,
        subtitle,
        description: description || undefined,
        date: date || undefined,
        endDate: endDate || undefined,
        location: location || undefined,
        address: address || undefined,
        image: image || undefined,
        price: price || undefined,
    };
}

export function extractDateFromHtml(html: string): string {
    try {
        const $ = cheerio.load(html);

        // Try JSON-LD blocks first
        const ldNodes = $('script[type="application/ld+json"]').toArray();
        for (const node of ldNodes) {
            try {
                const raw = $(node).html() || '';
                const parsed = JSON.parse(raw);
                const arr = Array.isArray(parsed) ? parsed : [parsed];
                const found = arr.find((j: any) => j && (j.startDate || j.datePublished || j.date));
                const normalized = safeDate(found?.startDate || found?.datePublished || found?.date);
                if (normalized) return normalized;
            } catch {
                /* ignore malformed json */
            }
        }

        // Meta tags and time elements
        const metaDate =
            $('meta[itemprop="startDate"], meta[property="event:start_time"], meta[name="startDate"], meta[property="og:start_date"], meta[name="og:start_date"], time[datetime]')
                .first()
                .attr('content') || $('time[datetime]').first().attr('datetime');
        const normalizedMeta = safeDate(metaDate || undefined);
        if (normalizedMeta) return normalizedMeta;

        // Plain-text Portuguese date (e.g., "16 fevereiro 2026")
        const textDate = parsePtDateWithOptionalTime($.text());
        if (textDate) return textDate;

        return '';
    } catch {
        return '';
    }
}

export function extractEndDateFromHtml(html: string): string {
    try {
        const $ = cheerio.load(html);

        // JSON-LD endDate
        const ldNodes = $('script[type="application/ld+json"]').toArray();
        for (const node of ldNodes) {
            try {
                const raw = $(node).html() || '';
                const parsed = JSON.parse(raw);
                const arr = Array.isArray(parsed) ? parsed : [parsed];
                const found = arr.find((j: any) => j && (j.endDate || j.offers?.validThrough));
                const normalized = safeDate(found?.endDate || found?.offers?.validThrough);
                if (normalized) return normalized;
            } catch {
                /* ignore */
            }
        }

        // meta tags (endDate) and multiple <time> elements
        const metaEnd = $('meta[itemprop="endDate"], meta[name="endDate"], meta[property="event:end_time"], meta[property="og:end_date"]').first().attr('content');
        const normalizedMeta = safeDate(metaEnd || undefined);
        if (normalizedMeta) return normalizedMeta;

        const times = $('time[datetime]').map((i, el) => $(el).attr('datetime')).get();
        if (times.length >= 2) {
            const candidate = safeDate(times[1]);
            if (candidate) return candidate;
        }

        // Plain-text 'até' / range patterns (PT)
        const body = $.text();
        const rangeMatch = body.match(/(\d{1,2}\s+(?:janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+\d{4})\s*(?:-|–|a|até)\s*(\d{1,2}\s+(?:janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+\d{4})/i);
        if (rangeMatch) {
            const end = parsePtDate(rangeMatch[2]);
            if (end) return end;
        }

        // Pattern like "1 a 3 março 2026" (end date omits duplicated month/year)
        const shortRangeMatch = body.match(/(\d{1,2})\s*(?:-|–|a|até)\s*(\d{1,2})\s+(?:de\s+)?(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+(\d{4})/i);
        if (shortRangeMatch) {
            const endDay = parseInt(shortRangeMatch[2], 10);
            const month = PT_MONTHS[shortRangeMatch[3].toLowerCase()] ?? 0;
            const year = parseInt(shortRangeMatch[4], 10);
            const d = new Date(Date.UTC(year, month, endDay, 12, 0, 0));
            return d.toISOString();
        }

        // Pattern like "de 8 a 10 de março de 2026"
        const deRangeMatch = body.match(/de\s+(\d{1,2})\s+(?:-|–|a|até)\s+(\d{1,2})\s+de\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/i);
        if (deRangeMatch) {
            const endDay = parseInt(deRangeMatch[2], 10);
            const month = PT_MONTHS[deRangeMatch[3].toLowerCase()] ?? 0;
            const year = parseInt(deRangeMatch[4], 10);
            const d = new Date(Date.UTC(year, month, endDay, 12, 0, 0));
            return d.toISOString();
        }

        // Numeric range: dd/mm/yyyy - dd/mm/yyyy
        const numericRange = body.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(?:-|–|a|até)\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
        if (numericRange) {
            const day = parseInt(numericRange[4], 10);
            const month = parseInt(numericRange[5], 10) - 1;
            const year = parseInt(numericRange[6], 10);
            const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
            return d.toISOString();
        }

        // 'até <date>' pattern
        const ateMatch = body.match(/até\s+(\d{1,2}\s+(?:janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+\d{4})/i);
        if (ateMatch) {
            const end = parsePtDate(ateMatch[1]);
            if (end) return end;
        }

        return '';
    } catch {
        return '';
    }
}

function isMissingPrice(price?: string): boolean {
    if (!price) return true;
    const value = price.trim().toLowerCase();
    return value === ''
        || value === 'check site'
        || value === 'n/a'
        || value === 'na'
        || value === 'price unavailable'
        || value === 'a confirmar'
        || value === 'tbd'
        || value.includes('confirmar');
}

function isMissingLocation(location?: string): boolean {
    if (!location) return true;
    const value = location.trim().toLowerCase();
    return value === ''
        || value === 'unknown'
        || value === 'n/a'
        || value === 'na'
        || value === 'location unavailable'
        || value === 'verificar descrição'
        || value === 'see description'
        || value.includes('verificar');
}

function getConfirmationFallback(type: 'price' | 'location'): string {
    if (type === 'price') {
        return 'A confirmar';
    }
    return 'Verificar descrição';
}

function normalizePriceLabel(raw?: string | number): string {
    if (raw == null) return '';
    const str = String(raw).trim();
    if (!str) return '';

    if (/(gratuit|grátis|gratis|free)/i.test(str)) return 'Grátis';

    const match = str.match(/(\d{1,4}(?:[.,]\d{1,2})?)/);
    if (!match) return '';

    const num = Number.parseFloat(match[1].replace(',', '.'));
    if (!Number.isFinite(num)) return '';
    if (num >= 9000) return '';

    const normalized = Number.isInteger(num) ? `${num}` : `${num.toFixed(2)}`;
    return `${normalized}€`;
}

function mergeEvents(target: Event, incoming: Event): void {
    if (!target.subtitle && incoming.subtitle) {
        target.subtitle = incoming.subtitle;
    }
    if (!target.description || incoming.description.length > target.description.length) {
        target.description = incoming.description;
    }
    if (!target.image || target.image.includes('placeholder')) {
        target.image = incoming.image;
    }
    if (isMissingPrice(target.price) && !isMissingPrice(incoming.price)) {
        target.price = incoming.price;
    }
    if (isMissingLocation(target.location) && !isMissingLocation(incoming.location)) {
        target.location = incoming.location;
    }
    if (!target.address && incoming.address) {
        target.address = incoming.address;
    }
    // Keep earliest start date if missing
    if (!target.date && incoming.date) {
        target.date = incoming.date;
    }
    // Merge start date: prefer earlier start when both available
    if (incoming.date) {
        const targetStart = target.date ? new Date(target.date).getTime() : Number.NaN;
        const incomingStart = new Date(incoming.date).getTime();
        if (Number.isNaN(targetStart) || (!Number.isNaN(incomingStart) && incomingStart < targetStart)) {
            target.date = incoming.date;
        }
    }

    // Merge endDate: prefer the latest endDate available
    if (incoming.endDate) {
        const tEnd = target.endDate ? new Date(target.endDate).getTime() : 0;
        const iEnd = new Date(incoming.endDate).getTime();
        if (isNaN(tEnd) || iEnd > tEnd) target.endDate = incoming.endDate;
    }
}

function dedupe(events: Event[]): Event[] {
    const map = new Map<string, Event>();
    const result: Event[] = [];

    const getKeys = (ev: Event) => {
        const normUrl = normalizeUrlKey(ev.url);
        const day = ev.date ? ev.date.substring(0, 10) : '';
        const titleKey = normalizeTitle(ev.title);
        const locationKey = normalizeLocationKey(ev.location);

        const isLikelyDateOnly = /T(00|12):00:00\.000Z$/i.test(ev.date || '');
        const hourKey = ev.date && !isLikelyDateOnly ? new Date(ev.date).toISOString().substring(11, 16) : '';

        const keys = [normUrl];

        if (titleKey && day && hourKey) {
            keys.push(`${titleKey}|${day}|${hourKey}`);
        }

        if (locationKey && !isGenericLocation(locationKey)) {
            keys.push(`${titleKey}|${day}|${locationKey}`);
        }

        if (titleKey && day && !hourKey && (!locationKey || isGenericLocation(locationKey))) {
            keys.push(`${titleKey}|${day}`);
        }

        return keys.filter(Boolean);
    };

    for (const ev of events) {
        const normalized: Event = {
            ...ev,
            title: sanitizeText(ev.title),
            description: sanitizeText(ev.description),
            url: ev.url.trim(),
        };

        const keys = getKeys(normalized);
        const existing = keys.map((k) => map.get(k)).find(Boolean);

        if (!existing) {
            result.push(normalized);
            keys.forEach((k) => map.set(k, normalized));
        } else {
            mergeEvents(existing, normalized);
            keys.forEach((k) => map.set(k, existing));
        }
    }

    return result;
}

function countBySource(events: Event[]): Record<string, number> {
    return events.reduce((acc, ev) => {
        acc[ev.source] = (acc[ev.source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

async function enrichMissing(events: Event[]): Promise<void> {
    const targets = events.filter(
        (ev) =>
            !ev.subtitle ||
            !ev.image ||
            ev.image.includes('placeholder') ||
            !ev.description ||
            ev.description === 'Ver detalhes' ||
            !ev.date ||
            !ev.endDate ||
            !ev.address ||
            !ev.location ||
            isMissingPrice(ev.price),
    );
    if (targets.length === 0) return;

    const concurrency = 5;
    let index = 0;
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
    const hostLastRequest = new Map<string, number>();

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const hostMinInterval = (url: string) => {
        const host = (() => {
            try {
                return new URL(url).hostname.toLowerCase();
            } catch {
                return '';
            }
        })();

        if (host.includes('shotgun.live')) return 2400;
        if (host.includes('meetup.com')) return 1400;
        if (host.includes('eventbrite.')) return 1200;
        return 350;
    };

    const waitHostWindow = async (url: string) => {
        let host = '';
        try {
            host = new URL(url).hostname.toLowerCase();
        } catch {
            return;
        }

        const minInterval = hostMinInterval(url);
        const last = hostLastRequest.get(host) || 0;
        const now = Date.now();
        const wait = Math.max(0, minInterval - (now - last));
        const jitter = Math.floor(Math.random() * 250);
        if (wait > 0 || jitter > 0) {
            await delay(wait + jitter);
        }
        hostLastRequest.set(host, Date.now());
    };

    const fetchWithRetry = async (url: string) => {
        let lastError: any;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await waitHostWindow(url);
                return await axios.get(url, { headers: { 'User-Agent': ua }, timeout: 10000 });
            } catch (err: any) {
                lastError = err;
                const status = err?.response?.status;
                if (!(status === 429 || status === 403 || (status >= 500 && status <= 599))) {
                    break;
                }
                const backoff = 900 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 300);
                await delay(backoff);
            }
        }
        throw lastError;
    };

    const worker = async () => {
        while (true) {
            const current = index < targets.length ? targets[index++] : null;
            if (!current) break;
            try {
                const resp = await fetchWithRetry(current.url);
                const $ = cheerio.load(resp.data);
                const ogImg =
                    $('meta[property="og:image"], meta[name="og:image"]').attr('content') ||
                    $('meta[property="twitter:image"], meta[name="twitter:image"]').attr('content') ||
                    $('img').first().attr('src') ||
                    '';
                const ogDesc =
                    $('meta[property="og:description"], meta[name="og:description"], meta[name="description"]').attr('content') ||
                    $('p').first().text() ||
                    '';

                const extracted = extractDetailsFromHtml(resp.data, current.url);

                if (!current.title && extracted.title) {
                    current.title = extracted.title;
                }
                if (!current.subtitle && extracted.subtitle) {
                    current.subtitle = extracted.subtitle;
                }

                if ((!current.image || current.image.includes('placeholder')) && ogImg) {
                    current.image = toAbsolute(ogImg, new URL(current.url).origin);
                }
                if ((!current.image || current.image.includes('placeholder')) && extracted.image) {
                    current.image = extracted.image;
                }
                if (!current.date) {
                    const extractedDate = extracted.date || extractDateFromHtml(resp.data);
                    if (extractedDate) current.date = extractedDate;
                }
                if (!current.endDate) {
                    const extractedEnd = extracted.endDate || extractEndDateFromHtml(resp.data);
                    if (extractedEnd) current.endDate = extractedEnd;
                }
                if (!current.location && extracted.location) {
                    current.location = extracted.location;
                }
                if (!current.address && extracted.address) {
                    current.address = extracted.address;
                }
                if (isMissingPrice(current.price)) {
                    let ldPrice = '';
                    const ldNodes = $('script[type="application/ld+json"]').toArray();
                    for (const node of ldNodes) {
                        try {
                            const raw = $(node).html() || '';
                            const parsed = JSON.parse(raw);
                            const arr = Array.isArray(parsed) ? parsed : [parsed];
                            for (const item of arr) {
                                const offers = item?.offers;
                                if (Array.isArray(offers) && offers[0]?.price != null) {
                                    ldPrice = String(offers[0].price);
                                    break;
                                }
                                if (offers?.price != null) {
                                    ldPrice = String(offers.price);
                                    break;
                                }
                                if (item?.price != null) {
                                    ldPrice = String(item.price);
                                    break;
                                }
                            }
                            if (ldPrice) break;
                        } catch {
                            /* ignore malformed json */
                        }
                    }

                    const metaPrice =
                        $('meta[itemprop="price"]').attr('content') ||
                        $('meta[property="product:price:amount"]').attr('content') ||
                        $('meta[property="og:price:amount"]').attr('content') ||
                        '';

                    const candidate = ldPrice || metaPrice || extracted.price || extractPriceFromHtml(resp.data);
                    const normalized = normalizePriceLabel(candidate);
                    if (normalized) current.price = normalized;
                }
                if (!current.description || current.description === 'Ver detalhes') {
                    if (extracted.description) {
                        current.description = extracted.description;
                    } else if (ogDesc) {
                        current.description = cleanText(ogDesc).substring(0, 240);
                    }
                }

                if (!current.subtitle) {
                    const sourceSubtitle = sourceSpecificSubtitle($, current.url, current.title);
                    if (sourceSubtitle) {
                        current.subtitle = sourceSubtitle;
                    }
                }

                if ((!current.subtitle || isWeakSubtitle(current.subtitle)) && current.description) {
                    const derived = deriveSubtitleFromDescription(
                        current.description,
                        current.title,
                        current.location,
                        current.date,
                    );
                    if (derived) current.subtitle = derived;
                }

                if (!current.subtitle && current.source === 'BOL' && current.description) {
                    const firstSentence = cleanText(current.description)
                        .split(/[.!?]\s+/)
                        .map((s) => s.trim())
                        .find((s) => s.length >= 12 && s.toLowerCase() !== current.title.toLowerCase());
                    if (firstSentence) {
                        current.subtitle = firstSentence.substring(0, 180);
                    }
                }
            } catch (err: any) {
                // swallow and continue
            }
        }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
}

async function main() {
    console.log('Starting event fetch...');

    const allEvents: Event[] = [];

    const agendaLxEvents = await scrapeAgendaLX();
    allEvents.push(...agendaLxEvents);

    const feverEvents = await scrapeFever();
    allEvents.push(...feverEvents);

    const shotgunEvents = await scrapeShotgun();
    allEvents.push(...shotgunEvents);

    const xceedEvents = await scrapeXceed();
    allEvents.push(...xceedEvents);

    const ticketlineEvents = await scrapeTicketline();
    allEvents.push(...ticketlineEvents);

    const eventbriteEvents = await scrapeEventbrite();
    allEvents.push(...eventbriteEvents);

    const meetupEvents = await scrapeMeetup();
    allEvents.push(...meetupEvents);

    const blueticketEvents = await scrapeBlueticket();
    allEvents.push(...blueticketEvents);

    const bolEvents = await scrapeBOL();
    allEvents.push(...bolEvents);

    console.log('Raw counts by source:', countBySource(allEvents));

    const uniqueEvents = dedupe(allEvents);

    await enrichMissing(uniqueEvents);

    // Remove past events (compare with start of today UTC)
    const today = new Date();
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    const reDedupedEvents = dedupe(uniqueEvents);

    const validEvents = reDedupedEvents
        .filter(isValidEvent)
        .filter((ev) => {
            // Use endDate if present to decide whether the event is still upcoming/ongoing
            const endOrStart = ev.endDate ? new Date(ev.endDate).getTime() : new Date(ev.date).getTime();
            return !isNaN(endOrStart) && endOrStart >= todayUtc;
        });

    // Note: we no longer set endDate = date for single-day events.
    // This prevents nonsensical time displays like "13:00 — 13:00" on cards.
    // Events without a real endDate simply show the start time only.

    validEvents.forEach((ev) => {
        if (isMissingPrice(ev.price)) {
            ev.price = getConfirmationFallback('price');
        }
        ev.title = sanitizeText(ev.title);
        if (ev.subtitle) ev.subtitle = sanitizeText(ev.subtitle);
        if (!ev.subtitle || isWeakSubtitle(ev.subtitle)) {
            const derived = deriveSubtitleFromDescription(ev.description, ev.title, ev.location, ev.date);
            if (derived) ev.subtitle = derived;
        }
        if (!ev.subtitle && ev.source === 'BOL' && ev.description) {
            const firstSentence = sanitizeText(ev.description)
                .split(/[.!?]\s+/)
                .map((s) => s.trim())
                .find((s) => s.length >= 12 && s.toLowerCase() !== ev.title.toLowerCase());
            if (firstSentence) ev.subtitle = firstSentence.substring(0, 180);
        }
        ev.description = sanitizeText(ev.description);
        const normalizedLocation = normalizeLocation(ev.location || '');
        ev.location = isMissingLocation(normalizedLocation)
            ? getConfirmationFallback('location')
            : normalizedLocation;
        if (ev.address) ev.address = sanitizeText(ev.address);
        if (!ev.endDate) applyDefaultDuration(ev);
    });

    console.log('Deduped counts by source:', countBySource(validEvents));

    // Sort by date soonest; push undated to end
    validEvents.sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        const va = isNaN(da) ? Number.POSITIVE_INFINITY : da;
        const vb = isNaN(db) ? Number.POSITIVE_INFINITY : db;
        return va - vb;
    });

    const outputPath = path.join(process.cwd(), 'data', 'events.json');

    // Ensure data directory exists
    try {
        await fs.access(path.join(process.cwd(), 'data'));
    } catch {
        await fs.mkdir(path.join(process.cwd(), 'data'));
    }

    await fs.writeFile(outputPath, JSON.stringify(validEvents, null, 2));

    console.log(`Successfully fetched ${validEvents.length} events (deduped).`);
    console.log(`Saved to ${outputPath}`);
}

if (require.main === module) {
    main().catch(console.error);
}
