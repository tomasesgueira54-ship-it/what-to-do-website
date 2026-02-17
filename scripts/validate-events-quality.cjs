const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'events.json');

if (!fs.existsSync(filePath)) {
    console.error('❌ data/events.json not found. Run scraper fetch first.');
    process.exit(1);
}

const events = JSON.parse(fs.readFileSync(filePath, 'utf8'));
if (!Array.isArray(events) || events.length === 0) {
    console.error('❌ data/events.json is empty.');
    process.exit(1);
}

const requiredFields = ['title', 'description', 'date', 'location', 'image', 'url', 'price'];
const optionalRichFields = ['subtitle', 'address', 'endDate'];

function hasValue(v) {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    return true;
}

function percent(value, total) {
    if (!total) return 0;
    return Math.round((value / total) * 10000) / 100;
}

function coverage(items, fields) {
    const result = {};
    for (const f of fields) {
        const filled = items.filter((e) => hasValue(e[f])).length;
        result[f] = {
            filled,
            total: items.length,
            pct: percent(filled, items.length),
        };
    }
    return result;
}

function printCoverage(label, cov) {
    console.log(`\n${label}`);
    for (const [field, stats] of Object.entries(cov)) {
        console.log(`- ${field}: ${stats.filled}/${stats.total} (${stats.pct}%)`);
    }
}

function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function subtitleSemanticStats(items) {
    const withSubtitle = items.filter((e) => hasValue(e.subtitle));
    const meaningful = withSubtitle.filter((e) => {
        const subtitle = normalizeText(e.subtitle);
        const title = normalizeText(e.title);
        return subtitle.length >= 12 && subtitle !== title;
    });

    const duplicates = withSubtitle.length - meaningful.length;

    return {
        total: items.length,
        withSubtitle: withSubtitle.length,
        meaningful: meaningful.length,
        duplicates,
        meaningfulPct: percent(meaningful.length, items.length),
        duplicatePct: percent(duplicates, withSubtitle.length || 1),
    };
}

const bySource = events.reduce((acc, ev) => {
    acc[ev.source] = acc[ev.source] || [];
    acc[ev.source].push(ev);
    return acc;
}, {});

const globalRequired = coverage(events, requiredFields);
const globalOptional = coverage(events, optionalRichFields);

printCoverage('Global Required Coverage', globalRequired);
printCoverage('Global Rich-Field Coverage', globalOptional);

let failed = false;

const thresholds = {
    title: 99,
    description: 92,
    date: 96,
    location: 93,
    image: 92,
    url: 99,
    price: 85,
};

for (const [field, minPct] of Object.entries(thresholds)) {
    if (globalRequired[field].pct < minPct) {
        failed = true;
        console.error(`❌ Global coverage below threshold for ${field}: ${globalRequired[field].pct}% < ${minPct}%`);
    }
}

const subtitleTargets = {
    BOL: 90,
    Eventbrite: 90,
    Meetup: 90,
};

const subtitleSemanticTargets = {
    BOL: 85,
    Eventbrite: 90,
    Meetup: 90,
};

for (const [source, minPct] of Object.entries(subtitleTargets)) {
    const rows = bySource[source] || [];
    if (!rows.length) continue;
    const cov = coverage(rows, ['subtitle']);
    const pct = cov.subtitle.pct;
    console.log(`- subtitle target (${source}): ${pct}% (target ${minPct}%)`);
    if (pct < minPct) {
        failed = true;
        console.error(`❌ ${source} subtitle coverage below target: ${pct}% < ${minPct}%`);
    }
}

console.log('\nSubtitle Semantic Quality');
for (const [source, minPct] of Object.entries(subtitleSemanticTargets)) {
    const rows = bySource[source] || [];
    if (!rows.length) continue;
    const stats = subtitleSemanticStats(rows);
    console.log(
        `- ${source}: meaningful ${stats.meaningful}/${stats.total} (${stats.meaningfulPct}%), duplicate/weak among subtitles ${stats.duplicatePct}%`,
    );
    if (stats.meaningfulPct < minPct) {
        failed = true;
        console.error(`❌ ${source} semantic subtitle quality below target: ${stats.meaningfulPct}% < ${minPct}%`);
    }
}

for (const [source, rows] of Object.entries(bySource)) {
    const covReq = coverage(rows, requiredFields);
    printCoverage(`Source: ${source}`, covReq);

    // enforce a minimum baseline per source to detect scraper regressions
    const sourceThresholds = {
        title: 95,
        description: 75,
        date: 85,
        location: 75,
        image: 75,
        url: 99,
    };

    for (const [field, minPct] of Object.entries(sourceThresholds)) {
        if (covReq[field].pct < minPct) {
            failed = true;
            console.error(`❌ ${source} coverage below threshold for ${field}: ${covReq[field].pct}% < ${minPct}%`);
        }
    }
}

if (failed) {
    console.error('\n❌ Scraper quality gate failed. Improve extraction or enrichment before publishing events.json.');
    process.exit(1);
}

console.log('\n✅ Scraper quality gate passed.');
