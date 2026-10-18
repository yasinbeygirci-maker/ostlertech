import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { Check, Lock, KeyRound, Fingerprint, HardDrive, QrCode, Monitor, Cloud, Search, LifeBuoy } from "lucide-react";
import {
  PLAY_URL, SITE_URL, FREE_ITEM_LIMIT, PBKDF2_ITERATIONS, LANGUAGE_COUNT, MIN_ANDROID, DESKTOP_DOWNLOAD, DESKTOP_LICENSE, CONTACT_EMAIL,
} from "@/lib/site";

// English landing page. Every claim mirrors the Turkish homepage components (Hero, Features, Security, Pricing, Faq),
// which are themselves checked against the app's code. If a feature or a Premium lock changes, update both.
export const metadata: Metadata = {
  title: "SyncPass: Offline Password Manager for Android and Windows",
  description:
    "SyncPass keeps passwords, cards, 2FA codes and passkeys encrypted on your device. No account needed, your master password never leaves your phone. Free for up to 15 items.",
  alternates: { canonical: "/en", languages: { tr: "/", en: "/en", "x-default": "/" } },
  openGraph: {
    title: "SyncPass: your vault stays on your device",
    description: "Offline-first password manager for Android and Windows. No account, AES-256 encryption on the device.",
    url: `${SITE_URL}/en`,
    locale: "en_US",
  },
};

const features = [
  { icon: KeyRound, title: "Autofill and passkeys", desc: "Sign in to apps and browsers with one tap through Android Autofill and Credential Manager. On Android 14 and later SyncPass can store your passkeys." },
  { icon: QrCode, title: "2FA codes next to your passwords", desc: "Scan a site's QR code and the 6-digit code lives in the same entry as the password, with a countdown timer. Import accounts from Google Authenticator's export QR. (Premium)" },
  { icon: Fingerprint, title: "Fingerprint unlock", desc: "Open the vault with your fingerprint; the biometric key stays in the Android Keystore." },
  { icon: HardDrive, title: "Backups you control", desc: "Export an encrypted backup file, or put it in your own Google Drive (Premium). Import from other password managers." },
  { icon: Lock, title: "Recovery QR code", desc: "Create an offline recovery key in case you forget your master password. We cannot reset it for you, by design." },
  { icon: Monitor, title: "Same vault on Windows", desc: `SyncPass for Windows uses the same encryption and vault format as Android, in ${LANGUAGE_COUNT} languages.` },
];

const leaves = [
  { icon: Cloud, title: "Drive backup (optional)", desc: "If you turn it on, the already encrypted vault file is uploaded to your own Google Drive." },
  { icon: Search, title: "Breach check", desc: "Only the first 5 characters of the password's SHA-1 hash are sent to Have I Been Pwned (k-anonymity); the password itself is never sent." },
  { icon: LifeBuoy, title: "In-app help (Android only)", desc: "A question you type into the Android help screen is sent to Google's Gemini service to be answered. Vault contents are never sent. The Windows app does not do this." },
  { icon: KeyRound, title: "Windows license check (Premium only)", desc: "SyncPass for Windows Premium sends only your license code, a random device ID and the app version to activate the license. The free version never connects." },
];

const free = [`Up to ${FREE_ITEM_LIMIT} items`, "All item types: logins, cards, bank accounts, Wi-Fi, notes, passkeys", "Autofill and passkey provider", "Fingerprint unlock", "Password generator and security score", "Encrypted local backup and recovery QR"];
const premium = ["Unlimited items", "2FA / TOTP codes in the vault", "Encrypted Google Drive backup and restore", "Breach check (Have I Been Pwned)", "Everything in the free version"];

const faq = [
  { q: "Is SyncPass an offline password manager?", a: "Yes. Your vault is an encrypted database on your phone and SyncPass does not need a server to work. Nothing syncs to our servers because we do not run any for your vault. Optional features that use the network (Drive backup, breach check, in-app help) are listed above." },
  { q: "Do I need to create an account?", a: "No. You set a master password on your device and that is it. There is no email sign-up and your master password never leaves your phone." },
  { q: "Does it work on both Android and Windows?", a: `Yes. The Android app is on Google Play (${MIN_ANDROID} and later) and the Windows app uses the same vault format. iOS and macOS versions are not available.` },
  { q: "Can I copy 2FA codes quickly?", a: "With Premium, the current 2FA code sits in the same entry as the password, so you copy both from one place. You can also move your accounts from Google Authenticator by scanning its export QR code." },
  { q: "What happens if I forget my master password?", a: "We cannot reset it because we never know it. Create a recovery QR code in Settings after setting up the vault and keep it somewhere safe; it can unlock the vault from the lock screen." },
  { q: "Is it free?", a: `The free version stores up to ${FREE_ITEM_LIMIT} items with no ads. Premium adds unlimited items, 2FA codes, Drive backup and breach checks. Prices are shown in Google Play in your local currency.` },
];

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SyncPass",
    operatingSystem: "Android, Windows",
    applicationCategory: "SecurityApplication",
    url: `${SITE_URL}/en`,
    downloadUrl: PLAY_URL,
    inLanguage: "en",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "OstlerTech", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function EnglishHome() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <EnHeader />

      <section className="section-padding !pt-36">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="eyebrow">SyncPass · Android and Windows</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-gradient">Your passwords stay on your device.</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-relaxed">
            SyncPass keeps your passwords, cards, passkeys and 2FA codes (Premium) encrypted on your phone. No account to create, and your
            master password never leaves your device.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={PLAY_URL} className="btn-primary !py-3.5 text-base" rel="noopener">Get it free on Google Play</a>
            <a href={DESKTOP_DOWNLOAD.url} className="btn-secondary !py-3.5 text-base">Download for Windows</a>
          </div>
          <p className="text-xs text-muted">{MIN_ANDROID} and later · {FREE_ITEM_LIMIT} items free · No ads · {LANGUAGE_COUNT} languages</p>
        </div>
      </section>

      <section id="features" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="eyebrow">Features</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Everything in one encrypted list.</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">Logins, cards, bank accounts, Wi-Fi, notes, 2FA and passkeys, in one alphabetical list on your phone.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <article key={f.title} className="glass-card p-7 flex gap-5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><f.icon size={22} /></div>
                <div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-muted leading-relaxed text-[15px]">{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14">
          <div className="space-y-6">
            <p className="eyebrow">Security</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">You keep the key.</h2>
            <p className="text-lg text-muted leading-relaxed">
              SyncPass is not tied to a server. Your vault is an encrypted database on your phone, opened only by your master
              password or your fingerprint.
            </p>
            <ol className="space-y-4">
              {[
                { t: "Master password", d: "Known only to you. Never stored, never sent anywhere." },
                { t: `PBKDF2 · ${PBKDF2_ITERATIONS.replace(".", ",")} iterations`, d: "Your password is stretched with HMAC-SHA256 into the encryption key, so guessing attempts become expensive." },
                { t: "AES-256-GCM + SQLCipher", d: "Each field is encrypted on its own, and the whole database is encrypted again." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  <span className="font-mono font-bold text-primary">{i + 1}</span>
                  <div><p className="font-bold text-white">{s.t}</p><p className="mt-1 text-muted leading-relaxed">{s.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-white">What leaves your device?</h3>
            <p className="text-muted leading-relaxed">The complete list. Your vault itself never goes to us.</p>
            {leaves.map((l) => (
              <div key={l.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                <l.icon size={20} className="mt-0.5 shrink-0 text-primary" />
                <div><p className="font-semibold text-white">{l.title}</p><p className="mt-1 text-sm text-muted leading-relaxed">{l.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="eyebrow">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Start free.</h2>
            <p className="text-lg text-muted max-w-xl mx-auto">Premium prices are shown in Google Play in your local currency.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-line bg-surface p-8 space-y-5">
              <h3 className="text-2xl font-bold text-white">Free</h3>
              <ul className="space-y-3">{free.map((x) => <li key={x} className="flex gap-3 text-sm text-foreground"><Check size={18} className="mt-0.5 shrink-0 text-ok" /> {x}</li>)}</ul>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 space-y-5">
              <h3 className="text-2xl font-bold text-white">Premium</h3>
              <ul className="space-y-3">{premium.map((x) => <li key={x} className="flex gap-3 text-sm text-foreground"><Check size={18} className="mt-0.5 shrink-0 text-ok" /> {x}</li>)}</ul>
            </div>
          </div>
          <p className="text-center text-sm text-muted">
            SyncPass for Windows: free version and {DESKTOP_LICENSE.name.replace("Masaüstü", "Desktop")} for up to {DESKTOP_LICENSE.devices} computers.
          </p>
        </div>
      </section>

      <section id="faq" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-8 text-center">Frequently asked questions</h2>
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
            Questions? <span className="text-foreground">{CONTACT_EMAIL}</span> · <a href="/en/privacy" className="text-primary hover:text-primary-light">Privacy</a> ·{" "}
            <a href="/en/terms" className="text-primary hover:text-primary-light">Terms</a> · <a href="/en/refunds" className="text-primary hover:text-primary-light">Refunds</a>
          </p>
        </div>
      </section>

      <EnFooter />
    </main>
  );
}
