// Ücretsiz kayıt sınırı platforma göre ayrı (Android 25, Masaüstü 15): sabitler, ortak cümleler ve elle yazılmış sayı kalmaması.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  FREE_ITEM_LIMIT_ANDROID, FREE_ITEM_LIMIT_DESKTOP, FREE_LIMIT_TR, FREE_UP_TO_TR, FREE_LIMIT_EN,
} from "../src/lib/site.ts";

// Uygulama kaynaklarındaki gerçek değer: Android FreeTier.ITEM_LIMIT, Masaüstü LicenseManager.FREE_ITEM_LIMIT
// (yayındaki 1.4.17). Masaüstü 25'li sürümü yayınlanınca bu iki sayı ve site.ts birlikte güncellenir.
test("sabitler: Android 25, Masaüstü 15", () => {
  assert.equal(FREE_ITEM_LIMIT_ANDROID, 25);
  assert.equal(FREE_ITEM_LIMIT_DESKTOP, 15);
});

test("ortak cümleler iki platformu da söyler", () => {
  assert.equal(FREE_LIMIT_TR, "Android'de 25, masaüstünde 15 kayıt");
  assert.equal(FREE_UP_TO_TR, "Android'de 25, masaüstünde 15 kayda kadar ücretsiz");
  assert.equal(FREE_LIMIT_EN, "25 items on Android and 15 on desktop");
});

// Kaynakta sınır olarak elle yazılmış "15 kayıt/items" kalmamalı. İstisna: kullanım şartlarının TR metni (yasal, elle).
const izinli = new Set([path.join("src", "app", "(tr)", "kullanim-sartlari", "page.tsx")]);
function dosyalar(d: string): string[] {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? dosyalar(p) : /\.(tsx?|md)$/.test(e.name) ? [p] : [];
  });
}
test("elle yazılmış '15 kayıt / 15 items' yok (şartlar TR hariç)", () => {
  const re = /(?<!masaüstünde\s)\b15\s+(kayıt|kayda|kayıtla|items|entries)\b/i;
  const bulunan = dosyalar("src").filter((f) => !izinli.has(f) && re.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(bulunan, []);
});

test("platformsuz '25 kayıt' iddiası masaüstüne bağlanmıyor: masaüstü planı sabitten gelir", () => {
  const tiers = fs.readFileSync(path.join("src", "lib", "syncpass-tiers.ts"), "utf8");
  assert.match(tiers, /FREE_ITEM_LIMIT_DESKTOP/);
  assert.doesNotMatch(tiers, /FREE_ITEM_LIMIT_ANDROID/);
});
