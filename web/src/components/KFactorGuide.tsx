// K faktörü hesaplama sayfasının gövdesi (TR ve EN aynı bileşenden çizilir; metin src/lib/k-faktoru-metin.ts).
import type { Metadata } from "next";
import KFactorCalculator from "@/components/KFactorCalculator";
import KFactorDiagram from "@/components/KFactorDiagram";
import { guideMetadata } from "@/components/GuideChecklist";
import { EN, TR, type Lang, type Metin } from "@/lib/k-faktoru-metin";
import { SITE_URL } from "@/lib/site";

export function kFactorMetadata(lang: Lang): Metadata {
  const c = lang === "tr" ? TR : EN;
  return guideMetadata({ path: c.path, trPath: c.trPath, enPath: c.enPath, lang, title: c.title, description: c.description });
}

function JsonLd({ c, lang }: { c: Metin; lang: Lang }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.h1,
    description: c.description,
    url: `${SITE_URL}${c.path}`,
    inLanguage: lang,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "OstlerTech", url: SITE_URL },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />;
}

export default function KFactorGuide({ lang }: { lang: Lang }) {
  const c: Metin = lang === "tr" ? TR : EN;
  return (
    <>
      <JsonLd c={c} lang={lang} />
      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">{c.label}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{c.h1}</h1>
          <p className="text-lg text-muted leading-relaxed">{c.lead}</p>
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="max-w-4xl mx-auto">
          <KFactorCalculator lang={lang} />
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{c.diagram.heading}</h2>
            <p className="text-[17px] text-muted leading-relaxed">{c.diagram.intro}</p>
            <p className="text-[17px] text-muted leading-relaxed">{c.diagram.note}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-2 sm:p-4">
            <KFactorDiagram alt={c.diagram.alt} neutral={c.diagram.neutral} virtual={c.diagram.virtual} />
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{c.abbr.heading}</h2>
          <dl className="divide-y divide-line rounded-2xl border border-line">
            {c.abbr.rows.map((r) => (
              <div key={r.k} className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="text-[17px] font-bold text-white">{r.k}</dt>
                <dd className="text-[17px] text-muted leading-relaxed">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{c.formulas.heading}</h2>
          <p className="text-[17px] text-muted leading-relaxed">{c.formulas.intro}</p>
          <ul className="space-y-3">
            {c.formulas.rows.map((r) => (
              <li key={r.expr} className="rounded-xl border border-line bg-card px-4 py-3">
                <p className="text-[15px] text-muted">{r.name}</p>
                <p className="mt-1 overflow-x-auto font-mono text-[17px] text-white">{r.expr}</p>
                {r.note && <p className="mt-1 overflow-x-auto font-mono text-[15px] text-muted">{r.note}</p>}
              </li>
            ))}
          </ul>
          <p className="text-[17px] text-muted leading-relaxed">{c.formulas.outro}</p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{c.what.heading}</h2>
          {c.what.paras.map((p) => (
            <p key={p} className="text-[17px] text-muted leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{c.howto.heading}</h2>
          <ol className="space-y-4">
            {c.howto.steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span aria-hidden className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[17px] font-bold text-primary-light">{i + 1}</span>
                <p className="text-[17px] text-muted leading-relaxed">{s}</p>
              </li>
            ))}
          </ol>
          <p className="rounded-xl border border-line bg-card px-4 py-3 text-[17px] text-muted leading-relaxed">{c.howto.tip}</p>
          <p className="text-[17px] text-muted leading-relaxed">{c.maker}</p>
        </div>
      </section>
    </>
  );
}
