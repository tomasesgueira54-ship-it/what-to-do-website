const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 100)); });

    console.log('Navigating to /pt/events...');
    await page.goto('http://localhost:3000/pt/events', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded.');

    // Try waiting for first card
    try {
        await page.waitForSelector('a[href*="/events/"]', { timeout: 8000 });
        console.log('Found cards after waitForSelector');
    } catch {
        console.log('waitForSelector timed out - no cards found within 8s');
    }

    const a1 = await page.$$('a[href*="/events/"]');
    const a2 = await page.$$('a[href*="/pt/events/"]');
    const a3 = await page.$$('.grid a');
    const allA = await page.$$('a');

    console.log('a[href*=/events/]:', a1.length);
    console.log('a[href*=/pt/events/]:', a2.length);
    console.log('.grid a:', a3.length);
    console.log('all <a>:', allA.length);

    // Get first few hrefs
    const hrefs = await page.$$eval('a', els => els.map(a => a.href).filter(h => h.includes('/events')).slice(0, 5));
    console.log('Event hrefs found:', hrefs);

    // Check page title
    const h1 = await page.$eval('h1', el => el.textContent).catch(() => 'no h1');
    console.log('H1:', h1);

    // Check filtered count rendered
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300));
    console.log('Body text preview:', bodyText.replace(/\n+/g, ' | '));

    if (errors.length) console.log('Console errors:', errors.slice(0, 5));

    await browser.close();
})().catch(e => console.error('Error:', e.message));
