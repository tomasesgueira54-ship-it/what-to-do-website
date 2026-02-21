import { NextRequest, NextResponse } from "next/server";
import {
    getExportClicks,
    getExportLeads,
    type DashboardExportClick,
    type DashboardExportLead,
} from "@/lib/server/analytics-store";

function isAuthorized(request: NextRequest, url: URL): boolean {
    const expectedUser = process.env.PARTNERS_DASHBOARD_USER;
    const expectedPassword = process.env.PARTNERS_DASHBOARD_PASSWORD;
    const expectedToken = process.env.PARTNERS_DASHBOARD_TOKEN;
    const hasBasicAuthConfig = Boolean(expectedUser && expectedPassword);
    const hasTokenConfig = Boolean(expectedToken);

    if (hasBasicAuthConfig) {
        const auth = request.headers.get("authorization");
        if (auth && auth.startsWith("Basic ")) {
            try {
                const encoded = auth.slice("Basic ".length).trim();
                const decoded = Buffer.from(encoded, "base64").toString("utf-8");
                const separator = decoded.indexOf(":");
                if (separator >= 0) {
                    const user = decoded.slice(0, separator);
                    const password = decoded.slice(separator + 1);
                    if (user === expectedUser && password === expectedPassword) {
                        return true;
                    }
                }
            } catch {
                return false;
            }
        }
    }

    if (hasTokenConfig && url.searchParams.get("token") === expectedToken) {
        return true;
    }

    return false;
}

function parseDays(value: string | null): number {
    if (!value) return 30;
    const parsed = Number(value);
    return parsed === 7 || parsed === 30 || parsed === 90 ? parsed : 30;
}

function escapeCsv(value: string): string {
    const safe = (value || "").replace(/"/g, '""');
    return `"${safe}"`;
}

function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
    if (rows.length === 0) {
        return "";
    }

    const headers = Object.keys(rows[0]);
    const lines = [headers.join(",")];

    rows.forEach((row) => {
        const values = headers.map((header) => {
            const raw = row[header];
            const value = raw === null || raw === undefined ? "" : String(raw);
            return escapeCsv(value);
        });
        lines.push(values.join(","));
    });

    return lines.join("\n");
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind") || "leads";
    const days = parseDays(url.searchParams.get("days"));
    const source = url.searchParams.get("source") || undefined;
    const eventId = url.searchParams.get("eventId") || undefined;

    if (!isAuthorized(request, url)) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            {
                status: 401,
                headers: {
                    "WWW-Authenticate": 'Basic realm="What To Do Partners Dashboard"',
                },
            },
        );
    }

    if (kind !== "leads" && kind !== "clicks") {
        return NextResponse.json(
            { success: false, error: "Invalid kind. Use leads or clicks." },
            { status: 400 },
        );
    }

    if (kind === "clicks") {
        const rows: DashboardExportClick[] = await getExportClicks(days, {
            source,
            eventId,
        });
        const csv = toCsv(rows);
        const filename = `wtd-clicks-${days}d.csv`;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename=${filename}`,
            },
        });
    }

    const rows: DashboardExportLead[] = await getExportLeads(days);
    const csv = toCsv(rows);
    const filename = `wtd-leads-${days}d.csv`;

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename=${filename}`,
        },
    });
}
