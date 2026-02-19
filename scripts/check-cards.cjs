const { chromium } = require('playwright');

const PASS = '✅';
const FAIL = '❌';
const WARN = '⚠️ ';

function check(label, value, passing) {
    const icon = passing ? PASS : FAIL;
    console.log(`  ${icon} ${label}: ${value}`);
    return passing ? 0 : 1;
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    let totalFails = 0;

    // ── 1. EVENTS LIST PAGE ──────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════');
    console.log('  EVENTS LIST PAGE  /pt/events');
    console.log('════════════════════════════════════════════════════');

    await page.goto('http://localhost:3000/pt/events', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('a[href*="/pt/events/"]', { timeout: 10000 }).catch(() => { });
    await page.waitForTimeout(1500);

    const cards = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/pt/events/"]')).slice(0, 8);
        return links.map(link => {
            const img = link.querySelector('img');
            const imgPlaceholder = link.querySelector('[class*="text-4xl"]');
            const title = link.querySelector('h3');
            const descEl = link.querySelector('p[class*="line-clamp"]');
            const priceEl = link.querySelector('[class*="tracking-wider"][class*="border"]');
            const timeEl = link.querySelector('[class*="font-bold text-white tracking-wide"]');
            const locationEl = link.querySelector('[class*="truncate"]');
            const categoryEl = link.querySelector('[class*="uppercase tracking-wide"]');
            const favoriteBtn = link.querySelector('button[aria-label]');
            const dateBadge = link.querySelector('[class*="text-xl font-black"]');
            const endDateEl = link.querySelector('[class*="text-brand-grey mt-0.5"]');

            // broken images: naturalWidth === 0 after load
            const imgLoaded = img ? (img.complete && img.naturalWidth > 0) : null;

            return {
                href: link.href.replace(/.*\/pt\/events\//, '').slice(0, 36),
                title: title ? title.innerText.trim() : null,
                description: descEl ? descEl.innerText.trim().slice(0, 100) : null,
                price: priceEl ? priceEl.innerText.replace(/\s+/g, ' ').trim() : null,
                time: timeEl ? timeEl.innerText.trim() : null,
                location: locationEl ? locationEl.innerText.replace(/\s+/g, ' ').trim() : null,
                category: categoryEl ? categoryEl.innerText.trim() : null,
                favBtn: !!favoriteBtn,
                dateBadge: dateBadge ? dateBadge.innerText.trim() : null,
                hasImage: !!img,
                imgLoaded,
                hasPlaceholderIcon: !!imgPlaceholder,
                endDate: endDateEl ? endDateEl.innerText.trim() : null,
            };
        });
    });

    totalFails += check('Cards found', cards.length, cards.length >= 6);

    let descOk = 0, priceOk = 0, timeOk = 0, locOk = 0, imgOk = 0, titleOk = 0, favOk = 0, brokenImgs = 0;
    const sampleCards = [];

    for (const c of cards) {
        if (c.title) titleOk++;
        if (c.description && !c.description.includes('Description available')) descOk++;
        if (c.price && c.price.length > 1) priceOk++;
        if (c.time && c.time.length > 1) timeOk++;
        if (c.location && c.location.length > 1) locOk++;
        if (c.hasImage || c.hasPlaceholderIcon) imgOk++;
        if (c.favBtn) favOk++;
        if (c.hasImage && c.imgLoaded === false) brokenImgs++;
        sampleCards.push(c);
    }

    const n = cards.length;
    totalFails += check(`Titles present`, `${titleOk}/${n}`, titleOk === n);
    totalFails += check(`Descriptions (real, not placeholder)`, `${descOk}/${n}`, descOk >= Math.floor(n * 0.8));
    totalFails += check(`Prices shown`, `${priceOk}/${n}`, priceOk === n);
    totalFails += check(`Times shown`, `${timeOk}/${n}`, timeOk === n);
    totalFails += check(`Locations shown`, `${locOk}/${n}`, locOk === n);
    totalFails += check(`Images or fallback icon`, `${imgOk}/${n}`, imgOk === n);
    totalFails += check(`Favorite button present`, `${favOk}/${n}`, favOk === n);
    totalFails += check(`Broken images (naturalWidth=0)`, brokenImgs, brokenImgs === 0);

    console.log('\n  ── Sample card details ──');
    sampleCards.slice(0, 3).forEach((c, i) => {
        console.log(`\n  Card ${i + 1} [${c.href}]`);
        console.log(`    Title    : ${c.title}`);
        console.log(`    Date     : ${c.dateBadge}  Time: ${c.time}  EndDate: ${c.endDate || '—'}`);
        console.log(`    Price    : ${c.price}`);
        console.log(`    Location : ${c.location}`);
        console.log(`    Category : ${c.category || '—'}`);
        console.log(`    Desc     : ${c.description ? c.description.slice(0, 90) + '…' : 'MISSING'}`);
        console.log(`    Image    : ${c.hasImage ? (c.imgLoaded ? 'loaded ✓' : 'BROKEN ✗') : (c.hasPlaceholderIcon ? 'placeholder icon' : 'none')}`);
    });

    // Price variety check — should see Grátis AND paid prices
    const prices = cards.map(c => c.price).filter(Boolean);
    const hasGratis = prices.some(p => p.toLowerCase().includes('grátis') || p.toLowerCase().includes('free'));
    const hasPaid = prices.some(p => /\d/.test(p));
    console.log(`\n  ${WARN} Price variety (Grátis present: ${hasGratis}, Paid prices: ${hasPaid})`);
    const hasFreeText = prices.some(p => p.trim().toLowerCase() === 'free');
    totalFails += check('"free" not leaking into PT UI', hasFreeText ? prices.filter(p => p.trim().toLowerCase() === 'free') : 'none', !hasFreeText);

    // ── 2. EVENT DETAIL PAGE ─────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════');
    console.log('  EVENT DETAIL PAGE (first card)');
    console.log('════════════════════════════════════════════════════');

    const firstHref = cards[0]?.href;
    if (firstHref) {
        await page.goto(`http://localhost:3000/pt/events/${firstHref}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1500);

        const detail = await page.evaluate(() => {
            const body = document.body.innerText;
            const img = document.querySelector('img[alt]');
            const imgOk = img ? (img.complete && img.naturalWidth > 0) : false;
            const h1 = document.querySelector('h1');
            // collect all text to find price, location, description, date
            return {
                title: h1 ? h1.innerText.trim() : null,
                imgSrc: img ? img.src.slice(0, 80) : null,
                imgLoaded: imgOk,
                hasDate: /\d{1,2}[\s\/]\w+|\w+\s\d{4}/.test(body),
                hasPrice: /grátis|€|\$|free|A confirmar|price/i.test(body),
                hasLocation: /lisboa|porto|faro|braga|setúbal|aveiro|coimbra|funchal/i.test(body),
                hasDescription: body.length > 300,
                bodyLength: body.length,
            };
        });

        totalFails += check('Detail: title', detail.title || 'missing', !!detail.title);
        totalFails += check('Detail: image loaded', detail.imgSrc ? (detail.imgLoaded ? 'yes' : 'BROKEN') : 'no image', detail.imgLoaded || !detail.imgSrc);
        totalFails += check('Detail: date visible', detail.hasDate, detail.hasDate);
        totalFails += check('Detail: price visible', detail.hasPrice, detail.hasPrice);
        totalFails += check('Detail: location mentioned', detail.hasLocation, detail.hasLocation);
        totalFails += check('Detail: description (body length)', `${detail.bodyLength} chars`, detail.hasDescription);
        console.log(`  Title: ${detail.title}`);
        console.log(`  Image: ${detail.imgSrc}`);
    }

    // ── 3. SECOND CARD DETAIL (with price to verify) ─────────────────────────
    const paidCard = sampleCards.find(c => c.price && /\d/.test(c.price));
    if (paidCard) {
        console.log('\n════════════════════════════════════════════════════');
        console.log(`  PAID EVENT DETAIL [${paidCard.href}]`);
        console.log('════════════════════════════════════════════════════');
        await page.goto(`http://localhost:3000/pt/events/${paidCard.href}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1000);
        const pd = await page.evaluate(() => {
            const body = document.body.innerText;
            return {
                hasPrice: /€|\$|[0-9]+[,.]?[0-9]*\s*€/.test(body),
                priceSnippet: (body.match(/[0-9]+[,.]?[0-9]*\s*€/) || [''])[0],
            };
        });
        totalFails += check('Paid detail: price with € visible', pd.priceSnippet || 'not found', pd.hasPrice);
    }

    // ── 4. CHECK EN LOCALE ───────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════');
    console.log('  EN LOCALE  /en/events');
    console.log('════════════════════════════════════════════════════');
    await page.goto('http://localhost:3000/en/events', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('a[href*="/en/events/"]', { timeout: 10000 }).catch(() => { });
    await page.waitForTimeout(1500);

    const enCards = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/en/events/"]')).slice(0, 4);
        return links.map(link => {
            const priceEl = link.querySelector('[class*="tracking-wider"][class*="border"]');
            const timeEl = link.querySelector('[class*="font-bold text-white tracking-wide"]');
            return {
                price: priceEl ? priceEl.innerText.replace(/\s+/g, ' ').trim() : null,
                time: timeEl ? timeEl.innerText.trim() : null,
            };
        });
    });

    const enHasFreeText = enCards.some(c => c.price?.trim().toLowerCase() === 'free');
    const enHasGratis = enCards.some(c => c.price?.toLowerCase().includes('grátis'));
    totalFails += check('EN: "Free" (not "Grátis") for free events', enHasFreeText || (!enHasGratis) ? 'ok' : 'grátis leaked', !enHasGratis);
    const enTimeTBC = enCards.some(c => c.time?.includes('Time TBC'));
    const enHoraConfirmar = enCards.some(c => c.time?.includes('Hora a confirmar'));
    totalFails += check('EN: "Time TBC" not "Hora a confirmar"', enHoraConfirmar ? 'PT text leaked!' : 'ok', !enHoraConfirmar);
    console.log(`  EN sample prices: ${enCards.map(c => c.price).join(' | ')}`);
    console.log(`  EN sample times:  ${enCards.map(c => c.time).join(' | ')}`);

    // ── 5. SUMMARY ───────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════');
    console.log(`  RESULT: ${totalFails === 0 ? '✅ ALL CHECKS PASSED' : `❌ ${totalFails} CHECK(S) FAILED`}`);
    console.log('════════════════════════════════════════════════════\n');

    await browser.close();
    process.exit(totalFails > 0 ? 1 : 0);
})().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
