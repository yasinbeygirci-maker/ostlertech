import type { Metadata } from "next";
import { headers } from "next/headers";
import { EnHeader, EnFooter } from "@/components/EnShell";
import PaddlePricing from "@/components/PaddlePricing";
import { paddleConfig } from "@/lib/paddle-env";

// /satin-al sayfasının İngilizce karşılığı. Biri değişirse diğeri de aynı işte güncellenir.
export const metadata: Metadata = {
  title: "Pricing",
  description: "SyncPass Desktop (Windows): free, Premium and lifetime plans for an offline password manager.",
  alternates: { canonical: "/en/pricing", languages: { tr: "/satin-al", en: "/en/pricing" } },
};

export const dynamic = "force-dynamic";

export default async function PricingEnPage() {
  const { environment, token } = paddleConfig();
  const country = (await headers()).get("x-vercel-ip-country")?.toUpperCase();
  const countryCode = country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : undefined;

  return (
    <main lang="en" className="min-h-screen bg-background">
      <EnHeader trHref="/satin-al" />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="eyebrow">SyncPass Desktop · Windows</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-white">Choose your plan</h1>
            <p className="mt-4 text-muted">On every plan your vault stays encrypted on your computer and is never sent to any server.</p>
            <p className="mt-2 text-sm text-muted">
              The only product sold on this page is a licence for SyncPass Desktop (Windows), an offline password
              manager. The desktop app has no AI or chatbot features. Terms:{" "}
              <a href="/en/terms" className="text-primary hover:text-primary-light">Terms of Use</a> ·{" "}
              <a href="/en/refunds" className="text-primary hover:text-primary-light">Refund Policy</a> ·{" "}
              <a href="/en/privacy" className="text-primary hover:text-primary-light">Privacy</a>
            </p>
          </div>
          <div className="mt-12">
            <PaddlePricing environment={environment} token={token} countryCode={countryCode} lang="en" />
          </div>
        </div>
      </section>
      <EnFooter />
    </main>
  );
}
