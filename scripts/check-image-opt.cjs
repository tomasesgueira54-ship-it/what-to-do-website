(async () => {
    const fs = require('fs');
    const { URL } = require('url');
    const fetch = globalThis.fetch || require('node-fetch');
    const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
    const base = process.env.BASE_URL || 'http://localhost:3001';

    const samples = events.filter(e => e.image).slice(0, 8);
    for (const ev of samples) {
        try {
            const img = ev.image;
            const u = new URL(`${base}/_next/image`);
            u.searchParams.set('url', img);
            u.searchParams.set('w', '1200');
            u.searchParams.set('q', '75');

            const res = await fetch(u.toString(), { method: 'GET' });
            console.log(ev.id, img, '->', res.status, res.headers.get('content-type'));
            if (res.status >= 400) {
                const body = await res.text().catch(() => '<no body>');
                console.error('BAD_IMAGE_RESPONSE', ev.id, res.status, body.slice(0, 200));
            }
        } catch (err) {
            console.error('ERR_CHECK_IMAGE', ev.id, err.message);
        }
    }
})();