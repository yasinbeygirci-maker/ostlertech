// Oyun gizlilik sayfaları (Packle, Hozeni, Okey, Batak, Sayı Toplama, Gemiza, Uch Uch; TR + EN) için yayın öncesi denetim: yasak ifadeler ve zorunlu bilgiler.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const kok = path.join(process.cwd(), "src", "app");
const sayfalar = ["packle", "hozeni", "okey", "batak", "sayitoplama", "gemiza", "uchuch"].flatMap((o) => [
  { oyun: o, dil: "tr", yol: path.join(kok, "(tr)", o, "privacy", "page.tsx") },
  { oyun: o, dil: "en", yol: path.join(kok, "(en)", "en", o, "privacy", "page.tsx") },
]);

const yasak = [
  /offline/i, /çevrimdışı/i, /internetsiz/i, /hesapsız/i, /hesap yok/i, /sunucumuz yok/i, /sonsuza dek/i,
  /banka seviyesi/i, /kırılamaz/i, /%100/, /hesap açman/i, /no account/i, /askeri/i, /zero-knowledge/i, /sıfır bilgi/i,
  /daha güvenli/i, /en güvenli/i, /most secure/i, /nonaro/i, /nineko/i, /\[yay[ıi]n/i, /TODO|YASİN ONAYI/i,
];

// Oklar ve Beepout (otopark) sayfaları: 16+ testi bunlara uymaz (Oklar 13+, Beepout sabit yol kullanır); yalnız yasak ifade taranır.
// Zeynep 2026-11-05: ek desenler izleme/bilerek toplama iddialarını da kapsar.
const ekYasak = [/izleme aracı/i, /tracking tool/i, /knowingly collect/i, /veri toplamayız/i];
const digerSayfalar = ["oklar", "otopark"].flatMap((o) => [
  { oyun: o, dil: "tr", yol: path.join(kok, "(tr)", o, "privacy", "page.tsx") },
  { oyun: o, dil: "en", yol: path.join(kok, "(en)", "en", o, "privacy", "page.tsx") },
]);

for (const s of digerSayfalar) {
  const metin = fs.readFileSync(s.yol, "utf8");
  const ad = `${s.oyun}/${s.dil}`;
  test(`${ad}: yasak ifade, izleme ve bilerek toplama iddiası yok`, () => {
    for (const r of [...yasak, ...ekYasak]) assert.ok(!r.test(metin), `${ad}: ${r} bulundu`);
  });
  test(`${ad}: üyelik yok cümlesi ve AdMob var`, () => {
    assert.ok(metin.includes("AdMob"));
    assert.ok(s.dil === "tr" ? /üyelik yok/.test(metin) : /no sign-up/.test(metin));
  });
}

for (const s of sayfalar) {
  const metin = fs.readFileSync(s.yol, "utf8");
  const ad = `${s.oyun}/${s.dil}`;
  test(`${ad}: yasak ifade ve iç not yok`, () => {
    for (const r of yasak) assert.ok(!r.test(metin), `${ad}: ${r} bulundu`);
  });
  test(`${ad}: 16+, AdMob, 16 altı ve iletişim bilgisi var`, () => {
    assert.ok(metin.includes("AdMob"));
    // Hedef yaş: Okey 18+ (Yasin 2026-11-10); diğer oyunlar 16+ (Batak 18+ onaylanınca buraya eklenir).
    const yas = s.oyun === "okey" ? "18" : "16";
    assert.ok(s.dil === "tr" ? metin.includes(`${yas} yaş`) : metin.includes(`${yas} and over`));
    assert.ok(s.dil === "tr" ? /16 yaşından küçük/.test(metin) : /under 16/.test(metin));
    assert.ok(metin.includes("{COMPANY.email}") && metin.includes("{COMPANY.legalName}"), "firma bilgisi sabitlerden gelmeli");
    assert.ok(metin.includes(`/${s.oyun}/privacy`) && metin.includes(`/en/${s.oyun}/privacy`), "TR/EN karşılıklı bağlantı");
  });
}
