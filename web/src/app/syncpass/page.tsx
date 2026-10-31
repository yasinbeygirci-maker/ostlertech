import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AreaPilotBanner from "@/components/AreaPilotBanner";
import WhatsNew from "@/components/WhatsNew";
import VideoSection from "@/components/VideoSection";
import Features from "@/components/Features";
import Desktop from "@/components/Desktop";
import Security from "@/components/Security";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { PLAY_URL, SITE_URL, SCREENS_VERSION } from "@/lib/site";

// SyncPass tam açılış sayfası (eskiden ana sayfaydı). İngilizce karşılığı /en.
export const metadata: Metadata = {
  title: { absolute: "SyncPass: Şifrelerin senin cihazında | OstlerTech" },
  description:
    "SyncPass, şifrelerini, kartlarını ve 2FA kodlarını (Premium) cihazında şifreli tutan şifre yöneticisidir. Kasanın kopyası sunucularımızda tutulmaz; ana şifreni bizimle paylaşmazsın.",
  alternates: { canonical: "/syncpass", languages: { tr: "/syncpass", en: "/en", "x-default": "/syncpass" } },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: `${SITE_URL}/syncpass`,
    title: "SyncPass: Şifrelerin senin cihazında",
    siteName: "OstlerTech",
    images: [{ url: `/og-image.png?v=${SCREENS_VERSION}`, width: 1200, height: 630, alt: "SyncPass Android ve masaüstü arayüzü" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SyncPass",
  operatingSystem: "Android, Windows",
  applicationCategory: "SecurityApplication",
  url: `${SITE_URL}/syncpass`,
  downloadUrl: PLAY_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  publisher: { "@type": "Organization", name: "OstlerTech", url: SITE_URL },
};

export default function SyncPassPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Hero />
      <AreaPilotBanner />
      <VideoSection />
      <WhatsNew />
      <Features />
      <Desktop />
      <Security />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  );
}
