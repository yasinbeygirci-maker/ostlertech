import type { Metadata } from "next";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FREE_UP_TO_TR, PBKDF2_ITERATIONS } from "@/lib/site";
import { PLAY_BASE } from "@/lib/play-utm";
import { paylasimMeta } from "@/lib/paylasim-meta";

const BASLIK = "Şifre Kasası Nedir? Telefonda Şifre Yöneticisi";
const ACIKLAMA =
  "Şifre kasası nedir, telefonda şifre yöneticisi nasıl seçilir? Şifrelemenin yeri, ana parola kurtarma, otomatik doldurma ve yedek için altı soruluk kontrol listesi.";

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  alternates: { canonical: "/sifre-kasasi" },
  ...paylasimMeta({ title: BASLIK, description: ACIKLAMA, path: "/sifre-kasasi", lang: "tr" }),
};

// Bu sayfadaki her SyncPass cümlesi koddan ya da sitedeki doğrulanmış bileşenlerden (Security, Pricing, Faq, Features) alındı;
// fiyat tutarı BİLEREK yazılmıyor: Pricing.tsx ile aynı kural, Google Play bölgenin para biriminde gösterir.
const PLAY_SIFRE_KASASI =
  PLAY_BASE + "utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dsifre-kasasi%26utm_content%3Dsayfa_tr";

const sorular = [
  {
    s: "Kasa nerede duruyor, nasıl şifreleniyor?",
    c: "Kasa ya telefonunda ya da şirketin sunucusunda durur. İkisinde de içeriğin ana parolandan türetilen bir anahtarla şifrelenmesi gerekir. Şifreleme türü (AES-256 gibi) ve anahtarın nerede üretildiği, uygulamanın kendi açıklamasında yazmalıdır; yazmıyorsa bir sonraki adıma geçme.",
  },
  {
    s: "Ana parolayı unutursan ne olacak?",
    c: "Ana parolanı şirket bilmiyorsa onu sıfırlayamaz da. Bu iyi bir şeydir, ama bir kurtarma yolu olmalı: kurtarma kodu ya da QR. Bunu kasayı kurarken oluştur ve telefon dışında bir yerde sakla.",
  },
  {
    s: "Otomatik doldurma çalışıyor mu?",
    c: "Şifreyi elle kopyalayıp yapıştırmak zorunda kalırsan kasayı bir süre sonra kullanmayı bırakırsın. Uygulama Android'in otomatik doldurma hizmetine bağlanabilmeli, bunun için telefonun ayarlarında seçilebilmeli.",
  },
  {
    s: "Çıkış kapın var mı?",
    c: "İyi bir kasadan şifrelerini dosya olarak alabilmeli, başka bir kasadan da içeri aktarabilmelisin. Böylece bir gün uygulamayı değiştirmek istediğinde veriler orada kalmaz.",
  },
  {
    s: "Yedek ve cihaz değişikliği nasıl olacak?",
    c: "Kasa yalnızca cihazdaysa, telefon kaybolunca kasa da gider; yedeği baştan düşünmen gerekir. Hesaba bağlı kasada ise erişimin hesabına bağlıdır. Hangisini seçtiğini bilerek seç.",
  },
  {
    s: "Ücretsiz sınır ve fiyat ne, reklam var mı?",
    c: "Ücretsiz sürümdeki kayıt sınırına, hangi özelliklerin ücretli olduğuna ve fiyatın Google Play'de hangi para biriminde göründüğüne bak. Şifrelerine dokunan bir uygulamada reklam olmaması ayrıca bir artıdır.",
  },
];

const sss = [
  {
    q: "Şifre kasası ile şifre yöneticisi aynı şey mi?",
    a: "Günlük dilde evet. İkisi de şifrelerini şifreli bir yerde saklayan ve giriş yaparken senin yerine dolduran uygulamadır. “Kasa” daha çok saklanan yeri, “yönetici” ise uygulamanın işini anlatır.",
  },
  {
    q: "Telefonda şifre kasası yeterince güvenli mi?",
    a: "Her hesap için farklı ve güçlü bir şifre kullanmayı mümkün kılar. Asıl risk ana parolanın zayıf olması ve kurtarma kodunun kaybolmasıdır. Mümkün olan hesaplarda iki adımlı doğrulamayı da aç.",
  },
  {
    q: "SyncPass ücretsiz mi?",
    a: `Evet, ücretsiz sürümü var: ${FREE_UP_TO_TR}. Sınırsız kayıt, 2FA kodları ve Google Drive'a şifreli yedek Premium'dadır. Güncel fiyat Google Play'de bölgenin para biriminde gösterilir.`,
  },
  {
    q: "SyncPass iPhone'da çalışır mı?",
    a: "Hayır. Android ve Windows sürümleri yayında. iOS ve macOS için bir tarih vermiyoruz.",
  },
  {
    q: "Ana parolamı unutursam kasam açılır mı?",
    a: "Ana parolanı bilmediğimiz için sıfırlayamayız. Kasayı kurduktan sonra Ayarlar'dan bir kurtarma QR kodu oluşturup güvenli bir yerde saklarsan, kilit ekranından bu kodu taratarak kasayı açabilirsin.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sss.map((s) => ({ "@type": "Question", name: s.q, acceptedAnswer: { "@type": "Answer", text: s.a } })),
};

const link = "text-primary hover:text-primary-light underline underline-offset-2";
const govde = "text-[17px] md:text-lg text-muted leading-relaxed";

export default function SifreKasasi() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />

      <section className="section-padding !pt-36">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="eyebrow">Rehber</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Şifre kasası nedir, telefonda şifre yöneticisi nasıl seçilir?
          </h1>
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            Şifre kasası, bütün şifrelerini şifreli tek bir yerde saklayan ve giriş yaparken onları senin yerine dolduran
            uygulamadır. Kasayı ana parolan, parmak izin ya da yüz tanıman açar; sen yalnızca onu hatırlarsın. Aşağıda
            nasıl çalıştığını ve telefonda bir kasa seçerken bakman gereken altı şeyi bulacaksın.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Şifre kasası nasıl çalışır?</h2>
          <p className={govde}>
            Bir şifre kasasında ezberlediğin tek şey ana parolandır. Uygulama bu parolayı yavaş bir işlemden geçirerek bir
            şifreleme anahtarına çevirir; kayıtların bu anahtarla şifrelenir. Ana parolayı bilmeyen biri, kasanın dosyasını
            ele geçirse bile içindekileri okuyamaz.
          </p>
          <p className={govde}>
            Kasaya giriş bilgileri dışında kartlar, notlar, Wi-Fi şifreleri ve iki adımlı doğrulama kodları da konabilir. Bu
            sayede her hesapta farklı, uzun ve rastgele bir şifre kullanabilirsin. Bir sitenin sızıntısında çıkan şifre
            başka sitelerde de denenir; kasa aynı şifreyi tekrar kullanma ihtiyacını ortadan kaldırır. Yeni şifre üretmek için{" "}
            <a href="/guvenli-sifre-olusturucu" className={link}>güvenli şifre oluşturucuyu</a> kullanabilirsin.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Telefonda şifre yöneticisi seçerken altı soru</h2>
          <p className={govde}>
            Bir uygulamayı denemeden önce bu soruların cevabını mağaza sayfasında ya da uygulamanın güvenlik açıklamasında ara.
            Cevabı bulamıyorsan bu da bir cevaptır.
          </p>
          <ol className="space-y-4">
            {sorular.map((x, i) => (
              <li key={x.s} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-card font-mono text-base font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{x.s}</h3>
                  <p className="mt-1 text-[17px] text-muted leading-relaxed">{x.c}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Telefonun hazır kasası mı, ayrı bir uygulama mı?</h2>
          <p className={govde}>
            Google, Apple ve Samsung telefonlarında hazır bir kasa vardır; ücretsizdir ve çoğu kişi için iyi bir başlangıçtır.
            Bu kasalar bir hesaba bağlıdır ve o markanın cihazlarında en iyi çalışır. Telefon markasını değiştirmeyi
            düşünüyorsan, bir hesaba bağlı olmayan bir kasa istiyorsan ya da bilgisayarında da aynı kasayı kullanmak
            istiyorsan ayrı bir şifre yöneticisi daha uygun olur. Hazır kasanın yerini bulmak için{" "}
            <a href="/sifre-yoneticisi" className={link}>şifre yöneticisi telefonda nerede</a> rehberine bakabilirsin;
            kategorileri yan yana görmek için{" "}
            <a href="/sifre-yoneticisi-karsilastirma" className={link}>şifre yöneticisi karşılaştırması</a> var.
          </p>
          <p className={govde}>
            Hangisini seçersen seç, şifrelerini kasaya taşıdıktan sonra önem sırasına göre e-posta, banka ve e-Devlet
            hesaplarında <a href="/iki-adimli-dogrulama" className={link}>iki adımlı doğrulamayı</a> aç. Destekleyen
            hizmetlerde <a href="/passkey-nedir" className={link}>passkey (geçiş anahtarı)</a> şifreden de rahat bir yoldur.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-6 md:p-10 space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Altı soruya SyncPass'in cevabı</h2>
          <ul className="space-y-3 text-[17px] text-muted leading-relaxed">
            <li className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-ok" /><span><strong className="text-white">Kasa telefonunda.</strong> Şifreli bir veritabanıdır; ana parola PBKDF2 ile {PBKDF2_ITERATIONS} turda anahtara çevrilir, hassas alanlar AES-256-GCM ile tek tek, veritabanı da SQLCipher ile şifrelenir. Kasanın kopyası sunucularımızda tutulmaz.</span></li>
            <li className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-ok" /><span><strong className="text-white">Kurtarma:</strong> ana parolanı bilmediğimiz için sıfırlayamayız; kurulumdan sonra Ayarlar'dan kurtarma QR kodu oluşturursun. Parmak izi ile de açabilirsin.</span></li>
            <li className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-ok" /><span><strong className="text-white">Otomatik doldurma</strong> ve geçiş anahtarı sağlayıcısı olarak çalışır.</span></li>
            <li className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-ok" /><span><strong className="text-white">Çıkış kapısı:</strong> diğer şifre yöneticilerinin dışa aktardığı dosyaları içe aktarabilir, kasanı şifreli yerel yedeğe alabilirsin.</span></li>
            <li className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-ok" /><span><strong className="text-white">Cihazlar:</strong> Android 7.0 ve üstü ile Windows için sürümü var. iPhone ve Mac sürümü yok; bunun için tarih vermiyoruz. Premium'da şifreli kasa dosyası kendi Google Drive hesabına yedeklenir.</span></li>
            <li className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-ok" /><span><strong className="text-white">Ücretsiz başlarsın, reklam yok:</strong> {FREE_UP_TO_TR}. Sınırsız kayıt, 2FA kodları ve Drive yedeği Premium'da; aylık, yıllık ya da ömür boyu seçeneği var. Güncel fiyatı Google Play bölgenin para biriminde gösterir.</span></li>
          </ul>
          <p className="text-base text-muted leading-relaxed">
            Kasanın dışarıya ne gönderdiği, hangi özelliğin isteğe bağlı olduğu ve hangisinin yalnızca Android'de çalıştığı{" "}
            <a href="/guvenlik/sifreleme-belgesi" className={link}>güvenlik ve şifreleme belgesinde</a> açık yazılıdır. Bütün özellikler için{" "}
            <a href="/syncpass" className={link}>SyncPass sayfasına</a>, Windows sürümü için{" "}
            <a href="/syncpass-masaustu" className={link}>SyncPass Masaüstü</a>'ne bak.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a href={PLAY_SIFRE_KASASI} className="btn-primary !py-3.5" rel="noopener">Google Play'den indir</a>
            <a href="/syncpass#fiyat" className="btn-secondary !py-3.5">Fiyat ve planlar</a>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Kasaya geçmek için beş adım</h2>
          <ol className="list-decimal pl-6 space-y-2 text-[17px] md:text-lg text-muted leading-relaxed">
            <li>Önce kasayı kur, uzun ve yalnızca bu kasa için kullanacağın bir ana parola seç.</li>
            <li>Kurtarma kodunu ya da QR'ını hemen oluştur ve telefon dışında bir yerde sakla.</li>
            <li>Otomatik doldurmayı telefonun ayarlarından aç, böylece her girişte şifreyi kasa doldurur.</li>
            <li>Önce e-posta, banka ve e-Devlet gibi önemli hesapların şifrelerini kasadaki rastgele şifrelerle değiştir.</li>
            <li>Kasanın yedeğini al ve telefonunu değiştirirken yedeği geri yükleyebildiğini bir kez dene.</li>
          </ol>
        </div>
      </section>

      <section className="section-padding border-t border-line">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-8">Sık sorulanlar</h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {sss.map((f) => (
              <details key={f.q} className="group px-5 md:px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-white">
                  {f.q}
                  <span className="text-muted transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-[17px] text-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
