import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import GuideChecklist, { guideMetadata, type GuideItem } from "@/components/GuideChecklist";

// Page for the Instagram "LIST" comment magnet. Premium labels checked in code: VaultHealthScreen isPremium (ortak-beyin §16).
const PATH = "/en/security-checklist";
const title = "Security checklist: if your phone got stolen, would your accounts be safe?";
const description =
  "A 10-point security checklist: a different password for every account, at least 15 characters, two-step verification, recovery codes, screen lock and breach checks. Sources: NIST, CISA and Google.";

export const metadata: Metadata = guideMetadata({ path: PATH, trPath: "/guvenlik-kontrol-listesi", enPath: PATH, lang: "en", title, description });

const PLAY =
  "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dliste%26utm_content%3Dsayfa_en";

const items: GuideItem[] = [
  { heading: "A different password for every account", lines: ["One breach stays one breach; let a password manager do the remembering."], sources: ["CISA"], syncpass: "Security score shows reused passwords" },
  { heading: "At least 15 characters", lines: ["Length beats complicated rules; a few words in a row works."], sources: ["NIST"], syncpass: "Password generator" },
  { heading: "Two-step verification on email and banking", lines: ["A stolen password alone won't get in."], sources: ["CISA"], syncpass: "2FA codes (Premium)" },
  { heading: "An app or a passkey instead of SMS, where you can", lines: ["NIST lists SMS as a “restricted” method."], sources: ["NIST"], syncpass: "Passkeys; 2FA codes (Premium)" },
  { heading: "Keep recovery codes somewhere safe", lines: ["They're your way back in if you lose the phone. Print them and keep them safe."], sources: ["Google"], syncpass: "Secure note" },
  { heading: "Recovery email and phone up to date", lines: ["Pick an address you use often, other than your sign-in email; a new recovery number can take up to 7 days to take effect, so do it now."], sources: ["Google"] },
  { heading: "Screen lock and remote find/lock/erase turned on", lines: ["Turn it on before the phone goes missing."], sources: ["Google"], syncpass: "Vault locks when you leave the app" },
  { heading: "Automatic updates", lines: ["Security fixes ship in updates."], sources: ["CISA"] },
  { heading: "Is your password in a breach?", lines: ["Change leaked ones right away; NIST asks for new passwords to be checked against breach lists."], sources: ["NIST"], syncpass: "Breach check (Premium); only the first 5 characters of a hash leave the phone" },
  { heading: "Never type a password into a page you reached from a link", lines: ["Type the address yourself or open the app; report suspicious messages."], sources: ["CISA"], syncpass: "Autofill only suggests on the matching site" },
];

export default function SecurityChecklist() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <EnHeader trHref="/guvenlik-kontrol-listesi" />
      <GuideChecklist
        lang="en"
        label="Guide"
        title="If your phone got stolen, would your accounts be safe? 10 checks"
        sub="Tick each one. Sources at the bottom: NIST, CISA and Google."
        pdfHref="/rehber/security-checklist.pdf"
        items={items}
        ctaLabel="Get SyncPass"
        ctaHref={PLAY}
        disclaimer="This checklist is general information. OstlerTech · ostlertech.com"
        related={{ href: "/en/digital-security-plan", label: "Next step: your 7-day digital security plan" }}
      />
      <EnFooter />
    </main>
  );
}
