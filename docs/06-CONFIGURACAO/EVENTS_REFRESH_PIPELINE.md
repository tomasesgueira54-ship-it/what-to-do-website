# Event Refresh Pipeline Setup

## Overview

The What To Do website automatically refreshes events data daily from 9 sources (Agenda LX, Fever, Eventbrite, BOL, Ticketline, Meetup, Xceed, Shotgun, Blueticket) using a multi-stage pipeline:

```
Vercel Cron (06:30 UTC)
  ↓
POST /api/cron/refresh-events
  ↓
GitHub API dispatch workflow
  ↓
GitHub Actions (Ubuntu) runs scrapers
  ↓
Commits events.json to main
  ↓
Vercel auto-redeploy
```

## Setup Steps

### 1. Generate CRON_SECRET

Generate a random secret string to validate cron requests:

```bash
# On macOS/Linux
openssl rand -hex 32

# Example output:
# a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
```

Copy this value — you'll add it to Vercel environment variables.

### 2. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Name: `What To Do Events Scraper`
3. Expiration: `90 days` (renewable)
4. Scopes required:
   - ✅ `repo` (full control)
   - ✅ `workflow` (write access to workflows)
5. Click "Generate token"
6. **Copy the token immediately** — GitHub only shows it once

This token will be `GH_DISPATCH_TOKEN`.

### 3. Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `what-to-do-website` project
3. Settings → Environment Variables
4. Add these 4 variables (**Production only** is fine):

| Name                | Value                        | Scope      |
| ------------------- | ---------------------------- | ---------- |
| `CRON_SECRET`       | The secret from step 1       | Production |
| `GH_DISPATCH_TOKEN` | The GitHub token from step 2 | Production |
| `GH_REPO_OWNER`     | `whattodo-pt` (or your org)  | Production |
| `GH_REPO_NAME`      | `what-to-do-website`         | Production |

5. Click "Save"
6. Redeploy the site so env vars are loaded

### 4. Test the Pipeline

#### Manual trigger in Vercel Cron settings

1. Settings → Crons → inspect `/api/cron/refresh-events`
2. Click "Run now" button

#### Or curl locally after deploying:

```bash
curl -X GET https://your-domain.vercel.app/api/cron/refresh-events \
  -H "Authorization: Bearer <CRON_SECRET>"
```

#### Check GitHub Actions logs

1. Go to [your repo](https://github.com/whattodo-pt/what-to-do-website)
2. Actions tab → `Fetch events (scheduled)` workflow
3. Should show `fetch-events.yml` workflow run with green ✅

### 5. Verify Data Update

After the workflow completes:

1. Check GitHub → Code → `data/events.json` timestamp
2. Should see commit message like: `chore(events): refresh data — 247 eventos`
3. Check Vercel logs → should show redeploy triggered by the push

---

## Troubleshooting

### Workflow doesn't run

**Check:**
- Env vars are set in Vercel dashboard (not just `.env.local`)
- `GH_DISPATCH_TOKEN` hasn't expired (GitHub tokens expire after 90 days)
- Are the `GH_REPO_OWNER` and `GH_REPO_NAME` correct?

**Test cron manually:**
```bash
# From your local machine (after deploying to Vercel)
curl -X GET https://your-domain.vercel.app/api/cron/refresh-events \
  -H "Authorization: Bearer <your-CRON_SECRET>"
```

Should return:
```json
{
  "ok": true,
  "message": "fetch-events workflow dispatched",
  "timestamp": "2026-02-21T06:30:00.000Z"
}
```

### GitHub token expired

Re-generate it at https://github.com/settings/tokens and update `GH_DISPATCH_TOKEN` in Vercel.

### events.json is empty after run

1. Check GitHub Actions workflow logs → step "Run fetch-events script"
2. If Playwright install failed, the step would still "succeed" but return 0 events
3. Common issue: Playwright needs `libgconf-2.so.4` on CI. The workflow installs with `--with-deps` which should handle it.

---

## Local Development

To test scrapers locally **without** the cron pipeline:

```bash
npm run fetch:events
```

This runs all 9 scrapers and overwrites `data/events.json` immediately.

---

## Cron Schedule

Currently set to **06:30 UTC** (verificar no `vercel.json`):
- 07:30 Lisboa (WET — winter)
- 08:30 Lisboa (WEST — summer)

To change, edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-events",
      "schedule": "0 7 * * *"  ← Change this (crontab format)
    }
  ]
}
```

---

## References

- Vercel Crons: https://vercel.com/docs/crons
- GitHub Actions dispatch: https://docs.github.com/en/actions/using-workflows/triggering-a-workflow
- Environment Variables: https://vercel.com/docs/projects/environment-variables
