import Navbar from "@/components/Navbar";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import { CompanyHero, UrunBolumu, GuvenBolumu, HakkimizdaBolumu } from "@/components/CompanyHome";
import type { Metadata } from "next";
import { INSTAGRAM_URL, SITE_URL, YOUTUBE_URL } from "@/lib/site";
import { FACEBOOK_URL } from "@/components/SocialLinks";
import { ORGANIZATION_ID } from "@/lib/areapilot-ld";
import { paylasimMeta } from "@/lib/paylasim-meta";

const BASLIK = "OstlerTech: Verisini kendinde tutmak isteyenler için uygulamalar";
const ACIKLAMA =
  "Verisini kendinde tutmak isteyen kişiler ve küçük işletmeler için SyncPass, AreaPilot, CornerTab, SyncDia ve SyncSite'ı geliştiren bağımsız yazılım stüdyosu.";

// Şirket vitrini. SyncPass tam açılış sayfası /syncpass adresine taşındı.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  ...paylasimMeta({ title: BASLIK, description: ACIKLAMA, path: "/", lang: "tr" }),
};

// @id: ürün sayfalarındaki yayıncı (publisher) kaydı bu kimliğe bağlanır (lib/areapilot-ld.ts).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "OstlerTech",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-ostlertech-simge.png`,
  email: "destek@ostlertech.com",
  sameAs: [INSTAGRAM_URL, YOUTUBE_URL, FACEBOOK_URL],
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
