import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { COMPANY, LEGAL_UPDATED, LEGAL_UPDATED_EN } from "@/lib/site";

// Yasal ve kurumsal sayfaların ortak düzeni.
export default function LegalPage({ eyebrow, title, children, updated = true, lang = "tr", altLink }: {
  eyebrow: string; title: string; children: ReactNode; updated?: boolean;
  // İngilizce sürümler (/en/...) için lang="en"; altLink diğer dildeki sayfaya bağlantı.
  lang?: "tr" | "en"; altLink?: { href: string; label: string };
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <article lang={lang} className="max-w-3xl mx-auto px-5 pt-36 pb-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-white">{title}</h1>
        {updated && (
          <p className="mt-3 text-sm text-muted">
            {lang === "en" ? `Last updated: ${LEGAL_UPDATED_EN}` : `Son güncelleme: ${LEGAL_UPDATED}`}
          </p>
        )}
        {altLink && (
          <p className="mt-2 text-sm">
            <a href={altLink.href} hrefLang={lang === "en" ? "tr" : "en"} className="text-primary hover:text-primary-light">{altLink.label}</a>
          </p>
        )}
        <div className="legal mt-10 space-y-6 text-[15px] leading-relaxed text-muted">{children}</div>
      </article>
      <Footer />
    </main>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="pt-4 text-xl font-bold text-white">{children}</h2>;
}

export function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2">{children}</ul>;
}

/** Firma bilgisinin bir alanı; boşsa göze çarpan "eksik" etiketi gösterir. */
export function Field({ value, label }: { value: string; label: string }) {
  return value ? (
    <span className="text-foreground">{value}</span>
  ) : (
    <span className="rounded bg-bad/15 px-1.5 py-0.5 text-bad text-sm font-semibold">{label} eksik</span>
  );
}

/** Firma bilgi bloğu: kullanım koşulları, gizlilik ve iletişim sayfasında aynı. Boş isteğe bağlı alanlar gösterilmez. */
export function SellerBlock({ lang = "tr" }: { lang?: "tr" | "en" }) {
  if (lang === "en") return (
    <dl className="grid sm:grid-cols-[12rem_1fr] gap-x-6 gap-y-2 rounded-2xl border border-line bg-surface p-6">
      <dt>Business</dt><dd className="text-foreground">{COMPANY.legalName} · {COMPANY.tradeName} ({COMPANY.brand}), sole proprietorship</dd>
      <dt>Tax office / no</dt><dd className="text-foreground">{COMPANY.taxOffice} · {COMPANY.taxNumber}</dd>
      <dt>Trade registry</dt><dd className="text-foreground">Erzincan Registry of Tradesmen and Craftsmen, no. {COMPANY.registryNo}</dd>
      {COMPANY.chamberName && (<><dt>Chamber</dt><dd className="text-foreground">{COMPANY.chamberName} (Erzincan Chamber of Electricians, Tradesmen and Craftsmen)</dd></>)}
      <dt>Address</dt><dd className="text-foreground">{COMPANY.address}, Türkiye</dd>
      <dt>Registered e-mail (KEP)</dt><dd className="text-foreground">{COMPANY.kep}</dd>
      {COMPANY.phone && (<><dt>Phone</dt><dd className="text-foreground">{COMPANY.phone}</dd></>)}
      <dt>E-mail</dt><dd><a href={`mailto:${COMPANY.email}`} className="text-primary hover:text-primary-light">{COMPANY.email}</a></dd>
    </dl>
  );
  return (
    <dl className="grid sm:grid-cols-[12rem_1fr] gap-x-6 gap-y-2 rounded-2xl border border-line bg-surface p-6">
      <dt>Firma</dt><dd><Field value={COMPANY.legalName} label="Unvan / Ad Soyad" /> · {COMPANY.tradeName} ({COMPANY.brand})</dd>
      <dt>Vergi dairesi / no</dt><dd><Field value={COMPANY.taxOffice} label="Vergi dairesi" /> · <Field value={COMPANY.taxNumber} label="Vergi no" /></dd>
      {COMPANY.mersis && (<><dt>MERSİS no</dt><dd className="text-foreground">{COMPANY.mersis}</dd></>)}
      <dt>Esnaf sicili</dt><dd className="text-foreground">{COMPANY.registry}, sicil no {COMPANY.registryNo}</dd>
      {COMPANY.chamberName && (<><dt>Meslek odası</dt><dd className="text-foreground">{COMPANY.chamberName}</dd></>)}
      <dt>Adres</dt><dd><Field value={COMPANY.address} label="Adres" /></dd>
      <dt>KEP adresi</dt><dd><Field value={COMPANY.kep} label="KEP adresi" /></dd>
      {COMPANY.phone && (<><dt>Telefon</dt><dd className="text-foreground">{COMPANY.phone}</dd></>)}
      <dt>E-posta</dt><dd><a href={`mailto:${COMPANY.email}`} className="text-primary hover:text-primary-light">{COMPANY.email}</a></dd>
    </dl>
  );
}
