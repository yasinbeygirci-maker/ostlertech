import { ArrowRight, Clock, HeartPulse, Kanban, Layers, Lock, Mail, Monitor, ShieldCheck, Store, FileCheck2 } from "lucide-react";
import { URUNLER, type Urun } from "@/lib/urunler";
import { COMPANY } from "@/lib/site";

// Şirket vitrini bölümleri. Metinler Hakkımızda, Güvenlik ve ürün verisinden (urunler.ts) alınır; yeni iddia yok.

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShieldCheck, Monitor, Layers, HeartPulse, Store, Kanban,
};

const DURUM: Record<string, { etiket: string; cls: string }> = {
  yayinda: { etiket: "Yayında", cls: "bg-ok/10 text-ok" },
  test: { etiket: "Test aşamasında", cls: "bg-primary/10 text-primary-light" },
  beta: { etiket: "Açık beta", cls: "bg-primary/10 text-primary-light" },
  yakinda: { etiket: "Yakında", cls: "bg-white/[0.06] text-muted" },
};

export function CompanyHero() {
  return (
    <section className="relative isolate pt-32 md:pt-40 pb-12 md:pb-16 px-5 overflow-hidden">
      <div aria-hidden className="absolute -z-10 top-[-15%] right-[-10%] h-[620px] w-[620px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-rise">
        <p className="eyebrow">OstlerTech · Bağımsız yazılım stüdyosu</p>
        <h1 className="text-4xl sm:text-6xl xl:text-[4.25rem] font-extrabold tracking-[-0.02em] leading-[1.15]">
          <span className="text-gradient">
            Verisini kendinde tutmak
            <br className="hidden sm:block" /> isteyenler için uygulamalar.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-[1.5]">
          Türkiye&apos;de kurulu bağımsız bir yazılım stüdyosuyuz. Bireyler ve küçük işletmeler için sade ve güvenli uygulamalar
          geliştiriyoruz: şifre yöneticisi, AutoCAD alan metrajı, esnaf defteri ve şantiye takibi.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#urunler" className="btn-primary !px-7 !min-h-[48px] text-base">
            Uygulamalarımız
            <ArrowRight size={18} />
          </a>
          <a href="/syncpass" className="btn-secondary !px-7 !min-h-[48px] text-base">
            SyncPass şifre yöneticisi
          </a>
        </div>
      </div>
    </section>
  );
}

function UrunKarti({ u }: { u: Urun }) {
  const Icon = ICONS[u.ikon] ?? Layers;
  const durum = DURUM[u.durum] ?? DURUM.yakinda;
  const syncpass = u.id === "syncpass";
  const href = syncpass ? "/syncpass" : u.id === "syncpassdesktop" ? "/syncpass-masaustu" : u.id === "areapilot" ? u.url : u.id === "cornertab" ? u.url : null;
  const dis = href?.startsWith("http");
  const etiket = syncpass ? "SyncPass'i tanı" : u.id === "syncpassdesktop" ? "Ayrıntılar ve fiyatlar" : u.id === "areapilot" ? "AreaPilot sayfası" : u.id === "cornertab" ? "Google Play'den indir" : null;

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
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${durum.cls}`}>
          {u.durum === "yakinda" && <Clock size={12} aria-hidden />}
          {durum.etiket}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-bold text-white">{u.ad}</h3>
      <p className="mt-1 text-sm font-semibold text-primary-light leading-snug">{u.slogan}</p>
      <p className="mt-3 text-sm text-muted leading-[1.55] flex-1">{u.aciklama}</p>
      <p className="mt-4 text-sm text-muted">{u.platform}</p>
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
            {u.durum === "test" ? "Test sürecinde" : "Hazırlanıyor"}
          </div>
        )}
      </div>
    </article>
  );
}

export function UrunBolumu() {
  return (
    <section id="urunler" className="section-padding section-fade !py-14 md:!py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <p className="eyebrow">Uygulamalarımız</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-white">Yayında olanlar ve hazırlananlar</h2>
          <p className="text-muted max-w-2xl mx-auto">Her kartta uygulamanın durumu yazılıdır: yayında, açık beta, test aşamasında ya da yakında.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {URUNLER.map((u) => (
            <UrunKarti key={u.id} u={u} />
          ))}
        </div>
      </div>
    </section>
  );
}

const guven = [
  {
    icon: Lock,
    title: "Kasa cihazında",
    desc: "SyncPass kasan telefonundaki şifreli bir veritabanıdır. Kasanın kopyası sunucularımızda tutulmaz; ana şifreni bizimle paylaşmazsın.",
  },
  {
    icon: FileCheck2,
    title: "Ne çıkar, açıkça yazılı",
    desc: "Kasa içeriği bize gelmez. Cihazdan çıkan her bağlantı (örneğin Google Play satın alma kontrolü) gizlilik politikasında tek tek anlatılır.",
  },
  {
    icon: ShieldCheck,
    title: "Söylediğimizi yaparız",
    desc: "Sitede ve mağazada yalnızca uygulamada gerçekten olan özellikleri anlatırız.",
  },
];

export function GuvenBolumu() {
  return (
    <section id="guven" className="section-padding section-fade !py-14 md:!py-20">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="eyebrow">Gizlilik ve güven</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-white">Verilerin sende.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {guven.map((g) => (
            <div key={g.title} className="card-soft rounded-3xl p-6 md:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
                <g.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{g.title}</h3>
              <p className="mt-2 text-sm text-muted leading-[1.55]">{g.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-1 text-sm font-semibold">
          <a href="/gizlilik" className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">Gizlilik ve KVKK →</a>
          <a href="/syncpass#guvenlik" className="press inline-flex min-h-[44px] items-center text-primary hover:text-primary-light">SyncPass güvenlik ayrıntıları →</a>
        </div>
      </div>
    </section>
  );
}

export function HakkimizdaBolumu() {
  return (
    <section id="hakkimizda" className="section-padding section-fade !py-14 md:!py-20">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1.2fr_1fr] items-start">
        <div className="space-y-4">
          <p className="eyebrow">Hakkımızda</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-white">OstlerTech</h2>
          <p className="text-muted leading-[1.6]">
            OstlerTech, Türkiye&apos;de kurulu bağımsız bir yazılım stüdyosu. Verisini kendisinde tutmak isteyen bireyler ve küçük
            işletmeler için sade ve güvenli uygulamalar geliştiriyoruz.
          </p>
          <a href="/hakkimizda" className="press inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:text-primary-light">
            Hakkımızda sayfası →
          </a>
        </div>
        <div className="card-soft rounded-3xl p-6 md:p-7 space-y-3">
          <h3 className="text-lg font-bold text-white">İletişim</h3>
          <p className="text-sm text-muted leading-[1.55]">Soru, öneri ve destek için bize e-posta yazabilirsin.</p>
          <a href={`mailto:${COMPANY.email}`} className="press flex min-h-[44px] items-center gap-2 break-all font-semibold text-primary hover:text-primary-light">
            <Mail size={18} className="shrink-0" aria-hidden />
            {COMPANY.email}
          </a>
          <a href="/iletisim" className="press inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:text-primary-light">
            Firma bilgileri →
          </a>
        </div>
      </div>
    </section>
  );
}
