"use client";

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-wider text-white">
          Ostler<span className="text-[#00f5d4]">Tech</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/70">
          <Link href="#urunler" className="hover:text-white transition-colors">Ürünler</Link>
          <Link href="#teknoloji" className="hover:text-white transition-colors">Teknoloji</Link>
          <Link href="#kurumsal" className="hover:text-white transition-colors">Kurumsal</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-bold text-white/80 hover:text-white px-4 py-2">
            Giriş
          </Link>
          <Link href="#fiyatlandirma" className="bg-[#00f5d4] text-[#020617] text-sm font-black px-5 py-2.5 rounded-xl shadow-lg shadow-[#00f5d4]/20 hover:opacity-90 transition-all">
            SyncPass'i Al
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;