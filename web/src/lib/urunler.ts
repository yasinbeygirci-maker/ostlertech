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
  {
    id: "syncpass",
    ad: "SyncPass",
    slogan: "Güvenli Kasa ve Bulut Senkronizasyonlu Şifre Yöneticisi",
    aciklama: "Kullanıcıların hassas verilerini ve şifrelerini güvenli bir kasada (vault.dat, bulut senkronizasyon özellikleri) saklayan, modern arayüze ve güvenlik mekanizmalarına sahip bir şifre yöneticisidir.",
    platform: "Android",
    ikon: "ShieldCheck",
    renk: "#3b82f6",
    durum: "yakinda",
    url: null,
  },
  {
    id: "syncpassdesktop",
    ad: "SyncPassDesktop",
    slogan: "Masaüstü Ortamında Güvenli Şifre Kası Yönetimi",
    aciklama: "SyncPass ekosisteminin masaüstü uzantısıdır. JVM üzerinde çalışarak masaüstü ortamında şifre kasalarına güvenli erişim ve yönetim imkanı tanır.",
    platform: "JVM Desktop",
    ikon: "Monitor",
    renk: "#00D1B5",
    durum: "yakinda",
    url: null,
  },
];
