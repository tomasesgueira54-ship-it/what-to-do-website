#!/usr/bin/env node
/**
 * Health check orchestrator
 * - Runs `npm run quality:events` (data quality + subtitle semantic checks)
 * - Runs `npm run build` (sanity)
 * - Runs site audit (scripts/audit-links-playwright.cjs)
 * - Runs subscribe form test (scripts/playwright-subscribe-test.cjs)
 * - Runs image optimizer checks (scripts/check-image-opt.cjs)
 *
 * Usage: BASE_URL=http://localhost:3001 npm run health
 */
const { spawn } = require('child_process');
const http = require('http');

function run(cmd, args, opts = {}) {
    return new Promise((resolve) => {
        const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
        p.on('close', (code) => resolve(code ?? 0));
        p.on('error', () => resolve(1));
    });
}

async function probe(url, timeout = 1500) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            req.destroy();
            resolve(true);
        });
        req.on('error', () => resolve(false));
        setTimeout(() => {
            try { req.destroy(); } catch (e) { }
            resolve(false);
        }, timeout);
    });
}

(async function main() {
    const envBase = process.env.BASE_URL;
    let base = envBase || 'http://localhost:3000';
    const alt = 'http://localhost:3001';

    const okBase = await probe(base).catch(() => false);
    if (!okBase) {
        const okAlt = await probe(alt).catch(() => false);
        if (okAlt) base = alt;
    }

    console.log(`Using BASE_URL=${base}`);

    // Check server reachable before running runtime tests
    const serverUp = await probe(base).catch(() => false);
    if (!serverUp) {
        console.error(`No running dev server detected at ${base}. Start it with 'npm run dv' or set BASE_URL to a running instance.`);
        process.exit(2);
    }

    const results = [];

    console.log('\n1) Running events quality gate (coverage + semantic subtitle checks)');
    results.push({ name: 'quality:events', code: await run('npm', ['run', 'quality:events']) });

    console.log('\n2) Running build (next build)');
    results.push({ name: 'build', code: await run('npm', ['run', 'build']) });

    console.log('\n3) Running site audit (Playwright crawl)');
    results.push({ name: 'audit', code: await run('node', ['scripts/audit-links-playwright.cjs'], { env: { ...process.env, BASE_URL: base, MAX_PAGES: process.env.MAX_PAGES || '120' } }) });

    console.log('\n4) Running subscribe form test (Playwright)');
    results.push({ name: 'subscribe-test', code: await run('node', ['scripts/playwright-subscribe-test.cjs'], { env: { ...process.env, BASE_URL: base } }) });

    console.log('\n5) Running image optimizer checks');
    results.push({ name: 'image-opt', code: await run('node', ['scripts/check-image-opt.cjs'], { env: { ...process.env, BASE_URL: base } }) });

    console.log('\nSummary:');
    let failed = 0;
    for (const r of results) {
        console.log(` - ${r.name}: ${r.code === 0 ? 'OK' : 'FAIL (code ' + r.code + ')'}`);
        if (r.code !== 0) failed++;
    }

    process.exit(failed === 0 ? 0 : 1);
})();