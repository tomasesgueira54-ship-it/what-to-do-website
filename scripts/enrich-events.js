const fs = require('fs').promises;
const path = require('path');

function detectCategory(event) {
    const text = `${event.title} ${event.description || ''} ${event.location || ''}`.toLowerCase();
    if (/(discoteca|nightclub|boate|dj|cabaret|burlesque|vida nocturna|noite)/i.test(text))
        return 'Discoteca/Nightlife';
    if (/(teatro|peça|espetáculo|dramático|stand-up|stand up|comedy|comédia|humor)/i.test(text)) return 'Teatro';
    if (/(cinema|filme|documentário|projeção)/i.test(text)) return 'Cinema';
    if (/(concerto|música|show|festival|banda|artista|fado|rock|jazz|techno|house|trance|rave|edm|electronic|eletrónica|drum\s*&\s*bass|dnb|dubstep|hardstyle|psytrance)/i.test(text)) return 'Música';
    if (/(dança|ballet|coreograf|movimento)/i.test(text)) return 'Dança';
    if (/(exposição|mostra|galeria|arte|museu|obra)/i.test(text)) return 'Exposição';
    if (/(workshop|masterclass|aula prática|hands-on)/i.test(text)) return 'Workshop';
    if (/(gastronom|degust|degustação|brunch|wine|vinho|cocktail|jantar|dinner|food|chef)/i.test(text)) return 'Gastronomia';
    if (/(palestra|seminário|conferência|talk|workshop|formação|entrevista)/i.test(text)) return 'Conferência';
    if (/(mercado|feira|market|feria|vendas)/i.test(text)) return 'Mercado/Feira';
    if (/(festa|party|carnaval|celebração)/i.test(text)) return 'Festa';
    if (/(ao ar livre|parque|jardim|outdoor)/i.test(text)) return 'Ao Ar Livre';
    return undefined;
}

function detectMusicGenre(event) {
    const text = `${event.title} ${event.description || ''}`.toLowerCase();
    if (/(hardcore|hardcore techno|gabber|angerfist)/i.test(text)) return 'Hardstyle';
    if (/(drum\s*(?:and|&)\s*bass|\bdnb\b)/i.test(text)) return 'Drum & Bass';
    if (/(ukg|uk garage|garage)/i.test(text)) return 'UK Garage';
    if (/(hard\s*techno|hardtechno)/i.test(text)) return 'Hard Techno';
    if (/melodic\s+techno/i.test(text)) return 'Melodic Techno';
    if (/industrial\s+techno/i.test(text)) return 'Industrial Techno';
    if (/(minimal\s+techno|minimal)/i.test(text)) return 'Minimal';
    if (/(acid\s+techno|acid house|\bacid\b)/i.test(text)) return 'Acid';
    if (/techno/i.test(text)) return 'Techno';
    if (/deep\s+house/i.test(text)) return 'Deep House';
    if (/tech\s+house/i.test(text)) return 'Tech House';
    if (/progressive\s+house/i.test(text)) return 'Progressive House';
    if (/afro\s+house/i.test(text)) return 'Afro House';
    if (/melodic\s+house/i.test(text)) return 'Melodic House';
    if (/house/i.test(text)) return 'House';
    if (/(psy\s*trance|psytrance)/i.test(text)) return 'Psytrance';
    if (/(\bgoa\b|goa\s+trance)/i.test(text)) return 'Goa';
    if (text.includes('fado')) return 'Fado';
    if (/(metal|heavy metal|thrash|death metal|black metal)/i.test(text)) return 'Metal';
    if (/punk/i.test(text)) return 'Punk';
    if (/(emo|indie|alternative)/i.test(text)) return 'Indie/Alternative';
    if (text.includes('rock')) return 'Rock';
    if (text.includes('jazz')) return 'Jazz';
    if (text.includes('pop')) return 'Pop';
    if (text.includes('trance')) return 'Trance';
    if (/(electro|electroclash|electronic)/i.test(text)) return 'Electro';
    if (/breakbeat/i.test(text)) return 'Breakbeat';
    if (/dubstep/i.test(text)) return 'Dubstep';
    if (/hardstyle/i.test(text)) return 'Hardstyle';
    if (/disco/i.test(text)) return 'Disco';
    if (/(downtempo|chillout|lofi|ambient)/i.test(text)) return 'Downtempo/Chill';
    if (text.includes('funk')) return 'Funk';
    if (/(r&b|rnb|neo soul|\bsoul\b)/i.test(text)) return 'R&B/Soul';
    if (/(clássic|orquest|sinfonia|clássico)/i.test(text)) return 'Clássico';
    if (text.includes('reggae')) return 'Reggae';
    if (/(afrobeats|afrobeat)/i.test(text)) return 'Afrobeats';
    if (/(salsa|bachata|reggaeton|flamenco|latin|latino|cumbia)/i.test(text)) return 'World/Latin';
    if (/(hip-hop|hiphop|rap)/i.test(text)) return 'Hip-Hop';
    if (/(folk|tradicion|gaita)/i.test(text)) return 'Folk/Tradicional';
    if (/(samba|carnaval|bossa nova)/i.test(text)) return 'Samba/Carnaval';
    if (text.includes('k-pop') || text.includes('kpop')) return 'K-Pop';
    if (/(experimental|avant-garde)/i.test(text)) return 'Experimental';
    return undefined;
}

// Source-aware detection rules (Fever, BOL, Eventbrite)
function detectCategoryBySource(event) {
    const source = event.source;
    const text = `${event.title} ${event.description || ''} ${event.location || ''}`.toLowerCase();
    const url = (event.url || '').toLowerCase();
    const combined = `${text} ${url}`;

    if (source === 'Fever') {
        if (/candlelight/.test(combined)) return 'Música';
        if (/(techno|house|club|dj|clubbing|noite)/.test(combined)) return 'Discoteca/Nightlife';
        if (/(brunch|degust|degustação|vinho|wine|cocktail|cerveja|beer|gin|pizza|sushi|tapas|petisco)/.test(combined))
            return 'Gastronomia';
        if (/(tour|passeio|cruise|barco|boat|walking tour|visita guiada)/.test(combined)) return 'Ao Ar Livre';
        if (/(exposição|immersive|exhibition)/.test(combined)) return 'Exposição';
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

function detectMusicGenreBySource(event) {
    const base = detectMusicGenre(event);
    if (base) return base;
    const combined = `${event.title} ${event.description || ''} ${event.url || ''}`.toLowerCase();
    if (event.source === 'Fever' && /candlelight/.test(combined)) return 'Clássico';
    if (event.source === 'Eventbrite' && /afrobeats|reggae|salsa|bachata/.test(combined)) return 'World/Latin';
    if (event.source === 'Shotgun' && /boiler room|warehouse|all night|after|afterparty/.test(combined)) {
        if (/(hard\s*techno|hardtechno)/.test(combined)) return 'Hard Techno';
        if (/techno/.test(combined)) return 'Techno';
        if (/tech\s*house/.test(combined)) return 'Tech House';
        if (/deep\s*house/.test(combined)) return 'Deep House';
        if (/house/.test(combined)) return 'House';
    }
    if (event.source === 'Xceed') {
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

async function enrich() {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const events = JSON.parse(raw);

    let updatedCategory = 0;
    let updatedGenre = 0;
    let total = 0;

    const out = events.map((ev) => {
        total += 1;
        const copy = Object.assign({}, ev);

        // prefer source-aware detection, fall back to generic
        if (!copy.category) {
            const c = detectCategoryBySource(copy) || detectCategory(copy);
            if (c) {
                copy.category = c;
                updatedCategory++;
            }
        }

        if (copy.category === 'Discoteca/Nightlife') {
            const text = `${copy.title} ${copy.description || ''} ${copy.location || ''}`.toLowerCase();
            if (/(stand-up|stand up|comedy|comédia|humor)/.test(text)) {
                copy.category = 'Teatro';
                updatedCategory++;
            }
        }

        if (copy.category === 'Música' || copy.category === 'Discoteca/Nightlife') {
            const text = `${copy.title} ${copy.description || ''} ${copy.location || ''} ${copy.url || ''}`.toLowerCase();
            if (/(exposição|galeria|museu|arte com ciência|universo criativo|artista plástico)/.test(text)) {
                copy.category = 'Exposição';
                updatedCategory++;
            } else if (/(festival internacional de cinema|\bcinema\b|\bfilme\b|documentário|documentario)/.test(text)) {
                copy.category = 'Cinema';
                updatedCategory++;
            } else if (/(meetup|networking|socialising|socializing|small talk|community meetup)/.test(text)) {
                copy.category = 'Conferência';
                updatedCategory++;
            }
        }

        const cat = copy.category || detectCategory(copy);
        const canInferMusicGenre = cat === 'Música' || cat === 'Discoteca/Nightlife';
        if (canInferMusicGenre) {
            const currentGenre = copy.musicGenre || '';
            const detectedGenre = detectMusicGenreBySource(copy) || detectMusicGenre(copy);
            if (!currentGenre) {
                copy.musicGenre = detectedGenre || 'Outro';
                updatedGenre++;
            } else if (currentGenre === 'Outro' && detectedGenre && detectedGenre !== 'Outro') {
                copy.musicGenre = detectedGenre;
                updatedGenre++;
            }
        } else if (copy.musicGenre) {
            copy.musicGenre = undefined;
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
