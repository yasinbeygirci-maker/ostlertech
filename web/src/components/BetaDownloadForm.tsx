"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, FileText, Loader2 } from "lucide-react";
import type { AreaPilotCopy } from "@/lib/areapilot-content";
import { waitlistRemainingMs } from "@/lib/waitlist-core";

// AreaPilot indirme formu: yalnız bir düğme + form altı bilgi satırı. E-posta ve AutoCAD sürümü alanları 2026-11-18'de kaldırıldı
// (Supabase KVKK md. 9 kararı): sunucuya kişisel veri gitmez, hiçbir şey saklanmaz.
// Bağlantılar sayfa kaynağında yok, yalnız /api/bekleme yanıtında gelir. Bal küpü alanı ve doldurma süresi bot ayıklamak içindir.
type Downloads = { installer: string; guideTr: string; guideEn: string };

export default function BetaDownloadForm({ copy, lang, privacyHref }: { copy: AreaPilotCopy["form"]; lang: "tr" | "en"; privacyHref: string }) {
  const [started, setStarted] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<Downloads | null>(null);

  useEffect(() => setStarted(Date.now()), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    try {
      // Sunucu 2,5 sn'den hızlı gelen isteği bot sayıp bağlantısız döner; erken basan kullanıcı hata görmesin diye kalan süre beklenir ("Açılıyor…").
      const wait = waitlistRemainingMs(started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const res = await fetch("/api/bekleme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "areapilot", website, t: started }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.downloads) setLinks(data.downloads);
      else setError(copy.errServer); // bot ayıklaması ya da sunucu hatası
    } catch {
      setError(copy.errServer);
    } finally {
      setBusy(false);
    }
  }

  if (links) {
    const item = (href: string, label: string, Icon: typeof Download) => (
      <a href={href} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-white hover:border-primary/60" rel="noopener">
        <Icon size={18} className="shrink-0 text-primary" /> {label}
      </a>
    );
    return (
      <div className="space-y-4" aria-live="polite">
        <p className="flex items-center gap-2 text-lg font-bold text-white">
          <CheckCircle2 size={22} className="text-ok" /> {copy.successTitle}
        </p>
        <div className="space-y-2">
          {item(links.installer, copy.installer, Download)}
          {item(lang === "tr" ? links.guideTr : links.guideEn, lang === "tr" ? copy.guideTr : copy.guideEn, FileText)}
          {item(lang === "tr" ? links.guideEn : links.guideTr, lang === "tr" ? copy.guideEn : copy.guideTr, FileText)}
        </div>
        <p className="text-sm text-muted">{copy.successNote}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {/* Bal küpü: insanlar görmez, doldurulursa bağlantı verilmez. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && <p className="text-sm text-weak">✕ {error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full !py-3 disabled:opacity-60">
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} {busy ? copy.sending : copy.button}
      </button>
      <p className="text-[15px] leading-relaxed text-muted">
        {copy.notice}{" "}
        <a href={privacyHref} className="text-primary hover:text-primary-light underline">
          {copy.noticeLink}
        </a>
        .
      </p>
    </form>
  );
}
