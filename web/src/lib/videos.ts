// YouTube videoları. Yeni video yayınlanınca buraya eklenir; ana sayfa ilkini, /videolar hepsini gösterir.
export interface Video {
  id: string; // YouTube video kimliği
  title: string;
  description: string;
  poster: string; // yerel kapak: oynat'a basılana kadar YouTube'dan hiçbir şey yüklenmez
  duration: string; // ISO 8601 (yapısal veri için)
  durationLabel: string;
  uploadDate: string;
  product: "SyncPass" | "SyncSite" | "OstlerTech" | "AreaPilot";
}

export const VIDEOS: Video[] = [
  {
    id: "T0E4S781Q0k",
    title: "SyncPass'i 1 dakikada tanı",
    description:
      "Şifreler, kartlar ve 2FA kodları tek şifreli kasada. Kasa telefonda AES-256 ile şifrelenir; kopyası sunucularımızda tutulmaz.",
    poster: "/videos/syncpass-tanitim.webp?v=20261030", // kapak 2026-10-30: yeni logo, Deniz örnek verisi
    duration: "PT59S",
    durationLabel: "0:59",
    uploadDate: "2026-10-30",
    product: "SyncPass",
  },
  {
    id: "YCgxinKeziA",
    title: "AreaPilot: AutoCAD'de alan ve çevre metrajı, saniyeler içinde (açık beta)",
    description:
      "Otel tip kat planında 76 alanı oda adına göre toplar, çizime yazar, tabloyu plana ekler, Excel'e aktarır. Açık beta, ilk açılıştan itibaren 30 gün deneme.",
    poster: "/videos/areapilot-tanitim.jpg?v=20261025",
    duration: "PT1M2S",
    durationLabel: "1:02",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
  },
  {
    id: "bpLvw27iesM",
    title: "AreaPilot kullanımı: AutoCAD'de otel katının alan ve çevre metrajı baştan sona",
    description:
      "Komut ve birim ayarı, Katmandan Seç, liste ve toplam, satıra tıklayınca odaların yanması, kod arama, İçine Tıkla, Kod seçimi, çizime yazma, tablo, Excel ve Dış kontur.",
    poster: "/videos/areapilot-kullanim.jpg?v=20261025",
    duration: "PT2M45S",
    durationLabel: "2:45",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
  },
];
