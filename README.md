# Tappy web

Simple white Next.js site for Tappy. The Android APK is served directly from the repo and the iOS waitlist is stored in Vercel Redis / Upstash.

## Local dev

```bash
npm install
cp .env.example .env.local
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

## Waitlist storage

The homepage form writes signups to Redis. On Vercel, add a Redis/Upstash storage integration to this project. Vercel will inject one of these env var pairs:

```bash
KV_REST_API_URL=
KV_REST_API_TOKEN=
# or
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

That is the only required production setup for the waitlist.

## Viewing signups as owner

Open your Vercel dashboard:

```text
Project → Storage → Redis / Upstash → Data Browser
```

Look for keys:

```text
tappy:waitlist:emails
tappy:waitlist:entry:<email>
```

Each `tappy:waitlist:entry:<email>` hash contains the email, name, source, and signup time.

## Deploy

```bash
npm run build
vercel
```

Required on Vercel:

- Redis/Upstash storage integration

<!-- redeploy trigger: redis env refresh -->
