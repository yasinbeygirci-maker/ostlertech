"use client";

import { useEffect, useMemo, useState } from "react";
import { initializePaddle, type Environments, type Paddle } from "@paddle/paddle-js";
import { Check, Download } from "lucide-react";
import { TIERS, type BillingCycle, type Tier } from "@/lib/paddle-tiers";
import { DESKTOP_DOWNLOAD } from "@/lib/site";

interface Props {
  environment: Environments;
  token: string;
  // ISO ülke kodu (sunucu istek başlığından). Yoksa gönderilmez; Paddle ülkeyi ziyaretçinin IP adresinden bulur.
  countryCode?: string;
  // Giriş yapmış kullanıcının e-postası; sitede henüz hesap yok, gelince ödeme formuna önceden yazılır.
  customerEmail?: string;
}

const priceIdFor = (tier: Tier, cycle: BillingCycle): string | null => {
  if (!tier.priceId) return null;
  return "once" in tier.priceId ? tier.priceId.once : tier.priceId[cycle];
};

export default function PaddlePricing({ environment, token, countryCode, customerEmail }: Props) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [cycle, setCycle] = useState<BillingCycle>("year");
  // priceId -> Paddle'ın biçimlendirdiği toplam ("₺899,99" gibi). Ön yüzde hiçbir hesap ya da biçimlendirme yapılmaz.
  const [totals, setTotals] = useState<Record<string, string>>({});
  const [error, setError] = useState(false);

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

  const allPriceIds = useMemo(
    () => TIERS.flatMap((t) => (!t.priceId ? [] : "once" in t.priceId ? [t.priceId.once] : [t.priceId.month, t.priceId.year])),
    []
  );

  useEffect(() => {
    if (!paddle) return;
    paddle
      .PricePreview({
        items: allPriceIds.map((priceId) => ({ priceId, quantity: 1 })),
        ...(countryCode ? { address: { countryCode } } : {}),
      })
      .then((res) => {
        const next: Record<string, string> = {};
        for (const item of res.data.details.lineItems) next[item.price.id] = item.formattedTotals.total;
        setTotals(next);
      })
      .catch(() => setError(true));
  }, [paddle, countryCode, allPriceIds]);

  const openCheckout = (priceId: string) => {
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { app: "syncpass_desktop" },
      ...(customerEmail ? { customer: { email: customerEmail } } : {}),
      settings: {
        displayMode: "overlay",
        variant: "one-page",
        locale: "tr",
        successUrl: `${window.location.origin}/welcome`,
      },
    });
  };

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Ödeme dönemi" className="inline-flex rounded-full border border-line bg-card p-1 text-sm">
          {(["month", "year"] as const).map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={cycle === c}
              onClick={() => setCycle(c)}
              className={`rounded-full px-5 py-2 font-semibold transition-colors ${cycle === c ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}
            >
              {c === "month" ? "Aylık" : "Yıllık"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const priceId = priceIdFor(tier, cycle);
          const total = priceId ? totals[priceId] : undefined;
          const period = !tier.priceId ? "" : "once" in tier.priceId ? "tek seferlik" : cycle === "month" ? "/ ay" : "/ yıl";
          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-3xl border p-8 ${tier.highlighted ? "border-primary/40 bg-gradient-to-b from-primary/10 to-card" : "border-line bg-card"}`}
            >
              <h2 className="text-xl font-bold text-white">{tier.name}</h2>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>

              <div className="mt-6 flex min-h-[3.5rem] items-baseline gap-2">
                {!tier.priceId ? (
                  <span className="text-4xl font-extrabold text-white">Ücretsiz</span>
                ) : total ? (
                  <>
                    <span className="text-4xl font-extrabold text-white">{total}</span>
                    <span className="text-sm text-muted">{period}</span>
                  </>
                ) : (
                  <span aria-hidden className="h-10 w-32 animate-pulse rounded-lg bg-line" />
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-foreground">
                    <Check size={18} className="mt-0.5 shrink-0 text-ok" /> {f}
                  </li>
                ))}
              </ul>

              {!priceId ? (
                <a href={DESKTOP_DOWNLOAD.url} className="btn-secondary mt-8 w-full !py-3">
                  <Download size={18} /> İndir
                </a>
              ) : (
                <button
                  onClick={() => openCheckout(priceId)}
                  disabled={!paddle || !total}
                  className="btn-primary mt-8 w-full !py-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {tier.priceId && "once" in tier.priceId ? "Satın al" : "Abone ol"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-6 text-center text-sm text-weak">
          Fiyatlar şu an yüklenemedi. Sayfayı yenileyin; sorun sürerse destek@ostlertech.com adresine yazın.
        </p>
      )}
      <p className="mt-8 text-center text-xs text-muted">
        Fiyatlar bulunduğunuz ülkeye göre gösterilir ve vergiler dahildir. Siparişiniz yetkili satıcımız Paddle.com
        (<span lang="en">Merchant of Record</span>) tarafından işlenir; kart bilgileriniz bize iletilmez.
      </p>
    </div>
  );
}
