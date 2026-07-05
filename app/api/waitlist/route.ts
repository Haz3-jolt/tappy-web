import { NextRequest, NextResponse } from "next/server";
import { saveWaitlistEntry } from "../../../lib/waitlist";

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
  const source = String(body.source || "ios-waitlist").trim().slice(0, 80) || "ios-waitlist";

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
  } catch (error) {
    console.error("Waitlist save failed", error);
    return NextResponse.json({ ok: false, message: "Waitlist storage is not ready yet." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "You're on the iOS waitlist." });
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "";
}
