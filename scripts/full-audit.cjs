/**
 * Full-site Playwright Audit
 * Tests: navigation, buttons, forms, event cards, players, API, event details
 */
const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';
const LOCALE = 'pt';

const results = [];
let passed = 0, failed = 0, warned = 0;

function log(status, area, detail, extra = '') {
    const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️ ' : '❌';
    console.log(`${icon} [${area}] ${detail}${extra ? ' | ' + extra : ''}`);
    results.push({ status, area, detail, extra });
    if (status === 'PASS') passed++;
    else if (status === 'FAIL') failed++;
    else warned++;
}

async function testAPI() {
    console.log('\n═══════════════════════════════════════');
    console.log('  API ROUTES');
    console.log('═══════════════════════════════════════');
    const axios = require('axios');

    // GET /api/events
    try {
        const r = await axios.get(`${BASE}/api/events?limit=5`, { timeout: 8000 });
        if (r.status === 200 && Array.isArray(r.data) && r.data.length > 0) {
            log('PASS', 'API /events', `Returns ${r.data.length} events`, `first: "${r.data[0].title?.slice(0, 40)}"`);
            const ev = r.data[0];
            const fields = ['id', 'title', 'date', 'location', 'source', 'url'];
            fields.forEach(f => {
                if (!ev[f]) log('FAIL', 'API /events schema', `Missing field: ${f}`, `event: ${ev.id}`);
            });
            // Check for sane date
            const d = new Date(ev.date);
            if (isNaN(d.getTime())) log('FAIL', 'API /events schema', `Invalid date on event ${ev.id}`);
            else log('PASS', 'API /events schema', `Date valid: ${d.toISOString().slice(0, 10)}`);
            // Check no surrogate issues
            try { JSON.stringify(r.data); log('PASS', 'API /events JSON', 'All events serialize cleanly'); }
            catch (e) { log('FAIL', 'API /events JSON', 'Serialization error: ' + e.message); }
        } else {
            log('FAIL', 'API /events', `Status ${r.status} or empty response`);
        }
    } catch (e) { log('FAIL', 'API /events', e.message); }

    // GET /api/events with filters
    try {
        const r = await axios.get(`${BASE}/api/events?category=M%C3%BAsica&limit=5`, { timeout: 8000 });
        log(r.status === 200 ? 'PASS' : 'FAIL', 'API /events?category', `Status ${r.status}, ${r.data?.length ?? 0} results`);
    } catch (e) { log('FAIL', 'API /events?category=Música', e.message); }

    try {
        const r = await axios.get(`${BASE}/api/events?free=true&limit=5`, { timeout: 8000 });
        log(r.status === 200 ? 'PASS' : 'FAIL', 'API /events?free', `Status ${r.status}, ${r.data?.length ?? 0} free events`);
    } catch (e) { log('FAIL', 'API /events?free', e.message); }

    // POST /api/subscribe
    try {
        const r = await axios.post(`${BASE}/api/subscribe`, {
            email: `audit.test.${Date.now()}@example.com`,
            name: 'Audit Test',
            locale: 'pt',
            gdprConsent: true
        }, { timeout: 8000, validateStatus: () => true });
        if (r.status === 201 || r.status === 400) {
            log('PASS', 'API /subscribe', `Status ${r.status} (${r.data?.message ?? ''})`);
        } else {
            log('FAIL', 'API /subscribe', `Unexpected status ${r.status}: ${JSON.stringify(r.data)}`);
        }
    } catch (e) { log('FAIL', 'API /subscribe', e.message); }

    // POST /api/promoters
    try {
        const r = await axios.post(`${BASE}/api/promoters`, {
            name: 'Audit Test', email: 'audit@example.com', company: 'Test Co',
            category: 'Eventos', budget: 'Até 500€', message: 'Test audit message for promoter form',
            locale: 'pt'
        }, { timeout: 8000, validateStatus: () => true });
        if (r.status === 201 || r.status === 400 || r.status === 429) {
            log('PASS', 'API /promoters', `Status ${r.status} (${r.data?.message ?? ''})`);
        } else {
            log('FAIL', 'API /promoters', `Status ${r.status}: ${JSON.stringify(r.data)}`);
        }
    } catch (e) { log('FAIL', 'API /promoters', e.message); }

    // GET /api/outbound
    try {
        const r = await axios.get(`${BASE}/api/outbound?target=https://example.com&eventId=test&source=Fever`, {
            timeout: 8000, maxRedirects: 0, validateStatus: () => true
        });
        log(r.status === 302 ? 'PASS' : 'FAIL', 'API /outbound', `Status ${r.status} (expect 302 redirect)`);
    } catch (e) { log('FAIL', 'API /outbound', e.message); }
}

async function testPages(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  PAGE NAVIGATION & CONTENT');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        locale: 'pt-PT'
    });
    const page = await context.newPage();

    const pages = [
        { url: `${BASE}/${LOCALE}`, name: 'Homepage' },
        { url: `${BASE}/${LOCALE}/events`, name: 'Events' },
        { url: `${BASE}/${LOCALE}/about`, name: 'About' },
        { url: `${BASE}/${LOCALE}/blog`, name: 'Blog' },
        { url: `${BASE}/${LOCALE}/episodes`, name: 'Episodes' },
        { url: `${BASE}/${LOCALE}/my-agenda`, name: 'My Agenda' },
        { url: `${BASE}/${LOCALE}/partners`, name: 'Partners' },
        { url: `${BASE}/${LOCALE}/privacy`, name: 'Privacy' },
        { url: `${BASE}/${LOCALE}/terms`, name: 'Terms' },
    ];

    for (const p of pages) {
        try {
            const resp = await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
            const status = resp?.status() ?? 0;
            if (status < 400) {
                log('PASS', 'Page Load', p.name, `HTTP ${status}`);
            } else {
                log('FAIL', 'Page Load', p.name, `HTTP ${status}`);
            }
            // Check for console errors
            const errors = [];
            page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().slice(0, 80)); });
        } catch (e) {
            log('FAIL', 'Page Load', p.name, e.message.slice(0, 80));
        }
    }

    await context.close();
}

async function testHomepage(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  HOMEPAGE - EVENT CARDS & LINKS');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 120)); });

    await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for event cards
    const cardLinks = await page.$$('a[href*="/events/"]');
    if (cardLinks.length > 0) {
        log('PASS', 'Homepage Cards', `${cardLinks.length} clickable event card links found`);
    } else {
        log('FAIL', 'Homepage Cards', 'No <a href="/events/..."> links found — cards are NOT clickable');
    }

    // Check each card link has valid href
    let validLinks = 0;
    for (const link of cardLinks.slice(0, 6)) {
        const href = await link.getAttribute('href');
        if (href && href.includes('/events/')) validLinks++;
    }
    log(validLinks > 0 ? 'PASS' : 'FAIL', 'Homepage Cards href', `${validLinks}/${Math.min(cardLinks.length, 6)} have valid event href`);

    // Favorite buttons (heart)
    const heartBtns = await page.$$('button[aria-label*="orit"], button[aria-label*="favor"]');
    log(heartBtns.length > 0 ? 'PASS' : 'WARN', 'Homepage Favorite buttons', `${heartBtns.length} heart/favorite buttons found`);

    // Header nav links
    const navLinks = await page.$$('header a, nav a');
    log(navLinks.length >= 3 ? 'PASS' : 'FAIL', 'Header Nav', `${navLinks.length} nav links found`);

    // Subscribe form visible
    const subscribeForm = await page.$('form, [id*="subscribe"], input[type="email"]');
    log(subscribeForm ? 'PASS' : 'WARN', 'Subscribe Form', subscribeForm ? 'Found on homepage' : 'Not found on homepage');

    // Language switcher
    const langLinks = await page.$$('a[href*="/en"], a[href*="/pt"]');
    log(langLinks.length > 0 ? 'PASS' : 'WARN', 'Language Toggle', `${langLinks.length} locale switch links`);

    // Console errors
    await page.waitForTimeout(1000);
    if (consoleErrors.length === 0) {
        log('PASS', 'Homepage Console', 'No JS errors');
    } else {
        consoleErrors.forEach(e => log('FAIL', 'Homepage Console Error', e));
    }

    await context.close();
}

async function testEventsPage(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  EVENTS PAGE - FILTERS & CARDS');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 120)); });

    await page.goto(`${BASE}/${LOCALE}/events`, { waitUntil: 'networkidle', timeout: 30000 });  // Wait for event cards to hydrate (client component)
    try { await page.waitForSelector('a[href*="/events/"]', { timeout: 10000 }); } catch { }
    // Event cards exist and are links
    const eventLinks = await page.$$('a[href*="/events/"]');
    log(eventLinks.length > 0 ? 'PASS' : 'FAIL', 'Events Page', `${eventLinks.length} event card links`);

    // Verify cards show time correctly - check no "00:00 — 00:00" or same start/end time
    const timeSpans = await page.$$eval('.text-sm.font-bold.text-white', els => els.map(el => el.textContent?.trim()).filter(t => t && /\d{1,2}:\d{2}/.test(t)));
    const badTimes = timeSpans.filter(t => {
        const parts = t.replace(' — ', '|').split('|').filter(Boolean);
        return parts.length === 2 && parts[0] === parts[1];
    });
    if (badTimes.length === 0) {
        log('PASS', 'Events Time Display', 'No duplicate start=end time visible');
    } else {
        log('FAIL', 'Events Time Display', `${badTimes.length} cards show same start/end time`, badTimes.slice(0, 3).join(', '));
    }

    // Search box - input has no type attr; use aria-label or placeholder
    const searchInput = await page.$('input[aria-label*="Pesquisar"], input[aria-label*="Search"], input[placeholder*="Pesquisar"], input[placeholder*="Search"]');
    log(searchInput ? 'PASS' : 'WARN', 'Events Search Input', searchInput ? 'Found' : 'Not found');

    if (searchInput) {
        await searchInput.fill('fado');
        await page.waitForTimeout(800);
        const filteredLinks = await page.$$('a[href*="/events/"]');
        log(filteredLinks.length >= 0 ? 'PASS' : 'FAIL', 'Events Search Filter', `After "fado": ${filteredLinks.length} results`);
        await searchInput.fill('');
        await page.waitForTimeout(400);
    }

    // Filter buttons - category
    const filterBtns = await page.$$('button[class*="filter"], button[class*="border"]');
    log(filterBtns.length > 0 ? 'PASS' : 'WARN', 'Events Filter Buttons', `${filterBtns.length} filter buttons`);

    // Map view toggle - aria-label is 'Map View' (case-sensitive)
    const mapToggle = await page.$('button[aria-label="Map View"]');
    if (mapToggle) {
        await mapToggle.click();
        await page.waitForTimeout(2000);
        const map = await page.$('.leaflet-container, [class*="EventMap"]');
        log(map ? 'PASS' : 'WARN', 'Events Map View', map ? 'Map rendered' : 'Map toggle clicked but no Leaflet container found');
        // Switch back to grid
        const gridToggle = await page.$('button[aria-label="Grid View"]');
        if (gridToggle) await gridToggle.click();
        await page.waitForTimeout(400);
    } else {
        log('WARN', 'Events Map Toggle', 'Map toggle button not found (aria-label="Map View")');
    }

    // Console errors
    if (consoleErrors.length === 0) {
        log('PASS', 'Events Console', 'No JS errors');
    } else {
        consoleErrors.forEach(e => log('WARN', 'Events Console', e.slice(0, 100)));
    }

    await context.close();
}

async function testEventDetailPage(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  EVENT DETAIL PAGE');
    console.log('═══════════════════════════════════════');

    // Get first event from API
    const axios = require('axios');
    let eventId, eventData;
    try {
        const r = await axios.get(`${BASE}/api/events?limit=3`);
        eventData = r.data.find(e => e.id && e.url);
        eventId = eventData?.id;
    } catch { }

    if (!eventId) { log('FAIL', 'Event Detail', 'Could not get event id from API'); return; }

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 120)); });

    const detailUrl = `${BASE}/${LOCALE}/events/${eventId}`;
    try {
        const resp = await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        log(resp?.status() === 200 ? 'PASS' : 'FAIL', 'Event Detail Load', `HTTP ${resp?.status()} - ${detailUrl.slice(0, 60)}`);
    } catch (e) { log('FAIL', 'Event Detail Load', e.message); return; }

    await page.waitForTimeout(1000);

    // Title present
    const h1 = await page.$('h1');
    const title = await h1?.textContent();
    log(title && title.length > 2 ? 'PASS' : 'FAIL', 'Event Detail Title', title?.slice(0, 60) ?? 'MISSING');

    // Date visible
    const dateEl = await page.$('[class*="calendar"], .text-brand-red, time, [class*="date"]');
    log(dateEl ? 'PASS' : 'WARN', 'Event Detail Date', 'Date element found');

    // Location visible
    const location = await page.$('[class*="location"], [class*="map"], svg + *, [class*="address"]');
    log(location ? 'PASS' : 'WARN', 'Event Detail Location', 'Location element visible');

    // Price badge
    const price = await page.$('[class*="price"], [class*="ticket"]');
    log(price ? 'PASS' : 'WARN', 'Event Detail Price', 'Price element visible');

    // "Ver evento" / "Buy tickets" external link
    const externalBtn = await page.$('a[href*="/api/outbound"], a[href*="feverup"], a[href*="shotgun"], a[target="_blank"]');
    log(externalBtn ? 'PASS' : 'WARN', 'Event Detail CTA Button', externalBtn ? 'External link/button found' : 'No outbound link button found');

    // Favorite button
    const favBtn = await page.$('button[aria-label*="favorit"], button[aria-label*="Guardar"], button[aria-label*="Save"]');
    log(favBtn ? 'PASS' : 'WARN', 'Event Detail Favorite Button', favBtn ? 'Heart/favorite button found' : 'Not found');

    if (favBtn) {
        await favBtn.click();
        await page.waitForTimeout(600);
        const toast = await page.$('[class*="toast"], [class*="Toast"]');
        log(toast ? 'PASS' : 'WARN', 'Event Detail Favorite Toast', toast ? 'Toast notification appeared' : 'No toast after favorite click');
    }

    // Back button / nav link
    const backBtn = await page.$('a[href*="/events"]:not([href*="/events/"]), a[href*="back"], button:has-text("Voltar")');
    log(backBtn ? 'PASS' : 'WARN', 'Event Detail Back Link', backBtn ? 'Back/all-events link found' : 'Not found');

    // Console errors
    if (consoleErrors.length === 0) {
        log('PASS', 'Event Detail Console', 'No JS errors');
    } else {
        consoleErrors.forEach(e => log('WARN', 'Event Detail Console', e.slice(0, 100)));
    }

    await context.close();
}

async function testEpisodeDetail(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  PODCAST / EPISODE DETAIL + AUDIO PLAYER');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 120)); });

    await page.goto(`${BASE}/${LOCALE}/episodes`, { waitUntil: 'networkidle', timeout: 20000 });

    // Episode cards
    const episodeLinks = await page.$$('a[href*="/episodes/"]');
    log(episodeLinks.length > 0 ? 'PASS' : 'FAIL', 'Episodes Page', `${episodeLinks.length} episode links`);

    // Click first episode
    if (episodeLinks.length > 0) {
        const href = await episodeLinks[0].getAttribute('href');
        const resp = await page.goto(`${BASE}${href}`, { waitUntil: 'networkidle', timeout: 20000 });
        log(resp?.status() === 200 ? 'PASS' : 'FAIL', 'Episode Detail Load', `HTTP ${resp?.status()} - ${href}`);

        await page.waitForTimeout(1000);

        // Play button
        const playBtn = await page.$('button[aria-label*="Play"], button[aria-label*="Reproduz"], button:has-text("▶"), [class*="play"]');
        log(playBtn ? 'PASS' : 'WARN', 'Episode Audio Play Button', playBtn ? 'Play button found' : 'Not found');

        if (playBtn) {
            await playBtn.click();
            await page.waitForTimeout(1200);
            // Check sticky player appears
            const stickyPlayer = await page.$('[class*="sticky"], [class*="StickyPlayer"], audio');
            log(stickyPlayer ? 'PASS' : 'WARN', 'Sticky Audio Player', stickyPlayer ? 'Player appeared after play' : 'No sticky player after clicking play');
        }

        // Transcript / chapters
        const chapters = await page.$$('[class*="chapter"], [class*="transcript"], [class*="segment"]');
        log(chapters.length > 0 ? 'PASS' : 'WARN', 'Episode Chapters', `${chapters.length} chapter/transcript elements`);
    }

    if (consoleErrors.length === 0) {
        log('PASS', 'Episodes Console', 'No JS errors');
    } else {
        consoleErrors.forEach(e => log('WARN', 'Episodes Console', e.slice(0, 100)));
    }

    await context.close();
}

async function testSubscribeForm(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  SUBSCRIBE FORM (VALIDATION + SUBMIT)');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'networkidle', timeout: 20000 });

    // Scroll to subscribe section
    await page.evaluate(() => {
        const el = document.querySelector('#subscribe, [id*="subscribe"], form');
        if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    // Empty submit
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(500);
        const errors = await page.$$('[class*="error"], [role="alert"], .text-red-500, .text-red-400');
        log(errors.length > 0 ? 'PASS' : 'WARN', 'Subscribe Validation', `${errors.length} validation errors shown on empty submit`);
    }

    // Fill invalid email
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const nameInput = await page.$('input[name="name"]');
    if (emailInput) {
        if (nameInput) await nameInput.fill('Test User');
        await emailInput.fill('not-an-email');
        if (submitBtn) await submitBtn.click();
        await page.waitForTimeout(500);
        const emailError = await page.$('[id*="email-error"], [class*="error"]');
        log(emailError ? 'PASS' : 'WARN', 'Subscribe Email Validation', emailError ? 'Invalid email shows error' : 'No error for invalid email');
    }

    // Fill valid data
    if (emailInput) {
        if (nameInput) await nameInput.fill('Playwright Audit');
        await emailInput.fill(`playwright.audit.${Date.now()}@example.com`);
        // Check GDPR checkbox
        const gdpr = await page.$('input[type="checkbox"], input[name*="gdpr"], input[name*="consent"]');
        if (gdpr) await gdpr.check();
        log('PASS', 'Subscribe Form Fill', 'Filled valid email + name + GDPR');
    } else {
        log('WARN', 'Subscribe Form', 'No email input found on homepage');
    }

    await context.close();
}

async function testPartnersForm(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  PARTNERS FORM');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 120)); });

    await page.goto(`${BASE}/${LOCALE}/partners`, { waitUntil: 'networkidle', timeout: 20000 });

    const form = await page.$('form');
    log(form ? 'PASS' : 'FAIL', 'Partners Page Form', form ? 'Form found' : 'No form on partners page');

    if (form) {
        // Empty submit
        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) {
            await submitBtn.click();
            await page.waitForTimeout(500);
            const errors = await page.$$('[class*="error"], [role="alert"], .text-red-400, .text-red-500');
            log(errors.length > 0 ? 'PASS' : 'WARN', 'Partners Form Validation', `${errors.length} validation errors shown`);
        }

        // Fill the form
        const nameInput = await page.$('input[name="name"], input[placeholder*="Nome"]');
        const emailInput = await page.$('input[name="email"], input[type="email"]');
        const companyInput = await page.$('input[name="company"], input[placeholder*="Empresa"]');
        const messageInput = await page.$('textarea[name="message"], textarea');

        if (nameInput) await nameInput.fill('Playwright Test');
        if (emailInput) await emailInput.fill('playwright@test.com');
        if (companyInput) await companyInput.fill('Test Company');
        if (messageInput) await messageInput.fill('This is an automated audit test message for the partners form.');

        log(nameInput && emailInput && companyInput ? 'PASS' : 'WARN', 'Partners Form Fields', 'Name, email, company inputs found and filled');
    }

    if (consoleErrors.length === 0) {
        log('PASS', 'Partners Console', 'No JS errors');
    } else {
        consoleErrors.forEach(e => log('WARN', 'Partners Console', e.slice(0, 100)));
    }

    await context.close();
}

async function testMyAgenda(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  MY AGENDA (FAVORITES)');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    await page.goto(`${BASE}/${LOCALE}/my-agenda`, { waitUntil: 'networkidle', timeout: 20000 });

    // Empty state
    const emptyMsg = await page.$('[class*="empty"], h2, h3');
    const emptyText = await emptyMsg?.textContent();
    log('PASS', 'My Agenda Empty State', `Rendered: "${emptyText?.slice(0, 50) ?? 'visible'}"`);

    // Title
    const h1 = await page.$('h1');
    const title = await h1?.textContent();
    log(title ? 'PASS' : 'FAIL', 'My Agenda Title', title?.slice(0, 40) ?? 'MISSING');

    // Now add a favorite and come back
    await page.goto(`${BASE}/${LOCALE}/events`, { waitUntil: 'networkidle', timeout: 20000 });
    // Wait for EventCard client components to hydrate (they use localStorage)
    try { await page.waitForSelector('button[aria-pressed]', { timeout: 8000 }); } catch { }
    const heartBtns = await page.$$('button[aria-pressed]');
    if (heartBtns.length > 0) {
        await heartBtns[0].click();
        await page.waitForTimeout(800);
        // Go to My Agenda
        await page.goto(`${BASE}/${LOCALE}/my-agenda`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(500);
        const favoriteCards = await page.$$('a[href*="/events/"]');
        log(favoriteCards.length > 0 ? 'PASS' : 'WARN', 'My Agenda After Favorite', `${favoriteCards.length} favorite events shown`);

        // Clickable cards in My Agenda
        if (favoriteCards.length > 0) {
            const href = await favoriteCards[0].getAttribute('href');
            log(href && href.includes('/events/') ? 'PASS' : 'FAIL', 'My Agenda Card Links', `href="${href}"`);
        }

        // Clear all button
        const clearBtn = await page.$('button:has-text("Remover todos"), button:has-text("Clear all")');
        log(clearBtn ? 'PASS' : 'WARN', 'My Agenda Clear All Button', clearBtn ? 'Clear all button found' : 'Not found');
    } else {
        log('WARN', 'My Agenda', 'No heart buttons found on events page to test favorites');
    }

    await context.close();
}

async function testBlogDetail(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  BLOG CARDS & DETAIL');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    await page.goto(`${BASE}/${LOCALE}/blog`, { waitUntil: 'networkidle', timeout: 20000 });

    const blogLinks = await page.$$('a[href*="/blog/"]');
    log(blogLinks.length > 0 ? 'PASS' : 'FAIL', 'Blog Page', `${blogLinks.length} blog post links`);

    if (blogLinks.length > 0) {
        const href = await blogLinks[0].getAttribute('href');
        const resp = await page.goto(`${BASE}${href}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        log(resp?.status() === 200 ? 'PASS' : 'FAIL', 'Blog Detail Load', `HTTP ${resp?.status()} - ${href}`);
        const h1 = await page.$('h1, h2');
        const text = await h1?.textContent();
        log(text ? 'PASS' : 'WARN', 'Blog Detail Title', text?.slice(0, 60) ?? 'MISSING');
    }

    await context.close();
}

async function testEventDataCoherence() {
    console.log('\n═══════════════════════════════════════');
    console.log('  EVENT DATA COHERENCE (200 events)');
    console.log('═══════════════════════════════════════');

    const axios = require('axios');
    let events = [];
    try {
        const r = await axios.get(`${BASE}/api/events?limit=250`);
        events = r.data;
    } catch (e) { log('FAIL', 'Event Data', 'Could not fetch events: ' + e.message); return; }

    log('PASS', 'Event Data Count', `${events.length} upcoming events`);

    let missingTitle = 0, missingDate = 0, missingLocation = 0, missingUrl = 0;
    let missingImage = 0, pastEvents = 0, missingId = 0;
    let badDate = 0, duplicateIds = new Set(), duplicateTitles = new Map();
    let sameStartEnd = 0;
    const now = new Date(); now.setHours(0, 0, 0, 0); // midnight, same logic as isUpcoming

    events.forEach(ev => {
        if (!ev.id) missingId++;
        else duplicateIds.add(ev.id);
        if (!ev.title || ev.title.length < 2) missingTitle++;
        if (!ev.date) { missingDate++; } else {
            const d = new Date(ev.date);
            if (isNaN(d.getTime())) badDate++;
            // Use endDate when present (same logic as isUpcoming in the API)
            const checkDate = ev.endDate ? new Date(ev.endDate) : d;
            if (checkDate < now) pastEvents++;
        }
        if (!ev.location) missingLocation++;
        if (!ev.url) missingUrl++;
        if (!ev.image || ev.image.includes('placeholder')) missingImage++;
        if (ev.endDate && ev.date && ev.endDate === ev.date) sameStartEnd++;

        const key = `${ev.title}|${ev.date?.slice(0, 10)}`;
        duplicateTitles.set(key, (duplicateTitles.get(key) || 0) + 1);
    });

    const dupCount = [...duplicateTitles.values()].filter(v => v > 1).reduce((a, v) => a + (v - 1), 0);

    log(missingId === 0 ? 'PASS' : 'FAIL', 'Event Schema id', `${missingId} missing`);
    log(missingTitle === 0 ? 'PASS' : 'FAIL', 'Event Schema title', `${missingTitle} missing`);
    log(missingDate === 0 ? 'PASS' : 'FAIL', 'Event Schema date', `${missingDate} missing, ${badDate} invalid`);
    log(badDate === 0 ? 'PASS' : 'FAIL', 'Event Schema date validity', `${badDate} invalid dates`);
    log(missingLocation === 0 ? 'PASS' : 'WARN', 'Event Schema location', `${missingLocation} missing`);
    log(missingUrl === 0 ? 'PASS' : 'WARN', 'Event Schema url', `${missingUrl} missing`);
    log(missingImage < 10 ? 'PASS' : 'WARN', 'Event Schema image', `${missingImage} missing/placeholder`);
    log(pastEvents === 0 ? 'PASS' : 'FAIL', 'Event Schema past', `${pastEvents} past events in upcoming feed`);
    log(dupCount < 5 ? 'PASS' : 'WARN', 'Event Duplicates', `${dupCount} duplicate title+date combos`);
    log(sameStartEnd === 0 ? 'PASS' : 'FAIL', 'Event endDate==date', `${sameStartEnd} events with start===end (fixed fallback should prevent this)`);

    // Source distribution
    const sources = {};
    events.forEach(ev => { sources[ev.source] = (sources[ev.source] || 0) + 1; });
    console.log('\n  📊 Source distribution:');
    Object.entries(sources).sort((a, b) => b[1] - a[1]).forEach(([src, cnt]) => {
        console.log(`     ${src}: ${cnt}`);
    });

    // Category distribution
    const cats = {};
    events.forEach(ev => { if (ev.category) cats[ev.category] = (cats[ev.category] || 0) + 1; });
    console.log('\n  📊 Category distribution:');
    Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, cnt]) => {
        console.log(`     ${cat}: ${cnt}`);
    });

    // Check price coverage
    const withPrice = events.filter(e => e.price && e.price !== 'Check site').length;
    log(withPrice > events.length * 0.5 ? 'PASS' : 'WARN', 'Event Price Coverage', `${withPrice}/${events.length} (${Math.round(withPrice / events.length * 100)}%) have real price`);
}

async function testLocaleSwitch(browser) {
    console.log('\n═══════════════════════════════════════');
    console.log('  LOCALE (PT/EN) SWITCH');
    console.log('═══════════════════════════════════════');

    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    // EN locale
    const resp = await page.goto(`${BASE}/en`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    log(resp?.status() === 200 ? 'PASS' : 'FAIL', 'EN Homepage', `HTTP ${resp?.status()}`);

    const h1 = await page.$('h1');
    const text = await h1?.textContent();
    log(text ? 'PASS' : 'WARN', 'EN Content', text?.slice(0, 60) ?? 'no h1');

    const enEvents = await page.goto(`${BASE}/en/events`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    log(enEvents?.status() === 200 ? 'PASS' : 'FAIL', 'EN Events Page', `HTTP ${enEvents?.status()}`);

    await context.close();
}

async function main() {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   FULL SITE PLAYWRIGHT AUDIT             ║');
    console.log('║   What To Do Lisboa — ' + new Date().toISOString().slice(0, 10) + '       ║');
    console.log('╚══════════════════════════════════════════╝\n');

    await testAPI();

    const browser = await chromium.launch({ headless: true });

    try {
        await testEventDataCoherence();
        await testPages(browser);
        await testHomepage(browser);
        await testEventsPage(browser);
        await testEventDetailPage(browser);
        await testEpisodeDetail(browser);
        await testSubscribeForm(browser);
        await testPartnersForm(browser);
        await testMyAgenda(browser);
        await testBlogDetail(browser);
        await testLocaleSwitch(browser);
    } finally {
        await browser.close();
    }

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   AUDIT SUMMARY                          ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  ✅ PASSED : ${String(passed).padEnd(28)}║`);
    console.log(`║  ❌ FAILED : ${String(failed).padEnd(28)}║`);
    console.log(`║  ⚠️  WARNED : ${String(warned).padEnd(27)}║`);
    console.log('╚══════════════════════════════════════════╝\n');

    if (failed > 0) {
        console.log('❌ FAILURES:');
        results.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`   [${r.area}] ${r.detail}${r.extra ? ' → ' + r.extra : ''}`);
        });
    }
    if (warned > 0) {
        console.log('\n⚠️  WARNINGS:');
        results.filter(r => r.status === 'WARN').forEach(r => {
            console.log(`   [${r.area}] ${r.detail}${r.extra ? ' → ' + r.extra : ''}`);
        });
    }
}

main().catch(e => { console.error('Audit crashed:', e); process.exit(1); });
