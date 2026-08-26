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
        <div className="space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Yasal Döküman
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Gizlilik <span className="text-primary">Politikası</span>
          </h1>
          <div className="flex items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest pt-2">
            <span>Versiyon 1.2</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Son Güncelleme: 24 Ağustos 2026</span>
          </div>
        </div>

        <div className="space-y-16 text-white/50 leading-relaxed font-medium">
          <section className="glass-card p-8 md:p-12 border-white/[0.05] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <p className="text-lg md:text-xl text-white/70">
              Ostler Tech olarak ("biz", "şirketimiz"), DiaSync mobil uygulamasını kullanımınız sırasında gizliliğinize en üst düzeyde saygı duyuyor ve verilerinizi askeri standartlarda koruyoruz.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">01</span>
              Toplanan Bilgiler
            </h2>
            <p>DiaSync, aile içi takip, iletişim ve organizasyon süreçlerini koordine etmek amacıyla şu verileri uçtan uca şifreli olarak işleyebilir:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {[
                { title: "Hesap Bilgileri", desc: "E-posta ve temel kimlik verileri." },
                { title: "Uygulama İçi Veriler", desc: "Aile içi paylaşımlar ve görevler." },
                { title: "Cihaz Verileri", desc: "Performans ve hata raporları." },
                { title: "Senkronizasyon", desc: "Cihazlar arası veri aktarımı." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl group hover:bg-white/[0.05] transition-colors">
                  <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-2">{item.title}</h4>
                  <p className="text-sm text-white/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">02</span>
              Veri Güvenliği
            </h2>
            <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-4">
              <p className="text-white/80">
                Verileriniz asla üçüncü şahıslarla, reklam ortaklarıyla veya ticari kurumlarla paylaşılmaz. OstlerTech mimarisi **"Zero-Knowledge"** prensibi üzerine kuruludur.
              </p>
              <p className="text-sm">
                Tüm veriler cihazınızda şifrelenir ve sunucularımıza şifreli olarak iletilir. Anahtarlarınız sadece sizde bulunur.
              </p>
            </div>
          </section>

          <section className="space-y-8 pt-12 border-t border-white/5">
            <h3 className="text-xl font-bold text-white">Sorularınız mı var?</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 glass-card p-6 border-white/[0.05]">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Hızlı Destek</p>
                <p className="text-white font-bold">yasin@ostlertech.com</p>
              </div>
              <div className="flex-1 glass-card p-6 border-white/[0.05]">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Kurumsal Web</p>
                <p className="text-white font-bold">www.ostlertech.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
