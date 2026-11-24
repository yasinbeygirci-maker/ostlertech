// AreaPilot Lisans Sözleşmesi ve Gizlilik Politikası: eklenti ve yasal metinler bu dört adresi anar (public/areapilot/yasal).
// Tek kaynak SpaceCalc paket/magaza/yasal; burada kopya durur. Adresler yönlendirme ile açılır (permanent: false).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const kok = process.cwd();
const config = fs.readFileSync(path.join(kok, "next.config.ts"), "utf8");
const yasalKlasor = path.join(kok, "public", "areapilot", "yasal");

const adresler: Array<[string, string, RegExp]> = [
  ["/areapilot/gizlilik", "PRIVACY-tr.html", /<h1>AreaPilot Gizlilik Politikası<\/h1>/],
  ["/en/areapilot/privacy", "PRIVACY-en.html", /<h1>AreaPilot Privacy Policy<\/h1>/],
  ["/areapilot/lisans-sozlesmesi", "EULA-tr.html", /<h1>AreaPilot Son Kullanıcı Lisans Sözleşmesi<\/h1>/],
  ["/en/areapilot/license-agreement", "EULA-en.html", /<h1>AreaPilot End User License Agreement<\/h1>/],
];

for (const [kaynak, dosya, baslik] of adresler) {
  test(`${kaynak} -> /areapilot/yasal/${dosya} yönlenir ve dosya var`, () => {
    assert.ok(
      config.includes(`{ source: "${kaynak}", destination: "/areapilot/yasal/${dosya}", permanent: false }`),
      "yönlendirme satırı yok",
    );
    // zincir yok: hedef başka bir yönlendirmenin kaynağı olamaz
    assert.ok(!config.includes(`source: "/areapilot/yasal/${dosya}"`));
    const html = fs.readFileSync(path.join(yasalKlasor, dosya), "utf8");
    assert.match(html, baslik);
    assert.ok(!html.includes("{CAN:"), "{CAN: yer tutucusu kalmış");
    assert.ok(html.includes("Autodesk Marketplace"), "Marketplace kapsamı yok (Sürüm 3 metni değil)");
  });
}

test("satın alma kutusundaki sözleşme ve gizlilik bağlantıları bu adreslere gider", () => {
  const sales = fs.readFileSync(path.join(kok, "src", "lib", "areapilot-sales.ts"), "utf8");
  for (const [kaynak] of adresler) assert.ok(sales.includes(`href: "${kaynak}"`), kaynak);
  assert.ok(!/label: "(License Agreement|Privacy Policy|Lisans Sözleşmesi|Gizlilik Politikası)", href: null/.test(sales));
});

test("Kullanım Koşulları md. 8: sözleşme adresi ve Marketplace ilk çalıştırma cümlesi", () => {
  const legal = fs.readFileSync(path.join(kok, "src", "lib", "areapilot-legal.ts"), "utf8");
  assert.ok(legal.includes("ostlertech.com/areapilot/lisans-sozlesmesi"));
  assert.ok(legal.includes("ostlertech.com/en/areapilot/license-agreement"));
  assert.ok(!legal.includes("kurulum sırasında ve “AreaPilot Hakkında”"));
});

test("AreaPilot sayfasında yalnız denenen AutoCAD sürümleri (2022 ve 2027) yazar, 2021 yok", () => {
  const icerik = fs.readFileSync(path.join(kok, "src", "lib", "areapilot-content.ts"), "utf8");
  assert.ok(!/AutoCAD 2021|2021 dışındaki|other than 2021/.test(icerik));
  assert.ok(icerik.includes("AutoCAD 2022 ve 2027"));
  assert.ok(icerik.includes("AutoCAD 2022 and 2027"));
});

// Yayın kapısı: sürüm tarihi yer tutucusu dolmadan siteye yayınlanmaz. Yayın günü YAYIN_KAPISI=1 npm test ile koşulur.
test("yayın kapısı: {YAYIN TARİHİ} / {PUBLICATION DATE} dolmuş", { skip: process.env.YAYIN_KAPISI !== "1" }, () => {
  for (const [, dosya] of adresler) {
    const html = fs.readFileSync(path.join(yasalKlasor, dosya), "utf8");
    assert.ok(!/\{YAYIN TARİHİ\}|\{PUBLICATION DATE\}/.test(html), dosya);
  }
});

// SpaceCalc deposu yanda varsa kopya birebir aynı olmalı (AREAPILOT_YASAL_KAYNAK = paket/magaza/yasal klasörü)
test("kopya SpaceCalc kaynağıyla birebir aynı", { skip: !process.env.AREAPILOT_YASAL_KAYNAK }, () => {
  for (const [, dosya] of adresler) {
    const a = fs.readFileSync(path.join(yasalKlasor, dosya));
    const b = fs.readFileSync(path.join(process.env.AREAPILOT_YASAL_KAYNAK!, dosya));
    assert.ok(a.equals(b), dosya);
  }
});
