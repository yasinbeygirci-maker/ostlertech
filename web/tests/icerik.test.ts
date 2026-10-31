// İçerik dosyaları (src/content/*.md) için yayın öncesi denetim: yasak ifadeler, iç not işaretleri, adres tutarlılığı.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src", "content");
const dosyalar = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

const yasak = [
  /offline/i, /çevrimdışı/i, /internetsiz/i, /hesapsız/i, /hesap yok/i, /sunucumuz yok/i, /sonsuza dek/i, /\b6 dil\b/i,
  /banka seviyesi/i, /kırılamaz/i, /%100/, /hesap açman/i, /no account/i, /askeri/i, /zero-knowledge/i, /sıfır bilgi/i,
  /daha güvenli/i, /en güvenli/i, /most secure/i,
];

test("içerik dosyaları var", () => assert.ok(dosyalar.length >= 3));

for (const f of dosyalar) {
  const s = fs.readFileSync(path.join(dir, f), "utf8");
  test(`${f}: yasak ifade yok`, () => {
    for (const r of yasak) assert.ok(!r.test(s), `${f}: ${r} bulundu`);
  });
  test(`${f}: iç not işareti ve eski adres yok`, () => {
    assert.ok(!/YASİN ONAYI/i.test(s));
    assert.ok(!s.includes("destek@ostlertech.com"), "güvenlik bildirimi için tek adres guvenlik@");
    assert.ok(!/NordPass|Enpass/.test(s.replace("Dashlane, NordPass ve Enpass", "")), "NordPass/Enpass satırları çıkarıldı");
  });
}
