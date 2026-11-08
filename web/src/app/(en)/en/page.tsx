import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import VideoSection from "@/components/VideoSection";
import { CompanyHero, UrunBolumu, GuvenBolumu, HakkimizdaBolumu } from "@/components/CompanyHome";
import { SITE_URL } from "@/lib/site";
import { SOCIAL_PROFILES } from "@/components/SocialLinks";
import { ORGANIZATION_ID } from "@/lib/areapilot-ld";
import { paylasimMeta } from "@/lib/paylasim-meta";

// English company home (Turkish: /). Same sections and the same product list (lib/urunler.ts) as the Turkish home.
// The SyncPass landing page that used to be here moved to /en/syncpass on 2026-11-08.
const TITLE = "OstlerTech: Apps that keep your data with you";
const DESCRIPTION =
  "Independent software studio building SyncPass, AreaPilot, CornerTab, SyncDia and SyncSite for people and small businesses who want to keep their data with them.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/en", languages: { tr: "/", en: "/en", "x-default": "/" } },
  ...paylasimMeta({ title: TITLE, description: DESCRIPTION, path: "/en", lang: "en" }),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "OstlerTech",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-ostlertech-simge.png`,
  email: "destek@ostlertech.com",
  sameAs: SOCIAL_PROFILES,
};

export default function EnglishHome() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EnHeader trHref="/" />
      <CompanyHero lang="en" />
      <UrunBolumu lang="en" />
      <VideoSection lang="en" />
      <GuvenBolumu lang="en" />
      <HakkimizdaBolumu lang="en" />
      <EnFooter />
    </main>
  );
}
