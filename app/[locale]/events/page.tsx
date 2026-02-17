import fs from "fs/promises";
import path from "path";
import EventsClient from "@/app/events/EventsClient";
import { Event } from "@/data/types";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

async function getEvents(): Promise<Event[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "events.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const events: Event[] = JSON.parse(fileContent);
    return dedupeEvents(events)
      .filter(isUpcoming)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch {
    return [];
  }
}

function isUpcoming(event: Event): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOrStart = event.endDate
    ? new Date(event.endDate)
    : new Date(event.date);
  return endOrStart >= today;
}

function dedupeEvents(events: Event[]): Event[] {
  const seen = new Set<string>();
  const result: Event[] = [];

  for (const ev of events) {
    const key = ev.url || "" || `${ev.title}-${ev.date}`;
    const altKey = `${ev.title}-${ev.date}`;
    if (seen.has(key) || seen.has(altKey)) continue;
    seen.add(key);
    seen.add(altKey);
    result.push(ev);
  }

  return result;
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
            {locale === "pt" ? "Eventos" : "Events"}
          </h1>
          <p className="text-brand-grey">
            {locale === "pt"
              ? "Descobre os melhores eventos em Lisboa"
              : "Discover the best events in Lisbon"}
          </p>
        </div>
        <EventsClient events={events} locale={locale} />
      </div>
    </div>
  );
}
