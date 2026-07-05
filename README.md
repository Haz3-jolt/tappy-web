# Tappy webdem

A playful pink/purple Next.js landing site for Tappy with the APK served directly from the repo.

## Local dev

```bash
npm install
cp .env.example .env.local
# set ADMIN_SECRET in .env.local
npm run dev
```

Open `http://localhost:3000`.

## APK link

The APK from `C:\Users\haris\Downloads\tappy.apk` is embedded in the site at:

```text
public/downloads/tappy.apk
```

The landing page download button points to:

```text
/downloads/tappy.apk
```

No separate hosting is needed. Next/Vercel serves it as a static file from `public/`.

## Waitlist storage

- Local dev fallback: `.data/waitlist.json`.
- Vercel production: connect **Vercel Redis / Upstash** to the project so either `KV_REST_API_URL` + `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are available.

## Creator export

Set an env var:

```bash
ADMIN_SECRET=replace-with-a-long-random-secret
```

Then visit `/creator`, enter that secret, and export CSV.

The raw endpoints also exist:

```bash
curl -H "x-admin-secret: $ADMIN_SECRET" https://your-domain.vercel.app/api/waitlist
curl -H "x-admin-secret: $ADMIN_SECRET" "https://your-domain.vercel.app/api/waitlist?format=csv" -o tappy-waitlist.csv
```

## Deploy to Vercel

```bash
npm run build
vercel
```

In Vercel, add:

- `ADMIN_SECRET`
- Vercel Redis / Upstash storage
- APK already embedded at `public/downloads/tappy.apk`
