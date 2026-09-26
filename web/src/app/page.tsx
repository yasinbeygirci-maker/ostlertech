import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatsNew from "@/components/WhatsNew";
import Features from "@/components/Features";
import Desktop from "@/components/Desktop";
import Security from "@/components/Security";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { PLAY_URL, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SyncPass",
  operatingSystem: "Android",
  applicationCategory: "SecurityApplication",
  url: SITE_URL,
  downloadUrl: PLAY_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  publisher: { "@type": "Organization", name: "OstlerTech", url: SITE_URL },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Hero />
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
