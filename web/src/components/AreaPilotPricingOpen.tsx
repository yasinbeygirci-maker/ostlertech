"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { Check } from "lucide-react";
import { AREAPILOT_TIER_IDS, SALES_COPY, checkoutRequest, type AreaPilotTierId, type SalesLang, type SalesPayload } from "@/lib/areapilot-sales";

// Satış AÇIKKEN çizilen fiyat bölümü (AreaPilotPricing kapısı yükler). Tutarı Paddle ziyaretçinin ülkesine göre döndürür; burada hesap yok.
// Adet seçimi yoktur: her düğme quantity 1 ile ödeme açar. Ürün/plan/cihaz sayısını sunucu fiyat tablosu belirler.
export default function AreaPilotPricingOpen({ lang, payload }: { lang: SalesLang; payload: Extract<SalesPayload, { open: true }> }) {
  const c = SALES_COPY[lang];
  const [paddle, setPaddle] = useState<Paddle>();
  const [totals, setTotals] = useState<Record<string, string>>({});
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

  useEffect(() => {
    if (!paddle) return;
    paddle
      .PricePreview({ items: AREAPILOT_TIER_IDS.map((t) => ({ priceId: prices[t], quantity: 1 })) })
      .then((res) => {
        const next: Record<string, string> = {};
        for (const item of res.data.details.lineItems) next[item.price.id] = item.formattedTotals.total;
        setTotals(next);
      })
      .catch(() => setError(true));
  }, [paddle, prices]);

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

        <div className="grid gap-6 lg:grid-cols-3">
          {AREAPILOT_TIER_IDS.map((tier) => {
            const copy = c.tiers[tier];
            const total = totals[prices[tier]];
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

                <div className="mt-6 flex min-h-[3.5rem] items-baseline gap-2">
                  {total ? (
                    <>
                      <span className="text-4xl font-extrabold text-white">{total}</span>
                      <span className="text-sm text-muted">{c.once}</span>
                    </>
                  ) : (
                    <span role="status" aria-label={c.loadingPrice} className="h-10 w-32 animate-pulse rounded-lg bg-line" />
                  )}
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
                  disabled={!paddle || !total}
                  className="btn-primary mt-8 w-full !py-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {c.buy}
                </button>
              </div>
            );
          })}
        </div>

        {error && <p className="text-center text-sm text-weak">{c.error}</p>}

        <div className="space-y-2 text-sm leading-relaxed text-muted">
          {c.after.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>{c.legal.refund}</p>
          <p>
            {c.legal.paddle}{" "}
            <a href={c.legal.termsHref} className="text-primary underline hover:text-primary-light">
              {c.legal.termsLabel}
            </a>
            {" · "}
            <a href={c.legal.refundHref} className="text-primary underline hover:text-primary-light">
              {c.legal.refundLabel}
            </a>
            .
          </p>
          <p className="text-xs">{c.legal.trademark}</p>
        </div>
      </div>
    </section>
  );
}
