#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'events.json');
if (!fs.existsSync(filePath)) {
    console.error('❌ data/events.json not found.');
    process.exit(1);
}

const events = JSON.parse(fs.readFileSync(filePath, 'utf8'));
if (!Array.isArray(events) || events.length === 0) {
    console.error('❌ data/events.json is empty or invalid.');
    process.exit(1);
}

function isUpcoming(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOrStart = new Date((event.endDate && String(event.endDate).trim()) || event.date);
    return endOrStart >= today;
}

function dedupe(items) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
        const key = item.url || `${item.title}-${item.date}`;
        const alt = `${item.title}-${item.date}`;
        if (seen.has(key) || seen.has(alt)) continue;
        seen.add(key);
        seen.add(alt);
        out.push(item);
    }
    return out;
}

const upcoming = dedupe(events.filter(isUpcoming)).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
);

const BUDGET_50 = Number(process.env.PERF_BUDGET_50_BYTES || 50_000);
const BUDGET_100 = Number(process.env.PERF_BUDGET_100_BYTES || 90_000);
const BUDGET_150 = Number(process.env.PERF_BUDGET_150_BYTES || 140_000);
const BUDGET_250 = Number(process.env.PERF_BUDGET_250_BYTES || 260_000);

const checks = [
    { count: 50, budget: BUDGET_50 },
    { count: 100, budget: BUDGET_100 },
    { count: 150, budget: BUDGET_150 },
    { count: 250, budget: BUDGET_250 },
].map(({ count, budget }) => {
    const payload = JSON.stringify(upcoming.slice(0, count));
    const bytes = Buffer.byteLength(payload);
    return { count, budget, bytes, ok: bytes <= budget };
});

console.log('Performance Payload Budget');
console.log(`- upcoming events: ${upcoming.length}`);
for (const check of checks) {
    const pct = check.budget > 0 ? ((check.bytes / check.budget) * 100).toFixed(1) : '0.0';
    console.log(`- first ${check.count}: ${check.bytes} bytes (budget ${check.budget}, ${pct}%) ${check.ok ? 'OK' : 'FAIL'}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
    console.error(`\n❌ Perf budget failed (${failed.length} violation(s)).`);
    process.exit(1);
}

console.log('\n✅ Perf budget passed.');
