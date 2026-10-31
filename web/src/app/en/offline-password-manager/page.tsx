import type { Metadata } from "next";
import { Check } from "lucide-react";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { PLAY_URL, SITE_URL, FREE_ITEM_LIMIT, DESKTOP_DOWNLOAD } from "@/lib/site";

// Claims checked against the code (2026-10-11): the vault is a local encrypted database; phone and Windows sync is Premium and
// goes through the user's own Google Drive hidden app folder (DRIVE_APPDATA scope), never through an OstlerTech server.
export const metadata: Metadata = {
  title: "Password Manager That Keeps Your Vault on Your Device (Android and Windows)",
  description:
    "A password manager that keeps your encrypted vault on your device instead of a vendor's servers. How SyncPass works on Android and Windows, how sync works through your own Google Drive, and who it is not for.",
  alternates: { canonical: "/en/offline-password-manager" },
  openGraph: { locale: "en_US", url: `${SITE_URL}/en/offline-password-manager` },
};

const approaches = [
  { name: "Cloud password managers", example: "Bitwarden, 1Password, NordPass", where: "Encrypted vault on the company's servers, cached on your devices", account: "Required", sync: "Automatic through the vendor" },
  { name: "Local vault files", example: "KeePass, KeePassXC", where: "An encrypted file on your computer", account: "None", sync: "You move or sync the file yourself" },
  { name: "SyncPass", example: "Android and Windows", where: "An encrypted database on your phone or PC", account: "Your Google account for Play purchases and Drive", sync: "Optional, through your own Google Drive (Premium)" },
];

const notFor = [
  "You use an iPhone or a Mac: SyncPass is available only on Android and Windows.",
  "You require open-source code you can audit yourself: look at KeePassXC or Bitwarden.",
  "You want your vault shared with family members: SyncPass has no shared vaults.",
];

const faq = [
  { q: "Does SyncPass need an internet connection?", a: "Not for the basics. Your vault is an encrypted database on your device, so unlocking it, searching, autofilling and generating passwords run on the device without an internet connection. Google Play purchase checks, passkey verification and optional features (Drive backup and sync, breach check, in-app help on Android) use the network. SyncPass for Windows Premium also contacts our license server from time to time to keep the license active." },
  { q: "Where exactly is my vault stored?", a: "On your phone (or your Windows PC) as an encrypted database. The master password is never stored or sent anywhere. OstlerTech does not run a server that holds vaults." },
  { q: "Can I sync between my phone and my computer without a cloud?", a: "Sync between Android and Windows uses your own Google Drive: the already encrypted vault goes into a hidden app folder only SyncPass can see. It is a Premium feature. Without it, each device keeps its own vault." },
  { q: "What happens if I lose my phone?", a: "Restore from your encrypted backup (a file you exported, or your Drive backup with Premium) and unlock it with your master password. Without a backup, a local vault cannot be recovered; that is the trade-off of not keeping a copy on our servers." },
  { q: "Is it free?", a: `The free version stores up to ${FREE_ITEM_LIMIT} items, with no ads. Premium adds unlimited items, 2FA codes, Drive backup and sync, and breach checks.` },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "en",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function OfflinePasswordManager() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <EnHeader trHref="/sifre-yoneticisi" />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Guide</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">A password manager that keeps your vault on your device</h1>
          <p className="text-lg text-muted leading-relaxed">
            A password manager can keep your encrypted vault on a company's servers or on your own device. SyncPass keeps it on
            your phone or PC. Unlocking, searching, autofill and the password generator run on the device and do not need an
            internet connection.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={PLAY_URL} className="btn-primary !py-3.5" rel="noopener">Get it free on Google Play</a>
            <a href={DESKTOP_DOWNLOAD.url} className="btn-secondary !py-3.5">Download for Windows</a>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Three ways to store a vault</h2>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-surface text-white text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold"> </th>
                  <th className="px-4 py-3 font-semibold">Where the vault lives</th>
                  <th className="px-4 py-3 font-semibold">Account</th>
                  <th className="px-4 py-3 font-semibold">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {approaches.map((a) => (
                  <tr key={a.name} className={a.name === "SyncPass" ? "bg-primary/5" : ""}>
                    <td className="px-4 py-3"><p className="font-semibold text-white">{a.name}</p><p className="text-xs text-muted">{a.example}</p></td>
                    <td className="px-4 py-3 text-muted">{a.where}</td>
                    <td className="px-4 py-3 text-muted">{a.account}</td>
                    <td className="px-4 py-3 text-muted">{a.sync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted leading-relaxed">
            Cloud password managers encrypt your vault before uploading it, and the good ones are well audited. The difference is
            where the encrypted copy lives and who you depend on. A local vault removes the company's server from the picture, and
            in exchange you become responsible for backups.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">How SyncPass syncs without our servers</h2>
          <p className="text-muted leading-relaxed">
            Your vault is encrypted on the device with AES-256-GCM, using a key derived from your master password. With Premium,
            SyncPass can keep your phone and your Windows PC in sync through <strong className="text-white">your own Google Drive</strong>:
            the encrypted vault is stored in a hidden app folder that only SyncPass can access. Google stores an encrypted file it
            cannot read, and OstlerTech never receives it.
          </p>
          <p className="text-muted leading-relaxed">
            Without Premium, each device keeps its own vault and your vault is not uploaded anywhere. You can still export an encrypted
            backup file and keep it somewhere safe, such as a USB drive.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Unlock, search, autofill and generate on the device, without an internet connection</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Your vault is not stored on our servers</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Passwords, cards, notes, Wi-Fi, 2FA codes and passkeys in one vault</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Recovery QR code in case you forget your master password</li>
          </ul>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">When SyncPass is not the right choice</h2>
          <p className="text-muted leading-relaxed">We would rather you pick the right tool than the wrong one:</p>
          <ul className="space-y-3">
            {notFor.map((n) => (
              <li key={n} className="rounded-2xl border border-line bg-surface p-4 text-muted leading-relaxed">{n}</li>
            ))}
          </ul>
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
            More about SyncPass: <a href="/en" className="text-primary hover:text-primary-light">features, security and pricing</a>.
          </p>
        </div>
      </section>

      <EnFooter />
    </main>
  );
}
