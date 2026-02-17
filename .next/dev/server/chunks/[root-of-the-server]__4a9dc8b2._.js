module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/events/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
const dynamic = "force-static";
const revalidate = 3600; // 1 hour
async function GET(request) {
    try {
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "events.json");
        const fileContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, "utf-8");
        const rawEvents = JSON.parse(fileContent);
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
        const deduped = dedupeEvents(rawEvents).filter((event)=>includePast ? true : isUpcoming(event));
        let filtered = deduped.filter((event)=>{
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
        filtered.sort((a, b)=>{
            switch(sort){
                case "title":
                    return a.title.localeCompare(b.title);
                case "price":
                    {
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(filtered, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
            }
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch events"
        }, {
            status: 500
        });
    }
}
/**
 * Extract numeric price from price string
 * Examples: "Free" → 0, "€10-15" → 10, "Check site" → Infinity
 */ function normalizePrice(price) {
    if (!price) return {
        value: Infinity,
        label: "Preço indisponível"
    };
    const lower = price.toLowerCase();
    if (lower.includes("grátis") || lower.includes("gratis") || lower === "free") return {
        value: 0,
        label: "Grátis"
    };
    const match = price.match(/(\d+[\.,]?\d*)/);
    if (match) {
        const num = parseFloat(match[1].replace(",", "."));
        return {
            value: num,
            label: `${num}€`
        };
    }
    return {
        value: Infinity,
        label: price || "Preço indisponível"
    };
}
function isUpcoming(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOrStart = event.endDate ? new Date(event.endDate) : new Date(event.date);
    return endOrStart >= today;
}
function dedupeEvents(events) {
    const seen = new Set();
    const result = [];
    for (const ev of events){
        const key = ev.url || "" || `${ev.title}-${ev.date}`;
        const altKey = `${ev.title}-${ev.date}`;
        if (seen.has(key) || seen.has(altKey)) continue;
        seen.add(key);
        seen.add(altKey);
        result.push(ev);
    }
    return result;
}
function detectCategory(event) {
    const text = `${event.title} ${event.description || ""} ${event.location || ""}`.toLowerCase();
    if (/(discoteca|nightclub|boate|dj|cabaret|burlesque|stand-up|comedy|vida nocturna|noite)/i.test(text)) return "Discoteca/Nightlife";
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
function detectMusicGenre(event, category) {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4a9dc8b2._.js.map