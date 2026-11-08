import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// English counterpart of /hakkimizda. Keep both in sync.
export const metadata: Metadata = {
  title: "About us",
  description: "OstlerTech: an independent software studio building apps for individuals and small businesses who want to keep their data with them.",
  alternates: { canonical: "/en/about", languages: { tr: "/hakkimizda", en: "/en/about" } },
};

export default function AboutPageEn() {
  return (
    <LegalPage lang="en" eyebrow="About us" title="OstlerTech" updated={false} altLink={{ href: "/hakkimizda", label: "Türkçe" }}>
      <p>
        OstlerTech is an independent software studio based in Türkiye. We build simple, secure apps for individuals and small businesses
        who want to keep their data with them.
      </p>

      <H2>What we build</H2>
      <List>
        <li><strong className="text-foreground">SyncPass</strong>: a password manager that keeps passwords, cards and 2FA codes (Premium) encrypted on your device (Android and Windows; a Chrome extension for Windows).</li>
        <li><strong className="text-foreground">AreaPilot</strong>: an area and perimeter takeoff plug-in for AutoCAD (Windows; 7-day free trial).</li>
        <li><strong className="text-foreground">SyncSite</strong>: an app for tracking daily progress on construction sites, planned versus actual, shared between the office and the field (in testing; Windows and Android, iOS and macOS coming soon).</li>
      </List>

      <H2>How we work</H2>
      <List>
        <li>Your data is yours: we keep no copy of your vault on our servers, and you don&apos;t need a SyncPass account to get started.</li>
        <li>No ads or tracking in SyncPass: the app contains no advertising or analytics tracking library. The optional ads in our games are described in each game&apos;s privacy policy.</li>
        <li>We do what we say: on our site and in the stores we describe only features that are really in the app.</li>
      </List>

      <H2>Get in touch</H2>
      <p>
        For questions, suggestions and support, write to <a href={`mailto:${COMPANY.email}`} className="text-primary hover:text-primary-light">{COMPANY.email}</a> or
        use the details on our <a href="/en/contact" className="text-primary hover:text-primary-light">contact page</a>.
      </p>
    </LegalPage>
  );
}
