import EventsClient from "@/app/events/EventsClient";
import { Event } from "@/data/types";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import { getTranslations } from "@/lib/use-translations";
import { getUpcomingEventsCached } from "@/lib/server/events-store";

export const revalidate = 600;

async function getEvents(): Promise<Event[]> {
  try {
    return await getUpcomingEventsCached();
  } catch {
    return [];
  }
}

export default async function EventsPage({
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
  const events = await getEvents();
  const initialQuery = q?.trim() || "";
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
            {t.events?.title || (locale === "pt" ? "Eventos" : "Events")}
          </h1>
          <p className="text-brand-grey">
            {t.events?.subtitle ||
              (locale === "pt"
                ? "Descobre os melhores eventos em Lisboa"
                : "Discover the best events in Lisbon")}
          </p>
        </div>
        <EventsClient
          events={events}
          locale={locale}
          initialQuery={initialQuery}
        />
      </div>
    </div>
  );
}
