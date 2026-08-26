"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Cpu, Sparkles, Smartphone, Tablet, KeyRound, Activity } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Ana Ekran', image: '/syncpass_home.png', tabletImage: '/syncpass_tablet_home.png', icon: Shield },
  { id: 'generator', label: 'Şifre Üretici', image: '/syncpass_generator.png', tabletImage: '/syncpass_tablet_home.png', icon: KeyRound },
  { id: 'health', label: 'Güvenlik Analizi', image: '/syncpass_health.png', tabletImage: '/syncpass_tablet_home.png', icon: Activity },
  { id: 'assistant', label: 'Yapay Zeka', image: '/syncpass_assistant.png', tabletImage: '/syncpass_tablet_home.png', icon: Cpu },
];

export default function Showcase() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet'>('mobile');

  return (
    <section id="urunler" className="py-28 relative overflow-hidden bg-[#020617]/50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Başlık ve Sekmeler */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/20 text-[#00f5d4] text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Ürün Vitrini</span>
          </div>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-white">Detayların Gücü.</h3>
          <p className="text-white/40 max-w-xl mx-auto text-lg">Ana ekrandan güvenlik analizlerine kadar her şey tek bir noktada kontrolünüz altında.</p>
          
          {/* Özellik Sekmeleri */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab.id === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-[#00f5d4] text-[#020617] border-[#00f5d4] shadow-[0_0_20px_rgba(0,245,212,0.3)] scale-105'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cihaz Boyut Seçici (Mobil / Tablet) */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10 mt-6">
            <button 
              onClick={() => setDeviceType('mobile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${deviceType === 'mobile' ? 'bg-white/10 text-[#00f5d4]' : 'text-white/60 hover:text-white'}`}
            >
              <Smartphone size={14} />
              <span>Mobil</span>
            </button>
            <button 
              onClick={() => setDeviceType('tablet')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${deviceType === 'tablet' ? 'bg-white/10 text-[#00f5d4]' : 'text-white/60 hover:text-white'}`}
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
          </div>
        </div>

        {/* Ana İçerik Grid Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-12">
          
          {/* Sol Özellik Kartları */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-l-4 border-l-[#00f5d4] hover:border-l-white transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-[#00f5d4]" size={22} />
                <h4 className="text-lg font-bold text-white">Güvenlik Durumu</h4>
              </div>
              <p className="text-white/50 text-sm">Health Dashboard ile zayıf veya sızdırılmış şifrelerinizi anında tespit edin.</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-purple-500 hover:border-l-white transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="text-purple-400" size={22} />
                <h4 className="text-lg font-bold text-white">Biyometrik Koruma</h4>
              </div>
              <p className="text-white/50 text-sm">Parmak izi ve yüz tanıma entegrasyonuyla kasanız her zaman güvende.</p>
            </div>
          </div>

          {/* Merkez: Dinamik Ekran Görüntüsü Vitrini */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-[#00f5d4]/10 blur-[120px] rounded-full -z-10" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeTab.id}-${deviceType}`}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className={`glass-card p-3 relative group shadow-[0_0_50px_-12px_rgba(0,245,212,0.2)] w-full ${deviceType === 'tablet' ? 'max-w-2xl' : 'max-w-sm'}`}
              >
                <div className={`rounded-2xl overflow-hidden border border-white/10 bg-[#020617] relative ${deviceType === 'tablet' ? 'aspect-[16/10]' : 'aspect-[9/19]'}`}>
                  <img
                    src={deviceType === 'mobile' ? activeTab.image : activeTab.tabletImage}
                    alt={activeTab.label}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-40" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sağ Özellik Kartları */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-l-4 border-l-blue-500 hover:border-l-white transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="text-blue-400" size={22} />
                <h4 className="text-lg font-bold text-white">Yapay Zeka Asistanı</h4>
              </div>
              <p className="text-white/50 text-sm">Digital Assistant ile şifre yönetimi ve güvenlik ipuçlarına hızlıca ulaşın.</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-emerald-500 hover:border-l-white transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-emerald-400" size={22} />
                <h4 className="text-lg font-bold text-white">Bulut Senkronizasyonu</h4>
              </div>
              <p className="text-white/50 text-sm">Google Drive desteği ile tüm cihazlarınızda şifreleriniz eş zamanlı kalsın.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}