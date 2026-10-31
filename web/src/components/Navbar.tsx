"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { PLAY_URL } from "@/lib/site";

const links = [
  { href: "/syncpass#ozellikler", label: "Özellikler" },
  { href: "/syncpass#masaustu", label: "Masaüstü" },
  { href: "/syncpass#guvenlik", label: "Güvenlik" },
  { href: "/syncpass#fiyat", label: "Fiyat" },
  { href: "/products", label: "Ürünler" },
  { href: "/areapilot", label: "AreaPilot" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc ile kapat, odak tetikleyen düğmeye dönsün
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      {/* Yarı saydam malzeme katmanı: yalnız opaklık değişir, kesilebilir */}
      <div
        aria-hidden
        className="material absolute inset-0 -z-10 transition-opacity duration-300 ease-out"
        style={{ opacity: scrolled || open ? 1 : 0, boxShadow: "inset 0 -1px 0 var(--hairline)" }}
      />
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="/" className="press flex items-center gap-2.5 min-h-[44px]" aria-label="OstlerTech ana sayfa">
          <img src="/logo-ostlertech.png" alt="" width={30} height={30} className="rounded-full logo-tile" />
          <span className="text-lg font-bold tracking-tight text-white">
            Ostler<span className="text-primary">Tech</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="press inline-flex items-center min-h-[44px] px-3 hover:text-white">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href={PLAY_URL} target="_blank" rel="noopener" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm">
            SyncPass'i indir
          </a>
          <button
            ref={buttonRef}
            className="press lg:hidden -mr-2 flex h-12 w-12 items-center justify-center text-muted hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            aria-controls="mobil-menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Açılış ve kapanış aynı yoldan; köken düğmenin bulunduğu sağ üst köşe */}
      <div
        id="mobil-menu"
        inert={!open}
        className="menu-panel material lg:hidden absolute right-3 left-3 top-[calc(100%-4px)] rounded-2xl px-5 py-5 flex flex-col gap-1 origin-top-right transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(0.2,0.9,0.25,1)]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "none" : "scale(0.94)",
          pointerEvents: open ? "auto" : "none",
          background: "var(--nav-bg)",
        }}
      >
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="press flex min-h-[48px] items-center text-lg font-semibold text-foreground">
            {l.label}
          </a>
        ))}
        <a href={PLAY_URL} target="_blank" rel="noopener" className="btn-primary mt-3 !min-h-[48px]">
          SyncPass: Google Play&apos;den indir
        </a>
      </div>
    </nav>
  );
}
