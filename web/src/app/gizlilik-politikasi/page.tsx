import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent-purple/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-40 pb-24">
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            OstlerTech Kurumsal
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Gizlilik <span className="text-primary">Sözleşmesi</span>
          </h1>
          <div className="flex items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest pt-2">
            <span>Global Versiyon</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Son Güncelleme: 26 Ağustos 2026</span>
          </div>
        </div>

        <div className="space-y-12 text-white/50 leading-relaxed font-medium">
          <section className="glass-card p-10 border-white/[0.05]">
             <h2 className="text-2xl font-black text-white mb-6">1. Genel Bakış</h2>
             <p className="text-lg">
               OstlerTech eko-sistemindeki tüm ürünler (SyncPass, DiaSync vb.), kullanıcı verilerinin gizliliğini en kutsal değer olarak kabul eder. Verileriniz, rızanız olmadan asla ticari bir amaçla kullanılmaz.
             </p>
          </section>

          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem]">
                <h3 className="text-white font-bold mb-4">Veri Minimizasyonu</h3>
                <p className="text-sm">Sadece uygulamanın çalışması için gerekli olan minimum veriyi topluyoruz.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem]">
                <h3 className="text-white font-bold mb-4">Uçtan Uca Koruma</h3>
                <p className="text-sm">Tüm veri transferleri TLS 1.3 ve AES-256 standartlarında şifrelenir.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white">2. Haklarınız</h2>
            <p>KVKK ve GDPR uyumluluğu çerçevesinde, verilerinizin silinmesini, taşınmasını veya düzeltilmesini her zaman talep edebilirsiniz.</p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
