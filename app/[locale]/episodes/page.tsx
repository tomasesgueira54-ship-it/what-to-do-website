import EpisodeCard from "@/components/EpisodeCard";
import { episodes } from "@/data/episodes";
import Link from "next/link";
import {
  FaArrowLeft,
  FaHeadphones,
  FaSpotify,
  FaApple,
  FaYoutube,
  FaPodcast,
  FaRss,
} from "react-icons/fa";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import type { Metadata } from "next";

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

const translations = {
  pt: {
    title: "Podcast",
    subtitle:
      "Histórias, dicas e conversas sobre o que fazer em Lisboa. Descobre novos episódios semanalmente.",
    episodes: "Todos os Episódios",
    searchLabel: "Pesquisar episódios",
    searchPlaceholder: "Título ou descrição...",
    searchBtn: "Pesquisar",
    clearSearch: "Limpar",
    back: "Voltar",
    noEpisodes: "Nenhum episódio disponível. Em breve teremos novidades!",
    noSearchResults:
      "Nenhum episódio encontrado para essa pesquisa. Tenta outro termo.",
    latestEpisode: "Último Episódio",
    listenOn: "Ouve em:",
    aboutPodcast: "Sobre o Podcast",
    aboutText:
      "O What To Do Podcast é a tua companhia para descobrir o melhor de Lisboa. Todas as semanas, entrevistamos personalidades locais, artistas e empreendedores sobre os seus projetos e a sua visão da cidade. De rooftops escondidos a festas imperdíveis — estamos aqui para te ajudar a aproveitar cada momento.",
    subscribeTitle: "Nunca percas um episódio",
    subscribeText:
      "Subscreve o podcast na tua plataforma favorita e recebe alertas de novos episódios.",
    cantinhoTitle: "Cantinho dos Segredos",
    cantinhoDesc:
      "A nossa rubrica especial com dicas exclusivas e segredos de Lisboa.",
    cantinhoBtn: "Ouvir Cantinho dos Segredos",
    suggestTitle: "Tem uma sugestão?",
    suggestText:
      "Conheces algum spot, evento ou pessoa que devíamos entrevistar? Diz-nos!",
    suggestBtn: "Enviar sugestão",
  },
  en: {
    title: "Podcast",
    subtitle:
      "Stories, tips and conversations about what to do in Lisbon. Discover new episodes weekly.",
    episodes: "All Episodes",
    searchLabel: "Search episodes",
    searchPlaceholder: "Title or description...",
    searchBtn: "Search",
    clearSearch: "Clear",
    back: "Back",
    noEpisodes: "No episodes available yet. New content coming soon!",
    noSearchResults: "No episodes found for this search. Try another term.",
    latestEpisode: "Latest Episode",
    listenOn: "Listen on:",
    aboutPodcast: "About the Podcast",
    aboutText:
      "The What To Do Podcast is your companion for discovering the best of Lisbon. Every week, we interview local personalities, artists and entrepreneurs about their projects and their vision of the city. From hidden rooftops to must-attend parties — we're here to help you make the most of every moment.",
    subscribeTitle: "Never miss an episode",
    subscribeText:
      "Subscribe to the podcast on your favorite platform and get alerts for new episodes.",
    cantinhoTitle: "Corner of Secrets",
    cantinhoDesc:
      "Our special feature with exclusive tips and Lisbon's hidden gems.",
    cantinhoBtn: "Listen to Corner of Secrets",
    suggestTitle: "Have a suggestion?",
    suggestText:
      "Know a spot, event or person we should interview? Let us know!",
    suggestBtn: "Send suggestion",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  return {
    title:
      locale === "pt"
        ? "Podcast | What To Do - Lisboa"
        : "Podcast | What To Do - Lisbon",
    description:
      locale === "pt"
        ? "Ouve o podcast What To Do Lisboa. Conversas, dicas e guias sobre o que fazer em Lisboa."
        : "Listen to the What To Do Lisbon podcast. Conversations, tips and guides on what to do in Lisbon.",
  };
}

export default async function EpisodesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { q } = await searchParams;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const t = translations[locale];
  const query = q?.trim() || "";
  const normalizedQuery = normalizeSearch(query);

  const sortedEpisodes = [...episodes]
    .filter((episode) => {
      if (!normalizedQuery) return true;
      const haystack = normalizeSearch(
        `${episode.title} ${episode.description || ""}`,
      );
      return haystack.includes(normalizedQuery);
    })
    .sort((a, b) => {
      const bId = Number(b.id);
      const aId = Number(a.id);
      if (Number.isFinite(bId) && Number.isFinite(aId)) return bId - aId;
      return b.id.localeCompare(a.id);
    });

  const latestEpisode = sortedEpisodes[0];
  const olderEpisodes = sortedEpisodes.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-brand-black to-brand-black" />
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-600 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-sm font-semibold mb-6 tracking-wide uppercase">
              <FaPodcast />
              <span>{t.title}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              What To Do <span className="text-brand-red">{t.title}</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-grey-light max-w-2xl mx-auto mb-8">
              {t.subtitle}
            </p>

            {/* Platform Links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-brand-grey text-sm mr-2">{t.listenOn}</span>
              {(
                [
                  {
                    name: "Spotify",
                    icon: FaSpotify,
                    url: process.env.NEXT_PUBLIC_SOCIAL_SPOTIFY || "#",
                    color: "hover:text-green-400 hover:border-green-400/40",
                  },
                  {
                    name: "Apple Podcasts",
                    icon: FaApple,
                    url: process.env.NEXT_PUBLIC_SOCIAL_APPLE || "#",
                    color: "hover:text-purple-400 hover:border-purple-400/40",
                  },
                  {
                    name: "YouTube",
                    icon: FaYoutube,
                    url:
                      process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ||
                      "https://youtube.com/@whattodo",
                    color: "hover:text-red-400 hover:border-red-400/40",
                  },
                ] as const
              )
                .filter((p) => p.url && p.url !== "#")
                .map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-black-light border border-brand-grey-dark/60 text-brand-grey transition-all ${platform.color}`}
                  >
                    <platform.icon size={16} />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search & Filter Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-end">
             <div className="flex-1 w-full">
                <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                  <FaHeadphones className="text-brand-red" />
                  {t.episodes} <span className="text-brand-grey text-xs ml-2">({sortedEpisodes.length})</span>
                </h2>
                <form className="relative group">
                  <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-brand-black-light border border-brand-grey-dark/50 rounded-xl px-5 py-4 pl-12 text-white placeholder:text-brand-grey focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all shadow-lg"
                  />
                  <FaRss className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-grey group-focus-within:text-brand-red transition-colors" />
                </form>
             </div>
             
             {query && (
               <Link
                href={`/${locale}/episodes`}
                className="h-[58px] px-6 flex items-center justify-center rounded-xl border border-brand-grey-dark/50 text-brand-grey hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition-all"
               >
                {t.clearSearch}
               </Link>
             )}
          </div>

          {sortedEpisodes.length === 0 ? (
            <div className="text-center py-20 bg-brand-black-light/30 rounded-3xl border border-brand-grey-dark/20">
              <div className="w-20 h-20 bg-brand-grey-dark/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeadphones className="text-brand-grey text-3xl" />
              </div>
              <p className="text-brand-grey text-lg mb-6">
                {query ? t.noSearchResults : t.noEpisodes}
              </p>
              {query && (
                <Link
                  href={`/${locale}/episodes`}
                  className="inline-flex items-center gap-2 text-brand-red hover:text-white transition-colors font-semibold"
                >
                  <FaArrowLeft size={12} /> {t.clearSearch}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured / Latest Episode (only if no search active) */}
              {!query && latestEpisode && (
                 <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-8">
                    <div className="relative group">
                      <div className="absolute -top-3 left-0 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red text-white text-xs font-bold rounded-full shadow-lg">
                          ✨ {t.latestEpisode}
                        </span>
                      </div>
                      <EpisodeCard episode={latestEpisode} locale={locale} />
                    </div>
                 </div>
              )}

              {/* Remaining Episodes */}
              {(query ? sortedEpisodes : olderEpisodes).map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    locale={locale}
                  />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About & Cantinho Grid */}
      <section className="py-16 bg-brand-black-light/50 border-t border-brand-grey-dark/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            
            {/* About Column */}
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaPodcast className="text-brand-red" />
                {t.aboutPodcast}
              </h2>
              <p className="text-brand-grey-light leading-relaxed mb-6">
                {t.aboutText}
              </p>
              <div className="p-6 bg-brand-black border border-brand-grey-dark/30 rounded-2xl">
                 <h3 className="font-bold text-white mb-2">{t.suggestTitle}</h3>
                 <p className="text-sm text-brand-grey mb-4">{t.suggestText}</p>
                 <Link href={`/${locale}/contact`} className="text-brand-red hover:text-white text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2">
                   {t.suggestBtn} <FaArrowLeft className="rotate-180" />
                 </Link>
              </div>
            </div>

            {/* Cantinho Column */}
            <div className="relative overflow-hidden group rounded-2xl bg-gradient-to-br from-brand-black to-[#0a0a0a] border border-brand-grey-dark/30 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-32 bg-brand-red/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-red/10 transition-colors" />
                
                <h3 className="font-display text-2xl font-bold text-white mb-3 flex items-center gap-2">
                   <span className="text-brand-red">🔒</span> {t.cantinhoTitle}
                </h3>
                <p className="text-brand-grey-light mb-8 relative z-10">
                  {t.cantinhoDesc}
                </p>
                <Link
                  href={`/${locale}/podcast/cantinho-dos-segredos`}
                  className="w-full block text-center py-4 bg-brand-red/10 border border-brand-red/30 text-brand-red font-bold rounded-xl hover:bg-brand-red hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 uppercase tracking-widest text-xs"
                >
                  {t.cantinhoBtn}
                </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
