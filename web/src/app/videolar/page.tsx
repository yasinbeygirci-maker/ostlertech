import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YouTubeFacade, { YOUTUBE_NOTE } from "@/components/YouTubeFacade";
import { VIDEOS } from "@/lib/videos";
import { SITE_URL, YOUTUBE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Videolar",
  description: "SyncPass ve diğer OstlerTech uygulamalarının tanıtım ve nasıl yapılır videoları.",
  alternates: { canonical: "/videolar" },
};

const jsonLd = VIDEOS.map((v) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.title,
  description: v.description,
  thumbnailUrl: `${SITE_URL}${v.poster}`,
  uploadDate: v.uploadDate,
  duration: v.duration,
  embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
  contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
  inLanguage: "tr",
  publisher: { "@type": "Organization", name: "OstlerTech", url: SITE_URL },
}));

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <section className="section-padding !pt-36">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-3 mb-12">
            <p className="eyebrow">Videolar</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">İzleyerek öğrenin</h1>
            <p className="text-muted max-w-2xl">
              Uygulamalarımızın kısa tanıtımları ve adım adım kullanım videoları. Yeni videolar{" "}
              <a href={YOUTUBE_URL} target="_blank" rel="noopener" className="text-primary hover:text-primary-light">
                YouTube kanalımızda
              </a>
              .
            </p>
          </div>

          <div className="grid gap-12">
            {VIDEOS.map((v, i) => (
              <article key={v.id} className="space-y-4">
                <YouTubeFacade video={v} priority={i === 0} />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">{v.product}</span>
                  <h2 className="text-xl font-bold text-white">{v.title}</h2>
                  <span className="text-sm text-muted">{v.durationLabel}</span>
                </div>
                <p className="text-muted leading-relaxed">{v.description}</p>
              </article>
            ))}
          </div>

          <p className="mt-12 text-xs text-muted">{YOUTUBE_NOTE}</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
