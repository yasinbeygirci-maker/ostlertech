import { BEEPOUT_URL, BROWSER_EXTENSION, DESKTOP_DOWNLOAD, HOZENI_URL, MS_STORE_URL, OKLAR_URL, PACKLE_URL, PLAY_URL } from "./site";
import { AREAPILOT } from "./areapilot";
import { CORNERTAB } from "./cornertab";

// CornerTab Play bağlantısı (UTM: Play Console'da sitenin getirdiği edinmeler görünsün).
const CORNERTAB_PLAY_URL = CORNERTAB.playUrl;

// Ürün kartı. "yayinda" yalnız indirilebilen ürüne verilir; mağazaya çıkmamış ürün "test" ya da "yakinda" kalır.
export interface Urun {
  id: string;
  ad: string;
  slogan: string;
  aciklama: string;
  platform: string;
  ikon: string;
  /** Varsa Lucide ikonu yerine bu görsel (public yolu) kullanılır. */
  gorsel?: string;
  renk: string;
  durum: string;
  url: string | null;
  /** Ana düğmenin yazısı (yoksa durumdan). */
  cta?: string;
  /** Kartın altındaki küçük bağlantılar. */
  ekler?: { etiket: string; url: string }[];
  /** Düğmenin altındaki kısa not (sürüm, mağaza durumu). */
  not?: string;
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
    cta: "AreaPilot'u dene (7 gün ücretsiz)",
    ekler: [{ etiket: "Videolar", url: "/areapilot#videolar" }],
    not: `Sürüm ${AREAPILOT.version}. İlk açılıştan itibaren ${AREAPILOT.trialDays} gün ücretsiz deneme, sonra ücretsiz modda ${AREAPILOT.freeLimit} alana kadar.`,
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
  },
  // Oyunlar: kısa açıklamalar canlı Play girişleriyle birebir (2026-11-06). Reklam içerirler; metinde "reklamsız" iddiası yok.
  {
    id: "oklar",
    ad: "Oklar",
    slogan: "Sakin ok bulmacası",
    aciklama: "Yolu açık oka dokun, kayarak çıksın. Sırayı bul, tahtayı boşalt. Zorunlu reklam yok: reklam yalnızca ipucu ya da ek can için video izlemeyi seçtiğinde oynar.",
    platform: "Android · Reklam içerir",
    ikon: "Gamepad2",
    renk: "#34d399",
    durum: "yayinda",
    url: OKLAR_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/oklar/privacy" }],
  },
  {
    id: "beepout",
    ad: "Beepout",
    slogan: "Otopark bulmacası",
    aciklama: "Araca dokun, yolu açıksa otoparktan çıksın. Sırayı bul, otoparkı boşalt.",
    platform: "Android · Reklam içerir",
    ikon: "Gamepad2",
    renk: "#fbbf24",
    durum: "yayinda",
    url: BEEPOUT_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/otopark/privacy" }],
  },
  {
    id: "packle",
    ad: "Packle",
    slogan: "Blok bulmacası",
    aciklama: "Parçaları 8×8 tahtaya yerleştir, dolan satır ve sütunları temizle.",
    platform: "Android · Reklam içerir",
    ikon: "Gamepad2",
    renk: "#60a5fa",
    durum: "yayinda",
    url: PACKLE_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/packle/privacy" }],
  },
  {
    id: "hozeni",
    ad: "Hozeni",
    slogan: "Günlük Sudoku",
    aciklama: "Klasik 9×9 Sudoku: dört zorluk, günün bulmacası ve nedenini anlatan ipuçları.",
    platform: "Android · Reklam içerir",
    ikon: "Gamepad2",
    renk: "#f472b6",
    durum: "yayinda",
    url: HOZENI_URL,
    cta: "Google Play'den indir",
    ekler: [{ etiket: "Gizlilik politikası", url: "/hozeni/privacy" }],
  },
  {
    id: "projex",
    ad: "SyncSite",
    slogan: "Şantiyenin günlük ilerlemesi, bürodan ve sahadan tek yerde",
    aciklama: "Blok, kat ve mahal bazında plan ile gerçekleşeni izleyen şantiye takip programı. Sahadan günlük rapor (miktar, ekip, not, engel) girilir; masaüstü ve telefon internet gelince kendiliğinden eşitlenir.",
    platform: "Windows ve Android (iOS ve macOS yakında)",
    ikon: "Kanban",
    renk: "#a855f7",
    durum: "test",
    url: null,
  },
];
