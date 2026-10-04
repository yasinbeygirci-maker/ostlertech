import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Paddle-Signature: "ts=1671552777;h1=<hex>". İmzalanan metin: `${ts}:${gövde}`; anahtar bildirim hedefinin gizli anahtarı.
export function verifyPaddleSignature(header: string | null, rawBody: string, secret: string, now = Date.now()): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(";").map((p) => p.split("=", 2) as [string, string]));
  const ts = Number(parts.ts);
  if (!ts || !parts.h1) return false;
  // Eski bir bildirimin yeniden gönderilmesine karşı 5 dakika sınırı.
  if (Math.abs(now / 1000 - ts) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest();
  const given = Buffer.from(parts.h1, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
