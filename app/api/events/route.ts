import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Event, MusicGenre, EventCategory } from "@/data/types";
import { dedupeEvents, getAllEventsCached, isUpcoming } from "@/lib/server/events-store";
import { recordEventsPerf } from "@/lib/server/events-perf";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const QUERY_CACHE_TTL_MS = 30_000;
const QUERY_CACHE_MAX_ENTRIES = 200;

type QueryCacheEntry = {
    cachedAt: number;
    payload: Event[];
    etag: string;
};

const queryResultCache = new Map<string, QueryCacheEntry>();

function pruneQueryCache(now: number): void {
    for (const [key, entry] of queryResultCache) {
        if (now - entry.cachedAt >= QUERY_CACHE_TTL_MS) {
            queryResultCache.delete(key);
        }
    }

    if (queryResultCache.size <= QUERY_CACHE_MAX_ENTRIES) return;

    const entriesByAge = [...queryResultCache.entries()].sort(
        (first, second) => first[1].cachedAt - second[1].cachedAt,
    );
    const overflow = queryResultCache.size - QUERY_CACHE_MAX_ENTRIES;
    for (let index = 0; index < overflow; index += 1) {
        const oldestKey = entriesByAge[index]?.[0];
        if (!oldestKey) break;
        queryResultCache.delete(oldestKey);
    }
}

function buildEtag(payload: unknown): string {
    const hash = crypto
        .createHash("sha1")
        .update(JSON.stringify(payload))
        .digest("hex");
    return `W/\"${hash}\"`;
}

function formatDurationMs(startNs: bigint): number {
    return Number(process.hrtime.bigint() - startNs) / 1_000_000;
}

function buildServerTiming(parts: Array<{ name: string; duration: number }>): string {
    return parts
        .map((part) => `${part.name};dur=${part.duration.toFixed(2)}`)
        .join(", ");
}

function hashQueryKey(input: string): string {
    return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12);
}

/**
 * GET /api/events
 * Fetch and filter events with optional query parameters
 *
 * Query Parameters:
 * - search: string (searches title, description, location)
 * - category: string (filters by category)
 * - location: string (filters by location)
 * - sort: 'date' | 'title' | 'price' (default: 'date')
 * - limit: number (default: 250)
 *
 * Example:
 * /api/events?search=fado&category=Música&sort=date&limit=20
 */
export async function GET(request: NextRequest) {
    const reqStart = process.hrtime.bigint();
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search")?.toLowerCase() || "";
        const category = searchParams.get("category") || "";
        const genre = searchParams.get("genre") || "";
        const location = searchParams.get("location")?.toLowerCase() || "";
        const sortParam = searchParams.get("sort") || "date";
        const onlyFree = searchParams.get("free") === "true";
        const minPriceParam = Number.parseFloat(searchParams.get("minPrice") || "0");
        const maxPriceParam = Number.parseFloat(searchParams.get("maxPrice") || "");
        const includePast = searchParams.get("includePast") === "true";
        const limitParam = Number.parseInt(searchParams.get("limit") || "250", 10);

        const minPrice = Number.isFinite(minPriceParam) ? Math.max(minPriceParam, 0) : 0;
        const maxPrice = Number.isFinite(maxPriceParam) ? Math.max(maxPriceParam, minPrice) : Number.POSITIVE_INFINITY;
        const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 250)) : 250;
        const sort = ["date", "title", "price"].includes(sortParam) ? sortParam : "date";

        const queryFingerprint = JSON.stringify({
            search,
            category,
            genre,
            location,
            sort,
            onlyFree,
            minPrice,
            maxPrice,
            includePast,
            limit,
        });
        const queryKeyHash = hashQueryKey(queryFingerprint);

        const incomingEtag = request.headers.get("if-none-match");
        const cached = queryResultCache.get(queryFingerprint);
        const now = Date.now();

        pruneQueryCache(now);

        if (cached && now - cached.cachedAt < QUERY_CACHE_TTL_MS) {
            const totalDuration = formatDurationMs(reqStart);
            const serverTiming = buildServerTiming([
                { name: "events-query-cache", duration: 0.01 },
                { name: "events-total", duration: totalDuration },
            ]);

            recordEventsPerf({
                durationMs: totalDuration,
                readMs: 0,
                filterMs: 0,
                sortMs: 0,
                totalCandidates: cached.payload.length,
                resultCount: cached.payload.length,
                payloadBytes: Buffer.byteLength(JSON.stringify(cached.payload)),
                cache: "HIT",
                status: incomingEtag && incomingEtag === cached.etag ? 304 : 200,
                queryKeyHash,
            });

            if (incomingEtag && incomingEtag === cached.etag) {
                return new NextResponse(null, {
                    status: 304,
                    headers: {
                        ETag: cached.etag,
                        "Cache-Control": "public, max-age=60, s-maxage=1800, stale-while-revalidate=86400",
                        Vary: "Accept-Encoding",
                        "Server-Timing": serverTiming,
                        "X-Events-Query-Cache": "HIT",
                    },
                });
            }

            return NextResponse.json(cached.payload, {
                headers: {
                    ETag: cached.etag,
                    "Cache-Control": "public, max-age=60, s-maxage=1800, stale-while-revalidate=86400",
                    Vary: "Accept-Encoding",
                    "Server-Timing": serverTiming,
                    "X-Events-Query-Cache": "HIT",
                    "X-Events-Count": String(cached.payload.length),
                },
            });
        }

        const readStart = process.hrtime.bigint();
        const rawEvents = await getAllEventsCached();
        const readDuration = formatDurationMs(readStart);

        // Normalize + dedupe first
        const deduped = dedupeEvents(rawEvents)
            .filter((event) => (includePast ? true : isUpcoming(event)));

        const filterStart = process.hrtime.bigint();
        let filtered = deduped.filter((event) => {
            const priceValue = normalizePrice(event.price).value;
            const derivedCategory = event.category || detectCategory(event);
            const derivedGenre = event.musicGenre || detectMusicGenre(event, derivedCategory);

            if (search) {
                const searchableText = `${event.title} ${event.description || ""} ${event.location || ""}`.toLowerCase();
                if (!searchableText.includes(search)) return false;
            }

            if (category && derivedCategory !== category) return false;
            if (genre && derivedGenre !== genre) return false;
            if (location && !event.location?.toLowerCase().includes(location)) return false;

            if (onlyFree && priceValue !== 0) return false;
            if (priceValue < minPrice) return false;
            if (priceValue > maxPrice) return false;

            return true;
        });
        const filterDuration = formatDurationMs(filterStart);

        const sortStart = process.hrtime.bigint();
        filtered.sort((a, b): number => {
            switch (sort) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "price": {
                    const priceA = normalizePrice(a.price).value;
                    const priceB = normalizePrice(b.price).value;
                    return priceA - priceB;
                }
                case "date":
                default:
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
            }
        });
        const sortDuration = formatDurationMs(sortStart);

        filtered = filtered.slice(0, limit);

        const etag = buildEtag(filtered);
        queryResultCache.set(queryFingerprint, {
            cachedAt: now,
            payload: filtered,
            etag,
        });

        const serverTiming = buildServerTiming([
            { name: "events-read", duration: readDuration },
            { name: "events-filter", duration: filterDuration },
            { name: "events-sort", duration: sortDuration },
            { name: "events-total", duration: formatDurationMs(reqStart) },
        ]);
        const totalDuration = formatDurationMs(reqStart);
        const payloadBytes = Buffer.byteLength(JSON.stringify(filtered));

        recordEventsPerf({
            durationMs: totalDuration,
            readMs: readDuration,
            filterMs: filterDuration,
            sortMs: sortDuration,
            totalCandidates: deduped.length,
            resultCount: filtered.length,
            payloadBytes,
            cache: "MISS",
            status: incomingEtag && incomingEtag === etag ? 304 : 200,
            queryKeyHash,
        });

        if (incomingEtag && incomingEtag === etag) {
            return new NextResponse(null, {
                status: 304,
                headers: {
                    ETag: etag,
                    "Cache-Control": "public, max-age=60, s-maxage=1800, stale-while-revalidate=86400",
                    Vary: "Accept-Encoding",
                    "Server-Timing": serverTiming,
                    "X-Events-Query-Cache": "MISS",
                },
            });
        }

        return NextResponse.json(filtered, {
            headers: {
                ETag: etag,
                "Cache-Control": "public, max-age=60, s-maxage=1800, stale-while-revalidate=86400",
                Vary: "Accept-Encoding",
                "Server-Timing": serverTiming,
                "X-Events-Query-Cache": "MISS",
                "X-Events-Count": String(filtered.length),
            },
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        recordEventsPerf({
            durationMs: formatDurationMs(reqStart),
            readMs: 0,
            filterMs: 0,
            sortMs: 0,
            totalCandidates: 0,
            resultCount: 0,
            payloadBytes: 0,
            cache: "MISS",
            status: 500,
            queryKeyHash: "error",
        });
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

/**
 * Extract numeric price from price string
 * Examples: "Free" → 0, "€10-15" → 10, "Check site" → Infinity
 */
function normalizePrice(price?: string): { value: number; label: string } {
    if (!price) return { value: Infinity, label: "Preço indisponível" };

    const lower = price.toLowerCase();
    if (lower.includes("grátis") || lower.includes("gratis") || lower === "free")
        return { value: 0, label: "Grátis" };

    const match = price.match(/(\d+[\.,]?\d*)/);
    if (match) {
        const num = parseFloat(match[1].replace(",", "."));
        return { value: num, label: `${num}€` };
    }

    return { value: Infinity, label: price || "Preço indisponível" };
}

function detectCategory(event: Event): EventCategory {
    const text = `${event.title} ${event.description || ""} ${event.location || ""}`.toLowerCase();

    if (/(discoteca|nightclub|boate|dj|cabaret|burlesque|stand-up|comedy|vida nocturna|noite)/i.test(text))
        return "Discoteca/Nightlife";
    if (/(teatro|peça|espetáculo|dramático)/i.test(text)) return "Teatro";
    if (/(cinema|filme|documentário|projeção)/i.test(text)) return "Cinema";
    if (/(concerto|música|show|festival|banda|artista|fado|rock|jazz)/i.test(text)) return "Música";
    if (/(dança|ballet|coreograf|movimento)/i.test(text)) return "Dança";
    if (/(exposição|mostra|galeria|arte|museu|obra)/i.test(text)) return "Exposição";
    if (/(palestra|seminário|conferência|talk|workshop|formação|entrevista)/i.test(text)) return "Conferência";
    if (/(mercado|feira|market|feria|vendas)/i.test(text)) return "Mercado/Feira";
    if (/(festa|party|carnaval|celebração)/i.test(text)) return "Festa";
    if (/(ao ar livre|parque|jardim|outdoor)/i.test(text)) return "Ao Ar Livre";
    return "Outro";
}

function detectMusicGenre(event: Event, category: EventCategory): MusicGenre | undefined {
    if (category !== "Música") return undefined;

    const text = `${event.title} ${event.description || ""}`.toLowerCase();
    if (text.includes("fado")) return "Fado";
    if (text.includes("rock")) return "Rock";
    if (text.includes("jazz")) return "Jazz";
    if (text.includes("pop")) return "Pop";
    if (text.includes("hard techno") || text.includes("hardtechno")) return "Hard Techno";
    if (text.includes("techno")) return "Techno";
    if (text.includes("trance")) return "Trance";
    if (text.includes("house")) return "House";
    if (text.includes("funk")) return "Funk";
    if (/(clássic|orquest|sinfonia|clásico)/i.test(text)) return "Clássico";
    if (text.includes("reggae")) return "Reggae";
    if (/(hip-hop|hiphop|rap)/i.test(text)) return "Hip-Hop";
    if (/(folk|tradicion|gaita)/i.test(text)) return "Folk/Tradicional";
    if (/(samba|carnaval|bossa nova)/i.test(text)) return "Samba/Carnaval";
    if (text.includes("k-pop") || text.includes("kpop")) return "K-Pop";
    if (/(experimental|avant-garde)/i.test(text)) return "Experimental";
    return undefined;
}
