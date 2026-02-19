const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3010';
const MAX_PAGES = Number(process.env.MAX_PAGES || 500);
const EVENT_SEED_COUNT = Number(process.env.EVENT_SEED_COUNT || 200);
const START_PATHS = [
    '/pt',
    '/en',
    '/pt/events',
    '/en/events',
    '/pt/episodes',
    '/en/episodes',
    '/pt/blog',
    '/en/blog',
    '/pt/about',
    '/en/about',
    '/pt/privacy',
    '/en/privacy',
    '/pt/terms',
    '/en/terms',
    '/',
    '/events',
    '/episodes',
    '/blog',
    '/about',
];

function loadEventSeedPaths() {
    const eventsFilePath = path.join(process.cwd(), 'data', 'events.json');
    if (!fs.existsSync(eventsFilePath)) return [];

    try {
        const parsed = JSON.parse(fs.readFileSync(eventsFilePath, 'utf8'));
        if (!Array.isArray(parsed)) return [];

        const ids = parsed
            .map((event) => event?.id)
            .filter(Boolean)
            .slice(0, EVENT_SEED_COUNT);

        const seededPaths = [];
        for (const id of ids) {
            seededPaths.push(`/pt/events/${id}`);
            seededPaths.push(`/en/events/${id}`);
        }

        return seededPaths;
    } catch {
        return [];
    }
}

function normalizePath(href) {
    if (!href) return null;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
    if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
            const u = new URL(href);
            const base = new URL(BASE_URL);
            if (u.host !== base.host) return null;
            return u.pathname;
        } catch {
            return null;
        }
    }
    if (href.startsWith('#')) return null;
    if (!href.startsWith('/')) return null;
    try {
        const u = new URL(href, BASE_URL);
        return u.pathname;
    } catch {
        return href;
    }
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const queue = [...new Set([...START_PATHS, ...loadEventSeedPaths()])];
    const visited = new Set();
    const discovered = new Set(queue);
    const issues = [];

    async function visit(path) {
        const url = `${BASE_URL}${path}`;
        const pageErrors = [];
        const failedRequests = [];
        const badResponses = [];

        const onConsole = (msg) => {
            if (msg.type() === 'error') {
                pageErrors.push(msg.text());
            }
        };

        const onRequestFailed = (request) => {
            const errorText = request.failure()?.errorText || 'failed';
            const requestUrl = request.url();

            if (errorText.includes('ERR_ABORTED') && requestUrl.includes('_rsc=')) {
                return;
            }

            if (errorText.includes('ERR_ABORTED') && /\.mp4(\?|$)/i.test(requestUrl)) {
                return;
            }

            if (errorText.includes('ERR_ABORTED') && /https?:\/\/(www\.)?youtube\.com\//i.test(requestUrl)) {
                return;
            }

            if (errorText.includes('ERR_ABORTED') && /https?:\/\/youtubei\.googleapis\.com\//i.test(requestUrl)) {
                return;
            }

            failedRequests.push(`${request.method()} ${requestUrl} :: ${errorText}`);
        };

        const onResponse = (response) => {
            const status = response.status();
            if (status >= 400) {
                const responseUrl = response.url();
                if (responseUrl.startsWith(BASE_URL)) {
                    badResponses.push(`${status} ${responseUrl}`);
                }
            }
        };

        page.on('console', onConsole);
        page.on('requestfailed', onRequestFailed);
        page.on('response', onResponse);

        try {
            const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
            if (!resp) {
                issues.push({ path, type: 'navigation', details: 'No response returned' });
            } else if (resp.status() >= 400) {
                issues.push({ path, type: 'status', details: `HTTP ${resp.status()} at ${url}` });
            }

            const hrefs = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.getAttribute('href')).filter(Boolean));
            for (const href of hrefs) {
                const normalized = normalizePath(href);
                if (normalized && !discovered.has(normalized)) {
                    discovered.add(normalized);
                    queue.push(normalized);
                }
            }

            for (const err of pageErrors) {
                issues.push({ path, type: 'console', details: err });
            }
            for (const req of failedRequests) {
                issues.push({ path, type: 'requestfailed', details: req });
            }
            for (const bad of badResponses) {
                issues.push({ path, type: 'badresponse', details: bad });
            }
        } catch (err) {
            issues.push({ path, type: 'exception', details: err.message || String(err) });
        } finally {
            page.off('console', onConsole);
            page.off('requestfailed', onRequestFailed);
            page.off('response', onResponse);
        }
    }

    while (queue.length && visited.size < MAX_PAGES) {
        const next = queue.shift();
        if (visited.has(next)) continue;
        visited.add(next);
        await visit(next);
    }

    await browser.close();

    const dedup = [];
    const seen = new Set();
    for (const i of issues) {
        const key = `${i.path}|${i.type}|${i.details}`;
        if (!seen.has(key)) {
            seen.add(key);
            dedup.push(i);
        }
    }

    if (dedup.length === 0) {
        console.log(`✅ Audit OK. Pages visited: ${visited.size}.`);
        if (queue.length > 0) {
            console.log(`ℹ️ Crawl capped at MAX_PAGES=${MAX_PAGES}. Remaining queued paths: ${queue.length}.`);
        }
        process.exit(0);
    }

    console.error(`❌ Audit found ${dedup.length} issue(s). Pages visited: ${visited.size}.`);
    for (const issue of dedup) {
        console.error(`- [${issue.type}] ${issue.path} -> ${issue.details}`);
    }
    process.exit(1);
})();
