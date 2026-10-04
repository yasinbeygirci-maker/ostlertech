import { PLAY_URL, CONTACT_EMAIL, INSTAGRAM_URL, YOUTUBE_URL, COMPANY } from "@/lib/site";

const columns = [
  {
    title: "SyncPass",
    links: [
      { href: "/#ozellikler", label: "Özellikler" },
      { href: "/syncpass-masaustu", label: "Masaüstü lisansı" },
      { href: "/#fiyat", label: "Fiyat" },
      { href: PLAY_URL, label: "Google Play", external: true },
    ],
  },
  {
    title: "OstlerTech",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/products", label: "Ürünler" },
      { href: "/videolar", label: "Videolar" },
      { href: "/#sss", label: "Sık sorulanlar" },
      { href: YOUTUBE_URL, label: "YouTube", external: true },
      { href: INSTAGRAM_URL, label: "Instagram", external: true },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/gizlilik", label: "Gizlilik ve KVKK" },
      { href: "/kullanim-sartlari", label: "Kullanım ve satış koşulları" },
      { href: "/teslimat-ve-iade", label: "Teslimat ve iade" },
      { href: "/syncpass/privacy", label: "SyncPass gizlilik" },
      { href: "/diasync/privacy", label: "DiaSync gizlilik" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-5 py-16 grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo-ostlertech.png" alt="" width={28} height={28} className="rounded-full" />
            <span className="text-lg font-bold tracking-tight text-white">
              Ostler<span className="text-primary">Tech</span>
            </span>
          </a>
          <p className="text-sm text-muted max-w-xs leading-relaxed">
            Verisini kendisinde tutmak isteyen insanlar için güvenlik ve sağlık uygulamaları geliştiriyoruz.
          </p>
          <p className="text-sm text-muted">{CONTACT_EMAIL}</p>
        </div>

        {columns.map((c) => (
          <div key={c.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{c.title}</h4>
            <ul className="mt-4 space-y-3">
              {c.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    {...("external" in l && l.external ? { target: "_blank", rel: "noopener" } : {})}
                    className="text-sm text-muted hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {COMPANY.legalName ? `${COMPANY.legalName} · ` : ""}OstlerTech
          </p>
          <p className="text-xs text-muted">Satışlar yetkili satıcımız Paddle.com üzerinden yapılır.</p>
        </div>
      </div>
    </footer>
  );
}
