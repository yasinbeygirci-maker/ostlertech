import { Lock, Smartphone, EyeOff, Cloud, Search, LifeBuoy, ShieldCheck, Mail, KeyRound } from "lucide-react";
import { PBKDF2_ITERATIONS } from "@/lib/site";

const steps = [
  { k: "1", title: "Ana şifre", desc: "Yalnızca senin bildiğin şifre. Hiçbir yerde saklanmaz, hiçbir yere gönderilmez." },
  { k: "2", title: `PBKDF2 · ${PBKDF2_ITERATIONS} tur`, desc: "Ana şifre, HMAC-SHA256 ile yavaşlatılarak şifreleme anahtarına dönüştürülür; tahmin denemeleri pahalılaşır." },
  { k: "3", title: "AES-256-GCM + SQLCipher", desc: "Şifreler ve diğer hassas alanlar ayrıca tek tek şifrelenir; veritabanının tamamı da şifreli." },
];

// "Cihazından ne çıkar?" kutusu, güvenlik belgesinin 8. bölümüyle (content/guvenlik-belgesi-tr.md) eşlenir. Uygulamaya yeni bir ağ çağrısı
// eklenirse önce belgeye, sonra buraya eklenmeli.
const leaves = [
  { icon: Cloud, title: "Drive eşitlemesi (isteğe bağlı, Premium)", desc: "Açarsan, zaten şifrelenmiş kasa dosyası kendi Google Drive hesabına yüklenir; açıkken bu kendiliğinden yapılır (Android'de yaklaşık 12 saatte bir)." },
  { icon: Search, title: "Şifre sızıntı kontrolü (Premium)", desc: "Şifrenin SHA-1 özetinin yalnızca ilk 5 karakteri Have I Been Pwned'a sorulur (k-anonimlik); şifrenin kendisi gönderilmez." },
  { icon: Mail, title: "E-posta sızıntı kontrolü (Premium, yalnızca Android)", desc: "Yalnız kendi Have I Been Pwned anahtarını girersen çalışır; sonra kendiliğinden 7 günde bir kasandaki kayıtlarda bulunan e-posta adresleri Have I Been Pwned'a gönderilir. Anahtar girmezsen bu kontrol hiç çalışmaz." },
  { icon: LifeBuoy, title: "Uygulama içi yardım (yalnızca Android)", desc: "Android uygulamasında yardım ekranına yazdığın soru, yanıtlanması için Google'ın Gemini hizmetine gönderilir. Kasa içeriği gönderilmez. Yardım ekranına şifre ya da kişisel bilgi yazma. Masaüstü uygulaması bunu yapmaz." },
  { icon: ShieldCheck, title: "Kasa güvenlik raporu (isteğe bağlı, Premium, yalnızca Android)", desc: "İstersen kasanın özet sayıları (güvenlik puanı, kayıt sayısı, zayıf/tekrar/sızmış şifre sayısı, e-posta sızıntı sayısı, açık güvenlik ayarları) raporun yazılması için Google'ın Gemini hizmetine gönderilir. Şifreler, kullanıcı adları ve kayıt adları gönderilmez. Masaüstü uygulaması bunu yapmaz." },
  { icon: KeyRound, title: "Masaüstü lisansı (yalnızca SyncPass Masaüstü)", desc: "Lisansı etkinleştirirken ve sonra kendiliğinden yaklaşık haftada bir, lisans anahtarın, uygulamanın ürettiği rastgele cihaz numarası ve uygulama sürümü ostlertech.com'a gider. Kasa içeriği gitmez; ücretsiz sürüm bu bağlantıyı kurmaz." },
  { icon: Smartphone, title: "Android sistem yedeği (telefonunda açıksa)", desc: "Android'in kendi otomatik yedeği uygulama ayarlarını Google hesabına yedekler: ana şifreni doğrulamaya yarayan değer ve tuz ile kurtarma QR'ı için sarmalanmış anahtar. Kasa veritabanı ve kişisel bilgiler bu yedeğe girmez." },
];

export default function Security() {
  return (
    <section id="guvenlik" className="section-padding">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="eyebrow">Güvenlik</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.02em] text-white">Anahtar sende kalır.</h2>
            <p className="text-lg text-muted">
              Kasanın kopyası sunucularımızda tutulmaz. Kasan telefonundaki şifreli bir veritabanıdır ve onu
              ana şifren, parmak izin ya da kurtarma QR kodun açar.
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
                  <p className="mt-1 text-muted leading-[1.5]">{s.desc}</p>
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
          <h3 className="text-xl font-bold text-white">Cihazından ne çıkar?</h3>
          <p className="mt-2 text-muted">
            Kasanın içeriği bize gelmez; ana şifren ve kasa anahtarın aşağıdakilerin hiçbirinde gönderilmez. Uygulama ayrıca
            Google Play satın alma kontrolü ve geçiş anahtarı doğrulaması için kasa içeriği taşımayan bağlantılar kurar.
            Ağa çıkan başlıca işler şunlardır; bazıları açtıktan sonra kendiliğinden çalışır:
          </p>
          <ul className="mt-8 space-y-6">
            {leaves.map((l) => (
              <li key={l.title} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <l.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-white">{l.title}</p>
                  <p className="mt-1 text-sm text-muted leading-[1.5]">{l.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href="/syncpass/privacy" className="press mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:text-primary-light">
            Gizlilik politikasının tamamı →
          </a>
          <a href="/guvenlik/sifreleme-belgesi" className="press mt-1 flex min-h-[44px] items-center text-sm font-semibold text-primary hover:text-primary-light">
            Tam liste ve teknik ayrıntı: güvenlik ve şifreleme belgesi →
          </a>
        </div>
      </div>
    </section>
  );
}
