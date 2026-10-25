import { AlertTriangle, Check, Mail, ShieldCheck } from "lucide-react";
import BetaDownloadForm from "@/components/BetaDownloadForm";
import { SellerBlock } from "@/components/LegalPage";
import { AREAPILOT } from "@/lib/areapilot";
import { AREAPILOT_COPY, type Lang } from "@/lib/areapilot-content";
import YouTubeFacade from "@/components/YouTubeFacade";
import { VIDEOS } from "@/lib/videos";

// AreaPilot açık beta sayfasının gövdesi (TR ve EN aynı yapı). Üst çubuk/alt bilgi sayfa dosyasında.
// Görseller (Deniz [GORSEL-1..5]) henüz yok: nötr örnek çizimden ekran görüntüsü gelince eklenir; yer tutucu gösterilmez.
export default function AreaPilotLanding({ lang }: { lang: Lang }) {
  const c = AREAPILOT_COPY[lang];
  const privacyHref = lang === "tr" ? AREAPILOT.privacyHref : AREAPILOT.privacyHrefEn;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AreaPilot",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "AutoCAD plugin",
    operatingSystem: "Windows 10, Windows 11",
    softwareVersion: AREAPILOT.version,
    description: c.description,
    inLanguage: lang,
    url: `https://www.ostlertech.com${lang === "tr" ? AREAPILOT.path : AREAPILOT.enPath}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "TRY", description: lang === "tr" ? "Açık beta, ilk açılıştan itibaren 30 gün ücretsiz deneme" : "Open beta, free trial for 30 days from first launch" },
    publisher: { "@type": "Organization", name: "OstlerTech", url: "https://www.ostlertech.com" },
  };
  const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2 id={id} className="scroll-mt-28 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
      {children}
    </h2>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <p className="eyebrow">{c.badge}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{c.h1}</h1>
            <p className="text-lg text-foreground leading-relaxed font-semibold">{c.lead}</p>
            <p className="text-muted leading-relaxed">{c.sub}</p>
            <a href="#indir" className="btn-primary inline-flex !py-3.5 text-base">
              {c.cta}
            </a>
            <p className="text-sm text-muted">{c.ctaNote}</p>
          </div>
          <aside id="indir" className="scroll-mt-28 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-white">{c.form.title}</h2>
            <p className="mt-1 mb-5 text-sm text-muted">{c.form.sub}</p>
            <BetaDownloadForm copy={c.form} lang={lang} privacyHref={privacyHref} />
          </aside>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-6xl mx-auto space-y-8">
          <H2>{c.featuresTitle}</H2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.features.map((f) => (
              <div key={f.h} className="rounded-2xl border border-line bg-card p-6">
                <h3 className="font-bold text-white">{f.h}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{f.p}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">{c.languages}</p>
        </div>
      </section>

      <section id="videolar" className="section-padding border-t border-line">
        <div className="max-w-6xl mx-auto space-y-8">
          <H2>{lang === "tr" ? "Videolar" : "Videos"}</H2>
          <p className="text-sm text-muted">
            {lang === "tr"
              ? "Kısa tanıtım ve adım adım kullanım. Seslendirme ve altyazı Türkçe."
              : "A short intro and a step-by-step walkthrough. Narration and subtitles are in Turkish; English versions are coming."}
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            {VIDEOS.filter((v) => v.product === "AreaPilot").map((v) => (
              <article key={v.id} className="space-y-3">
                <YouTubeFacade video={v} />
                <h3 className="font-bold text-white">{v.title}</h3>
                <p className="text-sm text-muted">{v.durationLabel}</p>
              </article>
            ))}
          </div>
          <p className="text-xs text-muted">
            {lang === "tr"
              ? "Oynat'a bastığınızda video YouTube'dan (youtube-nocookie.com) yüklenir."
              : "When you press play, the video loads from YouTube (youtube-nocookie.com)."}
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <H2>{c.howTitle}</H2>
            <ol className="space-y-4">
              {c.how.map((s, i) => (
                <li key={s.h} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">{i + 1}</span>
                  <p className="text-foreground">
                    <strong className="text-white">{s.h}</strong> {s.p}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-6">
            <H2>{c.reqTitle}</H2>
            <ul className="space-y-3">
              {c.req.map((r, i) => (
                <li key={r} className="flex gap-3 text-foreground">
                  {i === 3 ? <AlertTriangle size={18} className="mt-1 shrink-0 text-weak" /> : <Check size={18} className="mt-1 shrink-0 text-ok" />}
                  <span className={i === 3 ? "font-semibold text-white" : ""}>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <H2>{c.betaTitle}</H2>
          <p className="text-foreground leading-relaxed">{c.betaIntro}</p>
          <ul className="space-y-3">
            {c.betaItems.map((b) => (
              <li key={b.h} className="text-muted leading-relaxed">
                <strong className="text-white">{b.h}</strong> {b.p}
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <ShieldCheck size={20} className="text-primary" /> {c.warnTitle}
            </h3>
            <p className="text-sm text-muted">{c.warnIntro}</p>
            {c.warns.map((w) => (
              <div key={w.h}>
                <p className="font-semibold text-white">{w.h}</p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{w.p}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted leading-relaxed">{c.disclaimer}</p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <H2>{c.faqTitle}</H2>
          {c.faq.map((f) => (
            <details key={f.q} className="rounded-2xl border border-line bg-card p-5">
              <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
              <p className="mt-3 text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-4">
          <H2>{c.feedbackTitle}</H2>
          <p className="text-foreground">
            <strong className="text-white">{c.feedbackLead}</strong>{" "}
            <a href={`mailto:${AREAPILOT.feedbackEmail}`} className="inline-flex items-center gap-1 text-primary hover:text-primary-light">
              <Mail size={16} /> {AREAPILOT.feedbackEmail}
            </a>
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted">
            {c.feedbackItems.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="text-sm text-muted leading-relaxed">{c.feedbackDrawing}</p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6 text-[15px] leading-relaxed text-muted">
          <H2 id={lang === "tr" ? "gizlilik" : "app-privacy"}>{c.privacyTitle}</H2>
          <h3 className="text-lg font-bold text-white">{c.appPrivacyTitle}</h3>
          <ul className="list-disc space-y-2 pl-6 break-words">
            {c.appPrivacy.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h3 id={lang === "tr" ? "aydinlatma" : "privacy"} className="scroll-mt-28 pt-4 text-lg font-bold text-white">
            {c.noticeTitle}
          </h3>
          <p>
            <strong className="text-foreground">{lang === "tr" ? "Veri sorumlusu:" : "Controller:"}</strong>
          </p>
          <SellerBlock lang={lang} />
          {c.notice.map((n) => (
            <p key={n.h}>
              <strong className="text-foreground">{n.h}</strong> {n.p}
            </p>
          ))}
          <p className="pt-4 text-xs">{c.trademark}</p>
        </div>
      </section>
    </>
  );
}
