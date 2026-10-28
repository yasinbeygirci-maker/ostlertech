import { BROWSER_EXTENSION, DESKTOP_DOWNLOAD, PLAY_URL } from "./site";
import { AREAPILOT } from "./areapilot";

// Ürün kartı. "yayinda" yalnız indirilebilen ürüne verilir; mağazaya çıkmamış ürün "test" ya da "yakinda" kalır.
export interface Urun {
  id: string;
  ad: string;
  slogan: string;
  aciklama: string;
  platform: string;
  ikon: string;
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
    slogan: "Şifreleriniz, kartlarınız ve 2FA kodlarınız cihazınızda",
    aciklama: "Hesap ve sunucu gerektirmeyen şifre yöneticisi. Kasa AES-256-GCM ve SQLCipher ile telefonda şifreli tutulur; otomatik doldurma, geçiş anahtarı, 2FA kodları ve dürüst bir güvenlik puanı sunar.",
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
    platform: "Android + Wear OS",
    ikon: "HeartPulse",
    renk: "#00F5D4",
    durum: "yakinda",
    url: null,
  },
  {
    id: "esnafcep",
    ad: "EsnafCep",
    slogan: "Küçük Esnaf ve KOBİ'ler İçin Pratik İşletme Yönetimi",
    aciklama: "Küçük esnaf ve KOBİ'lerin dijitalleşmesini, stok, cari hesap, satış ve gelir-gider takibini cep telefonlarından kolayca yapabilmelerini sağlayan pratik bir işletme yönetim aracıdır.",
    platform: "Android",
    ikon: "Store",
    renk: "#f59e0b",
    durum: "yakinda",
    url: null,
  },
  {
    id: "projex",
    ad: "SyncSite",
    slogan: "Şantiyenin günlük ilerlemesi, bürodan ve sahadan tek yerde",
    aciklama: "Blok, kat ve mahal bazında plan ile gerçekleşeni izleyen şantiye takip programı. Sahadan günlük rapor (miktar, ekip, not, engel) girilir; masaüstü ve telefon internet gelince kendiliğinden eşitlenir.",
    platform: "Windows + Android",
    ikon: "Kanban",
    renk: "#a855f7",
    durum: "test",
    url: null,
  },
];
