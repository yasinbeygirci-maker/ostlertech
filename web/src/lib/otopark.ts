// Otopark oyunu: ad TEK YERDE. "Otopark" geçici kod adıdır; mağaza adı belirlenince yalnız `name` değişir.
// Kaynak metin: OstlerTech/hukuk/otopark-gizlilik-ve-play-beyanlari.md (Zeynep). TR ve EN sayfası bu sabitleri kullanır.
//
// Sayfa adresi (/otopark/privacy) oyunun içine gömülüdür (Otopark app/build.gradle.kts `oyunYolu`). Ad değişse de
// adresin AYNI kalması önerilir; değişecekse src/app/otopark ve src/app/en/otopark klasörleri yeniden adlandırılır,
// `path`/`enPath` güncellenir ve eski adres yeni adrese yönlendirilir (eski sürümler eski adresi açmaya devam eder).
export const OTOPARK = {
  name: "Otopark",
  path: "/otopark/privacy",
  enPath: "/en/otopark/privacy",
  updatedTr: "17 Ekim 2026",
  updatedEn: "17 October 2026",
} as const;
