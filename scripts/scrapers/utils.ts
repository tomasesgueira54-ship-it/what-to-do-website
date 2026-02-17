import { v4 as uuidv4 } from 'uuid';
import { Event, EventSource } from '../types';

export { uuidv4 };

export const DEFAULT_UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

export function toAbsolute(url: string | undefined, base: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return base.replace(/\/$/, '') + url;
    return base.replace(/\/$/, '') + '/' + url.replace(/^\.\//, '');
}

export function titleFromSlug(url: string): string {
    try {
        const pathname = new URL(url).pathname;
        const seg = pathname.split('/').filter(Boolean).pop() || '';
        return seg
            .replace(/-\d+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .trim();
    } catch {
        return '';
    }
}

export function cleanText(t: string): string {
    return (t || '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function safeDate(raw?: string): string {
    if (!raw) return '';
    const d = new Date(raw);
    return isNaN(d.getTime()) ? '' : d.toISOString();
}

export function extractPriceFromHtml(html: string): string {
    if (!html) return '';
    const lower = html.toLowerCase();
    if (/(gratuit|grátis|gratis|free)/i.test(lower)) return 'Grátis';

    const text = cleanText(html);
    const values: number[] = [];

    const currencyRegex = /(?:€|eur)\s*(\d{1,4}(?:[.,]\d{1,2})?)|(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|eur)/gi;
    let match: RegExpExecArray | null;
    while ((match = currencyRegex.exec(text)) !== null) {
        const raw = match[1] || match[2];
        if (!raw) continue;
        const value = Number.parseFloat(raw.replace(',', '.'));
        if (Number.isFinite(value) && value >= 0 && value <= 10000) {
            values.push(value);
        }
    }

    if (values.length > 0) {
        const min = Math.min(...values);
        if (min >= 9000) return '';
        const normalized = Number.isInteger(min) ? `${min}` : `${min.toFixed(2)}`;
        return `${normalized}€`;
    }

    const contextual = text.match(/(?:preço|price|ticket|bilhete|desde|a partir de)\D{0,20}(\d{1,4}(?:[.,]\d{1,2})?)/i);
    if (contextual) {
        const value = Number.parseFloat(contextual[1].replace(',', '.'));
        if (Number.isFinite(value) && value >= 0 && value <= 10000 && value < 9000) {
            const normalized = Number.isInteger(value) ? `${value}` : `${value.toFixed(2)}`;
            return `${normalized}€`;
        }
    }

    return '';
}

// Lightweight category detection used by scrapers (conservative rules)
function detectCategoryFromText(text: string): string | undefined {
    const t = (text || '').toLowerCase();
    if (/(discoteca|nightclub|boate|dj|cabaret|burlesque|stand-up|comedy|vida nocturna|noite)/i.test(t))
        return 'Discoteca/Nightlife';
    if (/(teatro|peça|espetáculo|dramático)/i.test(t)) return 'Teatro';
    if (/(cinema|filme|documentário|projeção)/i.test(t)) return 'Cinema';
    if (/(concerto|música|show|festival|banda|artista|fado|rock|jazz)/i.test(t)) return 'Música';
    if (/(dança|ballet|coreograf|movimento)/i.test(t)) return 'Dança';
    if (/(exposição|mostra|galeria|arte|museu|obra)/i.test(t)) return 'Exposição';
    if (/(palestra|seminário|conferência|talk|workshop|formação|entrevista)/i.test(t)) return 'Conferência';
    if (/(mercado|feira|market|feria|vendas)/i.test(t)) return 'Mercado/Feira';
    if (/(festa|party|carnaval|celebração)/i.test(t)) return 'Festa';
    if (/(ao ar livre|parque|jardim|outdoor)/i.test(t)) return 'Ao Ar Livre';
    return undefined;
}

function detectMusicGenreFromText(text: string): string | undefined {
    const t = (text || '').toLowerCase();
    if (t.includes('fado')) return 'Fado';
    if (t.includes('rock')) return 'Rock';
    if (t.includes('jazz')) return 'Jazz';
    if (t.includes('pop')) return 'Pop';
    if (t.includes('hard techno') || t.includes('hardtechno')) return 'Hard Techno';
    if (t.includes('techno')) return 'Techno';
    if (t.includes('trance')) return 'Trance';
    if (t.includes('house')) return 'House';
    if (t.includes('funk')) return 'Funk';
    if (/(clássic|orquest|sinfonia|clásico)/i.test(t)) return 'Clássico';
    if (t.includes('reggae')) return 'Reggae';
    if (/(hip-hop|hiphop|rap)/i.test(t)) return 'Hip-Hop';
    if (/(folk|tradicion|gaita)/i.test(t)) return 'Folk/Tradicional';
    if (/(samba|carnaval|bossa nova)/i.test(t)) return 'Samba/Carnaval';
    if (t.includes('k-pop') || t.includes('kpop')) return 'K-Pop';
    if (/(experimental|avant-garde)/i.test(t)) return 'Experimental';
    return undefined;
}

export function detectCategoryBySource(params: {
    source: EventSource;
    text: string;
    url?: string;
}): string | undefined {
    const { source, text, url } = params;
    const t = (text || '').toLowerCase();
    const u = (url || '').toLowerCase();
    const combined = `${t} ${u}`;

    if (source === 'Fever') {
        if (/candlelight/.test(combined)) return 'Música';
        // prefer explicit food/experience tags (brunch, tasting) over club/night keywords
        if (/(brunch|degust|degustação|vinho|wine|cocktail|cerveja|beer|gin|pizza|sushi|tapas|petisco|dinner|supper|tasting)/.test(combined))
            return 'Gastronomia';
        if (/(techno|house|club|dj|clubbing|noite)/.test(combined)) return 'Discoteca/Nightlife';
        if (/(tour|passeio|cruise|barco|boat|walking tour|visita guiada)/.test(combined)) return 'Ao Ar Livre';
        if (/(exposição|immersive|exhibition)/.test(combined)) return 'Exposição';
        if (/(comedy|stand-up|stand up)/.test(combined)) return 'Teatro';
    }

    if (source === 'BOL') {
        if (/(teatro|peça|musical|encenação|drama)/.test(combined)) return 'Teatro';
        if (/(stand-up|stand up|comedy|humor)/.test(combined)) return 'Teatro';
        if (/(concerto|festival|dj|rock|jazz|fado|orquestra|sinfonia)/.test(combined)) return 'Música';
        if (/(circo|cirque)/.test(combined)) return 'Teatro';
        if (/(workshop|aula|formação)/.test(combined)) return 'Conferência';
    }

    if (source === 'Eventbrite') {
        if (/(workshop|bootcamp|masterclass|formação|curso|seminário|talk|webinar)/.test(combined)) return 'Conferência';
        if (/(networking|startup|founder|pitch|investidor|ai|data|cloud|devops|software)/.test(combined)) return 'Conferência';
        if (/(hackathon|meetup|tech)/.test(combined)) return 'Conferência';
        if (/(market|feira|mercado|bazaar|flea)/.test(combined)) return 'Mercado/Feira';
        if (/(afterparty|after party|sunset|party|club)/.test(combined)) return 'Discoteca/Nightlife';
        if (/(food|gastronom|wine|tasting|degust|dinner|brunch)/.test(combined)) return 'Gastronomia';
    }

    return undefined;
}

export function detectMusicGenreBySource(params: { source: EventSource; text: string; url?: string }): string | undefined {
    const { source, text, url } = params;
    const base = detectMusicGenreFromText(text);
    if (base) return base;

    const combined = `${text || ''} ${url || ''}`.toLowerCase();

    if (source === 'Fever' && /candlelight/.test(combined)) return 'Clássico';
    if (source === 'Eventbrite' && /afrobeats|reggae|salsa|bachata/.test(combined)) return 'World/Latin';

    return undefined;
}

export function makeEvent(p: {
    title: string;
    description?: string;
    date?: string;
    endDate?: string;
    location?: string;
    image?: string;
    source: EventSource;
    url: string;
    price?: string;
}): Event {
    const title = cleanText(p.title).substring(0, 200);
    const description = cleanText(p.description || 'Ver detalhes');
    const location = p.location || 'Lisboa';

    const rawText = `${title} ${description} ${location}`;
    const inferredCategory =
        detectCategoryBySource({ source: p.source, text: rawText, url: p.url }) || detectCategoryFromText(rawText);
    const inferredGenre =
        inferredCategory === 'Música'
            ? detectMusicGenreBySource({ source: p.source, text: `${title} ${description}`, url: p.url })
            : undefined;

    return {
        id: uuidv4(),
        title,
        description,
        date: safeDate(p.date),
        endDate: safeDate(p.endDate),
        location,
        image: p.image && p.image.startsWith('http') ? p.image : '/placeholder-event.jpg',
        source: p.source,
        url: p.url,
        price: p.price,
        category: inferredCategory,
        musicGenre: inferredGenre,
    };
}

export async function dismissCookies(page: any): Promise<void> {
    const sels = [
        'button[id*="accept"]',
        'button[id*="agree"]',
        'button[class*="accept"]',
        '#onetrust-accept-btn-handler',
        '.cc-accept',
        '.cc-dismiss',
        'button:has-text("Aceitar")',
        'button:has-text("Accept")',
        'button:has-text("Concordo")',
        'button:has-text("OK")',
        'button:has-text("Agree")',
        '[data-testid*="accept"]',
    ];
    for (const s of sels) {
        try {
            const b = await page.$(s);
            if (b) {
                await b.click();
                await page.waitForTimeout(500);
                return;
            }
        } catch {
            /* swallow */
        }
    }
}
