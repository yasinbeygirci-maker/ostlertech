import "server-only";
import type { ResetLang, ResetMailer } from "@/lib/license-core";
import { resetMailCopy } from "@/lib/license-mail-copy";

// Cihaz sıfırlama bağlantısı e-postası. Sağlayıcı: Resend (resmi HTTP API, kütüphanesiz). RESEND_API_KEY + MAIL_FROM yoksa
// gönderim KAPALIDIR (atlanır). Alıcı adresi ve bağlantı hiçbir günlüğe/hataya yazılmaz.
export const sendResetMail: ResetMailer = async (to: string, token: string, lang: ResetLang) => {
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.MAIL_FROM ?? "").trim();
  if (!apiKey || !from) return;
  const base = (process.env.SITE_URL ?? "https://ostlertech.com").replace(/\/+$/, "");
  const { subject, text } = resetMailCopy(lang, `${base}/api/areapilot/license/reset?token=${token}`);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, reply_to: "destek@ostlertech.com" }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
};
