import React from 'react';
import { Twitter, Github, Linkedin, Globe, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.05] pt-24 pb-12 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          {/* Brand Section */}
          <div className="space-y-6 col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-[#020617] text-sm">O</div>
              <span className="text-xl font-bold tracking-tight text-white">Ostler<span className="text-primary">Tech</span></span>
            </div>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
              Geleceğin dijital güvenlik ve aile senkronizasyon çözümlerini bugünden inşa ediyoruz.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all duration-300">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Ürünler</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/40 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group">
                <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                SyncPass
              </a></li>
              <li><a href="#" className="text-white/40 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group">
                <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                DiaSync
              </a></li>
              <li><a href="#" className="text-white/40 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group text-xs px-2 py-0.5 bg-primary/5 rounded border border-primary/10 inline-flex">
                Beta Erişimi
              </a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Kurumsal</h4>
            <ul className="space-y-4">
              <li><a href="/syncpass/privacy" className="text-white/40 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group">
                <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                Gizlilik Politikası
              </a></li>
              <li><a href="/kullanim-sartlari" className="text-white/40 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group">
                <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                Kullanım Şartları
              </a></li>
              <li><a href="#" className="text-white/40 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 group">
                <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                İletişim
              </a></li>
            </ul>
          </div>

          {/* Status Section */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Sistem Durumu</h4>
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Global Server</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-tighter">Online</span>
                </div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[99.9%] bg-primary shadow-[0_0_10px_rgba(0,245,212,0.5)]" />
              </div>
              <p className="text-[10px] text-white/30 font-medium italic">
                Uptime: 99.9% — Tüm servisler optimize edildi.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 OSTLER TECHNOLOGY GROUP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-white/20">
               <Globe size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Global / TR</span>
             </div>
             <div className="flex items-center gap-2 text-white/20">
               <ShieldCheck size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 Ready</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
