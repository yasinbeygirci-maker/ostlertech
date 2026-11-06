import "server-only";
import type { ResetLang, ResetMailer } from "@/lib/license-core";
import { newKeyMailCopy, resetMailCopy } from "@/lib/license-mail-copy";
import { SITE_URL } from "@/lib/site";

// Cihaz sıfırlama e-postaları. Sağlayıcı: Resend (resmi HTTP API, kütüphanesiz). RESEND_API_KEY + MAIL_FROM yoksa configured() false
// döner ve çekirdek belirteç üretmez. Alıcı adresi, bağlantı ve kod hiçbir günlüğe/hataya yazılmaz.
function config() {
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.MAIL_FROM ?? "").trim();
  return apiKey && from ? { apiKey, from } : null;
}

async function send(to: string, subject: string, text: string) {
  const c = config();
  if (!c) throw new Error("e-posta ayari yok");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${c.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: c.from, to: [to], subject, text, reply_to: "destek@ostlertech.com" }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

export const resetMailer: ResetMailer = {
  configured: () => config() !== null,
  async sendLink(to: string, token: string, lang: ResetLang) {
    const base = (process.env.SITE_URL ?? SITE_URL).replace(/\/+$/, "");
    // Belirteç #fragment'te: tarayıcı sunucuya göndermez, sunucu/CDN günlüğüne ve Referer'a düşmez.
    const m = resetMailCopy(lang, `${base}/api/areapilot/license/reset#t=${token}`);
    await send(to, m.subject, m.text);
  },
  async sendNewKey(to: string, key: string, lang: ResetLang) {
    const m = newKeyMailCopy(lang, key);
    await send(to, m.subject, m.text);
  },
};
