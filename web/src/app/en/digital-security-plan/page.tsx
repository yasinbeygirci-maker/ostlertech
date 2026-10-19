import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import GuideChecklist, { guideMetadata, type GuideItem } from "@/components/GuideChecklist";

// Page for the Instagram "PLAN" comment magnet. Premium labels checked in code: VaultHealthScreen isPremium (ortak-beyin §16).
const PATH = "/en/digital-security-plan";
const title = "Your 7-day digital security plan: ten minutes a day";
const description =
  "Ten minutes a day, one job per day: your email account, every password in one place, reused passwords, two-step verification, recovery options, your phone and old accounts.";

export const metadata: Metadata = guideMetadata({ path: PATH, trPath: "/dijital-guvenlik-plani", enPath: PATH, lang: "en", title, description });

const PLAY =
  "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dplan%26utm_content%3Dsayfa_en";

const items: GuideItem[] = [
  {
    heading: "Day 1 · Your email account first",
    lines: [
      "New password, at least 15 characters, used nowhere else.",
      "Turn on two-step verification.",
      "Why first: every “forgot password” link lands here.",
    ],
  },
  {
    heading: "Day 2 · Put every password in one place",
    lines: [
      "Move passwords out of your browser or notes into a password manager, then delete the export file (and empty the bin).",
      "SyncPass: Settings → Import & Export, CSV or JSON. The free version holds 15 items.",
    ],
  },
  {
    heading: "Day 3 · Change the reused ones",
    lines: [
      "Start with your top 5: email, bank, mobile carrier, social, shopping.",
      "Change each one on the site first, then save it in the vault.",
      "SyncPass: the security score lists weak and reused passwords.",
    ],
  },
  {
    heading: "Day 4 · Two-step verification",
    lines: [
      "Turn it on for banking, social and shopping.",
      "Pick an app or a passkey over SMS when offered.",
      "Save recovery codes.",
      "SyncPass: passkeys; 2FA codes with live countdown are Premium.",
    ],
  },
  {
    heading: "Day 5 · Recovery options",
    lines: [
      "Check the recovery phone and email on important accounts; use an address you check often, not your sign-in email.",
      "Create SyncPass's recovery QR code in case you forget your master password, print it and keep it safe.",
    ],
  },
  {
    heading: "Day 6 · Your phone",
    lines: [
      "Screen lock with a PIN that's hard to guess.",
      "Turn on remote find/lock/erase before you need it.",
      "Turn on automatic updates.",
    ],
  },
  {
    heading: "Day 7 · Breach check and old accounts",
    lines: [
      "Check your passwords against known breaches and change any that show up.",
      "Close accounts you no longer use.",
      "SyncPass: breach check is Premium; only the first 5 characters of a hash leave your phone.",
    ],
  },
];

export default function DigitalSecurityPlan() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <EnHeader trHref="/dijital-guvenlik-plani" />
      <GuideChecklist
        lang="en"
        label="Guide"
        title="Your 7-day digital security plan"
        sub="Ten minutes a day, one job per day. Tick each day."
        pdfHref="/rehber/digital-security-plan.pdf"
        items={items}
        numbered={false}
        after="After: 5 minutes a month. Look at your security score, add new accounts."
        ctaLabel="Start SyncPass free"
        ctaHref={PLAY}
        disclaimer="This plan is general information. OstlerTech · ostlertech.com"
        related={{ href: "/en/security-checklist", label: "The 10-point security checklist" }}
      />
      <EnFooter />
    </main>
  );
}
