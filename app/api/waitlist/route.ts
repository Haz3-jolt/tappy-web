import { NextRequest, NextResponse } from "next/server";
import { listWaitlistEntries, saveWaitlistEntry, waitlistEntriesToCsv } from "../../../lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Send a valid JSON body." }, { status: 400 });
  }

  // Silent honeypot for bots. Real users never fill this hidden field.
  if (String(body.website || "").trim()) {
    return NextResponse.json({ ok: true, message: "You're on the iOS waitlist." });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim().slice(0, 120);
  const source = String(body.source || "landing").trim().slice(0, 80) || "landing";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email." }, { status: 400 });
  }

  const now = new Date().toISOString();

  try {
    await saveWaitlistEntry({
      email,
      name,
      source,
      createdAt: now,
      updatedAt: now,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Waitlist storage is not ready yet." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "You're on the iOS waitlist." });
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  let entries: Awaited<ReturnType<typeof listWaitlistEntries>>;

  try {
    entries = await listWaitlistEntries();
  } catch {
    return NextResponse.json({ ok: false, message: "Waitlist storage is not configured." }, { status: 500 });
  }

  const format = request.nextUrl.searchParams.get("format") || "json";

  if (format === "csv") {
    const date = new Date().toISOString().slice(0, 10);
    return new Response(waitlistEntriesToCsv(entries), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="tappy-waitlist-${date}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  }

  return NextResponse.json(
    { ok: true, count: entries.length, entries },
    { headers: { "Cache-Control": "no-store" } },
  );
}

function isAuthorized(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET || process.env.WAITLIST_ADMIN_SECRET;
  if (!adminSecret) {
    return false;
  }

  const providedSecret = request.headers.get("x-admin-secret") || request.nextUrl.searchParams.get("secret");
  return providedSecret === adminSecret;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "";
}
