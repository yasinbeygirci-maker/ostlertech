"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { SalesLang, SalesPayload } from "@/lib/areapilot-sales";

// Satış bölümünün kapısı. Bayrak kapalıyken (varsayılan) HİÇBİR şey çizmez ve Paddle / ödeme kodu hiç yüklenmez:
// açık bölüm yalnız sunucu "open:true" derse ayrı pakette (dynamic import) indirilir. Fiyat kimlikleri bu dosyada yoktur;
// sunucu yanıtıyla (/api/areapilot/satis) yalnız bayrak açıkken gelir.
const Open = dynamic(() => import("./AreaPilotPricingOpen"), { ssr: false });

export default function AreaPilotPricing({ lang }: { lang: SalesLang }) {
  const [payload, setPayload] = useState<Extract<SalesPayload, { open: true }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/areapilot/satis", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((p: SalesPayload | null) => {
        if (!cancelled && p && p.open === true) setPayload(p);
      })
      .catch(() => {}); // Sunucuya ulaşılamazsa bölüm gösterilmez (satış kapalı gibi davranır).
    return () => {
      cancelled = true;
    };
  }, []);

  if (!payload) return null;
  return <Open lang={lang} payload={payload} />;
}
