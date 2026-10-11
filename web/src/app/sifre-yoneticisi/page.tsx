import type { Metadata } from "next";
import { Check, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FREE_ITEM_LIMIT, PLAY_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Şifre Yöneticisi Nedir, Telefonda Nerede?",
  description:
    "Kayıtlı şifreleriniz telefonunuzun neresinde? Google, Chrome, iPhone, Samsung, Xiaomi ve Huawei şifre kasasının yeri adım adım. Şifre yöneticisi nedir, ne işe yarar?",
  alternates: { canonical: "/sifre-yoneticisi" },
};

// Menü yolları üreticilerin kendi Türkçe yardım sayfalarından alındı (2026-10-10). Sürüme göre küçük farklar olabilir.
const cihazlar = [
  {
    id: "google",
    ad: "Android telefonlar (Google Şifre Yöneticisi)",
    yollar: [
      "Ayarlar uygulamasını açın, arama kutusuna “Şifre Yöneticisi” yazın ve açın.",
      "Bilgisayardan ya da başka bir cihazdan: passwords.google.com adresine Google hesabınızla girin.",
    ],
    not: "Chrome'da kaydettiğiniz şifreler de burada görünür; ikisi aynı kasadır.",
  },
  {
    id: "chrome",
    ad: "Chrome tarayıcı",
    yollar: [
      "Telefonda: Chrome'u açın, sağ üstteki üç nokta → Ayarlar → Otomatik doldurma ve şifreler → Google Şifre Yöneticisi.",
      "Bilgisayarda: sağ üstteki üç nokta → Şifreler ve otomatik doldurma → Google Şifre Yöneticisi.",
    ],
    not: "Şifreyi görmek için cihazın ekran kilidini ya da bilgisayar parolasını girmeniz istenir.",
  },
  {
    id: "iphone",
    ad: "iPhone",
    yollar: [
      "iOS 18 ve sonrası: ana ekrandaki Parolalar uygulamasını açın.",
      "iOS 17 ve öncesi: Ayarlar → Parolalar.",
    ],
    not: "Açmak için Face ID, Touch ID ya da telefon parolası istenir.",
  },
  {
    id: "samsung",
    ad: "Samsung (Samsung Pass)",
    yollar: [
      "Ayarlar → Güvenlik ve gizlilik → Daha fazla güvenlik ayarı → Samsung Pass.",
      "Eski sürümlerde: Ayarlar → Biyometri ve güvenlik → Samsung Pass.",
    ],
    not: "Samsung telefonlarda Google Şifre Yöneticisi de bulunur; şifreniz hangisine kaydedildiyse orada görünür.",
  },
  {
    id: "xiaomi",
    ad: "Xiaomi, Redmi, POCO",
    yollar: [
      "Ayarlar → Google → Şifre Yöneticisi.",
      "Yeni HyperOS sürümlerinde ayrıca bir şifre uygulaması bulunabilir: Ayarlar'daki arama kutusuna “şifre” yazın.",
    ],
    not: "Kayıtlı şifreleri görmek için telefonda ekran kilidi tanımlı olmalıdır.",
  },
  {
    id: "huawei",
    ad: "Huawei (Şifre Kasası)",
    yollar: ["Ayarlar → Güvenlik (bazı sürümlerde Güvenlik ve gizlilik) → Şifre kasası → Hesaplar."],
    not: "Huawei tarayıcısında kaydedilen şifreler tarayıcının kendi ayarlarında durur.",
  },
];

const sss = [
  {
    q: "e-Devlet ya da Instagram şifremi telefonda nasıl bulurum?",
    a: "Şifreyi giriş yaparken telefonunuza kaydettiyseniz yukarıdaki kasalardan birinde, sitenin ya da uygulamanın adıyla görünür. Kaydetmediyseniz telefon bu şifreyi bilmez; ilgili hizmetin “şifremi unuttum” adımıyla yenilemeniz gerekir.",
  },
  {
    q: "Şifre yöneticisi güvenli mi?",
    a: "İyi bir şifre yöneticisi kasayı ana parolanızla şifreler; şirket bile içindekileri okuyamaz. Asıl risk, her sitede aynı ya da zayıf şifre kullanmaktır. Şifre yöneticisi her hesaba ayrı ve güçlü şifre kullanmayı mümkün kılar.",
  },
  {
    q: "Telefonumdaki hazır kasa yeterli mi?",
    a: "Çoğu kişi için iyi bir başlangıçtır. Hazır kasalar bir hesaba (Google, Apple, Samsung) bağlıdır ve o markanın cihazlarında en iyi çalışır. Telefon markasını değiştirirken ya da bir hesaba bağlı olmayan, cihazınızda duran bir kasa istediğinizde ayrı bir şifre yöneticisi daha uygun olur.",
  },
  {
    q: "Ana parolamı unutursam ne olur?",
    a: "Bu, kullandığınız şifre yöneticisine göre değişir. Hesaba bağlı kasalarda hesap kurtarma adımları vardır. Ana parolayı şirketin bilmediği kasalarda ise kurtarma kodunu önceden saklamanız gerekir; SyncPass bunun için bir kurtarma QR kodu oluşturur.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sss.map((s) => ({ "@type": "Question", name: s.q, acceptedAnswer: { "@type": "Answer", text: s.a } })),
};

export default function SifreYoneticisi() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Rehber</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Şifre yöneticisi nedir, telefonunuzda nerede?
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Telefonunuz ya da tarayıcınız “Şifreyi kaydet” dediğinde şifreniz bir şifre yöneticisine kaydedilir. Aşağıda,
            kayıtlı şifrelerinizi hangi cihazda nerede bulacağınızı adım adım anlatıyoruz.
          </p>
          <nav aria-label="Cihazlar" className="flex flex-wrap gap-2 pt-2">
            {cihazlar.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:text-white transition-colors">
                {c.ad.split(" (")[0]}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="section-padding border-t border-line !pt-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-5">
            <Search size={20} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-sm text-foreground leading-relaxed">
              <strong className="text-white">En kısa yol:</strong> menü adları telefonun sürümüne göre değişebilir. Ayarlar
              uygulamasının üstündeki arama kutusuna <strong className="text-white">“şifre”</strong> yazmak, hemen her telefonda
              kasayı bulmanın en hızlı yoludur.
            </p>
          </div>
          {cihazlar.map((c) => (
            <article key={c.id} id={c.id} className="scroll-mt-28 rounded-2xl border border-line bg-surface p-6 space-y-3">
              <h2 className="text-xl font-bold text-white">{c.ad}</h2>
              <ol className="space-y-2 text-muted leading-relaxed list-decimal pl-5">
                {c.yollar.map((y) => <li key={y}>{y}</li>)}
              </ol>
              <p className="text-sm text-muted">{c.not}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Şifre yöneticisi nedir, ne işe yarar?</h2>
          <p className="text-muted leading-relaxed">
            Şifre yöneticisi, bütün şifrelerinizi şifreli bir kasada saklayan uygulamadır. Kasayı tek bir ana parolayla (ya da
            parmak izi, yüz tanıma ile) açarsınız; giriş yaparken şifreyi sizin yerinize doldurur. Böylece her hesaba ayrı ve
            güçlü bir şifre kullanabilir, hiçbirini ezberlemek zorunda kalmazsınız.
          </p>
          <p className="text-muted leading-relaxed">
            Telefonlardaki hazır kasalar (Google, Apple, Samsung) ücretsiz ve kullanışlıdır; bir hesaba bağlıdırlar ve o markanın
            cihazlarında en iyi çalışırlar. Ayrı bir şifre yöneticisi ise markadan bağımsızdır: telefon değiştirdiğinizde ya da
            bilgisayarda da aynı kasayı kullanmak istediğinizde işinizi kolaylaştırır.
          </p>
          <p className="text-muted leading-relaxed">
            Yeni bir şifreye mi ihtiyacınız var? <a href="/guvenli-sifre-olusturucu" className="text-primary hover:text-primary-light">Güvenli şifre oluşturucu</a> ile
            tarayıcınızda rastgele ve güçlü bir şifre üretebilirsiniz.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 md:p-10 space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Hesaba bağlı olmayan bir kasa: SyncPass</h2>
          <p className="text-muted leading-relaxed">
            SyncPass şifrelerinizi telefonunuzda AES-256 ile şifreli bir kasada tutar. Hesap açmanız gerekmez ve ana parolanızı
            bizimle paylaşmazsınız. Diğer şifre yöneticilerinden dışa aktardığınız dosyaları içe aktarabilirsiniz.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> {FREE_ITEM_LIMIT} kayda kadar ücretsiz</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Premium ile 2FA kodları ve Google Drive'a şifreli yedek</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Android ve Windows'ta aynı kasa</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={PLAY_URL} className="btn-primary !py-3.5" rel="noopener">Google Play'den indir</a>
            <a href="/syncpass-masaustu" className="btn-secondary !py-3.5">Windows sürümü</a>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-8">Sık sorulanlar</h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {sss.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                  {f.q}
                  <span className="text-muted transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
