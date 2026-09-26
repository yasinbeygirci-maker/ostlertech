import { ArrowRight, Monitor } from "lucide-react";
import { PLAY_URL, PBKDF2_ITERATIONS, LANGUAGE_COUNT, MIN_ANDROID, FREE_ITEM_LIMIT } from "@/lib/site";

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M4.2 2.3a1.4 1.4 0 0 0-.6 1.2v17a1.4 1.4 0 0 0 .6 1.2l9.6-9.7zM15.2 13.4l2.6 2.6-11.7 6.7zm0-2.8L6.1 1.3l11.7 6.7zm4 4.3 3-1.7a1.4 1.4 0 0 0 0-2.4l-3-1.7-2.9 2.9z" />
    </svg>
  );
}

const facts = [
  { value: "AES-256", label: "GCM ile şifreleme" },
  { value: PBKDF2_ITERATIONS, label: "tur PBKDF2 anahtar türetme" },
  { value: String(LANGUAGE_COUNT), label: "dilde arayüz" },
  { value: "0", label: "hesap ya da sunucu zorunluluğu" },
];

export default function Hero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-20 px-5 overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute -z-10 top-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-primary/10 blur-[140px]" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-14 lg:gap-10 items-center">
        <div className="space-y-8 text-center lg:text-left animate-rise">
          <a
            href="#yenilikler"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card/60 px-3 py-1.5 text-xs font-medium text-muted hover:text-white transition-colors"
          >
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary font-semibold">Yeni</span>
            Yeniden tasarlanan kasa ve masaüstü uygulaması
            <ArrowRight size={14} />
          </a>

          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.04] text-gradient">
            Şifreleriniz
            <br />
            sizin cihazınızda.
          </h1>

          <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted leading-relaxed">
            SyncPass; şifrelerinizi, kartlarınızı, 2FA kodlarınızı ve geçiş anahtarlarınızı telefonunuzda şifreli
            tutar. Hesap açmanız gerekmez, ana parolanız hiçbir yere gönderilmez.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <a href={PLAY_URL} target="_blank" rel="noopener" className="btn-primary !py-3.5 !px-6 text-base">
              <PlayIcon className="w-5 h-5" />
              Google Play&apos;den ücretsiz indir
            </a>
            <a href="#masaustu" className="btn-secondary !py-3.5 !px-6 text-base">
              <Monitor size={18} />
              Windows sürümü
            </a>
          </div>
          <p className="text-xs text-muted">{MIN_ANDROID} ve üzeri · Ücretsiz sürümde {FREE_ITEM_LIMIT} kayıt · Reklam yok</p>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none pb-10 sm:pb-0 animate-rise [animation-delay:150ms]">
          <div className="device-window ml-auto w-[92%]">
            <img src="/screens/desktop-vault-dark.webp" alt="SyncPass masaüstü: üç sütunlu kasa görünümü" width={1200} height={800} />
          </div>
          <div className="absolute -bottom-2 sm:-bottom-10 left-0 w-[34%] max-w-[230px] animate-float">
            <div className="device-phone">
              <img src="/screens/phone-vault.webp" alt="SyncPass Android: kasa, güvenlik puanı ve 2FA kodları" width={720} height={1133} />
            </div>
          </div>
        </div>
      </div>

      <dl className="max-w-5xl mx-auto mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-line bg-line">
        {facts.map((f) => (
          <div key={f.label} className="bg-surface px-5 py-6 text-center">
            <dt className="sr-only">{f.label}</dt>
            <dd className="text-2xl md:text-3xl font-extrabold text-white font-mono tracking-tight">{f.value}</dd>
            <dd className="mt-1 text-xs md:text-sm text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
