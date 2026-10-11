// İngilizce sayfaların üst çubuğu ve alt bilgisi (Türkçe Navbar/Footer yerine). Bağlantılar /en sayfasının bölümlerine gider.
import { PLAY_URL } from "@/lib/site";

export function EnHeader({ trHref = "/" }: { trHref?: string }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-background/80 backdrop-blur-xl" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <a href="/en" className="flex items-center gap-2.5">
          <img src="/logo-ostlertech.png" alt="" width={28} height={28} className="rounded-full" />
          <span className="text-lg font-bold tracking-tight text-white">Ostler<span className="text-primary">Tech</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="/en#features" className="hover:text-white">Features</a>
          <a href="/en#security" className="hover:text-white">Security</a>
          <a href="/en#pricing" className="hover:text-white">Pricing</a>
          <a href="/en#faq" className="hover:text-white">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href={trHref} lang="tr" hrefLang="tr" className="text-sm text-muted hover:text-white">Türkçe</a>
          <a href={PLAY_URL} className="btn-primary !py-2 !px-4 text-sm" rel="noopener">Get the app</a>
        </div>
      </div>
    </header>
  );
}

const guides = [
  { href: "/en/offline-password-manager", label: "Offline password manager" },
];

export function EnFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-5 py-10 flex flex-col gap-6 text-sm text-muted">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <span className="text-foreground font-semibold">Guides</span>
          {guides.map((g) => <a key={g.href} href={g.href} className="hover:text-white">{g.label}</a>)}
        </nav>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OstlerTech · Privacy-first apps that keep your data with you.</p>
          <nav className="flex flex-wrap gap-5">
            <a href="/en/privacy" className="hover:text-white">Privacy</a>
            <a href="/en/terms" className="hover:text-white">Terms</a>
            <a href="/en/refunds" className="hover:text-white">Refunds</a>
            <a href="/" lang="tr" hrefLang="tr" className="hover:text-white">Türkçe</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
