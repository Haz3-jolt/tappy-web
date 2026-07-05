import { NextRequest, NextResponse } from "next/server";
import { listWaitlistEntries, waitlistEntriesToCsv } from "../../../../lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const exportSecret = process.env.WAITLIST_EXPORT_SECRET || process.env.ADMIN_SECRET;

  if (!exportSecret) {
    return NextResponse.json(
      { ok: false, message: "CSV export is not configured. Set WAITLIST_EXPORT_SECRET in Vercel." },
      { status: 500 },
    );
  }

  if (!isAuthorized(request, exportSecret)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const entries = await listWaitlistEntries();
    const date = new Date().toISOString().slice(0, 10);

    return new Response(waitlistEntriesToCsv(entries), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="tappy-ios-waitlist-${date}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Waitlist export failed", error);
    return NextResponse.json({ ok: false, message: "Could not export waitlist." }, { status: 500 });
  }
}

function isAuthorized(request: NextRequest, exportSecret: string) {
  const queryKey = request.nextUrl.searchParams.get("key") || request.nextUrl.searchParams.get("secret");
  const headerKey = request.headers.get("x-export-secret") || request.headers.get("x-admin-secret");
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : "";

  return queryKey === exportSecret || headerKey === exportSecret || bearer === exportSecret;
}
