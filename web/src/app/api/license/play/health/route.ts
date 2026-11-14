import { NextResponse } from "next/server";
import { realVerifier } from "@/lib/server/play";
import { cronAuthorized, probePlayApi } from "@/lib/play-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sağlık/pozitif kontrol ucu (Burak Ş20): tek izinle ("finansal verileri görüntüle") üç Google çağrısının çalıştığını kanıtlar.
// CRON_SECRET korumalı (yoksa/yanlışsa 401). YANIT YALNIZ HTTP DURUM KODLARIdır: {"subscriptionsv2":200,"products":200,"voidedpurchases":200}.
// Jeton gövdede (adreste değil, günlüğe düşmesin) gelir: {"subscriptionToken","productId","productToken"}; hepsi isteğe bağlı.
// 401/403 görülürse ikinci Console iznini kendiliğinden ekleme: Burak'a dön.
export async function POST(req: Request) {
  if (!cronAuthorized(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const str = (v: unknown) => (typeof v === "string" && v.length > 0 && v.length <= 1024 ? v : undefined);
  const out = await probePlayApi(await realVerifier(), { subscriptionToken: str(b?.subscriptionToken), productId: str(b?.productId), productToken: str(b?.productToken) });
  return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
}
