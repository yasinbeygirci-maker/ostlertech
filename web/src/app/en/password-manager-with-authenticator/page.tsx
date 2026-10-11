import type { Metadata } from "next";
import { Check } from "lucide-react";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { PLAY_URL, SITE_URL, FREE_ITEM_LIMIT, DESKTOP_DOWNLOAD } from "@/lib/site";

// Claims checked against the code (2026-10-11): TotpManager supports SHA1/SHA256/SHA512, 6-8 digits, custom period and HOTP;
// OtpImport reads Google Authenticator "otpauth-migration" QR codes; codes are copied with the sensitive flag and the clipboard
// is cleared after the configured time. 2FA codes are Premium on Android and on Windows (desktop 1.4.5).
export const metadata: Metadata = {
  title: "Password Manager with Built-in Authenticator (2FA Codes)",
  description:
    "Keep 2FA codes next to your passwords and copy them in one tap. What SyncPass supports, how to move from Google Authenticator, and when a separate authenticator app is the safer choice.",
  alternates: { canonical: "/en/password-manager-with-authenticator" },
  openGraph: { locale: "en_US", url: `${SITE_URL}/en/password-manager-with-authenticator` },
};

const supports = [
  "Time-based codes (TOTP) with SHA-1, SHA-256 or SHA-512, 6 to 8 digits and a custom period",
  "Counter-based codes (HOTP)",
  "Add a code by scanning its QR code: with the camera on Android; from the screen, the clipboard or an image file on Windows",
  "Import every account at once from a Google Authenticator export QR code",
  "Attach a code to a login, so the password and the code are in the same entry",
  "Copy a code in one tap; the clipboard is marked sensitive and cleared automatically",
  "Codes are generated on the device from its clock, so they work offline",
];

const steps = [
  "In Google Authenticator, open the menu and choose Transfer accounts, then Export accounts. Select the accounts and it shows a QR code.",
  "In SyncPass, add a new 2FA code and choose to scan a QR code. Scan the export code; every account in it is added.",
  "Sign in to one or two of the services with a code from SyncPass to confirm it works before you delete anything from the old app.",
];

const faq = [
  { q: "Is it safe to keep 2FA codes in a password manager?", a: "It is a trade-off. Codes in the same vault are protected by the same master password and encryption as your passwords, which is much better than no 2FA at all. But if someone gets into your vault, they get both factors. For your most important accounts (main email, bank), a separate authenticator app, a passkey or a hardware key keeps the second factor truly separate." },
  { q: "Can I import my codes from Google Authenticator?", a: "Yes. Export your accounts as a QR code in Google Authenticator (Transfer accounts, then Export accounts) and scan it in SyncPass. All accounts in the QR code are imported." },
  { q: "Do the codes work without internet?", a: "Yes. Time-based codes are calculated on the device from the shared secret and the current time. Only the device clock needs to be correct." },
  { q: "Does SyncPass support push approvals or Steam Guard?", a: "No. SyncPass generates standard TOTP and HOTP codes, which is what most websites use. Push sign-in prompts (like Microsoft Authenticator approvals) and Steam Guard use their own systems and are not supported." },
  { q: "Is the authenticator free?", a: `No. 2FA codes are part of Premium on Android and Windows, together with unlimited items, Drive backup and sync, and breach checks. The free version stores up to ${FREE_ITEM_LIMIT} items, with no ads and no account.` },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "en",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function PasswordManagerWithAuthenticator() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <EnHeader trHref="/iki-adimli-dogrulama" />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Guide</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Password manager with a built-in authenticator</h1>
          <p className="text-lg text-muted leading-relaxed">
            Two-factor codes protect your accounts, but switching between a password manager and a separate authenticator app
            at every sign-in is tedious. A built-in authenticator keeps the code next to the password, so you copy both from one
            place. Here is what that gives you, what it costs in security, and how SyncPass handles it.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={PLAY_URL} className="btn-primary !py-3.5" rel="noopener">Get it on Google Play</a>
            <a href={DESKTOP_DOWNLOAD.url} className="btn-secondary !py-3.5">Download for Windows</a>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">The honest trade-off</h2>
          <p className="text-muted leading-relaxed">
            Two-factor authentication works because the second factor is separate from the password. When both live in the same
            vault, they are protected by the same master password. That is still far safer than having no 2FA: a leaked or
            phished password alone is not enough to sign in. But someone who unlocks your vault gets both.
          </p>
          <p className="text-muted leading-relaxed">
            A practical split: keep codes in your password manager for everyday accounts, where convenience means you actually
            turn 2FA on. For your main email and your bank, use a separate authenticator app, a passkey or a hardware key.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">What SyncPass supports</h2>
          <ul className="space-y-3">
            {supports.map((s) => (
              <li key={s} className="flex gap-3 text-muted leading-relaxed"><Check size={18} className="mt-1 shrink-0 text-ok" />{s}</li>
            ))}
          </ul>
          <p className="text-sm text-muted leading-relaxed">
            The secret behind each code is encrypted in your vault like your passwords, and stays on your device unless you turn
            on sync through your own Google Drive.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Moving from Google Authenticator</h2>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4 rounded-2xl border border-line bg-surface p-4 text-muted leading-relaxed">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-8">Frequently asked questions</h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {faq.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                  {f.q}<span className="text-muted transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Related: <a href="/en/offline-password-manager" className="text-primary hover:text-primary-light">offline password manager for Android and Windows</a>
            {" · "}<a href="/en" className="text-primary hover:text-primary-light">SyncPass features and pricing</a>
          </p>
        </div>
      </section>

      <EnFooter />
    </main>
  );
}
