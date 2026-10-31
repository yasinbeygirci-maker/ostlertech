// Bekleme/beta listesi isteğinin denetimi (saf; birim testli: tests/waitlist-core.test.ts). Göreli import yok.
import { createHmac } from "node:crypto";

/** Listeye yazılabilen ürünler. Yeni ürün = buraya kimlik + (varsa) indirme yanıtı lib/server tarafında. */
export const WAITLIST_PRODUCTS = ["areapilot"] as const;
export type WaitlistProduct = (typeof WAITLIST_PRODUCTS)[number];

/** Aynı IP özetinden saatte en çok bu kadar kayıt. */
export const WAITLIST_LIMIT_PER_HOUR = 5;
/** Formun açılmasından gönderilmesine kadar en az bu kadar süre (ms); daha hızlısı bot sayılır. */
export const WAITLIST_MIN_FILL_MS = 2500;

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

export type WaitlistCheck =
  | { kind: "ok"; product: WaitlistProduct; email: string; lang: "tr" | "en"; autocadVersion: string | null; marketing: boolean }
  | { kind: "bot" }
  | { kind: "invalid"; field: "email" | "product" };

/**
 * İstek gövdesini denetler. "bot": bal küpü alanı dolu ya da form çok hızlı gönderildi; çağıran tarafa başarı gibi
 * görünür ama kayıt yapılmaz (bota ipucu verilmez).
 */
export function checkWaitlistRequest(body: unknown, now = Date.now()): WaitlistCheck {
  const b = (body ?? {}) as Record<string, unknown>;
  if (typeof b.website === "string" && b.website.trim() !== "") return { kind: "bot" };
  const started = typeof b.t === "number" ? b.t : NaN;
  if (!Number.isFinite(started) || now - started < WAITLIST_MIN_FILL_MS || now - started > 24 * 3600_000) return { kind: "bot" };
  const product = typeof b.product === "string" ? b.product : "";
  if (!(WAITLIST_PRODUCTS as readonly string[]).includes(product)) return { kind: "invalid", field: "product" };
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (email.length > 200 || !EMAIL.test(email)) return { kind: "invalid", field: "email" };
  const lang = b.lang === "en" ? "en" : "tr";
  // İsteğe bağlı; tanınmayan değer yok sayılır (formu bozmaz).
  const acad = typeof b.autocad === "string" && /^(20(1[3-9]|2[0-7])|unknown)$/.test(b.autocad) ? b.autocad : null;
  // Duyuru e-postası onayı: yalnız açıkça true ise (işaretsiz kutu, eksik alan, "true" metni = onay yok).
  return { kind: "ok", product: product as WaitlistProduct, email, lang, autocadVersion: acad, marketing: b.marketing === true };
}

/** Duyuru onayı için gösterilen metnin sürümü; metin değişirse (areapilot-content form.marketing) bu da değişir. */
export const MARKETING_CONSENT_VERSION = "2026-10-31-v1";

/** IP saklanmaz; hız sınırı için sunucu gizli anahtarıyla HMAC özeti (geri çevrilemez, 1 günde silinir). */
export function ipHash(ip: string, secret: string): string | null {
  if (!ip || !secret) return null;
  return createHmac("sha256", secret).update(`waitlist:${ip}`).digest("hex").slice(0, 32);
}
