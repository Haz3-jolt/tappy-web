import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type WaitlistEntry = {
  email: string;
  name: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  ip: string;
  userAgent: string;
};

type WaitlistStore = {
  addEmail(email: string): Promise<void>;
  setEntry(email: string, entry: WaitlistEntry): Promise<void>;
  listEmails(): Promise<string[]>;
  getEntry(email: string): Promise<Partial<WaitlistEntry> | null>;
};

const STORE_PREFIX = process.env.WAITLIST_STORE_PREFIX || "tappy";
const LOCAL_DATA_FILE = path.join(process.cwd(), ".data", "waitlist.json");

function emailsKey() {
  return `${STORE_PREFIX}:waitlist:emails`;
}

function entryKey(email: string) {
  return `${STORE_PREFIX}:waitlist:entry:${email}`;
}

async function getStore(): Promise<WaitlistStore | null> {
  return (await getUpstashRestStore()) || (await getRedisUrlStore());
}

async function getUpstashRestStore(): Promise<WaitlistStore | null> {
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
    addEmail: (email) => redis.sadd(emailsKey(), email).then(() => undefined),
    setEntry: (email, entry) => redis.hset(entryKey(email), entry).then(() => undefined),
    listEmails: async () => ((await redis.smembers(emailsKey())) || []) as string[],
    getEntry: async (email) => (await redis.hgetall(entryKey(email))) as Partial<WaitlistEntry> | null,
  };
}

let redisUrlStorePromise: Promise<WaitlistStore | null> | null = null;

async function getRedisUrlStore(): Promise<WaitlistStore | null> {
  if (!redisUrlStorePromise) {
    redisUrlStorePromise = createRedisUrlStore();
  }

  return redisUrlStorePromise;
}

async function createRedisUrlStore(): Promise<WaitlistStore | null> {
  const url = process.env.REDIS_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_URL;
  if (!url) {
    return null;
  }

  const { createClient } = await import("redis");
  const client = createClient({ url });
  client.on("error", (error) => console.error("Redis waitlist client error", error));
  await client.connect();

  return {
    addEmail: (email) => client.sAdd(emailsKey(), email).then(() => undefined),
    setEntry: (email, entry) => client.hSet(entryKey(email), entry).then(() => undefined),
    listEmails: () => client.sMembers(emailsKey()),
    getEntry: async (email) => {
      const entry = await client.hGetAll(entryKey(email));
      return Object.keys(entry).length ? (entry as Partial<WaitlistEntry>) : null;
    },
  };
}

function assertCanUseLocalFallback() {
  if (process.env.VERCEL) {
    throw new Error(
      "Waitlist storage is not configured. Expected Redis env vars like KV_REST_API_URL/KV_REST_API_TOKEN, UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN, or REDIS_URL.",
    );
  }
}

function normalizeEntry(value: Partial<WaitlistEntry> & { email: string }): WaitlistEntry {
  const now = new Date().toISOString();

  return {
    email: String(value.email || "").toLowerCase(),
    name: String(value.name || ""),
    source: String(value.source || "ios-waitlist"),
    createdAt: String(value.createdAt || now),
    updatedAt: String(value.updatedAt || value.createdAt || now),
    ip: String(value.ip || ""),
    userAgent: String(value.userAgent || ""),
  };
}

async function readLocalEntries(): Promise<WaitlistEntry[]> {
  try {
    const raw = await readFile(LOCAL_DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Array<Partial<WaitlistEntry> & { email: string }>;
    return parsed.filter((entry) => entry.email).map(normalizeEntry);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeLocalEntries(entries: WaitlistEntry[]) {
  await mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await writeFile(LOCAL_DATA_FILE, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export async function saveWaitlistEntry(entry: WaitlistEntry) {
  const cleanEntry = normalizeEntry(entry);

  const store = await getStore();
  if (store) {
    await store.addEmail(cleanEntry.email);
    await store.setEntry(cleanEntry.email, cleanEntry);
    return cleanEntry;
  }

  assertCanUseLocalFallback();

  const entries = await readLocalEntries();
  const existingIndex = entries.findIndex((item) => item.email === cleanEntry.email);

  if (existingIndex >= 0) {
    entries[existingIndex] = {
      ...entries[existingIndex],
      ...cleanEntry,
      createdAt: entries[existingIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };
  } else {
    entries.push(cleanEntry);
  }

  await writeLocalEntries(entries);
  return cleanEntry;
}

export async function listWaitlistEntries(): Promise<WaitlistEntry[]> {
  const store = await getStore();
  if (store) {
    const emails = await store.listEmails();
    const entries = await Promise.all(
      emails.map(async (email) => {
        const stored = await store.getEntry(email);
        return stored ? normalizeEntry({ ...stored, email: stored.email || email }) : null;
      }),
    );

    return entries
      .filter((entry): entry is WaitlistEntry => Boolean(entry))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  assertCanUseLocalFallback();

  const entries = await readLocalEntries();
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function waitlistEntriesToCsv(entries: WaitlistEntry[]) {
  const fields: Array<keyof WaitlistEntry> = ["createdAt", "updatedAt", "email", "name", "source"];
  const rows = [
    fields.join(","),
    ...entries.map((entry) => fields.map((field) => csvCell(entry[field])).join(",")),
  ];

  return `${rows.join("\n")}\n`;
}

function csvCell(value: string) {
  const clean = value.replace(/\r?\n/g, " ");
  if (/[",\n]/.test(clean)) {
    return `"${clean.replace(/"/g, '""')}"`;
  }

  return clean;
}
