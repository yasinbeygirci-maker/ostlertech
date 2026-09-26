"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { PLAY_URL } from "@/lib/site";

const links = [
  { href: "/#ozellikler", label: "Özellikler" },
  { href: "/#masaustu", label: "Masaüstü" },
  { href: "/#guvenlik", label: "Güvenlik" },
  { href: "/#fiyat", label: "Fiyat" },
  { href: "/products", label: "Ürünler" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-background/85 backdrop-blur-xl border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5" aria-label="OstlerTech ana sayfa">
          <img src="/logo-ostlertech.png" alt="" width={30} height={30} className="rounded-full" />
          <span className="text-lg font-bold tracking-tight text-white">
            Ostler<span className="text-primary">Tech</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href={PLAY_URL} target="_blank" rel="noopener" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm">
            Uygulamayı indir
          </a>
          <button
            className="md:hidden p-2 text-muted hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line px-5 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg font-semibold text-foreground">
              {l.label}
            </a>
          ))}
          <a href={PLAY_URL} target="_blank" rel="noopener" className="btn-primary mt-2">
            Google Play&apos;den indir
          </a>
        </div>
      )}
    </nav>
  );
}
