import { EnHeader, EnFooter } from "@/components/EnShell";
import PhoneTheftGuide, { phoneTheftMetadata } from "@/components/PhoneTheftGuide";

// Reward page for the Instagram Reel "telefon-calinirsa-5-adim". Copy: src/lib/telefon-calinirsa.ts.
export const metadata = phoneTheftMetadata("en");

export default function IfYourPhoneIsStolen() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <EnHeader trHref="/telefon-calinirsa" />
      <PhoneTheftGuide lang="en" />
      <EnFooter />
    </main>
  );
}
