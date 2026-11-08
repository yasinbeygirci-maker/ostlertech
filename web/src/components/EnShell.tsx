// İngilizce sayfaların üst çubuğu ve alt bilgisi (Türkçe Navbar/Footer'ın karşılığı). Menü ve sütunlar Türkçeyle aynı sırada;
// Türkçe tarafa bağlantı eklenirse burada da İngilizce karşılığı eklenir.
import { PLAY_URL, MS_STORE_URL, CONTACT_EMAIL, INSTAGRAM_URL, YOUTUBE_URL, COMPANY } from "@/lib/site";
import SocialLinks from "@/components/SocialLinks";
import EnMenu from "@/components/EnMenu";

// Navbar.tsx'teki links dizisinin karşılığı.
const navLinks = [
  { href: "/en/syncpass#features", label: "Features" },
  { href: "/en/syncpass#desktop", label: "Desktop" },
  { href: "/en/syncpass#security", label: "Security" },
  { href: "/en/syncpass#pricing", label: "Pricing" },
  { href: "/en/products", label: "Products" },
  { href: "/en/areapilot", label: "AreaPilot" },
  { href: "/en/videos", label: "Videos" },
  { href: "/en/contact", label: "Contact" },
];

/** cta: sağ üst düğme. Verilmezse SyncPass'in Play sayfası; AreaPilot sayfası kendi deneme formunu verir. */
export function EnHeader({ trHref = "/", cta }: { trHref?: string; cta?: { href: string; label: string; menuLabel: string } }) {
  const button = cta ?? { href: PLAY_URL, label: "Get SyncPass", menuLabel: "SyncPass: Get it on Google Play" };
  const external = !cta;
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-background/80 backdrop-blur-xl" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <a href="/en" className="flex items-center gap-2.5 shrink-0 min-h-[44px]" aria-label="OstlerTech home">
          <img src="/logo-ostlertech.png" alt="" width={28} height={28} className="rounded-full logo-tile" />
          <span className="text-lg font-bold tracking-tight text-white">Ostler<span className="text-primary">Tech</span></span>
        </a>
        <nav className="hidden xl:flex items-center gap-6 text-sm text-muted">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="inline-flex items-center min-h-[44px] hover:text-white">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm" role="group" aria-label="Language / Dil">
            <a href={trHref} lang="tr" hrefLang="tr" aria-label="Türkçe" className="inline-flex items-center min-h-[44px] text-muted hover:text-white"><span className="sm:hidden">TR</span><span className="hidden sm:inline">Türkçe</span></a>
            <span aria-hidden className="text-muted">|</span>
            <span aria-current="true" lang="en" className="font-semibold text-white"><span className="sm:hidden">EN</span><span className="hidden sm:inline">English</span></span>
          </div>
          <a href={button.href} className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm whitespace-nowrap" {...(external ? { target: "_blank", rel: "noopener" } : {})}>{button.label}</a>
          <EnMenu links={navLinks} cta={{ href: button.href, label: button.menuLabel, external }} />
        </div>
      </div>
    </header>
  );
}

// Footer.tsx'teki sütunların karşılığı. Türkçesi olmayan sayfa (SyncDia gizlilik) "(Turkish)" notuyla Türkçe sayfaya gider.
const columns = [
  {
    title: "SyncPass",
    links: [
      { href: "/en/syncpass#features", label: "Features" },
      { href: "/en/syncpass-desktop", label: "SyncPass Desktop" },
      { href: "/en/syncpass#pricing", label: "Pricing" },
      { href: PLAY_URL, label: "Google Play", external: true },
      { href: MS_STORE_URL, label: "Microsoft Store (Windows)", external: true },
      { href: "/syncpass", label: "Türkçe", lang: "tr" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/en/offline-password-manager", label: "On-device password manager" },
      { href: "/en/password-manager-with-authenticator", label: "Built-in authenticator" },
      { href: "/en/security-checklist", label: "Security checklist" },
      { href: "/en/digital-security-plan", label: "7-day security plan" },
      { href: "/en/if-your-phone-is-stolen", label: "If your phone is stolen" },
      { href: "/en/password-manager-comparison", label: "Password manager comparison" },
      { href: "/en/security/whitepaper", label: "Security whitepaper" },
    ],
  },
  {
    title: "OstlerTech",
    links: [
      { href: "/en/about", label: "About us" },
      { href: "/en/contact", label: "Contact" },
      { href: "/en/products", label: "Products" },
      { href: "/en/areapilot", label: "AreaPilot" },
      { href: "/en/videos", label: "Videos" },
      { href: "/en/syncpass#faq", label: "FAQ" },
      { href: YOUTUBE_URL, label: "YouTube", external: true },
      { href: INSTAGRAM_URL, label: "Instagram", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/en/privacy", label: "Privacy" },
      { href: "/en/report-vulnerability", label: "Report a vulnerability" },
      { href: "/en/terms", label: "Terms of use and sale" },
      { href: "/en/refunds", label: "Delivery and refunds" },
      { href: "/syncpass/privacy#en", label: "SyncPass privacy" },
      { href: "/diasync/privacy", label: "SyncDia privacy (Turkish)", lang: "tr" },
    ],
  },
];

export function EnFooter() {
  return (
    <footer lang="en" className="border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-5 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <a href="/en" className="flex items-center gap-2.5 min-h-[44px]" aria-label="OstlerTech home">
            <img src="/logo-ostlertech.png" alt="" width={28} height={28} loading="lazy" decoding="async" className="rounded-full logo-tile" />
            <span className="text-lg font-bold tracking-tight text-white">Ostler<span className="text-primary">Tech</span></span>
          </a>
          <p className="text-sm text-muted max-w-xs leading-relaxed">Privacy-first apps for individuals and small businesses who want to keep their data with them.</p>
          <p className="text-sm text-muted">{CONTACT_EMAIL}</p>
          {COMPANY.phone && <p className="text-sm text-muted">{COMPANY.phone}</p>}
        </div>

        {columns.map((c) => (
          <div key={c.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{c.title}</h4>
            <ul className="mt-3 space-y-0">
              {c.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    {...("external" in l && l.external ? { target: "_blank", rel: "noopener" } : {})}
                    {...("lang" in l && l.lang ? { hrefLang: l.lang } : {})}
                    className="inline-flex min-h-[44px] items-center text-sm text-muted hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-5 pb-12">
        <SocialLinks lang="en" />
      </div>
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {COMPANY.legalName ? `${COMPANY.legalName} · ` : ""}OstlerTech
          </p>
          <p className="text-xs text-muted">SyncPass Desktop and AreaPilot licenses are sold through our online reseller Paddle.com; SyncPass Android purchases are made through Google Play.</p>
        </div>
      </div>
    </footer>
  );
}
