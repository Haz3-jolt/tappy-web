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

Vercel serves it as a static file from `public/`.

## Redis storage

The homepage form writes iOS waitlist signups to Redis, and the download button increments a Redis counter. On Vercel, add a Redis/Upstash storage integration to this project. The app accepts any one of these configurations:

```bash
KV_REST_API_URL=
KV_REST_API_TOKEN=
# or
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
# or
REDIS_URL=
```

That is the only required production setup. After connecting storage, redeploy so the env vars are present in the deployment.

Download counter API:

```text
GET /api/downloads      # returns { ok, count }
POST /api/downloads     # increments and returns { ok, count }
```

Counter key in Redis:

```text
tappy:downloads:apk
```

## Exporting signups as CSV

Set this Vercel env var:

```bash
WAITLIST_EXPORT_SECRET=replace-with-a-long-random-secret
```

After redeploying, download the CSV here:

```text
https://your-domain.vercel.app/api/waitlist/export?key=YOUR_SECRET
```

The CSV includes email, name, source, signup time, IP, and user agent.

You can also call it with a header instead of putting the secret in the URL:

```bash
curl -H "x-export-secret: $WAITLIST_EXPORT_SECRET" \
  https://your-domain.vercel.app/api/waitlist/export \
  -o tappy-ios-waitlist.csv
```

## Deploy

```bash
npm run build
vercel
```

Required on Vercel:

- Redis/Upstash storage integration attached to the same Vercel project/environment as the deployed site
- `WAITLIST_EXPORT_SECRET` if you want CSV export
