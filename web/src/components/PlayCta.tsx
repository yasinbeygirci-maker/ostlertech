"use client";
// Play düğmesi: sunucuda sayfanın organik (site UTM'li) bağlantısını yazar (statik derleme bozulmaz); tarayıcıda sayfa
// adresinin sorgusu Reels/DM'den geldiğini söylüyorsa (utm_source=instagram ya da k=ig) Instagram UTM'li bağlantıya geçer.
// `ig` sayfa başına sabit bir değerdir (bağımlılık listesine girmez).
import { useEffect, useState } from "react";
import { playHrefFor, type IgDefaults } from "@/lib/play-utm";

export default function PlayCta({
  organicHref,
  ig,
  children,
}: {
  organicHref: string;
  ig?: IgDefaults;
  children: React.ReactNode;
}) {
  const [href, setHref] = useState(organicHref);
  useEffect(() => {
    setHref(playHrefFor(window.location.search, organicHref, ig));
  }, [organicHref]);
  return (
    <a href={href} className="btn-primary !py-3.5" rel="noopener">
      {children}
    </a>
  );
}
