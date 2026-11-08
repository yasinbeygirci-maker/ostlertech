import { BEEPOUT_URL, BROWSER_EXTENSION, DESKTOP_DOWNLOAD, HOZENI_URL, MS_STORE_URL, OKLAR_URL, PACKLE_URL, PLAY_URL } from "./site";
import { AREAPILOT } from "./areapilot";
import { CORNERTAB } from "./cornertab";

// CornerTab Play bağlantısı (UTM: Play Console'da sitenin getirdiği edinmeler görünsün).
const CORNERTAB_PLAY_URL = CORNERTAB.playUrl;

export type Dil = "tr" | "en";

/** Kartın dile bağlı metinleri. TR ve EN sayfalar aynı listeden beslenir; yeni ürün iki dilde birden yazılır. */
export interface UrunMetin {
  ad: string;
  slogan: string;
  aciklama: string;
  platform: string;
  /** Ana düğmenin yazısı (yoksa durumdan). */
  cta?: string;
  /** Kartın altındaki küçük bağlantılar. */
  ekler?: { etiket: string; url: string }[];
  /** Düğmenin altındaki kısa not (sürüm, mağaza durumu). */
  not?: string;
  /** Yalnız oyunlarda: hangi reklamın gösterildiği (gizlilik politikasıyla aynı). */
  reklam?: string;
}

// Ürün kartı. "yayinda" yalnız indirilebilen ürüne verilir; mağazaya çıkmamış ürün "test" ya da "yakinda" kalır.
export interface Urun extends UrunMetin {
  id: string;
  ikon: string;
  /** Varsa Lucide ikonu yerine bu görsel (public yolu) kullanılır. */
  gorsel?: string;
  renk: string;
  durum: string;
  url: string | null;
  /** İngilizce sayfadaki ana düğme adresi (verilmezse url). */
  urlEn?: string | null;
  /** İngilizce metinler (US English). */
  en: UrunMetin;
}

/** Reklam içeren oyunlar: ürün listesinde uygulamalardan ayrı bölümde gösterilir ("Reklam içerir" + reklam türü). */
export const OYUN_IDS = new Set(["oklar", "beepout", "packle", "hozeni"]);

/** Kartın seçilen dildeki metni ve adresi. */
export function urunMetni(u: Urun, dil: Dil): UrunMetin & { url: string | null } {
  if (dil === "en") return { ...u.en, url: u.urlEn !== undefined ? u.urlEn : u.url };
  return { ad: u.ad, slogan: u.slogan, aciklama: u.aciklama, platform: u.platform, cta: u.cta, ekler: u.ekler, not: u.not, reklam: u.reklam, url: u.url };
}

export const URUNLER: Urun[] = [
  {
    id: "syncpass",
    ad: "SyncPass",
    slogan: "Şifrelerin, kartların ve 2FA kodların cihazında",
    aciklama: "Kasayı telefonda tutan şifre yöneticisi; kasanın kopyası sunucularımızda tutulmaz. Kasa AES-256-GCM ve SQLCipher ile şifrelenir; otomatik doldurma, geçiş anahtarı, 2FA kodları ve dürüst bir güvenlik puanı sunar.",
    platform: "Android",
    ikon: "ShieldCheck",
    renk: "#4C8DFF",
    durum: "yayinda",
    url: PLAY_URL,
    cta: "Google Play'den indir",
    en: {
      ad: "SyncPass",
      slogan: "Your passwords, cards and 2FA codes on your device",
      aciklama: "A password manager that keeps your vault on your phone; we keep no copy of your vault on our servers. The vault is encrypted with AES-256-GCM and SQLCipher; it offers autofill, passkeys, 2FA codes and an honest security score.",
      platform: "Android",
      cta: "Get it on Google Play",
    },
  },
  {
    id: "syncpassdesktop",
    ad: "SyncPass Masaüstü",
    slogan: "Aynı kasa, Windows'ta",
    aciklama: "Android ile aynı şifreleme ve kasa biçimini kullanan Windows uygulaması. Üç sütunlu düzen, klavye kısayolları ve Windows pano geçmişine düşmeyen kopyalama. Chrome eklentisiyle giriş sayfalarını bu bilgisayardaki kasadan doldurur.",
    platform: "Windows",
    ikon: "Monitor",
    renk: "#8AB4FF",
    durum: "yayinda",
    url: DESKTOP_DOWNLOAD.url,
    cta: "Windows için ücretsiz indir",
    ekler: [
      { etiket: "Microsoft Store'dan indir", url: MS_STORE_URL },
      { etiket: "Ayrıntılar ve fiyatlar", url: "/syncpass-masaustu" },
      { etiket: "Chrome Web Mağazası'ndan eklenti", url: BROWSER_EXTENSION.chromeUrl },
    ],
    not: `Microsoft Store'da yayında. Bu sayfadaki doğrudan indirme sürümü ${DESKTOP_DOWNLOAD.version}. Edge eklentisi hazırlanıyor.`,
    en: {
      ad: "SyncPass Desktop",
      slogan: "The same vault, on Windows",
      aciklama: "The Windows version of SyncPass, with the same encryption and vault format as Android. Three-column layout, keyboard shortcuts and copying that stays out of Windows clipboard history. With the Chrome extension it fills sign-in pages from the vault on this computer.",
      platform: "Windows",
      cta: "Download the free version for Windows",
      ekler: [
        { etiket: "Get it from Microsoft Store", url: MS_STORE_URL },
        { etiket: "Details and pricing", url: "/en/syncpass-desktop" },
        { etiket: "Extension on the Chrome Web Store", url: BROWSER_EXTENSION.chromeUrl },
      ],
      not: `Available on Microsoft Store. The direct download on this page is version ${DESKTOP_DOWNLOAD.version}. An Edge extension is coming.`,
    },
  },
  {
    id: "areapilot",
    ad: "AreaPilot",
    slogan: "AutoCAD'de alan ve çevre metrajı",
    aciklama: "AutoCAD çizimindeki kapalı alanları bulur, kodlarını yanındaki yazıdan okur, alan ve çevreyi toplar; çizime yazar, tablo ekler, Excel'e aktarır. Windows, AutoCAD 2013-2027.",
    platform: "Windows (AutoCAD)",
    ikon: "Layers",
    renk: "#4C8DFF",
    durum: "yayinda",
    url: AREAPILOT.path,
    urlEn: AREAPILOT.enPath,
    cta: "AreaPilot'u dene (7 gün ücretsiz)",
    ekler: [{ etiket: "Videolar", url: "/areapilot#videolar" }],
    not: `Sürüm ${AREAPILOT.version}. İlk açılıştan itibaren ${AREAPILOT.trialDays} gün ücretsiz deneme, sonra ücretsiz modda ${AREAPILOT.freeLimit} alana kadar.`,
    en: {
      ad: "AreaPilot",
      slogan: "Area and perimeter takeoff in AutoCAD",
      aciklama: "Finds the closed areas in an AutoCAD drawing, reads their codes from the text next to them and totals area and perimeter; writes the results into the drawing, adds a table and exports to Excel. Windows, AutoCAD 2013–2027.",
      platform: "Windows (AutoCAD)",
      cta: `Try AreaPilot free for ${AREAPILOT.trialDays} days`,
      ekler: [{ etiket: "Videos", url: `${AREAPILOT.enPath}#videolar` }],
      not: `Version ${AREAPILOT.version}. Free for ${AREAPILOT.trialDays} days from first launch, then free mode for up to ${AREAPILOT.freeLimit} areas per run.`,
    },
  },
  {
    id: "diasync",
    ad: "SyncDia",
    slogan: "Sağlık ve Diyabet Takibinde Akıllı Senkronizasyon",
    aciklama: "Sağlık/Diyabet takibi odaklı bir senkronizasyon uygulamasıdır. Akıllı telefon uygulaması ile akıllı saat (Wear OS) arasında entegre çalışarak sağlık verilerinin anlık takibini ve güvenli senkronizasyonunu sağlar.",
    platform: "Android ve Wear OS (iOS ve macOS yakında)",
    ikon: "HeartPulse",
    gorsel: "/products/syncdia.png",
    renk: "#00F5D4",
    durum: "yakinda",
    url: null,
    en: {
      ad: "SyncDia",
      slogan: "Smart sync for health and diabetes tracking",
      aciklama: "A sync app focused on health and diabetes tracking. The phone app works together with a smartwatch (Wear OS) to follow health data in real time and keep it in sync securely.",
      platform: "Android and Wear OS (iOS and macOS coming soon)",
    },
  },
  {
    id: "cornertab",
    ad: "CornerTab",
    slogan: "Veresiye defterin telefonunda",
    aciklama: "Esnaf için veresiye defteri: müşteri ve tedarikçi hesaplarını, borç ve tahsilatları kaydeder, hesap ekstresini PDF olarak hazırlar. Defter cihazında şifreli saklanır; isteğe bağlı PIN ya da parmak izi kilidi ekleyebilir, şifreli yedek alabilirsin.",
    platform: "Android",
    ikon: "Store",
    renk: "#f59e0b",
    durum: "yayinda",
    url: CORNERTAB_PLAY_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Kullanım videosu", url: CORNERTAB.pagePath }, { etiket: "Gizlilik politikası", url: CORNERTAB.path }],
    en: {
      ad: "CornerTab",
      slogan: "Your credit ledger on your phone",
      aciklama: "A credit ledger for small shops: it records customer and supplier accounts, debts and payments, and prepares account statements as PDFs. The ledger is stored encrypted on your device; you can add an optional PIN or fingerprint lock and make encrypted backups.",
      platform: "Android",
      cta: "Get it on Google Play",
      ekler: [{ etiket: "How-to video", url: CORNERTAB.pageEnPath }, { etiket: "Privacy policy", url: CORNERTAB.enPath }],
    },
  },
  // Oyunlar: kısa açıklamalar canlı Play girişleriyle birebir (2026-11-06). Reklam içerirler; metinde "reklamsız" iddiası yok.
  // Reklam türü her oyunun gizlilik politikasındaki açıklamayla aynı (Google AdMob).
  {
    id: "oklar",
    ad: "Oklar",
    slogan: "Sakin ok bulmacası",
    aciklama: "Yolu açık oka dokun, kayarak çıksın. Sırayı bul, tahtayı boşalt. Zorunlu reklam yok: reklam yalnızca ipucu ya da ek can için video izlemeyi seçtiğinde oynar.",
    platform: "Android · Reklam içerir",
    reklam: "Reklam: isteğe bağlı ödüllü video (Google AdMob)",
    ikon: "Gamepad2",
    renk: "#34d399",
    durum: "yayinda",
    url: OKLAR_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/oklar/privacy" }],
    en: {
      ad: "Oklar",
      slogan: "A calm arrow puzzle",
      aciklama: "Tap an arrow whose path is clear and it slides out. Find the order and clear the board. An ad plays only when you choose to watch a video for a hint or an extra life.",
      platform: "Android · Contains ads",
      reklam: "Ads: optional rewarded videos (Google AdMob)",
      cta: "Get it on Google Play",
      ekler: [{ etiket: "Privacy policy", url: "/en/oklar/privacy" }],
    },
  },
  {
    id: "beepout",
    ad: "Beepout",
    slogan: "Otopark bulmacası",
    aciklama: "Araca dokun, yolu açıksa otoparktan çıksın. Sırayı bul, otoparkı boşalt.",
    platform: "Android · Reklam içerir",
    reklam: "Reklam: isteğe bağlı ödüllü video (Google AdMob)",
    ikon: "Gamepad2",
    renk: "#fbbf24",
    durum: "yayinda",
    url: BEEPOUT_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/otopark/privacy" }],
    en: {
      ad: "Beepout",
      slogan: "A parking lot puzzle",
      aciklama: "Tap a car and, if its way is clear, it drives out of the lot. Find the order and empty the lot.",
      platform: "Android · Contains ads",
      reklam: "Ads: optional rewarded videos (Google AdMob)",
      cta: "Get it on Google Play",
      ekler: [{ etiket: "Privacy policy", url: "/en/otopark/privacy" }],
    },
  },
  {
    id: "packle",
    ad: "Packle",
    slogan: "Blok bulmacası",
    aciklama: "Parçaları 8×8 tahtaya yerleştir, dolan satır ve sütunları temizle.",
    platform: "Android · Reklam içerir",
    reklam: "Reklam: ödüllü video ve oyun sonu reklamı (Google AdMob)",
    ikon: "Gamepad2",
    renk: "#60a5fa",
    durum: "yayinda",
    url: PACKLE_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/packle/privacy" }],
    en: {
      ad: "Packle",
      slogan: "A block puzzle",
      aciklama: "Place the pieces on the 8×8 board and clear full rows and columns.",
      platform: "Android · Contains ads",
      reklam: "Ads: rewarded videos and end-of-game ads (Google AdMob)",
      cta: "Get it on Google Play",
      ekler: [{ etiket: "Privacy policy", url: "/en/packle/privacy" }],
    },
  },
  {
    id: "hozeni",
    ad: "Hozeni",
    slogan: "Günlük Sudoku",
    aciklama: "Klasik 9×9 Sudoku: dört zorluk, günün bulmacası ve nedenini anlatan ipuçları.",
    platform: "Android · Reklam içerir",
    reklam: "Reklam: ödüllü video ve bulmaca sonu reklamı (Google AdMob)",
    ikon: "Gamepad2",
    renk: "#f472b6",
    durum: "yayinda",
    url: HOZENI_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/hozeni/privacy" }],
    en: {
      ad: "Hozeni",
      slogan: "Daily Sudoku",
      aciklama: "Classic 9×9 Sudoku: four difficulty levels, a daily puzzle and hints that explain why.",
      platform: "Android · Contains ads",
      reklam: "Ads: rewarded videos and end-of-puzzle ads (Google AdMob)",
      cta: "Get it on Google Play",
      ekler: [{ etiket: "Privacy policy", url: "/en/hozeni/privacy" }],
    },
  },
  {
    id: "projex",
    ad: "SyncSite",
    slogan: "Şantiyenin günlük ilerlemesi, bürodan ve sahadan tek yerde",
    aciklama: "Blok, kat ve mahal bazında plan ile gerçekleşeni izleyen şantiye programı. Sahadan günlük rapor (miktar, ekip, not, engel) girilir; masaüstü ve telefon internet gelince kendiliğinden eşitlenir.",
    platform: "Windows ve Android (iOS ve macOS yakında)",
    ikon: "Kanban",
    renk: "#a855f7",
    durum: "test",
    url: null,
    en: {
      ad: "SyncSite",
      slogan: "Daily site progress, in one place for the office and the field",
      aciklama: "A construction site app that compares planned and actual work by block, floor and room. Daily reports (quantity, crew, notes, blockers) are entered from the field; the desktop and phone apps sync automatically when they are connected.",
      platform: "Windows and Android (iOS and macOS coming soon)",
    },
  },
];
