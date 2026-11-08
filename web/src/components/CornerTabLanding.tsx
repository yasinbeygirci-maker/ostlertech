import { Check } from "lucide-react";
import YouTubeFacade from "@/components/YouTubeFacade";
import { CORNERTAB } from "@/lib/cornertab";
import { VIDEOS } from "@/lib/videos";

type Lang = "tr" | "en";

// CornerTab ürün sayfası (TR ve EN aynı yapı). Metinler urunler.ts kartı ve uygulamanın kendi anlatımıyla uyumlu;
// fiyat, "çevrimdışı" ve benzeri vaatler yazılmaz. Üst çubuk/alt bilgi sayfa dosyasında.
export const CORNERTAB_COPY = {
  tr: {
    title: "CornerTab: Veresiye defteri uygulaması",
    description:
      "CornerTab esnaf için veresiye defteri: müşteri ve tedarikçi hesaplarını, borç ve tahsilatları kaydeder, ekstreyi PDF hazırlar. Defter cihazda şifreli durur.",
    badge: "Google Play'de",
    h1: "CornerTab, veresiye defterin telefonunda",
    lead: "Müşteri ve tedarikçi hesaplarını, borç ve tahsilatları tek yerde tut; hesap ekstresini PDF olarak hazırla.",
    cta: "Google Play'den indir",
    videoTitle: "Nasıl kullanılır?",
    videoSub: "Borç yazma, tahsilat alma, hatırlatma, ekstre, gün sonu ve yedek alma baştan sona 2 dakika 37 saniyede. Seslendirme ve altyazı Türkçe.",
    videoNote: "Oynat'a bastığında video YouTube'dan (youtube-nocookie.com) yüklenir.",
    featuresTitle: "Neler yapar?",
    features: [
      { h: "Cari hesaplar", p: "Müşteri ve tedarikçi hesaplarını ayrı ayrı tutar, borç ve tahsilatları tarihleriyle kaydeder." },
      { h: "Hesap ekstresi", p: "Bir carinin hesap özetini PDF olarak hazırlar; istediğin yerden paylaşırsın." },
      { h: "Cihazında şifreli defter", p: "Defter cihazında şifreli saklanır. İstersen PIN ya da parmak izi kilidi ekleyebilirsin." },
      { h: "Şifreli yedek", p: "Yedeği tek dosya olarak istediğin yere kaydedersin. Yedek parolanı unutma: saklanmaz." },
    ],
    privacy: "Gizlilik politikası",
    other: "English version",
    playNote: "Uygulama Google Play üzerinden indirilir.",
  },
  en: {
    title: "CornerTab: Credit ledger app for small shops",
    description:
      "CornerTab is a credit ledger for small shops: customer and supplier accounts, debts, payments and PDF statements. The ledger is stored encrypted on your device.",
    badge: "On Google Play",
    h1: "CornerTab, your credit ledger on your phone",
    lead: "Keep customer and supplier accounts, debts and payments in one place, and prepare account statements as PDF.",
    cta: "Download from Google Play",
    videoTitle: "How to use it",
    videoSub: "Writing debts, taking payments, reminders, statements, end of day and backups, start to finish in 2 minutes 37 seconds.",
    videoNote: "The video is in Turkish with Turkish subtitles; an English version is coming. When you press play, the video loads from YouTube (youtube-nocookie.com).",
    featuresTitle: "What it does",
    features: [
      { h: "Customer and supplier accounts", p: "Keeps each account separately and records debts and payments with their dates." },
      { h: "Account statements", p: "Prepares an account summary as PDF; you share it wherever you like." },
      { h: "Encrypted ledger on your device", p: "The ledger is stored encrypted on your device. You can add a PIN or fingerprint lock if you want." },
      { h: "Encrypted backup", p: "Save the backup as a single file wherever you like. Do not forget the backup password: it is not stored." },
    ],
    privacy: "Privacy policy",
    other: "Türkçe sürüm",
    playNote: "The app is downloaded from Google Play.",
  },
} as const;

export default function CornerTabLanding({ lang }: { lang: Lang }) {
  const c = CORNERTAB_COPY[lang];
  const video = VIDEOS.find((v) => v.product === "CornerTab");
  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CornerTab",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Android",
    description: c.description,
    inLanguage: lang,
    url: `https://www.ostlertech.com${lang === "tr" ? CORNERTAB.pagePath : CORNERTAB.pageEnPath}`,
  };
  const videoLd = video && {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: `https://www.ostlertech.com${video.poster}`,
    uploadDate: video.uploadDate,
    duration: video.duration,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
    inLanguage: "tr",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />}
      <section className="section-padding !pt-36">
        <div className="max-w-5xl mx-auto space-y-6">
          <p className="eyebrow"><span lang="en">Android</span> · {c.badge}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{c.h1}</h1>
          <p className="text-lg text-foreground leading-relaxed max-w-2xl">{c.lead}</p>
          <p>
            <a href={CORNERTAB.playUrl} target="_blank" rel="noopener" className="btn-primary inline-flex !py-3.5 text-base">
              {c.cta}
            </a>
          </p>
          <p className="text-[17px] text-muted">{c.playNote}</p>
        </div>
      </section>

      {video && (
        <section id="video" className="section-padding !pt-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-white">{c.videoTitle}</h2>
            <p className="text-muted max-w-2xl">{c.videoSub}</p>
            <YouTubeFacade video={video} lang={lang} priority playPosition="left" />
            <p className="text-[17px] text-muted">{c.videoNote}</p>
          </div>
        </section>
      )}

      <section className="section-padding border-t border-line">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-white">{c.featuresTitle}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {c.features.map((f) => (
              <div key={f.h} className="rounded-2xl border border-line bg-card p-6">
                <h3 className="flex items-start gap-2 text-lg font-bold text-white">
                  <Check size={20} className="mt-1 shrink-0 text-ok" />
                  {f.h}
                </h3>
                <p className="mt-2 text-muted leading-relaxed">{f.p}</p>
              </div>
            ))}
          </div>
          <p className="text-muted">
            <a href={lang === "tr" ? CORNERTAB.path : CORNERTAB.enPath} className="text-primary hover:text-primary-light">{c.privacy}</a>
            {" · "}
            <a href={lang === "tr" ? CORNERTAB.pageEnPath : CORNERTAB.pagePath} hrefLang={lang === "tr" ? "en" : "tr"} className="text-primary hover:text-primary-light">{c.other}</a>
          </p>
        </div>
      </section>
    </>
  );
}
