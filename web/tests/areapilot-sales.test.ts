// AreaPilot satın alma akışı: satış bölümünün kapısı (bayrak kapalı/açık), ödeme çağrısı, metin yasakları, istemci paketine fiyat kimliği
// girmediğinin kaynak denetimi, teşekkür sayfası kararı (Burak D1) ve satın alma e-postası. Çalıştırma: npm test
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AREAPILOT_TIER_DEVICES,
  AREAPILOT_TIER_IDS,
  AREAPILOT_TIER_PRICES,
  AREAPILOT_TIER_PRICES_EXCL_TAX,
  SALES_COPY,
  areapilotPreInfo,
  areapilotWelcomeCopy,
  checkoutRequest,
  salesPayload,
} from "../src/lib/areapilot-sales.ts";
import {
  AREAPILOT_LEGAL_ONAY_BEKLIYOR,
  PRIVACY_ADDITIONS,
  REFUND_SECTION,
  TERMS_INTRO2,
  TERMS_SECTIONS,
  TERMS_SHIFT,
  areapilotLegalLive,
} from "../src/lib/areapilot-legal.ts";
import { areapilotPricesReady, AREAPILOT_PRICE_IDS, PADDLE_PRICE_PLANS } from "../src/lib/paddle-tiers.ts";
import { paddleConfig, salesOpenFor } from "../src/lib/paddle-env.ts";
import { newKeyMailCopy, purchaseKeyMailCopy } from "../src/lib/license-mail-copy.ts";
import { revealDecision, REVEAL_WINDOW_MS } from "../src/lib/license-reveal.ts";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

const OPEN_ENV = { PADDLE_SALES_OPEN_AREAPILOT: "1", NEXT_PUBLIC_PADDLE_ENV: "production", NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: "live_testtoken0000000000000000" };

function decide(env: Record<string, string | undefined>, ids = AREAPILOT_PRICE_IDS, ready = areapilotPricesReady()) {
  const errors: unknown[] = [];
  const payload = salesPayload(
    {
      open: salesOpenFor("areapilot", { env, areapilotPricesReady: ready }),
      ids,
      getConfig: () => paddleConfig(env),
    },
    (e) => errors.push(e)
  );
  return { payload, errors };
}

// ---------------------------------------------------------------- satış kapısı

test("bayrak kapalı: yanıt yalnız {open:false}; fiyat kimliği, belirteç ve 'checkout' yok", () => {
  for (const flag of [undefined, "", "0", "true", "yes", " 1"]) {
    const { payload } = decide({ ...OPEN_ENV, PADDLE_SALES_OPEN_AREAPILOT: flag });
    assert.deepEqual(payload, { open: false }, `bayrak=${String(flag)}`);
  }
  const json = JSON.stringify(decide({}).payload);
  assert.equal(json, '{"open":false}');
  assert.doesNotMatch(json, /pri_|live_|test_|checkout/i);
});

test("SyncPass bayrağı (PADDLE_SALES_OPEN) AreaPilot satışını açmaz", () => {
  assert.deepEqual(decide({ ...OPEN_ENV, PADDLE_SALES_OPEN_AREAPILOT: undefined, PADDLE_SALES_OPEN: "1" }).payload, { open: false });
});

test("bayrak açık ama fiyat eşlemesi eksik ya da kimlik boş: kapalı kalır", () => {
  assert.deepEqual(decide(OPEN_ENV, AREAPILOT_PRICE_IDS, false).payload, { open: false });
  assert.deepEqual(decide(OPEN_ENV, { ...AREAPILOT_PRICE_IDS, firm: null }).payload, { open: false });
});

test("bayrak açık ama Paddle ayarı geçersiz: kapalı kalır ve hata bildirilir (değer sızmaz)", () => {
  const bad = decide({ ...OPEN_ENV, NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: "test_yanlisortam" });
  assert.deepEqual(bad.payload, { open: false });
  assert.equal(bad.errors.length, 1);
  const missing = decide({ PADDLE_SALES_OPEN_AREAPILOT: "1" });
  assert.deepEqual(missing.payload, { open: false });
});

test("bayrak açık: üç fiyat kimliği sunucu tablosundan gelir ve tablodaki cihaz sayılarıyla uyuşur", () => {
  const { payload } = decide(OPEN_ENV);
  assert.equal(payload.open, true);
  if (!payload.open) return;
  assert.equal(payload.environment, "production");
  assert.deepEqual(payload.prices, AREAPILOT_PRICE_IDS);
  for (const tier of AREAPILOT_TIER_IDS) {
    const info = PADDLE_PRICE_PLANS[payload.prices[tier]];
    assert.equal(info.product, "areapilot");
    assert.equal(info.plan, "lifetime");
    assert.equal(info.maxDevices, AREAPILOT_TIER_DEVICES[tier], `kart metni ile sunucu sınırı: ${tier}`);
  }
});

// ---------------------------------------------------------------- ödeme çağrısı

test("ödeme çağrısı: adet 1, istemci verisi yalnız bilgi, başarı adresi /welcome", () => {
  const r = checkoutRequest("pri_x", "en", "https://www.ostlertech.com");
  assert.deepEqual(r.items, [{ priceId: "pri_x", quantity: 1 }]);
  assert.deepEqual(r.customData, { app: "areapilot", lang: "en" });
  assert.equal(r.settings.successUrl, "https://www.ostlertech.com/welcome?urun=areapilot&lang=en");
  assert.equal("customer" in r, false);
  assert.equal(r.settings.displayMode, "overlay");
  const withMail = checkoutRequest("pri_x", "tr", "https://www.ostlertech.com", "a@b.co");
  assert.deepEqual(withMail.customer, { email: "a@b.co" });
  // adet alanı hiçbir yerde değiştirilemez: yalnız tek öğe, quantity 1
  assert.equal(r.items.length, 1);
});

// ---------------------------------------------------------------- metin yasakları

const FORBIDDEN: [string, RegExp][] = [
  ["çevrimdışı/internetsiz", /çevrimdışı|cevrimdisi|internetsiz|offline|without (an )?internet/i],
  ["reklamsız", /reklams[ıi]z|ad-free|ads-free/i],
  ["en iyi", /\ben iyi\b|\bthe best\b|\bbest\b/i],
  ["rakip adı", /1password|bitwarden|lastpass|dashlane|keepass|nordpass|proton|keeper|areametre|planswift|bluebeam/i],
  ["AreaPilot'ta geçmeyecek kelimeler", /sevkiyat|takip|birle[şs]tir|montaj|shipment|tracking|merge|assembly/i],
  ["yapay zekâ", /yapay zek|\bAI\b|artificial intelligence|chatbot/i],
  ["işaret etiketi", /\[ZEYNEP\]|\[DEFNE\]|\[ASLI\]|TODO|XXX/],
  ["fiyat tutarı", /[₺$€]\s?\d|\d\s?(₺|TL|USD|EUR|\$)/],
  ["fiyat kimliği", /pri_[0-9a-z]{10,}/],
];

function allStrings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => allStrings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => allStrings(x, out));
  return out;
}

test("satış metni (TR+EN), teşekkür metni ve e-posta: yasak ifade yok", () => {
  const texts = [
    ...allStrings(SALES_COPY),
    ...allStrings(areapilotWelcomeCopy("tr", 5)),
    ...allStrings(areapilotWelcomeCopy("en", 5)),
    ...allStrings(areapilotWelcomeCopy("tr")),
    ...Object.values(purchaseKeyMailCopy("tr", "APL-23456-789AB-CDEFG-HJKMN", 5, "https://www.ostlertech.com/areapilot")),
    ...Object.values(purchaseKeyMailCopy("en", "APL-23456-789AB-CDEFG-HJKMN", 1, "https://www.ostlertech.com/areapilot")),
  ];
  assert.ok(texts.length > 40);
  for (const t of texts) {
    for (const [name, re] of FORBIDDEN) assert.doesNotMatch(t, re, `${name}: ${t.slice(0, 80)}`);
  }
});

test("Türkçe satış metni 'sen' hitabında (siz kalıpları yok)", () => {
  const tr = allStrings(SALES_COPY.tr).concat(allStrings(areapilotWelcomeCopy("tr", 5))).join("\n");
  assert.doesNotMatch(tr, /\b(sizin|sizi|size|sizden|ediniz|yapınız|giriniz|olunuz|bulunduğunuz)\b/i);
  assert.match(tr, /bulunduğun ülke|kodun|bilgisayar/);
});

test("satış kartları: üç katman, bilgisayar sayısı kart metninde ve 1.x / tek seferlik vurgusu var", () => {
  for (const lang of ["tr", "en"] as const) {
    const c = SALES_COPY[lang];
    assert.deepEqual(Object.keys(c.tiers), [...AREAPILOT_TIER_IDS]);
    for (const tier of AREAPILOT_TIER_IDS) {
      const n = AREAPILOT_TIER_DEVICES[tier];
      const text = [c.tiers[tier].devices, ...c.tiers[tier].features].join(" ");
      assert.match(text, new RegExp(`\\b${n}\\b`), `${lang} ${tier}`);
      assert.match(text, /1\.x/);
    }
    assert.match(c.lead, /1\.x/);
  }
});

// ---------------------------------------------------------------- ön bilgi kutusu (Zeynep §5.1) ve yasal sayfa ekleri

const FORBIDDEN_LEGAL = FORBIDDEN.filter(([name]) => name !== "fiyat tutarı");

test("ön bilgi kutusu: 7 madde, iade 14 gün, Paddle satıcı notu, Autodesk bağlantısızlık; TR 'siz' hitabında", () => {
  for (const lang of ["tr", "en"] as const) {
    const p = areapilotPreInfo(lang);
    assert.equal(p.items.length, 7, lang);
    const all = [p.title, ...p.items.map((i) => i.label + " " + i.text), p.trademark].join("\n");
    assert.match(all, /14/);
    assert.match(all, /Paddle\.com/);
    assert.match(all, /Merchant of Record/);
    assert.match(all, /1\.x/);
    assert.match(all, /destek@ostlertech\.com/);
    for (const [name, re] of FORBIDDEN_LEGAL) assert.doesNotMatch(all, re, `${lang} ${name}`);
    assert.match(p.trademark, lang === "tr" ? /Autodesk tarafından yapılmamış, onaylanmamış ve desteklenmemektedir/ : /not made, endorsed or supported by Autodesk/);
    // adı geçen iki sayfa var ve bağlantılı; sözleşme/gizlilik sayfaları henüz yok: bağlantı çizilmez
    const hrefs = p.links.filter((l) => l.href).map((l) => l.href);
    assert.deepEqual(hrefs, lang === "tr" ? ["/kullanim-sartlari", "/teslimat-ve-iade"] : ["/en/terms", "/en/refunds"]);
  }
  const tr = areapilotPreInfo("tr").items.map((i) => i.text).join("\n");
  assert.match(tr, /\b(sizin|biz|bulunduğunuz|girerseniz|hakkınız)\b/);
  // JS \b yalnız ASCII harflere bakar; Türkçe harfler için açık bakış (kelime tam eşleşsin)
  assert.doesNotMatch(tr, /(^|[^a-zçğıöşü])(bulunduğun|girersen|hakkın)(?![a-zçğıöşü])/i);
});

test("ön bilgi kutusundaki üç toplam tek kaynak tablosundan gelir (AREAPILOT_TIER_PRICES) ve elle yazılmış tutar yok", () => {
  for (const lang of ["tr", "en"] as const) {
    const price = areapilotPreInfo(lang).items[1].text;
    for (const tier of AREAPILOT_TIER_IDS) {
      assert.ok(price.includes(`${AREAPILOT_TIER_PRICES_EXCL_TAX[tier][lang]} = ${AREAPILOT_TIER_PRICES[tier][lang]}`), `${lang} ${tier}`);
    }
  }
  assert.ok(areapilotPreInfo("tr").items[1].text.includes("₺2.398,80") && areapilotPreInfo("tr").items[1].text.includes("₺9.598,80") && areapilotPreInfo("tr").items[1].text.includes("₺23.998,80"));
  const src = fs.readFileSync(path.join(SRC, "lib", "areapilot-sales.ts"), "utf8");
  const pre = src.slice(src.indexOf("export function areapilotPreInfo"), src.indexOf("export interface WelcomeCopy"));
  assert.doesNotMatch(pre, /₺\s?\d|\d\s?₺/, "ön bilgi işlevinde sabit tutar yazılmaz");
});

test("kart fiyat cümlesi ile ön bilgi çelişmez: kart ana fiyatı KDV dahil toplam, ön bilgi de aynı toplamı söyler", () => {
  for (const lang of ["tr", "en"] as const) {
    const text = areapilotPreInfo(lang).items[1].text;
    assert.match(text, lang === "tr" ? /KDV dahil toplam/ : /including 20% VAT/);
    assert.doesNotMatch(text, /vergileri içerir|exclude tax|KDV hariçtir/i);
  }
});

test("AreaPilot yasal sayfa ekleri: Yasin'in onayıyla AÇIK (2026-11-07), metinde yasak ifade ve işaret yok, TR/EN aynı bölüm sayısı", () => {
  assert.equal(AREAPILOT_LEGAL_ONAY_BEKLIYOR, false, "Yasin 2026-11-07'de satışa çıkış kararını verdi; bayrak yalnız onunla kapatılır");
  assert.equal(areapilotLegalLive(), true);
  assert.equal(TERMS_SECTIONS.tr.length, TERMS_SHIFT);
  assert.equal(TERMS_SECTIONS.en.length, TERMS_SHIFT);
  const all = [
    TERMS_INTRO2.tr,
    TERMS_INTRO2.en,
    ...TERMS_SECTIONS.tr.flatMap((s) => [s.heading, ...s.items.map((i) => i.text)]),
    ...TERMS_SECTIONS.en.flatMap((s) => [s.heading, ...s.items.map((i) => i.text)]),
    ...[REFUND_SECTION.tr, REFUND_SECTION.en].flatMap((s) => [s.heading, ...s.items.map((i) => (i.lead ?? "") + i.text)]),
    ...Object.values(PRIVACY_ADDITIONS.tr),
    ...Object.values(PRIVACY_ADDITIONS.en),
  ].join("\n");
  for (const [name, re] of FORBIDDEN_LEGAL) assert.doesNotMatch(all, re, name);
  assert.doesNotMatch(all, /\[S\d|\[If S|kabul edilirse|internetsiz|vergileri içerir|ONAY-BEKLIYOR/i);
  // K10 (süresiz belge + haftalık sessiz durum sorgusu) ve K11=a (sıfırlanan/kaldırılan cihaz düşer) metinde; eski model (90 gün, yenileme, doğrulama süresi, K8 duyurusu) YOK
  assert.match(TERMS_SECTIONS.tr[2].items[0].text, /bitiş tarihi yoktur/);
  assert.match(TERMS_SECTIONS.tr[2].items[0].text, /sunucumuz erişilemez olsa da lisans çalışmaya devam eder/);
  assert.match(TERMS_SECTIONS.tr[2].items[0].text, /yaklaşık 7 günde bir/);
  assert.match(TERMS_SECTIONS.tr[2].items[0].text, /Eski kodla etkinleştirilmiş bilgisayarlar, internete bağlıyken yapılan bir sonraki lisans durum sorgusunda ücretsiz moda geçer/);
  assert.match(TERMS_SECTIONS.en[2].items[0].text, /has no end date/);
  assert.match(TERMS_SECTIONS.en[2].items[0].text, /keeps working even if our server cannot be reached/);
  assert.match(TERMS_SECTIONS.en[2].items[0].text, /about once every 7 days/);
  assert.match(TERMS_SECTIONS.en[2].items[0].text, /Computers activated with the old key switch to free mode at their next license status check/);
  assert.match(REFUND_SECTION.tr.items[3].text, /sonraki lisans durum sorgusunda/);
  assert.match(REFUND_SECTION.en.items[3].text, /next license status check/);
  const eskiModel = /90 g[üu]n|90 days|son doğrulamadan|doğrulamasız|yeniden doğrular|renews it|re-?verif|doğrulama hizmeti|en geç 90|within 90 days/i;
  for (const [name, text] of [["legal", all], ["preinfo tr", JSON.stringify(areapilotPreInfo("tr"))], ["preinfo en", JSON.stringify(areapilotPreInfo("en"))]] as const) {
    assert.doesNotMatch(text, eskiModel, `eski lisans modeli kalmış: ${name}`);
  }
  // ön bilgi madde 4: bitiş tarihi yok + haftalık sorgu + iade/eski kod düşmesi
  assert.match(areapilotPreInfo("tr").items[3].text, /Lisansın bitiş tarihi yoktur/);
  assert.match(areapilotPreInfo("tr").items[3].text, /yaklaşık haftada bir/);
  assert.match(areapilotPreInfo("en").items[3].text, /has no end date/);
  assert.match(areapilotPreInfo("en").items[3].text, /about once a week/);
  // K9 (ticari kullanım) metinde
  assert.match(TERMS_SECTIONS.tr[0].items[0].text, /ticari işler dahil/);
  assert.match(TERMS_SECTIONS.en[0].items[0].text, /including commercial work/);
  // K2 uyumu: fiyat cümlesi KDV dahil toplamı söyler
  assert.match(TERMS_SECTIONS.tr[0].items[0].text, /%20 KDV dahil toplam/);
  // iade: 14 gün, düğme adları ön bilgiyle aynı
  assert.match(REFUND_SECTION.tr.items[2].text, /14 gün/);
  assert.match(REFUND_SECTION.en.items[2].text, /14 days/);
  assert.match(TERMS_SECTIONS.tr[2].items[0].text, /“Bu bilgisayardan kaldır”/);
  assert.match(TERMS_SECTIONS.tr[2].items[0].text, /“Cihazlarımı sıfırla \(e-posta\)”/);
});

test("yasal sayfalar bayrağa bağlı: kapalıyken eski numaralar, AreaPilot bölümü yalnız areapilotLegalLive() ile çizilir", () => {
  const pages = [
    "app/(tr)/kullanim-sartlari/page.tsx",
    "app/(en)/en/terms/page.tsx",
    "app/(tr)/teslimat-ve-iade/page.tsx",
    "app/(en)/en/refunds/page.tsx",
    "app/(tr)/gizlilik/page.tsx",
    "app/(en)/en/privacy/page.tsx",
  ];
  for (const rel of pages) {
    const t = fs.readFileSync(path.join(SRC, rel), "utf8");
    assert.match(t, /areapilotLegalLive\(\)/, rel);
    assert.match(t, /\{live &&|\{live \?/, rel);
  }
  // kapalıyken eski bölüm başlıkları değişmez (numara kayması yalnız live iken)
  const terms = fs.readFileSync(path.join(SRC, "app/(tr)/kullanim-sartlari/page.tsx"), "utf8");
  assert.match(terms, /const sh = live \? TERMS_SHIFT : 0;/);
});

test("kart fiyatları koda SABİT ve KDV DAHİL (Yasin 2026-11-07); vergi hesabı ve Paddle önizlemesi yok", () => {
  assert.equal(AREAPILOT_TIER_PRICES.individual.tr, "₺2.398,80");
  assert.equal(AREAPILOT_TIER_PRICES.office.tr, "₺9.598,80");
  assert.equal(AREAPILOT_TIER_PRICES.firm.tr, "₺23.998,80");
  assert.equal(AREAPILOT_TIER_PRICES.individual.en, "₺2,398.80");
  assert.equal(AREAPILOT_TIER_PRICES.office.en, "₺9,598.80");
  assert.equal(AREAPILOT_TIER_PRICES.firm.en, "₺23,998.80");
  assert.match(SALES_COPY.tr.taxIncluded, /KDV dahil/);
  assert.match(SALES_COPY.tr.priceNote, /ödeme adımında/);
  const comp = fs.readFileSync(path.join(SRC, "components", "AreaPilotPricingOpen.tsx"), "utf8");
  assert.doesNotMatch(comp, /PricePreview|formattedTotals|subtotal|\* 1[.,]2|1\.2/, "kartta Paddle önizlemesi ya da vergi hesabı yok");
  assert.match(comp, /AREAPILOT_TIER_PRICES\[tier\]/);
  const lib = fs.readFileSync(path.join(SRC, "lib", "areapilot-sales.ts"), "utf8");
  assert.doesNotMatch(lib, /PricePreview|formattedTotals/);
});

// ---------------------------------------------------------------- kaynak denetimi (istemci paketi)

test("istemci dosyaları fiyat kimliği içermez ve sunucu tablosunu içe aktarmaz", () => {
  const files = walk(SRC);
  const clientFiles = files.filter((f) => /^\s*["']use client["']/.test(fs.readFileSync(f, "utf8")));
  assert.ok(clientFiles.length > 5);
  for (const f of clientFiles) {
    const t = fs.readFileSync(f, "utf8");
    const rel = path.relative(SRC, f);
    assert.doesNotMatch(t, /pri_[0-9a-z]{20,}/, `${rel}: fiyat kimliği`);
    assert.doesNotMatch(t, /from ["'](@\/lib\/paddle-tiers|\.\/paddle-tiers|@\/lib\/server\/|@\/lib\/paddle-events)/, `${rel}: sunucu modülü`);
  }
  // İstemcinin içe aktardığı ortak dosyalar da temiz olmalı.
  for (const rel of ["lib/areapilot-sales.ts", "lib/syncpass-tiers.ts"]) {
    const t = fs.readFileSync(path.join(SRC, rel), "utf8");
    for (const id of Object.values(AREAPILOT_PRICE_IDS)) assert.ok(id && !t.includes(id), `${rel}: AreaPilot fiyat kimliği`);
  }
});

test("AreaPilot sayfası satış bölümünü yalnız kapı bileşeni üzerinden çizer; ödeme kodu ayrı pakette yüklenir", () => {
  const landing = fs.readFileSync(path.join(SRC, "components/AreaPilotLanding.tsx"), "utf8");
  assert.match(landing, /<AreaPilotPricing lang=\{lang\} \/>/);
  assert.doesNotMatch(landing, /AreaPilotPricingOpen|paddle-js|Checkout|pri_/);
  const gate = fs.readFileSync(path.join(SRC, "components/AreaPilotPricing.tsx"), "utf8");
  assert.match(gate, /dynamic\(\(\) => import\("\.\/AreaPilotPricingOpen"\)/);
  assert.doesNotMatch(gate, /paddle-js|Checkout/);
  // Sayfaların statik kalması: satış durumu sayfa dosyalarında okunmaz.
  for (const rel of ["app/(tr)/areapilot/page.tsx", "app/(en)/en/areapilot/page.tsx"]) {
    const t = fs.readFileSync(path.join(SRC, rel), "utf8");
    assert.doesNotMatch(t, /salesOpen|PADDLE_SALES|force-dynamic|headers\(\)/, rel);
  }
});

test("satış bayrağı sunucu dışında okunmaz: yalnız /api/areapilot/satis çağırır", () => {
  const code = (f: string) =>
    fs
      .readFileSync(f, "utf8")
      .split("\n")
      .filter((l) => !/^\s*(\/\/|\/\*|\*)/.test(l))
      .join("\n");
  const users = walk(SRC).filter((f) => /salesOpenFor\(/.test(code(f)) && !f.endsWith("paddle-env.ts"));
  assert.deepEqual(users.map((f) => path.relative(SRC, f).replaceAll("\\", "/")), ["app/api/areapilot/satis/route.ts"]);
});

// ---------------------------------------------------------------- teşekkür sayfası (Burak D1)

test("kod gösterme kararı: yalnız etkin, sıfırlanmamış ve 48 saat içindeki lisans", () => {
  const now = 1_800_000_000_000;
  const base = { status: "active", resetCount: 0, createdAtMs: now - 1000, nowMs: now };
  assert.equal(revealDecision(base), "show");
  assert.equal(revealDecision({ ...base, resetCount: 1 }), "hide", "sıfırlanmış lisansın yeni kodu işlem numarasıyla alınamaz");
  for (const status of ["refunded", "revoked", "paused", "past_due", "canceled"]) assert.equal(revealDecision({ ...base, status }), "hide", status);
  assert.equal(revealDecision({ ...base, createdAtMs: now - REVEAL_WINDOW_MS - 1 }), "hide");
  assert.equal(revealDecision({ ...base, createdAtMs: now - REVEAL_WINDOW_MS }), "show");
  assert.equal(revealDecision({ ...base, createdAtMs: Number.NaN }), "hide");
});

test("teşekkür metni: AreaPilot alıcısı SyncPass sözcüğü görmez; cihaz sayısı kayda göre", () => {
  for (const lang of ["tr", "en"] as const) {
    const text = allStrings(areapilotWelcomeCopy(lang, 20)).join("\n");
    assert.doesNotMatch(text, /SyncPass|kasa|vault|Premium/i);
    assert.match(text, /AreaPilot/);
    assert.match(text, /\b20\b/);
    assert.match(allStrings(areapilotWelcomeCopy(lang, 1)).join("\n"), /\b1\b/);
  }
  assert.equal(areapilotWelcomeCopy("tr").backHref, "/areapilot");
  assert.equal(areapilotWelcomeCopy("en").backHref, "/en/areapilot");
});

// ---------------------------------------------------------------- satın alma e-postası metni

test("satın alma e-postası: ürün adı AreaPilot, kod, indirme bağlantısı, destek, paylaşma uyarısı; SyncPass metni karışmaz", () => {
  const key = "APL-23456-789AB-CDEFG-HJKMN";
  const url = "https://www.ostlertech.com/areapilot";
  for (const lang of ["tr", "en"] as const) {
    const m = purchaseKeyMailCopy(lang, key, 5, url);
    assert.match(m.subject, /AreaPilot/);
    assert.ok(m.text.includes(key));
    assert.ok(m.text.includes(url));
    assert.ok(m.text.includes("destek@ostlertech.com"));
    assert.ok(m.text.includes("\n1. "));
    assert.doesNotMatch(m.text + m.subject, /SyncPass|Premium|kasa|vault|Ayarlar|Settings/);
    assert.match(m.text, lang === "tr" ? /paylaşma/ : /not share/i);
  }
  assert.match(purchaseKeyMailCopy("tr", key, 5, url).text, /en fazla 5 bilgisayarda/);
  assert.match(purchaseKeyMailCopy("tr", key, 1, url).text, /1 bilgisayarda/);
  assert.match(purchaseKeyMailCopy("en", key, 20, url).text, /up to 20 computers/);
  assert.match(purchaseKeyMailCopy("tr", key, 5, url).text, /\bsen|\bkodun|aç\./i);
});

// Zeynep yeniden okuma (2026-11-08) D2/D3/D7: kodun yazdığı her veri aydınlatmada, durum sorgusunun iki sorusu her tanımda
test("yeniden okuma D2/D3/D7: eski kod özeti gizlilik ekinde, kayıt sorusu ön bilgide, sıfırlama e-postası düşmeyi söyler", () => {
  assert.match(PRIVACY_ADDITIONS.tr.license, /değiştirilen eski kodun tek yönlü özeti/);
  assert.match(PRIVACY_ADDITIONS.en.license, /one-way digest of a code replaced in a reset/);
  for (const lang of ["tr", "en"] as const) {
    const info = JSON.stringify(areapilotPreInfo(lang));
    assert.match(info, lang === "tr" ? /ve bu bilgisayarın kayıtlı olup olmadığını sorar/ : /whether this computer is still registered/);
  }
  assert.match(newKeyMailCopy("tr", "APL-X").text, /ücretsiz moda geçer/);
  assert.match(newKeyMailCopy("en", "APL-X").text, /switch to free mode/);
});
