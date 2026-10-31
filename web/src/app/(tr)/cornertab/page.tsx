import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CornerTabLanding, { CORNERTAB_COPY } from "@/components/CornerTabLanding";
import { CORNERTAB } from "@/lib/cornertab";

const c = CORNERTAB_COPY.tr;

export const metadata: Metadata = {
  title: c.title,
  description: c.description,
  alternates: { canonical: CORNERTAB.pagePath, languages: { tr: CORNERTAB.pagePath, en: CORNERTAB.pageEnPath, "x-default": CORNERTAB.pagePath } },
};

export default function CornerTabPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CornerTabLanding lang="tr" />
      <Footer />
    </main>
  );
}
