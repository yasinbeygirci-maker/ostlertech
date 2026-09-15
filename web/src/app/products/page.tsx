import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { URUNLER, Urun } from "@/lib/urunler";
import { HeartPulse, Store, Kanban, ShieldCheck, Monitor, Clock, Sparkles, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Ürünler | OstlerTech",
  description: "OstlerTech ekosistemine ait yenilikçi sağlık, işletme, proje ve güvenlik çözümleri.",
};

// İkon eşleme haritası
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>> = {
  HeartPulse,
  Store,
  Kanban,
  ShieldCheck,
  Monitor,
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl mb-6 shadow-lg shadow-black/40">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">OstlerTech Ekosistemi</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Geleceği Şekillendiren <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-300 to-blue-500">Ürünlerimiz</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/60 font-normal leading-relaxed">
            Sağlık takibinden küçük esnaf çözümlerine, yüksek performanslı proje yönetiminden gelişmiş şifre kasalarına kadar tüm yenilikçi ürünlerimizi keşfedin.
          </p>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {URUNLER.map((urun: Urun) => {
              const IconComponent = iconMap[urun.ikon] || Layers;
              
              return (
                <div 
                  key={urun.id}
                  className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 rounded-3xl p-8 transition-all duration-500 flex flex-col justify-between shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-primary/5 backdrop-blur-xl"
                >
                  {/* Subtle top glow on hover */}
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-150 transition-opacity duration-500" />

                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110"
                        style={{ 
                          backgroundColor: `${urun.renk}15`, 
                          color: urun.renk,
                          boxShadow: `0 8px 25px -5px ${urun.renk}25`
                        }}
                      >
                        <IconComponent size={28} />
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-white/80 backdrop-blur-md">
                        <Clock size={13} className="text-primary animate-spin" style={{ animationDuration: '6s' }} />
                        <span className="capitalize">Yakında</span>
                      </div>
                    </div>

                    {/* Title & Slogan */}
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {urun.ad}
                    </h3>
                    
                    <p className="text-sm font-semibold text-primary/90 mb-4 leading-snug">
                      {urun.slogan}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-white/60 leading-relaxed mb-6 font-normal">
                      {urun.aciklama}
                    </p>
                  </div>

                  {/* Bottom Meta & Marketing Banner */}
                  <div className="pt-6 border-t border-white/[0.06] flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-white/50 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: urun.renk }} />
                        Platform
                      </span>
                      <span className="text-white/80 font-semibold px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        {urun.platform}
                      </span>
                    </div>

                    {/* Yakinda Pazarlama Vurgusu (url null oldugu icin indirme butonu yok) */}
                    <div className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center text-xs font-bold text-white/70 tracking-wider uppercase flex items-center justify-center gap-2 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all duration-300">
                      <Sparkles size={14} className="text-primary" />
                      <span>Çok Yakında Sizlerle</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
