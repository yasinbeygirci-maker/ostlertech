import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { runLicenseRoute } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// AreaPilot lisans etkinleştirme. Sözleşme: D:/Development/OstlerTech/yonetim/areapilot-lisans-sozlesmesi.md. SyncPass kodu burada 404 wrong_product alır.
export async function POST(req: Request) {
  const result = await runLicenseRoute(req, "activate", "areapilot", supabaseAdmin());
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
