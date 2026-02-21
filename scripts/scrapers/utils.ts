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

    return 'Check site';
}

/**
 * Heuristic to infer end date from description text if missing.
 * Supports Portuguese ranges like "10 a 12 de Março", "10-12 Mar", etc.
 */
export function inferEndDateFromText(text: string, startDate: Date): Date | undefined {
    if (!text || !startDate) return undefined;

    const lower = text.toLowerCase();
    const currentYear = startDate.getFullYear();
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
        'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ];

    // Pattern: "10 a 12 de Março" or "10 - 12 Mar"
    // We look for a date pattern occurring AFTER the start date mentions, or just general ranges.
    // Simplification: verify if there is a date string that looks like an end date.

    // Regex for "day 'a' day 'de' month"
    const rangeMatch = lower.match(/(\d{1,2})\s*(?:a|-)\s*(\d{1,2})\s*(?:de\s*)?([a-zç]{3,})/);
    if (rangeMatch) {
        const [, startDayStr, endDayStr, monthStr] = rangeMatch;
        const monthIndex = months.findIndex(m => monthStr.startsWith(m));

        if (monthIndex !== -1) {
            // Check if this range matches our start date
            const startDay = parseInt(startDayStr, 10);
            if (startDay === startDate.getDate() && monthIndex === startDate.getMonth()) {
                const endDay = parseInt(endDayStr, 10);
                // Create end date
                const endDate = new Date(startDate);
                endDate.setMonth(monthIndex);
                endDate.setDate(endDay);
                // Set end of day
                endDate.setHours(23, 59, 59, 999);
                return endDate;
            }
        }
    }

    return undefined;
}

export function applyDefaultDuration(event: Event, defaultHours: number = 2): void {
    if (event.date && !event.endDate) {
        const start = new Date(event.date);
        // Heuristic: If title/description contains 'Exposição', default to much longer or handle differently?
        // For now, just add hours.
        const keywords = (event.title + ' ' + event.description).toLowerCase();

        let additionalHours = defaultHours;

        // Nightlife/Clubbing often goes past midnight
        if (event.source === 'Shotgun' || event.source === 'Xceed' || keywords.includes('party') || keywords.includes('club') || keywords.includes('dj set')) {
            additionalHours = 6;
        } else if (keywords.includes('exposição') || keywords.includes('exhibition')) {
            // update: exhibitions usually run for days/weeks. 
            // If we only have start date, it might be the opening.
            // Without explicit end date, assumes same day closing time?
            additionalHours = 2; // Opening event duration
        }

        const end = new Date(start.getTime() + additionalHours * 60 * 60 * 1000);
        event.endDate = end.toISOString();
    }
}

// Lightweight category detection used by scrapers (conservative rules)
function detectCategoryFromText(text: string): string | undefined {
    const t = (text || '').toLowerCase();
    if (/(discoteca|nightclub|boate|dj|cabaret|burlesque|vida nocturna|noite)/i.test(t))
        return 'Discoteca/Nightlife';
    if (/(teatro|peça|espetáculo|dramático|stand-up|stand up|comedy|comédia|humor)/i.test(t)) return 'Teatro';
    if (/(cinema|filme|documentário|projeção)/i.test(t)) return 'Cinema';
    if (/(concerto|música|show|festival|banda|artista|fado|rock|jazz|techno|house|trance|rave|edm|electronic|eletrónica|drum\s*&\s*bass|dnb|dubstep|hardstyle|psytrance)/i.test(t)) return 'Música';
    if (/(dança|ballet|coreograf|movimento)/i.test(t)) return 'Dança';
    if (/(exposição|mostra|galeria|arte|museu|obra)/i.test(t)) return 'Exposição';
    if (/(workshop|masterclass|aula prática|hands-on)/i.test(t)) return 'Workshop';
    if (/(gastronom|degust|degustação|brunch|wine|vinho|cocktail|jantar|dinner|food|chef)/i.test(t)) return 'Gastronomia';
    if (/(palestra|seminário|conferência|talk|workshop|formação|entrevista)/i.test(t)) return 'Conferência';
    if (/(mercado|feira|market|feria|vendas)/i.test(t)) return 'Mercado/Feira';
    if (/(festa|party|carnaval|celebração)/i.test(t)) return 'Festa';
    if (/(ao ar livre|parque|jardim|outdoor)/i.test(t)) return 'Ao Ar Livre';
    return undefined;
}

function detectMusicGenreFromText(text: string): string | undefined {
    const t = (text || '').toLowerCase();
    if (/(hardcore|hardcore techno|gabber|angerfist)/i.test(t)) return 'Hardstyle';
    if (/(drum\s*(?:and|&)\s*bass|\bdnb\b)/i.test(t)) return 'Drum & Bass';
    if (/(ukg|uk garage|garage)/i.test(t)) return 'UK Garage';
    if (/(hard\s*techno|hardtechno)/i.test(t)) return 'Hard Techno';
    if (/melodic\s+techno/i.test(t)) return 'Melodic Techno';
    if (/industrial\s+techno/i.test(t)) return 'Industrial Techno';
    if (/(minimal\s+techno|minimal)/i.test(t)) return 'Minimal';
    if (/(acid\s+techno|acid house|\bacid\b)/i.test(t)) return 'Acid';
    if (/techno/i.test(t)) return 'Techno';
    if (/deep\s+house/i.test(t)) return 'Deep House';
    if (/tech\s+house/i.test(t)) return 'Tech House';
    if (/progressive\s+house/i.test(t)) return 'Progressive House';
    if (/afro\s+house/i.test(t)) return 'Afro House';
    if (/melodic\s+house/i.test(t)) return 'Melodic House';
    if (/house/i.test(t)) return 'House';
    if (/(psy\s*trance|psytrance)/i.test(t)) return 'Psytrance';
    if (/(\bgoa\b|goa\s+trance)/i.test(t)) return 'Goa';
    if (t.includes('fado')) return 'Fado';
    if (/(metal|heavy metal|thrash|death metal|black metal)/i.test(t)) return 'Metal';
    if (/punk/i.test(t)) return 'Punk';
    if (/(emo|indie|alternative)/i.test(t)) return 'Indie/Alternative';
    if (t.includes('rock')) return 'Rock';
    if (t.includes('jazz')) return 'Jazz';
    if (t.includes('pop')) return 'Pop';
    if (t.includes('trance')) return 'Trance';
    if (/(electro|electroclash|electronic)/i.test(t)) return 'Electro';
    if (/breakbeat/i.test(t)) return 'Breakbeat';
    if (/dubstep/i.test(t)) return 'Dubstep';
    if (/hardstyle/i.test(t)) return 'Hardstyle';
    if (/disco/i.test(t)) return 'Disco';
    if (/(downtempo|chillout|lofi|ambient)/i.test(t)) return 'Downtempo/Chill';
    if (t.includes('funk')) return 'Funk';
    if (/(r&b|rnb|neo soul|\bsoul\b)/i.test(t)) return 'R&B/Soul';
    if (/(clássic|orquest|sinfonia|clásico)/i.test(t)) return 'Clássico';
    if (t.includes('reggae')) return 'Reggae';
    if (/(afrobeats|afrobeat)/i.test(t)) return 'Afrobeats';
    if (/(salsa|bachata|reggaeton|flamenco|latin|latino|cumbia)/i.test(t)) return 'World/Latin';
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

    if (source === 'Shotgun') {
        if (/(techno|hard techno|hardtechno|house|deep house|tech house|trance|psytrance|rave|club|warehouse|after|all night)/.test(combined))
            return 'Discoteca/Nightlife';
        if (/(festival|live|concert|concerto|showcase|label night)/.test(combined)) return 'Música';
    }

    if (source === 'Xceed') {
        if (/(techno|hard techno|hardtechno|house|deep house|tech house|trance|psytrance|rave|club|warehouse|after|all night|guest list|table booking)/.test(combined))
            return 'Discoteca/Nightlife';
        if (/(festival|live|concert|concerto|showcase)/.test(combined)) return 'Música';
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
    if (source === 'Shotgun' && /boiler room|warehouse|all night|after|afterparty/.test(combined)) {
        if (/(hard\s*techno|hardtechno)/.test(combined)) return 'Hard Techno';
        if (/techno/.test(combined)) return 'Techno';
        if (/tech\s*house/.test(combined)) return 'Tech House';
        if (/deep\s*house/.test(combined)) return 'Deep House';
        if (/house/.test(combined)) return 'House';
    }
    if (source === 'Xceed') {
        if (/(hard\s*techno|hardtechno)/.test(combined)) return 'Hard Techno';
        if (/melodic\s*techno/.test(combined)) return 'Melodic Techno';
        if (/industrial\s*techno/.test(combined)) return 'Industrial Techno';
        if (/tech\s*house/.test(combined)) return 'Tech House';
        if (/deep\s*house/.test(combined)) return 'Deep House';
        if (/afro\s*house/.test(combined)) return 'Afro House';
        if (/house/.test(combined)) return 'House';
        if (/techno/.test(combined)) return 'Techno';
    }

    if (/(all\s*night\s*set|fuse\s*all\s*night|ministerium|warehouse|\bru?mu\b|boiler\s*room)/.test(combined)) return 'Techno';
    if (/(sonicblast|heavy metal|thrash|death metal|black metal)/.test(combined)) return 'Metal';
    if (/(emo|indie rock|alternative rock|primavera sound)/.test(combined)) return 'Indie/Alternative';
    if (/(pub\s*crawl|erasmus|ladies\s*night|shots|french\s*party|boat\s*party|new\s*gang|kalorama|live\s*music)/.test(combined)) return 'Pop';

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
        detectCategoryBySource({ source: p.source, text: rawText, url: p.url }) || detectCategoryFromText(rawText) || 'Outro';
    const canInferMusicGenre = inferredCategory === 'Música' || inferredCategory === 'Discoteca/Nightlife';
    const inferredGenre =
        canInferMusicGenre
            ? detectMusicGenreBySource({ source: p.source, text: `${title} ${description}`, url: p.url }) || 'Outro'
            : undefined;

    return {
        id: uuidv4(),
        title,
        description,
        date: safeDate(p.date),
        endDate: safeDate(p.endDate),
        location,
        image: p.image && p.image.startsWith('http') ? p.image : '/images/placeholder-card.svg',
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
