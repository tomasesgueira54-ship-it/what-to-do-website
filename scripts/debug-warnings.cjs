const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    // 1. Check event detail price selector
    console.log('\n=== EVENT DETAIL PRICE ===');
    await page.goto('http://localhost:3000/pt/events/041dbee7-41b7-43d0-a076-93e8e4a9ee8c', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const priceEls = await page.$$eval('[class*="price"], [class*="ticket"], [class*="Price"], [class*="Ticket"]', els => els.map(el => ({ class: el.className.slice(0, 60), text: el.textContent?.trim().slice(0, 30) })));
    console.log('Price elements:', priceEls.slice(0, 5));
    // Also check innerText for price-like content
    const priceText = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('*'));
        return all.filter(el => el.children.length === 0 && /€|grátis|free|preço/i.test(el.textContent || '')).slice(0, 3).map(el => ({ tag: el.tagName, class: el.className?.slice(0, 40), text: el.textContent?.trim().slice(0, 30) }));
    });
    console.log('Price text elements:', priceText);

    // 2. Map view - check if leaflet loads with wait
    console.log('\n=== MAP VIEW ===');
    await page.goto('http://localhost:3000/pt/events', { waitUntil: 'networkidle' });
    try { await page.waitForSelector('button[aria-label="Map View"]', { timeout: 8000 }); } catch { }
    const mapBtn = await page.$('button[aria-label="Map View"]');
    if (mapBtn) {
        await mapBtn.click();
        console.log('Map button clicked, waiting 4s for Leaflet...');
        await page.waitForTimeout(4000);
        const leaflet = await page.$('.leaflet-container');
        const anyMap = await page.$('[class*="EventMap"], [class*="map-container"]');
        const mapCanvas = await page.$('canvas');
        console.log('leaflet-container:', leaflet ? 'FOUND' : 'not found');
        console.log('any map element:', anyMap ? 'FOUND' : 'not found');
        console.log('canvas:', mapCanvas ? 'FOUND' : 'not found');
        // Check all classes with "map"
        const mapEls = await page.$$eval('[class]', els => els.filter(el => el.className.toLowerCase().includes('map')).map(el => el.className.slice(0, 60)).slice(0, 5));
        console.log('Elements with "map" in class:', mapEls);
    } else {
        console.log('Map button not found');
    }

    // 3. My Agenda favorites - click heart, wait, navigate
    console.log('\n=== MY AGENDA FAVORITES ===');
    await page.goto('http://localhost:3000/pt/events', { waitUntil: 'networkidle' });
    try { await page.waitForSelector('button[aria-pressed]', { timeout: 8000 }); } catch { }
    const hearts = await page.$$('button[aria-pressed]');
    console.log('Heart buttons found:', hearts.length);
    if (hearts.length > 0) {
        await hearts[0].click();
        console.log('Clicked first heart');
        await page.waitForTimeout(1500);
        // Check localStorage
        const favs = await page.evaluate(() => localStorage.getItem('what-to-do-favorites'));
        console.log('localStorage favorites:', favs?.slice(0, 100));
        await page.goto('http://localhost:3000/pt/my-agenda', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        const cards = await page.$$('a[href*="/events/"]');
        console.log('Favorite cards on my-agenda:', cards.length);
        const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
        console.log('Body:', bodyText.replace(/\n/g, ' | ').slice(0, 150));
    }

    await browser.close();
    console.log('\nDone.');
})().catch(e => console.error('Error:', e.message));
