const screens = [
  {
    title: "Güvenlik Durumu",
    img: "/syncpass_health.png",
    status: "Health %65",
    statusColor: "bg-orange-500"
  },
  {
    title: "Kategoriler",
    img: "/syncpass_categories.png",
    status: "12 Kategori",
    statusColor: "bg-primary"
  },
  {
    title: "Premium Özellikler",
    img: "/syncpass_premium.png",
    status: "Pro Aktif",
    statusColor: "bg-purple-500"
  },
  {
    title: "Maksimum Güvenlik",
    img: "/syncpass_login.png",
    status: "Biyometrik",
    statusColor: "bg-blue-500"
  }
];

const Showcase = () => {
  return (
    <section className="section-padding relative overflow-hidden bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Ürün Vitrini</h2>
          <h3 className="text-5xl md:text-7xl font-black tracking-tight text-white">Detayların Gücü.</h3>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-medium">
            Alex'in ana panelinden sağlık raporlarına kadar her şey tek bir noktada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 perspective-1000">
          {screens.map((s, i) => (
            <div key={i} className={`space-y-6 md:space-y-8 group ${i % 2 === 0 ? 'lg:translate-y-12' : 'lg:-translate-y-4'}`}>
              <div className="relative preserve-3d tilt-card mx-auto max-w-[280px] sm:max-w-none">
                {/* Floating Badge */}
                <div className={`absolute -top-4 -right-4 z-20 ${s.statusColor} text-[#020617] text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl shadow-black/20 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500`}>
                  {s.status}
                </div>

                <div className="glass-card overflow-hidden rounded-[2.5rem] aspect-[9/19] border-white/5 group-hover:border-primary/40 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-full p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Modül</p>
                      <p className="text-sm font-bold text-white">{s.title}</p>
                    </div>
                  </div>
                </div>

                {/* Reflection effect */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-transparent blur-2xl -z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
              </div>

              <div className="text-center">
                <p className="font-bold text-white/30 group-hover:text-primary transition-all duration-300 uppercase tracking-[0.2em] text-[10px]">{s.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;