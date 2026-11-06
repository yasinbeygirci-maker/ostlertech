"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import LicenseReveal, { type RevealedLicense } from "@/components/LicenseReveal";
import { areapilotWelcomeCopy, type SalesLang } from "@/lib/areapilot-sales";
import { CONTACT_EMAIL } from "@/lib/site";

// Ödeme sonrası teşekkür gövdesi. Ürün önce URL ipucundan (urun=areapilot), kod gelince sunucu kaydından belirlenir; böylece AreaPilot
// alıcısı SyncPass talimatı görmez. İpucu yoksa ve kayıt AreaPilot değilse mevcut SyncPass metni aynen gösterilir.
export default function WelcomeFlow({ hintProduct, lang }: { hintProduct: "areapilot" | null; lang: SalesLang }) {
  const [license, setLicense] = useState<RevealedLicense | null>(null);
  const isAreapilot = license ? license.product === "areapilot" : hintProduct === "areapilot";

  if (isAreapilot) {
    const c = areapilotWelcomeCopy(lang, license?.maxDevices ?? undefined);
    return (
      <div className="max-w-xl mx-auto text-center space-y-5" lang={lang}>
        <CheckCircle2 size={56} className="mx-auto text-ok" />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{c.title}</h1>
        <p className="text-muted">{c.receipt}</p>
        <LicenseReveal lang={lang} onLicense={setLicense} />
        <p className="text-sm text-muted">{c.mailNote}</p>
        <ol className="text-left text-sm text-muted space-y-2 rounded-2xl border border-line bg-card p-6 list-decimal list-inside">
          {c.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="text-sm text-muted">
          {c.support}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-primary-light">{CONTACT_EMAIL}</a>
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={c.downloadHref} className="btn-primary inline-flex !py-3">{c.download}</a>
          <a href={c.backHref} className="btn-secondary inline-flex !py-3">{c.back}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center space-y-5">
      <CheckCircle2 size={56} className="mx-auto text-ok" />
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Teşekkürler, ödemen alındı</h1>
      <p className="text-muted">Makbuzun Paddle'dan e-postana gelecek.</p>
      <LicenseReveal onLicense={setLicense} />
      <ol className="text-left text-sm text-muted space-y-2 rounded-2xl border border-line bg-card p-6 list-decimal list-inside">
        <li>SyncPass Masaüstü'nü aç ve kasanın kilidini aç.</li>
        <li>Ayarlar → Lisans bölümüne kodu yapıştırıp Etkinleştir'e bas.</li>
        <li>Aynı kodu en fazla 3 bilgisayarda kullanabilirsin.</li>
      </ol>
      <p className="text-sm text-muted">
        Kodu kaybedersen satın alırken kullandığın e-postayla{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-primary-light">{CONTACT_EMAIL}</a> adresine yaz.
      </p>
      <a href="/syncpass-masaustu" className="btn-primary inline-flex !py-3">SyncPass Masaüstü'ne dön</a>
    </div>
  );
}
