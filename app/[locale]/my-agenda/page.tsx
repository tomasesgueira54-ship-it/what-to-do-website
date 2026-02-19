import fs from "fs/promises";
import path from "path";
import { Event } from "@/data/types";
import MyAgendaClient from "@/components/MyAgendaClient";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import { getTranslations } from "@/lib/use-translations";

async function getEvents(): Promise<Event[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "events.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const events: Event[] = JSON.parse(fileContent);

    return events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  } catch {
    return [];
  }
}

export default async function MyAgendaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const events = await getEvents();
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
            {t.my_agenda?.title || (locale === "pt" ? "Minha Agenda" : "My Agenda")}
          </h1>
          <p className="text-brand-grey">
            {t.my_agenda?.subtitle || (locale === "pt" ? "Os teus eventos guardados num só lugar" : "Your saved events in one place")}
          </p>
        </div>

        <MyAgendaClient events={events} locale={locale} />
      </div>
    </div>
  );
}
