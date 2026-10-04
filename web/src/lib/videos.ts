// YouTube videoları. Yeni video yayınlanınca buraya eklenir; ana sayfa ilkini, /videolar hepsini gösterir.
export interface Video {
  id: string; // YouTube video kimliği
  title: string;
  description: string;
  poster: string; // yerel kapak: oynat'a basılana kadar YouTube'dan hiçbir şey yüklenmez
  duration: string; // ISO 8601 (yapısal veri için)
  durationLabel: string;
  uploadDate: string;
  product: "SyncPass" | "Projex" | "OstlerTech";
}

export const VIDEOS: Video[] = [
  {
    id: "LSGOdiPtpmM",
    title: "SyncPass'i 1 dakikada tanıyın",
    description:
      "Şifreler, kartlar ve 2FA kodları tek şifreli kasada. Hesap yok, sunucu yok; kasa telefonda AES-256 ile şifrelenir.",
    poster: "/videos/syncpass-tanitim.webp",
    duration: "PT57S",
    durationLabel: "0:57",
    uploadDate: "2026-09-29",
    product: "SyncPass",
  },
];
