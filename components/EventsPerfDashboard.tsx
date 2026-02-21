"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type PerfSample = {
  ts: number;
  durationMs: number;
  readMs: number;
  filterMs: number;
  sortMs: number;
  totalCandidates: number;
  resultCount: number;
  payloadBytes: number;
  cache: "HIT" | "MISS";
  status: number;
  queryKeyHash: string;
};

type PerfSummary = {
  totalRequests: number;
  hitRatePct: number;
  avgDurationMs: number;
  p95DurationMs: number;
  avgPayloadBytes: number;
  window5m: {
    requests: number;
    avgDurationMs: number;
    hitRatePct: number;
  };
  latest: PerfSample[];
};

type Props = {
  locale: "pt" | "en";
};

function TrendChart({
  samples,
  height = 120,
}: {
  samples: PerfSample[];
  height?: number;
}) {
  if (samples.length < 2) {
    return (
      <div className="h-24 flex items-center text-brand-grey text-xs">
        No trend data
      </div>
    );
  }

  const width = 300;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding;

  const durations = samples.map((s) => s.durationMs);
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);
  const range = maxDuration - minDuration || 1;

  const points = samples.map((s, i) => {
    const x = padding + (i / (samples.length - 1)) * chartWidth;
    const y =
      padding +
      chartHeight -
      ((s.durationMs - minDuration) / range) * chartHeight;
    return { x, y, s };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <div className="rounded-lg border border-brand-grey-dark/40 p-3">
      <p className="text-brand-grey text-xs mb-2">
        Latency Trend (last {samples.length})
      </p>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="text-brand-grey-light"
      >
        <defs>
          <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(100, 200, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(100, 200, 255, 0.01)" />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          fill="none"
          stroke="rgba(100, 200, 255, 0.8)"
          strokeWidth="2"
        />
        <path
          d={`${pathData} L ${width - padding} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
          fill="url(#trendGrad)"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2"
            fill={
              p.s.cache === "HIT"
                ? "rgba(100, 200, 100, 0.8)"
                : "rgba(200, 100, 100, 0.8)"
            }
          />
        ))}
      </svg>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function EventsPerfDashboard({ locale }: Props) {
  const [data, setData] = useState<PerfSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const labels = useMemo(
    () => ({
      title:
        locale === "pt"
          ? "Performance da API de Eventos"
          : "Events API Performance",
      loading:
        locale === "pt" ? "A carregar métricas..." : "Loading metrics...",
      refresh: locale === "pt" ? "Atualizar" : "Refresh",
      export: locale === "pt" ? "Exportar CSV" : "Export CSV",
      lastRequests: locale === "pt" ? "Pedidos (total)" : "Requests (total)",
      hitRate: locale === "pt" ? "Cache hit rate" : "Cache hit rate",
      avgLatency: locale === "pt" ? "Latência média" : "Avg latency",
      p95Latency: locale === "pt" ? "Latência p95" : "p95 latency",
      avgPayload: locale === "pt" ? "Payload médio" : "Avg payload",
      window5m: locale === "pt" ? "Últimos 5 min" : "Last 5 min",
      noData: locale === "pt" ? "Sem dados ainda." : "No data yet.",
      table: {
        time: locale === "pt" ? "Hora" : "Time",
        total: locale === "pt" ? "Total (ms)" : "Total (ms)",
        stages: locale === "pt" ? "Leitura/Filtro/Sort" : "Read/Filter/Sort",
        cache: locale === "pt" ? "Cache" : "Cache",
        status: locale === "pt" ? "Status" : "Status",
        result: locale === "pt" ? "Resultado" : "Result",
        payload: locale === "pt" ? "Payload" : "Payload",
      },
      err:
        locale === "pt"
          ? "Falha ao carregar métricas."
          : "Failed to load metrics.",
    }),
    [locale],
  );

  const exportCSV = useCallback(() => {
    if (!data) return;

    const headers = [
      "Timestamp",
      "Duration (ms)",
      "Read (ms)",
      "Filter (ms)",
      "Sort (ms)",
      "Cache",
      "Status",
      "Result Count",
      "Payload (bytes)",
    ];
    const rows = data.latest.map((s) => [
      new Date(s.ts).toISOString(),
      s.durationMs.toFixed(1),
      s.readMs.toFixed(1),
      s.filterMs.toFixed(1),
      s.sortMs.toFixed(1),
      s.cache,
      s.status,
      s.resultCount,
      s.payloadBytes,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perf-metrics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [data]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/events/perf", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = (await response.json()) as PerfSummary;
      setData(payload);
    } catch (err) {
      setError(`${labels.err} ${(err as Error)?.message || ""}`.trim());
    } finally {
      setIsLoading(false);
    }
  }, [labels.err]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  return (
    <section className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-5">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="text-xl font-bold text-white">{labels.title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="px-3 py-1.5 rounded-lg border border-brand-grey-dark text-brand-grey hover:text-white transition-colors text-sm"
          >
            {labels.refresh}
          </button>
          <button
            type="button"
            onClick={exportCSV}
            disabled={!data}
            className="px-3 py-1.5 rounded-lg border border-brand-grey-dark text-brand-grey hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {labels.export}
          </button>
        </div>
      </div>

      {isLoading && <p className="text-brand-grey">{labels.loading}</p>}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {data && (
        <>
          {data.latest.length >= 2 && (
            <div className="mb-4">
              <TrendChart samples={data.latest} />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg border border-brand-grey-dark/40 p-3">
              <p className="text-brand-grey text-xs">{labels.lastRequests}</p>
              <p className="text-white text-2xl font-bold">
                {data.totalRequests}
              </p>
            </div>
            <div className="rounded-lg border border-brand-grey-dark/40 p-3">
              <p className="text-brand-grey text-xs">{labels.hitRate}</p>
              <p className="text-white text-2xl font-bold">
                {data.hitRatePct.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border border-brand-grey-dark/40 p-3">
              <p className="text-brand-grey text-xs">{labels.avgLatency}</p>
              <p className="text-white text-2xl font-bold">
                {data.avgDurationMs.toFixed(1)} ms
              </p>
            </div>
            <div className="rounded-lg border border-brand-grey-dark/40 p-3">
              <p className="text-brand-grey text-xs">{labels.p95Latency}</p>
              <p className="text-white text-2xl font-bold">
                {data.p95DurationMs.toFixed(1)} ms
              </p>
            </div>
            <div className="rounded-lg border border-brand-grey-dark/40 p-3">
              <p className="text-brand-grey text-xs">{labels.avgPayload}</p>
              <p className="text-white text-2xl font-bold">
                {formatBytes(data.avgPayloadBytes)}
              </p>
            </div>
            <div className="rounded-lg border border-brand-grey-dark/40 p-3">
              <p className="text-brand-grey text-xs">{labels.window5m}</p>
              <p className="text-white text-sm font-semibold">
                {data.window5m.requests} req ·{" "}
                {data.window5m.avgDurationMs.toFixed(1)} ms ·{" "}
                {data.window5m.hitRatePct.toFixed(1)}%
              </p>
            </div>
          </div>

          {data.latest.length === 0 ? (
            <p className="text-brand-grey text-sm">{labels.noData}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-grey border-b border-brand-grey-dark/40">
                    <th className="py-2 pr-3">{labels.table.time}</th>
                    <th className="py-2 pr-3">{labels.table.total}</th>
                    <th className="py-2 pr-3">{labels.table.stages}</th>
                    <th className="py-2 pr-3">{labels.table.cache}</th>
                    <th className="py-2 pr-3">{labels.table.status}</th>
                    <th className="py-2 pr-3">{labels.table.result}</th>
                    <th className="py-2">{labels.table.payload}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.latest.map((sample) => (
                    <tr
                      key={`${sample.ts}-${sample.queryKeyHash}`}
                      className="border-b border-brand-grey-dark/20 text-brand-grey-light"
                    >
                      <td className="py-2 pr-3">
                        {new Date(sample.ts).toLocaleTimeString()}
                      </td>
                      <td className="py-2 pr-3">
                        {sample.durationMs.toFixed(1)}
                      </td>
                      <td className="py-2 pr-3">
                        {sample.readMs.toFixed(1)} /{" "}
                        {sample.filterMs.toFixed(1)} /{" "}
                        {sample.sortMs.toFixed(1)}
                      </td>
                      <td className="py-2 pr-3">{sample.cache}</td>
                      <td className="py-2 pr-3">{sample.status}</td>
                      <td className="py-2 pr-3">{sample.resultCount}</td>
                      <td className="py-2">
                        {formatBytes(sample.payloadBytes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
