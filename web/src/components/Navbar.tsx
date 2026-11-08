"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PLAY_URL } from "@/lib/site";

// Türkçe sayfanın İngilizce karşılığı; tabloda yoksa İngilizce ana sayfa.
const EN_PATH: Record<string, string> = {
  "/": "/en",
  "/areapilot": "/en/areapilot",
  "/cornertab": "/en/cornertab",
  "/cornertab/privacy": "/en/cornertab/privacy",
  "/dijital-guvenlik-plani": "/en/digital-security-plan",
  "/gizlilik": "/en/privacy",
  "/guvenlik/sifreleme-belgesi": "/en/security/whitepaper",
  "/guvenlik-acigi-bildir": "/en/report-vulnerability",
  "/guvenlik-kontrol-listesi": "/en/security-checklist",
  "/hakkimizda": "/en/about",
  "/iletisim": "/en/contact",
  "/products": "/en/products",
  "/syncpass": "/en/syncpass",
  "/syncpass/privacy": "/syncpass/privacy#en",
  "/syncpass-masaustu": "/en/syncpass-desktop",
  "/videolar": "/en/videos",
  "/hozeni/privacy": "/en/hozeni/privacy",
  "/iki-adimli-dogrulama": "/en/password-manager-with-authenticator",
  "/kullanim-sartlari": "/en/terms",
  "/oklar/privacy": "/en/oklar/privacy",
  "/otopark/privacy": "/en/otopark/privacy",
  "/packle/privacy": "/en/packle/privacy",
  "/sifre-yoneticisi": "/en/offline-password-manager",
  "/sifre-yoneticisi-karsilastirma": "/en/password-manager-comparison",
  "/satin-al": "/en/pricing",
  "/syncsite": "/en/syncsite",
  "/syncsite/gizlilik": "/en/syncsite/privacy",
  "/syncsite/hesap-silme": "/en/syncsite/delete-account",
  "/teslimat-ve-iade": "/en/refunds",
  "/telefon-calinirsa": "/en/if-your-phone-is-stolen",
};

const links = [
  { href: "/syncpass#ozellikler", label: "Özellikler" },
  { href: "/syncpass#masaustu", label: "Masaüstü" },
  { href: "/syncpass#guvenlik", label: "Güvenlik" },
  { href: "/syncpass#fiyat", label: "Fiyat" },
  { href: "/products", label: "Ürünler" },
  { href: "/areapilot", label: "AreaPilot" },
  { href: "/videolar", label: "Videolar" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? "/";
  const enHref = EN_PATH[pathname.replace(/\/+$/, "") || "/"] ?? "/en";
  // AreaPilot sayfasında sağ üst düğme o ürüne gider, SyncPass'e değil.
  const apSayfasi = pathname === "/areapilot" || pathname.startsWith("/areapilot/");

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

        <div className="hidden xl:flex items-center gap-2 text-sm font-medium text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="press inline-flex items-center min-h-[44px] px-3 hover:text-white">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm" role="group" aria-label="Dil / Language">
            <span aria-current="true" lang="tr" className="font-semibold text-white"><span className="sm:hidden">TR</span><span className="hidden sm:inline">Türkçe</span></span>
            <span aria-hidden className="text-muted">|</span>
            <a href={enHref} lang="en" hrefLang="en" aria-label="English" className="press inline-flex items-center min-h-[44px] text-muted hover:text-white"><span className="sm:hidden">EN</span><span className="hidden sm:inline">English</span></a>
          </div>
          {apSayfasi ? (
            <a href="#indir" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm whitespace-nowrap">
              7 gün ücretsiz dene
            </a>
          ) : (
            <a href={PLAY_URL} target="_blank" rel="noopener" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm whitespace-nowrap">
              SyncPass'i indir
            </a>
          )}
          <button
            ref={buttonRef}
            className="press xl:hidden -mr-2 flex h-12 w-12 items-center justify-center text-muted hover:text-white"
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
        className="menu-panel material xl:hidden absolute right-3 left-3 top-[calc(100%-4px)] rounded-2xl px-5 py-5 flex flex-col gap-1 origin-top-right transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(0.2,0.9,0.25,1)]"
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
        {apSayfasi ? (
          <a href="#indir" onClick={() => setOpen(false)} className="btn-primary mt-3 !min-h-[48px]">
            AreaPilot: 7 gün ücretsiz dene
          </a>
        ) : (
          <a href={PLAY_URL} target="_blank" rel="noopener" className="btn-primary mt-3 !min-h-[48px]">
            SyncPass: Google Play&apos;den indir
          </a>
        )}
      </div>
    </nav>
  );
}
