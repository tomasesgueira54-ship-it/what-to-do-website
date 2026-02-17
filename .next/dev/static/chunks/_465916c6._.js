(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/AudioPlayer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AudioPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AudioContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AudioContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function AudioPlayer({ episodeTitle, audioUrl, episode }) {
    _s();
    const { isPlaying, currentEpisode, playEpisode, togglePlay, currentTime, duration, seek } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AudioContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"])();
    // Construct episode object if legacy props are used
    const activeEpisode = episode || {
        id: audioUrl || 'unknown',
        title: episodeTitle || 'Unknown Episode',
        description: '',
        audioUrl: audioUrl || ''
    };
    const isCurrent = currentEpisode?.id === activeEpisode.id;
    const isActuallyPlaying = isCurrent && isPlaying;
    const handlePlayPause = ()=>{
        if (isCurrent) {
            togglePlay();
        } else {
            playEpisode(activeEpisode);
        }
    };
    const handleProgressClick = (e)=>{
        if (!isCurrent) return;
        const bounds = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - bounds.left) / bounds.width;
        seek(percent * duration);
    };
    const formatTime = (time)=>{
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    // Display state
    const displayTime = isCurrent ? currentTime : 0;
    const displayDuration = isCurrent ? duration : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-brand-grey-dark rounded-lg p-6 shadow-xl border border-brand-red/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-semibold text-lg mb-4 text-brand-white",
                children: activeEpisode.title
            }, void 0, false, {
                fileName: "[project]/components/AudioPlayer.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePlayPause,
                        className: "bg-brand-red hover:bg-brand-red-light text-white p-4 rounded-full transition-all",
                        children: isActuallyPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPause"], {
                            className: "text-xl"
                        }, void 0, false, {
                            fileName: "[project]/components/AudioPlayer.tsx",
                            lineNumber: 62,
                            columnNumber: 32
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPlay"], {
                            className: "text-xl ml-1"
                        }, void 0, false, {
                            fileName: "[project]/components/AudioPlayer.tsx",
                            lineNumber: 62,
                            columnNumber: 66
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AudioPlayer.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `h-2 rounded-full relative ${isCurrent ? 'cursor-pointer bg-brand-grey' : 'bg-brand-grey/30'}`,
                                onClick: isCurrent ? handleProgressClick : undefined,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `bg-brand-red h-full rounded-full transition-all duration-100`,
                                    style: {
                                        width: `${displayDuration ? displayTime / displayDuration * 100 : 0}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/AudioPlayer.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AudioPlayer.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between text-sm text-brand-grey mt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: formatTime(displayTime)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AudioPlayer.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: formatTime(displayDuration)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AudioPlayer.tsx",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AudioPlayer.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AudioPlayer.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AudioPlayer.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AudioPlayer.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(AudioPlayer, "v3UrMXCtDUr76DqKS/dVUAcTcL4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AudioContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"]
    ];
});
_c = AudioPlayer;
var _c;
__turbopack_context__.k.register(_c, "AudioPlayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/episodes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/i18n.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultLocale",
    ()=>defaultLocale,
    "localeConfig",
    ()=>localeConfig,
    "locales",
    ()=>locales,
    "translations",
    ()=>translations
]);
const defaultLocale = 'pt';
const locales = [
    'pt',
    'en'
];
const translations = {
    pt: 'Português',
    en: 'English'
};
const localeConfig = {
    defaultLocale,
    locales,
    pathStrategy: 'prefix'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/[locale]/episodes/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EpisodePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioPlayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AudioPlayer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$episodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/episodes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AudioContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AudioContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n.config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function EpisodePage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const localeParam = params?.locale ?? __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultLocale"];
    const locale = __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["locales"].includes(localeParam) ? localeParam : __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultLocale"];
    const id = params?.id ?? "";
    const isPt = locale === "pt";
    const episode = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$episodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["richEpisodesMap"][id];
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("shownotes");
    const { seek, playEpisode, currentEpisode, isPlaying } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AudioContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"])();
    if (!episode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-16",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-brand-grey mb-4",
                        children: isPt ? "Episódio não encontrado." : "Episode not found."
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/${locale}/episodes`,
                        className: "btn-secondary",
                        children: isPt ? "Voltar aos episódios" : "Back to episodes"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this);
    }
    const handleJumpToTime = (seconds)=>{
        if (currentEpisode?.id !== episode.id) {
            playEpisode(episode);
            setTimeout(()=>seek(seconds), 100);
        } else {
            seek(seconds);
            if (!isPlaying) playEpisode(episode);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-16",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 max-w-6xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/${locale}/episodes`,
                    className: "inline-flex items-center text-brand-grey hover:text-brand-red mb-8 transition-colors",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaArrowLeft"], {
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        isPt ? "Voltar aos episódios" : "Back to episodes"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                    className: "mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                    children: isPt ? `Episódio #${episode.id}` : `Episode #${episode.id}`
                                                }, void 0, false, {
                                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                    lineNumber: 72,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-brand-grey text-sm flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClock"], {
                                                            className: "text-brand-red"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                            lineNumber: 76,
                                                            columnNumber: 19
                                                        }, this),
                                                        " ",
                                                        episode.duration
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "font-display text-3xl md:text-5xl font-bold mb-6 leading-tight",
                                            children: episode.title
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xl text-brand-grey leading-relaxed",
                                            children: episode.description
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-12",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AudioPlayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        episode: episode
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex border-b border-brand-grey/20 mb-8 space-x-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab("shownotes"),
                                            className: `pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${activeTab === "shownotes" ? "text-brand-red border-b-2 border-brand-red" : "text-brand-grey hover:text-white"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaListUl"], {}, void 0, false, {
                                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 17
                                                }, this),
                                                isPt ? "Show Notes" : "Show Notes"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab("transcript"),
                                            className: `pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${activeTab === "transcript" ? "text-brand-red border-b-2 border-brand-red" : "text-brand-grey hover:text-white"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaFileAlt"], {}, void 0, false, {
                                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, this),
                                                isPt ? "Transcrição" : "Transcript"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-h-[400px]",
                                    children: [
                                        activeTab === "shownotes" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-fade-in space-y-8",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "prose prose-invert max-w-none",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-bold text-white mb-4",
                                                        children: isPt ? "Neste episódio:" : "In this episode:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: episode.showNotes?.map((note, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-4 group hover:bg-brand-grey-dark/20 p-2 rounded transition-colors -ml-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleJumpToTime(note.seconds),
                                                                        className: "flex-shrink-0 bg-brand-grey-dark text-brand-red hover:bg-brand-red hover:text-white text-xs font-mono py-1 px-2 rounded transition-colors mt-0.5 w-16 text-center",
                                                                        children: note.time
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                        lineNumber: 132,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-brand-grey group-hover:text-brand-white transition-colors",
                                                                        children: note.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                        lineNumber: 138,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, index, true, {
                                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                lineNumber: 128,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                lineNumber: 121,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                            lineNumber: 120,
                                            columnNumber: 17
                                        }, this),
                                        activeTab === "transcript" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-fade-in space-y-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-brand-grey-dark/30 p-6 rounded-lg border border-brand-grey/10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-brand-grey italic mb-8 border-b border-brand-grey/10 pb-4",
                                                        children: isPt ? "Nota: Esta transcrição é gerada automaticamente e pode conter erros." : "Note: This transcript is automatically generated and may contain errors."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-6",
                                                        children: episode.transcript?.map((segment, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-6 group hover:bg-brand-grey-dark/20 p-3 rounded transition-colors -mx-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-shrink-0 w-12 pt-1",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleJumpToTime(segment.seconds),
                                                                            className: "text-xs font-mono text-brand-grey opacity-50 group-hover:opacity-100 hover:text-brand-red transition-all",
                                                                            children: segment.time
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                            lineNumber: 164,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                        lineNumber: 163,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "block text-xs font-bold text-brand-red mb-1 uppercase tracking-wider",
                                                                                children: segment.speaker
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                                lineNumber: 172,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-brand-white/90 leading-relaxed",
                                                                                children: segment.text
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                                lineNumber: 175,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                        lineNumber: 171,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, index, true, {
                                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                                lineNumber: 159,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                lineNumber: 150,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-1 space-y-8",
                            children: episode.guest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-brand-grey-dark rounded-xl p-6 border border-brand-grey/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "flex items-center gap-2 font-bold text-white mb-4 uppercase tracking-wider text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUser"], {
                                                className: "text-brand-red"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this),
                                            isPt ? "Convidado" : "Guest"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-display text-xl font-bold text-brand-white mb-2",
                                                children: episode.guest.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                lineNumber: 197,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-brand-grey leading-relaxed mb-4",
                                                children: episode.guest.bio
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                lineNumber: 200,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: episode.guest.links?.map((link, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: link.url,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "text-xs border border-brand-grey/30 rounded-full px-3 py-1 text-brand-grey hover:border-brand-red hover:text-brand-red transition-colors",
                                                        children: link.label
                                                    }, idx, false, {
                                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/[locale]/episodes/[id]/page.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(EpisodePage, "Rpdz4FipkBslGQhUIpR49nSE5bU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AudioContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudio"]
    ];
});
_c = EpisodePage;
var _c;
__turbopack_context__.k.register(_c, "EpisodePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_465916c6._.js.map