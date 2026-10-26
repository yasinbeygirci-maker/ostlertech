// YouTube videoları. Yeni video yayınlanınca buraya eklenir; ana sayfa ilkini, /videolar hepsini gösterir.
export interface Video {
  id: string; // YouTube video kimliği
  title: string;
  description: string;
  poster: string; // yerel kapak: oynat'a basılana kadar YouTube'dan hiçbir şey yüklenmez
  duration: string; // ISO 8601 (yapısal veri için)
  durationLabel: string;
  uploadDate: string;
  product: "SyncPass" | "Projex" | "OstlerTech" | "AreaPilot";
  lang?: "tr" | "en"; // anlatım dili; yoksa Türkçe
}

export const VIDEOS: Video[] = [
  {
    id: "LSGOdiPtpmM",
    title: "SyncPass'i 1 dakikada tanıyın",
    description:
      "Şifreler, kartlar ve 2FA kodları tek şifreli kasada. Hesap yok, sunucu yok; kasa telefonda AES-256 ile şifrelenir.",
    poster: "/videos/syncpass-tanitim.webp?v=20261018", // kapak 2026-10-18: örnek kişi Deniz
    duration: "PT57S",
    durationLabel: "0:57",
    uploadDate: "2026-09-29",
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
  {
    id: "rDErHEELats",
    title: "AreaPilot: area and perimeter takeoff in AutoCAD, in seconds (open beta)",
    description:
      "On a typical hotel floor plan, AreaPilot adds up 76 areas by room name, writes them into the drawing, inserts the table and exports to Excel. Open beta, 30-day trial from first launch.",
    poster: "/videos/areapilot-tanitim-en.jpg?v=20261025",
    duration: "PT1M3S",
    durationLabel: "1:03",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
    lang: "en",
  },
  {
    id: "HxpTIv4bH9Y",
    title: "AreaPilot walkthrough: area and perimeter takeoff of a hotel floor in AutoCAD, start to finish",
    description:
      "Command and drawing unit, Select by Layer, list and totals, clicking a row to light up rooms, code search, Click Inside, Code source, writing to the drawing, table, Excel and Outline.",
    poster: "/videos/areapilot-kullanim-en.jpg?v=20261025",
    duration: "PT3M5S",
    durationLabel: "3:05",
    uploadDate: "2026-10-25",
    product: "AreaPilot",
    lang: "en",
  },
  {
    id: "AVBi7G3lB-s",
    title: "AreaPilot: AutoCAD'de cam cephe metrajı, camları koda göre toplayın (açık beta)",
    description:
      "Örnek cam cephe setinde (6 görünüş, 1224 cam): vizyon camı GL, spandrel camı SP kodu alır; 21 kod, toplam 3199,32 m². Bir koda tıklayınca o camlar cephede yanar, kodlar ve alanlar cama yazılır, sonuç Excel'e aktarılır.",
    poster: "/videos/areapilot-cephe-tr.jpg?v=20261026",
    duration: "PT1M",
    durationLabel: "1:00",
    uploadDate: "2026-10-26",
    product: "AreaPilot",
  },
  {
    id: "rfVm9o9jh-U",
    title: "AreaPilot: glass facade takeoff in AutoCAD, group panels by size code (open beta)",
    description:
      "On a sample glass facade set (6 elevations, 1224 panels): vision glass gets GL codes, spandrel glass SP codes; 21 codes, 3199.32 m² in total. Click a code and those panels light up on the facade, codes and areas are written on each panel, and the result exports to Excel.",
    poster: "/videos/areapilot-cephe-en.jpg?v=20261026",
    duration: "PT1M",
    durationLabel: "1:00",
    uploadDate: "2026-10-26",
    product: "AreaPilot",
    lang: "en",
  },
];
