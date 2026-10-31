import { CONTACT_EMAIL } from "@/lib/site";

const faqs = [
  {
    q: "Ana şifremi unutursam ne olur?",
    a: "Ana şifreni bilmediğimiz için sıfırlayamayız. Bu yüzden kasayı kurduktan sonra Ayarlar'dan bir kurtarma QR kodu oluşturup güvenli bir yerde saklamanı öneririz; şifreyi unutursan kilit ekranından bu kodu taratarak kasayı açabilirsin.",
  },
  {
    q: "Verilerim bir sunucuda mı duruyor?",
    a: "Hayır. Kasan telefonunda şifreli bir veritabanıdır. Drive yedeğini açarsan, şifrelenmiş kasa dosyası yalnızca senin Google Drive hesabına yüklenir.",
  },
  {
    q: "Başka bir şifre yöneticisinden geçebilir miyim?",
    a: "Evet. Diğer yöneticilerin dışa aktardığı dosyaları uygulamanın yedekleme ekranından içe aktarabilirsin.",
  },
  {
    q: "Premium'u iptal edersem kayıtlarım silinir mi?",
    a: "Hayır, kayıtların kasada kalır. Ücretsiz sınırın üstünde yeni kayıt eklenemez; 2FA kodları ve Drive yedeği gibi Premium özellikler kapanır, yeniden abone olunca geri gelir.",
  },
  {
    q: "iPhone veya Mac sürümü var mı?",
    a: "Hayır. Android ve Windows sürümleri yayında. iOS ve macOS için bir tarih vermiyoruz.",
  },
];

export default function Faq() {
  return (
    <section id="sss" className="section-padding section-fade">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <p className="eyebrow">Sık sorulanlar</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-white">Aklına takılanlar</h2>
        </div>
        <div className="divide-y divide-line/40 rounded-2xl card-soft">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="press flex min-h-[48px] cursor-pointer items-center list-none items-center justify-between gap-4 font-semibold text-white">
                {f.q}
                <span className="text-muted transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-muted leading-[1.5]">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Başka bir sorun mu var? <span className="text-foreground">{CONTACT_EMAIL}</span> adresine yaz.
        </p>
      </div>
    </section>
  );
}
