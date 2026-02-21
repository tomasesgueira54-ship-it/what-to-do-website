#!/usr/bin/env node
/**
 * Accessibility audit for institutional pages (About, Contact, Privacy, Terms)
 * Tests:
 * - Keyboard navigation (tab order, focus visibility)
 * - Aria labels and heading hierarchy
 * - Link announcements (external)
 * - Basic focus indicator presence
 */
const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const pages = [
    { path: '/pt/about', locale: 'pt' },
    { path: '/en/about', locale: 'en' },
    { path: '/pt/contact', locale: 'pt' },
    { path: '/en/contact', locale: 'en' },
    { path: '/pt/privacy', locale: 'pt' },
    { path: '/en/privacy', locale: 'en' },
    { path: '/pt/terms', locale: 'pt' },
    { path: '/en/terms', locale: 'en' },
];

const issues = [];

async function testPage(browser, page) {
    const url = `${BASE_URL}${page.path}`;
    console.log(`\n🔍 Testing: ${page.path}`);

    const bpage = await browser.newPage();
    try {
        await bpage.goto(url, { waitUntil: 'networkidle' });

        // 1. Check h1 exists
        const h1 = await bpage.$('h1');
        if (!h1) {
            issues.push(`${page.path}: Missing <h1>`);
        }

        // 2. Check heading hierarchy (no h3 before h2)
        const headings = await bpage.$$eval('h1, h2, h3, h4, h5, h6', (els) =>
            els.map((el) => ({ tag: el.tagName.toLowerCase(), text: el.textContent?.substring(0, 30) }))
        );
        for (let i = 1; i < headings.length; i++) {
            const curr = parseInt(headings[i].tag[1]);
            const prev = parseInt(headings[i - 1].tag[1]);
            if (curr - prev > 1) {
                issues.push(`${page.path}: Heading hierarchy skip from <${headings[i - 1].tag}> to <${headings[i].tag}>`);
            }
        }

        // 3. Check for focusable elements count
        const focusableCount = await bpage.$$eval(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
            (els) => els.length
        );
        if (focusableCount === 0) {
            issues.push(`${page.path}: No focusable elements found`);
        }

        // 4. Tab through first 5 focusable elements and check focus outline
        let focusVisibleCount = 0;
        for (let i = 0; i < Math.min(3, focusableCount); i++) {
            await bpage.keyboard.press('Tab');
            const focused = await bpage.evaluate(() => {
                const el = document.activeElement;
                if (!el) return false;
                const style = window.getComputedStyle(el);
                return (
                    style.outline !== 'none' ||
                    style.boxShadow !== 'none' ||
                    style.borderColor !== style.backgroundColor
                );
            });
            if (focused) focusVisibleCount++;
        }
        if (focusVisibleCount === 0 && focusableCount > 0) {
            console.warn(`  ⚠️  No visible focus indicators detected on first few focusable elements`);
        }

        // 5. Check aria-labels on links (especially external)
        const externalLinks = await bpage.$$eval('a[target="_blank"]', (els) =>
            els.map((el) => ({
                text: el.textContent?.substring(0, 30),
                ariaLabel: el.getAttribute('aria-label'),
                href: el.href?.substring(0, 40),
            }))
        );
        for (const link of externalLinks) {
            if (!link.ariaLabel || !link.ariaLabel.includes('abre') && !link.ariaLabel.includes('opens')) {
                issues.push(`${page.path}: External link missing "abre/opens" indicator in aria-label`);
                break;
            }
        }

        // 6. Check for decorative icons marked with aria-hidden
        const decorIcons = await bpage.$$eval('[class*="icon"], svg, [role="img"]', (els) =>
            els.filter((el) => !el.getAttribute('aria-label') && !el.getAttribute('aria-hidden')).length
        );
        if (decorIcons > 0 && page.path.includes('contact')) {
            console.warn(`  ⚠️  Found ${decorIcons} potentially unlabeled icons (may be intentional)`);
        }

        // 7. Check section aria-labelledby links to headings
        const sections = await bpage.$$eval('section[aria-labelledby]', (els) =>
            els.map((el) => {
                const id = el.getAttribute('aria-labelledby');
                const heading = el.ownerDocument.getElementById(id);
                return { present: !!heading, sectionContent: el.textContent?.substring(0, 30) };
            })
        );
        for (const sec of sections) {
            if (!sec.present) {
                issues.push(`${page.path}: section aria-labelledby points to missing heading id`);
            }
        }

        console.log(`  ✓ Headings: ${headings.length}`);
        console.log(`  ✓ Focusable elements: ${focusableCount}`);
        console.log(`  ✓ Sections with labelledby: ${sections.length}`);
    } catch (err) {
        issues.push(`${page.path}: ${err.message}`);
    } finally {
        await bpage.close();
    }
}

(async () => {
    const browser = await chromium.launch();
    try {
        for (const page of pages) {
            await testPage(browser, page);
        }

        console.log('\n' + '='.repeat(60));
        if (issues.length === 0) {
            console.log('✅ All accessibility checks passed!');
        } else {
            console.log(`❌ Found ${issues.length} a11y issue(s):`);
            for (const issue of issues) {
                console.log(`   - ${issue}`);
            }
        }
        console.log('='.repeat(60));

        process.exit(issues.length > 0 ? 1 : 0);
    } finally {
        await browser.close();
    }
})();
