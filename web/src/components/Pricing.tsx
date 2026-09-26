import { Check } from "lucide-react";
import { PLAY_URL, FREE_ITEM_LIMIT } from "@/lib/site";

// Kilitler uygulamadaki isPremium kontrollerinden alındı (kayıt sınırı, TOTP, Drive, sızıntı kontrolü).
// Fiyatlar Google Play'den bölgeye göre gelir; burada rakam yazılmaz ki eskimesin.
const free = [
  `${FREE_ITEM_LIMIT} kayda kadar`,
  "Tüm kayıt türleri: giriş, kart, banka, Wi-Fi, not, geçiş anahtarı",
  "Otomatik doldurma ve geçiş anahtarı sağlayıcısı",
  "Parmak izi ile kilit açma",
  "Şifre üretici ve güvenlik puanı",
  "Şifreli yerel yedek ve kurtarma QR kodu",
];

const premium = [
  "Sınırsız kayıt",
  "2FA / TOTP kodları kasada",
  "Google Drive'a şifreli yedek ve geri yükleme",
  "Sızıntı kontrolü (Have I Been Pwned)",
  "Ücretsiz sürümdeki her şey",
];

export default function Pricing() {
  return (
    <section id="fiyat" className="section-padding border-t border-line">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <p className="eyebrow">Fiyat</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Ücretsiz başlayın.</h2>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Reklam yok, hesap yok. Kasanız büyüdüğünde Premium&apos;a geçin; aylık, yıllık ya da tek seferlik ömür boyu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass-card p-8 md:p-10 flex flex-col">
            <h3 className="text-lg font-bold text-white">Ücretsiz</h3>
            <p className="mt-2 text-4xl font-extrabold text-white">0 ₺</p>
            <p className="mt-1 text-sm text-muted">Süre sınırı yok</p>
            <ul className="mt-8 space-y-3.5 flex-1">
              {free.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-foreground/90">
                  <Check size={18} className="mt-0.5 shrink-0 text-muted" />
                  {f}
                </li>
              ))}
            </ul>
            <a href={PLAY_URL} target="_blank" rel="noopener" className="btn-secondary mt-10">
              Ücretsiz indir
            </a>
          </div>

          <div className="relative rounded-3xl border border-primary/50 bg-gradient-to-b from-primary/15 to-card p-8 md:p-10 flex flex-col">
            <span className="absolute -top-3 left-8 rounded-full bg-primary-dark px-3 py-1 text-xs font-semibold text-white">
              Önerilen
            </span>
            <h3 className="text-lg font-bold text-white">Premium</h3>
            <p className="mt-2 text-2xl md:text-3xl font-extrabold text-white leading-tight">Aylık · Yıllık · Ömür boyu</p>
            <p className="mt-1 text-sm text-muted">Güncel fiyat Google Play&apos;de, bölgenizin para biriminde gösterilir.</p>
            <ul className="mt-8 space-y-3.5 flex-1">
              {premium.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-foreground/90">
                  <Check size={18} className="mt-0.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <a href={PLAY_URL} target="_blank" rel="noopener" className="btn-primary mt-10">
              Uygulama içinden yükselt
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
