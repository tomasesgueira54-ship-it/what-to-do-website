import Link from "next/link";
import Image from "next/image";
import AudioPlayer from "@/components/AudioPlayer";
import { episodes } from "@/data/episodes";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import { FaArrowLeft, FaPlayCircle, FaVideo } from "react-icons/fa";
import type { Metadata } from "next";

const translations = {
  pt: {
    badge: "Podcast Especial",
    title: "Cantinho dos Segredos",
    subtitle:
      "Acompanha as melhores dicas e segredos sobre a cidade de Lisboa a nível de lazer, curiosidades e muito mais!",
    back: "Voltar aos episódios",
    watchTitle: "Ver vídeo completo",
    watchHint:
      "Define o videoUrl do episódio em data/episodes.ts para controlar quais episódios têm vídeo.",
    listenTitle: "Ouvir versão áudio",
    listenHint:
      "O player abaixo usa o mesmo ecossistema do site (incluindo sticky player).",
    videoNotConfigured:
      "Vídeo ainda não configurado para este episódio. Define videoUrl em data/episodes.ts.",
  },
  en: {
    badge: "Special Podcast",
    title: "Corner of Secrets",
    subtitle:
      "Follow the best tips and secrets about the city of Lisbon regarding leisure, curiosities and much more!",
    back: "Back to episodes",
    watchTitle: "Watch full video",
    watchHint:
      "Set the episode videoUrl in data/episodes.ts to control which episodes have video.",
    listenTitle: "Listen to audio version",
    listenHint:
      "The player below uses the same ecosystem as the rest of the site (including sticky player).",
    videoNotConfigured:
      "Video is not configured for this episode. Set videoUrl in data/episodes.ts.",
  },
};

export async function generateStaticParams() {
  return [{ locale: "pt" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const t = translations[locale];
  return {
    title: `${t.title} — What To Do Podcast`,
    description: t.subtitle,
  };
}

export default async function CantinhoDosSegredosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const t = translations[locale];
  const fallbackEpisode = episodes[0];

  const resolvedTitle =
    fallbackEpisode?.title ||
    (locale === "pt"
      ? "Podcast: Cantinho dos Segredos"
      : "Podcast: Corner of Secrets");
  const resolvedDescription = fallbackEpisode?.description || t.subtitle;
  const resolvedDuration = fallbackEpisode?.duration || undefined;
  const resolvedPublishDate = fallbackEpisode?.publishDate || undefined;

  const audioEpisode = {
    id: fallbackEpisode?.id || "cantinho-dos-segredos-audio",
    title: resolvedTitle,
    description: resolvedDescription,
    duration: resolvedDuration,
    audioUrl: fallbackEpisode?.audioUrl || "",
  };

  const youtubeUrl = fallbackEpisode?.videoUrl || "";
  // Convert watch URL to embed URL if needed
  const embedUrl = youtubeUrl
    ? youtubeUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "www.youtube.com/embed/")
    : "";

  return (
    <div className="container mx-auto px-4 max-w-6xl py-10">
      <Link
        href={`/${locale}/episodes`}
        className="inline-flex items-center gap-2 text-brand-grey hover:text-brand-red transition-colors mb-8"
      >
        <FaArrowLeft className="text-sm" />
        {t.back}
      </Link>

      <header className="mb-12 relative rounded-2xl overflow-hidden shadow-2xl border border-brand-red/20">
        <div className="aspect-[21/9] relative w-full bg-brand-black">
          <Image
            src="/images/placeholder-card.svg"
            alt={t.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent opacity-60" />
        </div>

        {/* Hidden H1 for SEO, visual text is in the banner */}
        <h1 className="sr-only">{t.title}</h1>
        <p className="sr-only">{t.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          {resolvedPublishDate && (
            <div className="bg-brand-grey-dark/30 border border-brand-grey/20 rounded-xl px-4 py-3 text-sm text-brand-grey-light">
              {locale === "pt" ? "Publicado em" : "Published on"}:{" "}
              {resolvedPublishDate}
              {resolvedDuration
                ? ` • ${locale === "pt" ? "Duração" : "Duration"}: ${resolvedDuration}`
                : ""}
            </div>
          )}

          <div className="bg-brand-grey-dark/30 border border-brand-grey/20 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm">
            <h2 className="text-white font-semibold text-xl mb-4 flex items-center gap-2 text-brand-red">
              <FaVideo className="text-brand-red" />
              {t.watchTitle}
            </h2>

            {embedUrl ? (
              <iframe
                className="w-full aspect-video rounded-lg border border-brand-grey/20 shadow-inner"
                src={embedUrl}
                title={t.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full aspect-video rounded-lg border border-brand-grey/20 bg-brand-grey-dark flex items-center justify-center">
                <p className="text-brand-grey text-sm text-center px-6">
                  {t.videoNotConfigured}
                </p>
              </div>
            )}

            <p className="text-xs text-brand-grey mt-3 italic">{t.watchHint}</p>
          </div>

          <div className="bg-brand-red/5 border border-brand-red/10 rounded-xl p-6">
            <p className="text-brand-grey-light leading-relaxed">
              {resolvedDescription}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-brand-grey-dark/40 to-brand-black border border-brand-grey/20 rounded-xl p-5 sticky top-24 shadow-xl">
            <h2 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
              <FaPlayCircle className="text-brand-red" />
              {t.listenTitle}
            </h2>
            <p className="text-brand-grey text-sm mb-4">{t.listenHint}</p>
            <AudioPlayer episode={audioEpisode} />
          </div>
        </aside>
      </div>
    </div>
  );
}
