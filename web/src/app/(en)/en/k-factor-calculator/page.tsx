import { EnHeader, EnFooter } from "@/components/EnShell";
import KFactorGuide, { kFactorMetadata } from "@/components/KFactorGuide";

// Free K-factor calculator (EN). Copy: src/lib/k-faktoru-metin.ts, maths: src/lib/k-faktoru.ts.
export const metadata = kFactorMetadata("en");

export default function KFactorCalculatorPage() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <EnHeader trHref="/k-faktoru-hesaplama" />
      <KFactorGuide lang="en" />
      <EnFooter />
    </main>
  );
}
