// AreaPilot 1.0 yayında, deneme ilk kullanımdan itibaren 7 gün. Eski "açık beta / 30 gün deneme" dili sitede (sayfa metni,
// video açıklamaları, ürün kartı, paylaşım metinleri) kalmamalı. Hata raporu / başvuru yanıtı "30 gün" cümleleri bilerek hariç
// (bunlar deneme değil, saklama ve yanıt süresi). 2026-11-12, Tolga'nın video düzeltme bulgusu.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const kok = path.join(process.cwd(), "src");
const dosyalar = [
  "lib/areapilot-content.ts", "lib/areapilot.ts", "lib/areapilot-sales.ts", "lib/areapilot-legal.ts",
  "lib/videos.ts", "lib/urunler.ts", "lib/license-mail-copy.ts",
  "app/(tr)/areapilot/page.tsx", "app/(en)/en/areapilot/page.tsx", "app/(en)/en/videos/page.tsx",
  "components/AreaPilotLanding.tsx",
];

const eskiDil = [
  /açık beta/i, /open beta/i, /AreaPilot[^.\n]{0,40}\bbeta\b/i, /\bbeta[^.\n]{0,40}AreaPilot/i,
  /30 gün(lük)?[^.\n]{0,12}(ücretsiz )?deneme/i, /deneme[^.\n]{0,25}30 gün/i,
  /30[- ]day (free )?trial/i, /free (trial )?(for|of) 30 days/i, /30 days (free|of free|trial)/i, /otuz gün/i, /thirty days/i,
];

for (const f of dosyalar) {
  const tam = path.join(kok, f);
  test(`${f}: AreaPilot için eski beta / 30 gün deneme dili yok`, () => {
    // Yorum satırlarındaki tarihçe notları ("açık beta sona erdi") hariç, yalnız kod/metin satırları taranır.
    const satirlar = fs.readFileSync(tam, "utf8").split(/\r?\n/).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
    for (const [i, s] of satirlar.entries()) {
      for (const r of eskiDil) assert.ok(!r.test(s), `${f}: ${r} bulundu: ${s.trim().slice(0, 120)} (satır ${i + 1})`);
    }
  });
}

test("videos.ts: AreaPilot videolarının açıklamasında 7 gün ücretsiz deneme yazar (TR ve EN)", () => {
  const s = fs.readFileSync(path.join(kok, "lib/videos.ts"), "utf8");
  for (const id of ["pcB5aCDr55k", "z7T8voXMUkI"]) {
    const blok = s.slice(s.indexOf(`id: "${id}"`)).split("},")[0];
    assert.match(blok, /7 gün ücretsiz deneme|Free for 7 days from first use/, `${id}: 7 gün cümlesi yok`);
  }
});

// CompanyHome / ProductsView genel bir "beta" durum etiketi taşır; AreaPilot'a (ya da yayındaki hiçbir ürüne) bu durum verilmemeli.
test("urunler.ts: hiçbir ürün 'beta' durumunda değil", () => {
  const s = fs.readFileSync(path.join(kok, "lib/urunler.ts"), "utf8");
  assert.ok(!/durum:\s*"beta"/.test(s));
});

// "Saniyeler içinde / in seconds" ölçülmemiş hız iddiasıdır (YouTube yükleme notuyla başlıklar: "AreaPilot: AutoCAD'de alan ve
// çevre metrajı" / "AreaPilot: area and perimeter takeoff in AutoCAD"). AreaPilot metinlerinde ve video listesinde yer almamalı.
// 2026-11-15, Zeynep/Can; "guvenli-sifre-olusturucu" sayfasındaki cümle parola kırma süresi, AreaPilot'la ilgisi yok.
const olculmemisHiz = [/saniyeler (içinde|icinde)/i, /saniyelerde/i, /\bin seconds\b/i, /within seconds/i];
for (const f of dosyalar) {
  test(`${f}: ölçülmemiş "saniyeler içinde / in seconds" iddiası yok`, () => {
    const satirlar = fs.readFileSync(path.join(kok, f), "utf8").split(/\r?\n/).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
    for (const [i, s] of satirlar.entries()) {
      for (const r of olculmemisHiz) assert.ok(!r.test(s), `${f}: ${r} bulundu: ${s.trim().slice(0, 120)} (satır ${i + 1})`);
    }
  });
}

test("videos.ts: AreaPilot tanıtım başlıkları YouTube yükleme notuyla aynı (TR ve EN)", () => {
  const s = fs.readFileSync(path.join(kok, "lib/videos.ts"), "utf8");
  assert.ok(s.includes(`title: "AreaPilot: AutoCAD'de alan ve çevre metrajı",`));
  assert.ok(s.includes(`title: "AreaPilot: area and perimeter takeoff in AutoCAD",`));
});
