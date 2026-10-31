import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SYNCSITE } from "@/lib/syncsite";

// Supabase doğrulama e-postasındaki bağlantı buraya düşer. Adres Supabase Auth > URL Configuration'a girilir; değiştirme.
export const metadata: Metadata = {
  title: `${SYNCSITE.name}: E-posta doğrulandı`,
  description: `${SYNCSITE.name} hesabının e-postası doğrulandı; uygulamaya dönüp giriş yapabilirsin.`,
  alternates: { canonical: "/syncsite", languages: { tr: "/syncsite", en: "/en/syncsite" } },
};

const link = "text-primary hover:text-primary-light";

export default function SyncSiteHomePage() {
  return (
    <LegalPage
      eyebrow={SYNCSITE.name}
      title="E-postan doğrulandı"
      updated={false}
      altLink={{ href: "/en/syncsite", label: "English version" }}
    >
      <p>
        E-postan doğrulandı. <strong className="text-foreground">{SYNCSITE.name}</strong> uygulamasına dönüp giriş yap.
      </p>
      <p>
        <a href={SYNCSITE.privacyPath} className={link}>{SYNCSITE.name} gizlilik politikası</a>
        {" · "}
        <a href={SYNCSITE.deletePath} className={link}>Hesap ve veri silme</a>
      </p>
    </LegalPage>
  );
}
