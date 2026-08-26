import React from 'react';

const detailItems = [
  {
    title: "Gelişmiş Ayarlar",
    desc: "Karanlık mod, dil seçenekleri ve güvenlik tercihlerinizle SyncPass'i kendinize göre özelleştirin.",
    img: "/Screenshot_20260807_175026.png"
  },
  {
    title: "Güvenli Yedekleme",
    desc: "Verilerinizi hiçbir zaman kaybetmeyin. Google Drive veya yerel dosya yollarıyla tam kontrol sağlayın.",
    img: "/Screenshot_20260807_175134.png"
  },
  {
    title: "TOTP & 2FA",
    desc: "İki faktörlü doğrulama kodlarınızı tek bir güvenli çatı altında toplayın ve yönetin.",
    icon: "🔐"
  }
];

const Details = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-40">
        {/* Ayarlar & Özelleştirme */}
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              Özelleştirme
            </div>
            <h3 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">Sizin Güvenliğiniz, <br/>Sizin Kurallarınız.</h3>
            <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed">
              SyncPass, kullanım alışkanlıklarınıza tam uyum sağlar. Tema seçeneklerinden biyometrik kilit ayarlarına kadar her detayı sizin için düşündük.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { text: "Gelişmiş Ayarlar", status: "Active" },
                { text: "Dinamik Tema", status: "v2.0" },
                { text: "Biyometrik Koruma", status: "Secure" },
                { text: "Akıllı Yedekleme", status: "Cloud" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl group/item hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3 text-white/70 font-semibold text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,245,212,0.5)]" />
                    {item.text}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-white/20 group-hover/item:text-primary transition-colors">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative group perspective-1000">
            <div className="absolute -inset-10 bg-primary/20 blur-[120px] opacity-10 group-hover:opacity-30 transition duration-1000" />
            <div className="relative preserve-3d tilt-card">
              <div className="glass-card p-4 rotate-6 group-hover:rotate-0 transition-all duration-700 max-w-sm mx-auto shadow-2xl relative z-10 border-white/20">
                <img src="/syncpass_settings.png" alt="Settings" className="rounded-2xl shadow-2xl" />

                {/* Floating UI Element over image */}
                <div className="absolute -left-12 top-1/4 p-4 glass-card border-primary/20 animate-float delay-100 hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sistem</p>
                      <p className="text-xs font-bold text-white">Biyometrik Aktif</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet & Çoklu Cihaz Desteği */}
        <div className="relative py-16 md:py-24 bg-white/[0.01] rounded-[2.5rem] md:rounded-[4rem] border border-white/[0.03] px-6 md:px-16 overflow-hidden group/tablet">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-30" />
          <div className="absolute -bottom-24 -left-24 w-64 md:w-96 h-64 md:h-96 bg-accent-purple/10 blur-[100px] md:blur-[150px] rounded-full" />

          <div className="flex flex-col items-center gap-12 md:gap-20 relative z-10">
            <div className="text-center space-y-6 max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-widest">
                Multi-Platform
              </div>
              <h3 className="text-4xl md:text-8xl font-black tracking-tighter text-white leading-tight md:leading-none">Eko-Sistem Uyumu.</h3>
              <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                SyncPass sadece telefonunuzda değil, tabletinizde de yanınızda. Geniş ekranlar için optimize edilmiş profesyonel arayüz.
              </p>
            </div>

            <div className="relative w-full max-w-6xl mx-auto flex justify-center items-end perspective-1000 pb-12 md:pb-0">
              {/* Tablet Görseli */}
              <div className="glass-card p-2 md:p-4 rounded-[1.5rem] md:rounded-[3rem] w-[95%] md:w-[75%] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)] md:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] transform group-hover/tablet:-translate-y-6 transition-all duration-1000 preserve-3d border-white/10">
                <img src="/syncpass_tablet_home.png" alt="Tablet Dashboard" className="rounded-[1rem] md:rounded-[2rem]" />
              </div>
              {/* Telefon Görseli */}
              <div className="glass-card p-1.5 md:p-3 rounded-[2rem] md:rounded-[3.5rem] w-[40%] md:w-[25%] shadow-2xl absolute -bottom-6 md:-bottom-12 -right-2 md:right-10 transform group-hover/tablet:scale-110 group-hover/tablet:-rotate-3 transition-all duration-1000 z-20 border-white/20">
                <img src="/syncpass_home.png" alt="Mobile Dashboard" className="rounded-[1.5rem] md:rounded-[3rem]" />
              </div>
            </div>
          </div>
        </div>

        {/* Son CTA alanı gibi bir Detail (Signup) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16 md:gap-24">
          <div className="flex-1 space-y-8">
             <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[10px] font-black uppercase tracking-widest">
              Hızlı Başlangıç
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Saniyeler İçinde <br/>Kasanızı Kurun.</h3>
            <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed">
              Karmaşık kurulum süreçlerini geride bırakın. Modern ve rehberli arayüzümüz ile güvenliğinizi hemen üst seviyeye taşıyın.
            </p>
            <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/10 border-l-primary border-l-4">
              <p className="italic text-white/60 font-medium italic">"Basitlik, en üst düzey gelişmişliktir."</p>
            </div>
          </div>
          <div className="flex-1 relative group">
            <div className="absolute -inset-4 bg-accent-purple/20 blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="glass-card p-4 -rotate-3 group-hover:rotate-0 transition-all duration-700 max-w-sm mx-auto shadow-2xl relative z-10">
              <img src="/syncpass_signup.png" alt="Create Vault" className="rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
