import { VIDEOS_EN, VIDEOS_TR } from "@/lib/videos";
import YouTubeFacade, { YOUTUBE_NOTE, YOUTUBE_NOTE_EN } from "./YouTubeFacade";

const T = {
  tr: {
    baslik: "SyncPass'i 1 dakikada tanı",
    giris: "Kasa, arama, 2FA kodları, güvenlik puanı ve verinin neden telefonundan çıkmadığı.",
    not: YOUTUBE_NOTE,
    tum: { href: "/videolar", label: "Tüm videolar →" },
  },
  en: {
    baslik: "SyncPass in 1 minute",
    giris: "The vault, search, 2FA codes, the security score and why your data stays on your phone. Narration is in Turkish.",
    not: YOUTUBE_NOTE_EN,
    tum: { href: "/en/videos", label: "All videos →" },
  },
};

// Ana sayfadaki "1 dakikada SyncPass" bölümü: en yeni SyncPass videosu.
export default function VideoSection({ lang = "tr" }: { lang?: "tr" | "en" }) {
  const video = (lang === "en" ? VIDEOS_EN : VIDEOS_TR).find((v) => v.product === "SyncPass");
  if (!video) return null;
  const t = T[lang];

  return (
    <section id="video" className="section-padding !pt-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <p className="eyebrow">Video</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-white">{t.baslik}</h2>
          <p className="text-muted max-w-2xl mx-auto">{t.giris}</p>
        </div>
        <YouTubeFacade video={video} lang={lang} />
        <p className="mt-4 text-center text-sm text-muted">
          {t.not}{" "}
          <a href={t.tum.href} className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">{t.tum.label}</a>
        </p>
      </div>
    </section>
  );
}
