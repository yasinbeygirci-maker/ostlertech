// AreaPilot indirme formu isteği denetimi + "kişisel veri toplanmaz" kanıtı (2026-11-18). Çalıştırma: npm test
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { checkWaitlistRequest, WAITLIST_MIN_FILL_MS, waitlistRemainingMs, waitlistSuccessBody } from "../src/lib/waitlist-core.ts";

const now = 1_800_000_000_000;
const ok = { product: "areapilot", t: now - WAITLIST_MIN_FILL_MS - 1 };
const read = (...p: string[]) => fs.readFileSync(path.join(process.cwd(), ...p), "utf8");

test("geçerli istek: e-posta olmadan kabul; eski istemcinin gönderdiği e-posta sonuca girmez", () => {
  assert.deepEqual(checkWaitlistRequest(ok, now), { kind: "ok", product: "areapilot" });
  const r = checkWaitlistRequest({ ...ok, email: "kisi@example.com", autocad: "2021", lang: "en" }, now);
  assert.deepEqual(r, { kind: "ok", product: "areapilot" });
  assert.ok(!JSON.stringify(r).includes("kisi@example.com"));
});

test("bot: bal küpü dolu, çok hızlı gönderim ya da zaman yok", () => {
  assert.equal(checkWaitlistRequest({ ...ok, website: "http://spam" }, now).kind, "bot");
  assert.equal(checkWaitlistRequest({ ...ok, t: now - 500 }, now).kind, "bot");
  assert.equal(checkWaitlistRequest({ ...ok, t: undefined }, now).kind, "bot");
  assert.equal(checkWaitlistRequest(null, now).kind, "bot");
});

test("geçersiz: bilinmeyen ürün", () => {
  assert.deepEqual(checkWaitlistRequest({ ...ok, product: "syncpass" }, now), { kind: "invalid", field: "product" });
});

test("başarı yanıtı yalnız indirme bağlantılarını taşır", () => {
  const body = waitlistSuccessBody({ installer: "https://example.com/x.exe" });
  assert.deepEqual(Object.keys(body).sort(), ["downloads", "ok"]);
});

test("rota: veritabanına/Supabase'e yazmaz, e-posta okumaz, günlüğe veri yazmaz", () => {
  const r = read("src", "app", "api", "bekleme", "route.ts");
  const kod = r.replace(/^\s*\/\/.*$/gm, ""); // yorum satırları hariç
  assert.doesNotMatch(kod, /supabase|rpc\(|site_waitlist|email|x-forwarded-for|x-real-ip|console\./i);
});

test("form: e-posta ve AutoCAD alanı yok, e-posta sunucuya gönderilmez", () => {
  const f = read("src", "components", "BetaDownloadForm.tsx");
  const kod = f.replace(/^\s*\/\/.*$/gm, "");
  assert.doesNotMatch(kod, /type="email"|\bemail\b|autocad|<select/i);
  assert.match(kod, /JSON\.stringify\(\{ product: "areapilot", website, t: started \}\)/);
});

test("metinler (TR+EN): eski vaatler ve 'yanıt beklenmektedir' kalmadı", () => {
  const files = [
    read("src", "lib", "areapilot-content.ts"),
    read("src", "app", "(tr)", "gizlilik", "page.tsx"),
    read("src", "app", "(en)", "en", "privacy", "page.tsx"),
    read("src", "app", "(tr)", "syncpass", "privacy", "page.tsx"),
  ];
  const yasak = [
    /deneme sürümüyle ilgili (zorunlu|önemli) bildirim/i,
    /important notices about the trial/i,
    /essential notices about the trial/i,
    /yanıt beklenmektedir/i,
    /a reply is awaited/i,
    /Türkiye(’|')deki bir sunucuya taşı/i,
  ];
  for (const text of files) for (const re of yasak) assert.doesNotMatch(text, re, String(re));
});

test("gizlilik sayfaları: 18 Kasım 2026 tarihi var, Supabase sade yurt dışı cümlesi, sözleşme hikâyesi yok", () => {
  const tr = read("src", "app", "(tr)", "gizlilik", "page.tsx");
  const en = read("src", "app", "(en)", "en", "privacy", "page.tsx");
  const sp = read("src", "app", "(tr)", "syncpass", "privacy", "page.tsx");
  assert.match(tr, /updatedOn="18 Kasım 2026"/);
  assert.match(en, /updatedOn="18 November 2026"/);
  assert.match(sp, /EFFECTIVE_TR = "18 Kasım 2026"/);
  assert.match(sp, /EFFECTIVE_EN = "18 November 2026"/);
  // Yasin kararı (20 Kas 2026): sözleşme/Kurul/md. 9 anlatısı yok; yalnız sade genel yurt dışı cümlesi.
  for (const t of [tr, sp]) assert.match(t, /Bu hizmetlerin bir kısmı yurt dışındadır; verileriniz bu nedenle yurt dışında işlenir ve tutulur\./);
  for (const t of [en, sp]) assert.match(t, /Some of these services are located abroad; your data is therefore processed and stored abroad\./);
  for (const t of [tr, en, sp]) assert.doesNotMatch(t, /standart sözleşme|standard contract|KVKK md\. 9|Article 9 of KVKK|imzalamadığını bildirdi|does not sign this contract/);
});

test("S2: sayfa açılır açılmaz basan kullanıcı için istemci kalan süreyi bekler, böylece sunucu isteği bot saymaz", () => {
  // Erken basış: kalan süre > 0 ve beklendikten sonra gönderilen istek sunucu denetiminden geçer
  const opened = now - 300;
  const wait = waitlistRemainingMs(opened, now);
  assert.ok(wait > 0 && wait <= WAITLIST_MIN_FILL_MS + 100);
  assert.equal(checkWaitlistRequest({ product: "areapilot", t: opened }, now).kind, "bot", "bekleme olmadan istek bot sayılır (hatanın nedeni)");
  assert.equal(checkWaitlistRequest({ product: "areapilot", t: opened }, now + wait).kind, "ok");
  // Süre dolmuşsa bekleme yok; kurulmamış zaman damgası tam süre bekletir
  assert.equal(waitlistRemainingMs(now - WAITLIST_MIN_FILL_MS - 100, now), 0);
  assert.equal(waitlistRemainingMs(0, now), WAITLIST_MIN_FILL_MS + 100);
  assert.equal(checkWaitlistRequest({ product: "areapilot", t: now - 10 }, now + waitlistRemainingMs(now - 10, now)).kind, "ok");
});

test("S2: form göndermeden önce kalan süreyi bekler (fetch'ten önce)", () => {
  const kod = read("src", "components", "BetaDownloadForm.tsx").replace(/^\s*\/\/.*$/gm, "");
  const i = kod.indexOf("waitlistRemainingMs(started)");
  const j = kod.indexOf('fetch("/api/bekleme"');
  assert.ok(i > 0 && j > i, "bekleme fetch'ten önce olmalı");
});
