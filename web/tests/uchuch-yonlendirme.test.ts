// Uch Uch: eski adların (Vızvız, Skimwing) gizlilik adresleri zincirsiz kalıcı yönlenir; site haritası yeni adresleri taşır; sayfalarda eski ad yok.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const kok = process.cwd();
const config = fs.readFileSync(path.join(kok, "next.config.ts"), "utf8");
const sitemap = fs.readFileSync(path.join(kok, "public", "sitemap.xml"), "utf8");

const beklenen: Array<[string, string]> = [
  ["/vizviz/privacy", "/uchuch/privacy"],
  ["/skimwing/privacy", "/uchuch/privacy"],
  ["/en/vizviz/privacy", "/en/uchuch/privacy"],
  ["/en/skimwing/privacy", "/en/uchuch/privacy"],
];

for (const [kaynak, hedef] of beklenen) {
  test(`${kaynak} -> ${hedef} kalıcı ve doğrudan`, () => {
    assert.ok(config.includes(`{ source: "${kaynak}", destination: "${hedef}", permanent: true }`));
    // zincir yok: hedef başka bir yönlendirmenin kaynağı olamaz
    assert.ok(!config.includes(`source: "${hedef}"`));
  });
}

test("site haritası yeni adresleri taşır, eskileri taşımaz", () => {
  assert.ok(sitemap.includes("https://www.ostlertech.com/uchuch/privacy") && sitemap.includes("https://www.ostlertech.com/en/uchuch/privacy"));
  assert.ok(!/vizviz|skimwing/i.test(sitemap));
});

test("Uch Uch sayfalarında eski ad ve işaret notu yok", () => {
  for (const yol of [path.join("(tr)", "uchuch"), path.join("(en)", "en", "uchuch")]) {
    const metin = fs.readFileSync(path.join(kok, "src", "app", yol, "privacy", "page.tsx"), "utf8");
    assert.ok(!/vızvız|vizviz|skimwing|DEĞİŞTİ|\[CHANGED\]/i.test(metin), yol);
    assert.ok(metin.includes("Uch Uch"));
  }
});
