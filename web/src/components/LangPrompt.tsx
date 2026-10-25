"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LANG_KEY, otherLangPath, pageLang, rememberLang, type SiteLang } from "@/lib/lang";

const TEXT: Record<SiteLang, { q: string; go: string; stay: string }> = {
  tr: { q: "Bu sayfanın Türkçesi de var.", go: "Türkçe'ye geç", stay: "İngilizce kalsın" },
  en: { q: "This page is also available in English.", go: "Switch to English", stay: "Keep Türkçe" },
};

// İlk girişte dil önerisi: tarayıcı dili sayfa dilinden farklıysa küçük bir şerit çıkar. Seçim hatırlanır.
// Otomatik yönlendirme yalnız ana sayfada ve yalnız kayıtlı seçime göre yapılır (derin bağlantılar bozulmaz).
export default function LangPrompt() {
  const pathname = usePathname() || "/";
  const [offer, setOffer] = useState<SiteLang | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch {
      saved = null;
    }
    const here = pageLang(pathname);
    if (saved === "tr" || saved === "en") {
      if (saved !== here && (pathname === "/" || pathname === "/en")) window.location.replace(otherLangPath(pathname));
      setOffer(null);
      return;
    }
    const browser: SiteLang = (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";
    setOffer(browser !== here ? browser : null);
  }, [pathname]);

  if (!offer) return null;
  const t = TEXT[offer];
  const here = pageLang(pathname);
  return (
    <div
      role="dialog"
      aria-label="Language / Dil"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-line bg-surface/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <p className="text-sm text-foreground" lang={offer}>{t.q}</p>
      <div className="flex shrink-0 gap-2">
        <a href={otherLangPath(pathname)} lang={offer} hrefLang={offer} onClick={() => rememberLang(offer)} className="btn-primary !py-2 !px-4 text-sm">
          {t.go}
        </a>
        <button
          type="button"
          lang={here}
          onClick={() => {
            rememberLang(here);
            setOffer(null);
          }}
          className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-white"
        >
          {t.stay}
        </button>
      </div>
    </div>
  );
}
