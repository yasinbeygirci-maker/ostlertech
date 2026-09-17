/**
 * KURUCU MAILI — bekleme listesine otomatik karşılama
 * ------------------------------------------------------
 * Kayıt /api/anydoc/bekleme'ye düşünce Resend üzerinden gönderilir.
 * Tasarım ilkeleri:
 *  - ANAHTAR YOKSA HİÇ ÇALIŞMAZ (zarif bozulma): kayıt akışını asla bozmaz,
 *    konsola tek satır not düşer. RESEND_API_KEY eklenince kendiliğinden canlı olur.
 *  - ATEŞLE-UNUT (fire-and-forget): mail gönderimi POST yanıtını bekletmez;
 *    hata olsa bile kullanıcıya "kayıt başarısız" görünmez.
 *  - Sayılar SADECE çağıranın verdiği sira'dan gelir — uydurma yok.
 */

const RESEND_API = "https://api.resend.com/emails";

// Gönderici: alan adı (ostlertech.com) Resend'de doğrulandı — kurumsal adresten gider.
// Gerekirse RESEND_FROM env ile geçersiz kılınabilir.
const VARSAYILAN_FROM = "AnyDoc <ekip@ostlertech.com>";

const KONTENJAN = 100;

export type KurucuMailiSonucu =
  | { gitti: true; resendId: string }
  | { gitti: false; sebep: string };

function govdeHtml(sira: number | null, kurucu: boolean): string {
  const siraSatiri = sira
    ? `AnyDoc erken erişim listesine kaydolduğunuz için teşekkürler — <strong style="color:#38bdf8;">${sira}. sıradasınız.</strong>`
    : `AnyDoc erken erişim listesine kaydolduğunuz için teşekkürler — sıranız kaydınızla birlikte sabitlendi.`;

  const fiyatParagrafi = kurucu
    ? `<p style="margin:0 0 16px 0;color:#cbd5e1;font-size:15px;line-height:1.6;">
        İlk ${KONTENJAN} kişi arasında aboneliğe geçen herkes, aboneliği aktif kaldığı sürece
        <strong style="color:#f8fafc;">ömür boyu %50 indirimli kurucu fiyatına</strong> kilitleniyor.
        Yani $29 yerine <strong style="color:#38bdf8;">$14.50/ay</strong> — her ay, sonsuza dek.
        Üstelik ilk ay <strong style="color:#f8fafc;">5.000 sayfa ücretsiz</strong>, kredi kartı istemiyoruz.
      </p>`
    : `<p style="margin:0 0 16px 0;color:#cbd5e1;font-size:15px;line-height:1.6;">
        Erken erişim başladığında ilk haber siz olacak — kurucu fiyat avantajından
        ilk ${KONTENJAN} kayıt gibi yararlanabileceksiniz.
      </p>`;

  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AnyDoc — Hoş geldiniz</title></head>
<body style="margin:0;padding:0;background-color:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;background-color:#020617;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="display:inline-block;background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);color:#ffffff;font-weight:800;font-size:20px;padding:10px 20px;border-radius:8px;letter-spacing:-0.5px;">OstlerTech AnyDoc</span>
    </div>
    <div style="background-color:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:32px;margin-bottom:24px;">
      <div style="margin-bottom:24px;border-bottom:1px solid #1e293b;padding-bottom:16px;">
        <span style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#38bdf8;font-weight:700;">OstlerTech Kampanya Bülteni</span>
        <h1 style="margin:8px 0 0 0;font-size:24px;line-height:1.3;color:#f8fafc;font-weight:700;">Aramıza hoş geldiniz 🔒</h1>
      </div>
      <p style="margin:0 0 16px 0;color:#cbd5e1;font-size:15px;line-height:1.6;">Merhaba,</p>
      <p style="margin:0 0 16px 0;color:#cbd5e1;font-size:15px;line-height:1.6;">${siraSatiri}</p>
      ${fiyatParagrafi}
      <div style="text-align:center;margin:24px 0;">
        <a href="https://www.ostlertech.com/anydoc" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);color:#ffffff;font-weight:600;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:8px;box-shadow:0 4px 14px rgba(37,99,235,0.4);">Kurucu Avantajını İncele</a>
      </div>
      <p style="margin:16px 0 0 0;color:#94a3b8;font-size:14px;line-height:1.5;">
        Sorularınız varsa bu maili cevaplayın — doğrudan bana geliyor.<br>
        <strong style="color:#cbd5e1;">OstlerTech Ekibi</strong>
      </p>
    </div>
    <div style="text-align:center;color:#64748b;font-size:12px;line-height:1.5;">
      <p style="margin:0 0 8px 0;">OstlerTech © 2026 — Tüm hakları saklıdır.</p>
      <p style="margin:0;">Bu e-posta, AnyDoc erken erişim listesine kaydolduğunuz için gönderilmiştir.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Kurucu karşılama mailini gönderir. ANAHTAR YOKSA: {gitti:false, sebep:'anahtar yok'}
 * döner — çağıran taraf kayıt akışını bundan etkilenmez.
 */
export async function kurucuMailiGonder(
  alici: string,
  sira: number | null,
  kurucu: boolean,
): Promise<KurucuMailiSonucu> {
  const anahtar = process.env.RESEND_API_KEY;
  if (!anahtar) {
    return { gitti: false, sebep: "anahtar yok (RESEND_API_KEY tanımlı değil)" };
  }
  const from = process.env.RESEND_FROM || VARSAYILAN_FROM;

  try {
    const yanit = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anahtar}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [alici],
        subject: kurucu
          ? `Kurucu yeriniz kilitli — ilk ${KONTENJAN}'de ${sira ?? "?"}. sıradasınız 🔒`
          : "AnyDoc erken erişim listesine hoş geldiniz",
        html: govdeHtml(sira, kurucu),
        reply_to: "yasinbeygirci@gmail.com",
      }),
    });

    if (!yanit.ok) {
      const detay = await yanit.text().catch(() => "");
      console.error(
        `[kurucu-maili] Resend ${yanit.status}: ${detay.slice(0, 300)}`,
      );
      return { gitti: false, sebep: `Resend ${yanit.status}` };
    }
    const veri = (await yanit.json().catch(() => ({}))) as { id?: string };
    console.log(`[kurucu-maili] gönderildi → ${alici} (sıra: ${sira})`);
    return { gitti: true, resendId: veri.id || "bilinmiyor" };
  } catch (hata) {
    console.error(
      "[kurucu-maili] ağ hatası:",
      hata instanceof Error ? hata.message : hata,
    );
    return { gitti: false, sebep: "ağ hatası" };
  }
}
