import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Cpu, Database, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-16">
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Kullanıcı Paneli
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            Hesap <span className="text-primary">Durumu</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Güvenlik Seviyesi", value: "Enterprise", icon: ShieldCheck, color: "text-primary" },
            { label: "Aktif Cihazlar", value: "3 Cihaz", icon: Cpu, color: "text-blue-400" },
            { label: "Veri Depolama", value: "Cloud Sync", icon: Database, color: "text-purple-400" },
            { label: "Sistem Durumu", value: "Bağlı", icon: Activity, color: "text-primary" }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 border-white/[0.05] group hover:bg-white/[0.05] transition-all">
              <div className={`w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center ${stat.color} mb-4 shadow-lg`}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-card p-10 border-white/[0.05] bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight">Erken Erişim Özellikleri</h2>
            <p className="text-white/40 max-w-2xl font-medium">
              OstlerTech Erken Erişim programına hoş geldiniz. SyncPass ve DiaSync beta sürümlerine ait güncellemeleri ve özel avantajları buradan takip edebilirsiniz.
            </p>
            <div className="pt-4 flex gap-4">
              <button className="btn-primary">Beta İndir</button>
              <button className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-semibold text-sm">Destek Al</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
