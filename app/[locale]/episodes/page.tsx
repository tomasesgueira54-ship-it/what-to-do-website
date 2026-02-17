import EpisodeCard from "@/components/EpisodeCard";
import { episodes } from "@/data/episodes";
import Link from "next/link";
import { FaArrowLeft, FaHeadphones } from "react-icons/fa";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

const translations = {
  pt: {
    title: "Podcast",
    subtitle: "Histórias, dicas e conversas sobre o que fazer em Lisboa",
    latestEpisode: "Último Episódio",
    otherEpisodes: "Outros Episódios",
    back: "Voltar",
    noEpisodes: "Nenhum episódio disponível",
  },
  en: {
    title: "Podcast",
    subtitle: "Stories, tips and conversations about what to do in Lisbon",
    latestEpisode: "Latest Episode",
    otherEpisodes: "Other Episodes",
    back: "Back",
    noEpisodes: "No episodes available",
  },
};

export default async function EpisodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const t = translations[locale];

  if (!episodes || episodes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href={`/${locale}`}
            className="text-brand-red hover:text-brand-red-light transition-colors flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            {t.back}
          </Link>
        </div>
        <p className="text-center text-brand-grey">{t.noEpisodes}</p>
      </div>
    );
  }

  const latestEpisode = episodes[0];
  const otherEpisodes = episodes.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6 text-brand-red">
          <FaHeadphones className="text-3xl" />
          <h1 className="text-4xl md:text-5xl font-bold font-display text-brand-red">
            {t.title}
          </h1>
        </div>
        <p className="text-brand-grey text-lg">{t.subtitle}</p>
      </div>

      {/* Latest Episode */}
      <div className="mb-16 pb-8 border-b border-brand-grey/20">
        <h2 className="text-2xl font-bold font-display mb-6 text-brand-red">
          {t.latestEpisode}
        </h2>
        <EpisodeCard episode={latestEpisode} locale={locale} />
      </div>

      {/* Other Episodes */}
      {otherEpisodes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold font-display mb-6 text-brand-red">
            {t.otherEpisodes}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
