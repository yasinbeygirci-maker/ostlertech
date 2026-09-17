"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

/**
 * Kurucu Avantajı canlı kontenjan göstergesi.
 * GET /api/anydoc/bekleme → { kalan: number | null }
 * kalan null ise (RPC henüz kurulmadıysa) bileşen hiçbir şey çizmez.
 */
export default function KontenjanGostergesi() {
  const [kalan, setKalan] = useState<number | null>(null);
  const [kontenjan, setKontenjan] = useState(100);

  useEffect(() => {
    let iptal = false;
    fetch("/api/anydoc/bekleme")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (iptal || !d) return;
        if (typeof d.kalan === "number") setKalan(d.kalan);
        if (typeof d.kontenjan === "number") setKontenjan(d.kontenjan);
      })
      .catch(() => {/* sessiz: gösterge kritik değil */});
    return () => {
      iptal = true;
    };
  }, []);

  if (kalan === null) return null;

  const dolu = Math.max(0, kontenjan - kalan);
  const doluluk = Math.min(100, Math.round((dolu / kontenjan) * 100));
  const azaldi = kalan <= 25;

  return (
    <div className="max-w-md mx-auto mt-6" data-kalan={kalan}>
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest mb-2">
        <span className="flex items-center gap-1.5 text-white/50">
          <Users size={12} className="text-primary" />
          Kurucu kontenjanı
        </span>
        <span className={azaldi ? "text-amber-400" : "text-primary"}>
          {kalan > 0 ? `${kalan} / ${kontenjan} kaldı` : "Kontenjan doldu"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            azaldi ? "bg-amber-400" : "bg-primary"
          }`}
          style={{ width: `${doluluk}%` }}
        />
      </div>
    </div>
  );
}
