"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { Check } from "lucide-react";
import { AREAPILOT_TIER_IDS, AREAPILOT_TIER_PRICES, AREAPILOT_TIER_PRICES_EXCL_TAX, SALES_COPY, areapilotPreInfo, checkoutRequest, type AreaPilotTierId, type SalesLang, type SalesPayload } from "@/lib/areapilot-sales";

// Satış AÇIKKEN çizilen fiyat bölümü (AreaPilotPricing kapısı yükler). Fiyatlar KDV dahil ve sabit (AREAPILOT_TIER_PRICES); vergi hesabı ya da Paddle önizlemesi yok.
// Adet seçimi yoktur: her düğme quantity 1 ile ödeme açar. Ürün/plan/cihaz sayısını sunucu fiyat tablosu belirler.
export default function AreaPilotPricingOpen({ lang, payload }: { lang: SalesLang; payload: Extract<SalesPayload, { open: true }> }) {
  const c = SALES_COPY[lang];
  const pre = areapilotPreInfo(lang);
  const [paddle, setPaddle] = useState<Paddle>();
  const [error, setError] = useState(false);
  const { environment, token, prices } = payload;

  useEffect(() => {
    initializePaddle({
      environment,
      token,
      // Teşekkür sayfası lisans kodunu bu işlem numarasıyla sorar (Paddle yönlendirmede numarayı eklemez).
      eventCallback: (event) => {
        const txn = event.name === "checkout.completed" ? event.data?.transaction_id : undefined;
        if (txn) {
          try {
            sessionStorage.setItem("paddle_txn", txn);
          } catch {}
        }
      },
    })
      .then((instance) => (instance ? setPaddle(instance) : setError(true)))
      .catch(() => setError(true));
  }, [environment, token]);

  const buy = (tier: AreaPilotTierId) => {
    paddle?.Checkout.open(checkoutRequest(prices[tier], lang, window.location.origin));
  };

  return (
    <section id={c.id} className="section-padding border-t border-line scroll-mt-28">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{c.title}</h2>
          <p className="max-w-3xl text-muted leading-relaxed">{c.lead}</p>
        </div>

        {/* Mesafeli satış ön bilgisi (Zeynep §5.1): "Satın al" düğmelerinin üstünde, gövde yazı boyutunda. */}
        <aside aria-labelledby="areapilot-onbilgi" className="rounded-3xl border border-line bg-card p-6 md:p-8">
          <h3 id="areapilot-onbilgi" className="text-xl font-bold text-white">{pre.title}</h3>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed text-foreground">
            {pre.items.map((it) => (
              <li key={it.label}>
                <strong className="text-white">{it.label}:</strong> {it.text}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-base text-muted">
            {pre.links
              .filter((l) => l.href)
              .map((l, i) => (
                <span key={l.label}>
                  {i > 0 && " · "}
                  <a href={l.href!} className="text-primary underline hover:text-primary-light">
                    {l.label}
                  </a>
                </span>
              ))}
          </p>
          <p className="mt-3 text-base text-muted">{pre.trademark}</p>
        </aside>

        <div className="grid gap-6 lg:grid-cols-3">
          {AREAPILOT_TIER_IDS.map((tier) => {
            const copy = c.tiers[tier];
            const highlighted = tier === "office";
            return (
              <div
                key={tier}
                className={`flex flex-col rounded-3xl border p-8 ${highlighted ? "border-primary/40 bg-gradient-to-b from-primary/10 to-card" : "border-line bg-card"}`}
              >
                {/* Üç kartın başlıkları hizalı kalsın diye etiket yeri hep ayrılır; yalnız öne çıkan kartta görünür. */}
                <p className={`eyebrow mb-2 ${highlighted ? "" : "invisible"}`} aria-hidden={!highlighted}>
                  {c.highlightedLabel}
                </p>
                <h3 className="text-xl font-bold text-white">{copy.name}</h3>
                <p className="mt-1 text-sm text-muted">{copy.devices}</p>

                <div className="mt-6 min-h-[5rem]">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-4xl font-extrabold text-white">{AREAPILOT_TIER_PRICES[tier][lang]}</span>
                    <span className="text-base font-semibold text-muted">{c.taxIncluded}</span>
                    <span className="text-sm text-muted">{c.once}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{AREAPILOT_TIER_PRICES_EXCL_TAX[tier][lang]}</p>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {copy.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-foreground">
                      <Check size={18} className="mt-0.5 shrink-0 text-ok" /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => buy(tier)}
                  disabled={!paddle}
                  className="btn-primary mt-8 w-full !py-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {c.buy}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-base text-muted">{c.priceNote}</p>

        {error && <p className="text-center text-sm text-weak">{c.error}</p>}

        <div className="space-y-2 text-sm leading-relaxed text-muted">
          {c.after.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
