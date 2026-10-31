import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MiniMarkdown, slug, splitSections } from "@/lib/mini-markdown";
import { readContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// İçerik: src/content/guvenlik-belgesi-tr.md (kaynak: OstlerTech\site-icerik\2026-10-31\guvenlik-belgesi-tr.md).
// Burak (belge), Zeynep (iddia) ve Defne (dil) 2026-10-31 bulguları işlendi; yayın Yasin onayı bekler. EN eşi: /en/security/whitepaper.
const PATH = "/guvenlik/sifreleme-belgesi";
const TITLE = "SyncPass güvenlik ve şifreleme belgesi";
const DESCRIPTION =
  "SyncPass kasanı teknik olarak nasıl korur: anahtar türetme, şifreleme biçimi, cihazından çıkan bilgiler, tehdit modeli ve bilinen sınırlar.";
const IMAGE = { url: "/og-image.png", width: 1200, height: 630 };

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH, languages: { tr: PATH, en: "/en/security/whitepaper" } },
  openGraph: { type: "article", siteName: "OstlerTech", locale: "tr_TR", url: `${SITE_URL}${PATH}`, title: TITLE, description: DESCRIPTION, images: [IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [IMAGE.url] },
};

export default function SifrelemeBelgesi() {
  const sections = splitSections(readContent("guvenlik-belgesi-tr.md"));
  const intro = sections.find((s) => !s.title);
  const parts = sections.filter((s) => s.title);
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <article lang="tr" className="max-w-3xl mx-auto px-5 pt-36 pb-24 space-y-6">
        <p className="eyebrow">Güvenlik</p>
        {intro && <MiniMarkdown source={intro.body} />}
        <p className="text-lg">
          <a href="/en/security/whitepaper" hrefLang="en" className="text-primary hover:text-primary-light">English version</a>
          {" · "}
          <a href="/guvenlik-acigi-bildir" className="text-primary hover:text-primary-light">Güvenlik açığı bildir</a>
        </p>
        <nav aria-label="Bölümler" className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-lg font-semibold text-white">Bu belgede</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2 text-lg">
            {parts.map((s) => (
              <li key={s.title}><a href={`#${slug(s.title)}`} className="inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">{s.title}</a></li>
            ))}
          </ol>
        </nav>
        {parts.map((s) => (
          <div key={s.title} className="space-y-5">
            <h2 id={slug(s.title)} className="scroll-mt-24 pt-6 text-3xl font-extrabold tracking-tight text-white">{s.title}</h2>
            <MiniMarkdown source={s.body} />
          </div>
        ))}
      </article>
      <Footer />
    </main>
  );
}
