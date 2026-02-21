import fs from 'fs/promises';
import path from 'path';
import { Event } from '../data/types';

// Reuse simple detection logic (kept small and conservative)
function detectCategory(event: Event): string | undefined {
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

function detectMusicGenre(event: Event): string | undefined {
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

    if (event.source === 'Shotgun') {
        if (/(techno|hard techno|hardtechno|house|deep house|tech house|trance|psytrance|rave|club|warehouse|after|all night)/.test(combined))
            return 'Discoteca/Nightlife';
        if (/(festival|live|concert|concerto|showcase|label night)/.test(combined)) return 'Música';
    }

    if (event.source === 'Xceed') {
        if (/(techno|hard techno|hardtechno|house|deep house|tech house|trance|psytrance|rave|club|warehouse|after|all night|guest list|table booking)/.test(combined))
            return 'Discoteca/Nightlife';
        if (/(festival|live|concert|concerto|showcase)/.test(combined)) return 'Música';
    }

    return undefined;
}

function detectMusicGenreBySource(event: Event): string | undefined {
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

const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
    // Exact Matches or high confidence partials
    'altice arena': { lat: 38.7686, lng: -9.0937 },
    'meo arena': { lat: 38.7686, lng: -9.0937 },
    'pavilhão atlântico': { lat: 38.7686, lng: -9.0937 },
    'coliseu dos recreios': { lat: 38.7163, lng: -9.1408 },
    'coliseu de lisboa': { lat: 38.7163, lng: -9.1408 },
    'ccb': { lat: 38.6955, lng: -9.2084 },
    'centro cultural de belém': { lat: 38.6955, lng: -9.2084 },
    'gulbenkian': { lat: 38.7375, lng: -9.1546 },
    'lux frágil': { lat: 38.7111, lng: -9.1248 },
    'musicbox': { lat: 38.7067, lng: -9.1472 },
    'teatro nacional d. maria ii': { lat: 38.715, lng: -9.1396 },
    'lav - lisboa ao vivo': { lat: 38.749, lng: -9.103 },
    'village underground': { lat: 38.6985, lng: -9.1772 },
    'campo pequeno': { lat: 38.7423, lng: -9.1457 },
    'capitólio': { lat: 38.7188, lng: -9.1456 },
    'cinema são jorge': { lat: 38.7196, lng: -9.1441 },
    'pensão amor': { lat: 38.7069, lng: -9.1436 },
    'time out market': { lat: 38.7071, lng: -9.1465 },
    'maat': { lat: 38.6958, lng: -9.1943 },
    'lx factory': { lat: 38.6984, lng: -9.1786 },
    'museu do oriente': { lat: 38.7032, lng: -9.1718 },
    'estádio da luz': { lat: 38.7527, lng: -9.1847 },
    'estádio josé alvalade': { lat: 38.7612, lng: -9.1607 },
    'aula magna': { lat: 38.7486, lng: -9.1547 },
    'terraço editorial': { lat: 38.7153, lng: -9.1378 },
    'zdb': { lat: 38.7109, lng: -9.1443 },
    'zé dos bois': { lat: 38.7109, lng: -9.1443 },
    'hot clube': { lat: 38.7214, lng: -9.1481 },
    'b.leza': { lat: 38.7062, lng: -9.1475 },
    'titanic sur mer': { lat: 38.7062, lng: -9.1475 },
    'planeta manas': { lat: 38.7461, lng: -9.101 },
    'nada temple': { lat: 38.7405, lng: -9.1025 },
    'ministerium': { lat: 38.7086, lng: -9.1362 },
    'incógnito': { lat: 38.7138, lng: -9.151 },
    '5a': { lat: 38.7099, lng: -9.1479 },
    'plateau': { lat: 38.7063, lng: -9.1555 },
    'kremlin': { lat: 38.7056, lng: -9.1556 },
    'lust in rio': { lat: 38.7042, lng: -9.1545 },
    'urban beach': { lat: 38.7018, lng: -9.1557 },
    'monsantos': { lat: 38.7308, lng: -9.1873 },
    'pátio da galé': { lat: 38.7083, lng: -9.1364 },
    'museu nacional de arte antiga': { lat: 38.7048, lng: -9.1627 },
    'reservatório da mãe d\'água': { lat: 38.723, lng: -9.1576 },
    'jardim da estrela': { lat: 38.7153, lng: -9.1583 },
    'jardim do torel': { lat: 38.7196, lng: -9.1422 },
    'miradouro de santa catarina': { lat: 38.7095, lng: -9.1477 },
    'miradouro da graça': { lat: 38.7161, lng: -9.1316 },
    'ferroviário': { lat: 38.7159, lng: -9.1171 },
    'dope club': { lat: 38.7065, lng: -9.1495 },
    'cais do gajrejo': { lat: 38.7061, lng: -9.1438 },
    'park bar': { lat: 38.7118, lng: -9.1441 },
    'out jazz': { lat: 38.6946, lng: -9.206 },
    'monsanto': { lat: 38.7291, lng: -9.1916 },
    'parque eduardo vii': { lat: 38.7282, lng: -9.1539 },
    'ribeira das naus': { lat: 38.7062, lng: -9.1396 },
    'cais das colunas': { lat: 38.7061, lng: -9.1362 },
    'praça do comércio': { lat: 38.7075, lng: -9.1364 },
    'rossio': { lat: 38.7138, lng: -9.1394 },
    'martim moniz': { lat: 38.7156, lng: -9.1367 },
    'intendente': { lat: 38.7208, lng: -9.1348 },
    'anjos': { lat: 38.7259, lng: -9.1341 },
    'arroios': { lat: 38.7289, lng: -9.1337 },
    'alameda': { lat: 38.7369, lng: -9.1332 },
    'areeiro': { lat: 38.7423, lng: -9.1331 },
    'roma': { lat: 38.748, lng: -9.1415 },
    'alvalade': { lat: 38.7533, lng: -9.144 },
    'campo grande': { lat: 38.7593, lng: -9.1549 },
    'telheiras': { lat: 38.7601, lng: -9.1661 },
    'lumiar': { lat: 38.7733, lng: -9.1593 },
    'odivelas': { lat: 38.7946, lng: -9.1735 },
    'amadora': { lat: 38.7596, lng: -9.2238 },
    'benfica': { lat: 38.7505, lng: -9.1906 },
    'carnide': { lat: 38.7601, lng: -9.1901 },
    'pontinha': { lat: 38.7686, lng: -9.1983 },
    'colombo': { lat: 38.7539, lng: -9.1884 },
    'vasco da gama': { lat: 38.7675, lng: -9.0967 },
    'oriente': { lat: 38.7677, lng: -9.0993 },
    'olivais': { lat: 38.7609, lng: -9.1118 },
    'chelas': { lat: 38.737, lng: -9.113 },
    'bela vista': { lat: 38.7469, lng: -9.1128 },
    'olaias': { lat: 38.7377, lng: -9.1235 },
    'santa apolónia': { lat: 38.7136, lng: -9.1225 },
};

function detectCoordinates(event: Event): { lat: number; lng: number } | undefined {
    // Try to match exact venue names
    const text = `${event.location || ''} ${event.address || ''} ${event.title || ''}`.toLowerCase();

    // Check for exact matches first (keys with spaces)
    for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
        if (text.includes(key)) {
            return coords;
        }
    }
    return undefined;
}

async function enrich() {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const events: Event[] = JSON.parse(raw);

    let updatedCategory = 0;
    let updatedGenre = 0;
    let updatedCoords = 0;
    let total = 0;

    const out = events.map((ev) => {
        total += 1;
        const copy = { ...ev } as Event;

        // Coordinates detection
        if (!copy.lat || !copy.lng) {
            const coords = detectCoordinates(copy);
            if (coords) {
                copy.lat = coords.lat;
                copy.lng = coords.lng;
                updatedCoords++;
            }
        }

        // prefer source-aware detection, fall back to generic and finally default to Outro
        if (!copy.category) {
            const c = detectCategoryBySource(copy) || detectCategory(copy);
            if (c) {
                copy.category = c as any;
                updatedCategory++;
            } else {
                copy.category = 'Outro' as any;
                updatedCategory++;
            }
        }

        if (copy.category === 'Discoteca/Nightlife') {
            const text = `${copy.title} ${copy.description || ''} ${copy.location || ''}`.toLowerCase();
            if (/(stand-up|stand up|comedy|comédia|humor)/.test(text)) {
                copy.category = 'Teatro' as any;
                updatedCategory++;
            }
        }

        if (copy.category === 'Música' || copy.category === 'Discoteca/Nightlife') {
            const text = `${copy.title} ${copy.description || ''} ${copy.location || ''} ${copy.url || ''}`.toLowerCase();
            if (/(exposição|galeria|museu|arte com ciência|universo criativo|artista plástico)/.test(text)) {
                copy.category = 'Exposição' as any;
                updatedCategory++;
            } else if (/(festival internacional de cinema|\bcinema\b|\bfilme\b|documentário|documentario)/.test(text)) {
                copy.category = 'Cinema' as any;
                updatedCategory++;
            } else if (/(meetup|networking|socialising|socializing|small talk|community meetup)/.test(text)) {
                copy.category = 'Conferência' as any;
                updatedCategory++;
            }
        }

        const cat = copy.category || detectCategory(copy);
        const canInferMusicGenre = cat === 'Música' || cat === 'Discoteca/Nightlife';
        if (canInferMusicGenre) {
            const currentGenre = copy.musicGenre || '';
            const detectedGenre = detectMusicGenreBySource(copy) || detectMusicGenre(copy);
            if (!currentGenre) {
                copy.musicGenre = (detectedGenre || 'Outro') as any;
                updatedGenre++;
            } else if (currentGenre === 'Outro' && detectedGenre && detectedGenre !== 'Outro') {
                copy.musicGenre = detectedGenre as any;
                updatedGenre++;
            }
        } else if (copy.musicGenre) {
            copy.musicGenre = undefined;
        }

        return copy;
    });

    if (updatedCategory + updatedGenre + updatedCoords > 0) {
        await fs.writeFile(filePath, JSON.stringify(out, null, 2), 'utf-8');
    }

    console.log(`events.json: processed=${total} categoryAdded=${updatedCategory} genreAdded=${updatedGenre} coordsAdded=${updatedCoords}`);
}

enrich().catch((err) => {
    console.error('Enrichment failed:', err);
    process.exit(1);
});
