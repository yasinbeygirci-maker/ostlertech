import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { playDeps } from "@/lib/server/play";
import { cronAuthorized, cronResponse, PlayApiError, sweepVoidedPurchases } from "@/lib/play-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// İptal listesi: en kötü durum belirteç 8 sn + 10 sayfa x 8 sn = 88 sn + satır başına RPC (Burak S2); Fluid açık. Varsayılana bırakma.
export const maxDuration = 120;

// Günlük iptal/iade taraması (Burak Ş9). Vercel Cron GET ile çağırır ve `Authorization: Bearer $CRON_SECRET` ekler; CRON_SECRET tanımlı değilse
// ya da başlık yanlışsa HER istek 401'dir (kota tüketimi, P3). Yanıtta yalnız sayılar (jeton/lisans yok).
export async function GET(req: Request) {
  if (!cronAuthorized(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const r = await sweepVoidedPurchases(await playDeps(supabaseAdmin()));
    const out = cronResponse(r);
    if (out.status !== 200) console.error("play cron", r.voided, r.voidedHttp ?? "-");
    return NextResponse.json(out.body, { status: out.status, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const kind = e instanceof PlayApiError ? e.kind : "error";
    console.error("play cron", kind);
    return NextResponse.json({ error: kind === "auth" ? "not_configured" : "verify_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
