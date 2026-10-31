import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SYNCSITE } from "@/lib/syncsite";

// English counterpart of /syncsite. Keep both in step.
export const metadata: Metadata = {
  title: `${SYNCSITE.name}: Email verified`,
  description: `Your ${SYNCSITE.name} account email is verified; return to the app and sign in.`,
  alternates: { canonical: "/en/syncsite", languages: { tr: "/syncsite", en: "/en/syncsite" } },
};

const link = "text-primary hover:text-primary-light";

export default function SyncSiteHomeEnPage() {
  return (
    <LegalPage
      eyebrow={SYNCSITE.name}
      title="Your email is verified"
      lang="en"
      updated={false}
      altLink={{ href: "/syncsite", label: "Türkçe sürüm" }}
    >
      <p>
        Your email is verified. Return to the <strong className="text-foreground">{SYNCSITE.name}</strong> app and sign in.
      </p>
      <p>
        <a href={SYNCSITE.privacyEnPath} className={link}>{SYNCSITE.name} privacy policy</a>
        {" · "}
        <a href={SYNCSITE.deleteEnPath} className={link}>Delete your account and data</a>
      </p>
    </LegalPage>
  );
}
