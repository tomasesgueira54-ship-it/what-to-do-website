import { parsePtDate, extractDateFromHtml, extractEndDateFromHtml } from './fetch-events';
import { safeDate, extractPriceFromHtml } from './scrapers/utils';

function assertEqual(name: string, actual: string, expected: string) {
    const ok = actual === expected;
    console.log(`${ok ? '✅' : '❌'} ${name} -> expected: ${expected} ; actual: ${actual}`);
    if (!ok) throw new Error(`${name} failed`);
}

(async () => {
    // parsePtDate
    assertEqual('parsePtDate simple', parsePtDate('16 fevereiro 2026'), '2026-02-16T12:00:00.000Z');

    // extractEndDateFromHtml: short range (1 a 3 março 2026)
    const shortRangeHtml = 'Exposição de 1 a 3 março 2026 no espaço X';
    assertEqual('extractEndDateFromHtml short-range', extractEndDateFromHtml(shortRangeHtml), '2026-03-03T12:00:00.000Z');

    // extractEndDateFromHtml: JSON-LD endDate
    const ldHtml = `<script type="application/ld+json">{ "@type":"Event","startDate":"2026-03-01T19:00:00+00:00","endDate":"2026-03-10T22:00:00+00:00" }</script>`;
    assertEqual('extractEndDateFromHtml json-ld', extractEndDateFromHtml(ldHtml), '2026-03-10T22:00:00.000Z');

    // safeDate timezone handling
    assertEqual('safeDate timezone', safeDate('2026-02-16T23:00:00-01:00'), '2026-02-17T00:00:00.000Z');

    // extractPriceFromHtml
    assertEqual('extractPriceFromHtml euro', extractPriceFromHtml('<div>Bilhetes: 12,50 €</div>'), '12.50€');
    assertEqual('extractPriceFromHtml gratuito', extractPriceFromHtml('<p>Entrada gratuita</p>'), 'Grátis');

    console.log('\nAll parsing tests passed.');
})();