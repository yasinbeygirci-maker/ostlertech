import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { AREAPILOT } from "@/lib/areapilot";
import { checkWaitlistRequest, ipHash, MARKETING_CONSENT_VERSION, WAITLIST_LIMIT_PER_HOUR, type WaitlistProduct } from "@/lib/waitlist-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ürün bekleme/beta listesi. Tablo site_waitlist (supabase/2026-10-23-bekleme-listesi.sql); tarayıcı doğrudan yazamaz.
// Koruma: bal küpü alanı + en kısa doldurma süresi + IP özeti başına saatte WAITLIST_LIMIT_PER_HOUR kayıt; çift kayıt yok.
// Başarıda (yeni ya da önceden kayıtlı) ürünün indirme bağlantıları döner; bağlantılar sayfa HTML'inde yer almaz.
// Bağlantı yalnız sayfada gösterilir. E-posta beta bildirimleri içindir; yeni ürün/kampanya duyurusu yalnız marketing_consent=true
// olan satırlara gönderilebilir (2026-10-31 T4-B; sitede e-posta gönderen kod yok).

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

  // Duyuru onayı kaydı supabase/2026-10-31-bekleme-onay.sql ile gelir. Migration uygulanıp WAITLIST_CONSENT_DB=1 verilene
  // kadar onay kaydedilemez: kutu işaretliyse onayı sessizce kaybetmek yerine kayıt reddedilir (kutu işaretsizse beta akışı aynen sürer).
  const consentDb = process.env.WAITLIST_CONSENT_DB === "1";
  if (check.marketing && !consentDb) return json({ error: "consent_unavailable" }, 503);

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
    const { data, error } = consentDb
      ? await supabaseAdmin().rpc("site_waitlist_join_v2", { ...base, p_marketing: check.marketing, p_consent_version: MARKETING_CONSENT_VERSION })
      : await supabaseAdmin().rpc("site_waitlist_join", base);
    if (error) throw new Error(error.message);
    result = String(data);
  } catch (e) {
    console.error("bekleme listesi", check.product, (e as Error).message);
    return json({ error: "server" }, 500);
  }
  if (result === "rate_limited") return json({ error: "rate_limited" }, 429);
  return json({ ok: true, status: result, downloads: DOWNLOADS[check.product] });
}
