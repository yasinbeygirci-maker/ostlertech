import { PLAY_URL, CONTACT_EMAIL, INSTAGRAM_URL, YOUTUBE_URL, COMPANY } from "@/lib/site";

const columns = [
  {
    title: "SyncPass",
    links: [
      { href: "/syncpass#ozellikler", label: "Özellikler" },
      { href: "/syncpass-masaustu", label: "Masaüstü lisansı" },
      { href: "/syncpass#fiyat", label: "Fiyat" },
      { href: PLAY_URL, label: "Google Play", external: true },
      { href: "/en", label: "English" },
    ],
  },
  {
    title: "Rehberler",
    links: [
      { href: "/guvenli-sifre-olusturucu", label: "Güvenli şifre oluşturucu" },
      { href: "/sifre-yoneticisi", label: "Şifre yöneticisi nerede?" },
      { href: "/passkey-nedir", label: "Passkey nedir?" },
      { href: "/iki-adimli-dogrulama", label: "İki adımlı doğrulama (2FA)" },
      { href: "/guvenlik-kontrol-listesi", label: "Güvenlik kontrol listesi" },
      { href: "/dijital-guvenlik-plani", label: "7 günde dijital güvenlik planı" },
      { href: "/sifre-yoneticisi-karsilastirma", label: "Şifre yöneticisi karşılaştırması" },
      { href: "/guvenlik/sifreleme-belgesi", label: "Güvenlik ve şifreleme belgesi" },
    ],
  },
  {
    title: "OstlerTech",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/products", label: "Ürünler" },
      { href: "/areapilot", label: "AreaPilot (açık beta)" },
      { href: "/videolar", label: "Videolar" },
      { href: "/syncpass#sss", label: "Sık sorulanlar" },
      { href: YOUTUBE_URL, label: "YouTube", external: true },
      { href: INSTAGRAM_URL, label: "Instagram", external: true },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/gizlilik", label: "Gizlilik ve KVKK" },
      { href: "/guvenlik-acigi-bildir", label: "Güvenlik açığı bildir" },
      { href: "/kullanim-sartlari", label: "Kullanım ve satış koşulları" },
      { href: "/teslimat-ve-iade", label: "Teslimat ve iade" },
      { href: "/syncpass/privacy", label: "SyncPass gizlilik" },
      { href: "/diasync/privacy", label: "SyncDia gizlilik" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="section-fade bg-surface">
      <div className="max-w-7xl mx-auto px-5 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <a href="/" className="press flex items-center gap-2.5 min-h-[44px]" aria-label="OstlerTech ana sayfa">
            <img src="/logo-ostlertech.png" alt="" width={28} height={28} className="rounded-full logo-tile" />
            <span className="text-lg font-bold tracking-tight text-white">
              Ostler<span className="text-primary">Tech</span>
            </span>
          </a>
          <p className="text-sm text-muted max-w-xs leading-relaxed">
            Verisini kendisinde tutmak isteyen herkes için güvenlik ve sağlık uygulamaları geliştiriyoruz.
          </p>
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
                    className="press inline-flex min-h-[44px] items-center text-sm text-muted hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="section-fade">
        <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {COMPANY.legalName ? `${COMPANY.legalName} · ` : ""}OstlerTech
          </p>
          <p className="text-xs text-muted">SyncPass Masaüstü lisans satışları yetkili satıcımız Paddle.com, Android satın almaları Google Play üzerinden yapılır.</p>
        </div>
      </div>
    </footer>
  );
}
