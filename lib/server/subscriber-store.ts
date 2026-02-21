/**
 * Subscriber Store — PostgreSQL-first persistence for newsletter subscribers.
 *
 * Uses DATABASE_URL when available, with a file fallback (data/subscribers.json)
 * so local/dev environments continue to work without Postgres.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { Pool } from "pg";

const DATA_FILE = join(process.cwd(), "data", "subscribers.json");

interface SubscriberEntry {
    email: string;
    name: string;
    locale: string;
    subscribedAt: string;
}

let cache: Map<string, SubscriberEntry> | null = null;
let pool: Pool | null = null;
let dbSchemaEnsured = false;

function getPool(): Pool | null {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) return null;

    if (!pool) {
        pool = new Pool({
            connectionString: databaseUrl,
            ssl:
                process.env.POSTGRES_SSL === "disable"
                    ? false
                    : { rejectUnauthorized: false },
        });
    }

    return pool;
}

async function ensureDbSchema(): Promise<void> {
    const db = getPool();
    if (!db || dbSchemaEnsured) return;

    await db.query(`
      CREATE TABLE IF NOT EXISTS wtd_subscribers (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        locale TEXT NOT NULL,
        subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    dbSchemaEnsured = true;
}

function ensureDir() {
    const dir = dirname(DATA_FILE);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

function loadFromFile(): Map<string, SubscriberEntry> {
    if (cache) return cache;

    try {
        ensureDir();
        if (existsSync(DATA_FILE)) {
            const raw = readFileSync(DATA_FILE, "utf-8");
            const entries: SubscriberEntry[] = JSON.parse(raw);
            cache = new Map(entries.map((e) => [e.email, e]));
            console.log(
                `[subscriber-store] Loaded ${cache.size} subscribers from disk.`,
            );
        } else {
            cache = new Map();
            saveToFile(); // Create initial empty file
        }
    } catch (err) {
        console.error("[subscriber-store] Error loading subscribers:", err);
        cache = new Map();
    }

    return cache;
}

function saveToFile(): void {
    try {
        ensureDir();
        const entries = Array.from(loadFromFile().values());
        writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
    } catch (err) {
        console.error("[subscriber-store] Error saving subscribers:", err);
    }
}

function hasSubscriberInFile(email: string): boolean {
    return loadFromFile().has(email.toLowerCase());
}

function addSubscriberToFile(email: string, name: string, locale: string): void {
    const normalized = email.toLowerCase();
    if (loadFromFile().has(normalized)) return;

    loadFromFile().set(normalized, {
        email: normalized,
        name,
        locale,
        subscribedAt: new Date().toISOString(),
    });
    saveToFile();
}

export async function hasSubscriber(email: string): Promise<boolean> {
    const normalized = email.toLowerCase();
    const db = getPool();

    if (!db) return hasSubscriberInFile(normalized);

    try {
        await ensureDbSchema();
        const result = await db.query(
            "SELECT 1 FROM wtd_subscribers WHERE email = $1 LIMIT 1",
            [normalized],
        );
        return (result.rowCount ?? 0) > 0;
    } catch (err) {
        console.error("[subscriber-store] DB hasSubscriber failed, using file fallback:", err);
        return hasSubscriberInFile(normalized);
    }
}

export async function addSubscriber(
    email: string,
    name: string,
    locale: string,
): Promise<void> {
    const normalized = email.toLowerCase();
    const db = getPool();

    if (!db) {
        addSubscriberToFile(normalized, name, locale);
        return;
    }

    try {
        await ensureDbSchema();
        await db.query(
            `
              INSERT INTO wtd_subscribers (email, name, locale, subscribed_at)
              VALUES ($1, $2, $3, NOW())
              ON CONFLICT (email) DO NOTHING
            `,
            [normalized, name, locale],
        );
    } catch (err) {
        console.error("[subscriber-store] DB addSubscriber failed, using file fallback:", err);
        addSubscriberToFile(normalized, name, locale);
    }
}

export async function getSubscriberCount(): Promise<number> {
    const db = getPool();
    if (!db) return loadFromFile().size;

    try {
        await ensureDbSchema();
        const result = await db.query("SELECT COUNT(*)::int AS count FROM wtd_subscribers");
        return result.rows[0]?.count ?? 0;
    } catch (err) {
        console.error("[subscriber-store] DB getSubscriberCount failed, using file fallback:", err);
        return loadFromFile().size;
    }
}

export async function removeSubscriber(email: string): Promise<boolean> {
    const normalized = email.toLowerCase();
    const db = getPool();

    if (!db) {
        const removed = loadFromFile().delete(normalized);
        if (removed) saveToFile();
        return removed;
    }

    try {
        await ensureDbSchema();
        const result = await db.query(
            "DELETE FROM wtd_subscribers WHERE email = $1",
            [normalized],
        );
        return (result.rowCount ?? 0) > 0;
    } catch (err) {
        console.error("[subscriber-store] DB removeSubscriber failed, using file fallback:", err);
        const removed = loadFromFile().delete(normalized);
        if (removed) saveToFile();
        return removed;
    }
}
