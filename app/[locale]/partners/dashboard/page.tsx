import Link from "next/link";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import { getTranslations } from "@/lib/use-translations";
import {
  getDashboardFilterOptions,
  getDashboardMetricsWithFilters,
} from "@/lib/server/analytics-store";

function getT(locale: Locale) {
  const messages = getTranslations(locale);
  return (key: string, fallback: string) => {
    const parts = key.split(".");
    let current: any = messages;
    for (const part of parts) current = current?.[part];
    return typeof current === "string" ? current : fallback;
  };
}

export default async function PartnersDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    token?: string;
    days?: string;
    source?: string;
    eventId?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) {
  const { locale: localeParam } = await params;
  const {
    token,
    days: daysParam,
    source: sourceParam,
    eventId: eventIdParam,
    sortBy: sortByParam,
    sortDir: sortDirParam,
  } = await searchParams;

  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const t = getT(locale);

  const expectedToken = process.env.PARTNERS_DASHBOARD_TOKEN;
  const requiresToken = Boolean(expectedToken);
  const isAuthorized = !requiresToken || token === expectedToken;
  const selectedDays = ["7", "30", "90"].includes(daysParam || "")
    ? Number(daysParam)
    : 30;
  const selectedSource = sourceParam?.trim() || "";
  const selectedEventId = eventIdParam?.trim() || "";
  const selectedSortBy = ["delta", "current", "previous", "source"].includes(
    sortByParam || "",
  )
    ? (sortByParam as "delta" | "current" | "previous" | "source")
    : "delta";
  const selectedSortDir = ["asc", "desc"].includes(sortDirParam || "")
    ? (sortDirParam as "asc" | "desc")
    : "desc";

  const buildDashboardHref = (
    days: number,
    source?: string,
    eventId?: string,
    sortBy?: "delta" | "current" | "previous" | "source",
    sortDir?: "asc" | "desc",
  ) => {
    const params = new URLSearchParams();
    params.set("days", String(days));
    if (source && source.trim()) params.set("source", source.trim());
    if (eventId && eventId.trim()) params.set("eventId", eventId.trim());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDir) params.set("sortDir", sortDir);
    if (token) params.set("token", token);
    return `/${locale}/partners/dashboard?${params.toString()}`;
  };

  const buildExportHref = (kind: "leads" | "clicks") => {
    const params = new URLSearchParams();
    params.set("kind", kind);
    params.set("days", String(selectedDays));
    if (selectedSource) params.set("source", selectedSource);
    if (selectedEventId) params.set("eventId", selectedEventId);
    params.set("sortBy", selectedSortBy);
    params.set("sortDir", selectedSortDir);
    if (token) params.set("token", token);
    return `/api/partners/export?${params.toString()}`;
  };

  const clearFiltersHref = buildDashboardHref(
    selectedDays,
    undefined,
    undefined,
    selectedSortBy,
    selectedSortDir,
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-brand-black py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-white mb-3">
            {t("partners.dashboard.locked_title", "Dashboard protegido")}
          </h1>
          <p className="text-brand-grey">
            {t(
              "partners.dashboard.locked_text",
              "Fornece o token correto no URL para aceder ao dashboard.",
            )}
          </p>
        </div>
      </div>
    );
  }

  const [metrics, filterOptions] = await Promise.all([
    getDashboardMetricsWithFilters(selectedDays, {
      source: selectedSource || undefined,
      eventId: selectedEventId || undefined,
    }),
    getDashboardFilterOptions(selectedDays),
  ]);

  const conversionRate =
    metrics.totals.clicks > 0
      ? (metrics.totals.leads / metrics.totals.clicks) * 100
      : 0;
  const formatTrend = (delta: number, pct: number | null) => {
    const sign = delta > 0 ? "+" : delta < 0 ? "" : "";
    const trendClass =
      delta > 0
        ? "text-green-400"
        : delta < 0
          ? "text-red-400"
          : "text-brand-grey";

    if (pct === null) {
      return {
        className: trendClass,
        label: `${sign}${delta} · ${t("partners.dashboard.no_previous_data", "Sem histórico")}`,
      };
    }

    return {
      className: trendClass,
      label: `${sign}${delta} (${sign}${pct.toFixed(1)}%)`,
    };
  };

  const clicksTrend = formatTrend(
    metrics.comparison.clicksDelta,
    metrics.comparison.clicksDeltaPct,
  );
  const leadsTrend = formatTrend(
    metrics.comparison.leadsDelta,
    metrics.comparison.leadsDeltaPct,
  );
  const conversionDelta = metrics.comparison.conversionDeltaPctPoints;
  const conversionTrendClass =
    conversionDelta > 0
      ? "text-green-400"
      : conversionDelta < 0
        ? "text-red-400"
        : "text-brand-grey";
  const conversionTrendLabel = `${
    conversionDelta > 0 ? "+" : ""
  }${conversionDelta.toFixed(1)} pp`;
  const currentDailyMap = new Map(
    metrics.dailyClicks.map((entry) => [entry.day, entry.clicks]),
  );
  const previousDailyMap = new Map(
    metrics.previousDailyClicks.map((entry) => [entry.day, entry.clicks]),
  );
  const utcToday = new Date();
  const currentEnd = new Date(
    Date.UTC(
      utcToday.getUTCFullYear(),
      utcToday.getUTCMonth(),
      utcToday.getUTCDate(),
    ),
  );
  const currentStart = new Date(currentEnd);
  currentStart.setUTCDate(currentEnd.getUTCDate() - selectedDays + 1);
  const previousStart = new Date(currentStart);
  previousStart.setUTCDate(currentStart.getUTCDate() - selectedDays);

  const compareDaily = Array.from({ length: selectedDays }, (_, index) => {
    const currentDate = new Date(currentStart);
    currentDate.setUTCDate(currentStart.getUTCDate() + index);
    const previousDate = new Date(previousStart);
    previousDate.setUTCDate(previousStart.getUTCDate() + index);

    const currentDay = currentDate.toISOString().slice(0, 10);
    const previousDay = previousDate.toISOString().slice(0, 10);
    return {
      label: currentDay.slice(5),
      current: currentDailyMap.get(currentDay) || 0,
      previous: previousDailyMap.get(previousDay) || 0,
      currentDay,
      previousDay,
    };
  });

  const maxDailyClicks = Math.max(
    1,
    ...compareDaily.flatMap((entry) => [entry.current, entry.previous]),
  );

  const sortedSourceTrends = [...metrics.sourceTrends].sort((a, b) => {
    const compareValue =
      selectedSortBy === "current"
        ? a.current - b.current
        : selectedSortBy === "previous"
          ? a.previous - b.previous
          : selectedSortBy === "source"
            ? a.source.localeCompare(b.source)
            : a.delta - b.delta;

    if (compareValue !== 0) {
      return selectedSortDir === "asc" ? compareValue : -compareValue;
    }

    return a.source.localeCompare(b.source);
  });

  const buildSortHref = (
    field: "delta" | "current" | "previous" | "source",
  ) => {
    const nextDir: "asc" | "desc" =
      selectedSortBy === field && selectedSortDir === "desc" ? "asc" : "desc";

    return buildDashboardHref(
      selectedDays,
      selectedSource,
      selectedEventId,
      field,
      nextDir,
    );
  };

  const sortIndicator = (
    field: "delta" | "current" | "previous" | "source",
  ) => {
    if (selectedSortBy !== field) return "";
    return selectedSortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="min-h-screen bg-brand-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              {t("partners.dashboard.title", "Partners Dashboard")}
            </h1>
            <p className="text-brand-grey">
              {t(
                "partners.dashboard.subtitle",
                "Últimos 30 dias: cliques outbound e leads de parceria.",
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={buildExportHref("leads")}
              className="px-3 py-2 rounded-lg border border-brand-grey-dark text-brand-grey hover:text-white transition-colors text-sm"
            >
              {t("partners.dashboard.export_leads", "Exportar leads CSV")}
            </a>
            <a
              href={buildExportHref("clicks")}
              className="px-3 py-2 rounded-lg border border-brand-grey-dark text-brand-grey hover:text-white transition-colors text-sm"
            >
              {t("partners.dashboard.export_clicks", "Exportar cliques CSV")}
            </a>
            <Link href={`/${locale}/partners`} className="btn-primary">
              {t("partners.dashboard.back", "Voltar a Parcerias")}
            </Link>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-brand-grey text-sm">
            {t("partners.dashboard.period", "Período:")}
          </span>
          {[7, 30, 90].map((days) => (
            <Link
              key={days}
              href={buildDashboardHref(
                days,
                selectedSource,
                selectedEventId,
                selectedSortBy,
                selectedSortDir,
              )}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedDays === days
                  ? "bg-brand-red text-white"
                  : "border border-brand-grey-dark text-brand-grey hover:text-white"
              }`}
            >
              {days}d
            </Link>
          ))}
        </div>

        <form className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-4 mb-6">
          {token ? <input type="hidden" name="token" value={token} /> : null}
          <input type="hidden" name="days" value={String(selectedDays)} />
          <input type="hidden" name="sortBy" value={selectedSortBy} />
          <input type="hidden" name="sortDir" value={selectedSortDir} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              name="source"
              defaultValue={selectedSource}
              className="w-full px-3 py-2 rounded-lg bg-brand-black text-white border border-brand-grey-dark focus:border-brand-red focus:outline-none text-sm"
            >
              <option value="">
                {t("partners.dashboard.filter_source_all", "Todas as fontes")}
              </option>
              {filterOptions.sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>

            <select
              name="eventId"
              defaultValue={selectedEventId}
              className="w-full px-3 py-2 rounded-lg bg-brand-black text-white border border-brand-grey-dark focus:border-brand-red focus:outline-none text-sm"
            >
              <option value="">
                {t("partners.dashboard.filter_event_all", "Todos os eventos")}
              </option>
              {filterOptions.eventIds.map((eventId) => (
                <option key={eventId} value={eventId}>
                  {eventId}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm px-3 py-2">
                {t("partners.dashboard.apply_filters", "Aplicar filtros")}
              </button>
              <Link
                href={clearFiltersHref}
                className="px-3 py-2 rounded-lg border border-brand-grey-dark text-brand-grey hover:text-white transition-colors text-sm"
              >
                {t("partners.dashboard.clear_filters", "Limpar")}
              </Link>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
            <p className="text-brand-grey text-sm mb-1">
              {t("partners.dashboard.total_clicks", "Total de cliques")}
            </p>
            <p className="text-white text-3xl font-bold">
              {metrics.totals.clicks}
            </p>
            <p className={`text-xs mt-2 ${clicksTrend.className}`}>
              {clicksTrend.label} ·{" "}
              {t("partners.dashboard.vs_previous", "vs período anterior")}
            </p>
          </div>
          <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
            <p className="text-brand-grey text-sm mb-1">
              {t("partners.dashboard.total_leads", "Total de leads")}
            </p>
            <p className="text-white text-3xl font-bold">
              {metrics.totals.leads}
            </p>
            <p className={`text-xs mt-2 ${leadsTrend.className}`}>
              {leadsTrend.label} ·{" "}
              {t("partners.dashboard.vs_previous", "vs período anterior")}
            </p>
          </div>
          <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
            <p className="text-brand-grey text-sm mb-1">
              {t("partners.dashboard.storage", "Persistência")}
            </p>
            <p className="text-white text-lg font-semibold">
              {metrics.usingPostgres
                ? t("partners.dashboard.storage_pg", "PostgreSQL")
                : t("partners.dashboard.storage_memory", "Memória (fallback)")}
            </p>
          </div>
          <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
            <p className="text-brand-grey text-sm mb-1">
              {t("partners.dashboard.conversion", "Conversão leads/clicks")}
            </p>
            <p className="text-white text-3xl font-bold">
              {conversionRate.toFixed(1)}%
            </p>
            <p className={`text-xs mt-2 ${conversionTrendClass}`}>
              {conversionTrendLabel} ·{" "}
              {t("partners.dashboard.vs_previous", "vs período anterior")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">
              {t("partners.dashboard.top_sources", "Top fontes")}
            </h2>
            {metrics.topSources.length === 0 ? (
              <p className="text-brand-grey text-sm">
                -{t("partners.dashboard.no_data", "Sem dados ainda")}
              </p>
            ) : (
              <ul className="space-y-2">
                {metrics.topSources.map((row) => (
                  <li key={row.source} className="flex justify-between text-sm">
                    <span className="text-brand-grey">{row.source}</span>
                    <span className="text-white font-semibold">
                      {row.clicks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">
              {t("partners.dashboard.top_events", "Top eventos")}
            </h2>
            {metrics.topEvents.length === 0 ? (
              <p className="text-brand-grey text-sm">
                -{t("partners.dashboard.no_data", "Sem dados ainda")}
              </p>
            ) : (
              <ul className="space-y-2">
                {metrics.topEvents.map((row) => (
                  <li
                    key={row.eventId}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-brand-grey truncate pr-3">
                      {row.eventId}
                    </span>
                    <span className="text-white font-semibold">
                      {row.clicks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">
            {t("partners.dashboard.source_trends", "Ganhos/perdas por fonte")}
          </h2>
          {metrics.sourceTrends.length === 0 ? (
            <p className="text-brand-grey text-sm">
              -{t("partners.dashboard.no_data", "Sem dados ainda")}
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-grey border-b border-brand-grey-dark/40">
                    <th className="py-2 pr-4">
                      <Link
                        href={buildSortHref("source")}
                        className="hover:text-white transition-colors"
                      >
                        {t("partners.dashboard.col_source", "Fonte")}
                        {sortIndicator("source")}
                      </Link>
                    </th>
                    <th className="py-2 pr-4">
                      <Link
                        href={buildSortHref("current")}
                        className="hover:text-white transition-colors"
                      >
                        {t("partners.dashboard.col_current", "Atual")}
                        {sortIndicator("current")}
                      </Link>
                    </th>
                    <th className="py-2 pr-4">
                      <Link
                        href={buildSortHref("previous")}
                        className="hover:text-white transition-colors"
                      >
                        {t("partners.dashboard.col_previous", "Anterior")}
                        {sortIndicator("previous")}
                      </Link>
                    </th>
                    <th className="py-2 pr-4">
                      <Link
                        href={buildSortHref("delta")}
                        className="hover:text-white transition-colors"
                      >
                        {t("partners.dashboard.col_delta", "Delta")}
                        {sortIndicator("delta")}
                      </Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSourceTrends.map((row) => {
                    const trendClass =
                      row.delta > 0
                        ? "text-green-400"
                        : row.delta < 0
                          ? "text-red-400"
                          : "text-brand-grey";
                    const pctText =
                      row.deltaPct === null
                        ? t(
                            "partners.dashboard.no_previous_data",
                            "sem histórico",
                          )
                        : `${row.delta > 0 ? "+" : ""}${row.deltaPct.toFixed(1)}%`;

                    return (
                      <tr
                        key={row.source}
                        className="border-b border-brand-grey-dark/20 text-brand-grey"
                      >
                        <td className="py-2 pr-4 text-white">{row.source}</td>
                        <td className="py-2 pr-4 tabular-nums">
                          {row.current}
                        </td>
                        <td className="py-2 pr-4 tabular-nums">
                          {row.previous}
                        </td>
                        <td className={`py-2 pr-4 tabular-nums ${trendClass}`}>
                          {row.delta > 0 ? "+" : ""}
                          {row.delta} · {pctText}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">
            {t("partners.dashboard.daily_clicks", "Cliques por dia")}
          </h2>
          {metrics.dailyClicks.length === 0 ? (
            <p className="text-brand-grey text-sm">
              -{t("partners.dashboard.no_data", "Sem dados ainda")}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4 text-xs">
                <span className="inline-flex items-center gap-2 text-brand-grey">
                  <span className="w-3 h-3 rounded-sm bg-brand-red" />
                  {t("partners.dashboard.current_period", "Período atual")}
                </span>
                <span className="inline-flex items-center gap-2 text-brand-grey">
                  <span className="w-3 h-3 rounded-sm bg-brand-grey-dark" />
                  {t("partners.dashboard.previous_period", "Período anterior")}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {compareDaily.map((row) => (
                  <div
                    key={row.currentDay}
                    className="rounded-lg border border-brand-grey-dark/40 p-3 bg-brand-black/40"
                  >
                    <div className="h-24 flex items-end">
                      <div
                        className="w-1/2 px-0.5 h-full flex items-end"
                        title={`${row.previousDay}: ${row.previous}`}
                        aria-label={`${row.previousDay}: ${row.previous}`}
                      >
                        <div
                          className="w-full bg-brand-grey-dark rounded-t-sm transition-all"
                          style={{
                            height: `${Math.max(8, (row.previous / maxDailyClicks) * 100)}%`,
                          }}
                        />
                      </div>
                      <div
                        className="w-1/2 px-0.5 h-full flex items-end"
                        title={`${row.currentDay}: ${row.current}`}
                        aria-label={`${row.currentDay}: ${row.current}`}
                      >
                        <div
                          className="w-full bg-brand-red rounded-t-sm transition-all"
                          style={{
                            height: `${Math.max(8, (row.current / maxDailyClicks) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-white font-semibold mt-2 text-sm tabular-nums">
                      {row.current} / {row.previous}
                    </p>
                    <p
                      className="text-brand-grey text-xs truncate"
                      title={row.currentDay}
                    >
                      {row.label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">
            {t("partners.dashboard.recent_leads", "Leads recentes")}
          </h2>
          {metrics.recentLeads.length === 0 ? (
            <p className="text-brand-grey text-sm">
              -{t("partners.dashboard.no_data", "Sem dados ainda")}
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-grey border-b border-brand-grey-dark/40">
                    <th className="py-2 pr-4">
                      {t("partners.dashboard.col_date", "Data")}
                    </th>
                    <th className="py-2 pr-4">
                      {t("partners.dashboard.col_name", "Nome")}
                    </th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">
                      {t("partners.dashboard.col_company", "Empresa")}
                    </th>
                    <th className="py-2 pr-4">
                      {t("partners.dashboard.col_category", "Categoria")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-brand-grey-dark/20 text-brand-grey"
                    >
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString(
                          locale === "pt" ? "pt-PT" : "en-US",
                        )}
                      </td>
                      <td className="py-2 pr-4 text-white">{lead.name}</td>
                      <td className="py-2 pr-4">{lead.email}</td>
                      <td className="py-2 pr-4">{lead.company}</td>
                      <td className="py-2 pr-4">{lead.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
