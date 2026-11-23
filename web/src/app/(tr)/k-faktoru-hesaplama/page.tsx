import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KFactorGuide, { kFactorMetadata } from "@/components/KFactorGuide";

// Ücretsiz K faktörü hesaplama aracı (TR). Metin: src/lib/k-faktoru-metin.ts, hesap: src/lib/k-faktoru.ts.
export const metadata = kFactorMetadata("tr");

export default function KFaktoruHesaplama() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <KFactorGuide lang="tr" />
      <Footer />
    </main>
  );
}
