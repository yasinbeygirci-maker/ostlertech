import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { runLicenseRoute } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// AreaPilot sessiz yenileme (açılışta ~7 günde bir). Cihaz kayıtlı değilse 404 device_unknown: kaldırılan cihaz geri eklenmez.
export async function POST(req: Request) {
  const result = await runLicenseRoute(req, "renew", "areapilot", supabaseAdmin());
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
