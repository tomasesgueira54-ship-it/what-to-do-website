const { chromium } = require('playwright');
(async () => {
    const b = await chromium.launch();
    const p = await b.newPage();
    await p.goto('http://localhost:3001/pt', { waitUntil: 'networkidle' });
    const forms = await p.$$('form');
    console.log('forms:', forms.length);
    for (const f of forms) {
        const email = await f.$('input[type="email"]');
        if (email) {
            console.log('Found subscribe form');
            const html = await f.evaluate(n => n.outerHTML);
            console.log(html.slice(0, 1000));
            const submit = await f.$('button[type="submit"]');
            console.log('submit button found?', !!submit);
            if (submit) console.log(await submit.evaluate(b => ({ text: b.innerText, disabled: b.disabled })));
            break;
        }
    }
    await b.close();
})();