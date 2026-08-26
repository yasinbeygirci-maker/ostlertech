"use client";

import React, { useState } from 'react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: "Ücretsiz",
    prices: { TRY: "0", EUR: "0", USD: "0" },
    symbols: { TRY: "₺", EUR: "€", USD: "$" },
    features: ["15 Kayıt Kapasitesi", "Yerel Yedekleme", "Şifre Oluşturucu", "Tek Cihaz"],
    cta: "Ücretsiz Başla",
    popular: false
  },
  {
    name: "Pro",
    prices: { TRY: "1.999,99", EUR: "99,99", USD: "99,99" },
    symbols: { TRY: "₺", EUR: "€", USD: "$" },
    features: ["Sınırsız Kayıt", "Bulut Senkronizasyonu", "2FA Desteği", "Güvenlik Analizi", "Öncelikli Destek"],
    cta: "Pro'ya Geç",
    popular: true
  },
  {
    name: "Kurumsal",
    prices: { TRY: "Özel", EUR: "Özel", USD: "Özel" },
    symbols: { TRY: "", EUR: "", USD: "" },
    features: ["Ekip Paylaşımı", "Yönetici Paneli", "API Erişimi", "7/24 Canlı Destek"],
    cta: "İletişime Geç",
    popular: false
  }
];

const Pricing = () => {
  const [currency, setCurrency] = useState<'TRY' | 'EUR' | 'USD'>('TRY');

  return (
    <section id="fiyatlandirma" className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[#00f5d4] font-bold tracking-[0.2em] uppercase text-xs">Fiyatlandırma</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-white">Size Uygun Çözüm.</h3>
          <p className="text-white/40 max-w-xl mx-auto text-lg">Hangi seviyede olursanız olun, OstlerTech güvenliği yanınızda.</p>
          
          {/* Bölge / Para Birimi Seçici */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10 mt-6">
            <button 
              onClick={() => setCurrency('TRY')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${currency === 'TRY' ? 'bg-[#00f5d4] text-[#020617] shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              Türkiye (1.999,99 ₺)
            </button>
            <button 
              onClick={() => setCurrency('EUR')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${currency === 'EUR' ? 'bg-[#00f5d4] text-[#020617] shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              Avrupa (99,99 €)
            </button>
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${currency === 'USD' ? 'bg-[#00f5d4] text-[#020617] shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              Global (99,99 $)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((t, i) => {
            const price = t.prices[currency];
            const symbol = t.symbols[currency];

            return (
              <div 
                key={i} 
                className={`glass-card p-10 flex flex-col transition-all duration-500 hover:translate-y-[-10px] hover:bg-white/[0.05] ${t.popular ? 'border-[#00f5d4]/40 shadow-[0_20px_50px_rgba(0,245,212,0.1)] relative scale-105 z-10' : ''}`}
              >
                {t.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00f5d4] text-[#020617] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                    En Çok Tercih Edilen
                  </div>
                )}
                <h4 className="text-xl font-bold mb-1 text-white/90">{t.name}</h4>
                <div className="mb-8 mt-2 flex items-baseline">
                  <span className="text-4xl md:text-5xl font-black text-white">
                    {price !== "Özel" ? `${symbol}${price}` : "Özel"}
                  </span>
                  {price !== "Özel" && <span className="text-white/30 text-lg ml-1">/ay</span>}
                </div>
                <ul className="space-y-5 mb-10 flex-1">
                  {t.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-4 text-white/60 text-sm font-medium">
                      <Check size={18} className="text-[#00f5d4] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl font-black transition-all duration-300 text-sm tracking-wide ${t.popular ? 'bg-[#00f5d4] text-[#020617] shadow-lg shadow-[#00f5d4]/20 hover:opacity-90' : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'}`}>
                  {t.cta.toUpperCase()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;