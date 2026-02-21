import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordFunnelEvent } from "@/lib/server/analytics-store";

const AnalyticsSchema = z.object({
    eventType: z.enum(["page_view", "contact_success", "subscribe_success"]),
    locale: z.string().min(2).max(10).default("pt"),
    path: z.string().min(1).max(300),
    referrer: z.string().max(500).optional(),
});

const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

function isRateLimited(request: NextRequest): boolean {
    const key = `analytics:${getClientIp(request)}`;
    const now = Date.now();
    const recent = (requestLog.get(key) || []).filter(
        (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
    );
    recent.push(now);
    requestLog.set(key, recent);
    return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function isAllowedOrigin(request: NextRequest): boolean {
    const origin = request.headers.get("origin");
    if (!origin) return true;
    const host = request.headers.get("host");
    if (!host) return false;

    try {
        const originUrl = new URL(origin);
        return originUrl.host === host;
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        if (!isAllowedOrigin(request)) {
            return NextResponse.json(
                { success: false, error: "FORBIDDEN_ORIGIN" },
                { status: 403 },
            );
        }

        if (isRateLimited(request)) {
            return NextResponse.json(
                { success: true, throttled: true },
                { status: 202 },
            );
        }

        const body = await request.json();
        const validated = AnalyticsSchema.parse(body);

        const userAgent = request.headers.get("user-agent") || "unknown";
        const clientIp = getClientIp(request);

        await recordFunnelEvent({
            eventType: validated.eventType,
            locale: validated.locale,
            path: validated.path,
            referrer: validated.referrer || request.headers.get("referer") || "unknown",
            userAgent,
            clientIp,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.issues.map((issue) => issue.message).join(", "),
                },
                { status: 400 },
            );
        }

        console.error("Analytics API error:", error);
        return NextResponse.json(
            { success: false, error: "INTERNAL_ERROR" },
            { status: 500 },
        );
    }
}
