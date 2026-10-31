import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import CornerTabLanding, { CORNERTAB_COPY } from "@/components/CornerTabLanding";
import { CORNERTAB } from "@/lib/cornertab";

const c = CORNERTAB_COPY.en;

export const metadata: Metadata = {
  title: c.title,
  description: c.description,
  alternates: { canonical: CORNERTAB.pageEnPath, languages: { tr: CORNERTAB.pagePath, en: CORNERTAB.pageEnPath, "x-default": CORNERTAB.pagePath } },
};

export default function CornerTabEnPage() {
  return (
    <main lang="en" className="min-h-screen bg-background">
      <EnHeader trHref={CORNERTAB.pagePath} />
      <CornerTabLanding lang="en" />
      <EnFooter />
    </main>
  );
}
