"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-xl border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm group-hover:bg-primary/40 transition duration-500"></div>
            <div className="relative w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-[#020617] text-lg shadow-lg">O</div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Ostler<span className="text-primary">Tech</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide uppercase text-white/50">
          <a href="/products" className="hover:text-primary transition-all duration-300">Ürünler</a>
          <a href="#" className="hover:text-primary transition-all duration-300">Teknoloji</a>
          <a href="#" className="hover:text-primary transition-all duration-300">Kurumsal</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="/login" className="hidden sm:block text-sm font-bold text-white/70 hover:text-white transition-colors">
            Giriş
          </a>
          <a href="/products" className="hidden sm:block bg-white/90 hover:bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-xl shadow-white/5">
            Ürünlerimiz
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-2xl border-b border-white/[0.05] transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-8 flex flex-col gap-6">
          <a href="/products" className="text-xl font-bold text-white/80 hover:text-primary transition-colors">Ürünler</a>
          <a href="#" className="text-xl font-bold text-white/80 hover:text-primary transition-colors">Teknoloji</a>
          <a href="#" className="text-xl font-bold text-white/80 hover:text-primary transition-colors">Kurumsal</a>
          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <button className="w-full py-4 text-center font-bold text-white/70 hover:text-white border border-white/10 rounded-2xl">
              Giriş Yap
            </button>
            <a href="/products" className="w-full py-4 text-center bg-primary text-[#020617] font-black rounded-2xl shadow-lg shadow-primary/20">
              ÜRÜNLERİMİZ
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
