import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeFlow from "@/components/WelcomeFlow";
import { EnHeader, EnFooter } from "@/components/EnShell";

export const metadata: Metadata = {
  title: "Teşekkürler",
  robots: { index: false },
};

// Paddle ödemesi tamamlanınca buraya yönlendirilir. AreaPilot ödemesi ?urun=areapilot&lang=tr|en ile gelir (yalnız metin ipucu:
// kod gelince ürünü sunucu kaydı belirler). İpucu yoksa SyncPass metni gösterilir (bugünkü davranış).
export default async function WelcomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const hintProduct = q.urun === "areapilot" ? "areapilot" : null;
  const lang = q.lang === "en" ? "en" : "tr";
  return (
    <main lang={lang} className="min-h-screen bg-background">
      {lang === "en" ? <EnHeader trHref="/welcome" /> : <Navbar />}
      <section className="section-padding !pt-36">
        <WelcomeFlow hintProduct={hintProduct} lang={lang} />
      </section>
      {lang === "en" ? <EnFooter /> : <Footer />}
    </main>
  );
}
