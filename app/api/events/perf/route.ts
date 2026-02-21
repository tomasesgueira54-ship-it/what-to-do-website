import { NextRequest, NextResponse } from "next/server";
import { getEventsPerfSummary } from "@/lib/server/events-perf";

function isLocalhostRequest(request: NextRequest): boolean {
    const host = request.headers.get("host") || "";
    return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}

function isAuthorized(request: NextRequest): boolean {
    const configuredKey = process.env.PERF_METRICS_KEY;
    if (!configuredKey) return isLocalhostRequest(request);

    const token = request.headers.get("x-perf-key")
        || request.nextUrl.searchParams.get("key")
        || "";

    return token === configuredKey;
}

function generateCSV(summary: ReturnType<typeof getEventsPerfSummary>): string {
    const headers = ["Timestamp", "Duration (ms)", "Read (ms)", "Filter (ms)", "Sort (ms)", "Cache", "Status", "Result Count", "Payload (bytes)"];
    const rows = summary.latest.map(s => [
        new Date(s.ts).toISOString(),
        s.durationMs.toFixed(1),
        s.readMs.toFixed(1),
        s.filterMs.toFixed(1),
        s.sortMs.toFixed(1),
        s.cache,
        s.status,
        s.resultCount,
        s.payloadBytes
    ]);

    const csvLines = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ];

    return csvLines.join("\n");
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const format = request.nextUrl.searchParams.get("format");
    const summary = getEventsPerfSummary();

    if (format === "csv") {
        const csv = generateCSV(summary);
        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="perf-metrics-${new Date().toISOString().split('T')[0]}.csv"`,
                "Cache-Control": "no-store",
            },
        });
    }

    return NextResponse.json(summary, {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
