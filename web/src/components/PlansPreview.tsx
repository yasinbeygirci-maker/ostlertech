import { Check, Download } from "lucide-react";
import { TIERS } from "@/lib/paddle-tiers";
import { DESKTOP_DOWNLOAD } from "@/lib/site";

// Satış kapalıyken planların bilgi amaçlı gösterimi: ödeme düğmesi, ödeme kuruluşu betiği ya da fiyat sorgusu yok.
// (2026-10-23: Vercel Hobby planında ödeme alınamaz; satış yeni ödeme altyapısıyla açılana kadar.)
export default function PlansPreview({ lang = "tr" }: { lang?: "tr" | "en" }) {
  const tx =
    lang === "en"
      ? { download: "Download free (Windows)", soon: "Purchases open soon", note: "Premium purchases on ostlertech.com will open soon. Until then you can use the free version." }
      : { download: "Ücretsiz indir (Windows)", soon: "Satın alma yakında açılacak", note: "Premium satın alma ostlertech.com'da yakında açılacak. O zamana kadar ücretsiz sürümü kullanabilirsiniz." };
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const copy = lang === "en" ? tier.en : tier;
          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-3xl border p-8 ${tier.highlighted ? "border-primary/40 bg-gradient-to-b from-primary/10 to-card" : "border-line bg-card"}`}
            >
              <h2 className="text-xl font-bold text-white">{copy.name}</h2>
              <p className="mt-1 text-sm text-muted">{copy.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {copy.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-foreground">
                    <Check size={18} className="mt-0.5 shrink-0 text-ok" /> {f}
                  </li>
                ))}
              </ul>
              {!tier.priceId ? (
                <a href={DESKTOP_DOWNLOAD.url} className="btn-secondary mt-8 w-full !py-3">
                  <Download size={18} /> {tx.download}
                </a>
              ) : (
                <p className="mt-8 w-full rounded-xl border border-line py-3 text-center text-sm font-semibold text-muted">{tx.soon}</p>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-sm text-muted">{tx.note}</p>
    </div>
  );
}
