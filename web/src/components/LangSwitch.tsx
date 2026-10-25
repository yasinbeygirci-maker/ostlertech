"use client";

import { usePathname } from "next/navigation";
import { otherLangPath, pageLang, rememberLang, type SiteLang } from "@/lib/lang";

// Üst çubuktaki TR | EN seçici. Seçim hatırlanır (ilk giriş önerisi bir daha sorulmaz).
export default function LangSwitch({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const current = pageLang(pathname);
  const target = otherLangPath(pathname);
  const item = (lang: SiteLang, label: string, name: string) =>
    current === lang ? (
      <span aria-current="true" className="rounded-md bg-primary/15 px-2 py-1 text-white" lang={lang} title={name}>
        {label}
      </span>
    ) : (
      <a
        href={target}
        lang={lang}
        hrefLang={lang}
        title={name}
        onClick={() => rememberLang(lang)}
        className="rounded-md px-2 py-1 text-muted hover:text-white"
      >
        {label}
      </a>
    );
  return (
    <div className={`inline-flex items-center gap-0.5 text-xs font-bold tracking-wide ${className}`} role="group" aria-label="Language / Dil">
      {item("tr", "TR", "Türkçe")}
      {item("en", "EN", "English")}
    </div>
  );
}
