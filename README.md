# Tappy web

Simple white Next.js site for Tappy. The Android APK is served directly from the repo and the waitlist is stored in Vercel Redis / Upstash.

## Local dev

```bash
npm install
cp .env.example .env.local
# set ADMIN_SECRET in .env.local
npm run dev
```

Open `http://localhost:3000`.

## APK

The APK is embedded at:

```text
public/downloads/tappy.apk
```

The site downloads it from:

```text
/downloads/tappy.apk
```

No separate hosting needed. Vercel serves it as a static file from `public/`.

## Waitlist

Users submit the form on the homepage. The API writes each signup to Redis using these env vars:

```bash
KV_REST_API_URL=
KV_REST_API_TOKEN=
# or
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

On Vercel: add a Redis/Upstash storage integration to the project and Vercel will provide the env vars.

## Viewing signups

Simplest owner flow: open the Vercel project → Storage → your Redis/Upstash database → browse the keys under `tappy:waitlist:*`.

Optional: the repo still includes `/creator` for CSV export. Only set this env var if you want to use that page:

```bash
ADMIN_SECRET=replace-with-a-long-random-secret
```

Then visit `/creator`, enter the secret, and export CSV.

## Deploy

```bash
npm run build
vercel
```

Required on Vercel:

- Redis/Upstash storage integration

Optional:

- `ADMIN_SECRET` only if you want to use `/creator` / CSV export
