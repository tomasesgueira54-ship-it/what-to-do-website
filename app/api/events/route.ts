import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Event, MusicGenre, EventCategory } from "@/data/types";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

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
    try {
        const filePath = path.join(process.cwd(), "data", "events.json");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const rawEvents: Event[] = JSON.parse(fileContent);

        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search")?.toLowerCase() || "";
        const category = searchParams.get("category") || "";
        const genre = searchParams.get("genre") || "";
        const location = searchParams.get("location") || "";
        const sort = searchParams.get("sort") || "date";
        const onlyFree = searchParams.get("free") === "true";
        const minPrice = parseFloat(searchParams.get("minPrice") || "0");
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "" + Infinity);
        const includePast = searchParams.get("includePast") === "true";
        const limit = Math.min(parseInt(searchParams.get("limit") || "250"), 250);

        // Normalize + dedupe first
        const deduped = dedupeEvents(rawEvents)
            .filter((event) => (includePast ? true : isUpcoming(event)));

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
            if (location && !event.location?.toLowerCase().includes(location.toLowerCase())) return false;

            if (onlyFree && priceValue !== 0) return false;
            if (priceValue < minPrice) return false;
            if (priceValue > maxPrice) return false;

            return true;
        });

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

        filtered = filtered.slice(0, limit);

        return NextResponse.json(filtered, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        console.error("Error fetching events:", error);
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

function isUpcoming(event: Event): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOrStart = event.endDate ? new Date(event.endDate) : new Date(event.date);
    return endOrStart >= today;
}

function dedupeEvents(events: Event[]): Event[] {
    const seen = new Set<string>();
    const result: Event[] = [];

    for (const ev of events) {
        const key = (ev.url || "") || `${ev.title}-${ev.date}`;
        const altKey = `${ev.title}-${ev.date}`;
        if (seen.has(key) || seen.has(altKey)) continue;
        seen.add(key);
        seen.add(altKey);
        result.push(ev);
    }

    return result;
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
