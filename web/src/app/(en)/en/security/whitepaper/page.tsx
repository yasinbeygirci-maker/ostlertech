import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { MiniMarkdown, slug, splitSections } from "@/lib/mini-markdown";
import { readContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Content: src/content/guvenlik-belgesi-en.md (source: OstlerTech\site-icerik\2026-10-31\guvenlik-belgesi-en.md).
// Burak (document), Zeynep (claims) and Defne (language) findings of 2026-10-31 applied; publishing waits for Yasin. TR twin: /guvenlik/sifreleme-belgesi.
const PATH = "/en/security/whitepaper";
const TITLE = "SyncPass security and encryption whitepaper";
const DESCRIPTION =
  "How SyncPass protects your vault at a technical level: key derivation, encryption format, what leaves your device, the threat model and known limits.";
const IMAGE = { url: "/og-image.png", width: 1200, height: 630 };

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH, languages: { tr: "/guvenlik/sifreleme-belgesi", en: PATH } },
  openGraph: { type: "article", siteName: "OstlerTech", locale: "en_US", url: `${SITE_URL}${PATH}`, title: TITLE, description: DESCRIPTION, images: [IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [IMAGE.url] },
};

export default function Whitepaper() {
  const sections = splitSections(readContent("guvenlik-belgesi-en.md"));
  const intro = sections.find((s) => !s.title);
  const parts = sections.filter((s) => s.title);
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <EnHeader trHref="/guvenlik/sifreleme-belgesi" />
      <article className="max-w-3xl mx-auto px-5 pt-36 pb-24 space-y-6">
        <p className="eyebrow">Security</p>
        {intro && <MiniMarkdown source={intro.body} lang="en" />}
        <p className="text-lg">
          <a href="/guvenlik/sifreleme-belgesi" hrefLang="tr" lang="tr" className="text-primary hover:text-primary-light">Türkçe sürüm</a>
          {" · "}
          <a href="/en/report-vulnerability" className="text-primary hover:text-primary-light">Report a vulnerability</a>
        </p>
        <nav aria-label="Sections" className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-lg font-semibold text-white">In this document</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2 text-lg">
            {parts.map((s) => (
              <li key={s.title}><a href={`#${slug(s.title)}`} className="inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">{s.title}</a></li>
            ))}
          </ol>
        </nav>
        {parts.map((s) => (
          <div key={s.title} className="space-y-5">
            <h2 id={slug(s.title)} className="scroll-mt-24 pt-6 text-3xl font-extrabold tracking-tight text-white">{s.title}</h2>
            <MiniMarkdown source={s.body} lang="en" />
          </div>
        ))}
      </article>
      <EnFooter />
    </main>
  );
}
