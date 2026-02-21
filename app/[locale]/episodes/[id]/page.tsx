import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { richEpisodesMap, episodes } from "@/data/episodes";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import EpisodeDetailClient from "@/components/EpisodeDetailClient";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    episodes.map((ep) => ({ locale, id: ep.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, id } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const episode = richEpisodesMap[id];
  if (!episode) return {};
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://what-to-do.vercel.app";
  const defaultOgImage = `${siteUrl}/podcasts/images/podcast-banner.png`;

  return {
    title: `${episode.title} — What To Do Podcast`,
    description: episode.description,
    openGraph: {
      title: episode.title,
      description: episode.description,
      type: "website",
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.description,
      images: [defaultOgImage],
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const episode = richEpisodesMap[id];
  if (!episode) notFound();

  return <EpisodeDetailClient episode={episode} locale={locale} />;
}
