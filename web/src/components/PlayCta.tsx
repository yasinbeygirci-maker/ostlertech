"use client";
// Play düğmesi: sunucuda organik UTM'li bağlantıyı yazar (statik derleme bozulmaz), tarayıcıda sayfa adresinin sorgusu
// Reels/DM'den geldiğini söylüyorsa (utm_source=instagram ya da k=ig) Instagram UTM'li bağlantıya geçer.
import { useEffect, useState } from "react";
import { playHref, playOrganik, type Lang } from "@/lib/telefon-calinirsa";

export default function PlayCta({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [href, setHref] = useState(() => playOrganik(lang));
  useEffect(() => {
    setHref(playHref(window.location.search, lang));
  }, [lang]);
  return (
    <a href={href} className="btn-primary !py-3.5" rel="noopener">
      {children}
    </a>
  );
}
