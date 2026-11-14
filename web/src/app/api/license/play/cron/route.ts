import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { playDeps } from "@/lib/server/play";
import { cronAuthorized, PlayApiError, sweepVoidedPurchases } from "@/lib/play-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Günlük iptal/iade taraması (Burak Ş9). Vercel Cron GET ile çağırır ve `Authorization: Bearer $CRON_SECRET` ekler; CRON_SECRET tanımlı değilse
// ya da başlık yanlışsa HER istek 401'dir (kota tüketimi, P3). Yanıtta yalnız sayılar (jeton/lisans yok).
export async function GET(req: Request) {
  if (!cronAuthorized(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const r = await sweepVoidedPurchases(await playDeps(supabaseAdmin()));
    return NextResponse.json({ ok: true, seen: r.seen, marked: r.marked, expired: r.expired }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const kind = e instanceof PlayApiError ? e.kind : "error";
    console.error("play cron", kind);
    return NextResponse.json({ error: kind === "auth" ? "not_configured" : "verify_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
