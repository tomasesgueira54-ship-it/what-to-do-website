import { NextRequest, NextResponse } from "next/server";
import { recordOutboundClick } from "@/lib/server/analytics-store";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export async function GET(request: NextRequest): Promise<NextResponse> {
    const requestUrl = new URL(request.url);
    const target = requestUrl.searchParams.get("target");
    const eventId = requestUrl.searchParams.get("eventId") || "unknown";
    const source = requestUrl.searchParams.get("source") || "unknown";
    const locale = requestUrl.searchParams.get("locale") || "pt";

    if (!target) {
        return NextResponse.json(
            { success: false, error: "Missing target URL" },
            { status: 400 },
        );
    }

    let destination: URL;
    try {
        destination = new URL(target);
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid target URL" },
            { status: 400 },
        );
    }

    if (!ALLOWED_PROTOCOLS.has(destination.protocol)) {
        return NextResponse.json(
            { success: false, error: "Unsupported URL protocol" },
            { status: 400 },
        );
    }

    if (!destination.searchParams.has("utm_source")) {
        destination.searchParams.set("utm_source", "whattodo");
    }
    if (!destination.searchParams.has("utm_medium")) {
        destination.searchParams.set("utm_medium", "referral");
    }
    if (!destination.searchParams.has("utm_campaign")) {
        destination.searchParams.set("utm_campaign", `event_${eventId}`);
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "unknown";

    if (process.env.NODE_ENV !== 'production') {
        console.log(
            JSON.stringify({
                type: "outbound_click",
                eventId,
                source,
                locale,
                targetHost: destination.host,
                targetPath: destination.pathname,
                timestamp: new Date().toISOString(),
            }),
        );
    }

    try {
        await recordOutboundClick({
            eventId,
            source,
            locale,
            targetHost: destination.host,
            targetPath: destination.pathname,
            referrer,
            userAgent,
            clientIp,
        });
    } catch (error) {
        console.error("Outbound persistence error:", error);
    }

    return NextResponse.redirect(destination, { status: 302 });
}
