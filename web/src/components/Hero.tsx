"use client";

import React from 'react';
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import Waitlist from './Waitlist';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-40 flex flex-col items-center px-4 overflow-hidden">
      {/* Arka plan ışık oyunları - Daha sofistike derinlik */}
      <div className="absolute top-0 -z-10 h-full w-full overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/5 blur-[150px]"
        />
        <div className="absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-primary text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>SyncPass Yayında</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest">
            <Activity size={14} />
            <span>DiaSync Beta Testi Başladı</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-gradient leading-[1.1]"
        >
          Dijital Güvenliğin <br />
          Yeni Standartı.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto text-xl md:text-2xl text-white/50 font-medium leading-relaxed px-4"
        >
          OstlerTech ile kontrol sizde. SyncPass ile tam güvenlik, <br className="hidden md:block" />
          DiaSync ile ailenizle kesintisiz bağ kurun.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-8 sm:pt-12"
        >
          <Waitlist productName="DiaSync Waitlist" className="sm:scale-110" />
        </motion.div>

        {/* Ürün Önizleme - 3D/Floating Effect */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-28 relative mx-auto max-w-4xl"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 scale-75" />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card p-3 group shadow-[0_0_50px_-12px_rgba(0,245,212,0.3)]"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#020617] relative aspect-video">
              <img
                src="/syncpass_home.png"
                alt="OstlerTech Interface"
                className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;