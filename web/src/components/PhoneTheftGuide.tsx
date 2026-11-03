// "Telefonun çalınırsa ilk 5 adım" rehberinin düzeni. TR ve EN sayfalar yalnızca dili verir; metin src/lib/telefon-calinirsa.ts'te.
// Güvenlik kontrol listesi ve 7 günlük plan sayfalarının görsel dilini kullanır (GuideChecklist ile aynı kart/başlık/düğme sınıfları).
// Form, e-posta alanı ve çerez yok; işaret kutuları yalnızca tarayıcıda durur, hiçbir yere gönderilmez.
import { Check } from "lucide-react";
import { guideMetadata } from "@/components/GuideChecklist";
import { EN, PLAY_TELEFON_CALINIRSA, TR, type Content, type Lang } from "@/lib/telefon-calinirsa";

export function phoneTheftMetadata(lang: Lang) {
  const c = lang === "tr" ? TR : EN;
  return guideMetadata({ path: c.path, trPath: c.trPath, enPath: c.enPath, lang, title: c.title, description: c.description });
}

const ID = { tr: "kaynaklar", en: "sources" } as const;

function Sources({ keys, lang }: { keys: string[]; lang: Lang }) {
  return (
    <>
      {keys.map((s) => (
        <a key={s} href={`#${ID[lang]}`} className="ml-1.5 text-sm text-primary hover:text-primary-light">[{s}]</a>
      ))}
    </>
  );
}

export default function PhoneTheftGuide({ lang }: { lang: Lang }) {
  const c: Content = lang === "tr" ? TR : EN;
  return (
    <>
      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-primary font-semibold text-sm">{c.label}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{c.h1}</h1>
          <p className="text-lg text-muted leading-relaxed">{c.lead}</p>
          <p className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-foreground leading-relaxed">
            {c.calmNote}
            <Sources keys={["Apple"]} lang={lang} />
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{c.stepsTitle}</h2>
          <ol className="space-y-4">
            {c.steps.map((st, i) => (
              <li key={st.heading} className="rounded-2xl border border-line bg-surface p-5 md:p-6">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    aria-label={`${i + 1}. ${st.heading}`}
                    className="mt-1.5 h-5 w-5 shrink-0 accent-primary cursor-pointer"
                  />
                  <div className="space-y-3 min-w-0">
                    <h3 className="flex gap-3 items-baseline text-xl font-bold text-white leading-snug">
                      <span className="text-primary font-bold tabular-nums">{i + 1}</span>
                      <span>{st.heading}</span>
                    </h3>
                    {st.lines?.map((l) => (
                      <p key={l} className="text-base text-muted leading-relaxed">{l}</p>
                    ))}
                    {st.platforms && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {st.platforms.map((p) => (
                          <div key={p.name} className="rounded-xl border border-line bg-card p-4 space-y-1.5">
                            <p className="text-sm font-bold text-white">{p.name}</p>
                            <p className="text-base text-foreground leading-relaxed">{p.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {st.note && <p className="text-sm text-muted leading-relaxed">{st.note}</p>}
                    {st.sources.length > 0 && (
                      <p className="text-sm text-muted">
                        <Sources keys={st.sources} lang={lang} />
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">{c.beforeTitle}</h2>
          <p className="text-base text-muted leading-relaxed">{c.beforeLead}</p>
          <ul className="space-y-3">
            {c.before.map((b) => (
              <li key={b.text} className="flex gap-3 text-base text-foreground leading-relaxed">
                <Check size={20} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {b.text}
                  <Sources keys={b.sources} lang={lang} />
                  {b.href && (
                    <a href={b.href} className="ml-1.5 text-sm text-primary hover:text-primary-light">
                      {lang === "tr" ? "Kontrol listesi" : "Checklist"}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 md:p-10 space-y-4 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{c.helperTitle}</h2>
          <p className="text-base text-muted leading-relaxed">{c.helperText}</p>
          <a href={PLAY_TELEFON_CALINIRSA} className="btn-primary !py-3.5" rel="noopener">{c.ctaLabel} →</a>
          <p className="text-sm text-muted">{c.ctaNote}</p>
        </div>
      </section>

      <section id={ID[lang]} className="section-padding border-t border-line scroll-mt-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{c.sourcesTitle}</h2>
          <ul className="space-y-3 text-sm text-muted leading-relaxed">
            {c.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="text-primary hover:text-primary-light break-words" rel="noopener" target="_blank">{s.name}</a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted pt-4">{c.disclaimer}</p>
          <ul className="text-sm text-muted space-y-1.5">
            {c.related.map((r) => (
              <li key={r.href}>
                <a href={r.href} className="text-primary hover:text-primary-light">{r.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
