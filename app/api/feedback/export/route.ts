import { NextRequest, NextResponse } from "next/server";
import { feedbackEntriesToCsv, listFeedbackEntries } from "../../../../lib/feedback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const exportSecret = process.env.FEEDBACK_EXPORT_SECRET || process.env.WAITLIST_EXPORT_SECRET || process.env.ADMIN_SECRET;

  if (!exportSecret) {
    return NextResponse.json(
      { ok: false, message: "CSV export is not configured. Set FEEDBACK_EXPORT_SECRET or WAITLIST_EXPORT_SECRET in Vercel." },
      { status: 500 },
    );
  }

  if (!isAuthorized(request, exportSecret)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const entries = await listFeedbackEntries();
    const date = new Date().toISOString().slice(0, 10);

    return new Response(feedbackEntriesToCsv(entries), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="tappy-feedback-${date}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Feedback export failed", error);
    return NextResponse.json({ ok: false, message: "Could not export feedback." }, { status: 500 });
  }
}

function isAuthorized(request: NextRequest, exportSecret: string) {
  const queryKey = request.nextUrl.searchParams.get("key") || request.nextUrl.searchParams.get("secret");
  const headerKey = request.headers.get("x-export-secret") || request.headers.get("x-admin-secret");
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : "";

  return queryKey === exportSecret || headerKey === exportSecret || bearer === exportSecret;
}
