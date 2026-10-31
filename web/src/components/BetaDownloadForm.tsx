"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, FileText, Loader2 } from "lucide-react";
import type { AreaPilotCopy } from "@/lib/areapilot-content";

// AreaPilot açık beta formu: e-posta + isteğe bağlı AutoCAD sürümü + AYRI, işaretsiz duyuru onay kutusu (2026-10-31 T4-B;
// beta bağlantısı kutuya bağlı değil), form altı bilgi satırı. Bağlantılar sayfa kaynağında yok, yalnız /api/bekleme yanıtında gelir. Bal küpü alanı ve doldurma süresi
// bot ayıklamak içindir (sunucu ayrıca IP özeti başına saatte 5 kayıt sınırı uygular).
type Downloads = { installer: string; guideTr: string; guideEn: string };

const YEARS = Array.from({ length: 15 }, (_, i) => String(2013 + i)).reverse();
const input = "mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-white placeholder:text-muted/60 focus:border-primary focus:outline-none";

export default function BetaDownloadForm({ copy, lang, privacyHref }: { copy: AreaPilotCopy["form"]; lang: "tr" | "en"; privacyHref: string }) {
  const [started, setStarted] = useState(0);
  const [email, setEmail] = useState("");
  const [acad, setAcad] = useState("");
  const [marketing, setMarketing] = useState(false); // ayrı açık rıza: varsayılan İŞARETSİZ
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<Downloads | null>(null);

  useEffect(() => setStarted(Date.now()), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(copy.errEmail);
      return;
    }
    setBusy(true);
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    try {
      const res = await fetch("/api/bekleme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "areapilot", email, autocad: acad || undefined, lang, website, t: started, marketing }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.downloads) setLinks(data.downloads);
      else if (res.status === 429) setError(copy.errRate);
      else if (res.status === 400) setError(copy.errEmail);
      else if (res.ok) setError(copy.errServer); // bot ayıklaması: kayıt yok
      else setError(copy.errServer);
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
      {/* Bal küpü: insanlar görmez, doldurulursa kayıt yapılmaz. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="block text-sm text-muted">
        {copy.email}
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" required placeholder={copy.emailPh} className={input} />
      </label>
      <label className="block text-sm text-muted">
        {copy.acad}
        <select value={acad} onChange={(e) => setAcad(e.target.value)} className={input}>
          <option value="">{copy.acadNone}</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              AutoCAD {y}
            </option>
          ))}
          <option value="unknown">{copy.acadUnknown}</option>
        </select>
      </label>
      <label className="flex items-start gap-3 text-base leading-relaxed text-muted">
        <input type="checkbox" name="marketing" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-primary" />
        <span>{copy.marketing}</span>
      </label>
      {error && <p className="text-sm text-weak">✕ {error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full !py-3 disabled:opacity-60">
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} {busy ? copy.sending : copy.button}
      </button>
      <p className="text-xs leading-relaxed text-muted">
        {copy.notice}{" "}
        <a href={privacyHref} className="text-primary hover:text-primary-light underline">
          {copy.noticeLink}
        </a>
        .
      </p>
    </form>
  );
}
