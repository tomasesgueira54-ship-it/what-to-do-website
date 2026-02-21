import Link from "next/link";
import EpisodeCard from "@/components/EpisodeCard";
import BlogCard from "@/components/BlogCard";
import AudioPlayer from "@/components/AudioPlayer";
import EventCard from "@/components/EventCard";
import SubscribeForm from "@/components/SubscribeForm";
import { blogPosts } from "@/data/blog";
import {
  FaArrowRight,
  FaPodcast,
  FaPenNib,
  FaCalendarAlt,
  FaStar,
} from "react-icons/fa";
import { episodes } from "@/data/episodes";
import { Event } from "@/data/types";
import { getTranslations } from "@/lib/use-translations";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import { getUpcomingEventsCached } from "@/lib/server/events-store";

async function getEvents(): Promise<Event[]> {
  try {
    return await getUpcomingEventsCached();
  } catch {
    return [];
  }
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const t = getTranslations(locale);
  const events = await getEvents();
  const latestEpisode = episodes[0];
  const recentEpisodes = episodes.slice(1, 3);

  const allSorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const featuredEvents = allSorted.slice(0, 2);
  const upcomingEvents = allSorted.slice(2, 6);

  const recentPosts = blogPosts.slice(0, 3).map((post) => ({
    id: post.id,
    title: locale === "pt" ? post.titlePt : post.titleEn,
    excerpt: locale === "pt" ? post.excerptPt : post.excerptEn,
    readTime: post.readTime,
    publishDate: post.publishDate,
    imageUrl: post.imageUrl || "/images/placeholder-card.svg",
    category: locale === "pt" ? post.categoryPt : post.categoryEn,
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-brand-black to-brand-black" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-sm font-semibold mb-6 tracking-wide uppercase">
            {t.home.tagline}
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tight leading-tight">
            {t.home.title} <br />
          </h1>
          <p className="text-xl md:text-2xl text-brand-grey-light mb-10 max-w-2xl mx-auto font-light">
            {t.home.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/events`}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <FaCalendarAlt /> {t.home.cta_events}
            </Link>
            <Link
              href={`/${locale}/episodes`}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <FaPodcast /> {t.home.cta_podcast}
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4 opacity-80">
            {t.home.categories.map((cat: string) => (
              <Link
                key={cat}
                href={`/${locale}/events?q=${encodeURIComponent(cat)}`}
                className="px-4 py-2 rounded-lg bg-brand-grey-dark/30 border border-brand-grey-dark/50 text-brand-grey hover:text-white hover:border-brand-red/50 transition-colors text-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="events" className="py-20 bg-brand-black relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3">
                <FaStar className="text-brand-red" /> {t.home.featured.title}
              </h2>
              <p className="text-brand-grey">{t.home.featured.subtitle}</p>
            </div>
            <Link
              href={`/${locale}/events`}
              className="hidden md:flex items-center text-brand-red hover:text-white transition-colors"
            >
              {t.home.featured.view_all} <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredEvents.map((event) => (
              <div key={event.id} className="h-full">
                <Link
                  href={`/${locale}/events/${event.id}`}
                  className="block h-full hover:scale-[1.02] transition-transform"
                >
                  <EventCard event={event} locale={locale} />
                </Link>
              </div>
            ))}
            {upcomingEvents.map((event) => (
              <div key={event.id} className="h-full">
                <Link
                  href={`/${locale}/events/${event.id}`}
                  className="block h-full hover:scale-[1.02] transition-transform"
                >
                  <EventCard event={event} locale={locale} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link href={`/${locale}/events`} className="btn-secondary w-full">
              {t.home.featured.view_all}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-black-light border-y border-brand-grey-dark/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3">
                <FaPodcast className="text-brand-red" />
                {locale === "pt" ? "Podcast" : "Podcast"}
              </h2>
              <p className="text-brand-grey">
                {locale === "pt"
                  ? "Últimos episódios e conversas sobre Lisboa."
                  : "Latest episodes and conversations about Lisbon."}
              </p>
            </div>
            <Link
              href={`/${locale}/episodes`}
              className="hidden md:flex items-center text-brand-red hover:text-white transition-colors"
            >
              {locale === "pt" ? "Ver episódios" : "View episodes"}
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {latestEpisode && (
            <div className="mb-10">
              <AudioPlayer
                episode={{
                  id: latestEpisode.id,
                  title: latestEpisode.title,
                  description: latestEpisode.description,
                  audioUrl: latestEpisode.audioUrl,
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3">
                <FaPenNib className="text-brand-red" />
                {locale === "pt" ? "Blog & Guias" : "Blog & Guides"}
              </h2>
              <p className="text-brand-grey">
                {locale === "pt"
                  ? "Conteúdo editorial para descobrir Lisboa melhor."
                  : "Editorial content to discover Lisbon better."}
              </p>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="hidden md:flex items-center text-brand-red hover:text-white transition-colors"
            >
              {locale === "pt" ? "Ver blog" : "View blog"}
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="subscribe"
        className="py-16 bg-brand-black-light border-y border-brand-grey-dark/30"
      >
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            {locale === "pt"
              ? "Subscreve a Newsletter"
              : "Subscribe to the Newsletter"}
          </h2>
          <p className="text-brand-grey mb-8">
            {locale === "pt"
              ? "Recebe novos episódios, guias e eventos diretamente no teu email."
              : "Get new episodes, guides and events delivered to your inbox."}
          </p>
          <SubscribeForm locale={locale} />
        </div>
      </section>
    </>
  );
}
