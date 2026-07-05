# Tappy webdem

A simple Next.js landing site for Tappy, styled after Impeccable's dark lacquer / kinpaku gold system.

## Local dev

```bash
npm install
cp .env.example .env.local
# set ADMIN_SECRET in .env.local
npm run dev
```

Open `http://localhost:3000`.

## APK link

The APK from `C:\Users\haris\Downloads\tappy.apk` is included at:

```text
public/downloads/tappy.apk
```

The landing page download button points to:

```text
/downloads/tappy.apk
```

For Vercel, keep this env var or omit it because it is the app default:

```bash
NEXT_PUBLIC_APK_URL=/downloads/tappy.apk
```

You can also point `NEXT_PUBLIC_APK_URL` at an external hosted APK URL later.

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
- optional `NEXT_PUBLIC_APK_URL=/downloads/tappy.apk`
