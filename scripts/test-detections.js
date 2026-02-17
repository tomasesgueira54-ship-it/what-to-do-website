function detectCategoryBySource({ source, text = '', url = '' }) {
    const combined = `${(text || '').toLowerCase()} ${(url || '').toLowerCase()}`;

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

function detectMusicGenreBySource({ source, text = '', url = '' }) {
    const t = (text || '').toLowerCase();
    if (t.includes('fado')) return 'Fado';
    if (t.includes('rock')) return 'Rock';
    if (t.includes('jazz')) return 'Jazz';
    if (t.includes('pop')) return 'Pop';
    if (t.includes('house')) return 'House';
    if (t.includes('reggae')) return 'Reggae';
    if (/(hip-hop|hiphop|rap)/.test(t)) return 'Hip-Hop';
    if (/(samba|carnaval|bossa nova)/.test(t)) return 'Samba/Carnaval';

    const combined = `${text || ''} ${url || ''}`.toLowerCase();
    if (source === 'Fever' && /candlelight/.test(combined)) return 'Clássico';
    if (source === 'Eventbrite' && /afrobeats|reggae|salsa|bachata/.test(combined)) return 'World/Latin';
    return undefined;
}

const cases = [
    { source: 'Fever', title: 'Candlelight: Vivaldi | Noites de Música Clássica', expectedCategory: 'Música', expectedGenre: 'Clássico' },
    { source: 'Fever', title: 'Lisbon Brunch & Beats', description: 'brunch, cocktails and DJs', expectedCategory: 'Gastronomia' },
    { source: 'BOL', title: 'Stand-up Comedy Night', expectedCategory: 'Teatro' },
    { source: 'BOL', title: 'Concerto: Orquestra Sinfónica', expectedCategory: 'Música' },
    { source: 'Eventbrite', title: 'React Workshop: Build a SPA', expectedCategory: 'Conferência' },
    { source: 'Eventbrite', title: 'Taste of Lisbon — wine tasting', expectedCategory: 'Gastronomia' },
];

let failed = 0;
for (const c of cases) {
    const txt = `${c.title} ${c.description || ''}`;
    const cat = detectCategoryBySource({ source: c.source, text: txt });
    const genre = detectMusicGenreBySource({ source: c.source, text: txt });

    console.log(`${c.source} | ${c.title}`);
    console.log(`  predictedCategory=${cat} expected=${c.expectedCategory}`);
    console.log(`  predictedGenre=${genre} expected=${c.expectedGenre || null}`);

    if ((cat || null) !== (c.expectedCategory || null) || (genre || null) !== (c.expectedGenre || null)) {
        failed++;
    }
}

if (failed > 0) {
    console.error(`\n${failed} detection tests failed`);
    process.exit(1);
}
console.log('\nAll detection tests passed');
