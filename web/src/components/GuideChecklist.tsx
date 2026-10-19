// Yorum mıknatısı rehberleri (güvenlik kontrol listesi, 7 günlük plan) için ortak düzen. TR ve EN sayfalar yalnızca
// metni verir. Form, e-posta alanı ve çerez yok; işaret kutuları yalnızca tarayıcıda durur, hiçbir yere gönderilmez.
// Metinler Deniz'in 2026-10-19 onaylı brifinden (pazarlama/2026-10-19-liste-plan-reels.md bölüm 3 ve 4).
import type { Metadata } from "next";
import { Download } from "lucide-react";
import { SCREENS_VERSION, SITE_URL } from "@/lib/site";

// Sayfa metaverisi: openGraph/twitter kök düzenden birleşmez, yazılınca görsel ve başlık da burada verilmeli
// (yoksa paylaşımda ana sayfanın başlığı ve görselsiz kart çıkar).
export function guideMetadata(o: { path: string; trPath: string; enPath: string; lang: "tr" | "en"; title: string; description: string }): Metadata {
  const image = { url: `/og-image.png?v=${SCREENS_VERSION}`, width: 1200, height: 630 };
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: o.path, languages: { tr: o.trPath, en: o.enPath } },
    openGraph: {
      type: "article",
      siteName: "OstlerTech",
      locale: o.lang === "tr" ? "tr_TR" : "en_US",
      url: `${SITE_URL}${o.path}`,
      title: o.title,
      description: o.description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: o.title, description: o.description, images: [image.url] },
  };
}

export type SourceKey = "NIST" | "CISA" | "Google";

export type GuideItem = {
  heading: string;
  lines: string[];
  sources?: SourceKey[];
  syncpass?: string;
};

type Lang = "tr" | "en";

const SOURCES: Record<Lang, { key: SourceKey; name: string; url: string; note?: string }[]> = {
  tr: [
    {
      key: "NIST",
      name: "NIST SP 800-63B-4, Digital Identity Guidelines: Authentication",
      url: "https://pages.nist.gov/800-63-4/sp800-63b.html",
      note: "en az 15 karakter; düzenli zorunlu değiştirme yok; sızıntı listesi denetimi; SMS “kısıtlı”; şifre yöneticisine izin",
    },
    {
      key: "CISA",
      name: "CISA, Secure Our World",
      url: "https://www.cisa.gov/secure-our-world",
      note: "güçlü şifre, çok adımlı doğrulama + şifre yöneticisi, güncelleme, oltalamayı tanıma",
    },
    {
      key: "Google",
      name: "Google Hesabı Yardım, Kurtarma seçenekleri ayarlama",
      url: "https://support.google.com/accounts/answer/183723?hl=tr",
    },
    {
      key: "Google",
      name: "Android Yardım, Kaybedilen bir Android cihazı bulma, kilitleme veya silme",
      url: "https://support.google.com/android/answer/6160491?hl=tr",
    },
    {
      key: "Google",
      name: "Google Hesabı Yardım, Yedek kodlarla oturum açma",
      url: "https://support.google.com/accounts/answer/1187538?hl=tr",
    },
  ],
  en: [
    { key: "NIST", name: "NIST SP 800-63B-4, Digital Identity Guidelines: Authentication", url: "https://pages.nist.gov/800-63-4/sp800-63b.html" },
    { key: "CISA", name: "CISA, Secure Our World", url: "https://www.cisa.gov/secure-our-world" },
    { key: "Google", name: "Google Account Help, Set up recovery options", url: "https://support.google.com/accounts/answer/183723?hl=en" },
    { key: "Google", name: "Android Help, Find, secure, or erase a lost Android device", url: "https://support.google.com/android/answer/6160491?hl=en" },
    { key: "Google", name: "Google Account Help, Sign in with backup codes", url: "https://support.google.com/accounts/answer/1187538?hl=en" },
  ],
};

const UI: Record<Lang, { pdf: string; syncpass: string; sources: string; sourcesId: string; free: string }> = {
  tr: { pdf: "PDF olarak indir", syncpass: "SyncPass'te:", sources: "Kaynaklar (erişim 19.10.2026)", sourcesId: "kaynaklar", free: "15 kayda kadar ücretsiz" },
  en: { pdf: "Download as PDF", syncpass: "SyncPass:", sources: "Sources (accessed 19 Oct 2026)", sourcesId: "sources", free: "free for up to 15 items" },
};

export default function GuideChecklist({
  lang,
  label,
  title,
  sub,
  pdfHref,
  items,
  after,
  ctaLabel,
  ctaHref,
  disclaimer,
  related,
  numbered = true,
}: {
  lang: Lang;
  label: string;
  title: string;
  sub: string;
  pdfHref: string;
  items: GuideItem[];
  after?: string;
  ctaLabel: string;
  ctaHref: string;
  disclaimer: string;
  related: { href: string; label: string };
  numbered?: boolean;
}) {
  const ui = UI[lang];
  return (
    <>
      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-primary font-semibold text-sm">{label}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{title}</h1>
          <p className="text-lg text-muted leading-relaxed">{sub}</p>
          <a href={pdfHref} download className="btn-secondary !py-3 inline-flex items-center gap-2">
            <Download size={16} /> {ui.pdf}
          </a>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <ol className="max-w-3xl mx-auto space-y-4">
          {items.map((it, i) => (
            <li key={it.heading} className="rounded-2xl border border-line bg-surface p-5 md:p-6">
              <label className="flex gap-4 cursor-pointer">
                <input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-primary" />
                <span className="space-y-2 min-w-0">
                  <span className="flex gap-3 items-baseline">
                    {numbered && <span className="text-primary font-bold tabular-nums">{i + 1}</span>}
                    <span className="text-lg font-bold text-white leading-snug">{it.heading}</span>
                  </span>
                  {it.lines.length === 1 ? (
                    <span className="block text-muted leading-relaxed">
                      {it.lines[0]}
                      {it.sources?.map((s) => (
                        <a key={s} href={`#${ui.sourcesId}`} className="ml-1.5 text-sm text-primary hover:text-primary-light">[{s}]</a>
                      ))}
                    </span>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1.5 text-muted leading-relaxed">
                      {it.lines.map((l) => <li key={l}>{l}</li>)}
                    </ul>
                  )}
                  {it.syncpass && (
                    <span className="block text-sm text-foreground">
                      <strong className="text-white">{ui.syncpass}</strong> {it.syncpass}
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ol>
        {after && (
          <p className="max-w-3xl mx-auto mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-foreground leading-relaxed">{after}</p>
        )}
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 md:p-10 space-y-3 text-center">
          <a href={ctaHref} className="btn-primary !py-3.5" rel="noopener">{ctaLabel} →</a>
          <p className="text-sm text-muted">{ui.free}</p>
        </div>
      </section>

      <section id={ui.sourcesId} className="section-padding border-t border-line scroll-mt-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{ui.sources}</h2>
          <ul className="space-y-3 text-sm text-muted leading-relaxed">
            {SOURCES[lang].map((s) => (
              <li key={s.url}>
                <a href={s.url} className="text-primary hover:text-primary-light break-words" rel="noopener" target="_blank">{s.name}</a>
                {s.note && <> ({s.note})</>}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted pt-4">{disclaimer}</p>
          <p className="text-sm text-muted">
            <a href={related.href} className="text-primary hover:text-primary-light">{related.label}</a>
          </p>
        </div>
      </section>
    </>
  );
}
