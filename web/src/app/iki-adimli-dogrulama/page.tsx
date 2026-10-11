import type { Metadata } from "next";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PLAY_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "2FA Nedir? İki Adımlı Doğrulama Nasıl Kurulur?",
  description:
    "İki adımlı doğrulama (2FA) nedir, hangi 2FA uygulaması kullanılır? Google ve Instagram'da kurulum, yedek kodlar, telefon değiştirince kodları taşıma ve sık yapılan hatalar.",
  alternates: { canonical: "/iki-adimli-dogrulama" },
};

const yontemler = [
  { ad: "SMS ile kod", aciklama: "Telefonunuza mesajla gelen kod. Hiç yoktan iyidir, ama numaranız başka bir SIM karta taşınırsa kod saldırgana gidebilir." , seviye: "Temel" },
  { ad: "Doğrulayıcı uygulama (TOTP)", aciklama: "Telefonunuzdaki uygulama 30 saniyede bir değişen 6 haneli kod üretir. İnternet gerekmez, kod hiçbir yere gönderilmez.", seviye: "İyi" },
  { ad: "Uygulama bildirimi", aciklama: "Telefonunuza gelen “Giriş yapan siz misiniz?” bildirimine onay verirsiniz. Pratik, ama dikkatsizce onaylanan bildirimler risk oluşturur.", seviye: "İyi" },
  { ad: "Passkey ya da güvenlik anahtarı", aciklama: "Parmak izi, yüz tanıma ya da fiziksel anahtarla onay. Sahte sitelere karşı en dayanıklı yöntemdir.", seviye: "En güçlü" },
];

const kurulumlar = [
  {
    id: "google",
    ad: "Google hesabı",
    adimlar: [
      "myaccount.google.com → Güvenlik → “Google'da oturum açma” → 2 Adımlı Doğrulama.",
      "Doğrulayıcı uygulama eklemek için “Authenticator” seçeneğini açın ve ekrandaki karekodu uygulamayla okutun.",
      "Aynı sayfadan yedek kodları alıp güvenli bir yerde saklayın.",
    ],
  },
  {
    id: "instagram",
    ad: "Instagram",
    adimlar: [
      "Profil → sağ üstteki menü → Ayarlar ve gizlilik → Hesaplar Merkezi → Şifre ve güvenlik.",
      "İki faktörlü kimlik doğrulama → hesabınızı seçin → yöntem olarak “Doğrulama uygulaması”.",
      "Karekodu okutun ve uygulamanın gösterdiği 6 haneli kodu girin.",
    ],
  },
  {
    id: "genel",
    ad: "Diğer siteler ve uygulamalar",
    adimlar: [
      "Hesabın Güvenlik ayarlarında “İki adımlı doğrulama”, “İki faktörlü kimlik doğrulama” ya da “2FA” bölümünü bulun.",
      "Doğrulayıcı uygulama seçeneğini seçin, karekodu okutun ve kodu girerek doğrulayın.",
      "Size verilen yedek kodları kaydedin; telefonunuza ulaşamadığınızda tek giriş yolu bunlar olabilir.",
    ],
  },
];

const sss = [
  {
    q: "2FA uygulaması nedir?",
    a: "Giriş yaparken şifrenize ek olarak istenen tek kullanımlık kodu üreten uygulamadır. Google Authenticator, Microsoft Authenticator ya da doğrulayıcısı olan bir şifre yöneticisi bu işi yapar. Kodlar telefonda üretilir; internet ya da SMS gerekmez.",
  },
  {
    q: "SMS ile doğrulama güvenli mi?",
    a: "Hiç iki adımlı doğrulama kullanmamaktan çok daha iyidir. Ama numaranızın sizin haberiniz olmadan başka bir SIM karta taşınması gibi durumlarda kod başkasına gidebilir. Mümkünse doğrulayıcı uygulamayı ya da passkey'i tercih edin.",
  },
  {
    q: "Doğrulama kodum neden kabul edilmiyor?",
    a: "Kodlar zamana bağlıdır. Telefonunuzun saati yanlışsa kodlar da yanlış üretilir. Telefonun tarih ve saat ayarında “otomatik” seçeneğini açın, sonra yeni kodla tekrar deneyin.",
  },
  {
    q: "Telefonumu kaybedersem hesaplarıma nasıl girerim?",
    a: "Kurulum sırasında aldığınız yedek kodlarla girebilirsiniz. Bu yüzden yedek kodları telefondan ayrı, güvenli bir yerde saklayın. Doğrulayıcı uygulamanızın yedekleme ya da aktarma özelliğini de önceden açın.",
  },
  {
    q: "Şifre ve 2FA kodunu aynı uygulamada tutmak doğru mu?",
    a: "Kolaylık sağlar ve şifre ile kodu her seferinde ayrı ayrı aramanızı önler. Öte yandan iki adımı aynı yere koymuş olursunuz. En kritik hesaplarınız (birincil e-posta, banka) için ayrı bir doğrulayıcı ya da passkey kullanmak daha temkinli bir yoldur.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sss.map((s) => ({ "@type": "Question", name: s.q, acceptedAnswer: { "@type": "Answer", text: s.a } })),
};

export default function IkiAdimliDogrulama() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Rehber</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">2FA nedir, iki adımlı doğrulama nasıl kurulur?</h1>
          <p className="text-lg text-muted leading-relaxed">
            İki adımlı doğrulama (2FA), giriş yaparken şifrenize ek olarak ikinci bir onay ister: telefonunuzdaki bir kod, bir
            bildirim ya da parmak iziniz. Şifreniz bir şekilde ele geçirilse bile bu ikinci adım olmadan hesabınıza girilemez.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">İkinci adım için hangi yöntem?</h2>
          <div className="grid gap-4">
            {yontemler.map((y) => (
              <div key={y.ad} className="rounded-2xl border border-line bg-surface p-5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-white">{y.ad}</h3>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-foreground">{y.seviye}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{y.aciklama}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">
            Passkey hakkında ayrıntılı bilgi için <a href="/passkey-nedir" className="text-primary hover:text-primary-light">passkey nedir</a> rehberimize bakabilirsiniz.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Hangi 2FA uygulamasını kullanmalı?</h2>
          <p className="text-muted leading-relaxed">
            Doğrulayıcı uygulamaların hepsi aynı standardı (TOTP) kullanır; bir sitenin verdiği karekod hepsinde çalışır.
            Seçerken iki şeye bakın: kodlarınızı yeni telefona nasıl taşıyacağınız ve yedekleme.
          </p>
          <ul className="space-y-3 text-muted leading-relaxed">
            <li><strong className="text-white">Google Authenticator:</strong> ücretsiz. Google hesabınızla giriş yaparsanız kodlar yeni telefona kendiliğinden gelir; ayrıca Menü → Hesapları aktar ile karekodla taşınabilir.</li>
            <li><strong className="text-white">Microsoft Authenticator:</strong> ücretsiz; Microsoft hesabında bildirimle onay da sunar.</li>
            <li><strong className="text-white">Doğrulayıcısı olan bir şifre yöneticisi:</strong> kod, ilgili şifreyle aynı kayıtta durur; giriş yaparken ikisini tek yerden kopyalarsınız.</li>
          </ul>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Adım adım kurulum</h2>
          <p className="text-muted leading-relaxed">Menü adları uygulamanın sürümüne göre değişebilir.</p>
          {kurulumlar.map((k) => (
            <article key={k.id} id={k.id} className="scroll-mt-28 rounded-2xl border border-line bg-surface p-6 space-y-3">
              <h3 className="text-xl font-bold text-white">{k.ad}</h3>
              <ol className="space-y-2 text-muted leading-relaxed list-decimal pl-5">
                {k.adimlar.map((a) => <li key={a}>{a}</li>)}
              </ol>
            </article>
          ))}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-sm text-foreground leading-relaxed">
            <strong className="text-white">Yedek kodları unutmayın.</strong> Telefonunuz kaybolur ya da bozulursa hesabınıza
            girmenin tek yolu çoğu zaman bu kodlardır. Telefondan ayrı, güvenli bir yerde saklayın.
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 md:p-10 space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Şifre ve 2FA kodu aynı yerde: SyncPass</h2>
          <p className="text-muted leading-relaxed">
            SyncPass Premium'da 2FA kodları ilgili şifreyle aynı kayıtta durur ve kalan süreyi gösteren bir zamanlayıcıyla
            üretilir. Kodlar telefonunuzda üretilir, gizli anahtarlar hiçbir yere gönderilmez. Google Authenticator'daki
            hesaplarınızı, uygulamanın “Hesapları aktar” ekranındaki karekodu SyncPass'e okutarak taşıyabilirsiniz.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Karekodla kurulum ve Google Authenticator'dan içe aktarma</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Kasa telefonunuzda AES-256 ile şifreli, hesap gerekmez</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> 2FA kodları Premium özelliğidir; şifre ve passkey saklama ücretsiz sürümde de var</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={PLAY_URL} className="btn-primary !py-3.5" rel="noopener">Google Play'den indir</a>
            <a href="/#fiyat" className="btn-secondary !py-3.5">Ücretsiz ve Premium farkı</a>
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
