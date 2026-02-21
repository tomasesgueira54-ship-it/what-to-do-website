import Link from "next/link";
import Image from "next/image";
import AudioPlayer from "@/components/AudioPlayer";
import { episodes } from "@/data/episodes";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import { FaArrowLeft, FaPlayCircle } from "react-icons/fa";
import type { Metadata } from "next";

const translations = {
  pt: {
    badge: "Podcast Especial",
    title: "Cantinho dos Segredos",
    subtitle:
      "Acompanha as melhores dicas e segredos sobre a cidade de Lisboa a nível de lazer, curiosidades e muito mais!",
    back: "Voltar aos episódios",
    listenTitle: "Ouvir versão áudio",
    listenHint:
      "O player abaixo usa o mesmo ecossistema do site (incluindo sticky player).",
  },
  en: {
    badge: "Special Podcast",
    title: "Corner of Secrets",
    subtitle:
      "Follow the best tips and secrets about the city of Lisbon regarding leisure, curiosities and much more!",
    back: "Back to episodes",
    listenTitle: "Listen to audio version",
    listenHint:
      "The player below uses the same ecosystem as the rest of the site (including sticky player).",
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
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://what-to-do.vercel.app";
  // Use episode 1's image (Podcast 1#)
  const defaultOgImage = `${siteUrl}/podcasts/images/podcast-banner.png`;
  return {
    title: `${t.title} — What To Do Podcast`,
    description: t.subtitle,
    openGraph: {
      title: `${t.title} — What To Do Podcast`,
      description: t.subtitle,
      type: "website",
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.title} — What To Do Podcast`,
      description: t.subtitle,
      images: [defaultOgImage],
    },
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

  // video temporarily disabled
  const embedUrl = "";

  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      {/* Neon ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-red/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 max-w-6xl py-10 relative z-10">
        <Link
          href={`/${locale}/episodes`}
          className="inline-flex items-center gap-2 text-brand-grey hover:text-brand-red hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all mb-8"
        >
          <FaArrowLeft className="text-sm" />
          {t.back}
        </Link>

        <header className="mb-12 relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,0,0,0.15)] border border-brand-red/30 group">
          <div className="aspect-[21/9] md:aspect-[3/1] relative w-full bg-[#0a0a0a]">
            <Image
              src="/podcasts/images/podcast-banner.png"
              alt={t.title}
              fill
              className="object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-80" />
            <div className="absolute inset-0 ring-1 ring-inset ring-brand-red/20 rounded-2xl pointer-events-none" />
          </div>

          {/* Hidden H1 for SEO, visual text is in the banner */}
          <h1 className="sr-only">{t.title}</h1>
          <p className="sr-only">{t.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            {resolvedPublishDate && (
              <div className="bg-brand-black-light/50 border border-brand-red/20 rounded-xl px-4 py-3 text-sm text-brand-grey-light shadow-[0_0_15px_rgba(255,0,0,0.05)]">
                <span className="text-brand-red font-medium">
                  {locale === "pt" ? "Publicado em" : "Published on"}:
                </span>{" "}
                {resolvedPublishDate}
                {resolvedDuration ? (
                  <>
                    <span className="mx-2 text-brand-red/50">•</span>
                    <span className="text-brand-red font-medium">
                      {locale === "pt" ? "Duração" : "Duration"}:
                    </span>{" "}
                    {resolvedDuration}
                  </>
                ) : (
                  ""
                )}
              </div>
            )}

            <div className="bg-brand-black-light/40 border border-brand-red/20 rounded-xl p-4 md:p-6 shadow-[0_0_20px_rgba(255,0,0,0.05)] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-[50px] pointer-events-none" />

              {/* video option temporarily removed */}
            </div>

            <div className="bg-gradient-to-br from-brand-red/10 to-transparent border border-brand-red/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute -left-4 -top-4 text-brand-red/10 text-6xl">
                &ldquo;
              </div>
              <p className="text-brand-grey-light leading-relaxed relative z-10 text-lg font-light">
                {resolvedDescription}
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-brand-black-light/60 border border-brand-red/30 rounded-xl p-5 sticky top-24 shadow-[0_0_30px_rgba(255,0,0,0.1)] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <h2 className="text-white font-display tracking-wide font-semibold text-lg mb-2 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                <FaPlayCircle className="text-brand-red" />
                {t.listenTitle}
              </h2>
              <p className="text-brand-grey text-sm mb-6 opacity-80">
                {t.listenHint}
              </p>

              <div className="relative z-10">
                <AudioPlayer episode={audioEpisode} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
