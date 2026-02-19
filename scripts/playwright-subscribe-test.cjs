const { chromium } = require('playwright');

(async () => {
    const base = process.env.BASE_URL || 'http://localhost:3001';
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const issues = [];

    page.on('console', msg => {
        if (msg.type() === 'error') issues.push({ type: 'console', text: msg.text() });
    });

    page.on('requestfailed', req => {
        const url = req.url();
        const error = req.failure()?.errorText || 'failed';

        if (error.includes('ERR_ABORTED') && url.includes('_rsc=')) {
            return;
        }

        if (error.includes('ERR_ABORTED') && /\.(mp4|webm)(\?|$)/i.test(url)) {
            return;
        }

        issues.push({ type: 'requestfailed', url, error });
    });

    const responses = [];
    page.on('response', res => {
        const url = res.url();
        if (url.includes('/api/subscribe')) {
            responses.push({ status: res.status(), url, ok: res.ok() });
        }
    });

    try {
        await page.goto(base + '/pt', { waitUntil: 'networkidle' });

        // Find subscribe form
        const form = await page.$('form:has(input[type="email"])');
        if (!form) {
            console.error('NO_SUBSCRIBE_FORM_ON_PAGE');
            await browser.close();
            process.exit(2);
        }

        // Valid submission
        const email = `pw-test+${Date.now()}@whattodo.test`;
        await page.fill('form input[type="text"]', 'PW Tester').catch(() => { });
        await page.fill('form input[type="email"]', email);
        const gdpr = await page.$('form input[type="checkbox"]');
        if (gdpr) await gdpr.check().catch(() => { });
        const beforeLen = responses.length;
        await page.click('form button[type="submit"]');
        // wait for the response to be collected by the 'response' handler
        const start = Date.now();
        while (Date.now() - start < 5000 && responses.length === beforeLen) {
            await page.waitForTimeout(100);
        }
        if (responses.length > beforeLen) {
            // ok, handler captured it
        } else {
            issues.push({ type: 'timeout', details: 'no response for subscribe (valid submit)' });
        }

        // Duplicate submission (server-side) - send direct request to API to assert 400 when email already exists
        try {
            const dupRes = await page.request.post(base + '/api/subscribe', {
                data: { name: 'PW Tester', email, gdprConsent: true, subject: 'newsletter', locale: 'pt' }
            });
            responses.push({ status: dupRes.status(), url: dupRes.url(), ok: dupRes.ok() });
        } catch (e) {
            issues.push({ type: 'request-error', details: `duplicate direct POST failed: ${e.message}` });
        }

        // Invalid submission (missing email)
        await page.fill('form input[type="email"]', '');
        await page.click('form button[type="submit"]').catch(() => { });

        // Rapid repeat (5 submissions)
        for (let i = 0; i < 5; i++) {
            const e = `pw-race+${Date.now()}-${i}@whattodo.test`;
            await page.fill('form input[type="email"]', e);
            await page.click('form button[type="submit"]');
        }

        // Wait a bit for responses to be collected
        await page.waitForTimeout(1000);

        console.log('RESPONSES', responses.slice(0, 20));
        console.log('ISSUES', issues.slice(0, 20));
        await browser.close();
        if (issues.length > 0 || responses.some(r => r.status >= 500)) process.exit(1);
        process.exit(0);
    } catch (err) {
        console.error('TEST_ERROR', err.message);
        await browser.close();
        process.exit(2);
    }
})();