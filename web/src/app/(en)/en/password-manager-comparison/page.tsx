import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { PLAY_URL, FREE_ITEM_LIMIT, DESKTOP_DOWNLOAD } from "@/lib/site";
import { paylasimMeta } from "@/lib/paylasim-meta";

// Yasin kararı (2026-11-04, yeniden 2026-11-08): rakip ürün adı YOK; sayfa kategori karşılaştırmasıdır (cloud-vault / local-file
// open-source / SyncPass). Neden: Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği md. 8/1-a (Zeynep). Adres değişmedi (SEO).
// TR eşi: /sifre-yoneticisi-karsilastirma. Ürün/marka adı ekleme; tests/icerik.test.ts sayfa kaynağındaki yasak adları denetler.
// SyncPass satırları yayındaki koddan (Android 4.5.21 main, masaüstü sync-alignment, 2026-11-08): ücretsiz sınır 15; 2FA ve Drive
// eşitleme Premium; geçiş anahtarı sağlayıcısında Premium kapısı yok (Android 14+), masaüstü geçiş anahtarını yalnız gösterir
// (CloudItemCodec: "created and edited only on the phone"). İçe aktarma: Android UniversalImporter/CsvImporter/OtpImport.
const TITLE = "Password Manager Comparison by Category";
const DESCRIPTION =
  "Compare cloud-vault and local-file password managers with SyncPass, category by category: where the vault lives, accounts, sync, devices and the free version.";
const PATH = "/en/password-manager-comparison";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH, languages: { tr: "/sifre-yoneticisi-karsilastirma", en: PATH } },
  // openGraph tek başına verilince kök düzenin görseli düşüyordu (og:image yoktu); paylasimMeta görseli de verir.
  ...paylasimMeta({ title: TITLE, description: DESCRIPTION, path: PATH, lang: "en" }),
};

const columns = ["SyncPass", "Cloud-vault managers", "Local-file, open-source managers"] as const;

const rows: { label: string; values: [string, string, string] }[] = [
  { label: "Where the vault lives", values: ["An encrypted database on your phone, an encrypted file on your computer; we keep no copy on our servers", "Encrypted on the provider's servers", "An encrypted file on your computer"] },
  { label: "Account needed", values: ["No SyncPass account needed to get started", "Usually an account with the provider", "No account"] },
  { label: "Devices", values: ["Android and Windows (no iOS, macOS or Linux version)", "Varies by product; most have a phone app", "Varies by product; separate apps may open the same file on a phone"] },
  { label: "Sync between devices", values: ["Optional, through your own Google Drive (Premium)", "Automatic through the provider", "You move the file yourself or sync it through a cloud folder"] },
  { label: "2FA codes (TOTP)", values: ["Yes (Premium)", "Varies by product and plan", "Varies by product"] },
  { label: "Passkeys", values: ["Free on Android 14 and later; Windows only shows passkeys and cannot create them", "Varies by product", "Varies by product"] },
  { label: "Sharing and family plans", values: ["No", "Varies by product", "Varies by product"] },
  { label: "Source code", values: ["Not open source; no independent security audit", "Varies by product", "Open"] },
  { label: "Free version", values: [`Up to ${FREE_ITEM_LIMIT} items`, "Varies by product and plan", "Varies by product"] },
];

const picks = [
  { who: "You want every device in sync with no setup", pick: "Cloud-vault managers", why: "The vault sits encrypted on the provider's servers and syncs automatically between your devices. You usually need an account with the provider." },
  { who: "You want a free, open-source tool that works fully locally on a computer", pick: "Local-file, open-source managers", why: "A local file and no account. You choose how to sync it and which phone app opens it." },
  { who: "You use Android and Windows and want your vault encrypted on your own devices", pick: "SyncPass", why: "A local encrypted vault on the phone and the computer, optional sync only through your own Google Drive, with passkeys (Android 14 and later), plus 2FA codes and breach checks (Premium), in the same app." },
  { who: "You use an iPhone, Mac or Linux, want to share a vault with family or a team, or need open-source code", pick: "Another category", why: "SyncPass is not the right fit for now: it has no iOS, macOS or Linux version and no shared vaults, and its source code is not open." },
];

const faq = [
  { q: "Should I pick a cloud-vault or a local-file manager?", a: "They are built for different needs. In cloud-vault managers the encrypted vault sits on the provider's servers, which suits people who want automatic sync. In local-file, open-source managers the vault is a file on your computer, which suits people who want to work locally and choose their own sync and phone app. SyncPass is for people on Android and Windows: the vault is encrypted on your device and sync, if you want it, goes through your own Google Drive. SyncPass has no iOS version, no sharing and no open-source code." },
  { q: "How do I tell whether a password manager is safe?", a: "This page does not rank anything, and we do not claim one approach is better than another. Things you can check: where the vault is stored, whether the source code is open, whether an independent audit is public, and how strong your master password is. SyncPass's code is closed and it has not had an independent security audit; the vault is encrypted on your device." },
  { q: "Is SyncPass open source?", a: "No. SyncPass's source code is not published under a public license. If you need open-source code that anyone can audit, choose a password manager with an open-source license." },
  { q: "I use an iPhone or a Mac. Can I use SyncPass?", a: "Not at the moment. SyncPass is available for Android and Windows; there is no iOS, macOS or Linux version. If you use an iPhone, a password manager with an iOS app is a better fit." },
  { q: "Can I move my passwords to SyncPass from another manager?", a: "In most cases, yes. SyncPass for Android and SyncPass Desktop import the CSV files that browsers and many password managers export; the list of supported sources is on the app's import screen. On Android you can also bring in 2FA accounts from standard 2FA setup QR codes and from the export QR code of Google Authenticator (Transfer accounts). If you are moving from a source that is not on the list, try a small test first." },
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
      <EnHeader trHref="/sifre-yoneticisi-karsilastirma" />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Password manager comparison: cloud vaults, local files and SyncPass</h1>
          <p className="text-lg text-muted leading-relaxed">
            We make SyncPass, so read this with that in mind. This page does not evaluate or rank specific products. It groups password
            managers into two common approaches, cloud-vault managers and local-file, open-source managers, and puts SyncPass next to them.
            They differ mainly in where the vault lives, which devices they run on, what the free version covers and whether the source code is open.
          </p>
          <p className="text-sm text-muted">
            Last checked: November 2026. SyncPass details come from our own code (SyncPass for Android 4.5, SyncPass Desktop 1.4). The category
            columns are general; individual products differ, so check the product you are considering on its own page.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Side by side</h2>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[48rem] text-sm">
              <thead className="bg-surface text-white text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold w-44"> </th>
                  {columns.map((p) => (
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
          <p className="text-muted leading-relaxed">These are matches to needs, not a ranking.</p>
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
            Where SyncPass falls short: no iPhone or Mac app, no shared family vaults, not open source, no independent security audit, and a
            free version limited to {FREE_ITEM_LIMIT} items.
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
          <h2 className="mt-12 text-2xl font-extrabold tracking-tight text-white">About this page</h2>
          <p className="mt-3 text-muted leading-relaxed">
            This comparison is by category and does not evaluate specific products. Features and plans change over time: judge by your own needs and check
            the product you are considering on its own page. If you see wrong or outdated information,{" "}
            <a href="/en/contact" className="text-primary hover:text-primary-light">tell us</a> and we will correct it.
          </p>
          <p className="mt-4 text-sm text-muted">
            Google, Android, Google Play, Google Drive and Google Authenticator are trademarks of Google LLC. Windows is a trademark of the Microsoft
            group of companies. iPhone, Mac and macOS are trademarks of Apple Inc., registered in the U.S. and other countries and regions. IOS is a
            trademark or registered trademark of Cisco in the U.S. and other countries and is used under license. Linux is the registered trademark of
            Linus Torvalds in the U.S. and other countries. Other product names may be trademarks of their owners.
          </p>
          <p className="mt-8 text-center text-sm text-muted">
            Related: <a href="/en/offline-password-manager" className="text-primary hover:text-primary-light">on-device password manager</a>
            {" · "}<a href="/en/password-manager-with-authenticator" className="text-primary hover:text-primary-light">built-in authenticator</a>
          </p>
        </div>
      </section>

      <EnFooter />
    </main>
  );
}
