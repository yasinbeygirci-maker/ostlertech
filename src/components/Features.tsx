"use client";

import React from 'react';
import { ShieldCheck, HardDrive, Zap, Activity, Smartphone, Cpu } from 'lucide-react';

const featuresList = [
  {
    icon: <ShieldCheck className="text-[#00f5d4]" size={24} />,
    title: "Zero-Knowledge Şifreleme",
    desc: "Verileriniz daha cihazınızdan çıkmadan AES-256 ile şifrelenir. Şifrenizi biz bile bilmeyiz."
  },
  {
    icon: <HardDrive className="text-[#00f5d4]" size={24} />,
    title: "Yedekle ve Geri Yükle",
    desc: "Verilerinizi Google Drive ile şifreli senkronize edin veya yerel dosya olarak dışa aktarın."
  },
  {
    icon: <Zap className="text-[#00f5d4]" size={24} />,
    title: "Premium Avantajlar",
    desc: "Sınırsız depo, 2FA/TOTP desteği ve yapay zeka destekli tek tıkla güvenlik düzeltmesi."
  },
  {
    icon: <Activity className="text-[#00f5d4]" size={24} />,
    title: "Güvenlik Analizi",
    desc: "Zayıf veya sızdırılmış şifrelerinizi tespit eden akıllı Health Dashboard."
  },
  {
    icon: <Smartphone className="text-[#00f5d4]" size={24} />,
    title: "Mobil ve Masaüstü",
    desc: "Android, iOS, Windows ve macOS için tam uyumlu profesyonel uygulamalar."
  },
  {
    icon: <Cpu className="text-[#00f5d4]" size={24} />,
    title: "Yapay Zeka Desteği",
    desc: "SyncPass Digital Assistant ile güvenlik sorularınıza anında cevap alın."
  }
];

const Features = () => {
  return (
    <section id="teknoloji" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[#00f5d4] font-bold tracking-[0.2em] uppercase text-xs">Teknoloji & Güvenlik</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-white">Kusursuz Mühendislik.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((f, i) => (
            <div key={i} className="glass-card p-8 flex flex-col space-y-4 hover:border-[#00f5d4]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                {f.icon}
              </div>
              <h4 className="text-xl font-bold text-white">{f.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;