import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const STORE_PREFIX = process.env.WAITLIST_STORE_PREFIX || "tappy";
const DOWNLOAD_COUNT_KEY = `${STORE_PREFIX}:downloads:apk`;
const LOCAL_DATA_FILE = path.join(process.cwd(), ".data", "downloads.json");

type CounterStore = {
  increment(): Promise<number>;
  get(): Promise<number>;
};

async function getStore(): Promise<CounterStore | null> {
  return (await getUpstashRestStore()) || (await getRedisUrlStore());
}

async function getUpstashRestStore(): Promise<CounterStore | null> {
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
    increment: () => redis.incr(DOWNLOAD_COUNT_KEY),
    get: async () => Number((await redis.get(DOWNLOAD_COUNT_KEY)) || 0),
  };
}

let redisUrlStorePromise: Promise<CounterStore | null> | null = null;

async function getRedisUrlStore(): Promise<CounterStore | null> {
  if (!redisUrlStorePromise) {
    redisUrlStorePromise = createRedisUrlStore();
  }

  return redisUrlStorePromise;
}

async function createRedisUrlStore(): Promise<CounterStore | null> {
  const url = process.env.REDIS_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_URL;
  if (!url) {
    return null;
  }

  const { createClient } = await import("redis");
  const client = createClient({ url });
  client.on("error", (error) => console.error("Redis download counter client error", error));
  await client.connect();

  return {
    increment: () => client.incr(DOWNLOAD_COUNT_KEY),
    get: async () => Number((await client.get(DOWNLOAD_COUNT_KEY)) || 0),
  };
}

function assertCanUseLocalFallback() {
  if (process.env.VERCEL) {
    throw new Error("Download counter storage is not configured. Add Redis env vars.");
  }
}

async function readLocalCount() {
  try {
    const raw = await readFile(LOCAL_DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as { apkDownloads?: number };
    return Number(parsed.apkDownloads || 0);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return 0;
    }

    throw error;
  }
}

async function writeLocalCount(count: number) {
  await mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  await writeFile(LOCAL_DATA_FILE, `${JSON.stringify({ apkDownloads: count }, null, 2)}\n`, "utf8");
}

export async function incrementDownloadCount() {
  const store = await getStore();
  if (store) {
    return store.increment();
  }

  assertCanUseLocalFallback();

  const count = (await readLocalCount()) + 1;
  await writeLocalCount(count);
  return count;
}

export async function getDownloadCount() {
  const store = await getStore();
  if (store) {
    return store.get();
  }

  assertCanUseLocalFallback();
  return readLocalCount();
}
