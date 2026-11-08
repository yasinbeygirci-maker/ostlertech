import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import YouTubeFacade, { YOUTUBE_NOTE_EN } from "@/components/YouTubeFacade";
import { VIDEOS_EN } from "@/lib/videos";
import { SITE_URL, YOUTUBE_URL } from "@/lib/site";

// English counterpart of /videolar. Videos come from lib/videos.ts: English-narrated ones first-class,
// Turkish-only ones with an English title and a "Narrated in Turkish" note.
export const metadata: Metadata = {
  title: "Videos",
  description: "Intro and how-to videos for SyncPass, AreaPilot and other OstlerTech apps.",
  alternates: { canonical: "/en/videos", languages: { tr: "/videolar", en: "/en/videos" } },
};

const jsonLd = VIDEOS_EN.map((v) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.title,
  description: v.description,
  thumbnailUrl: `${SITE_URL}${v.poster}`,
  uploadDate: v.uploadDate,
  duration: v.duration,
  embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
  contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
  inLanguage: v.dil,
  publisher: { "@type": "Organization", name: "OstlerTech", url: SITE_URL },
}));

export default function VideosPageEn() {
  return (
    <main lang="en" className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EnHeader trHref="/videolar" />
      <section className="section-padding !pt-36">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-3 mb-12">
            <p className="eyebrow">Videos</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Learn by watching</h1>
            <p className="text-muted max-w-2xl">
              Short intros and step-by-step videos for our apps. New videos are on{" "}
              <a href={YOUTUBE_URL} target="_blank" rel="noopener" className="text-primary hover:text-primary-light">
                our YouTube channel
              </a>
              .
            </p>
          </div>

          <div className="grid gap-12">
            {VIDEOS_EN.map((v, i) => (
              <article key={v.id} className="space-y-4">
                <YouTubeFacade video={v} lang="en" priority={i === 0} />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{v.product}</span>
                  <h2 className="text-xl font-bold text-white">{v.title}</h2>
                  <span className="text-sm text-muted">{v.durationLabel}</span>
                  {v.turkce && <span className="text-sm text-muted">· Narrated in Turkish</span>}
                </div>
                <p className="text-muted leading-relaxed">{v.description}</p>
              </article>
            ))}
          </div>

          <p className="mt-12 text-xs text-muted">{YOUTUBE_NOTE_EN}</p>
        </div>
      </section>
      <EnFooter />
    </main>
  );
}
