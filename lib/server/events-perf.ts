type CacheState = "HIT" | "MISS";

export type EventsPerfSample = {
    ts: number;
    durationMs: number;
    readMs: number;
    filterMs: number;
    sortMs: number;
    totalCandidates: number;
    resultCount: number;
    payloadBytes: number;
    cache: CacheState;
    status: number;
    queryKeyHash: string;
};

type EventsPerfSummary = {
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
    latest: EventsPerfSample[];
};

const MAX_SAMPLES = 400;
const samples: EventsPerfSample[] = [];

function average(values: number[]): number {
    if (values.length === 0) return 0;
    const total = values.reduce((acc, value) => acc + value, 0);
    return total / values.length;
}

function percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
    return sorted[index] ?? 0;
}

export function recordEventsPerf(sample: Omit<EventsPerfSample, "ts">): void {
    samples.push({ ...sample, ts: Date.now() });
    if (samples.length > MAX_SAMPLES) {
        samples.splice(0, samples.length - MAX_SAMPLES);
    }
}

export function getEventsPerfSummary(): EventsPerfSummary {
    const now = Date.now();
    const window5mSamples = samples.filter((sample) => now - sample.ts <= 5 * 60 * 1000);

    const durations = samples.map((sample) => sample.durationMs);
    const payloads = samples.map((sample) => sample.payloadBytes);
    const hits = samples.filter((sample) => sample.cache === "HIT").length;

    const durations5m = window5mSamples.map((sample) => sample.durationMs);
    const hits5m = window5mSamples.filter((sample) => sample.cache === "HIT").length;

    return {
        totalRequests: samples.length,
        hitRatePct: samples.length ? (hits / samples.length) * 100 : 0,
        avgDurationMs: average(durations),
        p95DurationMs: percentile(durations, 95),
        avgPayloadBytes: average(payloads),
        window5m: {
            requests: window5mSamples.length,
            avgDurationMs: average(durations5m),
            hitRatePct: window5mSamples.length ? (hits5m / window5mSamples.length) * 100 : 0,
        },
        latest: samples.slice(-20).reverse(),
    };
}
