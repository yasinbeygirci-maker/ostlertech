// Başlık kırpılma testi: çalışan bir sunucuya bağlanır, TR+EN tüm sayfalarda ve 4 genişlikte
// h1-h6, gradyan (background-clip:text) ve büyük metinlerin alt/üst uzantılarının (g y p q j ş ç ğ, İ Ğ Ö Ü Ç noktaları)
// kesilip kesilmediğini ölçer. Çıkış kodu: kırpılan öğe varsa 1.
//
// Kullanım:
//   node scripts/baslik-kirpilma-testi.mjs [--base=http://localhost:3108] [--tema=acik] [--palet=mevcut] [--rota=/,/syncpass]
//   Tarayıcı sürümü uyuşmazsa: CHROME_PATH=<chrome.exe yolu>
//   playwright yüklü değilse: PLAYWRIGHT_DIR=<...>/node_modules/playwright-core node scripts/baslik-kirpilma-testi.mjs
//
// Ölçüt (metin kutusu = Range.getBoundingClientRect, yani yazı tipinin ascent+descent alanı):
//   1) background-clip:text olan öğede metin kutusu öğenin dolgu kutusundan (arka planın boyandığı yer) taşıyorsa: gradyan orada boyanmaz -> harf kesilir.
//   2) Üst öğelerden biri overflow:hidden/clip/auto ise ve metin kutusu onun sınırından taşıyorsa: kesilir.
//   3) Öğenin kendisi overflow != visible ve scrollHeight > clientHeight ise: kesilir.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").split("=").slice(1).join("=") || d;
const BASE = arg("base", "http://localhost:3108");
const TEMA = arg("tema", "");
const PALET = arg("palet", "");
const WIDTHS = [1440, 1024, 768, 390];

const ROTALAR_VARSAYILAN = [
  "/", "/areapilot", "/cornertab/privacy", "/diasync/delete-account", "/diasync/privacy", "/dijital-guvenlik-plani",
  "/en", "/en/areapilot", "/en/cornertab/privacy", "/en/digital-security-plan", "/en/offline-password-manager",
  "/en/oklar/privacy", "/en/otopark/privacy", "/en/password-manager-comparison", "/en/password-manager-with-authenticator",
  "/en/pricing", "/en/privacy", "/en/refunds", "/en/security-checklist", "/en/syncsite", "/en/syncsite/delete-account",
  "/en/syncsite/privacy", "/en/terms", "/gizlilik", "/guvenli-sifre-olusturucu", "/guvenlik-kontrol-listesi", "/hakkimizda",
  "/iki-adimli-dogrulama", "/iletisim", "/kullanim-sartlari", "/oklar/privacy", "/otopark/privacy", "/passkey-nedir",
  "/products", "/satin-al", "/sifre-yoneticisi", "/syncpass", "/syncpass-masaustu", "/syncpass/privacy", "/syncsite",
  "/syncsite/gizlilik", "/syncsite/hesap-silme", "/teslimat-ve-iade", "/videolar", "/welcome",
];
const ROTALAR = arg("rota", "") ? arg("rota", "").split(",") : ROTALAR_VARSAYILAN;

async function playwrightBul() {
  try { return await import("playwright"); } catch {}
  const adaylar = [];
  if (process.env.PLAYWRIGHT_DIR) adaylar.push(process.env.PLAYWRIGHT_DIR);
  const npx = path.join(os.homedir(), "AppData", "Local", "npm-cache", "_npx");
  if (fs.existsSync(npx)) for (const d of fs.readdirSync(npx)) {
    for (const n of ["playwright-core", "playwright"]) adaylar.push(path.join(npx, d, "node_modules", n));
  }
  for (const d of adaylar) {
    try {
      const req = createRequire(path.join(d, "package.json"));
      const m = req(d);
      if (m.chromium) return m;
    } catch {}
  }
  throw new Error("playwright bulunamadı: `npm i -D playwright` ya da PLAYWRIGHT_DIR verin.");
}

const olc = () => {
  const IMZA = /[gyjpqşçğ,;ÇŞĞİÖÜ]/;
  const sel = "h1,h2,h3,h4,h5,h6";
  const adaylar = new Set(document.querySelectorAll(sel));
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    const clip = cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text";
    const buyuk = parseFloat(cs.fontSize) >= 28;
    if ((clip || buyuk) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) adaylar.add(el);
  });
  const sonuc = [];
  for (const el of adaylar) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const metin = el.textContent.replace(/\s+/g, " ").trim();
    if (!metin) continue;
    // metin kutusu (satır kutularının birleşimi)
    const range = document.createRange();
    range.selectNodeContents(el);
    let ust = Infinity, alt = -Infinity;
    for (const q of range.getClientRects()) {
      if (q.width < 1) continue;
      ust = Math.min(ust, q.top); alt = Math.max(alt, q.bottom);
    }
    if (!isFinite(ust)) continue;
    const sorunlar = [];
    const tol = 0.75;
    const clip = cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text";
    if (clip) {
      const pu = r.top + parseFloat(cs.borderTopWidth) - parseFloat(cs.paddingTop) * 0; // kenarlık içi = dolgu kutusu
      const padUst = r.top + parseFloat(cs.borderTopWidth);
      const padAlt = r.bottom - parseFloat(cs.borderBottomWidth);
      // arka plan dolgu kutusuna boyanır (border-box'a kadar, background-origin padding); metin bunun dışında kalırsa şeffaf kalır
      if (cs.display !== "inline") {
        if (alt > r.bottom + tol) sorunlar.push(`gradyan alt ${(alt - r.bottom).toFixed(1)}px taşıyor`);
        if (ust < r.top - tol) sorunlar.push(`gradyan üst ${(r.top - ust).toFixed(1)}px taşıyor`);
      } else {
        // satır içi öğede arka plan içerik alanına boyanır: metin kutusu = içerik alanı, sorun yok
      }
      void pu; void padUst; void padAlt;
    }
    if ((cs.overflow !== "visible" || cs.overflowY !== "visible") && el.scrollHeight > el.clientHeight + 1) {
      sorunlar.push(`overflow ${cs.overflowY}: scrollHeight ${el.scrollHeight} > clientHeight ${el.clientHeight}`);
    }
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const ac = getComputedStyle(a);
      if (ac.overflowY === "visible" && ac.overflowX === "visible") continue;
      if (ac.overflowY === "auto" || ac.overflowY === "scroll") continue;
      const ar = a.getBoundingClientRect();
      if (ust < ar.top - tol || alt > ar.bottom + tol) {
        sorunlar.push(`üst öğe ${a.tagName.toLowerCase()}.${String(a.className).split(" ")[0]} (${ac.overflowY}) kırpıyor`);
        break;
      }
    }
    sonuc.push({
      etiket: `${el.tagName.toLowerCase()}`,
      metin: metin.slice(0, 40),
      imzali: IMZA.test(metin),
      font: cs.fontSize,
      lh: cs.lineHeight,
      clip,
      sorunlar,
    });
  }
  return sonuc;
};

const pw = await playwrightBul();
const tarayici = await pw.chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
let toplam = 0, kirpilan = 0, sayfa = 0;
const kotu = [];
for (const rota of ROTALAR) {
  for (const w of WIDTHS) {
    const ctx = await tarayici.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const q = [PALET && `palet=${PALET}`, TEMA && `tema=${TEMA}`].filter(Boolean).join("&");
    try {
      const res = await page.goto(`${BASE}${rota}${q ? `?${q}` : ""}`, { waitUntil: "load", timeout: 60000 });
      if (!res || res.status() >= 400) { kotu.push(`${rota} @${w}: HTTP ${res?.status()}`); await ctx.close(); continue; }
      await page.waitForTimeout(500);
      const liste = await page.evaluate(olc);
      sayfa++;
      for (const o of liste) {
        toplam++;
        if (o.sorunlar.length) { kirpilan++; kotu.push(`${rota} @${w}: <${o.etiket}> "${o.metin}" ${o.font}/${o.lh}${o.clip ? " [gradyan]" : ""} -> ${o.sorunlar.join("; ")}`); }
      }
    } catch (e) { kotu.push(`${rota} @${w}: HATA ${String(e).slice(0, 80)}`); }
    await ctx.close();
  }
}
await tarayici.close();
console.log(`Taranan sayfa x genişlik: ${sayfa}, başlık/büyük metin: ${toplam}, kırpılan: ${kirpilan}`);
for (const k of [...new Set(kotu)].slice(0, 60)) console.log("  " + k);
process.exit(kirpilan || kotu.some((k) => /HTTP|HATA/.test(k)) ? 1 : 0);
