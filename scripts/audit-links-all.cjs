const fs = require('fs');
const path = require('path');
const axios = require('axios');

const eventsPath = path.join(process.cwd(), 'data', 'events.json');
if (!fs.existsSync(eventsPath)) {
  console.error('data/events.json not found');
  process.exit(2);
}

const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
const uniqueUrls = [...new Set(events.map((e) => e.url).filter(Boolean))];

const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY || 20);
const RETRIES = Number(process.env.AUDIT_RETRIES || 2);
const TIMEOUT = Number(process.env.AUDIT_TIMEOUT_MS || 12000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function probe(url) {
  let lastError = null;

  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await axios.get(url, {
        timeout: TIMEOUT,
        maxRedirects: 5,
        validateStatus: () => true,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; whattodo-audit/1.0)' },
      });

      const status = response.status;
      if (status >= 200 && status < 400) return { url, status, kind: 'ok' };
      if (status === 403 || status === 429) return { url, status, kind: 'blocked' };
      if (status === 404 || status === 410) return { url, status, kind: 'dead' };
      return { url, status, kind: 'other' };
    } catch (error) {
      lastError = error;
      await sleep(500 * (attempt + 1));
    }
  }

  return { url, status: null, kind: 'error', error: String(lastError?.message || lastError) };
}

(async function main() {
  const results = [];
  let index = 0;

  async function worker() {
    while (true) {
      const current = index;
      index += 1;
      if (current >= uniqueUrls.length) return;

      const result = await probe(uniqueUrls[current]);
      results.push(result);

      if ((current + 1) % 50 === 0) {
        console.log(`progress: ${current + 1}/${uniqueUrls.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const summary = results.reduce((acc, row) => {
    acc[row.kind] = (acc[row.kind] || 0) + 1;
    return acc;
  }, {});

  const report = {
    generatedAt: new Date().toISOString(),
    totalUrls: uniqueUrls.length,
    summary,
    dead: results.filter((r) => r.kind === 'dead'),
    blocked: results.filter((r) => r.kind === 'blocked'),
    errors: results.filter((r) => r.kind === 'error'),
    other: results.filter((r) => r.kind === 'other'),
  };

  const outPath = path.join(process.cwd(), 'reports-links-audit.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify({
    totalUrls: report.totalUrls,
    summary: report.summary,
    dead: report.dead.length,
    blocked: report.blocked.length,
    errors: report.errors.length,
    other: report.other.length,
    outPath,
  }, null, 2));
})();
