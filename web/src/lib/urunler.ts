import { BROWSER_EXTENSION, DESKTOP_DOWNLOAD, PLAY_URL } from "./site";
import { AREAPILOT } from "./areapilot";
import { CORNERTAB } from "./cornertab";

// CornerTab Play bağlantısı (UTM: Play Console'da sitenin getirdiği edinmeler görünsün).
const CORNERTAB_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.ostlertech.cornertab&referrer=utm_source%3Dsite%26utm_medium%3Durunler%26utm_campaign%3Dcornertab";

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
      { etiket: "Ayrıntılar ve fiyatlar", url: "/syncpass-masaustu" },
      { etiket: "Chrome Web Mağazası'ndan eklenti", url: BROWSER_EXTENSION.chromeUrl },
    ],
    not: `Sürüm ${DESKTOP_DOWNLOAD.version}. Microsoft Store sürümü ve Edge eklentisi hazırlanıyor.`,
  },
  {
    id: "areapilot",
    ad: "AreaPilot",
    slogan: "AutoCAD'de alan ve çevre metrajı",
    aciklama: "AutoCAD çizimindeki kapalı alanları bulur, oda adını kod olarak okur, alan ve çevreyi toplar; çizime yazar, tablo ekler, Excel'e aktarır. Windows, AutoCAD 2013-2027.",
    platform: "Windows (AutoCAD)",
    ikon: "Layers",
    renk: "#4C8DFF",
    durum: "beta",
    url: AREAPILOT.path,
    cta: "Beta'yı dene (30 gün ücretsiz)",
    ekler: [{ etiket: "Videolar", url: "/areapilot#videolar" }],
    not: `Açık beta, sürüm ${AREAPILOT.version}. Satış henüz açılmadı.`,
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
    ekler: [{ etiket: "Gizlilik politikası", url: CORNERTAB.path }],
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
