import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlansPreview from "@/components/PlansPreview";

export const metadata: Metadata = {
  title: "Planlar",
  description: "SyncPass Masaüstü (Windows): ücretsiz sürüm ve Premium planları.",
  alternates: { canonical: "/satin-al" },
};

// 2026-10-23: sitede ödeme kapalı (Yasin: "şu an siteden hiçbir şey satmıyoruz"; Vercel Hobby planında ödeme alınamaz).
// Planlar bilgi olarak gösterilir; Paddle bileşeni (PaddlePricing) silinmedi, kullanılmıyor. Satış yeni altyapıyla açılınca değişir.
export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="eyebrow">SyncPass Masaüstü · <span lang="en">Windows</span></p>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-white">Planlar</h1>
            <p className="mt-4 text-muted">Kasanız her planda bilgisayarınızda şifreli durur ve hiçbir sunucuya gönderilmez.</p>
            <p className="mt-2 text-sm text-muted">
              SyncPass Masaüstü (Windows) çevrimdışı çalışan bir şifre yöneticisidir.{" "}
              <a href="/en/pricing" className="text-primary hover:text-primary-light" lang="en">English</a>
            </p>
          </div>
          <div className="mt-12">
            <PlansPreview />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
