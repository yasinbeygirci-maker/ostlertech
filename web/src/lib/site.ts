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
  phone: "",
  email: CONTACT_EMAIL,
  chamberName: "", // kayıtlı olunan esnaf odası
  chamberUrl: "",
};


// SyncPass Masaüstü Premium. Planlar ve fiyat kimlikleri lib/paddle-tiers.ts'te; tutarları Paddle ülkeye göre verir.
export const DESKTOP_LICENSE = {
  name: "SyncPass Masaüstü Premium",
  devices: 3,
  refundDays: 14,
};

export const PADDLE_BUYER_TERMS_URL = "https://www.paddle.com/legal/checkout-buyer-terms";

export const LEGAL_UPDATED = "4 Ekim 2026";

// Uygulamadaki sabitlerle aynı olmalı (MainVaultScreen.freeLimit, EncryptionManager.PBKDF2_ITERATIONS).
export const FREE_ITEM_LIMIT = 15;
export const PBKDF2_ITERATIONS = "600.000";
export const LANGUAGE_COUNT = 12;
export const MIN_ANDROID = "Android 7.0";
