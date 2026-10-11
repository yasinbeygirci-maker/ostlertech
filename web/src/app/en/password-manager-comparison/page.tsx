import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { PLAY_URL, SITE_URL, FREE_ITEM_LIMIT, DESKTOP_DOWNLOAD } from "@/lib/site";

// SyncPass rows checked against the code (2026-10-11). Other products checked against public sources on 2026-10-11:
// Enpass free = 25 items, own-cloud or Wi-Fi sync, passkeys, built-in TOTP; Bitwarden built-in TOTP is Premium, open source,
// self-hosting; KeePassXC 2.7.7+ passkeys through its browser extension, no official mobile app (KeePassDX is a separate project).
// Names of other products are plain text only (ic-kurallar). Re-check before editing: these change.
export const metadata: Metadata = {
  title: "SyncPass vs KeePassXC vs Bitwarden vs Enpass: Honest Comparison",
  description:
    "Where each password manager keeps your vault, whether you need an account, which platforms it runs on, how sync and 2FA codes work, and which one fits you. Written by the SyncPass team, including where SyncPass falls short.",
  alternates: { canonical: "/en/password-manager-comparison" },
  openGraph: { locale: "en_US", url: `${SITE_URL}/en/password-manager-comparison` },
};

const products = ["SyncPass", "KeePassXC", "Bitwarden", "Enpass"] as const;

const rows: { label: string; values: [string, string, string, string] }[] = [
  { label: "Where the vault lives", values: ["Encrypted database on your phone or PC", "Encrypted file on your computer", "Bitwarden's servers (or your own server), cached on devices", "Encrypted file on your devices"] },
  { label: "Account needed", values: ["No", "No", "Yes", "No"] },
  { label: "Platforms", values: ["Android, Windows", "Windows, macOS, Linux", "All major platforms and web", "Windows, macOS, Linux, Android, iOS"] },
  { label: "Phone app", values: ["Android (official)", "None official; community apps such as KeePassDX open the same file", "Android, iOS", "Android, iOS"] },
  { label: "Sync between devices", values: ["Optional, through your own Google Drive (Premium)", "You sync the file yourself (any cloud folder or USB)", "Automatic through Bitwarden", "Your own cloud (Google Drive, OneDrive, Dropbox, iCloud, WebDAV) or local Wi-Fi"] },
  { label: "Built-in 2FA codes", values: ["Yes (Premium)", "Yes", "Yes (Premium)", "Yes"] },
  { label: "Passkeys", values: ["Android 14+ passkey provider", "Yes, through its browser extension", "Yes", "Yes"] },
  { label: "Open source", values: ["No", "Yes", "Yes", "No"] },
  { label: "Free version", values: [`Up to ${FREE_ITEM_LIMIT} items, no ads`, "Completely free", "Unlimited items; some features paid", "Up to 25 items"] },
];

const picks = [
  { who: "You want everything on every device with zero setup", pick: "Bitwarden", why: "Automatic sync, apps everywhere, open source and audited. You trust its servers with your encrypted vault and need an account." },
  { who: "You want free, open-source and fully under your control on a computer", pick: "KeePassXC", why: "A local file, no account, very mature. You handle sync and pick a separate mobile app yourself." },
  { who: "You use iPhone or Mac and want a local vault with your own cloud", pick: "Enpass", why: "Offline-first with apps on every platform and sync through a cloud you already use." },
  { who: "You use Android and Windows and want no account and no vendor cloud", pick: "SyncPass", why: "A local encrypted vault on the phone and PC, optional sync only through your own Google Drive, with 2FA codes and passkeys in the same app." },
];

const faq = [
  { q: "Which password manager is the most secure?", a: "All four encrypt the vault on your device before it is stored anywhere, so a good master password matters more than the brand. The real difference is the trust model: Bitwarden keeps the encrypted vault on its servers, while KeePassXC, Enpass and SyncPass keep it on your devices unless you choose a cloud yourself. Open-source code (KeePassXC, Bitwarden) can be audited by anyone." },
  { q: "Is SyncPass open source?", a: "No. If auditable source code is a requirement for you, KeePassXC or Bitwarden is the better choice." },
  { q: "Can I move my passwords to SyncPass?", a: "On Android, SyncPass imports Bitwarden (CSV and JSON), Google Chrome and LastPass (CSV) and Kaspersky (TXT) exports, and 2FA accounts from a Google Authenticator export QR code. Logins whose 2FA secret is an otpauth link keep their settings. There is no direct KeePassXC import yet." },
  { q: "Why compare products you compete with?", a: "Because people ask AI assistants and search engines this exact question, and a one-sided answer does not help anyone. If another tool fits you better, use it." },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "en",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function PasswordManagerComparison() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <EnHeader trHref="/sifre-yoneticisi" />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">SyncPass vs KeePassXC vs Bitwarden vs Enpass</h1>
          <p className="text-lg text-muted leading-relaxed">
            We make SyncPass, so read this with that in mind. We have tried to be fair: each of these is a good password manager,
            and they differ mainly in where your vault lives, whether you need an account, and which devices you use.
          </p>
          <p className="text-xs text-muted">Last checked: October 2026. Plans and features of other products change; check their websites before you decide.</p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Side by side</h2>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[56rem] text-sm">
              <thead className="bg-surface text-white text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold w-44"> </th>
                  {products.map((p) => (
                    <th key={p} className={`px-4 py-3 font-semibold ${p === "SyncPass" ? "text-primary-light" : ""}`}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-3 font-semibold text-white align-top">{r.label}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className={`px-4 py-3 text-muted align-top ${i === 0 ? "bg-primary/5" : ""}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Which one fits you</h2>
          <ul className="space-y-3">
            {picks.map((p) => (
              <li key={p.pick} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-sm text-muted">{p.who}</p>
                <p className="mt-1 font-semibold text-white">{p.pick}</p>
                <p className="mt-2 text-muted leading-relaxed">{p.why}</p>
              </li>
            ))}
          </ul>
          <p className="text-muted leading-relaxed">
            Where SyncPass falls short: no iPhone or Mac app, no shared family vaults, not open source, and a free version limited
            to {FREE_ITEM_LIMIT} items.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={PLAY_URL} className="btn-primary !py-3.5" rel="noopener">Get SyncPass on Google Play</a>
            <a href={DESKTOP_DOWNLOAD.url} className="btn-secondary !py-3.5">Download for Windows</a>
          </div>
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
            Related: <a href="/en/offline-password-manager" className="text-primary hover:text-primary-light">offline password manager</a>
            {" · "}<a href="/en/password-manager-with-authenticator" className="text-primary hover:text-primary-light">built-in authenticator</a>
          </p>
        </div>
      </section>

      <EnFooter />
    </main>
  );
}
