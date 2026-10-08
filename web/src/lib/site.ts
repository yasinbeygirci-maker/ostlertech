// Sitenin birden fazla yerde kullandığı sabit bilgiler. Bir değer değişirse yalnızca burası güncellenir.
export const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass";

export const SITE_URL = "https://www.ostlertech.com";

export const CONTACT_EMAIL = "destek@ostlertech.com";

export const INSTAGRAM_URL = "https://www.instagram.com/ostlertech/";

export const YOUTUBE_URL = "https://www.youtube.com/@OstlerTech";

// Firma bilgileri: iletişim, gizlilik ve kullanım koşullarında aynı olmalı (6563 s. Kanun).
// Satışları Paddle (Merchant of Record) yapar; biz yazılımın geliştiricisi ve lisans vereniz.
export const COMPANY = {
  legalName: "Yasin Beygirci", // şahıs işletmesi: ad soyad
  tradeName: "Ostler Tech Yazılım", // esnaf sicilindeki işyeri adı
  brand: "OstlerTech",
  taxOffice: "Fevzipaşa",
  taxNumber: "1670324378", // VKN (TC kimlik no sitede gösterilmez)
  mersis: "", // esnaf kaydında MERSİS yok
  registry: "Erzincan Esnaf ve Sanatkâr Sicil Müdürlüğü",
  registryNo: "25537",
  address: "Hancı Mah. Akasya_1 Sk. No: 7 İç Kapı No: 1, Merkez / Erzincan",
  kep: "yasin.beygirci@hs01.kep.tr",
  phone: "+90 850 242 62 10", // Verimor sanal santral (0850)
  email: CONTACT_EMAIL,
  chamberName: "Erzincan Elektrikçiler Esnaf ve Sanatkarlar Odası", // oda kayıt belgesi 01.10.2026
  chamberUrl: "",
};


// SyncPass Masaüstü Premium. Planlar ve fiyat kimlikleri lib/paddle-tiers.ts'te; tutarları Paddle ülkeye göre verir.
export const DESKTOP_LICENSE = {
  name: "SyncPass Masaüstü Premium",
  devices: 3,
  refundDays: 14,
};

// Masaüstü kurulum dosyası: herkese açık sürüm deposunda. "latest" bağlantısı her yeni sürümde aynı kalır
// (dosya her sürümde SyncPass.msi adıyla yüklenir). Store sayfası açılınca indirme oraya çevrilecek.
export const DESKTOP_DOWNLOAD = {
  url: "https://github.com/yasinbeygirci-maker/syncpass-releases/releases/latest/download/SyncPass.msi",
  releasesUrl: "https://github.com/yasinbeygirci-maker/syncpass-releases/releases",
  version: "1.3.0",
  sizeLabel: "155 MB",
  sha256: "66e9c1368185f7cd150b376ae2db0e8c716109efd86df5e9ad71ae7d0519c68c",
  requirements: "Windows 10 (2004) veya Windows 11, 64 bit",
};

export const PADDLE_BUYER_TERMS_URL = "https://www.paddle.com/legal/checkout-buyer-terms";

export const LEGAL_UPDATED = "4 Ekim 2026";
export const LEGAL_UPDATED_EN = "7 October 2026"; // İngilizce sürümlerin (/en/...) tarihi

// Uygulamadaki sabitlerle aynı olmalı (MainVaultScreen.freeLimit, EncryptionManager.PBKDF2_ITERATIONS).
export const FREE_ITEM_LIMIT = 15;
export const PBKDF2_ITERATIONS = "600.000";
export const LANGUAGE_COUNT = 12;
export const MIN_ANDROID = "Android 7.0";
