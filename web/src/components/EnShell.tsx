// İngilizce sayfaların üst çubuğu ve alt bilgisi (Türkçe Navbar/Footer yerine). Bağlantılar /en sayfasının bölümlerine gider.
import { PLAY_URL } from "@/lib/site";
import SocialLinks from "@/components/SocialLinks";
import EnMenu from "@/components/EnMenu";

const navLinks = [
  { href: "/en#features", label: "Features" },
  { href: "/en#security", label: "Security" },
  { href: "/en#pricing", label: "Pricing" },
  { href: "/en#faq", label: "FAQ" },
  { href: "/en/areapilot", label: "AreaPilot" },
];

/** cta: sağ üst düğme. Verilmezse SyncPass'in Play sayfası; AreaPilot sayfası kendi deneme formunu verir. */
export function EnHeader({ trHref = "/", cta }: { trHref?: string; cta?: { href: string; label: string; menuLabel: string } }) {
  const button = cta ?? { href: PLAY_URL, label: "Get the app", menuLabel: "Get SyncPass on Google Play" };
  const external = !cta;
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-background/80 backdrop-blur-xl" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <a href="/en" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo-ostlertech.png" alt="" width={28} height={28} className="rounded-full logo-tile" />
          <span className="text-lg font-bold tracking-tight text-white">Ostler<span className="text-primary">Tech</span></span>
        </a>
        <nav className="hidden lg:flex items-center gap-8 text-sm text-muted">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm" role="group" aria-label="Language / Dil">
            <a href={trHref} lang="tr" hrefLang="tr" aria-label="Türkçe" className="inline-flex items-center min-h-[44px] text-muted hover:text-white"><span className="sm:hidden">TR</span><span className="hidden sm:inline">Türkçe</span></a>
            <span aria-hidden className="text-muted">|</span>
            <span aria-current="true" lang="en" className="font-semibold text-white"><span className="sm:hidden">EN</span><span className="hidden sm:inline">English</span></span>
          </div>
          <a href={button.href} className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm whitespace-nowrap" {...(external ? { rel: "noopener" } : {})}>{button.label}</a>
          <EnMenu links={navLinks} cta={{ href: button.href, label: button.menuLabel, external }} />
        </div>
      </div>
    </header>
  );
}

const guides = [
  { href: "/en/offline-password-manager", label: "On-device password manager" },
  { href: "/en/password-manager-with-authenticator", label: "Built-in authenticator" },
  { href: "/en/password-manager-comparison", label: "Comparison" },
  { href: "/en/security-checklist", label: "Security checklist" },
  { href: "/en/digital-security-plan", label: "7-day security plan" },
  { href: "/en/if-your-phone-is-stolen", label: "If your phone is stolen" },
  { href: "/en/security/whitepaper", label: "Security whitepaper" },
];

export function EnFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-5 py-10 flex flex-col gap-6 text-sm text-muted">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <span className="text-foreground font-semibold">Guides</span>
          {guides.map((g) => <a key={g.href} href={g.href} className="hover:text-white">{g.label}</a>)}
        </nav>
        <SocialLinks lang="en" />
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OstlerTech · Privacy-first apps that keep your data with you.</p>
          <nav className="flex flex-wrap gap-5">
            <a href="/en/pricing" className="hover:text-white">Pricing</a>
            <a href="/en/areapilot" className="hover:text-white">AreaPilot</a>
            <a href="/en/privacy" className="hover:text-white">Privacy</a>
            <a href="/en/terms" className="hover:text-white">Terms</a>
            <a href="/en/refunds" className="hover:text-white">Refunds</a>
            <a href="/en/report-vulnerability" className="hover:text-white">Report a vulnerability</a>
            <a href="/" lang="tr" hrefLang="tr" className="hover:text-white">Türkçe</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
