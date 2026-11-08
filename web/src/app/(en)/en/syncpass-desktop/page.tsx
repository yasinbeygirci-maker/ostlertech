import type { Metadata } from "next";
import { Check, Monitor } from "lucide-react";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { BROWSER_EXTENSION, DESKTOP_DOWNLOAD, DESKTOP_LICENSE, LANGUAGE_COUNT, MS_STORE_URL, SCREENS_VERSION, SITE_URL } from "@/lib/site";

// English counterpart of /syncpass-masaustu. Same claims, same constants; Premium prices come from the checkout (Paddle), not from here.
export const metadata: Metadata = {
  title: "SyncPass Desktop",
  description: `SyncPass Desktop (Windows): free version and Premium (monthly, yearly or lifetime), ${DESKTOP_LICENSE.devices} computers, your vault encrypted on your computer.`,
  alternates: { canonical: "/en/syncpass-desktop", languages: { tr: "/syncpass-masaustu", en: "/en/syncpass-desktop" } },
};

const features = [
  "The same encryption and vault format as Android (AES-256-GCM)",
  "Categories, list and details side by side: a three-column layout",
  "Quick search from anywhere with Ctrl+Shift+Space; type the username and password automatically with Ctrl+Alt+A/U/P",
  "Chrome extension: the SyncPass button on a sign-in page fills the username and password from the vault on this computer",
  "A copied password is not written to Windows clipboard history or the cloud clipboard",
  "Password health: weak and reused passwords; breach check and 2FA codes are Premium",
  `Light and dark themes, ${LANGUAGE_COUNT} languages`,
];

// The only offer on this page with a known price is the free version; Premium prices come from the payment provider at checkout.
const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "SyncPass Desktop",
  description: "Password manager for Windows: the vault is encrypted with AES-256-GCM on your computer, and we keep no copy of it on our servers.",
  image: `${SITE_URL}/screens/desktop-vault-dark.webp`,
  brand: { "@type": "Brand", name: "OstlerTech" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/en/syncpass-desktop`,
  },
};

export default function DesktopLicensePageEn() {
  return (
    <main lang="en" className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <EnHeader trHref="/syncpass-masaustu" />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div className="space-y-6">
            <p className="eyebrow">SyncPass Desktop · Windows</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">The same vault on your computer.</h1>
            <p className="text-lg text-muted leading-relaxed">
              SyncPass Desktop uses the same encryption and vault format as the Android app. Your vault stays encrypted on your computer;
              we keep no copy of it on our servers.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={MS_STORE_URL} className="btn-primary !py-3.5 text-base" target="_blank" rel="noopener">Get it from Microsoft Store</a>
              <a href={DESKTOP_DOWNLOAD.url} className="text-base font-semibold text-primary hover:text-primary-light">Download the installer (.msi)</a>
              <span className="text-sm text-muted">Version {DESKTOP_DOWNLOAD.version} · {DESKTOP_DOWNLOAD.sizeLabel} · Windows 10 (2004) or Windows 11, 64-bit</span>
            </div>
            <p className="text-sm text-muted">
              To fill in your browser:{" "}
              <a href={BROWSER_EXTENSION.chromeUrl} className="font-semibold text-primary hover:text-primary-light" target="_blank" rel="noopener">Add to Chrome →</a>{" "}
              The extension stores no passwords; items are filled from SyncPass Desktop running on the same computer.
            </p>
            <details className="rounded-2xl border border-line bg-card p-5 text-sm text-muted">
              <summary className="cursor-pointer font-semibold text-foreground">If Windows shows an &quot;unrecognized app&quot; warning when you install the .msi file</summary>
              <p className="mt-3">
                Because you download the installer directly from this site, Windows SmartScreen may show a warning. You can continue with
                <strong className="text-foreground"> More info → Run anyway</strong>. You can check that the file came from us with its SHA-256 hash:
              </p>
              <code className="mt-2 block break-all font-mono text-xs text-foreground">{DESKTOP_DOWNLOAD.sha256}</code>
              <p className="mt-2">
                All versions: <a href={DESKTOP_DOWNLOAD.releasesUrl} className="text-primary hover:text-primary-light">release notes</a>.
                SyncPass Desktop is also available on <a href={MS_STORE_URL} className="text-primary hover:text-primary-light" target="_blank" rel="noopener">Microsoft Store</a>.
              </p>
            </details>
            <div className="device-window">
              <img src={`/screens/desktop-vault-dark.webp?v=${SCREENS_VERSION}`} alt="SyncPass Desktop: three-column vault view" width={1200} height={800} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 space-y-6">
            <div className="flex items-center gap-3 text-white font-bold text-lg">
              <Monitor size={22} className="text-primary" /> {DESKTOP_LICENSE.name.replace("Masaüstü", "Desktop")}
            </div>
            <div className="text-sm text-muted">
              Monthly, yearly or lifetime · {DESKTOP_LICENSE.devices} computers · prices for your country, taxes included
            </div>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-foreground">
                  <Check size={18} className="mt-0.5 shrink-0 text-ok" /> {f}
                </li>
              ))}
            </ul>
            <a href="/en/pricing" className="btn-primary w-full !py-3.5 text-base">See plans and pricing</a>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>Your license code is shown on screen right after payment.</li>
              <li>Full refund within {DESKTOP_LICENSE.refundDays} days, no questions asked; you can cancel a subscription at any time.</li>
              <li>When the license ends your vault is not locked; you keep using it with the free version.</li>
            </ul>
            <p className="text-xs text-muted">Sales are handled by our online reseller Paddle.com.</p>
          </aside>
        </div>
      </section>
      <EnFooter />
    </main>
  );
}
