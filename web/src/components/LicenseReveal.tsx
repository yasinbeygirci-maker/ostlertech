"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

const TEXT = {
  tr: {
    waiting: "Lisans kodun hazırlanıyor…",
    missing: "Lisans kodun bu sayfada gösterilemedi. Satın alırken kullandığın e-postayla destek adresimize yaz; kodunu hemen iletelim.",
    label: "Lisans kodun. Lütfen bir yere kaydet:",
    copy: "Kopyala",
  },
  en: {
    waiting: "Preparing your license key…",
    missing: "We could not show your license key on this page. Write to our support address from the email you paid with and we will send it right away.",
    label: "Your license key. Please save it somewhere:",
    copy: "Copy",
  },
} as const;

export interface RevealedLicense {
  product: string;
  maxDevices: number | null;
}

// Paddle'ın bildirimi sunucumuza birkaç saniye içinde ulaşır; lisans oluşana kadar kısa aralıklarla sorulur.
// onLicense: kod geldiğinde ürün ve cihaz sayısı (sunucudan; URL ipucuna değil, kayda güvenilir).
export default function LicenseReveal({ lang = "tr", onLicense }: { lang?: "tr" | "en"; onLicense?: (l: RevealedLicense) => void }) {
  const tx = TEXT[lang];
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
        onLicense?.({ product: String(data.product ?? ""), maxDevices: typeof data.maxDevices === "number" ? data.maxDevices : null });
        return;
      }
      if (tries < 30) timer = setTimeout(poll, 3000);
      else setState("missing");
    };
    poll();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "waiting") {
    return <p className="text-sm text-muted animate-pulse">{tx.waiting}</p>;
  }
  if (state === "missing" || !key) {
    return <p className="text-sm text-weak">{tx.missing}</p>;
  }
  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 space-y-3">
      <p className="text-sm text-muted">{tx.label}</p>
      <div className="flex items-center justify-center gap-3">
        <code className="font-mono text-lg md:text-xl font-bold text-white tracking-wider break-all">{key}</code>
        <button
          onClick={() => navigator.clipboard.writeText(key).then(() => setCopied(true))}
          className="shrink-0 rounded-lg p-2 text-muted hover:text-white"
          aria-label={tx.copy}
        >
          {copied ? <Check size={18} className="text-ok" /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}
