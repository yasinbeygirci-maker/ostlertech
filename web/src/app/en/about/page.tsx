import type { Metadata } from "next";
import LegalPage, { H2, List, SellerBlock } from "@/components/LegalPage";
import { FounderCard, OrganizationLd } from "@/components/AboutTeam";
import { COMPANY } from "@/lib/site";

// /hakkimizda sayfasının İngilizce karşılığı. Biri değişirse diğeri de aynı işte güncellenir.
export const metadata: Metadata = {
  title: "About",
  description: "OstlerTech is an independent software company in Türkiye building its own private, ad-free apps. Founder and company details.",
  alternates: { canonical: "/en/about", languages: { tr: "/hakkimizda", en: "/en/about" } },
};

const link = "text-primary hover:text-primary-light";

export default function AboutEnPage() {
  return (
    <LegalPage eyebrow="About" title="OstlerTech" updated={false} lang="en" altLink={{ href: "/hakkimizda", label: "Türkçe sürüm" }}>
      <OrganizationLd />
      <p>
        OstlerTech is an independent software company based in Türkiye that builds its own products: simple, secure, ad-free
        apps for people and small businesses who want to keep their data with them.
      </p>

      <H2>Founder and team</H2>
      <FounderCard lang="en" />
      <p>
        OstlerTech is a small, founder-led company. Product decisions, development and support all go through the founder,
        so every e-mail you send is read by the person who builds the product.
      </p>

      <H2>What we build</H2>
      <List>
        <li><strong className="text-foreground">SyncPass</strong>: a password manager that keeps passwords, cards and 2FA codes encrypted on your device (Android and Windows; Chrome extension for Windows).</li>
        <li><strong className="text-foreground">Projex</strong>: a construction-site tracker that follows daily work and planned versus actual progress between office and site (in testing).</li>
      </List>

      <H2>How we work</H2>
      <List>
        <li>Your data stays yours: SyncPass never sends your vault to a server and does not require an account.</li>
        <li>No ads or tracking in SyncPass: the app contains no advertising or analytics tracking libraries. Optional ads in our games are described in each game&apos;s privacy policy.</li>
        <li>We say what we do: on our site and in the stores we only describe features that are actually in the app.</li>
      </List>

      <H2>Company details</H2>
      <SellerBlock lang="en" />

      <H2>Contact</H2>
      <p>
        For questions, ideas and support, write to <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>.
      </p>
    </LegalPage>
  );
}
