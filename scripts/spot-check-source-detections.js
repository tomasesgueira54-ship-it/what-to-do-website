const fs = require('fs').promises;
const path = require('path');

function detectCategoryFromText(text) {
    const t = (text || '').toLowerCase();
    if (/(discoteca|nightclub|boate|dj|cabaret|burlesque|stand-up|comedy|vida nocturna|noite)/i.test(t))
        return 'Discoteca/Nightlife';
    if (/(teatro|peça|espetáculo|dramático)/i.test(t)) return 'Teatro';
    if (/(cinema|filme|documentário|projeção)/i.test(t)) return 'Cinema';
    if (/(concerto|música|show|festival|banda|artista|fado|rock|jazz|techno|house|trance|rave|edm|electronic|eletrónica|drum\s*&\s*bass|dnb|dubstep|hardstyle|psytrance)/i.test(t)) return 'Música';
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
    if (/(indie|alternative)/i.test(t)) return 'Indie/Alternative';
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

    if (source === 'Shotgun') {
        if (/(techno|hard techno|hardtechno|house|deep house|tech house|trance|psytrance|rave|club|warehouse|after|all night)/.test(combined))
            return 'Discoteca/Nightlife';
        if (/(festival|live|concert|concerto|showcase|label night)/.test(combined)) return 'Música';
    }

    return undefined;
}

function detectMusicGenreBySource({ source, text, url }) {
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
    return undefined;
}

async function run() {
    const file = path.join(process.cwd(), 'data', 'events.json');
    const raw = await fs.readFile(file, 'utf8');
    const events = JSON.parse(raw);

    const sources = ['Fever', 'BOL', 'Eventbrite', 'Shotgun'];
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