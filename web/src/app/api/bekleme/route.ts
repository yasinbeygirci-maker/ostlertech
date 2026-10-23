import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { AREAPILOT } from "@/lib/areapilot";
import { checkWaitlistRequest, ipHash, WAITLIST_LIMIT_PER_HOUR, type WaitlistProduct } from "@/lib/waitlist-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ürün bekleme/beta listesi. Tablo site_waitlist (supabase/2026-10-23-bekleme-listesi.sql); tarayıcı doğrudan yazamaz.
// Koruma: bal küpü alanı + en kısa doldurma süresi + IP özeti başına saatte WAITLIST_LIMIT_PER_HOUR kayıt; çift kayıt yok.
// Başarıda (yeni ya da önceden kayıtlı) ürünün indirme bağlantıları döner; bağlantılar sayfa HTML'inde yer almaz.
// Hukuk 2026-10-23 A yolu: bağlantı yalnız sayfada gösterilir, e-posta gönderilmez; e-posta yalnız beta bildirimleri için tutulur.

const DOWNLOADS: Record<WaitlistProduct, Record<string, string>> = {
  areapilot: AREAPILOT.downloads,
};

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const check = checkWaitlistRequest(body);
  // Bot: kayıt yok, bağlantı yok, hata da yok.
  if (check.kind === "bot") return json({ ok: true });
  if (check.kind === "invalid") return json({ error: check.field }, 400);

  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "").trim();
  // Özet anahtarı: sunucudaki gizli anahtar (tarayıcıya gitmez); ayrı bir sır gerektirmez.
  const hash = ipHash(ip, process.env.WAITLIST_IP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "");

  let result: string;
  try {
    const { data, error } = await supabaseAdmin().rpc("site_waitlist_join", {
      p_product: check.product,
      p_email: check.email,
      p_lang: check.lang,
      p_source: `${check.product.replace(/-/g, "_")}_beta`,
      p_autocad_version: check.autocadVersion,
      p_ip_hash: hash,
      p_limit_per_hour: WAITLIST_LIMIT_PER_HOUR,
    });
    if (error) throw new Error(error.message);
    result = String(data);
  } catch (e) {
    console.error("bekleme listesi", check.product, (e as Error).message);
    return json({ error: "server" }, 500);
  }
  if (result === "rate_limited") return json({ error: "rate_limited" }, 429);
  return json({ ok: true, status: result, downloads: DOWNLOADS[check.product] });
}
