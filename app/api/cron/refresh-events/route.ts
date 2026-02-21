/**
 * POST /api/cron/refresh-events
 *
 * Vercel Cron endpoint (configured in vercel.json).
 * Dispatches a GitHub Actions workflow that runs the scrapers,
 * commits the updated events.json, and triggers a Vercel redeploy.
 *
 * Required environment variables:
 *   CRON_SECRET          – arbitrary secret to validate the cron call (set in Vercel dashboard)
 *   GH_DISPATCH_TOKEN    – GitHub Personal Access Token with repo+workflow scope
 *   GH_REPO_OWNER        – GitHub username/org (e.g. "whattodo-pt")
 *   GH_REPO_NAME         – GitHub repository name (e.g. "what-to-do-website")
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

async function dispatchWorkflow(ghOwner: string, ghRepo: string, ghToken: string) {
    const workflowDispatchUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/actions/workflows/fetch-events.yml/dispatches`;
    const workflowRes = await fetch(workflowDispatchUrl, {
        method: "POST",
        headers: {
            Authorization: `token ${ghToken}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ ref: "main" }),
    });

    if (workflowRes.ok) {
        return { ok: true as const, mode: "workflow_dispatch" as const };
    }

    const workflowErrBody = await workflowRes.text();
    console.warn(
        `[cron/refresh-events] workflow_dispatch failed (${workflowRes.status}). Falling back to repository_dispatch. Body: ${workflowErrBody}`,
    );

    const repoDispatchUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/dispatches`;
    const repoRes = await fetch(repoDispatchUrl, {
        method: "POST",
        headers: {
            Authorization: `token ${ghToken}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
            event_type: "refresh-events",
            client_payload: {
                source: "vercel-cron",
                triggeredAt: new Date().toISOString(),
            },
        }),
    });

    if (repoRes.ok) {
        return {
            ok: true as const,
            mode: "repository_dispatch" as const,
            fallbackFrom: {
                status: workflowRes.status,
                error: workflowErrBody,
            },
        };
    }

    const repoErrBody = await repoRes.text();
    return {
        ok: false as const,
        workflowDispatch: {
            status: workflowRes.status,
            error: workflowErrBody,
        },
        repositoryDispatch: {
            status: repoRes.status,
            error: repoErrBody,
        },
    };
}

export async function GET(req: NextRequest) {
    // Vercel validates cron requests with Authorization: Bearer <CRON_SECRET>
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ghToken = process.env.GH_DISPATCH_TOKEN;
    const ghOwner = process.env.GH_REPO_OWNER;
    const ghRepo = process.env.GH_REPO_NAME;

    if (!ghToken || !ghOwner || !ghRepo) {
        console.warn(
            "[cron/refresh-events] Missing GitHub env vars (GH_DISPATCH_TOKEN, GH_REPO_OWNER, GH_REPO_NAME). " +
            "Skipping workflow dispatch.",
        );
        return NextResponse.json(
            {
                ok: false,
                message: "GitHub env vars not configured. Set GH_DISPATCH_TOKEN, GH_REPO_OWNER, GH_REPO_NAME in Vercel.",
            },
            { status: 200 },
        );
    }

    try {
        const dispatched = await dispatchWorkflow(ghOwner, ghRepo, ghToken);

        if (!dispatched.ok) {
            console.error("[cron/refresh-events] GitHub dispatch failed (both modes):", dispatched);
            return NextResponse.json({ ok: false, error: dispatched }, { status: 502 });
        }

        console.log(`[cron/refresh-events] GitHub Actions workflow dispatched successfully via ${dispatched.mode}.`);
        return NextResponse.json(
            {
                ok: true,
                mode: dispatched.mode,
                message: "fetch-events workflow dispatched",
                timestamp: new Date().toISOString(),
            },
            { status: 200 },
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[cron/refresh-events] Unexpected error:", message);
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
