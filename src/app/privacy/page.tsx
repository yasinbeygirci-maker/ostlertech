export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 px-6 py-16 md:px-20 lg:px-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <a href="/" className="text-sm text-cyan-400 hover:underline mb-4 inline-block">&larr; Ana Sayfaya Dön</a>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Gizlilik Politikası / Privacy Policy</h1>
          <p className="text-sm text-slate-400 mt-2">Son Güncelleme Tarihi: Ağustos 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Giriş</h2>
          <p>
            OstlerTech olarak geliştirmiş olduğumuz mobil uygulamalarımız (SyncPass, DiaSync vb.) kullanıcı gizliliğine ve veri güvenliğine son derece önem verir. 
            Bu gizlilik politikası, uygulamalarımızı kullandığınızda verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklamak için hazırlanmıştır.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. SyncPass Veri Güvenliği</h2>
          <p>
            SyncPass, kullanıcı verilerini korumak için sıfır bilgi (zero-knowledge) şifreleme ve gelişmiş biyometrik kimlik doğrulama altyapısı kullanır. 
            Şifreleriniz ve hassas kimlik bilgileriniz yalnızca sizin cihazınızda şifrelenir; üçüncü taraf sunucularda açık metin olarak asla saklanmaz veya görüntülenmez.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. DiaSync Sağlık ve Takip Verileri</h2>
          <p>
            DiaSync, çocuk sağlığı ve günlük bakım takiplerini güvenli bir şekilde yönetmeniz için tasarlanmıştır. Uygulama içerisinde girilen hassas sağlık verileri ve besin analizleri güvenli yerel veritabanında saklanır ve izniniz olmaksızın dış mercilerle paylaşılmaz.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. Veri Paylaşımı ve Üçüncü Taraflar</h2>
          <p>
            Uygulamalarımız, kullanıcı verilerini reklam, pazarlama veya ticari amaçlarla asla üçüncü taraflarla paylaşmaz. Veri tabanı ve bulut yedekleme altyapılarında endüstri standardı güvenlik protokolleri uygulanır.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">5. İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili her türlü soru, öneri veya talebiniz için web sitemiz (<a href="https://www.ostlertech.com" className="text-cyan-400 hover:underline">www.ostlertech.com</a>) üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}