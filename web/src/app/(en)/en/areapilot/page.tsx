import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import AreaPilotLanding from "@/components/AreaPilotLanding";
import { AREAPILOT } from "@/lib/areapilot";
import { AREAPILOT_COPY } from "@/lib/areapilot-content";
import { paylasimMeta } from "@/lib/paylasim-meta";

const c = AREAPILOT_COPY.en;

export const metadata: Metadata = {
  title: c.title,
  description: c.description,
  alternates: { canonical: AREAPILOT.enPath, languages: { tr: AREAPILOT.path, en: AREAPILOT.enPath, "x-default": AREAPILOT.enPath } },
  ...paylasimMeta({
    title: `${c.title} | OstlerTech`,
    description: c.description,
    path: AREAPILOT.enPath,
    lang: "en",
    image: "/areapilot/og-areapilot-en.png?v=20261108",
    imageAlt: c.h1Sub,
  }),
};

export default function AreaPilotEnPage() {
  return (
    <main lang="en" className="min-h-screen bg-background">
      <EnHeader trHref={AREAPILOT.path} cta={{ href: "#indir", label: c.cta, menuLabel: `AreaPilot: ${c.cta}` }} />
      <AreaPilotLanding lang="en" />
      <EnFooter />
    </main>
  );
}
