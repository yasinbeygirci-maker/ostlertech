import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AreaPilotLanding from "@/components/AreaPilotLanding";
import { AREAPILOT } from "@/lib/areapilot";
import { AREAPILOT_COPY } from "@/lib/areapilot-content";

const c = AREAPILOT_COPY.tr;

export const metadata: Metadata = {
  title: c.title,
  description: c.description,
  alternates: { canonical: AREAPILOT.path, languages: { tr: AREAPILOT.path, en: AREAPILOT.enPath, "x-default": AREAPILOT.enPath } },
};

// AreaPilot açık beta (TR). Sürüm denetimi aynı yolun altındaki public/areapilot/surum.json'u okur.
export default function AreaPilotPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AreaPilotLanding lang="tr" />
      <p className="text-center text-sm text-muted pb-8">
        <a href={AREAPILOT.enPath} hrefLang="en" lang="en" className="text-primary hover:text-primary-light">English</a>
      </p>
      <Footer />
    </main>
  );
}
