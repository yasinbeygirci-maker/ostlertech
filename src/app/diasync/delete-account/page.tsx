export default function DiaSyncDeleteAccount() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 px-6 py-16 md:px-20 lg:px-32">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <a href="/" className="text-sm text-cyan-400 hover:underline mb-4 inline-block">&larr; OstlerTech Ana Sayfa</a>
          <h1 className="text-3xl md:text-4xl font-bold text-white">DiaSync - Hesap ve Veri Silme Talebi</h1>
          <p className="text-sm text-slate-400 mt-2">Son Güncelleme Tarihi: Ağustos 2026</p>
        </div>

        <section className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold text-white">Hesabınızı Nasıl Silebilirsiniz?</h2>
          <p>
            DiaSync uygulamasındaki hesabınızı ve buna bağlı tüm kişisel verilerinizi (çocuk sağlık takipleri, günlük kayıtlar ve profil bilgileri) kalıcı olarak silmek istiyorsanız aşağıdaki yöntemleri kullanabilirsiniz:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li><strong className="text-white">Uygulama Üzerinden:</strong> DiaSync uygulamasını açın, <span className="text-cyan-400">Ayarlar &gt; Hesabı Sil</span> menüsüne giderek işleminizi anında gerçekleştirebilirsiniz.</li>
            <li><strong className="text-white">Web Üzerinden Talep:</strong> Uygulamaya erişiminiz yoksa, aşağıda yer alan destek e-posta adresimize kayıtlı e-posta adresinizle birlikte hesap silme talebinizi iletebilirsiniz.</li>
          </ol>
        </section>

        <section className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold text-white">Veri Silme Prosedürü ve Süresi</h2>
          <p>
            Hesap silme talebiniz bize ulaştıktan sonra, Firebase veritabanımızda ve yerel depolama alanlarında bulunan tüm kişisel verileriniz <strong className="text-white">en geç 7 iş günü içinde</strong> kalıcı olarak silinir ve anonimleştirilir. Yasal zorunluluklar dışında hiçbir veriniz yedek olarak saklanmaz.
          </p>
        </section>

        <section className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold text-white">İletişim ve Destek</h2>
          <p>
            Hesap silme süreciyle ilgili herhangi bir sorun yaşarsanız bizimle doğrudan iletişime geçebilirsiniz:
          </p>
          <p className="text-cyan-400 font-medium">
            E-posta: destek@ostlertech.com (veya web sitemiz üzerinden)
          </p>
        </section>
      </div>
    </main>
  );
}