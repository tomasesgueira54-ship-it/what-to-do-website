# TODO & Backlog — What To Do Website

**Maintainer:** GitHub Copilot
**Last updated:** 2026-02-18

---

## Critical (must do now) ✅

- [ ] Criar ficheiro `.env.local` com as seguintes variáveis de ambiente:
  ```
  RESEND_API_KEY=re_xxxx
  DATABASE_URL=postgresql://...
  NEXT_PUBLIC_SITE_URL=https://whattodo.pt
  PARTNERS_DASHBOARD_TOKEN=token_secreto
  ```
  - `RESEND_API_KEY` — obrigatório para envio de newsletters (`app/api/subscribe/route.ts`)
  - `DATABASE_URL` — sem esta var, os subscritores são perdidos ao reiniciar o servidor (apenas memória)
  - `NEXT_PUBLIC_SITE_URL` — usado em SEO, sitemap e Open Graph
  - `PARTNERS_DASHBOARD_TOKEN` — protege o acesso ao dashboard de parceiros

- [ ] Configure repository secrets
  - RESEND_API_KEY — required for newsletter sends (`app/api/subscribe/route.ts`)
  - SLACK_WEBHOOK — used by CI health workflow (`.github/workflows/health.yml`)
  - Test: run `npm run health` after setting secrets

- [ ] Data-quality: normalize `data/events.json`
  - Parse/fill missing `endDate` values and normalize `location` names
  - Scripts: `scripts/enrich-events.ts`, scrapers in `scripts/scrapers/`
  - Reason: improves filtering, sorting and UI correctness on `/events`

- [ ] Enable/validate CI health notifications
  - Ensure Slack webhook and repo secrets are present
  - Verify `.github/workflows/health.yml` runs on PRs and `main`

---

## High priority 🔥

- [ ] Implement ISR / caching for API routes and heavy pages
  - Target: `revalidate = 3600` on `GET /api/events` and event listing pages
  - Files: `app/api/events/route.ts`, relevant page components

- [ ] Dynamic blog post routing `/blog/[id]`
  - Use `data/blog.ts` as source; add dynamic route and SEO metadata

- [ ] Complete event `endDate` parsing across scrapers
  - Files: `scripts/scrapers/*`, `scripts/enrich-events.ts`

---

## Medium priority ⚙️

- [ ] Add Open Graph / SEO images & metadata
  - Files: `app/layout.tsx`, page-level metadata files

- [ ] Design and add Resend email templates
  - Location: `app/api/subscribe/route.ts` + template assets

- [ ] Performance & accessibility sweep
  - Use Playwright audit + Lighthouse, fix high-impact issues

---

## Low priority / Nice to have ✨

- [ ] Add more Playwright E2E tests (events search, blog pagination)
- [ ] Add analytics (Vercel Analytics or Plausible)
- [ ] Expand scrapers to additional sources

---

## Done (recent fixes) ✅

- Fixed hydration mismatch (removed duplicate `<html>/<body>` in layouts)
- Converted `app/error.tsx` to Client Component to avoid server 500s
- Added `dev:clean` (`npm run dev:clean`) and `dv` helper
- Added Playwright-based site audit and subscribe form tests
- Added CI health workflow with Slack + PR comments
- Upgraded Next.js / ESLint / Playwright and resolved peer deps

---

## How to run / verify 🔧

- Full health check (build + audit + subscribe tests):
  - `npm run health`

- Dev (clean dev server):
  - `npm run dev:clean` or `npm run dv`

- Playwright site audit (crawl):
  - `node scripts/audit-links-playwright.cjs`

- Playwright subscribe E2E test:
  - `node scripts/playwright-subscribe-test.cjs`

- Image optimizer check:
  - `node scripts/check-image-opt.cjs`

---

## Notes & next steps 💡

- After setting `RESEND_API_KEY` you can test newsletter flow with `npm run health` or `node scripts/inspect-subscribe-form.cjs`.
- Consider converting high-priority TODOs into GitHub issues for tracking and assignment.

---

If you want, I can:
- commit this file to `main` (done per your choice),
- open a PR instead, or
- create GitHub issues from the list.
