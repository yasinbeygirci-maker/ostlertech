import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MiniMarkdown, slug, splitSections } from "@/lib/mini-markdown";
import { readContent } from "@/lib/content";
import { DESKTOP_DOWNLOAD, PLAY_URL, SITE_URL } from "@/lib/site";

// İçerik: src/content/sifre-yoneticisi-karsilastirma.md (kaynak: OstlerTech\site-icerik\2026-10-31\karsilastirma-tr.md,
// scripts/icerik-esitle.mjs ile kopyalanır). Zeynep (hukuk) ve Defne (dil) 2026-10-31 bulguları işlendi; yayın Yasin onayı bekler.
const PATH = "/sifre-yoneticisi-karsilastirma";
const TITLE = "Şifre yöneticisi karşılaştırması: SyncPass";
const DESCRIPTION =
  "Bitwarden, KeePassXC, 1Password, Proton Pass, Dashlane ve SyncPass yan yana: platform, kasa yeri, ücretsiz sürüm, denetim. Eksikler de yazılı.";
const IMAGE = { url: "/og-image.png", width: 1200, height: 630 };

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH, languages: { tr: PATH, en: "/en/password-manager-comparison" } },
  openGraph: { type: "article", siteName: "OstlerTech", locale: "tr_TR", url: `${SITE_URL}${PATH}`, title: TITLE, description: DESCRIPTION, images: [IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [IMAGE.url] },
};

type Faq = { q: string; a: string };

/** "**Soru**\nCevap" çiftlerini ayırır; cevap içindeki biçim işaretleri şemada düz metne çevrilir. */
function parseFaq(body: string): Faq[] {
  return body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const [first, ...rest] = b.split("\n");
    return { q: first.replace(/^\*\*|\*\*$/g, "").trim(), a: rest.join(" ").replace(/\*\*/g, "").trim() };
  });
}

export default function SifreYoneticisiKarsilastirma() {
  const sections = splitSections(readContent("sifre-yoneticisi-karsilastirma.md"));
  const intro = sections.find((s) => !s.title);
  const faqSection = sections.find((s) => s.title === "Sık sorulan sorular");
  const faqs = faqSection ? parseFaq(faqSection.body) : [];
  const rest = sections.filter((s) => s.title && s !== faqSection);
  const callIdx = rest.findIndex((s) => s.title === "Çağrı");

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "tr",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const tokens = {
    PLAY: <a href={PLAY_URL} className="btn-primary !py-3.5" rel="noopener">Google Play&apos;den SyncPass&apos;i indir</a>,
    WINDOWS: <a href={DESKTOP_DOWNLOAD.url} className="btn-secondary !py-3.5">Windows için indir</a>,
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Navbar />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Karşılaştırma</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Şifre yöneticisi karşılaştırması: Bitwarden, KeePassXC, SyncPass ve diğerleri
          </h1>
          {intro && <MiniMarkdown source={intro.body} />}
        </div>
      </section>

      <section className="section-padding border-t border-line !pt-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {rest.map((s, idx) => (
            <div key={s.title} className="space-y-5">
              {s.title !== "Çağrı" && (
                <h2 id={slug(s.title)} className="scroll-mt-24 pt-6 text-3xl font-extrabold tracking-tight text-white">{s.title}</h2>
              )}
              <MiniMarkdown source={s.body} tokens={tokens} highlightRow="SyncPass" headingIds={false} />
              {idx === callIdx && faqs.length > 0 && (
                <div className="pt-8 space-y-5">
                  <h2 id="sik-sorulan-sorular" className="scroll-mt-24 text-3xl font-extrabold tracking-tight text-white">Sık sorulan sorular</h2>
                  <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
                    {faqs.map((f) => (
                      <details key={f.q} className="group px-6 py-5">
                        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-white">
                          {f.q}<span className="text-muted transition-transform group-open:rotate-45 text-2xl leading-none" aria-hidden="true">+</span>
                        </summary>
                        <p className="mt-3 text-lg text-muted leading-relaxed">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
