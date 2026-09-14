import React from 'react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: "Ücretsiz",
    prices: { TRY: "0", EUR: "0", USD: "0" },
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
  // Not: İlerleyen aşamada buraya tarayıcı diline veya konuma göre bölge seçimi (TRY/EUR/USD) ekleyebilirsiniz.
  // Şimdilik varsayılan olarak Türkiye/TRY bazlı gösterim için currency sabitini ayarlayabilirsiniz.
  const currency: string = "TRY"; // Örn: "TRY", "EUR", "USD"

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-purple/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Fiyatlandırma</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight">Size Uygun Çözüm.</h3>
          <p className="text-white/40 max-w-xl mx-auto text-lg">Hangi seviyede olursanız olun, OstlerTech güvenliği yanınızda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((t, i) => {
            const price = t.prices[currency as keyof typeof t.prices];
            const symbol = t.symbols ? t.symbols[currency as keyof typeof t.symbols] : (price !== "Özel" ? "₺" : "");

            return (
              <div 
                key={i} 
                className={`glass-card p-10 flex flex-col transition-all duration-500 hover:translate-y-[-10px] hover:bg-white/[0.05] ${t.popular ? 'border-primary/40 shadow-[0_20px_50px_rgba(0,245,212,0.1)] relative scale-105 z-10' : ''}`}
              >
                {t.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-[#020617] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                    En Çok Tercih Edilen
                  </div>
                )}
                <h4 className="text-xl font-bold mb-1 text-white/90">{t.name}</h4>
                <div className="mb-8 mt-2 flex items-baseline">
                  <span className="text-4xl md:text-5xl font-black">
                    {symbol && currency === "USD" ? `${symbol}${price}` : `${price} ${symbol}`}
                  </span>
                  {price !== "Özel" && <span className="text-white/30 text-lg ml-1">/ay</span>}
                </div>
                <ul className="space-y-5 mb-10 flex-1">
                  {t.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-4 text-white/60 text-sm font-medium">
                      <Check size={18} className="text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl font-black transition-all duration-300 text-sm tracking-wide ${t.popular ? 'bg-primary text-[#020617] shadow-lg shadow-primary/20' : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'}`}>
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