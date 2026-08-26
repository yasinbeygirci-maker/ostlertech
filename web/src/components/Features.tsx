import React from 'react';
import { Lock, Cloud, Zap, Activity, Smartphone, Cpu } from 'lucide-react';

const features = [
  {
    title: "Zero-Knowledge Şifreleme",
    desc: "Verileriniz daha cihazınızdan çıkmadan AES-256 ile şifrelenir. Şifrenizi biz bile bilmeyiz.",
    icon: Lock
  },
  {
    title: "Yedekle ve Geri Yükle",
    desc: "Verilerinizi Google Drive ile şifreli senkronize edin veya yerel dosya olarak dışa aktarın.",
    icon: Cloud
  },
  {
    title: "Premium Avantajlar",
    desc: "Sınırsız depo, 2FA/TOTP desteği ve yapay zeka destekli tek tıkla güvenlik düzeltmesi.",
    icon: Zap
  },
  {
    title: "Güvenlik Analizi",
    desc: "Zayıf veya sızdırılmış şifrelerinizi tespit eden akıllı Health Dashboard.",
    icon: Activity
  },
  {
    title: "Mobil ve Masaüstü",
    desc: "Android, iOS, Windows ve macOS için tam uyumlu profesyonel uygulamalar.",
    icon: Smartphone
  },
  {
    title: "Yapay Zeka Desteği",
    desc: "SyncPass Digital Assistant ile güvenlik sorularınıza anında cevap alın.",
    icon: Cpu
  }
];

const Features = () => {
  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Teknoloji & Güvenlik</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight">Kusursuz Mühendislik.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-10 hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />

              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-[#020617] transition-all duration-500 shadow-xl">
                <f.icon size={28} strokeWidth={1.5} />
              </div>

              <h4 className="text-2xl font-bold mb-4 text-white/90">{f.title}</h4>
              <p className="text-white/40 leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
