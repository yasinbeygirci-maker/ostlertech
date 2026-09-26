// Son sürümlerde gelen, kullanıcının fark edeceği değişiklikler (Android 4.3.x ve masaüstü yeniden tasarımı).
const items = [
  { tag: "Android", title: "Yeni kasa ekranı", desc: "Sabit arama, filtre çipleri, favoriler, canlı 2FA kodları ve kaydırarak kopyalama." },
  { tag: "Android", title: "Tek güvenlik kararı", desc: "Ana ekran ve sağlık ekranı artık aynı puanı ve aynı uyarıyı gösteriyor." },
  { tag: "Android", title: "Şifreniz size ait", desc: "Uygulama zayıf şifreleri artık kendiliğinden değiştirmiyor; düzeltme kararını siz veriyorsunuz." },
  { tag: "Android", title: "Güvenli içe aktarma", desc: "Dosya seçerken uygulama kapansa bile içe aktarma, kilit açıldıktan sonra kaldığı yerden sürüyor." },
  { tag: "Android", title: "Pano okunmuyor", desc: "Uygulama açılışta panonuzu okumuyor; kopyalanan şifreler hassas içerik olarak işaretleniyor." },
  { tag: "Masaüstü", title: "Baştan tasarlandı", desc: "Android ile aynı renkler, üç sütunlu düzen, açık/koyu tema ve 12 dil." },
];

export default function WhatsNew() {
  return (
    <section id="yenilikler" className="section-padding !pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-3">
            <p className="eyebrow">Yenilikler</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Son güncellemelerde neler değişti?</h2>
          </div>
          <p className="text-sm text-muted">Android 4.3 · Masaüstü önizleme</p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {items.map((i) => (
            <li key={i.title} className="bg-background p-6 hover:bg-surface transition-colors">
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  i.tag === "Android" ? "bg-ok/10 text-ok" : "bg-primary/10 text-primary"
                }`}
              >
                {i.tag}
              </span>
              <h3 className="mt-3 font-bold text-white">{i.title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{i.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
