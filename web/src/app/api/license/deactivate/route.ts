import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { runLicenseRoute } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bilgisayar değiştirirken eski cihazın yeri boşaltılır (en fazla 3 bilgisayar).
export async function POST(req: Request) {
  const result = await runLicenseRoute(req, "deactivate", "syncpass_desktop", supabaseAdmin());
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
