const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const reportPath = path.join(process.cwd(), 'reports-links-audit.json');
if (!fs.existsSync(reportPath)) {
  console.error('reports-links-audit.json not found. Run audit-links-all first.');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const blocked = report.blocked || [];

(async function main() {
  if (!blocked.length) {
    console.log(JSON.stringify({ total: 0, okBrowser: 0, failedBrowser: 0 }, null, 2));
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });

  const results = [];

  for (let i = 0; i < blocked.length; i += 1) {
    const row = blocked[i];
    const page = await context.newPage();
    try {
      const response = await page.goto(row.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(700);

      const title = await page.title();
      const status = response ? response.status() : null;
      const hasEventHints = /event|shotgun|tickets|bilhete|lineup|venue/i.test((title || '') + ' ' + (await page.content()).slice(0, 3000));

      const okBrowser = (status && status >= 200 && status < 400 && hasEventHints) || hasEventHints;
      results.push({ url: row.url, httpStatus: status, title, okBrowser: Boolean(okBrowser) });
    } catch (error) {
      results.push({ url: row.url, httpStatus: null, title: '', okBrowser: false, error: String(error?.message || error) });
    } finally {
      await page.close();
    }

    if ((i + 1) % 10 === 0 || i + 1 === blocked.length) {
      console.log(`progress: ${i + 1}/${blocked.length}`);
    }
  }

  await context.close();
  await browser.close();

  const okBrowser = results.filter((r) => r.okBrowser).length;
  const failedBrowser = results.length - okBrowser;

  const merged = {
    ...report,
    browserRecheck: {
      total: results.length,
      okBrowser,
      failedBrowser,
      results,
    },
  };

  fs.writeFileSync(reportPath, JSON.stringify(merged, null, 2));

  console.log(JSON.stringify({ total: results.length, okBrowser, failedBrowser, reportPath }, null, 2));
})();
