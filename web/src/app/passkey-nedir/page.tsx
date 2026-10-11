import type { Metadata } from "next";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PLAY_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Passkey (Geçiş Anahtarı) Nedir? Google, Microsoft, WhatsApp'ta Nasıl Oluşturulur?",
  description:
    "Passkey (geçiş anahtarı) nedir, şifreden neden daha güvenlidir? Google, Microsoft ve WhatsApp'ta passkey oluşturma adımları, nerede saklandığı ve telefonu kaybedince ne olacağı.",
  alternates: { canonical: "/passkey-nedir" },
};

// Oluşturma yolları resmi yardım sayfalarından ve güvenilir haberlerden (2026-10-11). Menü adları sürüme göre değişebilir.
const hizmetler = [
  {
    id: "google",
    ad: "Google hesabı",
    adimlar: ["Tarayıcıda g.co/passkeys adresini açın ve Google hesabınızla giriş yapın.", "“Geçiş anahtarı oluştur” deyin, ekran kilidiniz ya da parmak izinizle onaylayın."],
  },
  {
    id: "microsoft",
    ad: "Microsoft hesabı (Outlook, Xbox, Windows)",
    adimlar: [
      "account.microsoft.com/security adresine girin → Gelişmiş güvenlik seçenekleri.",
      "Yeni bir oturum açma yolu ekleyin → “Yüz, parmak izi, PIN veya güvenlik anahtarı”.",
    ],
  },
  {
    id: "whatsapp",
    ad: "WhatsApp",
    adimlar: ["WhatsApp → Ayarlar → Hesap → Geçiş anahtarları.", "“Geçiş anahtarı oluştur”a dokunun, ekran kilidinizle onaylayın."],
  },
  {
    id: "diger",
    ad: "Kripto borsaları ve diğer hizmetler (Binance vb.)",
    adimlar: ["Hesabın güvenlik ayarlarında “Geçiş anahtarları” ya da “Passkeys” bölümünü arayın.", "Bölüm yoksa o hizmet henüz passkey desteklemiyordur; şifre ve iki adımlı doğrulamayla devam edin."],
  },
];

type Hucre = "evet" | "hayir" | "kismen";
const karsilastirma: { ozellik: string; sifre: Hucre; ikiAdim: Hucre; passkey: Hucre }[] = [
  { ozellik: "Ezberlemeniz gerekir", sifre: "evet", ikiAdim: "evet", passkey: "hayir" },
  { ozellik: "Sahte siteye kaptırılabilir (oltalama)", sifre: "evet", ikiAdim: "kismen", passkey: "hayir" },
  { ozellik: "Sitenin verisi sızarsa hesabınız risk altına girer", sifre: "evet", ikiAdim: "kismen", passkey: "hayir" },
  { ozellik: "Tahmin edilebilir ya da başka sitede tekrar kullanılabilir", sifre: "evet", ikiAdim: "kismen", passkey: "hayir" },
];
// Tablodaki her satır bir risk: "Evet" kötü (turuncu), "Hayır" iyi (yeşil).
const ikon = (h: Hucre) =>
  h === "evet" ? <span className="block text-center font-semibold text-amber-400">Evet</span>
  : h === "hayir" ? <span className="block text-center font-semibold text-ok">Hayır</span>
  : <span className="block text-center text-muted">Kısmen</span>;

const sss = [
  {
    q: "Google passkey nedir?",
    a: "Google hesabınıza şifre yazmadan, telefonunuzun ekran kilidi ya da parmak izinizle girmenizi sağlayan geçiş anahtarıdır. g.co/passkeys adresinden oluşturulur; şifreniz silinmez, isterseniz yine şifreyle de giriş yapabilirsiniz.",
  },
  {
    q: "WhatsApp passkey nedir?",
    a: "WhatsApp'ı yeni bir telefona kurarken SMS kodu yerine ekran kilidinizle doğrulamanızı sağlar. Ayarlar → Hesap → Geçiş anahtarları bölümünden oluşturulur.",
  },
  {
    q: "Microsoft passkey nedir?",
    a: "Outlook, Xbox ve Windows'ta kullandığınız Microsoft hesabına yüz, parmak izi ya da PIN ile girmenizi sağlar. account.microsoft.com/security adresindeki gelişmiş güvenlik seçeneklerinden eklenir.",
  },
  {
    q: "Telefonumu kaybedersem passkey'lerim gider mi?",
    a: "Passkey'i nerede sakladığınıza bağlıdır. Google Şifre Yöneticisi ya da Apple Parolalar'da saklananlar hesabınızla yeni cihaza gelir. Yalnızca tek bir cihazda duranlar için hesabın şifresini ve kurtarma kodlarını saklamaya devam edin. Bir şifre yöneticisi kullanıyorsanız onun yedeğini almayı unutmayın.",
  },
  {
    q: "Passkey varken şifreme gerek kalır mı?",
    a: "Çoğu hizmette şifre bir yedek giriş yolu olarak kalır. Bu yüzden şifrenin de güçlü ve yalnızca o hesaba ait olması gerekir.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sss.map((s) => ({ "@type": "Question", name: s.q, acceptedAnswer: { "@type": "Answer", text: s.a } })),
};

export default function PasskeyNedir() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Rehber</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Passkey (geçiş anahtarı) nedir?</h1>
          <p className="text-lg text-muted leading-relaxed">
            Passkey, Türkçe adıyla geçiş anahtarı, şifre yazmadan giriş yapmanızı sağlayan dijital bir anahtardır. Giriş yaparken
            şifre yerine telefonunuzun parmak izini, yüz tanımasını ya da ekran kilidi kodunu kullanırsınız.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Nasıl çalışır?</h2>
          <p className="text-muted leading-relaxed">
            Bir passkey oluşturduğunuzda cihazınız birbirine bağlı iki anahtar üretir. <strong className="text-white">Gizli anahtar</strong> sizin
            cihazınızda ya da şifre yöneticinizde kalır ve hiçbir yere gönderilmez. <strong className="text-white">Açık anahtar</strong> ise
            hizmete (örneğin Google'a) verilir. Giriş yaparken hizmet bir soru gönderir, cihazınız bu soruyu gizli anahtarla
            imzalar; siz yalnızca parmak izinizle onay verirsiniz.
          </p>
          <p className="text-muted leading-relaxed">
            Parmak iziniz ya da yüz taramanız cihazınızdan çıkmaz; yalnızca anahtarın kilidini açmak için kullanılır. Passkey'ler
            FIDO Alliance ve W3C'nin ortak standardına dayanır; Google, Apple ve Microsoft aynı standardı kullanır.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Şifreden neden daha güvenli?</h2>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[34rem] text-sm">
              <thead className="bg-surface text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold"> </th>
                  <th className="px-4 py-3 font-semibold">Şifre</th>
                  <th className="px-4 py-3 font-semibold">Şifre + 2FA kodu</th>
                  <th className="px-4 py-3 font-semibold">Passkey</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {karsilastirma.map((r) => (
                  <tr key={r.ozellik}>
                    <td className="px-4 py-3 text-muted">{r.ozellik}</td>
                    <td className="px-4 py-3">{ikon(r.sifre)}</td>
                    <td className="px-4 py-3">{ikon(r.ikiAdim)}</td>
                    <td className="px-4 py-3">{ikon(r.passkey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-3 text-muted leading-relaxed">
            <li><strong className="text-white">Oltalamaya dayanıklı:</strong> passkey yalnızca oluşturulduğu sitede çalışır. Sahte bir siteye girseniz bile cihazınız anahtarı vermez.</li>
            <li><strong className="text-white">Sızacak bir şey yok:</strong> hizmetin elinde yalnızca açık anahtar durur. Veritabanı çalınsa da bu anahtarla hesabınıza girilemez.</li>
            <li><strong className="text-white">Tahmin edilemez:</strong> her passkey rastgeledir ve tek bir siteye özeldir; tekrar kullanılamaz.</li>
          </ul>
          <p className="text-sm text-muted">
            Henüz her site passkey desteklemiyor. Desteklemeyen sitelerde güçlü bir şifre ve iki adımlı doğrulama en iyi korumadır;
            yeni bir şifre için <a href="/guvenli-sifre-olusturucu" className="text-primary hover:text-primary-light">güvenli şifre oluşturucu</a>yu kullanabilirsiniz.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Passkey nasıl oluşturulur?</h2>
          <p className="text-muted leading-relaxed">Menü adları uygulamanın sürümüne göre değişebilir; en çok aranan hizmetler için adımlar:</p>
          {hizmetler.map((h) => (
            <article key={h.id} id={h.id} className="scroll-mt-28 rounded-2xl border border-line bg-surface p-6 space-y-3">
              <h3 className="text-xl font-bold text-white">{h.ad}</h3>
              <ol className="space-y-2 text-muted leading-relaxed list-decimal pl-5">
                {h.adimlar.map((a) => <li key={a}>{a}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Passkey nerede saklanır?</h2>
          <p className="text-muted leading-relaxed">
            Passkey'ler bir şifre yöneticisinde durur: Android'de genelde Google Şifre Yöneticisi, iPhone'da Apple Parolalar,
            Windows'ta Windows Hello. Oluştururken telefonunuz hangisine kaydedileceğini sorabilir. Kayıtlı şifrelerinizi ve
            passkey'lerinizi nerede bulacağınızı <a href="/sifre-yoneticisi" className="text-primary hover:text-primary-light">şifre yöneticisi rehberimizde</a> anlattık.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 md:p-10 space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Passkey'leriniz hesaba bağlı olmayan bir kasada: SyncPass</h2>
          <p className="text-muted leading-relaxed">
            SyncPass, Android 14 ve sonrasında passkey sağlayıcısı olarak çalışır: bir sitede passkey oluşturduğunuzda onu
            telefonunuzdaki şifreli SyncPass kasasına kaydedebilirsiniz. Passkey'leriniz şifrelerinizle aynı listede durur; hesap
            açmanız gerekmez.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Passkey saklama ücretsiz sürümde de var</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Şifreli yerel yedek ve kurtarma QR kodu</li>
            <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ok" /> Premium ile Google Drive'a şifreli yedek</li>
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
