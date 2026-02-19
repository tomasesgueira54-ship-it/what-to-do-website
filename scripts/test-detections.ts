import { detectCategoryBySource, detectMusicGenreBySource } from './scrapers/utils';

type Case = {
    source: string;
    title: string;
    description?: string;
    url?: string;
    expectedCategory?: string | null;
    expectedGenre?: string | null;
};

const cases: Case[] = [
    {
        source: 'Fever',
        title: 'Candlelight: Vivaldi | Noites de Música Clássica',
        expectedCategory: 'Música',
        expectedGenre: 'Clássico',
    },
    {
        source: 'Fever',
        title: 'Lisbon Brunch & Beats',
        description: 'brunch, cocktails and DJs',
        expectedCategory: 'Gastronomia',
    },
    {
        source: 'BOL',
        title: 'Stand-up Comedy Night',
        expectedCategory: 'Teatro',
    },
    {
        source: 'BOL',
        title: 'Concerto: Orquestra Sinfónica',
        expectedCategory: 'Música',
    },
    {
        source: 'Eventbrite',
        title: 'React Workshop: Build a SPA',
        expectedCategory: 'Conferência',
    },
    {
        source: 'Eventbrite',
        title: 'Taste of Lisbon — wine tasting',
        expectedCategory: 'Gastronomia',
    },
    {
        source: 'Shotgun',
        title: 'Warehouse Rave: Hard Techno All Night',
        expectedCategory: 'Discoteca/Nightlife',
        expectedGenre: 'Hard Techno',
    },
];

let failed = 0;
for (const c of cases) {
    const txt = `${c.title} ${c.description || ''} ${c.url || ''}`;
    const cat = detectCategoryBySource({ source: c.source as any, text: txt, url: c.url });
    const genre = detectMusicGenreBySource({ source: c.source as any, text: txt, url: c.url });

    const catOk = (cat || null) === (c.expectedCategory || null);
    const genOk = (genre || null) === (c.expectedGenre || null);

    console.log(`${c.source} | ${c.title}`);
    console.log(`  predictedCategory=${cat} expected=${c.expectedCategory}`);
    console.log(`  predictedGenre=${genre} expected=${c.expectedGenre}`);

    if (!catOk || !genOk) {
        failed++;
    }
}

if (failed > 0) {
    console.error(`\n${failed} detection tests failed`);
    process.exit(1);
}
console.log('\nAll detection tests passed');
