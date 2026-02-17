const fs = require('fs');
const path = require('path');
const vm = require('vm');

function assertEqual(name, actual, expected) {
    const ok = actual === expected;
    console.log(`${ok ? '✅' : '❌'} ${name} -> expected: ${expected} ; actual: ${actual}`);
    if (!ok) throw new Error(`${name} failed`);
}

// Lightweight local copies aligned with fetch/events utils behavior
const PT_MONTHS = {
    janeiro: 0,
    fevereiro: 1,
    'março': 2,
    marco: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
};

function safeDate(raw) {
    if (!raw) return '';
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

function parsePtDate(text) {
    const match = String(text || '')
        .toLowerCase()
        .match(/(\d{1,2})\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+(\d{4})/);
    if (!match) return '';
    const day = parseInt(match[1], 10);
    const month = PT_MONTHS[match[2]] ?? 0;
    const year = parseInt(match[3], 10);
    return new Date(Date.UTC(year, month, day, 12, 0, 0)).toISOString();
}

function extractPriceFromHtml(html) {
    const lower = String(html || '').toLowerCase();
    if (/(gratuit|grátis|gratis|free)/i.test(lower)) return 'Grátis';
    const text = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const m = text.match(/(?:€|eur)\s*(\d{1,4}(?:[.,]\d{1,2})?)|(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|eur)/i);
    const raw = m?.[1] || m?.[2];
    if (!raw) return '';
    const n = Number.parseFloat(raw.replace(',', '.'));
    if (!Number.isFinite(n) || n >= 9000) return '';
    return `${Number.isInteger(n) ? n : n.toFixed(2)}€`;
}

(function run() {
    assertEqual('parsePtDate simple', parsePtDate('16 fevereiro 2026'), '2026-02-16T12:00:00.000Z');
    assertEqual('safeDate timezone', safeDate('2026-02-16T23:00:00-01:00'), '2026-02-17T00:00:00.000Z');
    assertEqual('extractPriceFromHtml euro', extractPriceFromHtml('<div>Bilhetes: 12,50 €</div>'), '12.50€');
    assertEqual('extractPriceFromHtml gratuito', extractPriceFromHtml('<p>Entrada gratuita</p>'), 'Grátis');
    console.log('\nAll parsing tests passed.');
})();
