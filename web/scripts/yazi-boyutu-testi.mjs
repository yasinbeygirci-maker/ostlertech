// Yazı boyutu testi: çalışan bir sunucuya bağlanır, TR+EN tüm sayfalarda ve 4 genişlikte görünür metnin
// hesaplanmış font-size değerini ölçer.
//   İHLAL (çıkış kodu 1): font-size < --min (varsayılan 13px). Hiçbir görünür metin 13px altında olmamalı.
//   UYARI: p/li/dd gövde metni < --govde (varsayılan 15px) ya da (≥1024 genişlikte) ana gövde paragrafı < 16px.
//
// Kullanım:
//   node scripts/yazi-boyutu-testi.mjs [--base=http://localhost:3108] [--min=13] [--govde=15] [--rota=/,/syncpass] [--genislik=1440,390]
//   Tarayıcı/playwright bulunamazsa: PLAYWRIGHT_DIR=<...>/playwright-core CHROME_PATH=<chrome.exe> (bkz. baslik-kirpilma-testi.mjs)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").split("=").slice(1).join("=") || d;
const BASE = arg("base", "http://localhost:3108");
const MIN = parseFloat(arg("min", "13"));
const GOVDE = parseFloat(arg("govde", "15"));
const WIDTHS = arg("genislik", "1440,1024,768,390").split(",").map(Number);
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
  if (fs.existsSync(npx)) for (const d of fs.readdirSync(npx)) for (const n of ["playwright-core", "playwright"]) adaylar.push(path.join(npx, d, "node_modules", n));
  for (const d of adaylar) { try { const m = createRequire(path.join(d, "package.json"))(d); if (m.chromium) return m; } catch {} }
  throw new Error("playwright bulunamadı: `npm i -D playwright` ya da PLAYWRIGHT_DIR verin.");
}

const olc = ({ MIN, GOVDE, genislik }) => {
  const sonuc = { ihlal: [], uyari: [], dagilim: {} };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const gorulen = new Set();
  while (w.nextNode()) {
    const t = w.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || gorulen.has(el)) continue;
    gorulen.add(el);
    if (el.closest("script,style,noscript,nextjs-portal,[data-nextjs-toast],svg")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const px = parseFloat(cs.fontSize);
    const k = Math.round(px);
    sonuc.dagilim[k] = (sonuc.dagilim[k] || 0) + 1;
    const ad = `<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 50)}"> "${t.textContent.trim().slice(0, 30)}" ${px.toFixed(1)}px`;
    if (px < MIN - 0.01) sonuc.ihlal.push(ad);
    else if (/^(P|LI|DD|DT|TD)$/.test(el.tagName) && px < GOVDE - 0.01) sonuc.uyari.push(ad);
  }
  return sonuc;
};

const pw = await playwrightBul();
const tarayici = await pw.chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
let sayfa = 0, ihlal = 0, uyari = 0;
const ihlalListe = new Map(), uyariListe = new Map(), dagilim = {};
for (const w of WIDTHS) {
  const ctx = await tarayici.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  for (const rota of ROTALAR) {
    const page = await ctx.newPage();
    try {
      const res = await page.goto(`${BASE}${rota}`, { waitUntil: "load", timeout: 60000 });
      if (!res || res.status() >= 400) { ihlalListe.set(`${rota} @${w}: HTTP ${res?.status()}`, 1); await page.close(); continue; }
      await page.waitForTimeout(300);
      const s = await page.evaluate(olc, { MIN, GOVDE, genislik: w });
      sayfa++; ihlal += s.ihlal.length; uyari += s.uyari.length;
      for (const x of s.ihlal) ihlalListe.set(`${rota} @${w} ${x}`, 1);
      for (const x of s.uyari) uyariListe.set(`${rota} @${w} ${x}`, 1);
      for (const [k, v] of Object.entries(s.dagilim)) dagilim[k] = (dagilim[k] || 0) + v;
    } catch (e) { ihlalListe.set(`${rota} @${w}: HATA ${String(e).slice(0, 80)}`, 1); }
    await page.close();
  }
  await ctx.close();
}
await tarayici.close();
console.log(`Taranan sayfa x genişlik: ${sayfa}; İHLAL (<${MIN}px): ${ihlal}; UYARI (gövde <${GOVDE}px): ${uyari}`);
console.log("Boyut dağılımı (px: metin öğesi sayısı): " + Object.entries(dagilim).sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}:${v}`).join(" "));
const ozet = (m, n) => { const a = [...m.keys()]; console.log(`\n${n} (${a.length} benzersiz):`); for (const x of a.slice(0, 40)) console.log("  " + x); };
if (ihlalListe.size) ozet(ihlalListe, "İhlaller");
if (uyariListe.size) ozet(uyariListe, "Uyarılar");
process.exit(ihlal || [...ihlalListe.keys()].some((k) => /HTTP|HATA/.test(k)) ? 1 : 0);
