// AreaPilot indirme formu isteğinin denetimi (saf; birim testli: tests/waitlist-core.test.ts). Göreli import yok.
// 2026-11-18: form artık e-posta ya da başka kişisel veri toplamaz ve veritabanına yazmaz (Supabase KVKK md. 9 kararı, Zeynep 2026-11-18 §3-d1).

/** İndirme bağlantısı verilebilen ürünler. */
export const WAITLIST_PRODUCTS = ["areapilot"] as const;
export type WaitlistProduct = (typeof WAITLIST_PRODUCTS)[number];

/** Formun açılmasından gönderilmesine kadar en az bu kadar süre (ms); daha hızlısı bot sayılır. */
export const WAITLIST_MIN_FILL_MS = 2500;

export type WaitlistCheck = { kind: "ok"; product: WaitlistProduct } | { kind: "bot" } | { kind: "invalid"; field: "product" };

/**
 * İstek gövdesini denetler. "bot": bal küpü alanı dolu ya da form çok hızlı gönderildi; çağıran tarafa başarı gibi
 * görünür ama bağlantı verilmez (bota ipucu verilmez). Gövdedeki diğer alanlar (eski istemcilerin e-postası dahil) okunmaz.
 */
export function checkWaitlistRequest(body: unknown, now = Date.now()): WaitlistCheck {
  const b = (body ?? {}) as Record<string, unknown>;
  if (typeof b.website === "string" && b.website.trim() !== "") return { kind: "bot" };
  const started = typeof b.t === "number" ? b.t : NaN;
  if (!Number.isFinite(started) || now - started < WAITLIST_MIN_FILL_MS || now - started > 24 * 3600_000) return { kind: "bot" };
  const product = typeof b.product === "string" ? b.product : "";
  if (!(WAITLIST_PRODUCTS as readonly string[]).includes(product)) return { kind: "invalid", field: "product" };
  return { kind: "ok", product: product as WaitlistProduct };
}

/**
 * İstemci için: formun açılışından (started) en az WAITLIST_MIN_FILL_MS geçmesine kalan süre (ms). Sayfa açılır açılmaz basan
 * kullanıcının isteği sunucuda "bot" sayılıp bağlantısız dönüyordu (S2); istemci göndermeden önce bu kadar bekler.
 * started yok/geçersizse (henüz kurulmamış) tam süre beklenir.
 */
export function waitlistRemainingMs(started: number, now = Date.now()): number {
  if (!Number.isFinite(started) || started <= 0) return WAITLIST_MIN_FILL_MS + 100;
  return Math.max(0, started + WAITLIST_MIN_FILL_MS + 100 - now); // +100 ms: saat/ağ sapması payı
}

/** Başarı yanıtının gövdesi: yalnız indirme bağlantıları. */
export function waitlistSuccessBody(downloads: Record<string, string>): { ok: true; downloads: Record<string, string> } {
  return { ok: true, downloads };
}
