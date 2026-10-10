import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SifreOlusturucu from "@/components/SifreOlusturucu";
import { FREE_ITEM_LIMIT, PLAY_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Güvenli Şifre Oluşturucu: Güçlü ve Rastgele Şifre Üret",
  description:
    "Ücretsiz güvenli şifre oluşturucu. Şifre tarayıcınızda üretilir, hiçbir yere gönderilmez. Güvenli şifre oluşturma kuralları ve örneklerle.",
  alternates: { canonical: "/guvenli-sifre-olusturucu" },
};

const kurallar = [
  { b: "Uzunluk her şeyden önemli.", m: "En az 16 karakter kullanın. Her ek karakter, tahmin edilmesi gereken olasılık sayısını katlayarak artırır." },
  { b: "Her hesaba ayrı şifre.", m: "Bir sitede sızan şifre, aynı şifreyi kullandığınız bütün hesapları açar. Sızıntıların çoğu bu yolla zarar verir." },
  { b: "Kişisel bilgi kullanmayın.", m: "Ad, doğum tarihi, tuttuğunuz takım, plaka ya da evcil hayvanınızın adı sosyal medyadan kolayca bulunur." },
  { b: "Tahmin edilebilir değişiklik işe yaramaz.", m: "Sona yıl eklemek ya da harfi rakamla değiştirmek (a yerine @) saldırı araçlarının ilk denediği şeylerdir." },
  { b: "İki adımlı doğrulamayı açın.", m: "Şifre sızsa bile ikinci adım (telefondaki kod ya da passkey) hesabınızı korur." },
  { b: "Şifreyi düz metin olarak saklamayın.", m: "Not defteri, mesajlaşma uygulaması ya da e-posta taslağı şifre saklamak için güvenli değildir." },
];

const zayif = ["123456", "qwerty123", "Deniz1990", "Galatasaray1905", "Sifre2026!"];

const sss = [
  {
    q: "Bu sayfada oluşturulan şifre kaydediliyor mu?",
    a: "Hayır. Şifre tarayıcınızda, cihazınızın güvenli rastgele sayı üreteciyle oluşturulur. Hiçbir sunucuya gönderilmez ve kaydedilmez; sayfayı kapattığınızda kaybolur.",
  },
  {
    q: "Kaç karakterli şifre güvenlidir?",
    a: "Önemli hesaplar için en az 16 karakter öneriyoruz. Oluşturucu varsayılan olarak 20 karakterlik şifre üretir. Rastgele üretilmiş 16 karakter, insan eliyle seçilmiş daha uzun bir şifreden çok daha zor tahmin edilir.",
  },
  {
    q: "Sembol kullanmak şart mı?",
    a: "Şart değil; uzunluk daha etkilidir. Bazı siteler sembolleri kabul etmez, o durumda sembol seçeneğini kapatıp uzunluğu artırın.",
  },
  {
    q: "Şifremi ne sıklıkla değiştirmeliyim?",
    a: "Güçlü ve her hesapta farklı bir şifreniz varsa düzenli aralıklarla değiştirmeniz gerekmez. Bir sızıntıdan etkilendiğinizi öğrendiğinizde ya da şüphelendiğinizde hemen değiştirin.",
  },
  {
    q: "Bu kadar farklı şifreyi nasıl hatırlarım?",
    a: "Hatırlamanız gerekmez. Bir şifre yöneticisi bütün şifrelerinizi şifreli bir kasada saklar; siz yalnızca kasanın ana parolasını hatırlarsınız.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sss.map((s) => ({ "@type": "Question", name: s.q, acceptedAnswer: { "@type": "Answer", text: s.a } })),
};

export default function GuvenliSifreOlusturucu() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 text-center">
            <p className="eyebrow">Ücretsiz araç</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Güvenli şifre oluşturucu</h1>
            <p className="text-lg text-muted leading-relaxed">
              Tek tıkla güçlü ve rastgele bir şifre üretin. Şifre tarayıcınızda oluşturulur, hiçbir yere gönderilmez.
            </p>
          </div>
          <SifreOlusturucu />
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Güvenli şifre nasıl oluşturulur?</h2>
            <p className="text-muted leading-relaxed">
              Güvenli bir şifre uzun, rastgele ve yalnızca tek bir hesapta kullanılan şifredir. Aşağıdaki kurallar bunun nasıl
              yapılacağını özetliyor.
            </p>
          </div>
          <ol className="space-y-4">
            {kurallar.map((k, i) => (
              <li key={k.b} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                <span className="font-mono text-primary font-bold">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-muted leading-relaxed"><strong className="text-white">{k.b}</strong> {k.m}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Güvenli şifre örnekleri</h2>
            <p className="text-muted leading-relaxed">
              Burada yazan hiçbir şifreyi kullanmayın: yayımlanmış bir şifre artık güvenli değildir. Örnekler yalnızca farkı göstermek için.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
              <p className="font-semibold text-white">Kolay tahmin edilenler</p>
              <ul className="space-y-2">
                {zayif.map((z) => (
                  <li key={z} className="flex items-center gap-3 font-mono text-sm text-muted">
                    <X size={16} className="shrink-0 text-red-400" /> {z}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted">Kısa, sözlükte geçen ya da kişisel bilgiye dayanan şifreler saniyeler içinde denenir.</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
              <p className="font-semibold text-white">Güçlü bir şifrenin özellikleri</p>
              <ul className="space-y-2 text-sm text-muted">
                {["16 karakter ya da daha uzun", "Harf, rakam ve sembol karışık", "Anlamlı bir kelime ya da tarih içermez", "Yalnızca tek bir hesapta kullanılır", "İnsan tarafından değil, rastgele seçilir"].map((o) => (
                  <li key={o} className="flex items-center gap-3"><Check size={16} className="shrink-0 text-ok" /> {o}</li>
                ))}
              </ul>
              <p className="text-xs text-muted">Bu özelliklere sahip bir şifreyi yukarıdaki oluşturucuyla saniyede üretebilirsiniz.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 md:p-10 space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Şifrelerinizi nerede saklamalısınız?</h2>
          <p className="text-muted leading-relaxed">
            Her hesaba ayrı ve rastgele şifre kullanınca hepsini hatırlamak mümkün olmaz. Çözüm bir şifre yöneticisi.
            SyncPass şifrelerinizi telefonunuzda AES-256 ile şifreli bir kasada tutar; hesap açmanız gerekmez ve ana parolanızı
            bizimle paylaşmazsınız. İçindeki <strong className="text-white">Şifre Üret</strong> aracıyla yeni şifreyi doğrudan kasaya
            kaydedersiniz.
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
