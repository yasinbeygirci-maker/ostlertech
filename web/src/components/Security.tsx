import { Lock, Smartphone, EyeOff, Cloud, Search, Bot } from "lucide-react";
import { PBKDF2_ITERATIONS } from "@/lib/site";

const steps = [
  { k: "1", title: "Ana parola", desc: "Yalnızca sizin bildiğiniz parola. Hiçbir yerde saklanmaz, hiçbir yere gönderilmez." },
  { k: "2", title: `PBKDF2 · ${PBKDF2_ITERATIONS} tur`, desc: "Parola, HMAC-SHA256 ile yavaşlatılarak şifreleme anahtarına dönüştürülür; tahmin denemeleri pahalılaşır." },
  { k: "3", title: "AES-256-GCM + SQLCipher", desc: "Her alan ayrı şifrelenir, veritabanının tamamı da ayrıca şifreli tutulur." },
];

// "Cihazdan ne çıkar?" sorusunun eksiksiz cevabı. Uygulamaya yeni bir ağ çağrısı eklenirse buraya da eklenmeli.
const leaves = [
  { icon: Cloud, title: "Drive yedeği (isteğe bağlı)", desc: "Açarsanız, zaten şifrelenmiş kasa dosyası kendi Google Drive hesabınıza yüklenir." },
  { icon: Search, title: "Sızıntı kontrolü", desc: "Şifrenin SHA-1 özetinin yalnızca ilk 5 karakteri Have I Been Pwned'e sorulur (k-anonimlik); şifrenin kendisi gönderilmez." },
  { icon: Bot, title: "Yardım asistanı", desc: "Asistana yazdığınız soru yanıtlanmak için Google Gemini'ye gider. Kasa içeriği gönderilmez." },
];

export default function Security() {
  return (
    <section id="guvenlik" className="section-padding">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="eyebrow">Güvenlik</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Anahtar sizde kalır.</h2>
            <p className="text-lg text-muted">
              SyncPass bir sunucuya bağlı değildir. Kasanız telefonunuzdaki şifreli bir veritabanıdır ve onu yalnızca
              ana parolanız ya da parmak iziniz açar.
            </p>
          </div>

          <ol className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-line">
            {steps.map((s) => (
              <li key={s.k} className="relative flex gap-5">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-card font-mono text-sm font-bold text-primary">
                  {s.k}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-muted leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Smartphone, t: "Biyometrik anahtar Android Keystore'da" },
              { icon: EyeOff, t: "Ekran görüntüsü ve kayıt engelli" },
              { icon: Lock, t: "Kopyalanan şifre hassas olarak işaretlenir ve silinir" },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-line bg-surface p-4 text-sm text-foreground/90">
                <x.icon size={18} className="mb-2 text-primary" />
                {x.t}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 self-start">
          <h3 className="text-xl font-bold text-white">Cihazınızdan ne çıkar?</h3>
          <p className="mt-2 text-muted">
            Varsayılan olarak hiçbir şey. Aşağıdakiler yalnızca siz kullandığınızda çalışır:
          </p>
          <ul className="mt-8 space-y-6">
            {leaves.map((l) => (
              <li key={l.title} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <l.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-white">{l.title}</p>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{l.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href="/syncpass/privacy" className="mt-8 inline-block text-sm font-semibold text-primary hover:text-primary-light">
            Gizlilik politikasının tamamı →
          </a>
        </div>
      </div>
    </section>
  );
}
