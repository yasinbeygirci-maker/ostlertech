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
    url: "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass",
  },
  {
    id: "syncpassdesktop",
    ad: "SyncPass Masaüstü",
    slogan: "Aynı kasa, Windows'ta",
    aciklama: "Android ile aynı şifreleme ve kasa biçimini kullanan Windows uygulaması. Üç sütunlu düzen, klavye kısayolları ve Windows pano geçmişine düşmeyen kopyalama.",
    platform: "Windows",
    ikon: "Monitor",
    renk: "#8AB4FF",
    durum: "test",
    url: "/#masaustu",
  },
  {
    id: "diasync",
    ad: "DiaSync",
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
    ad: "Projex",
    slogan: "Yüksek Performanslı Proje ve Görev Yönetim Sistemi",
    aciklama: "Proje ve görev yönetim sistemidir. Compose Multiplatform altyapısı sayesinde hem masaüstü (Projex.exe) hem de çapraz platformda yüksek performanslı bir çalışma alanı sunar.",
    platform: "Compose Multiplatform",
    ikon: "Kanban",
    renk: "#a855f7",
    durum: "yakinda",
    url: null,
  },
];
