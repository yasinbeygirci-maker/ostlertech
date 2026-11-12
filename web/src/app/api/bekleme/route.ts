import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { AREAPILOT } from "@/lib/areapilot";
import { checkWaitlistRequest, ipHash, WAITLIST_LIMIT_PER_HOUR, waitlistIpKey, waitlistSuccessBody, type WaitlistProduct } from "@/lib/waitlist-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ürün bekleme/beta listesi. Tablo site_waitlist (supabase/2026-10-23-bekleme-listesi.sql); tarayıcı doğrudan yazamaz.
// Koruma: bal küpü alanı + en kısa doldurma süresi + IP özeti başına saatte WAITLIST_LIMIT_PER_HOUR DENEME (adres listede olsun olmasın sayılır, supabase/2026-11-11-bekleme-deneme-sayaci.sql); çift kayıt yok.
// Başarıda (yeni ya da önceden kayıtlı) ürünün indirme bağlantıları döner; bağlantılar sayfa HTML'inde yer almaz.
// Bağlantı yalnız sayfada gösterilir. E-posta yalnız beta/deneme bildirimleri içindir. Duyuru (pazarlama) onayı toplanmaz ve sitede e-posta
// gönderen kod yoktur (Yasin kararı 2026-11-12: bekleme listesinden duyuru e-postası gönderilmeyecek).

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
  // Özet anahtarı: WAITLIST_IP_SECRET; tanımsızsa service-role anahtarından türetilen ayrı anahtar (waitlistIpKey, Burak D3).
  const hash = ipHash(ip, waitlistIpKey(process.env.WAITLIST_IP_SECRET, process.env.SUPABASE_SERVICE_ROLE_KEY));

  let result: string;
  try {
    const base = {
      p_product: check.product,
      p_email: check.email,
      p_lang: check.lang,
      p_source: `${check.product.replace(/-/g, "_")}_beta`,
      p_autocad_version: check.autocadVersion,
      p_ip_hash: hash,
      p_limit_per_hour: WAITLIST_LIMIT_PER_HOUR,
    };
    const { data, error } = await supabaseAdmin().rpc("site_waitlist_join", base);
    if (error) {
      // Günlüğe veritabanı iletisi YAZILMAZ (kişisel veri taşıyabilir; Burak D4): yalnız PostgREST/Postgres hata kodu.
      console.error("bekleme listesi", check.product, "rpc", error.code ?? "kod-yok");
      return json({ error: "server" }, 500);
    }
    result = String(data);
  } catch (e) {
    console.error("bekleme listesi", check.product, (e as Error)?.name ?? "Error");
    return json({ error: "server" }, 500);
  }
  if (result === "rate_limited") return json({ error: "rate_limited" }, 429);
  // Yeni kayıt ile önceden kayıtlı adres AYNI yanıtı alır: yanıttan adresin listede olup olmadığı okunmaz (Burak O1).
  return json(waitlistSuccessBody(DOWNLOADS[check.product]));
}
