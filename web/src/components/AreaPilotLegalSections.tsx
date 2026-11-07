import { H2 } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import type { LegalSection } from "@/lib/areapilot-legal";

/** AreaPilot yasal bölümleri (areapilot-legal.ts). Çağıran sayfa yalnız areapilotLegalLive() iken kullanır. */
export default function AreaPilotLegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.heading}>
          <H2>{s.heading}</H2>
          {s.items.map((it) => (
            <p key={(it.lead ?? "") + it.text.slice(0, 24)}>
              {it.lead && <strong className="text-foreground">{it.lead} </strong>}
              {it.text.replaceAll("{EMAIL}", COMPANY.email)}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}
