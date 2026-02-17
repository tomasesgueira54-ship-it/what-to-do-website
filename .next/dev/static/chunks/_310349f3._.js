(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/EventCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-brand-black-light rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_-5px_rgba(142,13,60,0.4)] hover:-translate-y-1 transition-all duration-300 border border-white/5 ring-1 ring-white/5 hover:border-brand-red/50 hover:ring-brand-red/50 group h-full flex flex-col relative z-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
            }, void 0, false, {
                fileName: "[project]/components/EventCard.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-[4/3] w-full overflow-hidden bg-brand-grey-dark z-10",
                children: [
                    event.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: event.image,
                        alt: event.title,
                        fill: true,
                        sizes: "(max-width: 768px) 100vw, 33vw",
                        className: "object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full flex items-center justify-center text-brand-grey group-hover:scale-110 transition-transform duration-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex flex-col items-center text-center shadow-lg transform group-hover:scale-105 transition-transform duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold text-brand-red uppercase tracking-wider",
                                children: eventDate.toLocaleDateString(dateLocale, {
                                    month: "short"
                                }).replace(".", "")
                            }, void 0, false, {
                                fileName: "[project]/components/EventCard.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 left-3 flex gap-2",
                        children: event.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-5 flex-1 flex flex-col gap-3 relative z-10 bg-brand-black-light/95 backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-brand-black/50 to-transparent rounded-xl border border-white/5 hover:border-brand-red/30 transition-colors duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 bg-brand-black/40 px-3 py-2 rounded-lg border border-brand-red/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {
                                        className: "text-brand-red text-sm flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EventCard.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col leading-none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-brand-grey font-bold uppercase tracking-wider opacity-70",
                                                children: timeLabel
                                            }, void 0, false, {
                                                fileName: "[project]/components/EventCard.tsx",
                                                lineNumber: 110,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            endDate && endDate.toDateString() !== eventDate.toDateString() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-2 px-3 py-2 rounded-lg border font-bold text-xs uppercase tracking-wider flex-shrink-0 ${priceClass}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-white leading-snug line-clamp-2 min-h-[3rem] group-hover:text-brand-red transition-colors duration-300",
                        children: event.title
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-brand-grey text-xs italic flex-1 hidden sm:block",
                        children: locale === "pt" ? "Descrição disponível na página do evento." : "Description available on the event page."
                    }, void 0, false, {
                        fileName: "[project]/components/EventCard.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto flex items-center justify-between text-brand-grey-light text-xs pt-4 border-t border-dashed border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5 truncate max-w-[70%] group-hover:text-white transition-colors duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5 text-brand-red text-[10px] font-bold uppercase tracking-wider bg-brand-red/10 px-2 py-1 rounded-full group-hover:bg-brand-red group-hover:text-white transition-all duration-300",
                                children: [
                                    locale === "pt" ? "Ver Mais" : "View More",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTicketAlt"], {
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
_c = EventCard;
var _c;
__turbopack_context__.k.register(_c, "EventCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/events/EventsClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventsClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EventCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/EventCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const isFree = (price)=>{
    if (!price) return false;
    const p = price.toLowerCase();
    return p.includes("free") || p === "0€" || p === "0 €" || p === "0.00€";
};
// Categorize events by type (title + description)
const getCategoryForEvent = (title, description, location)=>{
    const text = `${title} ${description} ${location}`.toLowerCase();
    // Discoteca/Nightlife (check first - most specific)
    if (text.includes("discoteca") || text.includes("nightclub") || text.includes("boate") || text.includes("cocktail") || text.includes("dj") && text.includes("danca") || text.includes("dance") || text.includes("cabaret") || text.includes("burlesque") || text.includes("stand-up") || text.includes("comedy") || text.includes("vida nocturna") || text.includes("noite louca") || text.includes("barcos") && text.includes("festa")) return "Discoteca/Nightlife";
    // Teatro
    if (text.includes("teatro") || text.includes("peça") || text.includes("espetáculo") || text.includes("dramático")) return "Teatro";
    // Cinema
    if (text.includes("cinema") || text.includes("filme") || text.includes("documentário") || text.includes("projeção")) return "Cinema";
    // Música
    if (text.includes("concerto") || text.includes("música") || text.includes("show") || text.includes("festival") || text.includes("banda") || text.includes("artista") || text.includes("fado") || text.includes("rock") || text.includes("jazz") || text.includes("músicos") || text.includes("músical")) return "Música";
    // Dança
    if (text.includes("dança") || text.includes("ballet") || text.includes("coreograf") || text.includes("movimento")) return "Dança";
    // Exposição
    if (text.includes("exposição") || text.includes("mostra") || text.includes("galeria") || text.includes("arte") || text.includes("museu") || text.includes("obra")) return "Exposição";
    // Conferência
    if (text.includes("palestra") || text.includes("seminário") || text.includes("conferência") || text.includes("talk") || text.includes("workshop") || text.includes("formação") || text.includes("entrevista")) return "Conferência";
    // Mercado/Feira
    if (text.includes("mercado") || text.includes("feira") || text.includes("market") || text.includes("feria") || text.includes("vendas")) return "Mercado/Feira";
    // Festa
    if (text.includes("festa") || text.includes("party") || text.includes("carnaval") || text.includes("celebração") || text.includes("noite")) return "Festa";
    // Ao Ar Livre
    if (text.includes("ao ar livre") || text.includes("parque") || text.includes("jardim") || text.includes("lav") || text.includes("outdoor")) return "Ao Ar Livre";
    return "Outro";
};
// Detect music genre
const getMusicGenre = (title, description, category)=>{
    // Only detect for music category
    if (!category.includes("Música")) return null;
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes("fado")) return "Fado";
    if (text.includes("rock")) return "Rock";
    if (text.includes("jazz")) return "Jazz";
    if (text.includes("pop")) return "Pop";
    if (text.includes("hard techno") || text.includes("hardtechno")) return "Hard Techno";
    if (text.includes("techno")) return "Techno";
    if (text.includes("trance")) return "Trance";
    if (text.includes("house")) return "House";
    if (text.includes("funk")) return "Funk";
    if (text.includes("clássic") || text.includes("orquest") || text.includes("sinfonia") || text.includes("clásico")) return "Clássico";
    if (text.includes("reggae")) return "Reggae";
    if (text.includes("hip-hop") || text.includes("hiphop") || text.includes("rap")) return "Hip-Hop";
    if (text.includes("folk") || text.includes("tradicion") || text.includes("gaita")) return "Folk/Tradicional";
    if (text.includes("samba") || text.includes("carnaval") || text.includes("bossa nova")) return "Samba/Carnaval";
    if (text.includes("k-pop") || text.includes("kpop")) return "K-Pop";
    if (text.includes("experimental") || text.includes("avant-garde")) return "Experimental";
    return null;
};
function EventsClient({ events, locale = "pt" }) {
    _s();
    const labels = {
        musicGenre: locale === "pt" ? "Género de Música" : "Music Genre",
        upcoming: locale === "pt" ? "Próximos Eventos" : "Upcoming Events",
        noResults: locale === "pt" ? "Nenhum evento encontrado com os filtros atuais." : "No events found for the selected filters.",
        clearFilters: locale === "pt" ? "Tentar remover filtros" : "Try clearing filters"
    };
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [onlyFree, setOnlyFree] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("asc");
    const [selectedCategories, setSelectedCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [selectedGenres, setSelectedGenres] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Get unique categories
    const uniqueCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EventsClient.useMemo[uniqueCategories]": ()=>{
            const cats = new Set();
            events.forEach({
                "EventsClient.useMemo[uniqueCategories]": (e)=>{
                    const cat = e.category || getCategoryForEvent(e.title, e.description, e.location);
                    cats.add(cat);
                }
            }["EventsClient.useMemo[uniqueCategories]"]);
            return Array.from(cats).sort();
        }
    }["EventsClient.useMemo[uniqueCategories]"], [
        events
    ]);
    // Get unique music genres (only for music category)
    const uniqueGenres = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EventsClient.useMemo[uniqueGenres]": ()=>{
            const genres = new Set();
            events.forEach({
                "EventsClient.useMemo[uniqueGenres]": (e)=>{
                    const cat = e.category || getCategoryForEvent(e.title, e.description, e.location);
                    if (cat === "Música") {
                        const genre = e.musicGenre || getMusicGenre(e.title, e.description, cat);
                        if (genre) genres.add(genre);
                    }
                }
            }["EventsClient.useMemo[uniqueGenres]"]);
            return Array.from(genres).sort();
        }
    }["EventsClient.useMemo[uniqueGenres]"], [
        events
    ]);
    const toggleCategory = (category)=>{
        const newCategories = new Set(selectedCategories);
        if (newCategories.has(category)) {
            newCategories.delete(category);
        } else {
            newCategories.add(category);
        }
        setSelectedCategories(newCategories);
    };
    const toggleGenre = (genre)=>{
        const newGenres = new Set(selectedGenres);
        if (newGenres.has(genre)) {
            newGenres.delete(genre);
        } else {
            newGenres.add(genre);
        }
        setSelectedGenres(newGenres);
    };
    const hasActiveFilters = query || startDate || onlyFree || selectedCategories.size > 0 || selectedGenres.size > 0;
    const clearAllFilters = ()=>{
        setQuery("");
        setStartDate("");
        setOnlyFree(false);
        setSelectedCategories(new Set());
        setSelectedGenres(new Set());
    };
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EventsClient.useMemo[filtered]": ()=>{
            const q = query.trim().toLowerCase();
            return events.filter({
                "EventsClient.useMemo[filtered]": (e)=>{
                    if (onlyFree && !isFree(e.price)) return false;
                    if (startDate) {
                        const evEndOrStart = e.endDate ? new Date(e.endDate) : new Date(e.date);
                        if (evEndOrStart < new Date(startDate)) return false;
                    }
                    if (selectedCategories.size > 0) {
                        const eventCat = e.category || getCategoryForEvent(e.title, e.description, e.location);
                        if (!selectedCategories.has(eventCat)) return false;
                    }
                    if (selectedGenres.size > 0) {
                        const eventCat = e.category || getCategoryForEvent(e.title, e.description, e.location);
                        const eventGenre = e.musicGenre || getMusicGenre(e.title, e.description, eventCat);
                        if (!eventGenre || !selectedGenres.has(eventGenre)) return false;
                    }
                    if (q) {
                        const haystack = `${e.title} ${e.description} ${e.location}`.toLowerCase();
                        if (!haystack.includes(q)) return false;
                    }
                    return true;
                }
            }["EventsClient.useMemo[filtered]"]).sort({
                "EventsClient.useMemo[filtered]": (a, b)=>{
                    const da = new Date(a.date).getTime();
                    const db = new Date(b.date).getTime();
                    return sort === "asc" ? da - db : db - da;
                }
            }["EventsClient.useMemo[filtered]"]);
        }
    }["EventsClient.useMemo[filtered]"], [
        events,
        query,
        onlyFree,
        startDate,
        sort,
        selectedCategories,
        selectedGenres
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-4 md:p-6 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-brand-grey uppercase tracking-widest text-xs font-bold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFilter"], {}, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this),
                                    " Filtros",
                                    hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-brand-red text-white px-2 py-1 rounded text-xs font-bold",
                                        children: selectedCategories.size + selectedGenres.size + (query ? 1 : 0) + (startDate ? 1 : 0) + (onlyFree ? 1 : 0)
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 345,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this),
                            hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearAllFilters,
                                className: "text-brand-grey hover:text-brand-red transition-colors text-xs font-bold flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {}, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 359,
                                        columnNumber: 15
                                    }, this),
                                    " Limpar tudo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/events/EventsClient.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-3 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-red lg:col-span-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSearch"], {
                                        className: "text-brand-grey flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 367,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: query,
                                        onChange: (e)=>setQuery(e.target.value),
                                        placeholder: "Pesquisar...",
                                        className: "flex-1 bg-transparent text-white outline-none text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 368,
                                        columnNumber: 13
                                    }, this),
                                    query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "text-brand-grey hover:text-white flex-shrink-0",
                                        onClick: ()=>setQuery(""),
                                        "aria-label": "Limpar pesquisa",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/app/events/EventsClient.tsx",
                                            lineNumber: 380,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm text-brand-grey gap-2 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 lg:col-span-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold",
                                        children: "Data mínima"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 387,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: startDate,
                                        onChange: (e)=>setStartDate(e.target.value),
                                        className: "bg-transparent border-b border-brand-grey-dark/50 px-0 py-1 text-white focus:outline-none focus:border-brand-red"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 388,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 386,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-3 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 text-sm text-white lg:col-span-1 cursor-pointer hover:border-brand-red transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: onlyFree,
                                        onChange: (e)=>setOnlyFree(e.target.checked),
                                        className: "accent-brand-red w-4 h-4 cursor-pointer"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm",
                                        children: "Só gratuitos"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 397,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm text-brand-grey gap-2 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 lg:col-span-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold",
                                        children: "Ordenar"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 409,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: sort,
                                        onChange: (e)=>setSort(e.target.value),
                                        className: "bg-transparent border-b border-brand-grey-dark/50 px-0 py-1 text-white focus:outline-none focus:border-brand-red",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "asc",
                                                children: "Mais próximos"
                                            }, void 0, false, {
                                                fileName: "[project]/app/events/EventsClient.tsx",
                                                lineNumber: 415,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "desc",
                                                children: "Mais distantes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/events/EventsClient.tsx",
                                                lineNumber: 416,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 410,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 408,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/events/EventsClient.tsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this),
                    uniqueCategories.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 pt-6 border-t border-brand-grey-dark/30 animate-fade-in-up",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-brand-grey font-bold uppercase tracking-widest mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTag"], {
                                        size: 12,
                                        className: "text-brand-red"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 425,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-gradient-to-r from-brand-grey to-white bg-clip-text text-transparent",
                                        children: "Tipo de Evento"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 426,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-brand-grey-dark/50 text-brand-grey-light px-1.5 py-0.5 rounded-full text-[10px]",
                                        children: selectedCategories.size
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 429,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 424,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3",
                                children: uniqueCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleCategory(category),
                                        className: `px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap relative overflow-hidden group ${selectedCategories.has(category) ? "bg-gradient-to-br from-brand-red via-red-600 to-brand-red-light text-white border border-red-500/50 shadow-[0_0_15px_-3px_rgba(220,38,38,0.5)] transform scale-105" : "bg-brand-black-light border border-brand-grey-dark/60 text-brand-grey hover:border-brand-red/70 hover:text-white hover:shadow-[0_0_12px_-5px_rgba(220,38,38,0.3)] hover:-translate-y-0.5"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "relative z-10 flex items-center justify-center gap-1.5",
                                                children: [
                                                    selectedCategories.has(category) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheck"], {
                                                        size: 10,
                                                        className: "animate-scale-in"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/events/EventsClient.tsx",
                                                        lineNumber: 446,
                                                        columnNumber: 23
                                                    }, this),
                                                    category
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/events/EventsClient.tsx",
                                                lineNumber: 444,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                                            }, void 0, false, {
                                                fileName: "[project]/app/events/EventsClient.tsx",
                                                lineNumber: 451,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, category, true, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 435,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 433,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/events/EventsClient.tsx",
                        lineNumber: 423,
                        columnNumber: 11
                    }, this),
                    (selectedCategories.has("Música") || uniqueGenres.length > 0) && uniqueGenres.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 pt-6 border-t border-brand-grey-dark/30 animate-fade-in-up delay-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-brand-grey font-bold uppercase tracking-widest mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-brand-red text-lg",
                                        children: "🎵"
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 463,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-gradient-to-r from-brand-grey to-white bg-clip-text text-transparent",
                                        children: labels.musicGenre
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 464,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-brand-grey-dark/50 text-brand-grey-light px-1.5 py-0.5 rounded-full text-[10px]",
                                        children: selectedGenres.size
                                    }, void 0, false, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 467,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 462,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3",
                                children: uniqueGenres.map((genre)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleGenre(genre),
                                        className: `px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap relative overflow-hidden group ${selectedGenres.has(genre) ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border border-purple-500/50 shadow-[0_0_15px_-3px_rgba(147,51,234,0.5)] transform scale-105" : "bg-brand-black-light border border-brand-grey-dark/60 text-brand-grey hover:border-indigo-500/70 hover:text-white hover:shadow-[0_0_12px_-5px_rgba(99,102,241,0.3)] hover:-translate-y-0.5"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "relative z-10 flex items-center justify-center gap-1.5",
                                                children: [
                                                    selectedGenres.has(genre) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheck"], {
                                                        size: 10,
                                                        className: "animate-scale-in"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/events/EventsClient.tsx",
                                                        lineNumber: 484,
                                                        columnNumber: 25
                                                    }, this),
                                                    genre
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/events/EventsClient.tsx",
                                                lineNumber: 482,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                                            }, void 0, false, {
                                                fileName: "[project]/app/events/EventsClient.tsx",
                                                lineNumber: 489,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, genre, true, {
                                        fileName: "[project]/app/events/EventsClient.tsx",
                                        lineNumber: 473,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 471,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/events/EventsClient.tsx",
                        lineNumber: 461,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/events/EventsClient.tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 mb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 uppercase tracking-widest text-sm font-bold text-brand-red",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {}, void 0, false, {
                            fileName: "[project]/app/events/EventsClient.tsx",
                            lineNumber: 500,
                            columnNumber: 11
                        }, this),
                        " ",
                        labels.upcoming,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white text-base",
                            children: [
                                filtered.length,
                                " / ",
                                events.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/events/EventsClient.tsx",
                            lineNumber: 501,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/events/EventsClient.tsx",
                    lineNumber: 499,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/events/EventsClient.tsx",
                lineNumber: 498,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
                children: filtered.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}/events/${event.id}`,
                            className: "block h-full hover:scale-[1.02] transition-transform",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EventCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                event: event,
                                locale: locale
                            }, void 0, false, {
                                fileName: "[project]/app/events/EventsClient.tsx",
                                lineNumber: 514,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/events/EventsClient.tsx",
                            lineNumber: 510,
                            columnNumber: 13
                        }, this)
                    }, event.id, false, {
                        fileName: "[project]/app/events/EventsClient.tsx",
                        lineNumber: 509,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/events/EventsClient.tsx",
                lineNumber: 507,
                columnNumber: 7
            }, this),
            filtered.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-brand-grey text-lg mb-4",
                        children: labels.noResults
                    }, void 0, false, {
                        fileName: "[project]/app/events/EventsClient.tsx",
                        lineNumber: 522,
                        columnNumber: 11
                    }, this),
                    hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: clearAllFilters,
                        className: "text-brand-red hover:text-white font-bold transition-colors",
                        children: labels.clearFilters
                    }, void 0, false, {
                        fileName: "[project]/app/events/EventsClient.tsx",
                        lineNumber: 524,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/events/EventsClient.tsx",
                lineNumber: 521,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/events/EventsClient.tsx",
        lineNumber: 338,
        columnNumber: 5
    }, this);
}
_s(EventsClient, "zTNOTcllnWbgomiyUf9UxW7KoqY=");
_c = EventsClient;
var _c;
__turbopack_context__.k.register(_c, "EventsClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_310349f3._.js.map