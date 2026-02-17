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
"[project]/data/blog.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blogPosts",
    ()=>blogPosts
]);
const blogPosts = [
    {
        id: "1",
        titlePt: "Top 5 Rooftops em Lisboa para este Verão",
        titleEn: "Top 5 Lisbon Rooftops for Summer",
        excerptPt: "As melhores vistas da cidade acompanhadas de cocktails incríveis. Descobre os rooftops mais procurados de Lisboa com ambiente sofisticado e vista de 360 graus.",
        excerptEn: "The best city views paired with incredible cocktails. Discover Lisbon's most sought-after rooftops with sophisticated atmosphere and 360-degree views.",
        readTime: "5 min",
        publishDate: "10 Mar 2026",
        imageUrl: "/images/blog-rooftop.jpg",
        categoryPt: "Lifestyle",
        categoryEn: "Lifestyle"
    },
    {
        id: "2",
        titlePt: "Explorar Belém ao Pôr do Sol",
        titleEn: "Exploring Belém at Sunset",
        excerptPt: "Um guia completo para aproveitar uma das zonas mais bonitas de Lisboa. Visita os monumentos históricos, os restaurantes tradicionais e os cafés acolhedores de Belém antes do anoitecer.",
        excerptEn: "A complete guide to enjoying one of Lisbon's most beautiful areas. Visit historic monuments, traditional restaurants and cozy cafés in Belém before sunset.",
        readTime: "8 min",
        publishDate: "05 Mar 2026",
        imageUrl: "/images/blog-belem.jpg",
        categoryPt: "Roteiros",
        categoryEn: "Itineraries"
    },
    {
        id: "3",
        titlePt: "Mercados Tradicionais: A Alma de Lisboa",
        titleEn: "Traditional Markets: The Soul of Lisbon",
        excerptPt: "Descobre os mercados tradicionais e a cultura local. Desde o Mercado da Ribeira até às Flores, estes espaços vibrant refletem o autêntico espírito de Lisboa.",
        excerptEn: "Discover traditional markets and local culture. From Mercado da Ribeira to the Flower Market, these vibrant spaces reflect the authentic spirit of Lisbon.",
        readTime: "7 min",
        publishDate: "28 Feb 2026",
        imageUrl: "/images/blog-markets.jpg",
        categoryPt: "Cultura",
        categoryEn: "Culture"
    },
    {
        id: "4",
        titlePt: "Fado: A Experiência Musical Portuguesa",
        titleEn: "Fado: The Portuguese Musical Experience",
        excerptPt: "Compreende o significado do fado, a música tradicional portuguesa que toca a alma. Aprende onde encontrar as melhores casas de fado de Lisboa.",
        excerptEn: "Understand the meaning of fado, the traditional Portuguese music that touches the soul. Learn where to find the best fado houses in Lisbon.",
        readTime: "6 min",
        publishDate: "22 Feb 2026",
        imageUrl: "/images/blog-fado.jpg",
        categoryPt: "Música",
        categoryEn: "Music"
    },
    {
        id: "5",
        titlePt: "Guia do Viajante: 72 Horas em Lisboa",
        titleEn: "Traveler's Guide: 72 Hours in Lisbon",
        excerptPt: "Um itinerário perfeito para aproveitar ao máximo um fim de semana em Lisboa. Museus, gastronomia, passeios à beira-rio e muito mais.",
        excerptEn: "A perfect itinerary to make the most of a weekend in Lisbon. Museums, gastronomy, riverside walks and much more.",
        readTime: "12 min",
        publishDate: "18 Feb 2026",
        imageUrl: "/images/blog-lisbon-72h.jpg",
        categoryPt: "Guias",
        categoryEn: "Guides"
    }
];
}),
"[project]/app/[locale]/blog/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlogPostPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$blog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/blog.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n.config.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function BlogPostPage({ params }) {
    const { locale: localeParam, id } = await params;
    const locale = __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["locales"].includes(localeParam) ? localeParam : __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultLocale"];
    const isPt = locale === "pt";
    const post = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$blog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["blogPosts"].find((item)=>item.id === id);
    if (!post) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const title = isPt ? post.titlePt : post.titleEn;
    const excerpt = isPt ? post.excerptPt : post.excerptEn;
    const category = isPt ? post.categoryPt : post.categoryEn;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-16",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 max-w-3xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    href: `/${locale}/blog`,
                    className: "inline-flex items-center text-brand-grey hover:text-brand-red mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaArrowLeft"], {
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        isPt ? "Voltar ao blog" : "Back to blog"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-block bg-brand-red/20 text-brand-red text-xs font-semibold px-3 py-1 rounded-full mb-3",
                            children: category
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "font-display text-3xl md:text-4xl font-bold mb-3",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 text-brand-grey text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: post.publishDate
                                }, void 0, false, {
                                    fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "•"
                                }, void 0, false, {
                                    fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FaClock"], {}, void 0, false, {
                                            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                                            lineNumber: 49,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        post.readTime
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "prose prose-invert max-w-none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-brand-grey mb-4",
                            children: excerpt
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-brand-grey",
                            children: isPt ? "Artigo completo em atualização. Volte em breve para conteúdo expandido." : "Full article is being updated. Please check back soon for expanded content."
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/[locale]/blog/[id]/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/[locale]/blog/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[locale]/blog/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__76e7d0c9._.js.map