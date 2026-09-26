import { Search, ShieldCheck, KeyRound, Fingerprint, HardDriveDownload, Wand2, QrCode, Tablet } from "lucide-react";

// Her kart gerçek bir ekran görüntüsüne dayanır; görüntüler store-listing ve masaüstü ui-snapshots'tan üretildi.
const small = [
  {
    icon: Fingerprint,
    title: "Otomatik doldurma ve geçiş anahtarı",
    desc: "Android'in otomatik doldurma hizmeti ve Credential Manager ile uygulamalarda ve tarayıcıda tek dokunuşla giriş.",
  },
  {
    icon: HardDriveDownload,
    title: "Yedekleme sizin elinizde",
    desc: "Şifreli yedeği dosyaya alın ya da kendi Google Drive'ınıza koyun. Başka bir yöneticiden içe aktarma da var.",
  },
  {
    icon: QrCode,
    title: "Kurtarma QR kodu",
    desc: "Ana parolayı unutursanız kasayı açacak, çevrimdışı saklayacağınız bir kurtarma anahtarı.",
  },
  {
    icon: Wand2,
    title: "Güçlü şifre üretici",
    desc: "Uzunluğu ve karakter türlerini seçin, gücünü anında görün, kayda tek dokunuşla ekleyin.",
  },
];

export default function Features() {
  return (
    <section id="ozellikler" className="section-padding !pt-12 md:!pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="eyebrow">Android uygulaması</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Aradığınızı bulun, kopyalayın, geçin.
          </h2>
          <p className="text-lg text-muted">
            Kasa ekranı baştan tasarlandı: arama hep üstte, filtreler bir dokunuş uzakta, doğrulama kodları ana ekranda
            canlı akıyor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
          {/* Kasa */}
          <article className="lg:col-span-4 glass-card overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 md:p-10 md:w-1/2 space-y-4">
              <Search className="text-primary" size={26} />
              <h3 className="text-2xl font-bold text-white">Tek listede her şey</h3>
              <p className="text-muted leading-relaxed">
                Girişler, kartlar, banka hesapları, Wi-Fi, notlar, 2FA ve geçiş anahtarları alfabetik tek listede.
                Satırdaki düğmeyle kopyalayın; sağa kaydırınca kopyalar, sola kaydırınca favorilere ekler.
              </p>
              <ul className="flex flex-wrap gap-2 pt-2">
                {["Tümü", "Girişler", "Kartlar", "2FA", "Geçiş anahtarları", "Wi-Fi", "Favoriler"].map((c) => (
                  <li key={c} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 relative min-h-[320px] bg-gradient-to-b from-primary/10 to-transparent">
              <div className="device-phone absolute left-1/2 -translate-x-1/2 top-8 w-[62%] max-w-[260px]">
                <img src="/screens/phone-list.webp" alt="Alfabetik kasa listesi ve canlı 2FA kodu" loading="lazy" width={720} height={1157} />
              </div>
            </div>
          </article>

          {/* 2FA */}
          <article className="lg:col-span-2 glass-card p-8 md:p-10 flex flex-col">
            <KeyRound className="text-primary" size={26} />
            <h3 className="mt-4 text-2xl font-bold text-white">2FA kodları ana ekranda</h3>
            <p className="mt-3 text-muted leading-relaxed">
              Doğrulayıcı uygulamanıza gerek yok. TOTP kodları kasada saklanır, geri sayımla yenilenir; dokununca
              kopyalanır.
            </p>
            <div className="mt-auto pt-8">
              <div className="rounded-2xl border border-line bg-background p-5">
                <p className="text-sm text-muted">GitHub</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-4xl font-bold tracking-wider text-white">640 252</span>
                  <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90" aria-hidden>
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#263047" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#8AB4FF" strokeWidth="4" strokeDasharray="94" strokeDashoffset="30" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </article>

          {/* Sağlık */}
          <article className="lg:col-span-3 glass-card overflow-hidden">
            <div className="p-8 md:p-10 space-y-4">
              <ShieldCheck className="text-ok" size={26} />
              <h3 className="text-2xl font-bold text-white">Dürüst bir güvenlik puanı</h3>
              <p className="text-muted leading-relaxed">
                Zayıf, tekrar eden ve sızıntılarda görülmüş şifreler ayrı ayrı sayılır. Ana ekrandaki şerit ile sağlık
                ekranı aynı hesabı kullanır; &quot;Düzelt&quot; sizi ilgili kayda götürür, şifrenizi sizin yerinize
                değiştirmez.
              </p>
              <div className="flex gap-3 pt-2">
                {[
                  { n: "Zayıf", c: "text-bad" },
                  { n: "Tekrar eden", c: "text-weak" },
                  { n: "Sızmış", c: "text-muted" },
                ].map((s) => (
                  <span key={s.n} className={`rounded-xl border border-line bg-background px-3 py-2 text-xs font-semibold ${s.c}`}>
                    {s.n}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-8 md:px-10">
              <div className="device-phone mx-auto w-[62%] max-w-[250px] translate-y-6">
                <img src="/screens/phone-health.webp" alt="Sağlık ekranı: güvenlik puanı ve öneriler" loading="lazy" width={720} height={1141} />
              </div>
            </div>
          </article>

          {/* Tablet */}
          <article className="lg:col-span-3 glass-card overflow-hidden">
            <div className="p-8 md:p-10 space-y-4">
              <Tablet className="text-primary" size={26} />
              <h3 className="text-2xl font-bold text-white">Tablette de rahat</h3>
              <p className="text-muted leading-relaxed">
                Geniş ekranda alt çubuk yerini yan menüye bırakır, içerik ekrana yayılır. Yatay ve dikey kullanım
                kilitlenmez.
              </p>
            </div>
            <div className="px-8 md:px-10">
              <div className="rounded-t-[1.6rem] border border-b-0 border-line bg-[#0B0F16] p-2 pb-0 translate-y-2">
                <img
                  src="/screens/tablet-vault.webp"
                  alt="SyncPass tablet görünümü"
                  loading="lazy"
                  width={1100}
                  height={1913}
                  className="block w-full h-[360px] object-cover object-top rounded-t-[1.2rem]"
                />
              </div>
            </div>
          </article>

          {small.map((f) => (
            <article key={f.title} className="lg:col-span-3 xl:col-span-3 glass-card p-7 flex gap-5">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <f.icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-1.5 text-muted leading-relaxed text-[15px]">{f.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex gap-5 overflow-x-auto pb-4 snap-x [scrollbar-width:thin]" aria-label="Diğer ekranlar">
          {[
            { src: "phone-lock", alt: "Kilit ekranı" },
            { src: "phone-categories", alt: "Kategoriler" },
            { src: "phone-add", alt: "Yeni kayıt ekleme" },
            { src: "phone-detail", alt: "Kayıt ayrıntısı" },
            { src: "phone-generator", alt: "Şifre üretici" },
          ].map((s) => (
            <figure key={s.src} className="snap-start shrink-0 w-[200px] md:w-[220px]">
              <div className="device-phone !p-1.5 !rounded-[1.8rem]">
                <img src={`/screens/${s.src}.webp`} alt={s.alt} loading="lazy" className="!rounded-[1.4rem] aspect-[9/14] object-cover object-top" />
              </div>
              <figcaption className="mt-3 text-center text-sm text-muted">{s.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
