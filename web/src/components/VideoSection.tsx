import { VIDEOS } from "@/lib/videos";
import YouTubeFacade, { YOUTUBE_NOTE } from "./YouTubeFacade";

// Ana sayfadaki "1 dakikada SyncPass" bölümü: en yeni SyncPass videosu.
export default function VideoSection() {
  const video = VIDEOS.find((v) => v.product === "SyncPass");
  if (!video) return null;

  return (
    <section id="video" className="section-padding !pt-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <p className="eyebrow">Video</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">SyncPass'i 1 dakikada tanıyın</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Kasa, arama, 2FA kodları, güvenlik puanı ve verinizin neden telefonunuzdan çıkmadığı.
          </p>
        </div>
        <YouTubeFacade video={video} />
        <p className="mt-4 text-center text-xs text-muted">
          {YOUTUBE_NOTE}{" "}
          <a href="/videolar" className="text-primary hover:text-primary-light">Tüm videolar →</a>
        </p>
      </div>
    </section>
  );
}
