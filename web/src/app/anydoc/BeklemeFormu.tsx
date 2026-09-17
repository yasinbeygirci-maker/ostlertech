"use client";

import { useState } from "react";
import { Loader2, PartyPopper, ArrowRight } from "lucide-react";

type Durum = "bos" | "gonderiliyor" | "basarili" | "hata";

export default function BeklemeFormu() {
  const [email, setEmail] = useState("");
  const [durum, setDurum] = useState<Durum>("bos");
  const [mesaj, setMesaj] = useState("");
  const [sira, setSira] = useState<number | null>(null);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    if (durum === "gonderiliyor") return;
    setDurum("gonderiliyor");
    setMesaj("");

    try {
      const cevap = await fetch("/api/anydoc/bekleme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const veri = await cevap.json();

      if (cevap.ok) {
        setDurum("basarili");
        setMesaj(veri.mesaj || "Listedesin!");
        setSira(typeof veri.sira === "number" && veri.sira > 0 ? veri.sira : null);
      } else {
        setDurum("hata");
        setMesaj(veri.hata || "Bir şeyler ters gitti, tekrar dene.");
      }
    } catch {
      setDurum("hata");
      setMesaj("Bağlantı hatası — internetini kontrol edip tekrar dene.");
    }
  }

  if (durum === "basarili") {
    return (
      <div className="max-w-md mx-auto flex items-center gap-3 px-6 py-5 rounded-2xl bg-primary/10 border border-primary/30 text-left">
        <PartyPopper size={22} className="text-primary shrink-0" />
        <div>
          <div className="font-bold text-sm">
            {sira ? `${sira}. sıradasin! 🎉` : "Listedesin! 🎉"}
          </div>
          <div className="text-xs text-white/60 mt-0.5">{mesaj}</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={gonder} className="max-w-md mx-auto">
      {/* Honeypot: botlar görür doldurur, insanlar görmez */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-posta adresin"
          className="flex-1 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/60 focus:bg-white/[0.06] transition-colors"
        />
        <button
          type="submit"
          disabled={durum === "gonderiliyor"}
          className="group flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-primary text-[#020617] text-sm font-black hover:brightness-110 disabled:opacity-60 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
        >
          {durum === "gonderiliyor" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Erken Erişime Katıl
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
      {durum === "hata" && <p className="text-xs text-red-400 mt-3 text-left">{mesaj}</p>}
    </form>
  );
}
