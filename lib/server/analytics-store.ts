import { Pool } from "pg";

type OutboundClickInput = {
    eventId: string;
    source: string;
    locale: string;
    targetHost: string;
    targetPath: string;
    referrer: string;
    userAgent: string;
    clientIp: string;
};

type PromoterLeadInput = {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    company: string;
    category: "events" | "guides" | "transfers" | "brand";
    budget: "under_500" | "500_2000" | "2000_plus" | "unknown";
    message: string;
    website?: string;
    locale: "pt" | "en";
};

type DashboardMetrics = {
    usingPostgres: boolean;
    totals: {
        clicks: number;
        leads: number;
    };
    comparison: {
        previousClicks: number;
        previousLeads: number;
        clicksDelta: number;
        leadsDelta: number;
        clicksDeltaPct: number | null;
        leadsDeltaPct: number | null;
        previousConversionRate: number;
        currentConversionRate: number;
        conversionDeltaPctPoints: number;
    };
    topSources: Array<{ source: string; clicks: number }>;
    sourceTrends: Array<{
        source: string;
        current: number;
        previous: number;
        delta: number;
        deltaPct: number | null;
    }>;
    topEvents: Array<{ eventId: string; clicks: number }>;
    dailyClicks: Array<{ day: string; clicks: number }>;
    previousDailyClicks: Array<{ day: string; clicks: number }>;
    recentLeads: Array<{
        id: string;
        createdAt: string;
        name: string;
        email: string;
        company: string;
        category: string;
        budget: string;
        locale: string;
    }>;
};

export type DashboardFilters = {
    source?: string;
    eventId?: string;
};

export type DashboardFilterOptions = {
    sources: string[];
    eventIds: string[];
};

export type DashboardExportClick = {
    createdAt: string;
    eventId: string;
    source: string;
    locale: string;
    targetHost: string;
    targetPath: string;
    referrer: string;
    userAgent: string;
    clientIp: string;
};

export type DashboardExportLead = {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    company: string;
    category: string;
    budget: string;
    message: string;
    website: string;
    locale: string;
};

function sanitizeFilter(value?: string): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

const outboundClicksMemory: Array<
    OutboundClickInput & {
        createdAt: string;
    }
> = [];

const promoterLeadsMemory: PromoterLeadInput[] = [];

let pool: Pool | null = null;
let schemaEnsured = false;

function getPool(): Pool | null {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        return null;
    }

    if (!pool) {
        pool = new Pool({
            connectionString: databaseUrl,
            ssl:
                process.env.POSTGRES_SSL === "disable"
                    ? false
                    : { rejectUnauthorized: false },
        });
    }

    return pool;
}

async function ensureSchema(): Promise<void> {
    const db = getPool();
    if (!db || schemaEnsured) {
        return;
    }

    await db.query(`
    CREATE TABLE IF NOT EXISTS wtd_outbound_clicks (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      event_id TEXT NOT NULL,
      source TEXT NOT NULL,
      locale TEXT NOT NULL,
      target_host TEXT NOT NULL,
      target_path TEXT NOT NULL,
      referrer TEXT NOT NULL,
      user_agent TEXT NOT NULL,
      client_ip TEXT NOT NULL
    );
  `);

    await db.query(`
    CREATE TABLE IF NOT EXISTS wtd_promoter_leads (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL,
      category TEXT NOT NULL,
      budget TEXT NOT NULL,
      message TEXT NOT NULL,
      website TEXT,
      locale TEXT NOT NULL
    );
  `);

    schemaEnsured = true;
}

export async function recordOutboundClick(
    input: OutboundClickInput,
): Promise<void> {
    const createdAt = new Date().toISOString();
    const db = getPool();

    if (!db) {
        outboundClicksMemory.push({ ...input, createdAt });
        return;
    }

    await ensureSchema();
    await db.query(
        `
      INSERT INTO wtd_outbound_clicks
      (event_id, source, locale, target_host, target_path, referrer, user_agent, client_ip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
        [
            input.eventId,
            input.source,
            input.locale,
            input.targetHost,
            input.targetPath,
            input.referrer,
            input.userAgent,
            input.clientIp,
        ],
    );
}

export async function recordPromoterLead(input: PromoterLeadInput): Promise<void> {
    const db = getPool();

    if (!db) {
        promoterLeadsMemory.push(input);
        return;
    }

    await ensureSchema();
    await db.query(
        `
      INSERT INTO wtd_promoter_leads
      (id, created_at, name, email, company, category, budget, message, website, locale)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO NOTHING
    `,
        [
            input.id,
            input.createdAt,
            input.name,
            input.email,
            input.company,
            input.category,
            input.budget,
            input.message,
            input.website || null,
            input.locale,
        ],
    );
}

function formatDateKey(dateIso: string): string {
    return new Date(dateIso).toISOString().slice(0, 10);
}

function computeDeltaPercentage(
    currentValue: number,
    previousValue: number,
): number | null {
    if (previousValue <= 0) {
        return null;
    }

    return ((currentValue - previousValue) / previousValue) * 100;
}

export async function getDashboardMetrics(days = 30): Promise<DashboardMetrics> {
    return getDashboardMetricsWithFilters(days, {});
}

export async function getDashboardMetricsWithFilters(
    days = 30,
    filters: DashboardFilters = {},
): Promise<DashboardMetrics> {
    const db = getPool();
    const sourceFilter = sanitizeFilter(filters.source);
    const eventIdFilter = sanitizeFilter(filters.eventId);

    if (!db) {
        const now = Date.now();
        const threshold = now - days * 24 * 60 * 60 * 1000;
        const previousThreshold = now - days * 2 * 24 * 60 * 60 * 1000;
        const recentClicks = outboundClicksMemory.filter((item) => {
            if (new Date(item.createdAt).getTime() < threshold) return false;
            if (sourceFilter && item.source !== sourceFilter) return false;
            if (eventIdFilter && item.eventId !== eventIdFilter) return false;
            return true;
        });
        const previousClicks = outboundClicksMemory.filter((item) => {
            const createdAtMs = new Date(item.createdAt).getTime();
            if (createdAtMs < previousThreshold || createdAtMs >= threshold) {
                return false;
            }
            if (sourceFilter && item.source !== sourceFilter) return false;
            if (eventIdFilter && item.eventId !== eventIdFilter) return false;
            return true;
        });
        const recentLeads = promoterLeadsMemory.filter(
            (item) => new Date(item.createdAt).getTime() >= threshold,
        );
        const previousLeads = promoterLeadsMemory.filter((item) => {
            const createdAtMs = new Date(item.createdAt).getTime();
            return createdAtMs >= previousThreshold && createdAtMs < threshold;
        });

        const currentConversionRate =
            recentClicks.length > 0
                ? (recentLeads.length / recentClicks.length) * 100
                : 0;
        const previousConversionRate =
            previousClicks.length > 0
                ? (previousLeads.length / previousClicks.length) * 100
                : 0;

        const sourceMap = new Map<string, number>();
        const previousSourceMap = new Map<string, number>();
        const eventMap = new Map<string, number>();
        const dayMap = new Map<string, number>();
        const previousDayMap = new Map<string, number>();

        recentClicks.forEach((item) => {
            sourceMap.set(item.source, (sourceMap.get(item.source) || 0) + 1);
            eventMap.set(item.eventId, (eventMap.get(item.eventId) || 0) + 1);
            const day = formatDateKey(item.createdAt);
            dayMap.set(day, (dayMap.get(day) || 0) + 1);
        });
        previousClicks.forEach((item) => {
            previousSourceMap.set(
                item.source,
                (previousSourceMap.get(item.source) || 0) + 1,
            );
            const day = formatDateKey(item.createdAt);
            previousDayMap.set(day, (previousDayMap.get(day) || 0) + 1);
        });

        const trendSources = Array.from(
            new Set([...sourceMap.keys(), ...previousSourceMap.keys()]),
        );
        const sourceTrends = trendSources
            .map((source) => {
                const current = sourceMap.get(source) || 0;
                const previous = previousSourceMap.get(source) || 0;
                return {
                    source,
                    current,
                    previous,
                    delta: current - previous,
                    deltaPct: computeDeltaPercentage(current, previous),
                };
            })
            .sort(
                (a, b) =>
                    Math.abs(b.delta) - Math.abs(a.delta) ||
                    b.current - a.current ||
                    a.source.localeCompare(b.source),
            )
            .slice(0, 10);

        return {
            usingPostgres: false,
            totals: {
                clicks: recentClicks.length,
                leads: recentLeads.length,
            },
            comparison: {
                previousClicks: previousClicks.length,
                previousLeads: previousLeads.length,
                clicksDelta: recentClicks.length - previousClicks.length,
                leadsDelta: recentLeads.length - previousLeads.length,
                clicksDeltaPct: computeDeltaPercentage(
                    recentClicks.length,
                    previousClicks.length,
                ),
                leadsDeltaPct: computeDeltaPercentage(
                    recentLeads.length,
                    previousLeads.length,
                ),
                previousConversionRate,
                currentConversionRate,
                conversionDeltaPctPoints:
                    currentConversionRate - previousConversionRate,
            },
            topSources: Array.from(sourceMap.entries())
                .map(([source, clicks]) => ({ source, clicks }))
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 8),
            sourceTrends,
            topEvents: Array.from(eventMap.entries())
                .map(([eventId, clicks]) => ({ eventId, clicks }))
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 8),
            dailyClicks: Array.from(dayMap.entries())
                .map(([day, clicks]) => ({ day, clicks }))
                .sort((a, b) => a.day.localeCompare(b.day)),
            previousDailyClicks: Array.from(previousDayMap.entries())
                .map(([day, clicks]) => ({ day, clicks }))
                .sort((a, b) => a.day.localeCompare(b.day)),
            recentLeads: recentLeads
                .slice()
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .slice(0, 20)
                .map((lead) => ({
                    id: lead.id,
                    createdAt: lead.createdAt,
                    name: lead.name,
                    email: lead.email,
                    company: lead.company,
                    category: lead.category,
                    budget: lead.budget,
                    locale: lead.locale,
                })),
        };
    }

    await ensureSchema();

    const filterClauses: string[] = [];
    const clickParams: (string | number)[] = [days];

    if (sourceFilter) {
        filterClauses.push(`source = $${clickParams.length + 1}`);
        clickParams.push(sourceFilter);
    }
    if (eventIdFilter) {
        filterClauses.push(`event_id = $${clickParams.length + 1}`);
        clickParams.push(eventIdFilter);
    }

    const clickFilterSuffix = filterClauses.length
        ? ` AND ${filterClauses.join(" AND ")}`
        : "";

    const clickWhere = `created_at >= NOW() - make_interval(days => $1::int)${clickFilterSuffix}`;
    const previousClickWhere = `created_at >= NOW() - make_interval(days => ($1::int * 2)) AND created_at < NOW() - make_interval(days => $1::int)${clickFilterSuffix}`;

    const [
        totalsResult,
        topSourcesResult,
        sourceTrendsResult,
        topEventsResult,
        dailyResult,
        previousDailyResult,
        leadsResult,
    ] =
        await Promise.all([
            db.query(
                `
          SELECT
            (SELECT COUNT(*)::int FROM wtd_outbound_clicks WHERE ${clickWhere}) AS clicks,
            (SELECT COUNT(*)::int FROM wtd_promoter_leads WHERE created_at >= NOW() - make_interval(days => $1::int)) AS leads,
            (SELECT COUNT(*)::int FROM wtd_outbound_clicks WHERE ${previousClickWhere}) AS "previousClicks",
            (SELECT COUNT(*)::int FROM wtd_promoter_leads WHERE created_at >= NOW() - make_interval(days => ($1::int * 2)) AND created_at < NOW() - make_interval(days => $1::int)) AS "previousLeads"
        `,
                clickParams,
            ),
            db.query(
                `
          SELECT source, COUNT(*)::int AS clicks
          FROM wtd_outbound_clicks
          WHERE ${clickWhere}
          GROUP BY source
          ORDER BY clicks DESC
          LIMIT 8
        `,
                clickParams,
            ),
            db.query(
                `
                    SELECT
                        source,
                        SUM(CASE WHEN created_at >= NOW() - make_interval(days => $1::int) THEN 1 ELSE 0 END)::int AS current,
                        SUM(CASE WHEN created_at >= NOW() - make_interval(days => ($1::int * 2)) AND created_at < NOW() - make_interval(days => $1::int) THEN 1 ELSE 0 END)::int AS previous
                    FROM wtd_outbound_clicks
                    WHERE created_at >= NOW() - make_interval(days => ($1::int * 2))${clickFilterSuffix}
                    GROUP BY source
                `,
                clickParams,
            ),
            db.query(
                `
          SELECT event_id AS "eventId", COUNT(*)::int AS clicks
          FROM wtd_outbound_clicks
          WHERE ${clickWhere}
          GROUP BY event_id
          ORDER BY clicks DESC
          LIMIT 8
        `,
                clickParams,
            ),
            db.query(
                `
          SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS clicks
          FROM wtd_outbound_clicks
          WHERE ${clickWhere}
          GROUP BY DATE_TRUNC('day', created_at)
          ORDER BY DATE_TRUNC('day', created_at) ASC
        `,
                clickParams,
            ),
            db.query(
                `
                    SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS clicks
                    FROM wtd_outbound_clicks
                    WHERE ${previousClickWhere}
                    GROUP BY DATE_TRUNC('day', created_at)
                    ORDER BY DATE_TRUNC('day', created_at) ASC
                `,
                clickParams,
            ),
            db.query(
                `
          SELECT
            id,
            created_at AS "createdAt",
            name,
            email,
            company,
            category,
            budget,
            locale
          FROM wtd_promoter_leads
          WHERE created_at >= NOW() - make_interval(days => $1::int)
          ORDER BY created_at DESC
          LIMIT 20
        `,
                [days],
            ),
        ]);

    const totals = totalsResult.rows[0] || {
        clicks: 0,
        leads: 0,
        previousClicks: 0,
        previousLeads: 0,
    };
    const currentClicks = Number(totals.clicks) || 0;
    const currentLeads = Number(totals.leads) || 0;
    const previousClicks = Number(totals.previousClicks) || 0;
    const previousLeads = Number(totals.previousLeads) || 0;
    const currentConversionRate =
        currentClicks > 0 ? (currentLeads / currentClicks) * 100 : 0;
    const previousConversionRate =
        previousClicks > 0 ? (previousLeads / previousClicks) * 100 : 0;

    return {
        usingPostgres: true,
        totals: {
            clicks: currentClicks,
            leads: currentLeads,
        },
        comparison: {
            previousClicks,
            previousLeads,
            clicksDelta: currentClicks - previousClicks,
            leadsDelta: currentLeads - previousLeads,
            clicksDeltaPct: computeDeltaPercentage(currentClicks, previousClicks),
            leadsDeltaPct: computeDeltaPercentage(currentLeads, previousLeads),
            previousConversionRate,
            currentConversionRate,
            conversionDeltaPctPoints:
                currentConversionRate - previousConversionRate,
        },
        topSources: topSourcesResult.rows.map((row) => ({
            source: String(row.source),
            clicks: Number(row.clicks) || 0,
        })),
        sourceTrends: sourceTrendsResult.rows
            .map((row) => {
                const source = String(row.source);
                const current = Number(row.current) || 0;
                const previous = Number(row.previous) || 0;

                return {
                    source,
                    current,
                    previous,
                    delta: current - previous,
                    deltaPct: computeDeltaPercentage(current, previous),
                };
            })
            .sort(
                (a, b) =>
                    Math.abs(b.delta) - Math.abs(a.delta) ||
                    b.current - a.current ||
                    a.source.localeCompare(b.source),
            )
            .slice(0, 10),
        topEvents: topEventsResult.rows.map((row) => ({
            eventId: String(row.eventId),
            clicks: Number(row.clicks) || 0,
        })),
        dailyClicks: dailyResult.rows.map((row) => ({
            day: String(row.day),
            clicks: Number(row.clicks) || 0,
        })),
        previousDailyClicks: previousDailyResult.rows.map((row) => ({
            day: String(row.day),
            clicks: Number(row.clicks) || 0,
        })),
        recentLeads: leadsResult.rows.map((row) => ({
            id: String(row.id),
            createdAt: new Date(row.createdAt).toISOString(),
            name: String(row.name),
            email: String(row.email),
            company: String(row.company),
            category: String(row.category),
            budget: String(row.budget),
            locale: String(row.locale),
        })),
    };
}

export async function getExportClicks(
    days = 30,
    filters: DashboardFilters = {},
): Promise<DashboardExportClick[]> {
    const db = getPool();
    const sourceFilter = sanitizeFilter(filters.source);
    const eventIdFilter = sanitizeFilter(filters.eventId);

    if (!db) {
        const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
        return outboundClicksMemory
            .filter((item) => {
                if (new Date(item.createdAt).getTime() < threshold) return false;
                if (sourceFilter && item.source !== sourceFilter) return false;
                if (eventIdFilter && item.eventId !== eventIdFilter) return false;
                return true;
            })
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((item) => ({
                createdAt: item.createdAt,
                eventId: item.eventId,
                source: item.source,
                locale: item.locale,
                targetHost: item.targetHost,
                targetPath: item.targetPath,
                referrer: item.referrer,
                userAgent: item.userAgent,
                clientIp: item.clientIp,
            }));
    }

    await ensureSchema();
    const filterClauses: string[] = [];
    const params: (string | number)[] = [days];

    if (sourceFilter) {
        filterClauses.push(`source = $${params.length + 1}`);
        params.push(sourceFilter);
    }
    if (eventIdFilter) {
        filterClauses.push(`event_id = $${params.length + 1}`);
        params.push(eventIdFilter);
    }

    const whereClause = `created_at >= NOW() - make_interval(days => $1::int)${filterClauses.length ? ` AND ${filterClauses.join(" AND ")}` : ""
        }`;

    const result = await db.query(
        `
          SELECT
            created_at AS "createdAt",
            event_id AS "eventId",
            source,
            locale,
            target_host AS "targetHost",
            target_path AS "targetPath",
            referrer,
            user_agent AS "userAgent",
            client_ip AS "clientIp"
          FROM wtd_outbound_clicks
                    WHERE ${whereClause}
          ORDER BY created_at DESC
        `,
        params,
    );

    return result.rows.map((row) => ({
        createdAt: new Date(row.createdAt).toISOString(),
        eventId: String(row.eventId),
        source: String(row.source),
        locale: String(row.locale),
        targetHost: String(row.targetHost),
        targetPath: String(row.targetPath),
        referrer: String(row.referrer),
        userAgent: String(row.userAgent),
        clientIp: String(row.clientIp),
    }));
}

export async function getDashboardFilterOptions(
    days = 30,
): Promise<DashboardFilterOptions> {
    const db = getPool();

    if (!db) {
        const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
        const recent = outboundClicksMemory.filter(
            (item) => new Date(item.createdAt).getTime() >= threshold,
        );
        const sources = Array.from(new Set(recent.map((item) => item.source)))
            .sort()
            .slice(0, 60);
        const eventIds = Array.from(new Set(recent.map((item) => item.eventId)))
            .sort()
            .slice(0, 200);

        return { sources, eventIds };
    }

    await ensureSchema();
    const [sourcesResult, eventsResult] = await Promise.all([
        db.query(
            `
              SELECT DISTINCT source
              FROM wtd_outbound_clicks
              WHERE created_at >= NOW() - make_interval(days => $1::int)
              ORDER BY source ASC
              LIMIT 60
            `,
            [days],
        ),
        db.query(
            `
              SELECT DISTINCT event_id AS "eventId"
              FROM wtd_outbound_clicks
              WHERE created_at >= NOW() - make_interval(days => $1::int)
              ORDER BY event_id ASC
              LIMIT 200
            `,
            [days],
        ),
    ]);

    return {
        sources: sourcesResult.rows.map((row) => String(row.source)),
        eventIds: eventsResult.rows.map((row) => String(row.eventId)),
    };
}

export async function getExportLeads(days = 30): Promise<DashboardExportLead[]> {
    const db = getPool();

    if (!db) {
        const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
        return promoterLeadsMemory
            .filter((item) => new Date(item.createdAt).getTime() >= threshold)
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((item) => ({
                id: item.id,
                createdAt: item.createdAt,
                name: item.name,
                email: item.email,
                company: item.company,
                category: item.category,
                budget: item.budget,
                message: item.message,
                website: item.website || "",
                locale: item.locale,
            }));
    }

    await ensureSchema();
    const result = await db.query(
        `
          SELECT
            id,
            created_at AS "createdAt",
            name,
            email,
            company,
            category,
            budget,
            message,
            website,
            locale
          FROM wtd_promoter_leads
          WHERE created_at >= NOW() - make_interval(days => $1::int)
          ORDER BY created_at DESC
        `,
        [days],
    );

    return result.rows.map((row) => ({
        id: String(row.id),
        createdAt: new Date(row.createdAt).toISOString(),
        name: String(row.name),
        email: String(row.email),
        company: String(row.company),
        category: String(row.category),
        budget: String(row.budget),
        message: String(row.message),
        website: row.website ? String(row.website) : "",
        locale: String(row.locale),
    }));
}
