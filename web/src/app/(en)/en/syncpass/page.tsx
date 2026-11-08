import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import VideoSection from "@/components/VideoSection";
import {
  Check, Lock, KeyRound, Fingerprint, HardDrive, QrCode, Monitor, Cloud, Search, LifeBuoy, ShieldCheck, Mail, Smartphone, Wand2, Tablet,
  Columns3, Command, ClipboardX, SunMoon, EyeOff,
} from "lucide-react";
import {
  PLAY_URL, SITE_URL, FREE_ITEM_LIMIT, PBKDF2_ITERATIONS, LANGUAGE_COUNT, MIN_ANDROID, DESKTOP_DOWNLOAD, DESKTOP_LICENSE, CONTACT_EMAIL,
  MS_STORE_URL, BROWSER_EXTENSION,
} from "@/lib/site";
import { AREAPILOT } from "@/lib/areapilot";
import { paylasimMeta } from "@/lib/paylasim-meta";

// English SyncPass page (/en/syncpass; Turkish: /syncpass). Every claim mirrors the Turkish SyncPass page components
// (Hero, AreaPilotBanner, VideoSection, WhatsNew, Features, Desktop, Security, Pricing, Faq), which are themselves checked
// against the app's code. If a feature or a Premium lock changes, update both. Until 2026-11-08 this page lived at /en;
// /en is now the English company home, like / in Turkish.
export const metadata: Metadata = {
  title: { absolute: "SyncPass: On-Device Password Manager | OstlerTech" },
  description:
    "SyncPass keeps passwords, cards, passkeys and 2FA codes (Premium) encrypted on your device. No copy of your vault on our servers. Free for up to 15 items.",
  alternates: { canonical: "/en/syncpass", languages: { tr: "/syncpass", en: "/en/syncpass", "x-default": "/syncpass" } },
  // Kendi openGraph bloğu görsel vermiyordu (og:image düşüyordu); paylasimMeta görseli de verir.
  ...paylasimMeta({
    title: "SyncPass: your vault stays on your device",
    description: "Password manager for Android and Windows that keeps your vault encrypted with AES-256 on your device.",
    path: "/en/syncpass",
    lang: "en",
  }),
};

// Mirrors components/WhatsNew.tsx.
const whatsNew = [
  { tag: "Android", title: "New vault screen", desc: "Pinned search, filter chips, favorites, live 2FA codes and swipe to copy." },
  { tag: "Android", title: "One security verdict", desc: "The home screen and the health screen now show the same score and the same warning." },
  { tag: "Android", title: "Your password is yours", desc: "The app no longer changes weak passwords by itself; you decide what to fix." },
  { tag: "Android", title: "Safe import", desc: "Even if the app closes while you pick a file, the import resumes where it left off after you unlock." },
  { tag: "Android", title: "Clipboard is not read", desc: "The app does not read your clipboard at launch; copied passwords are marked as sensitive content." },
  { tag: "Desktop", title: "Redesigned from scratch", desc: `The same colors as Android, a three-column layout, light and dark themes and ${LANGUAGE_COUNT} languages.` },
];

// Mirrors components/Features.tsx.
const features = [
  { icon: Search, title: "Everything in one list", desc: "Logins, cards, bank accounts, Wi-Fi, notes, 2FA and passkeys in one alphabetical list. Copy with the button on the row; swipe right to copy, swipe left to add to favorites." },
  { icon: KeyRound, title: "Autofill and passkeys", desc: "Sign in to apps and browsers with one tap through Android Autofill and Credential Manager. On Android 14 and later SyncPass can store your passkeys." },
  { icon: QrCode, title: "2FA codes next to your passwords (Premium)", desc: "Scan a site's QR code and the 6-digit code lives in the same entry as the password, with a countdown timer; tap to copy. Import accounts from Google Authenticator's export QR." },
  { icon: ShieldCheck, title: "An honest security score", desc: "Weak, reused and leaked passwords (the breach check is Premium) are counted separately. The banner on the home screen and the health screen use the same calculation; \"Fix\" takes you to the item and does not change your password for you." },
  { icon: Fingerprint, title: "Fingerprint unlock", desc: "Open the vault with your fingerprint; the biometric key stays in the Android Keystore." },
  { icon: HardDrive, title: "Backups you control", desc: "Export an encrypted backup file, or put it in your own Google Drive (Premium). Import from other password managers." },
  { icon: Lock, title: "Recovery QR code", desc: "A recovery key that opens the vault if you forget your master password. Print it or keep it on another device in a safe place. We cannot reset it for you, by design." },
  { icon: Wand2, title: "Strong password generator", desc: "Choose the length and character types, see the strength instantly and add it to an item with one tap." },
  { icon: Tablet, title: "Comfortable on tablets", desc: "On a wide screen the bottom bar gives way to a side menu and the content fills the screen. Landscape and portrait both work." },
];

// Mirrors components/Desktop.tsx.
const desktopPoints = [
  { icon: Columns3, title: "Three columns", desc: "Categories, list and details side by side. When the window gets narrow, details open above the list." },
  { icon: Command, title: "Fast from the keyboard", desc: "Ctrl+Shift+P in the app and Ctrl+Shift+Space from anywhere open the quick access window; Ctrl+C copies the password, Ctrl+B the username." },
  { icon: ClipboardX, title: "Stays out of clipboard history", desc: "A copied password is not written to Windows clipboard history or the cloud clipboard." },
  { icon: SunMoon, title: "Follows your Windows theme", desc: "Light and dark themes follow the system; you can pin one in settings." },
];

// Mirrors the "What leaves your device?" box in components/Security.tsx (security whitepaper section 8).
const leaves = [
  { icon: Cloud, title: "Drive sync (optional, Premium)", desc: "If you turn it on, the already encrypted vault file is uploaded to your own Google Drive; once on, this runs automatically (on Android about every 12 hours)." },
  { icon: Search, title: "Password breach check (Premium)", desc: "Only the first 5 characters of the password's SHA-1 hash are sent to Have I Been Pwned (k-anonymity); the password itself is never sent." },
  { icon: Mail, title: "Email breach check (Premium, Android only)", desc: "Runs only if you enter your own Have I Been Pwned key; then, automatically every 7 days, the email addresses found in your vault items are sent to Have I Been Pwned. Without your key this check never runs." },
  { icon: LifeBuoy, title: "In-app help (Android only)", desc: "A question you type into the Android help screen is sent to Google's Gemini service to be answered. Vault contents are never sent. Don't type passwords or personal information there. SyncPass Desktop does not do this." },
  { icon: ShieldCheck, title: "Vault security report (optional, Premium, Android only)", desc: "If you ask for it, summary numbers about your vault (security score, item count, number of weak, reused and leaked passwords, email breach count, which protections are on) are sent to Google's Gemini service to write the report. Passwords, usernames and item names are not sent. SyncPass Desktop does not do this." },
  { icon: KeyRound, title: "Desktop license (SyncPass Desktop only)", desc: "When you activate the license, and then automatically about once a week, your license key, a random device number generated by the app and the app version go to ostlertech.com. Vault contents do not; the free version does not make this connection." },
  { icon: Smartphone, title: "Android system backup (if it is on in your phone)", desc: "Android's own automatic backup saves the app settings to your Google account: the check value and salt used to verify your master password, and the wrapped key for the recovery QR. The vault database and your personal details are not part of this backup." },
];

// Mirrors components/Pricing.tsx.
const free = [`Up to ${FREE_ITEM_LIMIT} items`, "All item types: logins, cards, bank accounts, Wi-Fi, notes, passkeys", "Autofill and passkey provider", "Fingerprint unlock", "Password generator and security score", "Encrypted local backup and recovery QR"];
const premium = ["Unlimited items", "2FA / TOTP codes in the vault", "Encrypted Google Drive backup and restore", "Breach check (Have I Been Pwned)", "Everything in the free version"];

// Turkish FAQ (components/Faq.tsx) plus questions English readers asked about accounts and platforms.
const faq = [
  { q: "Is my vault stored on a server?", a: "No. Your vault is an encrypted database on your phone and we keep no copy of it on our servers. If you turn on Drive backup, the encrypted vault file goes only to your own Google Drive. Features that use the network are listed above." },
  { q: "Which accounts does SyncPass use?", a: "You install SyncPass and buy Premium through Google Play with your Google account, and Drive backup uses your own Google Drive. Your vault is opened by a master password you set on your device, and that password never leaves it." },
  { q: "Can I switch from another password manager?", a: "Yes. You can import the files other managers export from the app's backup screen." },
  { q: "If I cancel Premium, are my items deleted?", a: "No, your items stay in the vault. You cannot add new items beyond the free limit, and Premium features such as 2FA codes and Drive backup turn off; they come back when you subscribe again." },
  { q: "Does it work on both Android and Windows?", a: `Yes. The Android app is on Google Play (${MIN_ANDROID} and later) and SyncPass Desktop for Windows uses the same vault format. There is no iPhone or Mac version, and we are not giving a date for iOS or macOS.` },
  { q: "Can I copy 2FA codes quickly?", a: "With Premium, the current 2FA code sits in the same entry as the password, so you copy both from one place. You can also move your accounts from Google Authenticator by scanning its export QR code." },
  { q: "What happens if I forget my master password?", a: "We cannot reset it because we never know it. Create a recovery QR code in Settings after setting up the vault and keep it somewhere safe; it can unlock the vault from the lock screen." },
  { q: "Is it free?", a: `The free version stores up to ${FREE_ITEM_LIMIT} items and has no ads. Premium adds unlimited items, 2FA codes, Drive backup and breach checks. Prices are shown in Google Play in your local currency.` },
];

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SyncPass",
    operatingSystem: "Android, Windows",
    applicationCategory: "SecurityApplication",
    url: `${SITE_URL}/en/syncpass`,
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

export default function SyncPassEn() {
  return (
    <main lang="en" className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <EnHeader trHref="/syncpass" />

      <section className="section-padding !pt-36">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="eyebrow">SyncPass · Android and Windows</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]"><span className="text-gradient">Your passwords stay on your device.</span></h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-relaxed">
            SyncPass keeps your passwords, cards, passkeys and 2FA codes (Premium) encrypted on your phone. We keep no copy of your vault on our
            servers, and your master password never leaves your device.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={PLAY_URL} className="btn-primary !py-3.5 text-base" rel="noopener">Get it free on Google Play</a>
            <a href="#desktop" className="btn-secondary !py-3.5 text-base">Windows version</a>
          </div>
          <p className="text-xs text-muted">{MIN_ANDROID} and later · {FREE_ITEM_LIMIT} items free · {LANGUAGE_COUNT} languages · No ads</p>
        </div>
      </section>

      {/* Mirrors components/AreaPilotBanner.tsx */}
      <section aria-label="AreaPilot" className="px-6 pb-4">
        <div className="max-w-5xl mx-auto rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-card px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">New · Version 1.0</p>
            <h2 className="text-lg md:text-xl font-bold text-white">AreaPilot: area and perimeter takeoff in AutoCAD</h2>
            <p className="text-sm text-muted">
              It totals closed areas by the codes it reads from the text next to them, writes the results into the drawing and exports to Excel. Free for {AREAPILOT.trialDays} days from first launch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href={AREAPILOT.enPath} className="btn-primary !py-2.5 !px-5 text-sm">Go to the page</a>
            <a href={`${AREAPILOT.enPath}#videolar`} className="inline-flex items-center rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-white hover:border-primary/60 press min-h-[44px]">Watch the video</a>
          </div>
        </div>
      </section>

      <VideoSection lang="en" />

      <section id="whats-new" className="section-padding !pt-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-3">
              <p className="eyebrow">What&apos;s new</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">What changed in recent updates?</h2>
            </div>
            <p className="text-sm text-muted">Android 4.5 · Desktop available (Windows MSI and Microsoft Store)</p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {whatsNew.map((i) => (
              <li key={i.title} className="rounded-2xl border border-line bg-surface p-6">
                <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${i.tag === "Android" ? "bg-ok/10 text-ok" : "bg-primary/10 text-primary"}`}>{i.tag}</span>
                <h3 className="mt-3 font-bold text-white">{i.title}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{i.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="features" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="eyebrow">Android app</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Find it, copy it, move on.</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">The vault screen was redesigned: search is always at the top, filters are one tap away and 2FA codes run live on the home screen.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <article key={f.title} className="glass-card p-7 flex gap-5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><f.icon size={22} /></div>
                <div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-muted leading-relaxed text-sm">{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="desktop" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p className="eyebrow">SyncPass Desktop · Windows</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">The same vault on your computer.</h2>
            <p className="text-lg text-muted">
              The same encryption, vault format and security score as Android. Download it free for Windows, and fill sign-in pages from the vault
              on this computer with the Chrome extension.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {desktopPoints.map((p) => (
              <div key={p.title} className="space-y-2">
                <p.icon className="text-primary" size={22} />
                <h3 className="font-bold text-white">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-md mx-auto text-center space-y-4">
            <a href={MS_STORE_URL} className="btn-primary inline-flex !py-3.5 text-base" target="_blank" rel="noopener">Get it from Microsoft Store</a>
            <p className="text-sm"><a href={DESKTOP_DOWNLOAD.url} className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">Download the installer (.msi)</a></p>
            <p className="text-xs text-muted">Version {DESKTOP_DOWNLOAD.version} · Windows 10 (2004) or Windows 11, 64-bit</p>
            <p className="text-sm text-muted">
              <a href={BROWSER_EXTENSION.chromeUrl} className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light" target="_blank" rel="noopener">Add the extension from the Chrome Web Store →</a>
            </p>
            <p className="pt-2 text-sm text-muted">
              Free version or <span className="text-white font-semibold">Premium</span> (monthly, yearly, lifetime), up to {DESKTOP_LICENSE.devices} computers ·{" "}
              <a href="/en/syncpass-desktop" className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">Details, plans and pricing →</a>
            </p>
          </div>
        </div>
      </section>

      <section id="security" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14">
          <div className="space-y-6">
            <p className="eyebrow">Security</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">You keep the key.</h2>
            <p className="text-lg text-muted leading-relaxed">
              We keep no copy of your vault on our servers. Your vault is an encrypted database on your phone, opened by your
              master password, your fingerprint or your recovery QR code.
            </p>
            <ol className="space-y-4">
              {[
                { t: "Master password", d: "Known only to you. Never stored, never sent anywhere." },
                { t: `PBKDF2 · ${PBKDF2_ITERATIONS.replace(".", ",")} iterations`, d: "Your password is stretched with HMAC-SHA256 into the encryption key, so guessing attempts become expensive." },
                { t: "AES-256-GCM + SQLCipher", d: "Passwords and other sensitive fields are also encrypted one by one; the whole database is encrypted too." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  <span className="font-mono font-bold text-primary">{i + 1}</span>
                  <div><p className="font-bold text-white">{s.t}</p><p className="mt-1 text-muted leading-relaxed">{s.d}</p></div>
                </li>
              ))}
            </ol>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Smartphone, t: "Biometric key in the Android Keystore" },
                { icon: EyeOff, t: "Screenshots and screen recording blocked" },
                { icon: Lock, t: "Copied passwords are marked sensitive and cleared" },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-line bg-surface p-4 text-sm text-foreground/90">
                  <x.icon size={18} className="mb-2 text-primary" />
                  {x.t}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-white">What leaves your device?</h3>
            <p className="text-muted leading-relaxed">Your vault contents never reach us, and your master password and vault key are not sent in any of the cases below. The app also makes connections that carry no vault contents for Google Play purchase checks and passkey verification. The main things that use the network are listed below; some run automatically once you turn them on.</p>
            {leaves.map((l) => (
              <div key={l.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                <l.icon size={20} className="mt-0.5 shrink-0 text-primary" />
                <div><p className="font-semibold text-white">{l.title}</p><p className="mt-1 text-sm text-muted leading-relaxed">{l.desc}</p></div>
              </div>
            ))}
            <a href="/syncpass/privacy#en" className="press flex min-h-[44px] items-center font-semibold text-primary hover:text-primary-light">Full privacy policy →</a>
            <a href="/en/security/whitepaper" className="press flex min-h-[44px] items-center font-semibold text-primary hover:text-primary-light">Full list and technical detail: security and encryption whitepaper →</a>
          </div>
        </div>
      </section>

      <section id="pricing" className="section-padding border-t border-line scroll-mt-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="eyebrow">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Start free.</h2>
            <p className="text-lg text-muted max-w-xl mx-auto">No ads. Move to Premium when your vault grows: monthly, yearly or a one-time lifetime purchase. Prices are shown in Google Play in your local currency.</p>
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
            SyncPass Desktop: free version and {DESKTOP_LICENSE.name.replace("Masaüstü", "Desktop")} for up to {DESKTOP_LICENSE.devices} computers ·{" "}
            <a href="/en/pricing" className="text-primary hover:text-primary-light">Plans and pricing</a>
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
            Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-primary-light">{CONTACT_EMAIL}</a> · <a href="/en/privacy" className="text-primary hover:text-primary-light">Privacy</a> ·{" "}
            <a href="/en/terms" className="text-primary hover:text-primary-light">Terms</a> · <a href="/en/refunds" className="text-primary hover:text-primary-light">Refunds</a>
          </p>
        </div>
      </section>

      <EnFooter />
    </main>
  );
}
