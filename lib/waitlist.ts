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

const STORE_PREFIX = process.env.WAITLIST_STORE_PREFIX || "tappy";
const LOCAL_DATA_FILE = path.join(process.cwd(), ".data", "waitlist.json");

function emailsKey() {
  return `${STORE_PREFIX}:waitlist:emails`;
}

function entryKey(email: string) {
  return `${STORE_PREFIX}:waitlist:entry:${email}`;
}

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

async function getRedisClient() {
  const config = getRedisConfig();
  if (!config) {
    return null;
  }

  const { Redis } = await import("@upstash/redis");
  return new Redis(config);
}

function assertCanUseLocalFallback() {
  if (process.env.VERCEL) {
    throw new Error("Waitlist storage is not configured. Add Vercel Redis / Upstash env vars.");
  }
}

function normalizeEntry(value: Partial<WaitlistEntry> & { email: string }): WaitlistEntry {
  const now = new Date().toISOString();

  return {
    email: String(value.email || "").toLowerCase(),
    name: String(value.name || ""),
    source: String(value.source || "landing"),
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

  const redis = await getRedisClient();
  if (redis) {
    await redis.sadd(emailsKey(), cleanEntry.email);
    await redis.hset(entryKey(cleanEntry.email), cleanEntry);
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
  const redis = await getRedisClient();
  if (redis) {
    const emails = ((await redis.smembers(emailsKey())) || []) as string[];
    const entries = await Promise.all(
      emails.map(async (email) => {
        const stored = (await redis.hgetall(entryKey(email))) as Partial<WaitlistEntry> | null;
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
  const fields: Array<keyof WaitlistEntry> = ["createdAt", "updatedAt", "email", "name", "source", "ip", "userAgent"];
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
