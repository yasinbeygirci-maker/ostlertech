"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

// İngilizce üst çubuğun 1024 px altındaki menüsü (Aslı 2026-11-07: EN telefonda menü yoktu, AreaPilot ve fiyata ulaşılamıyordu).
// TR Navbar'daki mobil menüyle aynı davranış: Esc kapatır, odak düğmeye döner, kapalıyken panel inert.
export interface EnMenuLink {
  href: string;
  label: string;
}

export default function EnMenu({ links, cta }: { links: EnMenuLink[]; cta: EnMenuLink & { external?: boolean } }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    <>
      <button
        ref={buttonRef}
        type="button"
        className="xl:hidden -mr-2 flex h-12 w-12 items-center justify-center text-muted hover:text-white"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="en-mobile-menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        id="en-mobile-menu"
        inert={!open}
        className="xl:hidden absolute right-3 left-3 top-[calc(100%+4px)] rounded-2xl border border-line bg-background px-5 py-5 flex flex-col gap-1 shadow-xl transition-[transform,opacity] duration-200"
        style={{ opacity: open ? 1 : 0, transform: open ? "none" : "scale(0.96)", pointerEvents: open ? "auto" : "none" }}
      >
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-[48px] items-center text-lg font-semibold text-foreground hover:text-white">
            {l.label}
          </a>
        ))}
        <a
          href={cta.href}
          onClick={() => setOpen(false)}
          {...(cta.external ? { target: "_blank", rel: "noopener" } : {})}
          className="btn-primary mt-3 !min-h-[48px]"
        >
          {cta.label}
        </a>
      </div>
    </>
  );
}
