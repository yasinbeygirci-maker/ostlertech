import Navbar from "@/components/Navbar";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import { CompanyHero, UrunBolumu, GuvenBolumu, HakkimizdaBolumu } from "@/components/CompanyHome";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

// Şirket vitrini. SyncPass tam açılış sayfası /syncpass adresine taşındı.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OstlerTech",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-ostlertech-simge.png`,
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <CompanyHero />
      <UrunBolumu />
      <VideoSection />
      <GuvenBolumu />
      <HakkimizdaBolumu />
      <Footer />
    </main>
  );
}
