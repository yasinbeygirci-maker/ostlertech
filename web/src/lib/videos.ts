// YouTube videoları. Yeni video yayınlanınca buraya eklenir; ana sayfa ilkini, /videolar ve /en/videos hepsini gösterir.
// dil: videonun seslendirme dili. Türkçe sayfalar Türkçe videoları gösterir; İngilizce sayfalar önce İngilizce videoları,
// İngilizcesi olmayan ürünlerde Türkçe videoyu "Türkçe" notuyla ve en alanındaki İngilizce başlıkla gösterir.
export interface Video {
  id: string; // YouTube video kimliği
  title: string;
  description: string;
  poster: string; // yerel kapak: oynat'a basılana kadar YouTube'dan hiçbir şey yüklenmez
  duration: string; // ISO 8601 (yapısal veri için)
  durationLabel: string;
  uploadDate: string;
  product: "SyncPass" | "SyncSite" | "OstlerTech" | "AreaPilot" | "CornerTab";
  dil: "tr" | "en";
  /** Türkçe video İngilizce sayfada gösterilirken başlık ve açıklama (US English). */
  en?: { title: string; description: string };
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
    dil: "tr",
    en: {
      title: "SyncPass in 1 minute",
      description:
        "Passwords, cards and 2FA codes in one vault. It is encrypted with AES-256 on your phone; we keep no copy of it on our servers.",
    },
  },
  {
    id: "YCgxinKeziA",
    title: "AreaPilot: AutoCAD'de alan ve çevre metrajı, saniyeler içinde",
    description:
      "Otel tip kat planında 76 alanı, yanındaki yazıdan okuduğu koda göre toplar, çizime yazar, tabloyu plana ekler, Excel'e aktarır. İlk açılıştan itibaren 7 gün ücretsiz deneme.",
    poster: "/videos/areapilot-tanitim.webp?v=20261108",
    duration: "PT1M2S",
    durationLabel: "1:02",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
    dil: "tr",
  },
  {
    id: "bpLvw27iesM",
    title: "AreaPilot kullanımı: AutoCAD'de otel katının alan ve çevre metrajı baştan sona",
    description:
      "Komut ve birim ayarı, Katmandan Seç, liste ve toplam, satıra tıklayınca odaların yanması, kod arama, İçine Tıkla, Kod seçimi, çizime yazma, tablo, Excel ve Dış kontur.",
    poster: "/videos/areapilot-kullanim.webp?v=20261108",
    duration: "PT2M45S",
    durationLabel: "2:45",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
    dil: "tr",
  },
  // İngilizce AreaPilot videoları: YouTube'da herkese açık (oEmbed + izleme sayfası 2026-11-08). Kapak YouTube küçük resminden
  // yerel kopya (kendi videomuz). Süreler izleme sayfasındaki lengthSeconds: 63 ve 185.
  {
    id: "rDErHEELats",
    title: "AreaPilot: area and perimeter takeoff in AutoCAD, in seconds",
    description:
      "On a typical hotel floor plan it totals 76 areas by the codes it reads from the text next to them, writes the results into the drawing, adds the table to the plan and exports to Excel. Free for 7 days from first launch.",
    poster: "/videos/areapilot-intro-en.webp?v=20261108",
    duration: "PT1M3S",
    durationLabel: "1:03",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
    dil: "en",
  },
  {
    id: "HxpTIv4bH9Y",
    title: "AreaPilot walkthrough: area and perimeter takeoff of a hotel floor in AutoCAD, start to finish",
    description:
      "Command and drawing unit, Select by Layer, list and totals, rooms lighting up when you click a row, code search, Click Inside, the Code source setting, Apply to Drawing, table, Excel and Outline.",
    poster: "/videos/areapilot-walkthrough-en.webp?v=20261108",
    duration: "PT3M5S",
    durationLabel: "3:05",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
    dil: "en",
  },
  {
    id: "A6AXJ7QkqEE",
    title: "CornerTab Veresiye Defteri Nasıl Kullanılır? Baştan Sona Rehber",
    description:
      "CornerTab'ı baştan sona gör: borç yazma, tahsilat alma, hatırlatma, ekstre, gün sonu ve yedek alma. Seslendirme ve altyazı Türkçe.",
    poster: "/videos/cornertab-kullanim.webp?v=20261108",
    duration: "PT2M37S",
    durationLabel: "2:37",
    uploadDate: "2026-10-31",
    product: "CornerTab",
    dil: "tr",
    en: {
      title: "How to use the CornerTab credit ledger, start to finish",
      description:
        "See CornerTab from start to finish: recording debts, collecting payments, reminders, statements, end-of-day totals and backups.",
    },
  },
];

/** Türkçe sayfalarda gösterilen videolar (Türkçe seslendirme). */
export const VIDEOS_TR = VIDEOS.filter((v) => v.dil === "tr");

/**
 * İngilizce sayfalarda gösterilen videolar: İngilizce seslendirmeli olanlar; o ürünün İngilizcesi yoksa Türkçe video,
 * İngilizce başlık/açıklamayla (title/description en alanından). turkce: sayfada "Türkçe" notu gösterilsin diye.
 */
export const VIDEOS_EN: (Video & { turkce: boolean })[] = VIDEOS.filter(
  (v) => v.dil === "en" || (v.en && !VIDEOS.some((o) => o.dil === "en" && o.product === v.product)),
).map((v) => (v.dil === "en" ? { ...v, turkce: false } : { ...v, title: v.en!.title, description: v.en!.description, turkce: true }));
