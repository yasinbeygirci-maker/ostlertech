// "Telefonun çalınırsa ilk 5 adım" sayfası için yayın öncesi denetim.
// Yayın kapısı: kaynak dosyada TODO-DOGRULA işareti varken sayfa yayınlanmaz. YAYIN_KAPISI=1 ile koşulunca işaret varsa test kırılır;
// kapı kapalıyken normal koşuda "skipped" görünür (açık TODO-DOGRULA var).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { TR, EN, PLAY_TELEFON_CALINIRSA, type Content } from "../src/lib/telefon-calinirsa.ts";

const kaynakYolu = path.join(process.cwd(), "src", "lib", "telefon-calinirsa.ts");

function gorunenMetin(c: Content): string {
  const parcalar: string[] = [c.title, c.description, c.h1, c.lead, c.calmNote, c.beforeTitle, c.beforeLead, c.helperTitle, c.helperText, c.ctaLabel, c.ctaNote, c.sourcesTitle, c.disclaimer];
  for (const s of c.steps) parcalar.push(s.heading, ...(s.lines ?? []), ...(s.platforms ?? []).flatMap((p) => [p.name, p.text]), s.note ?? "");
  for (const b of c.before) parcalar.push(b.text);
  for (const s of c.sources) parcalar.push(s.name);
  return parcalar.join("\n");
}

const yasak = [
  /offline/i, /çevrimdışı/i, /internetsiz/i, /hesapsız/i, /hesap yok/i, /sunucumuz yok/i, /banka seviyesi/i, /kırılamaz/i, /%100/,
  /daha güvenli/i, /en güvenli/i, /most secure/i, /kasan güvende/i, /your vault is safe/i,
  // Korku dili
  /her şeyini kaybed/i, /boşal/i, /you will lose everything/i,
  // BTK / e-Devlet hizmet adı: resmî sayfadan doğrulanmadı (TODO-DOGRULA 1)
  /e-?devlet/i, /\b120\b/, /\bBTK\b/, /ihbar bildirimi/i,
  // Eski ad: Google'ın güncel adı
  /Cihazımı Bul/i, /Find My Device/i,
];

for (const [ad, c] of [["TR", TR], ["EN", EN]] as const) {
  const s = gorunenMetin(c);
  test(`${ad}: yasak ifade, korku dili ve doğrulanmamış hizmet adı yok`, () => {
    for (const r of yasak) assert.ok(!r.test(s), `${ad}: ${r} bulundu`);
  });
  test(`${ad}: ekranda TODO-DOGRULA ya da iç not işareti yok`, () => {
    assert.ok(!/TODO/i.test(s));
    assert.ok(!/YASİN ONAYI/i.test(s));
  });
  test(`${ad}: 5 adım, her adımın kaynağı ya da genel öneri notu var`, () => {
    assert.equal(c.steps.length, 5);
    for (const st of c.steps) assert.ok(st.sources.length > 0 || st.note, `${ad}: ${st.heading} kaynaksız`);
    const kullanilan = new Set(c.steps.flatMap((st) => st.sources).concat(c.before.flatMap((b) => b.sources)));
    for (const k of kullanilan) assert.ok(c.sources.some((x) => x.key === k), `${ad}: ${k} kaynak listesinde yok`);
  });
  test(`${ad}: kaynak bağlantıları resmî alan adlarında`, () => {
    for (const x of c.sources) assert.match(x.url, /^https:\/\/(support\.google\.com|support\.apple\.com|pages\.nist\.gov)\//);
  });
}

test("Play bağlantısı pazarlama belgesindeki UTM'yi taşır", () => {
  const ref = decodeURIComponent(new URL(PLAY_TELEFON_CALINIRSA).searchParams.get("referrer") ?? "");
  assert.equal(ref, "utm_source=instagram&utm_medium=dm&utm_campaign=2026-11-guvenlik&utm_content=reels-telefon-calinirsa");
});

test("TR/EN çapraz bağlantıları tutarlı", () => {
  assert.equal(TR.enPath, EN.path);
  assert.equal(EN.trPath, TR.path);
});

const todoVar = fs.readFileSync(kaynakYolu, "utf8").includes("TODO-DOGRULA (yayına çıkmaz");

test("yayın kapısı: TODO-DOGRULA kalmadı", { skip: process.env.YAYIN_KAPISI ? false : "açık TODO-DOGRULA var, Yasin onayı + resmî sayfa teyidi bekliyor" }, () => {
  assert.ok(!todoVar, "kaynak dosyada TODO-DOGRULA bloğu duruyor: sayfa yayınlanmaz");
});
