import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { playDeps } from "@/lib/server/play";
import { handlePlayClaim, parseClaimBody } from "@/lib/play-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Android uygulaması Play satın alma jetonunu gönderir; sunucu jetonu Google'a doğrulatır ve AYNI lisans satırının SPD kodunu döndürür
// (masaüstü kodu /api/license/activate'e girer). Gövde yalnız {purchaseToken, productId, kind, appVersion}; kasa verisi, e-posta, hesap kimliği
// ve cihaz numarası hiç gelmez. Yanıtta jeton yoktur. Mantık: lib/play-core.ts; sözleşme: web/docs/tek-lisans-k1-sozlesme.md.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // Biçim hatası Supabase'e ve Google'a hiç gitmeden 400 (kota ve veritabanı korunur).
  if (!parseClaimBody(body)) return NextResponse.json({ error: "bad_request" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  let result;
  try {
    result = await handlePlayClaim(body, await playDeps(supabaseAdmin()));
  } catch (e) {
    // Yapılandırma eksikse (Supabase ortamı vb.) ayrıntı yazılmaz; yalnız sınıf.
    console.error("play claim route", e instanceof Error ? e.constructor.name : "error");
    result = { status: 500, body: { error: "server_error" } };
  }
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
