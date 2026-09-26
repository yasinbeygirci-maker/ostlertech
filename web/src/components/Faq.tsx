import { CONTACT_EMAIL } from "@/lib/site";

const faqs = [
  {
    q: "Ana parolamı unutursam ne olur?",
    a: "Ana parolanızı bilmediğimiz için sıfırlayamayız. Bu yüzden kasayı kurduktan sonra Ayarlar'dan bir kurtarma QR kodu oluşturup güvenli bir yerde saklamanızı öneririz; parolayı unutursanız kilit ekranından bu kodu taratarak kasayı açabilirsiniz.",
  },
  {
    q: "Verilerim bir sunucuda mı duruyor?",
    a: "Hayır. Kasanız telefonunuzda şifreli bir veritabanıdır. Drive yedeğini açarsanız, şifrelenmiş kasa dosyası yalnızca sizin Google Drive hesabınıza yüklenir.",
  },
  {
    q: "Başka bir şifre yöneticisinden geçebilir miyim?",
    a: "Evet. Diğer yöneticilerin dışa aktardığı dosyaları uygulamanın yedekleme ekranından içe aktarabilirsiniz.",
  },
  {
    q: "Premium'u iptal edersem kayıtlarım silinir mi?",
    a: "Hayır, kayıtlarınız kasada kalır. Ücretsiz sınırın üstünde yeni kayıt eklenemez; 2FA kodları ve Drive yedeği gibi Premium özellikler kapanır, yeniden abone olunca geri gelir.",
  },
  {
    q: "iPhone veya Mac sürümü var mı?",
    a: "Şu an Android sürümü yayında, Windows sürümü son testlerinde. iOS ve macOS için bir tarih vermiyoruz.",
  },
];

export default function Faq() {
  return (
    <section id="sss" className="section-padding border-t border-line">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <p className="eyebrow">Sık sorulanlar</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Aklınıza takılanlar</h2>
        </div>
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                {f.q}
                <span className="text-muted transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Başka bir sorunuz mu var? <span className="text-foreground">{CONTACT_EMAIL}</span> adresine yazın.
        </p>
      </div>
    </section>
  );
}
