// Türkçe ve İngilizce sayfa eşleşmeleri (dil değiştirici ve ilk giriş önerisi bunu kullanır).
// Eşi olmayan sayfa karşı dilin ana sayfasına gider.
export const TR_TO_EN: Record<string, string> = {
  "/": "/en",
  "/areapilot": "/en/areapilot",
  "/satin-al": "/en/pricing",
  "/gizlilik": "/en/privacy",
  "/kullanim-sartlari": "/en/terms",
  "/teslimat-ve-iade": "/en/refunds",
  "/sifre-yoneticisi": "/en/offline-password-manager",
  "/iki-adimli-dogrulama": "/en/password-manager-with-authenticator",
  "/guvenlik-kontrol-listesi": "/en/security-checklist",
  "/dijital-guvenlik-plani": "/en/digital-security-plan",
  "/oklar/privacy": "/en/oklar/privacy",
  "/otopark/privacy": "/en/otopark/privacy",
};

export const EN_TO_TR: Record<string, string> = {
  ...Object.fromEntries(Object.entries(TR_TO_EN).map(([tr, en]) => [en, tr])),
  "/en/password-manager-comparison": "/sifre-yoneticisi",
};

export const LANG_KEY = "ot-lang";
export type SiteLang = "tr" | "en";

const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

export function pageLang(pathname: string): SiteLang {
  const p = clean(pathname);
  return p === "/en" || p.startsWith("/en/") ? "en" : "tr";
}

/** Verilen sayfanın karşı dildeki karşılığı. */
export function otherLangPath(pathname: string): string {
  const p = clean(pathname);
  return pageLang(p) === "tr" ? TR_TO_EN[p] ?? "/en" : EN_TO_TR[p] ?? "/";
}

export function rememberLang(lang: SiteLang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* depolama kapalıysa seçim yalnız bu sayfa için geçerli */
  }
}
