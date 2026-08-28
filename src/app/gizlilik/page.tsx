export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 px-6 py-16 md:px-20 lg:px-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Gizlilik Politikası / Privacy Policy</h1>
        <p className="text-sm text-slate-400">Son Güncelleme Tarihi: Ağustos 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Giriş</h2>
          <p>
            OstlerTech olarak geliştirmiş olduğumuz mobil uygulamalarımız (SyncPass, DiaSync vb.) kullanıcı gizliliğine son derece önem verir. 
            Bu gizlilik politikası, uygulamalarımızı kullandığınızda verilerinizin nasıl işlendiğini ve korunduğunu açıklamak için hazırlanmıştır.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. SyncPass Veri Güvenliği</h2>
          <p>
            SyncPass, verilerinizi korumak için sıfır bilgi (zero-knowledge) şifreleme ve biyometrik kimlik doğrulama altyapısı kullanır. 
            Şifreleriniz ve hassas verileriniz yalnızca sizin cihazınızda şifrelenir; üçüncü taraf sunucularda açık metin olarak asla saklanmaz.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. DiaSync Sağlık ve Takip Verileri</h2>
          <p>
            DiaSync, çocuk sağlığı ve günlük takipleri güvenli bir şekilde yönetmeniz için tasarlanmıştır. Uygulama içerisinde girilen sağlık verileri ve besin analizleri yerel veritabanında saklanır ve izniniz olmadan dış mercilerle paylaşılmaz.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili herhangi bir soru veya talebiniz için bizimle web sitemiz üzerinden iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}