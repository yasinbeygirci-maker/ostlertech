import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaddlePricing from "@/components/PaddlePricing";
import { paddleConfig } from "@/lib/paddle-env";

export const metadata: Metadata = {
  title: "Fiyatlar",
  description: "SyncPass Masaüstü (Windows): ücretsiz, Premium ve ömür boyu planlar.",
  alternates: { canonical: "/satin-al" },
};

// Ziyaretçinin ülkesine göre her istekte oluşturulur; Paddle ayarları derleme anında değil istek anında okunur.
export const dynamic = "force-dynamic";

// Paddle'daki "varsayılan ödeme bağlantısı" bu sayfadır; Paddle.js burada yüklü olmalı.
export default async function PricingPage() {
  const { environment, token } = paddleConfig();
  // Vercel ziyaretçinin ülkesini bu başlıkla verir. Yoksa ülke gönderilmez, Paddle IP adresinden bulur.
  const country = (await headers()).get("x-vercel-ip-country")?.toUpperCase();
  const countryCode = country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : undefined;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="eyebrow">SyncPass Masaüstü · <span lang="en">Windows</span></p>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-white">Size uygun planı seçin</h1>
            <p className="mt-4 text-muted">Kasanız her planda bilgisayarınızda şifreli durur ve hiçbir sunucuya gönderilmez.</p>
          </div>
          <div className="mt-12">
            <PaddlePricing environment={environment} token={token} countryCode={countryCode} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
