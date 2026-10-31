import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import AreaPilotLanding from "@/components/AreaPilotLanding";
import { AREAPILOT } from "@/lib/areapilot";
import { AREAPILOT_COPY } from "@/lib/areapilot-content";

const c = AREAPILOT_COPY.en;

export const metadata: Metadata = {
  title: c.title,
  description: c.description,
  alternates: { canonical: AREAPILOT.enPath, languages: { tr: AREAPILOT.path, en: AREAPILOT.enPath, "x-default": AREAPILOT.enPath } },
};

export default function AreaPilotEnPage() {
  return (
    <main lang="en" className="min-h-screen bg-background">
      <EnHeader trHref={AREAPILOT.path} />
      <AreaPilotLanding lang="en" />
      <EnFooter />
    </main>
  );
}
