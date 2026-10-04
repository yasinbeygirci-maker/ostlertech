"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

// Paddle'ın bildirimi sunucumuza birkaç saniye içinde ulaşır; lisans oluşana kadar kısa aralıklarla sorulur.
export default function LicenseReveal() {
  const [key, setKey] = useState<string | null>(null);
  const [state, setState] = useState<"waiting" | "ready" | "missing">("waiting");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let txn: string | null = new URLSearchParams(window.location.search).get("txn");
    try {
      txn ??= sessionStorage.getItem("paddle_txn");
    } catch {}
    if (!txn) {
      setState("missing");
      return;
    }
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      tries++;
      const res = await fetch(`/api/license/by-transaction?txn=${encodeURIComponent(txn!)}`, { cache: "no-store" }).catch(() => null);
      if (res?.ok) {
        const data = await res.json();
        setKey(data.key);
        setState("ready");
        return;
      }
      if (tries < 30) timer = setTimeout(poll, 3000);
      else setState("missing");
    };
    poll();
    return () => clearTimeout(timer);
  }, []);

  if (state === "waiting") {
    return <p className="text-sm text-muted animate-pulse">Lisans kodunuz hazırlanıyor…</p>;
  }
  if (state === "missing" || !key) {
    return (
      <p className="text-sm text-weak">
        Lisans kodunuz bu sayfada gösterilemedi. Satın alırken kullandığınız e-postayla destek adresimize yazın; kodunuzu hemen
        iletelim.
      </p>
    );
  }
  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 space-y-3">
      <p className="text-sm text-muted">Lisans kodunuz. Lütfen bir yere kaydedin:</p>
      <div className="flex items-center justify-center gap-3">
        <code className="font-mono text-lg md:text-xl font-bold text-white tracking-wider break-all">{key}</code>
        <button
          onClick={() => navigator.clipboard.writeText(key).then(() => setCopied(true))}
          className="shrink-0 rounded-lg p-2 text-muted hover:text-white"
          aria-label="Kopyala"
        >
          {copied ? <Check size={18} className="text-ok" /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}
