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
  SALES_COPY,
  areapilotWelcomeCopy,
  checkoutRequest,
  salesPayload,
} from "../src/lib/areapilot-sales.ts";
import { areapilotPricesReady, AREAPILOT_PRICE_IDS, PADDLE_PRICE_PLANS } from "../src/lib/paddle-tiers.ts";
import { paddleConfig, salesOpenFor } from "../src/lib/paddle-env.ts";
import { purchaseKeyMailCopy } from "../src/lib/license-mail-copy.ts";
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

test("yasal satırlar: iade 14 gün, Paddle satıcı notu, Autodesk bağlantısızlık", () => {
  assert.match(SALES_COPY.tr.legal.refund, /14 gün/);
  assert.match(SALES_COPY.en.legal.refund, /14 days/);
  assert.match(SALES_COPY.tr.legal.paddle, /Paddle\.com/);
  assert.match(SALES_COPY.en.legal.paddle, /Paddle\.com/);
  assert.match(SALES_COPY.tr.legal.trademark, /Autodesk ile bağlantılı değildir/);
  assert.match(SALES_COPY.en.legal.trademark, /not affiliated with Autodesk/);
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
