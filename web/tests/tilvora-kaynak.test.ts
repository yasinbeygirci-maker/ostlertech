// Tilvora açık kaynak sayfaları (MPL-2.0 md. 3.2(a)): arşiv gerçekten yayında mı, boyut ve SHA-256 sayfadakiyle uyuyor mu,
// jagua-rs "değiştirilmedi" cümlesi, lisans adları, TR/EN karşılıklı bağlantı, noindex ve iç not/yasak ifade yok.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { TILVORA_KAYNAK as K } from "../src/lib/tilvora-kaynak.ts";

const WEB = process.cwd();
const tr = fs.readFileSync(path.join(WEB, "src", "app", "(tr)", "tilvora", "kaynak", "page.tsx"), "utf8");
const en = fs.readFileSync(path.join(WEB, "src", "app", "(en)", "en", "tilvora", "kaynak", "page.tsx"), "utf8");
const zipYol = path.join(WEB, "public", K.yol.replace(/^\//, ""));

test("arşiv public altında, boyut ve SHA-256 sabitlerle aynı", () => {
  const b = fs.readFileSync(zipYol);
  assert.equal(b.length, K.boyutBayt);
  assert.equal(crypto.createHash("sha256").update(b).digest("hex"), K.sha256);
  assert.ok(b.length < 5 * 1024 * 1024, "arşiv 5 MB altında kalmalı (site paketine yük)");
  assert.ok(b.subarray(0, 2).toString() === "PK", "zip imzası");
});

test("arşivin dosya adları: lisanslar, jagua-rs kopyası, Cargo.lock var; yerel yol / sır dosyası yok", () => {
  const b = fs.readFileSync(zipYol).toString("latin1");
  for (const n of ["LICENSE-MIT-sparrow", "LICENSE-MPL-2.0-jagua-rs", "Cargo.lock", "third_party/jagua-rs-2.0.0/src/lib.rs", "KAYNAK-NOTU.md"]) {
    assert.ok(b.includes(n), `${n} arşivde yok`);
  }
  assert.ok(!/vendor\//.test(b), "vendor klasörü arşive girmemeli");
  assert.ok(!/\.env|\.pem|\.keystore/.test(b));
});

for (const [ad, m] of [["tr", tr], ["en", en]] as const) {
  test(`${ad}: sürüm, commit, lisans, değişiklik yok ve iletişim sabitten`, () => {
    assert.ok(m.includes("K.sha256") && m.includes("K.yol") && m.includes("K.jaguaCommit"));
    assert.ok(m.includes("MPL-2.0") && m.includes("MIT"));
    assert.ok(ad === "tr" ? m.includes("hiçbir değişiklik yapılmadı") : m.includes("has not been modified"));
    assert.ok(m.includes("{COMPANY.email}"));
    assert.ok(m.includes("robots: { index: false"));
  });
  test(`${ad}: iç not işareti ve yasak ifade yok`, () => {
    for (const r of [/TODO/, /YASİN ONAYI/i, /\[yay[ıi]n/i, /offline/i, /%100/, /[A-Z]:[\\]/])assert.ok(!r.test(m), `${ad}: ${r}`);
  });
}

test("TR ve EN birbirine bağlı, hreflang eşleşmesi doğru", () => {
  assert.ok(tr.includes('"/en/tilvora/kaynak"') && tr.includes('canonical: "/tilvora/kaynak"'));
  assert.ok(en.includes('"/tilvora/kaynak"') && en.includes('canonical: "/en/tilvora/kaynak"'));
});

test("sayfa sitemap'te değil (ürün tanıtılmadı); sitemap testindeki istisna gerekçeli", () => {
  const xml = fs.readFileSync(path.join(WEB, "public", "sitemap.xml"), "utf8");
  assert.ok(!xml.includes("tilvora"));
});
