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
  });
}

// Yasin kararı (2026-11-04, yeniden 2026-11-08): sitede rakip şifre yöneticisi adı geçmez (Ticari Reklam Yönetmeliği md. 8/1-a, Zeynep).
// Karşılaştırma kategoriyle yapılır. Bütün kaynak (sayfa, bileşen, içerik, sabit) taranır; yasal metinde ad gerekirse Zeynep'le karar
// verilip buraya dosya bazında istisna yazılır.
const RAKIP_ADI =
  /keepass|bitwarden|1password|enpass|lastpass|kaspersky|dashlane|proton\s*pass|nordpass|\bkeeper\b|roboform|sticky\s*password|zoho\s*vault/i;

function kaynakDosyalari(kok: string): string[] {
  return fs.readdirSync(kok, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(kok, d.name);
    if (d.isDirectory()) return kaynakDosyalari(p);
    return /\.(tsx?|md|mdx|json)$/.test(d.name) ? [p] : [];
  });
}

const kaynaklar = kaynakDosyalari(path.join(process.cwd(), "src"));

test("kaynak taraması dosya buluyor (yanlış klasöre bakıp boş geçmesin)", () => {
  assert.ok(kaynaklar.length > 50, `yalnız ${kaynaklar.length} dosya`);
  assert.ok(kaynaklar.some((f) => f.includes("password-manager-comparison")));
});

test("sitede rakip şifre yöneticisi adı yok", () => {
  const bulgular = kaynaklar.flatMap((f) =>
    fs.readFileSync(f, "utf8").split("\n").flatMap((satir, i) =>
      RAKIP_ADI.test(satir) ? [`${path.relative(process.cwd(), f)}:${i + 1}: ${satir.trim().slice(0, 100)}`] : [],
    ),
  );
  assert.deepEqual(bulgular, []);
});

// Karşılaştırma ve rehber kümesi: "en iyi", reklamsızlık iddiası ve "X vs Y" başlığı yok (Yasin kararı 2026-11-08).
const KARSILASTIRMA = [
  "src/content/sifre-yoneticisi-karsilastirma.md",
  "src/app/(tr)/sifre-yoneticisi-karsilastirma/page.tsx",
  "src/app/(en)/en/password-manager-comparison/page.tsx",
  "src/app/(en)/en/offline-password-manager/page.tsx",
  "src/app/(en)/en/password-manager-with-authenticator/page.tsx",
];
const KARSILASTIRMA_YASAK = /\ben iyi\b|\bthe best\b|\bbest\b|reklams[ıi]z|reklam yok|no ads|ad-free|without ads|honest comparison|\bvs\.?\s/i;

for (const f of KARSILASTIRMA) {
  test(`${f}: "en iyi", reklamsızlık ve "vs" yok`, () => {
    const s = fs.readFileSync(path.join(process.cwd(), f), "utf8");
    const m = KARSILASTIRMA_YASAK.exec(s);
    assert.equal(m, null, m ? `${f}: "${m[0]}" (${s.slice(Math.max(0, m.index - 40), m.index + 40)})` : "");
  });
}
