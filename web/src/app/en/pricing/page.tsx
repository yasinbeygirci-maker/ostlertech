import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import PlansPreview from "@/components/PlansPreview";

// /satin-al sayfasının İngilizce karşılığı. Biri değişirse diğeri de aynı işte güncellenir.
// 2026-10-23: ödeme kapalı (PlansPreview); Paddle bileşeni (PaddlePricing) silinmedi, kullanılmıyor.
export const metadata: Metadata = {
  title: "Pricing",
  description: "SyncPass Desktop (Windows): free and Premium plans for an offline password manager.",
  alternates: { canonical: "/en/pricing", languages: { tr: "/satin-al", en: "/en/pricing" } },
};

export default function PricingEnPage() {
  return (
    <main lang="en" className="min-h-screen bg-background">
      <EnHeader trHref="/satin-al" />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="eyebrow">SyncPass Desktop · Windows</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-white">Plans</h1>
            <p className="mt-4 text-muted">On every plan your vault stays encrypted on your computer and is never sent to any server.</p>
            <p className="mt-2 text-sm text-muted">
              SyncPass Desktop (Windows) is an offline password manager. Terms:{" "}
              <a href="/en/terms" className="text-primary hover:text-primary-light">Terms of Use</a> ·{" "}
              <a href="/en/privacy" className="text-primary hover:text-primary-light">Privacy</a>
            </p>
          </div>
          <div className="mt-12">
            <PlansPreview lang="en" />
          </div>
        </div>
      </section>
      <EnFooter />
    </main>
  );
}
