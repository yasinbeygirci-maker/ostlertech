import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EnHeader, EnFooter } from "@/components/EnShell";
import { URUNLER, OYUN_IDS, urunMetni, type Dil, type Urun } from "@/lib/urunler";
import { HeartPulse, Store, Kanban, ShieldCheck, Monitor, Clock, Sparkles, Layers, ArrowRight, Gamepad2 } from "lucide-react";

// Ürünler sayfası (/products ve /en/products). Metinler lib/urunler.ts'ten, iki dil aynı listeden.

const METIN = {
  tr: {
    baslik: "Ürünlerimiz",
    giris: "Şifre yönetiminden sağlık takibine, küçük işletmelerden proje yönetimine: yayında olan ve hazırlanan uygulamalarımız ve oyunlarımız.",
    uygulamalar: "Uygulamalar",
    oyunlar: "Oyunlar",
    oyunNotu: "Oyunlarımız reklam içerir; her kartta hangi reklamın gösterildiği yazılıdır.",
    platform: "Platform",
    ayrinti: "Ayrıntılar",
    hazirlaniyor: "Hazırlanıyor",
    durum: { yayinda: "Yayında", test: "Test aşamasında", beta: "Açık beta", yakinda: "Yakında" } as Record<string, string>,
    simge: (ad: string) => `${ad} simgesi`,
  },
  en: {
    baslik: "Our products",
    giris: "From password management to health tracking, from small shops to construction sites: the apps and games we have released and the ones we are preparing.",
    uygulamalar: "Apps",
    oyunlar: "Games",
    oyunNotu: "Our games contain ads; each card says which ads are shown.",
    platform: "Platform",
    ayrinti: "Details",
    hazirlaniyor: "In preparation",
    durum: { yayinda: "Available", test: "In testing", beta: "Open beta", yakinda: "Coming soon" } as Record<string, string>,
    simge: (ad: string) => `${ad} icon`,
  },
};

const DURUM_CLS: Record<string, string> = {
  yayinda: "bg-ok/10 border-ok/30 text-ok",
  test: "bg-primary/10 border-primary/30 text-primary",
  beta: "bg-primary/10 border-primary/30 text-primary",
  yakinda: "bg-white/[0.04] border-line text-muted",
};

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>> = {
  HeartPulse,
  Store,
  Kanban,
  ShieldCheck,
  Monitor,
  Gamepad2,
};

export default function ProductsView({ lang }: { lang: Dil }) {
  const t = METIN[lang];
  const uygulamalar = URUNLER.filter((u) => !OYUN_IDS.has(u.id));
  const oyunlar = URUNLER.filter((u) => OYUN_IDS.has(u.id));
  const bolumler = [
    { baslik: t.uygulamalar, liste: uygulamalar, not: null as string | null },
    { baslik: t.oyunlar, liste: oyunlar, not: t.oyunNotu },
  ];
  return (
    <main lang={lang} className="min-h-screen bg-background overflow-x-hidden text-white">
      {lang === "en" ? <EnHeader trHref="/products" /> : <Navbar />}

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl mb-6 shadow-lg shadow-black/40">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-sm font-semibold text-white/80">OstlerTech</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-primary-dark">{t.baslik}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/60 font-normal leading-relaxed">{t.giris}</p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {bolumler.map((bolum) => (
            <div key={bolum.baslik} className="mb-20 last:mb-0">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-3">{bolum.baslik}</h2>
              {bolum.not && <p className="text-sm text-white/60 mb-8">{bolum.not}</p>}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${bolum.not ? "" : "mt-8"}`}>
                {bolum.liste.map((urun: Urun) => {
                  const IconComponent = iconMap[urun.ikon] || Layers;
                  const m = urunMetni(urun, lang);
                  const durumEtiket = t.durum[urun.durum] ?? t.durum.yakinda;
                  const durumCls = DURUM_CLS[urun.durum] ?? DURUM_CLS.yakinda;

                  return (
                    <div
                      key={urun.id}
                      className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 rounded-3xl p-8 transition-all duration-500 flex flex-col justify-between shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-primary/5 backdrop-blur-xl"
                    >
                      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-150 transition-opacity duration-500" />

                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110"
                            style={{
                              backgroundColor: `${urun.renk}15`,
                              color: urun.renk,
                              boxShadow: `0 8px 25px -5px ${urun.renk}25`,
                            }}
                          >
                            {urun.gorsel ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={urun.gorsel} alt={t.simge(m.ad)} width={56} height={56} className="w-14 h-14 rounded-2xl" />
                            ) : (
                              <IconComponent size={28} />
                            )}
                          </div>

                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${durumCls}`}>
                            {urun.durum === "yakinda" && <Clock size={13} />}
                            <span>{durumEtiket}</span>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-primary transition-colors duration-300">{m.ad}</h3>

                        <p className="text-sm font-semibold text-primary/90 mb-4 leading-snug">{m.slogan}</p>

                        <p className="text-sm text-white/60 leading-relaxed mb-6 font-normal">{m.aciklama}</p>
                      </div>

                      <div className="pt-6 border-t border-white/[0.06] flex flex-col gap-4">
                        <div className="flex items-center justify-between text-xs text-white/50 font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: urun.renk }} />
                            {t.platform}
                          </span>
                          <span className="text-white/80 text-sm font-semibold px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">{m.platform}</span>
                        </div>
                        {m.reklam && <p className="text-sm text-white/60">{m.reklam}</p>}

                        {m.url ? (
                          <a
                            href={m.url}
                            {...(m.url.startsWith("http") && !m.url.endsWith(".msi") ? { target: "_blank", rel: "noopener" } : {})}
                            className={urun.durum === "yayinda" ? "btn-primary w-full" : "btn-secondary w-full"}
                          >
                            {m.cta ?? t.ayrinti}
                            <ArrowRight size={16} />
                          </a>
                        ) : (
                          <div className="w-full py-3 px-4 rounded-full border border-line text-center text-sm font-semibold text-muted">{t.hazirlaniyor}</div>
                        )}

                        {m.ekler && (
                          <div className="flex flex-col gap-1.5 text-sm">
                            {m.ekler.map((e) => (
                              <a
                                key={e.url}
                                href={e.url}
                                {...(e.url.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                                className="inline-flex min-h-[44px] items-center text-primary hover:text-primary-light"
                              >
                                {e.etiket} →
                              </a>
                            ))}
                          </div>
                        )}

                        {m.not && <p className="text-xs text-white/50 leading-relaxed">{m.not}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {lang === "en" ? <EnFooter /> : <Footer />}
    </main>
  );
}
