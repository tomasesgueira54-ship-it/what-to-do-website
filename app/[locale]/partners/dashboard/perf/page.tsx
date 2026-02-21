import Link from "next/link";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import EventsPerfDashboard from "@/components/EventsPerfDashboard";

export default async function PartnersPerfDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const isPt = locale === "pt";

  return (
    <div className="min-h-screen bg-brand-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              {isPt ? "Dashboard de Performance" : "Performance Dashboard"}
            </h1>
            <p className="text-brand-grey">
              {isPt
                ? "Métricas em tempo real da API de eventos (latência, cache e payload)."
                : "Real-time Events API metrics (latency, cache and payload)."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/events/perf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg border border-brand-grey-dark text-brand-grey hover:text-white transition-colors text-sm"
            >
              {isPt ? "JSON bruto" : "Raw JSON"}
            </a>
            <Link
              href={`/${locale}/partners/dashboard`}
              className="btn-primary"
            >
              {isPt ? "Voltar" : "Back"}
            </Link>
          </div>
        </div>

        <EventsPerfDashboard locale={locale} />
      </div>
    </div>
  );
}
