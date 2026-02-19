import { NextRequest, NextResponse } from "next/server";
import {
    PromoterLeadSchema,
    type PromoterLeadResponse,
} from "@/lib/schemas/promoter-lead";
import { recordPromoterLead } from "@/lib/server/analytics-store";
import { z } from "zod";
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

function isRateLimited(request: NextRequest): boolean {
    const key = getClientIp(request);
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

export async function POST(
    request: NextRequest,
): Promise<NextResponse<PromoterLeadResponse>> {
    try {
        if (!isAllowedOrigin(request)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden origin",
                    error: "FORBIDDEN_ORIGIN",
                },
                { status: 403 },
            );
        }

        if (isRateLimited(request)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Too many requests. Please try again later.",
                    error: "RATE_LIMITED",
                },
                { status: 429 },
            );
        }

        const body = await request.json();
        const payload = PromoterLeadSchema.parse(body);
        const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const createdAt = new Date().toISOString();

        await recordPromoterLead({
            id,
            createdAt,
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
            company: payload.company.trim(),
            category: payload.category,
            budget: payload.budget,
            message: payload.message.trim(),
            website: payload.website,
            locale: payload.locale,
        });

        console.log(
            JSON.stringify({
                type: "promoter_lead_submitted",
                leadId: id,
                email: payload.email.trim().toLowerCase(),
                company: payload.company.trim(),
                category: payload.category,
                budget: payload.budget,
                createdAt,
            }),
        );

        return NextResponse.json(
            {
                success: true,
                id,
                message:
                    payload.locale === "pt"
                        ? "Pedido recebido. Vamos contactar-te em breve."
                        : "Request received. We will contact you soon.",
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation error",
                    error: error.issues.map((issue) => issue.message).join(", "),
                },
                { status: 400 },
            );
        }

        console.error("Promoters API error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
