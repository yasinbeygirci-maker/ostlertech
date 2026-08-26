import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent-purple/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-40 pb-24">
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Kullanım Koşulları
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Hizmet <span className="text-primary">Şartları</span>
          </h1>
          <div className="flex items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest pt-2">
            <span>Global Versiyon 1.0</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Son Güncelleme: 26 Ağustos 2026</span>
          </div>
        </div>

        <div className="space-y-12 text-white/50 leading-relaxed font-medium">
          <section className="glass-card p-10 border-white/[0.05]">
             <h2 className="text-2xl font-black text-white mb-6">1. Kabul Edilme</h2>
             <p className="text-lg">
               OstlerTech platformlarını kullanarak, bu hizmet şartlarını ve gizlilik politikamızı kabul etmiş sayılırsınız. Bu şartlar, tüm ürünlerimiz için geçerli olan ana çerçeveyi oluşturur.
             </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white">2. Sorumluluklar</h2>
            <p>SyncPass gibi güvenlik ürünlerimizde, Master Password (Ana Şifre) sorumluluğu tamamen kullanıcıya aittir. Zero-Knowledge mimarimiz gereği, unuttuğunuz ana şifreleri geri getirmemiz teknik olarak imkansızdır.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white">3. Fikri Mülkiyet</h2>
            <p>OstlerTech ve bağlı markalarımıza ait tüm yazılım, tasarım ve içerikler Ostler Teknoloji Grubu'na aittir ve telif haklarıyla korunmaktadır.</p>
          </section>

          <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] text-center italic">
            "Yenilikçi çözümlerimizle güvenli bir dijital gelecek inşa ediyoruz."
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
