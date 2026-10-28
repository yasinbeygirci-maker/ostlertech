import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlansPreview from "@/components/PlansPreview";
import PaddlePricing from "@/components/PaddlePricing";
import { paddleConfig, salesOpen } from "@/lib/paddle-env";

export const metadata: Metadata = {
  title: "Planlar",
  description: "SyncPass Masaüstü (Windows): ücretsiz sürüm ve Premium planları.",
  alternates: { canonical: "/satin-al" },
};

// Ziyaretçinin ülkesine göre her istekte oluşturulur; satış anahtarı ve Paddle ayarları istek anında okunur.
export const dynamic = "force-dynamic";

// Satış kapalıyken (PADDLE_SALES_OPEN=1 değilse) planlar yalnızca bilgi olarak gösterilir. Açıkken Paddle.js yüklenir.
// Paddle'daki "varsayılan ödeme bağlantısı" bu sayfadır.
export default async function PricingPage() {
  const open = salesOpen();
  let paddle: { environment: ReturnType<typeof paddleConfig>["environment"]; token: string; countryCode?: string } | null = null;
  if (open) {
    const { environment, token } = paddleConfig();
    // Vercel ziyaretçinin ülkesini bu başlıkla verir. Yoksa ülke gönderilmez, Paddle IP adresinden bulur.
    const country = (await headers()).get("x-vercel-ip-country")?.toUpperCase();
    paddle = { environment, token, countryCode: country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : undefined };
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="eyebrow">SyncPass Masaüstü · <span lang="en">Windows</span></p>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-white">{open ? "Size uygun planı seçin" : "Planlar"}</h1>
            <p className="mt-4 text-muted">Kasanız her planda bilgisayarınızda şifreli durur ve hiçbir sunucuya gönderilmez.</p>
            <p className="mt-2 text-sm text-muted">
              Bu sayfada satılan ürün yalnızca SyncPass Masaüstü (Windows) lisansıdır: çevrimdışı çalışan bir şifre
              yöneticisi. Masaüstü uygulamasında yapay zekâ ya da sohbet botu özelliği yoktur.{" "}
              <a href="/en/pricing" className="text-primary hover:text-primary-light" lang="en">English</a>
            </p>
          </div>
          <div className="mt-12">
            {paddle ? <PaddlePricing environment={paddle.environment} token={paddle.token} countryCode={paddle.countryCode} /> : <PlansPreview />}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
