import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { runLicenseRoute } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// AreaPilot sessiz durum sorgusu (salt okur): {status: active|refunded|canceled|revoked|...}. Belge üretmez, cihaza dokunmaz.
export async function POST(req: Request) {
  const result = await runLicenseRoute(req, "status", "areapilot", supabaseAdmin());
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
