// Sitenin birden fazla yerde kullandığı sabit bilgiler. Bir değer değişirse yalnızca burası güncellenir.
// referrer: Play Console'da "Play dışı" edinmelerin siteden geldiğini görmek için (Selin, 2026-10-17).
export const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=utm_source%3Dostlertech.com%26utm_medium%3Dsite";

// Oyunların Play adresleri (2026-11-06: dördünde de Install düğmesi canlı doğrulandı). Beepout'un paket kimliği com.ostlertech.otopark.
const PLAY_REF = "&referrer=utm_source%3Dostlertech.com%26utm_medium%3Dsite";
export const OKLAR_URL = `https://play.google.com/store/apps/details?id=com.ostlertech.oklar${PLAY_REF}`;
export const BEEPOUT_URL = `https://play.google.com/store/apps/details?id=com.ostlertech.otopark${PLAY_REF}`;
export const PACKLE_URL = `https://play.google.com/store/apps/details?id=com.ostlertech.packle${PLAY_REF}`;
export const HOZENI_URL = `https://play.google.com/store/apps/details?id=com.ostlertech.hozeni${PLAY_REF}`;

export const SITE_URL = "https://www.ostlertech.com";

export const CONTACT_EMAIL = "destek@ostlertech.com";

// Güvenlik açığı bildirimleri. Cloudflare Email Routing'de guvenlik@ -> sahibin posta kutusu kuralı açık (2026-10-31).
// Adres değişirse burası ve public/.well-known/security.txt içindeki "Contact" satırı birlikte değişir.
export const SECURITY_CONTACT_EMAIL = "guvenlik@ostlertech.com";

export const INSTAGRAM_URL = "https://www.instagram.com/ostlertech/";

export const YOUTUBE_URL = "https://www.youtube.com/@OstlerTech";

// LinkedIn şirket sayfası: 2026-11-08 canlı doğrulandı (sayfa başlığı "OstlerTech | LinkedIn", urn:li:organization:145402819).
export const LINKEDIN_URL = "https://www.linkedin.com/company/ostlertech/";

// TikTok şirket hesabı @ostlertech: 2026-11-08 oEmbed ile doğrulandı (author_name "OstlerTech"). Kurucunun kişisel hesabı değil.
export const TIKTOK_URL = "https://www.tiktok.com/@ostlertech";

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
// HER MSI YAYININDA version/sizeLabel/sha256 burada elle güncellenir (gh release view ile doğrula); yoksa site eski sürümü gösterir.
export const DESKTOP_DOWNLOAD = {
  url: "https://github.com/yasinbeygirci-maker/syncpass-releases/releases/latest/download/SyncPass.msi",
  releasesUrl: "https://github.com/yasinbeygirci-maker/syncpass-releases/releases",
  version: "1.4.15",
  sizeLabel: "141 MB",
  sha256: "295a69095fb2b48c3687c286f7bcf517e8d55d915d3d904841a5bc80f8241423",
  requirements: "Windows 10 (2004) veya Windows 11, 64 bit",
};

// SyncPass'in Microsoft Store sayfası (2026-10-28'den beri yayında; HTTP 200 doğrulandı 2026-11-05).
export const MS_STORE_URL = "https://apps.microsoft.com/detail/9PPS2SD0G399";

// Tarayıcı eklentisi: kayıtları aynı bilgisayardaki SyncPass Masaüstü'nden doldurur (Edge incelemede).
export const BROWSER_EXTENSION = {
  chromeUrl: "https://chromewebstore.google.com/detail/bbighjeekihcenhofnmefgmcadddahbk",
};

// Ekran görüntüleri ve OG görseli aynı adla yenilenince bu değer artırılır (tarayıcı ve paylaşım önbelleği eskiyi göstermesin).
export const SCREENS_VERSION = "20261030";

export const PADDLE_BUYER_TERMS_URL = "https://www.paddle.com/legal/buyer-terms";

export const LEGAL_UPDATED = "7 Kasım 2026";
export const LEGAL_UPDATED_EN = "7 November 2026"; // İngilizce sürümlerin (/en/...) tarihi

// Uygulamadaki sabitlerle aynı olmalı (FreeTier.ITEM_LIMIT, EncryptionManager.PBKDF2_ITERATIONS).
// Ücretsiz kayıt sınırı platforma göre ayrı: Android (Play'de yayında 4.5.24) ve Masaüstü (yayındaki 1.4.17,
// LicenseManager.FREE_ITEM_LIMIT). Masaüstü 25'li sürümü yayınlanınca YALNIZ FREE_ITEM_LIMIT_DESKTOP = 25 yapılır;
// ikisi eşit olunca aşağıdaki ortak cümleler tek sayıya kendiliğinden iner.
// Kullanım şartlarının TR metni (kullanim-sartlari/page.tsx) bu sabite bağlı DEĞİL, elle yazılı (yasal metin).
export const FREE_ITEM_LIMIT_ANDROID: number = 25;
export const FREE_ITEM_LIMIT_DESKTOP: number = 15;

// Platform belirtmeyen genel cümleler için.
const sameLimit = FREE_ITEM_LIMIT_ANDROID === FREE_ITEM_LIMIT_DESKTOP;
/** "25 kayıt" / "Android'de 25, masaüstünde 15 kayıt" */
export const FREE_LIMIT_TR = sameLimit
  ? `${FREE_ITEM_LIMIT_ANDROID} kayıt`
  : `Android'de ${FREE_ITEM_LIMIT_ANDROID}, masaüstünde ${FREE_ITEM_LIMIT_DESKTOP} kayıt`;
/** "25 kayda kadar ücretsiz" / "Android'de 25, masaüstünde 15 kayda kadar ücretsiz" */
export const FREE_UP_TO_TR = sameLimit
  ? `${FREE_ITEM_LIMIT_ANDROID} kayda kadar ücretsiz`
  : `Android'de ${FREE_ITEM_LIMIT_ANDROID}, masaüstünde ${FREE_ITEM_LIMIT_DESKTOP} kayda kadar ücretsiz`;
/** "25 items" / "25 items on Android and 15 on desktop" */
export const FREE_LIMIT_EN = sameLimit
  ? `${FREE_ITEM_LIMIT_ANDROID} items`
  : `${FREE_ITEM_LIMIT_ANDROID} items on Android and ${FREE_ITEM_LIMIT_DESKTOP} on desktop`;
export const PBKDF2_ITERATIONS = "600.000";
export const LANGUAGE_COUNT = 12;
export const MIN_ANDROID = "Android 7.0";
