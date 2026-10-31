// CornerTab (eski adı Esnaf Cep): ad TEK YERDE. Kaynak metin: OstlerTech/hukuk/2026-10-26-cornertab-gizlilik-son.md (Zeynep).
// Sayfa adresi (/cornertab/privacy) uygulamaya gömülüdür (com.ostlertech.cornertab, privacy_policy_url); ad değişse de adres AYNI kalır.
export const CORNERTAB = {
  name: "CornerTab",
  path: "/cornertab/privacy",
  enPath: "/en/cornertab/privacy",
  /** Ürün sayfası ve Play bağlantısı (UTM: Play Console'da sitenin getirdiği edinmeler görünsün). */
  pagePath: "/cornertab",
  pageEnPath: "/en/cornertab",
  playUrl:
    "https://play.google.com/store/apps/details?id=com.ostlertech.cornertab&referrer=utm_source%3Dsite%26utm_medium%3Durunler%26utm_campaign%3Dcornertab",
  updatedTr: "26 Ekim 2026", // örn. "12 Kasım 2026"
  updatedEn: "26 October 2026", // örn. "12 November 2026"
} as const;
