const fs = require('fs');
const events = JSON.parse(fs.readFileSync('./data/events.json', 'utf8'));

// 1. Contar eventos com "Check site"
const checkSite = events.filter(e => e.price === 'Check site');
console.log('=== PRICE ISSUES ===');
console.log('Total events:', events.length);
console.log('Check site count:', checkSite.length, `(${(checkSite.length / events.length * 100).toFixed(1)}%)`);
console.log('By source with "Check site":', Object.entries(checkSite.reduce((acc, e) => { acc[e.source] = (acc[e.source] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]));

// 2. Contar eventos sem description
const noDesc = events.filter(e => !e.description || e.description === 'Ver detalhes' || e.description.length < 10);
console.log('\n=== MISSING/SHORT DESCRIPTIONS ===');
console.log('Count:', noDesc.length, `(${(noDesc.length / events.length * 100).toFixed(1)}%)`);

// 3. Contar eventos sem image
const noImg = events.filter(e => !e.image || e.image.includes('placeholder'));
console.log('\n=== MISSING IMAGES ===');
console.log('Count:', noImg.length, `(${(noImg.length / events.length * 100).toFixed(1)}%)`);

// 4. Contar eventos sem endDate
const noEnd = events.filter(e => !e.endDate);
console.log('\n=== MISSING END DATE ===');
console.log('Count:', noEnd.length, `(${(noEnd.length / events.length * 100).toFixed(1)}%)`);

// 5. Checar por duplicados (mesmo título + data + location)
const seen = new Map();
const duplicates = [];
events.forEach(e => {
    const key = `${e.title}|${e.date.substring(0, 10)}|${e.location}`;
    if (seen.has(key)) {
        duplicates.push({ evt: e, duplicate_of: seen.get(key) });
    } else {
        seen.set(key, e);
    }
});
console.log('\n=== DUPLICATES (title+date+location) ===');
console.log('Count:', duplicates.length, `(${(duplicates.length / events.length * 100).toFixed(1)}%)`);
if (duplicates.length > 0) {
    console.log('Sample:', duplicates.slice(0, 3).map(d => ({ title: d.evt.title.substring(0, 40), source1: d.evt.source, source2: d.duplicate_of.source })));
}

// 6. Eventos sem URL
const noUrl = events.filter(e => !e.url);
console.log('\n=== MISSING URL ===');
console.log('Count:', noUrl.length);

// 7. Events by source
console.log('\n=== EVENTS BY SOURCE ===');
const bySource = events.reduce((acc, e) => { acc[e.source] = (acc[e.source] || 0) + 1; return acc; }, {});
Object.entries(bySource).sort((a, b) => b[1] - a[1]).forEach(([src, cnt]) => console.log(`  ${src}: ${cnt}`));

// 8. Empty/short titles
const shortTitle = events.filter(e => !e.title || e.title.trim().length < 3);
console.log('\n=== EMPTY/SHORT TITLES ===');
console.log('Count:', shortTitle.length);

// 9. Locations distribution
console.log('\n=== LOCATIONS DISTRIBUTION ===');
const byLocation = events.reduce((acc, e) => { acc[e.location] = (acc[e.location] || 0) + 1; return acc; }, {});
Object.entries(byLocation).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([loc, cnt]) => console.log(`  ${loc}: ${cnt}`));
