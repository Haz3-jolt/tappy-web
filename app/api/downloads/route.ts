import { NextResponse } from "next/server";
import { getDownloadCount, incrementDownloadCount } from "../../../lib/downloads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getDownloadCount();
    return NextResponse.json({ ok: true, count }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Download count read failed", error);
    return NextResponse.json({ ok: false, count: 0, message: "Download counter is not ready yet." }, { status: 500 });
  }
}

export async function POST() {
  try {
    const count = await incrementDownloadCount();
    return NextResponse.json({ ok: true, count }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Download count increment failed", error);
    return NextResponse.json({ ok: false, message: "Download counter is not ready yet." }, { status: 500 });
  }
}
