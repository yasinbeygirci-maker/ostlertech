// Paddle-Signature denetimi (saf; tests/paddle-imza.test.ts). Sunucu kodu lib/server/paddle-webhook.ts üzerinden kullanır.
// Başlık: "ts=1671552777;h1=<hex>". Gizli anahtar döndürülürken Paddle birden çok h1 gönderebilir ("ts=..;h1=<eski>;h1=<yeni>"):
// HERHANGİ biri eşleşirse imza geçerlidir (Burak D5, 2026-11-07: önceki kod yalnız son h1'i okuyordu).
// İmzalanan metin: `${ts}:${gövde}`; anahtar bildirim hedefinin gizli anahtarı.
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyPaddleSignature(header: string | null, rawBody: string, secret: string, now = Date.now()): boolean {
  if (!header) return false;
  let ts = NaN;
  const h1: string[] = [];
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "ts") ts = Number(v);
    else if (k === "h1" && v) h1.push(v);
  }
  if (!ts || h1.length === 0) return false;
  // Eski bir bildirimin yeniden gönderilmesine karşı 5 dakika sınırı.
  if (Math.abs(now / 1000 - ts) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest();
  let ok = false;
  for (const h of h1) {
    if (!/^[0-9a-f]+$/i.test(h)) continue;
    const given = Buffer.from(h, "hex");
    // Kısa devre yok: her aday aynı biçimde karşılaştırılır.
    if (given.length === expected.length && timingSafeEqual(given, expected)) ok = true;
  }
  return ok;
}
