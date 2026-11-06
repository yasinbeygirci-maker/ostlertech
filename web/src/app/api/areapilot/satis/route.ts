import { NextResponse } from "next/server";
import { paddleConfig, salesOpenFor } from "@/lib/paddle-env";
import { AREAPILOT_PRICE_IDS, areapilotPricesReady } from "@/lib/paddle-tiers";
import { salesPayload } from "@/lib/areapilot-sales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// AreaPilot satın alma bölümünün tek veri kaynağı. Satış bayrağı (PADDLE_SALES_OPEN_AREAPILOT) kapalıyken yalnız {open:false} döner:
// ne fiyat kimliği ne Paddle belirteci tarayıcıya gider. Sayfa (/areapilot) statik kalır; bölüm bu yanıt açıksa tarayıcıda çizilir.
// Yanıt herkes için aynıdır (ülkeyi Paddle.js IP'den bulur), bu yüzden kısa süre CDN'de tutulur; bayrağı değiştirince
// en geç ~30 sn sonra yansır. Webhook bu bayraktan etkilenmez.
export async function GET() {
  const payload = salesPayload(
    {
      open: salesOpenFor("areapilot", { areapilotPricesReady: areapilotPricesReady() }),
      ids: AREAPILOT_PRICE_IDS,
      getConfig: () => paddleConfig(),
    },
    // Ayar hatası sessiz değil: günlüğe yalnız hata sınıfı yazılır (ortam adı/belirteç yazılmaz).
    (e) => console.error("areapilot satis: paddle ayari gecersiz", (e as Error)?.name ?? "hata")
  );
  return NextResponse.json(payload, { headers: { "Cache-Control": "public, s-maxage=30, max-age=0" } });
}
