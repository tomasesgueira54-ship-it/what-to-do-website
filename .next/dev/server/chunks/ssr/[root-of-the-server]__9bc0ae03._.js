module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/error.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/error.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/[locale]/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[locale]/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/components/EventCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-rsc] (ecmascript)");
;
;
;
function EventCard({ event, locale = "pt" }) {
    const dateLocale = locale === "pt" ? "pt-PT" : "en-US";
    const eventDate = new Date(event.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isToday = eventDate.toDateString() === today.toDateString();
    const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();
    const formattedDate = eventDate.toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "short"
    });
    const formattedTimeStart = eventDate.toLocaleTimeString(dateLocale, {
        hour: "2-digit",
        minute: "2-digit"
    });
    const endDate = event.endDate ? new Date(event.endDate) : null;
    const formattedTimeEnd = endDate ? endDate.toLocaleTimeString(dateLocale, {
        hour: "2-digit",
        minute: "2-digit"
    }) : null;
    const normalizedPrice = event.price || (locale === "pt" ? "Preço indisponível" : "Price unavailable");
    const isPriceFree = normalizedPrice.toLowerCase().includes("grátis") || normalizedPrice.toLowerCase() === "free";
    const priceClass = isPriceFree ? "bg-green-500/15 border-green-500/40 text-green-300 shadow-[0_0_12px_rgba(74,222,128,0.15)]" : "bg-brand-red/15 border-brand-red/40 text-brand-red-light shadow-[0_0_12px_rgba(142,13,60,0.15)]";
    const timeLabel = isToday ? locale === "pt" ? "Hoje" : "Today" : isTomorrow ? locale === "pt" ? "Amanhã" : "Tomorrow" : formattedDate;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-brand-black-light rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_-5px_rgba(142,13,60,0.4)] hover:-translate-y-1 transition-all duration-300 border border-white/5 ring-1 ring-white/5 hover:border-brand-red/50 hover:ring-brand-red/50 group h-full flex flex-col relative z-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
            }, void 0, false, {
                fileName: "[project]/components/EventCard.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-[4/3] w-full overflow-hidden bg-brand-grey-dark z-10",
                children: [
                    event.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: event.image,
                        alt: event.title,
                        fill: true,
                        sizes: "(max-width: 768px) 100vw, 33vw",
                        className: "object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full flex items-center justify-center text-brand-grey group-hover:scale-110 transition-transform duration-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500",
                            children: "📅"
                        }, void 0, false, {
                            fileName: "[project]/components/EventCard.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex flex-col items-center text-center shadow-lg transform group-hover:scale-105 transition-transform duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold text-brand-red uppercase tracking-wider",
                                children: eventDate.toLocaleDateString(dateLocale, {
                                    month: "short"
                                }).replace(".", "")
                            }, void 0, false, {
                                fileName: "[project]/components/EventCard.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl font-black text-white leading-none",
                                children: eventDate.getDate()
                            }, void 0, false, {
                                fileName: "[project]/components/EventCard.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 left-3 flex gap-2",
                        children: event.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "bg-brand-red/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm uppercase tracking-wide",
                            children: event.category
                        }, void 0, false, {
                            fileName: "[project]/components/EventCard.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EventCard.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-5 flex-1 flex flex-col gap-3 relative z-10 bg-brand-black-light/95 backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-brand-black/50 to-transparent rounded-xl border border-white/5 hover:border-brand-red/30 transition-colors duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 bg-brand-black/40 px-3 py-2 rounded-lg border border-brand-red/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {
                                        className: "text-brand-red text-sm flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EventCard.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col leading-none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-brand-grey font-bold uppercase tracking-wider opacity-70",
                                                children: timeLabel
                                            }, void 0, false, {
                                                fileName: "[project]/components/EventCard.tsx",
                                                lineNumber: 110,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-bold text-white tracking-wide",
                                                children: [
                                                    formattedTimeStart,
                                                    formattedTimeEnd ? ` — ${formattedTimeEnd}` : ""
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/EventCard.tsx",
                                                lineNumber: 113,
                                                columnNumber: 15
                                            }, this),
                                            endDate && endDate.toDateString() !== eventDate.toDateString() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-brand-grey mt-0.5",
                                                children: [
                                                    "até",
                                                    " ",
                                                    endDate.toLocaleDateString(dateLocale, {
                                                        day: "numeric",
                                                        month: "short"
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/EventCard.tsx",
                                                lineNumber: 119,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/EventCard.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EventCard.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-2 px-3 py-2 rounded-lg border font-bold text-xs uppercase tracking-wider flex-shrink-0 ${priceClass}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] opacity-75",
                                        children: "💰"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EventCard.tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this),
                                    normalizedPrice
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EventCard.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-white leading-snug line-clamp-2 min-h-[3rem] group-hover:text-brand-red transition-colors duration-300",
                        children: event.title
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-brand-grey text-xs italic flex-1 hidden sm:block",
                        children: locale === "pt" ? "Descrição disponível na página do evento." : "Description available on the event page."
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto flex items-center justify-between text-brand-grey-light text-xs pt-4 border-t border-dashed border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5 truncate max-w-[70%] group-hover:text-white transition-colors duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
                                        className: "text-brand-red flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EventCard.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    event.location
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EventCard.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5 text-brand-red text-[10px] font-bold uppercase tracking-wider bg-brand-red/10 px-2 py-1 rounded-full group-hover:bg-brand-red group-hover:text-white transition-all duration-300",
                                children: [
                                    locale === "pt" ? "Ver Mais" : "View More",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaTicketAlt"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/components/EventCard.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EventCard.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EventCard.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/EventCard.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/data/episodes.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "episodes",
    ()=>episodes,
    "richEpisodesMap",
    ()=>richEpisodesMap
]);
const richEpisodesMap = {
    '1': {
        id: '1',
        title: 'Episódio #1 - Bem-vindos ao What To Do',
        description: 'Neste episódio de arranque, apresentamos o conceito do podcast, quem está por trás do microfone e o que pode esperar dos próximos episódios.',
        duration: '45:30',
        publishDate: '15 Fev 2026',
        audioUrl: '/audio/episode-1.mp3',
        imageUrl: '/images/episode-1.jpg',
        guest: {
            name: 'Equipa What To Do',
            bio: 'A equipa fundadora do projeto, apaixonada por descobrir novas experiências.',
            links: [
                {
                    label: 'Instagram',
                    url: 'https://instagram.com/whattodo'
                },
                {
                    label: 'Twitter',
                    url: 'https://twitter.com/whattodo'
                }
            ]
        },
        showNotes: [
            {
                time: '00:00',
                seconds: 0,
                description: 'Introdução e boas-vindas'
            },
            {
                time: '05:30',
                seconds: 330,
                description: 'A história de como surgiu a ideia'
            },
            {
                time: '15:45',
                seconds: 945,
                description: 'O que esperar desta primeira temporada'
            },
            {
                time: '32:10',
                seconds: 1930,
                description: 'Perguntas e respostas rápidas'
            },
            {
                time: '44:00',
                seconds: 2640,
                description: 'Conclusão e despedida'
            }
        ],
        transcript: [
            {
                time: '00:00',
                seconds: 0,
                speaker: 'Host',
                text: 'Olá a todos e sejam muito bem-vindos ao primeiro episódio do What To Do!'
            },
            {
                time: '00:15',
                seconds: 15,
                speaker: 'Host',
                text: 'Hoje é um dia muito especial porque finalmente tiramos este projeto do papel.'
            },
            {
                time: '00:45',
                seconds: 45,
                speaker: 'Co-Host',
                text: 'É verdade! Foram meses de planeamento, cafés e imensas ideias trocadas.'
            },
            {
                time: '05:30',
                seconds: 330,
                speaker: 'Host',
                text: 'Tudo começou naquela viagem a Londres, lembra-te? Estávamos sem saber onde ir jantar.'
            },
            {
                time: '06:00',
                seconds: 360,
                speaker: 'Co-Host',
                text: 'Exatamente! E percebemos que faltava um guia que fosse mais pessoal, mais real.'
            }
        ]
    },
    '2': {
        id: '2',
        title: 'Episódio #2 - Produtividade e Rotinas',
        description: 'Conversamos sobre hábitos, consistência e estratégias práticas para organizar o dia e fazer mais com menos stress.',
        duration: '38:15',
        publishDate: '12 Fev 2026',
        audioUrl: '/audio/episode-2.mp3',
        imageUrl: '/images/episode-2.jpg',
        showNotes: [
            {
                time: '00:00',
                seconds: 0,
                description: 'Intro: Porquê produtividade?'
            },
            {
                time: '08:20',
                seconds: 500,
                description: 'A regra dos 2 minutos'
            },
            {
                time: '14:30',
                seconds: 870,
                description: 'Ferramentas digitais vs Papel'
            },
            {
                time: '28:15',
                seconds: 1695,
                description: 'Como dizer "não" ajuda a focar'
            }
        ],
        transcript: [
            {
                time: '00:00',
                seconds: 0,
                speaker: 'Host',
                text: 'Bem-vindos a mais um episódio. Hoje o tema é um dos meus favoritos: produtividade.'
            },
            {
                time: '01:20',
                seconds: 80,
                speaker: 'Host',
                text: 'Mas atenção, não é produtividade tóxica. É sobre ter tempo para o que importa.'
            },
            {
                time: '08:20',
                seconds: 500,
                speaker: 'Host',
                text: 'Vamos falar da regra dos 2 minutos. Se demora menos de 2 minutos, faz logo.'
            },
            {
                time: '08:45',
                seconds: 525,
                speaker: 'Co-Host',
                text: 'Isso mudou a minha vida. Deixei de acumular emails e loiça na pia!'
            }
        ]
    },
    '3': {
        id: '3',
        title: 'Episódio #3 - Viagens e Aventuras',
        description: 'Histórias de viagens, imprevistos pelo caminho e como essas experiências mudam a forma como vemos a vida.',
        duration: '52:20',
        publishDate: '9 Fev 2026',
        audioUrl: '/audio/episode-3.mp3',
        imageUrl: '/images/episode-3.jpg',
        showNotes: [
            {
                time: '00:00',
                seconds: 0,
                description: 'O bichinho das viagens'
            },
            {
                time: '10:15',
                seconds: 615,
                description: 'Perdidos em Tóquio'
            },
            {
                time: '25:40',
                seconds: 1540,
                description: 'Dicas para viajar leve (onebag)'
            },
            {
                time: '41:00',
                seconds: 2460,
                description: 'Próximos destinos na lista'
            }
        ],
        transcript: [
            {
                time: '00:00',
                seconds: 0,
                speaker: 'Host',
                text: 'Hoje vamos viajar sem sair do lugar. Apertem os cintos!'
            },
            {
                time: '10:15',
                seconds: 615,
                speaker: 'Convidado',
                text: 'Eu lembro-me perfeitamente, saí do metro e não fazia ideia onde estava. Tóquio é gigante.'
            },
            {
                time: '10:45',
                seconds: 645,
                speaker: 'Host',
                text: 'E sem internet? Como te orientaste?'
            },
            {
                time: '11:00',
                seconds: 660,
                speaker: 'Convidado',
                text: 'Perguntei a um local. A linguagem gestual funciona em todo o lado!'
            }
        ]
    }
};
const episodes = Object.values(richEpisodesMap);
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[project]/messages/pt.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"header":{"home":"Início","events":"Eventos","podcast":"Podcast","blog":"Guias","about":"Sobre","subscribe":"Subscrever"},"home":{"tagline":"O Teu Guia Oficial","title":"WHAT TO DO LISBOA","description":"Os melhores eventos, restaurantes, experiências e segredos de Lisboa. Tudo o que precisas saber para aproveitar a cidade.","cta_events":"Ver Agenda da Semana","cta_podcast":"Ouvir Podcast","categories":["Concertos","Teatro","Nightlife","Restaurantes","Ar Livre","Arte"],"featured":{"title":"Destaques da Semana","subtitle":"Os eventos imperdíveis nos próximos dias.","view_all":"Ver todos os eventos"}},"events":{"title":"Agenda Cultural","subtitle":"Os melhores eventos, concertos, exposições e festas em Lisboa para esta semana.","total":"Total de eventos","search_placeholder":"Pesquisar eventos (Em breve)"},"blog":{"title":"Guias e Roteiros","subtitle":"Descubra as nossas curadorias semanais, reviews de restaurantes e roteiros secretos para explorar Lisboa.","back":"Voltar"},"about":{"title":"Sobre o What To Do - Lisboa","description":"O teu guia definitivo para descobrir o que fazer em Lisboa. Desde eventos imperdíveis a segredos escondidos, trazemos-te as melhores sugestões para aproveitar a cidade ao máximo.","sections":{"agenda":{"title":"Agenda Semanal","description":"Curaçadoria semanal dos melhores concertos, exposições, teatro e festas que acontecem em Lisboa."},"podcast":{"title":"Podcast","description":"Conversas com personalidades de Lisboa, artistas e empreendedores sobre os seus projetos e a sua visão da cidade."},"guides":{"title":"Guias & Roteiros","description":"Sugestões de restaurantes, bares, passeios e experiências únicas testadas pela nossa equipa."}},"mission":"A nossa missão","mission_text":"Lisboa está cheia de vida, mas às vezes é difícil saber por onde começar. O What To Do nasceu para responder à pergunta clássica: \"O que vamos fazer hoje?\".","mission_detail":"Queremos conectar-te com a cultura vibrante da cidade, apoiar artistas locais e garantir que nunca fiques sem planos para o fim de semana.","cta_episodes":"Ouvir Episódios","cta_blog":"Ler Artigos"},"footer":{"description":"Descubra o que fazer através do nosso podcast e blog. Histórias inspiradoras, dicas práticas e entretenimento de qualidade.","quick_links":"Links Rápidos","newsletter":"Newsletter","newsletter_description":"Receba novos episódios e artigos diretamente no seu email.","copyright":"What To Do - Blog & Podcast. Todos os direitos reservados.","privacy":"Privacidade","terms":"Termos"},"subscribe":{"placeholder":"Seu email...","button":"Subscrever","success":"Obrigado! Verifica o teu email.","error":"Erro ao subscrever. Tenta novamente.","already":"Este email já está subscrito."},"common":{"loading":"Carregando...","error":"Erro","success":"Sucesso","try_again":"Tenta novamente","close":"Fechar"}});}),
"[project]/messages/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"header":{"home":"Home","events":"Events","podcast":"Podcast","blog":"Guides","about":"About","subscribe":"Subscribe"},"home":{"tagline":"Your Official Guide","title":"WHAT TO DO LISBON","description":"The best events, restaurants, experiences and hidden gems in Lisbon. Everything you need to make the most of the city.","cta_events":"View This Week's Agenda","cta_podcast":"Listen to Podcast","categories":["Concerts","Theater","Nightlife","Restaurants","Outdoors","Art"],"featured":{"title":"This Week's Highlights","subtitle":"The unmissable events in the coming days.","view_all":"View all events"}},"events":{"title":"Cultural Agenda","subtitle":"The best events, concerts, exhibitions and parties in Lisbon for this week.","total":"Total events","search_placeholder":"Search events (Coming soon)"},"blog":{"title":"Guides & Itineraries","subtitle":"Discover our weekly curations, restaurant reviews and secret routes to explore Lisbon.","back":"Back"},"about":{"title":"About What To Do - Lisbon","description":"Your definitive guide to discovering what to do in Lisbon. From unmissable events to hidden secrets, we bring you the best suggestions to make the most of the city.","sections":{"agenda":{"title":"Weekly Agenda","description":"Weekly curation of the best concerts, exhibitions, theater and parties happening in Lisbon."},"podcast":{"title":"Podcast","description":"Conversations with Lisbon personalities, artists and entrepreneurs about their projects and their vision of the city."},"guides":{"title":"Guides & Itineraries","description":"Suggestions for restaurants, bars, walks and unique experiences tested by our team."}},"mission":"Our mission","mission_text":"Lisbon is full of life, but sometimes it's hard to know where to start. What To Do was born to answer the classic question: \"What are we going to do today?\".","mission_detail":"We want to connect you with the vibrant culture of the city, support local artists and ensure you never run out of weekend plans.","cta_episodes":"Listen to Episodes","cta_blog":"Read Articles"},"footer":{"description":"Discover what to do through our podcast and blog. Inspiring stories, practical tips and quality entertainment.","quick_links":"Quick Links","newsletter":"Newsletter","newsletter_description":"Receive new episodes and articles directly in your email.","copyright":"What To Do - Blog & Podcast. All rights reserved.","privacy":"Privacy","terms":"Terms"},"subscribe":{"placeholder":"Your email...","button":"Subscribe","success":"Thank you! Check your email.","error":"Error subscribing. Try again.","already":"This email is already subscribed."},"common":{"loading":"Loading...","error":"Error","success":"Success","try_again":"Try again","close":"Close"}});}),
"[project]/lib/use-translations.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTranslations",
    ()=>getTranslations,
    "useTranslations",
    ()=>useTranslations
]);
const messages = {
    pt: __turbopack_context__.r("[project]/messages/pt.json (json)"),
    en: __turbopack_context__.r("[project]/messages/en.json (json)")
};
function useTranslations(locale) {
    const translation = messages[locale] || messages.pt;
    return (key, defaultValue)=>{
        const keys = key.split('.');
        let value = translation;
        for (const k of keys){
            value = value?.[k];
        }
        return typeof value === 'string' ? value : defaultValue || key;
    };
}
function getTranslations(locale) {
    return messages[locale] || messages.pt;
}
}),
"[project]/app/[locale]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EventCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/EventCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SubscribeForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SubscribeForm.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$episodes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/episodes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$translations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-translations.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n.config.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
async function getEvents() {
    try {
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "events.json");
        const fileContent = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(filePath, "utf-8");
        return JSON.parse(fileContent);
    } catch  {
        return [];
    }
}
async function Home({ params }) {
    const { locale: localeParam } = await params;
    const locale = __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["locales"].includes(localeParam) ? localeParam : __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultLocale"];
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$translations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTranslations"])(locale);
    const events = await getEvents();
    const latestEpisode = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$episodes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["episodes"][0];
    const recentEpisodes = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$episodes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["episodes"].slice(1, 3);
    const allSorted = [
        ...events
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    const featuredEvents = allSorted.slice(0, 2);
    const upcomingEvents = allSorted.slice(2, 6);
    const recentPosts = [
        {
            id: "1",
            title: locale === "pt" ? "Top 5 Rooftops em Lisboa para este Verão" : "Top 5 Lisbon Rooftops for Summer",
            excerpt: locale === "pt" ? "As melhores vistas da cidade acompanhadas de cocktails incríveis." : "The best city views paired with incredible cocktails.",
            readTime: "5 min",
            publishDate: "10 Mar 2026",
            imageUrl: "/images/blog-rooftop.jpg",
            category: locale === "pt" ? "Lifestyle" : "Lifestyle"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative min-h-[80vh] flex items-center justify-center overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-br from-brand-red/10 via-brand-black to-brand-black"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/page.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 opacity-20 pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red rounded-full blur-[100px] animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-[100px] animate-pulse delay-1000"
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[locale]/page.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container mx-auto px-4 relative z-10 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-block py-1 px-3 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-sm font-semibold mb-6 tracking-wide uppercase",
                                children: t.home.tagline
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tight leading-tight",
                                children: [
                                    t.home.title,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/app/[locale]/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 28
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl md:text-2xl text-brand-grey-light mb-10 max-w-2xl mx-auto font-light",
                                children: t.home.description
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row items-center justify-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/${locale}/events`,
                                        className: "btn-primary w-full sm:w-auto flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {}, void 0, false, {
                                                fileName: "[project]/app/[locale]/page.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            t.home.cta_events
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/page.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/${locale}/episodes`,
                                        className: "btn-secondary w-full sm:w-auto flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaPodcast"], {}, void 0, false, {
                                                fileName: "[project]/app/[locale]/page.tsx",
                                                lineNumber: 102,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            t.home.cta_podcast
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-16 flex flex-wrap justify-center gap-4 opacity-80",
                                children: t.home.categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-4 py-2 rounded-lg bg-brand-grey-dark/30 border border-brand-grey-dark/50 text-brand-grey hover:text-white hover:border-brand-red/50 transition-colors cursor-pointer text-sm",
                                        children: cat
                                    }, cat, false, {
                                        fileName: "[project]/app/[locale]/page.tsx",
                                        lineNumber: 108,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[locale]/page.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/page.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "events",
                className: "py-20 bg-brand-black relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-end mb-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaStar"], {
                                                    className: "text-brand-red"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/[locale]/page.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 17
                                                }, this),
                                                " ",
                                                t.home.featured.title
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/[locale]/page.tsx",
                                            lineNumber: 124,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-brand-grey",
                                            children: t.home.featured.subtitle
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/page.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/[locale]/page.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/${locale}/events`,
                                    className: "hidden md:flex items-center text-brand-red hover:text-white transition-colors",
                                    children: [
                                        t.home.featured.view_all,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaArrowRight"], {
                                            className: "ml-2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/page.tsx",
                                            lineNumber: 133,
                                            columnNumber: 42
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/[locale]/page.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12",
                            children: [
                                featuredEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EventCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            event: event,
                                            locale: locale
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this)
                                    }, event.id, false, {
                                        fileName: "[project]/app/[locale]/page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this)),
                                upcomingEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EventCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            event: event,
                                            locale: locale
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this)
                                    }, event.id, false, {
                                        fileName: "[project]/app/[locale]/page.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center md:hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: `/${locale}/events`,
                                className: "btn-secondary w-full",
                                children: t.home.featured.view_all
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/page.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/page.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[locale]/page.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "subscribe",
                className: "py-16 bg-brand-black-light border-y border-brand-grey-dark/30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 max-w-2xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-display font-bold mb-4",
                            children: locale === "pt" ? "Subscreve a Newsletter" : "Subscribe to the Newsletter"
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-brand-grey mb-8",
                            children: locale === "pt" ? "Recebe novos episódios, guias e eventos diretamente no teu email." : "Get new episodes, guides and events delivered to your inbox."
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SubscribeForm$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            locale: locale
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/page.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[locale]/page.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-20 bg-brand-black-light",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-display font-bold mb-4",
                            children: " What To Do"
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-brand-grey-light max-w-2xl mx-auto",
                            children: locale === "pt" ? "Mantém-te atualizado com os melhores eventos e experiências de Lisboa!" : "Stay updated with the best events and experiences in Lisbon!"
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/page.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/page.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[locale]/page.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/app/[locale]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[locale]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9bc0ae03._.js.map