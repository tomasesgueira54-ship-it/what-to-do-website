const fs = require('fs').promises;
const path = require('path');

function detectCategoryFromText(text) {
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

function detectMusicGenreFromText(text) {
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

function detectCategoryBySource({ source, text, url }) {
    const t = (text || '').toLowerCase();
    const u = (url || '').toLowerCase();
    const combined = `${t} ${u}`;

    if (source === 'Fever') {
        if (/candlelight/.test(combined)) return 'Música';
        // prefer explicit food/experience tags (brunch, tasting) over club/night keywords
        if (/(brunch|degust|degustação|vinho|wine|cocktail|cerveja|beer|gin|pizza|sushi|tapas|petisco)/.test(combined))
            return 'Gastronomia';
        if (/(techno|house|club|dj|clubbing|noite)/.test(combined)) return 'Discoteca/Nightlife';
    }

    if (source === 'BOL') {
        if (/(teatro|peça|musical|encenação|drama)/.test(combined)) return 'Teatro';
        if (/(stand-up|stand up|comedy|humor)/.test(combined)) return 'Teatro';
        if (/(concerto|festival|dj|rock|jazz|fado|orquestra|sinfonia)/.test(combined)) return 'Música';
        if (/(circo|cirque)/.test(combined)) return 'Teatro';
    }

    if (source === 'Eventbrite') {
        if (/(workshop|bootcamp|masterclass|formação|curso|seminário|talk|webinar)/.test(combined)) return 'Conferência';
        if (/(networking|startup|founder|pitch|investidor|ai|data|cloud|devops|software)/.test(combined)) return 'Conferência';
        if (/(hackathon|meetup|tech)/.test(combined)) return 'Conferência';
        if (/(market|feira|mercado|bazaar|flea)/.test(combined)) return 'Mercado/Feira';
        if (/(afterparty|after party|sunset|party|club)/.test(combined)) return 'Discoteca/Nightlife';
    }

    return undefined;
}

function detectMusicGenreBySource({ source, text, url }) {
    const base = detectMusicGenreFromText(text);
    if (base) return base;
    const combined = `${text || ''} ${url || ''}`.toLowerCase();
    if (source === 'Fever' && /candlelight/.test(combined)) return 'Clássico';
    return undefined;
}

async function run() {
    const file = path.join(process.cwd(), 'data', 'events.json');
    const raw = await fs.readFile(file, 'utf8');
    const events = JSON.parse(raw);

    const sources = ['Fever', 'BOL', 'Eventbrite'];
    const results = {};

    for (const s of sources) {
        results[s] = events.filter((e) => e.source === s).slice(0, 3).map((ev) => {
            const rawText = `${ev.title} ${ev.description || ''} ${ev.location || ''}`;
            const predictedCategory = detectCategoryBySource({ source: ev.source, text: rawText, url: ev.url }) || detectCategoryFromText(rawText);
            const predictedGenre = predictedCategory === 'Música' ? detectMusicGenreBySource({ source: ev.source, text: `${ev.title} ${ev.description || ''}`, url: ev.url }) : detectMusicGenreFromText(`${ev.title} ${ev.description || ''}`);
            return {
                id: ev.id,
                title: ev.title,
                source: ev.source,
                existingCategory: ev.category || null,
                existingGenre: ev.musicGenre || null,
                predictedCategory,
                predictedGenre,
                url: ev.url,
            };
        });
    }

    console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});