import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type FeedbackEntry = {
  id: string;
  email: string;
  feedback: string;
  source: string;
  createdAt: string;
};

type FeedbackStore = {
  addEntry(entry: FeedbackEntry): Promise<void>;
  listEntries(): Promise<FeedbackEntry[]>;
};

const STORE_PREFIX = process.env.WAITLIST_STORE_PREFIX || "tappy";
const FEEDBACK_IDS_KEY = `${STORE_PREFIX}:feedback:ids`;
const LOCAL_DATA_FILE = path.join(process.cwd(), ".data", "feedback.json");

function feedbackEntryKey(id: string) {
  return `${STORE_PREFIX}:feedback:entry:${id}`;
}

async function getStore(): Promise<FeedbackStore | null> {
  return (await getUpstashRestStore()) || (await getRedisUrlStore());
}

async function getUpstashRestStore(): Promise<FeedbackStore | null> {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_API_URL ||
    process.env.VERCEL_KV_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_API_TOKEN ||
    process.env.VERCEL_KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({ url, token });

  return {
    addEntry: async (entry) => {
      await redis.lpush(FEEDBACK_IDS_KEY, entry.id);
      await redis.hset(feedbackEntryKey(entry.id), entry);
    },
    listEntries: async () => {
      const ids = ((await redis.lrange(FEEDBACK_IDS_KEY, 0, -1)) || []) as string[];
      const entries = await Promise.all(
        ids.map(async (id) => {
          const stored = (await redis.hgetall(feedbackEntryKey(id))) as Partial<FeedbackEntry> | null;
          return stored ? normalizeFeedbackEntry({ ...stored, id: stored.id || id }) : null;
        }),
      );
      return entries.filter((entry): entry is FeedbackEntry => Boolean(entry));
    },
  };
}

let redisUrlStorePromise: Promise<FeedbackStore | null> | null = null;

async function getRedisUrlStore(): Promise<FeedbackStore | null> {
  if (!redisUrlStorePromise) {
    redisUrlStorePromise = createRedisUrlStore();
  }

  return redisUrlStorePromise;
}

async function createRedisUrlStore(): Promise<FeedbackStore | null> {
  const url = process.env.REDIS_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_URL;
  if (!url) {
    return null;
  }

  const { createClient } = await import("redis");
  const client = createClient({ url });
  client.on("error", (error) => console.error("Redis feedback client error", error));
  await client.connect();

  return {
    addEntry: async (entry) => {
      await client.lPush(FEEDBACK_IDS_KEY, entry.id);
      await client.hSet(feedbackEntryKey(entry.id), entry);
    },
    listEntries: async () => {
      const ids = await client.lRange(FEEDBACK_IDS_KEY, 0, -1);
      const entries = await Promise.all(
        ids.map(async (id) => {
          const stored = await client.hGetAll(feedbackEntryKey(id));
          return Object.keys(stored).length ? normalizeFeedbackEntry({ ...(stored as Partial<FeedbackEntry>), id }) : null;
        }),
      );
      return entries.filter((entry): entry is FeedbackEntry => Boolean(entry));
    },
  };
}

function assertCanUseLocalFallback() {
  if (process.env.VERCEL) {
    throw new Error("Feedback storage is not configured. Add Redis env vars.");
  }
}

function normalizeFeedbackEntry(value: Partial<FeedbackEntry> & { id: string }): FeedbackEntry {
  return {
    id: String(value.id || ""),
    email: String(value.email || "").toLowerCase(),
    feedback: String(value.feedback || ""),
    source: String(value.source || "android-feedback"),
    createdAt: String(value.createdAt || new Date().toISOString()),
  };
}

async function readLocalEntries(): Promise<FeedbackEntry[]> {
  try {
    const raw = await readFile(LOCAL_DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Array<Partial<FeedbackEntry> & { id: string }>;
    return parsed.filter((entry) => entry.id).map(normalizeFeedbackEntry);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeLocalEntries(entries: FeedbackEntry[]) {
  await mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await writeFile(LOCAL_DATA_FILE, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export async function saveFeedbackEntry(entry: Omit<FeedbackEntry, "id" | "createdAt"> & Partial<Pick<FeedbackEntry, "id" | "createdAt">>) {
  const cleanEntry = normalizeFeedbackEntry({
    id: entry.id || createFeedbackId(),
    email: entry.email,
    feedback: entry.feedback,
    source: entry.source,
    createdAt: entry.createdAt || new Date().toISOString(),
  });

  const store = await getStore();
  if (store) {
    await store.addEntry(cleanEntry);
    return cleanEntry;
  }

  assertCanUseLocalFallback();

  const entries = await readLocalEntries();
  entries.unshift(cleanEntry);
  await writeLocalEntries(entries);
  return cleanEntry;
}

export async function listFeedbackEntries(): Promise<FeedbackEntry[]> {
  const store = await getStore();
  if (store) {
    return store.listEntries();
  }

  assertCanUseLocalFallback();
  return readLocalEntries();
}

export function feedbackEntriesToCsv(entries: FeedbackEntry[]) {
  const fields: Array<keyof FeedbackEntry> = ["createdAt", "email", "feedback", "source", "id"];
  const rows = [
    fields.join(","),
    ...entries.map((entry) => fields.map((field) => csvCell(entry[field])).join(",")),
  ];

  return `${rows.join("\n")}\n`;
}

function createFeedbackId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}-${random}`;
}

function csvCell(value: string) {
  const clean = value.replace(/\r?\n/g, " ");
  if (/[",\n]/.test(clean)) {
    return `"${clean.replace(/"/g, '""')}"`;
  }

  return clean;
}
