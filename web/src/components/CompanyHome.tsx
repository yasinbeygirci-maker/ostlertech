import { ArrowRight, Clock, Gamepad2, HeartPulse, Kanban, Layers, Lock, Mail, Monitor, ShieldCheck, Store, FileCheck2 } from "lucide-react";
import { URUNLER, OYUN_IDS, urunMetni, type Dil, type Urun } from "@/lib/urunler";
import { AREAPILOT } from "@/lib/areapilot";
import { COMPANY } from "@/lib/site";

// Şirket vitrini bölümleri (/ ve /en). Metinler Hakkımızda, Güvenlik ve ürün verisinden (urunler.ts) alınır; yeni iddia yok.
// İki dil aynı bileşenden: TR metni değişirse EN karşılığı aynı yerde, yan yana güncellenir.

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShieldCheck, Monitor, Layers, HeartPulse, Store, Kanban, Gamepad2,
};

const DURUM_CLS: Record<string, string> = {
  yayinda: "bg-ok/10 text-ok",
  test: "bg-primary/10 text-primary-light",
  beta: "bg-primary/10 text-primary-light",
  yakinda: "bg-white/[0.06] text-muted",
};

const T = {
  tr: {
    durum: { yayinda: "Yayında", test: "Test aşamasında", beta: "Açık beta", yakinda: "Yakında" } as Record<string, string>,
    heroEyebrow: "OstlerTech · Bağımsız yazılım stüdyosu",
    heroBaslik1: "Verisini kendinde tutmak",
    heroBaslik2: " isteyenler için uygulamalar.",
    heroGiris:
      "Türkiye'de kurulu bağımsız bir yazılım stüdyosuyuz. Bireyler ve küçük işletmeler için sade ve güvenli uygulamalar geliştiriyoruz: şifre yöneticisi, AutoCAD alan metrajı, esnaf defteri ve şantiye kaydı.",
    heroUrunler: "Uygulamalarımız",
    heroSyncPass: "SyncPass şifre yöneticisi",
    syncpassHref: "/syncpass",
    desktopHref: "/syncpass-masaustu",
    kartSyncPass: "SyncPass'i tanı",
    kartDesktop: "Ayrıntılar ve fiyatlar",
    kartAreaPilot: "AreaPilot sayfası",
    kartPlay: "Google Play'den indir",
    kartTest: "Test sürecinde",
    kartHazir: "Hazırlanıyor",
    urunEyebrow: "Uygulamalarımız",
    urunBaslik: "Yayında olanlar ve hazırlananlar",
    urunGiris: "Her kartta uygulamanın durumu yazılıdır: yayında, test aşamasında ya da yakında.",
    oyunBaslik: "Oyunlar",
    oyunNotu: "Oyunlarımız reklam içerir; her kartta hangi reklamın gösterildiği yazılıdır.",
    tumUrunler: "Tüm ürünler →",
    urunlerHref: "/products",
    guvenEyebrow: "Gizlilik ve güven",
    guvenBaslik: "Verilerin sende.",
    guven: [
      { title: "Kasa cihazında", desc: "SyncPass kasan telefonundaki şifreli bir veritabanıdır. Kasanın kopyası sunucularımızda tutulmaz; ana şifreni bizimle paylaşmazsın." },
      { title: "Ne çıkar, açıkça yazılı", desc: "Kasa içeriği bize gelmez. Cihazdan çıkan her bağlantı (örneğin Google Play satın alma kontrolü) gizlilik politikasında tek tek anlatılır." },
      { title: "Söylediğimizi yaparız", desc: "Sitede ve mağazada yalnızca uygulamada gerçekten olan özellikleri anlatırız." },
    ],
    gizlilik: { href: "/gizlilik", label: "Gizlilik ve KVKK →" },
    guvenlik: { href: "/syncpass#guvenlik", label: "SyncPass güvenlik ayrıntıları →" },
    hakEyebrow: "Hakkımızda",
    hakMetin:
      "OstlerTech, Türkiye'de kurulu bağımsız bir yazılım stüdyosu. Verisini kendisinde tutmak isteyen bireyler ve küçük işletmeler için sade ve güvenli uygulamalar geliştiriyoruz.",
    hakLink: { href: "/hakkimizda", label: "Hakkımızda sayfası →" },
    iletisim: "İletişim",
    iletisimMetin: "Soru, öneri ve destek için bize e-posta yazabilirsin.",
    firma: { href: "/iletisim", label: "Firma bilgileri →" },
  },
  en: {
    durum: { yayinda: "Available", test: "In testing", beta: "Open beta", yakinda: "Coming soon" } as Record<string, string>,
    heroEyebrow: "OstlerTech · Independent software studio",
    heroBaslik1: "Apps for people who want",
    heroBaslik2: " to keep their data with them.",
    heroGiris:
      "We are an independent software studio based in Türkiye. We build simple, secure apps for individuals and small businesses: a password manager, area takeoff for AutoCAD, a credit ledger for small shops and a construction site log.",
    heroUrunler: "Our apps",
    heroSyncPass: "SyncPass password manager",
    syncpassHref: "/en/syncpass",
    desktopHref: "/en/syncpass-desktop",
    kartSyncPass: "Discover SyncPass",
    kartDesktop: "Details and pricing",
    kartAreaPilot: "AreaPilot page",
    kartPlay: "Get it on Google Play",
    kartTest: "In testing",
    kartHazir: "In preparation",
    urunEyebrow: "Our apps",
    urunBaslik: "Released and in preparation",
    urunGiris: "Each card shows where the app stands: available, in testing or coming soon.",
    oyunBaslik: "Games",
    oyunNotu: "Our games contain ads; each card says which ads are shown.",
    tumUrunler: "All products →",
    urunlerHref: "/en/products",
    guvenEyebrow: "Privacy and trust",
    guvenBaslik: "Your data stays with you.",
    guven: [
      { title: "Your vault is on your device", desc: "Your SyncPass vault is an encrypted database on your phone. We keep no copy of your vault on our servers, and you never share your master password with us." },
      { title: "What leaves your device is written down", desc: "Your vault contents never come to us. Every connection the app makes (for example the Google Play purchase check) is described one by one in the privacy policy." },
      { title: "We do what we say", desc: "On our site and in the stores we describe only features that are really in the app." },
    ],
    gizlilik: { href: "/en/privacy", label: "Privacy policy →" },
    guvenlik: { href: "/en/syncpass#security", label: "SyncPass security details →" },
    hakEyebrow: "About us",
    hakMetin:
      "OstlerTech is an independent software studio based in Türkiye. We build simple, secure apps for individuals and small businesses who want to keep their data with them.",
    hakLink: { href: "/en/about", label: "About us →" },
    iletisim: "Contact",
    iletisimMetin: "Email us with questions, suggestions or support requests.",
    firma: { href: "/en/contact", label: "Business details →" },
  },
};

export function CompanyHero({ lang = "tr" }: { lang?: Dil }) {
  const t = T[lang];
  return (
    <section className="relative isolate pt-32 md:pt-40 pb-12 md:pb-16 px-5 overflow-hidden">
      <div aria-hidden className="absolute -z-10 top-[-15%] right-[-10%] h-[620px] w-[620px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-rise">
        <p className="eyebrow">{t.heroEyebrow}</p>
        <h1 className="text-4xl sm:text-6xl xl:text-[4.25rem] font-extrabold tracking-[-0.02em] leading-[1.15]">
          <span className="text-gradient">
            {t.heroBaslik1}
            <br className="hidden sm:block" />
            {t.heroBaslik2}
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-[1.5]">{t.heroGiris}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#urunler" className="btn-primary !px-7 !min-h-[48px] text-base">
            {t.heroUrunler}
            <ArrowRight size={18} />
          </a>
          <a href={t.syncpassHref} className="btn-secondary !px-7 !min-h-[48px] text-base">
            {t.heroSyncPass}
          </a>
        </div>
      </div>
    </section>
  );
}

function UrunKarti({ u, lang }: { u: Urun; lang: Dil }) {
  const t = T[lang];
  const m = urunMetni(u, lang);
  const Icon = ICONS[u.ikon] ?? Layers;
  const durumEtiket = t.durum[u.durum] ?? t.durum.yakinda;
  const durumCls = DURUM_CLS[u.durum] ?? DURUM_CLS.yakinda;
  const syncpass = u.id === "syncpass";
  const oyunVeyaPlay = u.id === "cornertab" || OYUN_IDS.has(u.id);
  const href = syncpass ? t.syncpassHref : u.id === "syncpassdesktop" ? t.desktopHref : u.id === "areapilot" ? (lang === "en" ? AREAPILOT.enPath : AREAPILOT.path) : oyunVeyaPlay ? m.url : null;
  const dis = href?.startsWith("http");
  const etiket = syncpass ? t.kartSyncPass : u.id === "syncpassdesktop" ? t.kartDesktop : u.id === "areapilot" ? t.kartAreaPilot : oyunVeyaPlay ? t.kartPlay : null;

  return (
    <article className="card-soft rounded-3xl p-6 md:p-7 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-primary-light bg-primary/10">
          {u.gorsel ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u.gorsel} alt="" width={48} height={48} className="h-12 w-12 rounded-2xl" />
          ) : (
            <Icon size={24} />
          )}
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${durumCls}`}>
          {u.durum === "yakinda" && <Clock size={12} aria-hidden />}
          {durumEtiket}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-bold text-white">{m.ad}</h3>
      <p className="mt-1 text-sm font-semibold text-primary-light leading-snug">{m.slogan}</p>
      <p className="mt-3 text-sm text-muted leading-[1.55] flex-1">{m.aciklama}</p>
      <p className="mt-4 text-sm text-muted">{m.platform}</p>
      {m.reklam && <p className="mt-1 text-sm text-muted">{m.reklam}</p>}
      <div className="mt-4">
        {href && etiket ? (
          <a
            href={href}
            {...(dis ? { target: "_blank", rel: "noopener" } : {})}
            className={`${syncpass || u.durum === "yayinda" ? "btn-primary" : "btn-secondary"} w-full`}
          >
            {etiket}
            <ArrowRight size={16} />
          </a>
        ) : (
          <div className="flex min-h-[44px] items-center justify-center rounded-full border border-line text-sm font-semibold text-muted">
            {u.durum === "test" ? t.kartTest : t.kartHazir}
          </div>
        )}
      </div>
    </article>
  );
}

export function UrunBolumu({ lang = "tr" }: { lang?: Dil }) {
  const t = T[lang];
  const uygulamalar = URUNLER.filter((u) => !OYUN_IDS.has(u.id));
  const oyunlar = URUNLER.filter((u) => OYUN_IDS.has(u.id));
  return (
    <section id="urunler" className="section-padding section-fade !py-14 md:!py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <p className="eyebrow">{t.urunEyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-white">{t.urunBaslik}</h2>
          <p className="text-muted max-w-2xl mx-auto">{t.urunGiris}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {uygulamalar.map((u) => (
            <UrunKarti key={u.id} u={u} lang={lang} />
          ))}
        </div>
        <div className="mt-14 space-y-2 mb-8">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-white">{t.oyunBaslik}</h3>
          <p className="text-sm text-muted">{t.oyunNotu}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {oyunlar.map((u) => (
            <UrunKarti key={u.id} u={u} lang={lang} />
          ))}
        </div>
        <p className="mt-10 text-center">
          <a href={t.urunlerHref} className="press inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:text-primary-light">
            {t.tumUrunler}
          </a>
        </p>
      </div>
    </section>
  );
}

const GUVEN_ICONS = [Lock, FileCheck2, ShieldCheck];

export function GuvenBolumu({ lang = "tr" }: { lang?: Dil }) {
  const t = T[lang];
  return (
    <section id="guven" className="section-padding section-fade !py-14 md:!py-20">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="eyebrow">{t.guvenEyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-white">{t.guvenBaslik}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {t.guven.map((g, i) => {
            const Icon = GUVEN_ICONS[i];
            return (
              <div key={g.title} className="card-soft rounded-3xl p-6 md:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{g.title}</h3>
                <p className="mt-2 text-sm text-muted leading-[1.55]">{g.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-1 text-sm font-semibold">
          <a href={t.gizlilik.href} className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">{t.gizlilik.label}</a>
          <a href={t.guvenlik.href} className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">{t.guvenlik.label}</a>
        </div>
      </div>
    </section>
  );
}

export function HakkimizdaBolumu({ lang = "tr" }: { lang?: Dil }) {
  const t = T[lang];
  return (
    <section id="hakkimizda" className="section-padding section-fade !py-14 md:!py-20">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-4">
          <p className="eyebrow">{t.hakEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-white">OstlerTech</h2>
          <p className="text-muted leading-[1.6]">{t.hakMetin}</p>
          <a href={t.hakLink.href} className="press inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:text-primary-light">
            {t.hakLink.label}
          </a>
        </div>
        <div className="card-soft rounded-3xl p-6 md:p-7 space-y-3">
          <h3 className="text-lg font-bold text-white">{t.iletisim}</h3>
          <p className="text-sm text-muted leading-[1.55]">{t.iletisimMetin}</p>
          <a href={`mailto:${COMPANY.email}`} className="press flex min-h-[44px] items-center gap-2 break-all font-semibold text-primary hover:text-primary-light">
            <Mail size={18} className="shrink-0" aria-hidden />
            {COMPANY.email}
          </a>
          <a href={t.firma.href} className="press inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:text-primary-light">
            {t.firma.label}
          </a>
        </div>
      </div>
    </section>
  );
}
