import { NextRequest, NextResponse } from "next/server";
import { saveFeedbackEntry } from "../../../lib/feedback";

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

  const email = String(body.email || body.mail || "").trim().toLowerCase();
  const feedback = String(body.feedback || "").trim().slice(0, 5000);
  const source = String(body.source || "android-feedback").trim().slice(0, 80) || "android-feedback";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email." }, { status: 400 });
  }

  if (feedback.length < 2) {
    return NextResponse.json({ ok: false, message: "Write a little feedback first." }, { status: 400 });
  }

  try {
    await saveFeedbackEntry({ email, feedback, source });
  } catch (error) {
    console.error("Feedback save failed", error);
    return NextResponse.json({ ok: false, message: "Feedback storage is not ready yet." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Feedback sent. Thank you." });
}
