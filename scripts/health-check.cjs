#!/usr/bin/env node
/**
 * Health check orchestrator
 * - Runs `npm run quality:events` (data quality + subtitle semantic checks)
 * - Runs `npm run budget:perf` (payload budget guard)
 * - Runs `npm run build` (sanity)
 * - Runs site audit (scripts/audit-links-playwright.cjs)
 * - Runs subscribe form test (scripts/playwright-subscribe-test.cjs)
 * - Runs image optimizer checks (scripts/check-image-opt.cjs)
 *
 * Usage: BASE_URL=http://localhost:3001 npm run health
 */
const { spawn } = require('child_process');
const http = require('http');
const HEALTH_AUDIT_RETRIES = Number(process.env.HEALTH_AUDIT_RETRIES || 1);

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

async function waitForServer(url, maxAttempts = 30, delayMs = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const up = await probe(url).catch(() => false);
        if (up) return true;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return false;
}

async function runWithRetries(cmd, args, retries, opts = {}) {
    let lastCode = 1;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
        lastCode = await run(cmd, args, opts);
        if (lastCode === 0) return 0;
        if (attempt < retries) {
            console.warn(`Step failed with code ${lastCode}. Retrying (${attempt + 1}/${retries})...`);
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
    }
    return lastCode;
}

(async function main() {
    const envBase = process.env.BASE_URL;
    let base = envBase || 'http://localhost:3000';
    const alt = 'http://localhost:3001';
    const managedPort = Number(process.env.HEALTH_SERVER_PORT || 3001);
    const managedBase = `http://localhost:${managedPort}`;
    let managedServer = null;

    const okBase = await probe(base).catch(() => false);
    if (!okBase) {
        const okAlt = await probe(alt).catch(() => false);
        if (okAlt) base = alt;
    }

    console.log(`Using BASE_URL=${base}`);

    const results = [];

    console.log('\n1) Running events quality gate (coverage + semantic subtitle checks)');
    results.push({ name: 'quality:events', code: await run('npm', ['run', 'quality:events']) });

    console.log('\n2) Running perf payload budget checks');
    results.push({ name: 'budget:perf', code: await run('npm', ['run', 'budget:perf']) });

    console.log('\n3) Running build (next build)');
    results.push({ name: 'build', code: await run('npm', ['run', 'build']) });

    let runtimeBase = base;
    const runtimeServerUp = await probe(runtimeBase).catch(() => false);
    if (!runtimeServerUp) {
        console.log(`\nNo server available at ${runtimeBase}. Starting managed production server on ${managedBase} ...`);
        managedServer = spawn('npm', ['run', 'start', '--', '--port', String(managedPort)], {
            stdio: 'inherit',
            shell: process.platform === 'win32',
            env: { ...process.env, NODE_ENV: 'production' },
        });

        const up = await waitForServer(managedBase);
        if (!up) {
            console.error(`Managed server did not become ready at ${managedBase}.`);
            try { managedServer.kill(); } catch (e) { }
            process.exit(2);
        }

        runtimeBase = managedBase;
    }

    console.log('\n4) Running site audit (Playwright crawl)');
    results.push({ name: 'audit', code: await runWithRetries('node', ['scripts/audit-links-playwright.cjs'], HEALTH_AUDIT_RETRIES, { env: { ...process.env, BASE_URL: runtimeBase, MAX_PAGES: process.env.MAX_PAGES || '500', EVENT_SEED_COUNT: process.env.EVENT_SEED_COUNT || '200' } }) });

    console.log('\n5) Running subscribe form test (Playwright)');
    results.push({ name: 'subscribe-test', code: await run('node', ['scripts/playwright-subscribe-test.cjs'], { env: { ...process.env, BASE_URL: runtimeBase } }) });

    console.log('\n6) Running image optimizer checks');
    results.push({ name: 'image-opt', code: await run('node', ['scripts/check-image-opt.cjs'], { env: { ...process.env, BASE_URL: runtimeBase } }) });

    console.log('\nSummary:');
    let failed = 0;
    for (const r of results) {
        console.log(` - ${r.name}: ${r.code === 0 ? 'OK' : 'FAIL (code ' + r.code + ')'}`);
        if (r.code !== 0) failed++;
    }

    if (managedServer) {
        try {
            managedServer.kill();
        } catch (e) {
            // best effort cleanup
        }
    }

    process.exit(failed === 0 ? 0 : 1);
})();