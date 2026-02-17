import fs from 'fs/promises';
import path from 'path';
import { Event } from '../data/types';

// Reuse simple detection logic (kept small and conservative)
function detectCategory(event: Event): string | undefined {
    const text = `${event.title} ${event.description || ''} ${event.location || ''}`.toLowerCase();
    if (/(discoteca|nightclub|boate|dj|cabaret|burlesque|stand-up|comedy|vida nocturna|noite)/i.test(text))
        return 'Discoteca/Nightlife';
    if (/(teatro|peça|espetáculo|dramático)/i.test(text)) return 'Teatro';
    if (/(cinema|filme|documentário|projeção)/i.test(text)) return 'Cinema';
    if (/(concerto|música|show|festival|banda|artista|fado|rock|jazz)/i.test(text)) return 'Música';
    if (/(dança|ballet|coreograf|movimento)/i.test(text)) return 'Dança';
    if (/(exposição|mostra|galeria|arte|museu|obra)/i.test(text)) return 'Exposição';
    if (/(palestra|seminário|conferência|talk|workshop|formação|entrevista)/i.test(text)) return 'Conferência';
    if (/(mercado|feira|market|feria|vendas)/i.test(text)) return 'Mercado/Feira';
    if (/(festa|party|carnaval|celebração)/i.test(text)) return 'Festa';
    if (/(ao ar livre|parque|jardim|outdoor)/i.test(text)) return 'Ao Ar Livre';
    return undefined;
}

function detectMusicGenre(event: Event): string | undefined {
    const text = `${event.title} ${event.description || ''}`.toLowerCase();
    if (text.includes('fado')) return 'Fado';
    if (text.includes('rock')) return 'Rock';
    if (text.includes('jazz')) return 'Jazz';
    if (text.includes('pop')) return 'Pop';
    if (text.includes('hard techno') || text.includes('hardtechno')) return 'Hard Techno';
    if (text.includes('techno')) return 'Techno';
    if (text.includes('trance')) return 'Trance';
    if (text.includes('house')) return 'House';
    if (text.includes('funk')) return 'Funk';
    if (/(clássic|orquest|sinfonia|clássico)/i.test(text)) return 'Clássico';
    if (text.includes('reggae')) return 'Reggae';
    if (/(hip-hop|hiphop|rap)/i.test(text)) return 'Hip-Hop';
    if (/(folk|tradicion|gaita)/i.test(text)) return 'Folk/Tradicional';
    if (/(samba|carnaval|bossa nova)/i.test(text)) return 'Samba/Carnaval';
    if (text.includes('k-pop') || text.includes('kpop')) return 'K-Pop';
    if (/(experimental|avant-garde)/i.test(text)) return 'Experimental';
    return undefined;
}

// source-aware detection
function detectCategoryBySource(event: Event): string | undefined {
    const text = `${event.title} ${event.description || ''} ${event.location || ''}`.toLowerCase();
    const url = (event.url || '').toLowerCase();
    const combined = `${text} ${url}`;

    if (event.source === 'Fever') {
        if (/candlelight/.test(combined)) return 'Música';
        // prefer explicit food/experience tags (brunch, tasting) over club/night keywords
        if (/(brunch|degust|degustação|vinho|wine|cocktail|cerveja|beer|gin|pizza|sushi|tapas|petisco|dinner|supper|tasting)/.test(combined))
            return 'Gastronomia';
        if (/(techno|house|club|dj|clubbing|noite)/.test(combined)) return 'Discoteca/Nightlife';
        if (/(tour|passeio|cruise|barco|boat|walking tour|visita guiada)/.test(combined)) return 'Ao Ar Livre';
        if (/(exposição|immersive|exhibition)/.test(combined)) return 'Exposição';
        if (/(comedy|stand-up|stand up)/.test(combined)) return 'Teatro';
    }

    if (event.source === 'BOL') {
        if (/(teatro|peça|musical|encenação|drama)/.test(combined)) return 'Teatro';
        if (/(stand-up|stand up|comedy|humor)/.test(combined)) return 'Teatro';
        if (/(concerto|festival|dj|rock|jazz|fado|orquestra|sinfonia)/.test(combined)) return 'Música';
        if (/(circo|cirque)/.test(combined)) return 'Teatro';
        if (/(workshop|aula|formação)/.test(combined)) return 'Conferência';
    }

    if (event.source === 'Eventbrite') {
        if (/(workshop|bootcamp|masterclass|formação|curso|seminário|talk|webinar)/.test(combined)) return 'Conferência';
        if (/(networking|startup|founder|pitch|investidor|ai|data|cloud|devops|software)/.test(combined)) return 'Conferência';
        if (/(hackathon|meetup|tech)/.test(combined)) return 'Conferência';
        if (/(market|feira|mercado|bazaar|flea)/.test(combined)) return 'Mercado/Feira';
        if (/(afterparty|after party|sunset|party|club)/.test(combined)) return 'Discoteca/Nightlife';
        if (/(food|gastronom|wine|tasting|degust|dinner|brunch)/.test(combined)) return 'Gastronomia';
    }

    return undefined;
}

function detectMusicGenreBySource(event: Event): string | undefined {
    const base = detectMusicGenre(event);
    if (base) return base;
    const combined = `${event.title} ${event.description || ''} ${event.url || ''}`.toLowerCase();
    if (event.source === 'Fever' && /candlelight/.test(combined)) return 'Clássico';
    if (event.source === 'Eventbrite' && /afrobeats|reggae|salsa|bachata/.test(combined)) return 'World/Latin';
    return undefined;
}

async function enrich() {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const events: Event[] = JSON.parse(raw);

    let updatedCategory = 0;
    let updatedGenre = 0;
    let total = 0;

    const out = events.map((ev) => {
        total += 1;
        const copy = { ...ev } as Event;

        // prefer source-aware detection, fall back to generic
        if (!copy.category) {
            const c = detectCategoryBySource(copy) || detectCategory(copy);
            if (c) {
                copy.category = c as any;
                updatedCategory++;
            }
        }

        const cat = copy.category || detectCategory(copy);
        if (cat === 'Música' && !copy.musicGenre) {
            const g = detectMusicGenreBySource(copy) || detectMusicGenre(copy);
            if (g) {
                copy.musicGenre = g as any;
                updatedGenre++;
            }
        }

        return copy;
    });

    if (updatedCategory + updatedGenre > 0) {
        await fs.writeFile(filePath, JSON.stringify(out, null, 2), 'utf-8');
    }

    console.log(`events.json: processed=${total} categoryAdded=${updatedCategory} genreAdded=${updatedGenre}`);
}

enrich().catch((err) => {
    console.error('Enrichment failed:', err);
    process.exit(1);
});
