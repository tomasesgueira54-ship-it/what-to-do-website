const { chromium } = require('playwright');

(async () => {
    const base = process.env.BASE_URL || 'http://localhost:3001';
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('request', (req) => {
        console.log('REQUEST =>', req.method(), req.url());
    });
    page.on('response', (res) => {
        console.log('RESPONSE <=', res.status(), res.url());
    });

    await page.goto(base + '/pt', { waitUntil: 'networkidle' });

    const email = `pw-debug+${Date.now()}@whattodo.test`;
    await page.fill('form input[type="text"]', 'Debug');
    await page.fill('form input[type="email"]', email);
    const gdpr = await page.$('form input[type="checkbox"]');
    if (gdpr) await gdpr.check();

    console.log('Submitting form...');
    await page.click('form button[type="submit"]');

    // wait a bit for requests
    await page.waitForTimeout(2000);
    await browser.close();
})();