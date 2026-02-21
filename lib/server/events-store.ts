import fs from "fs/promises";
import path from "path";
import type { Event } from "@/data/types";

const eventsFilePath = path.join(process.cwd(), "data", "events.json");
const EVENTS_CACHE_TTL_MS = 60_000;

let eventsCache: {
    mtimeMs: number;
    loadedAt: number;
    data: Event[];
} | null = null;

export function isUpcoming(event: Event): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOrStart = event.endDate ? new Date(event.endDate) : new Date(event.date);
    return endOrStart >= today;
}

export function dedupeEvents(events: Event[]): Event[] {
    const seen = new Set<string>();
    const result: Event[] = [];

    for (const event of events) {
        const key = event.url || `${event.title}-${event.date}`;
        const altKey = `${event.title}-${event.date}`;
        if (seen.has(key) || seen.has(altKey)) continue;
        seen.add(key);
        seen.add(altKey);
        result.push(event);
    }

    return result;
}

async function loadEventsCached(): Promise<Event[]> {
    const now = Date.now();
    const stat = await fs.stat(eventsFilePath);

    if (
        eventsCache
        && eventsCache.mtimeMs === stat.mtimeMs
        && now - eventsCache.loadedAt < EVENTS_CACHE_TTL_MS
    ) {
        return eventsCache.data;
    }

    const fileContent = await fs.readFile(eventsFilePath, "utf-8");
    const parsed = JSON.parse(fileContent) as Event[];

    eventsCache = {
        mtimeMs: stat.mtimeMs,
        loadedAt: now,
        data: parsed,
    };

    return parsed;
}

export async function getAllEventsCached(): Promise<Event[]> {
    return loadEventsCached();
}

export async function getUpcomingEventsCached(): Promise<Event[]> {
    const events = await loadEventsCached();
    return dedupeEvents(events)
        .filter(isUpcoming)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getEventByIdCached(id: string): Promise<Event | null> {
    const events = await loadEventsCached();
    return events.find((event) => event.id === id) ?? null;
}
