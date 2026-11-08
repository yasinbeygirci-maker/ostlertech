// AreaPilot sayfasının arama ve paylaşım metni: uzunluklar, yasak sözcükler, statik fiyat cümlesi ve yapısal veri tutarlılığı.
import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Kaynak dosyalar uzantısız göreli içe aktarma kullanır (Next/TS biçimi); node testte ".ts" eklenerek çözülür.
registerHooks({
  resolve(spec, ctx, next) {
    try {
      return next(spec, ctx);
    } catch (e) {
      if (spec.startsWith(".") && !spec.endsWith(".ts")) return next(spec + ".ts", ctx);
      throw e;
    }
  },
});
const { AREAPILOT_COPY } = await import("../src/lib/areapilot-content.ts");
const { AREAPILOT_TIER_PRICES } = await import("../src/lib/areapilot-sales.ts");
const { areapilotAppLd, tryAmount } = await import("../src/lib/areapilot-ld.ts");

const TEMPLATE = " | OstlerTech";
const YASAK = /sevkiyat|takip|birle[şs]tir|montaj|çevrimdışı|internetsiz|offline|reklams[ıi]z|\ben iyi\b|\bbest\b|shipment|tracking|merge|assembly|ad-free|1password|bitwarden|keepass|planswift|bluebeam|areametre/i;

for (const lang of ["tr", "en"] as const) {
  const c = AREAPILOT_COPY[lang];

  test(`${lang}: başlık şablonla ≤60, açıklama ≤160 karakter; AutoCAD ve m² geçer`, () => {
    assert.ok([...(c.title + TEMPLATE)].length <= 60, c.title);
    assert.ok([...c.description].length <= 160, `${[...c.description].length}: ${c.description}`);
    for (const t of [c.title, c.h1Sub]) assert.match(t, /AutoCAD.*m²|m².*AutoCAD/);
  });

  // SSS'nin gizlilik cevabı "usage tracking" (kullanım ölçümü yok) der: o anlamda serbest, bu yüzden yalnız arama/paylaşım metni ve fiyat cevabı taranır.
  test(`${lang}: başlık, açıklama, H1 ve fiyat cevabında yasak sözcük yok`, () => {
    for (const t of [c.title, c.description, c.h1, c.h1Sub, c.faq[0].q, c.faq[0].a]) assert.doesNotMatch(t, YASAK, t.slice(0, 80));
  });

  test(`${lang}: SSS "ücretli mi" cevabı üç KDV dahil fiyatı sabit tablodan söyler`, () => {
    const a = c.faq[0].a;
    for (const tier of ["individual", "office", "firm"] as const) assert.ok(a.includes(AREAPILOT_TIER_PRICES[tier][lang]), `${tier}: ${a}`);
    assert.match(a, lang === "tr" ? /KDV dahil/ : /including VAT/);
  });

  test(`${lang}: yapısal veri üç Offer, fiyatlar görünen tutarla aynı, TRY, KDV dahil, satıcı alanı yok (Paddle)`, () => {
    const ld = areapilotAppLd(lang);
    assert.equal(ld.offers.length, 3);
    assert.deepEqual(ld.offers.map((o) => o.price), ["2398.80", "9598.80", "23998.80"]);
    for (const o of ld.offers) {
      assert.equal(o.priceCurrency, "TRY");
      assert.equal(o.priceSpecification.valueAddedTaxIncluded, true);
      assert.ok(!("seller" in o));
    }
    if (lang === "en") assert.match(ld.offers[2].name, /^Firm /);
    assert.match(ld.image, /^https:\/\/www\.ostlertech\.com\/areapilot\/og-areapilot/);
    assert.equal(ld.publisher["@id"], "https://www.ostlertech.com/#organization");
  });
}

test("fiyat dönüştürücü: TR biçimi -> schema.org sayısı; beklenmeyen biçim hata verir", () => {
  assert.equal(tryAmount("₺2.398,80"), "2398.80");
  assert.equal(tryAmount("₺23.998,80"), "23998.80");
  assert.throws(() => tryAmount("₺2,398.80"));
});
