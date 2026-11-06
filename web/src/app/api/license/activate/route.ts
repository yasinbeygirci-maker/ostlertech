import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { runLicenseRoute } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Masaüstü uygulaması lisansı ilk girişte ve sonra düzenli olarak buradan yeniler.
// Gelen tek bilgi: lisans kodu, uygulamanın ürettiği rastgele cihaz numarası ve sürüm. Kasa içeriği hiç gelmez.
// Mantık: lib/license-core.ts (SyncPass davranışı değişmedi; AreaPilot kodu burada 404 wrong_product alır).
export async function POST(req: Request) {
  const result = await runLicenseRoute(req, "activate", "syncpass_desktop", supabaseAdmin());
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
