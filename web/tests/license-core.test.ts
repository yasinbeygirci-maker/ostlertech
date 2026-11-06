// Lisans çekirdeği: kod biçimi, hak süresi, belge imzası (SyncPass Ed25519 / AreaPilot ECDSA P-256), uç nokta mantığı,
// fiyat kimliği tablosu, satış bayrağı, e-posta sözcükleri. Çalıştırma: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, createPublicKey, verify } from "node:crypto";
import {
  areapilotPublicKey,
  entitlementUntil,
  foreignKeyProduct,
  handleLicenseRequest,
  newLicenseKey,
  normalizeKey,
  signLicenseToken,
  SigningNotConfigured,
  verifyAreapilotToken,
  type LicenseRow,
  type LicenseStore,
  type Product,
} from "../src/lib/license-core.ts";
import { buildPriceCatalog, PADDLE_PRICE_PLANS, priceInfo } from "../src/lib/paddle-tiers.ts";
import { salesOpenFor } from "../src/lib/paddle-env.ts";
import { licenseMailCopy } from "../src/lib/license-mail-copy.ts";

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;
const DEV_A = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const DEV_B = "bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee";

// Testte üretilen anahtarlar (gerçek anahtar yok).
const ec = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const ed = generateKeyPairSync("ed25519");
const ecPriv = ec.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64");
const edPriv = ed.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64");
const ENV = { LICENSE_SIGNING_KEY: edPriv, LICENSE_SIGNING_KEY_AREAPILOT: ecPriv };

function row(over: Partial<LicenseRow> = {}): LicenseRow {
  return {
    id: "11111111-2222-4333-8444-555555555555",
    license_key: "APL-23456-789AB-CDEFG-HJKMN",
    product: "areapilot",
    plan: "lifetime",
    status: "active",
    current_period_end: null,
    max_devices: 5,
    ...over,
  };
}

function b64urlJson(part: string) {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

// ---- kod biçimi ----

test("kod: ürün ön eki üretilir ve yalnız kendi ürününde geçerlidir", () => {
  const spd = newLicenseKey();
  const apl = newLicenseKey("areapilot");
  assert.match(spd, /^SPD-[2-9A-HJKMNP-TV-Z]{5}(-[2-9A-HJKMNP-TV-Z]{5}){3}$/);
  assert.match(apl, /^APL-[2-9A-HJKMNP-TV-Z]{5}(-[2-9A-HJKMNP-TV-Z]{5}){3}$/);
  assert.equal(normalizeKey(spd), spd);
  assert.equal(normalizeKey(apl, "areapilot"), apl);
  assert.equal(normalizeKey(apl), null, "SyncPass ucu APL kodunu kabul etmez");
  assert.equal(normalizeKey(spd, "areapilot"), null, "AreaPilot ucu SPD kodunu kabul etmez");
  assert.equal(foreignKeyProduct(apl, "syncpass_desktop"), "areapilot");
  assert.equal(foreignKeyProduct(spd, "areapilot"), "syncpass_desktop");
  assert.equal(foreignKeyProduct(spd, "syncpass_desktop"), null);
});

test("kod: küçük harf, boşluk, tire ve ön eksiz yazım kabul edilir; bozuk olan reddedilir", () => {
  assert.equal(normalizeKey(" apl 23456 789ab cdefg hjkmn ", "areapilot"), "APL-23456-789AB-CDEFG-HJKMN");
  assert.equal(normalizeKey("23456789ABCDEFGHJKMN", "areapilot"), "APL-23456-789AB-CDEFG-HJKMN");
  assert.equal(normalizeKey("spd23456789ABCDEFGHJKMN"), "SPD-23456-789AB-CDEFG-HJKMN");
  for (const bad of [null, undefined, 5, "", "APL-1", "APL-0OIL1-23456-789AB-CDEFG", "APL-23456-789AB-CDEFG-HJKMNX"]) {
    assert.equal(normalizeKey(bad, "areapilot"), null);
  }
});

// ---- hak süresi ----

test("hak süresi: AreaPilot tek seferlik 90 gün, SyncPass 30 gün; iade/askı/iptal düşürür", () => {
  assert.equal(entitlementUntil(row(), NOW), NOW + 90 * DAY);
  assert.equal(entitlementUntil(row({ product: "syncpass_desktop" }), NOW), NOW + 30 * DAY);
  for (const status of ["refunded", "revoked", "paused", "canceled", "past_due"] as const) {
    assert.equal(entitlementUntil(row({ status }), NOW), null, status);
  }
});

test("hak süresi: SyncPass aboneliği eskisi gibi (dönem sonu + 7 gün pay, en çok 30 gün)", () => {
  const sub = (over: Partial<LicenseRow>) => row({ product: "syncpass_desktop", plan: "month", max_devices: 3, ...over });
  const end = new Date(NOW + 10 * DAY).toISOString();
  assert.equal(entitlementUntil(sub({ current_period_end: end }), NOW), NOW + 17 * DAY);
  assert.equal(entitlementUntil(sub({ current_period_end: new Date(NOW + 60 * DAY).toISOString() }), NOW), NOW + 30 * DAY);
  assert.equal(entitlementUntil(sub({ current_period_end: end, status: "canceled" }), NOW), NOW + 10 * DAY);
  assert.equal(entitlementUntil(sub({ current_period_end: new Date(NOW - 8 * DAY).toISOString() }), NOW), null);
  assert.equal(entitlementUntil(sub({ current_period_end: null }), NOW), null);
});

// ---- belge imzası ----

test("AreaPilot belgesi: ECDSA P-256 / SHA-256, IEEE P1363 (64 bayt), gövde alanları sözleşmedeki gibi", () => {
  const token = signLicenseToken("areapilot", { lid: "L1", plan: "lifetime", dev: DEV_A, exp: NOW + 90 * DAY, maxDevices: 5 }, { env: ENV, now: NOW });
  const [body, sig] = token.split(".");
  assert.deepEqual(b64urlJson(body), { v: 1, lid: "L1", product: "areapilot", plan: "lifetime", dev: DEV_A, exp: NOW + 90 * DAY, maxDevices: 5, iat: NOW });
  assert.equal(Buffer.from(sig, "base64url").length, 64);
  assert.doesNotMatch(token, /[=+/]/, "dolgu ve standart base64 karakteri yok");
  // Bağımsız doğrulama (kendi kodumuz değil, doğrudan node:crypto): imza gövdenin base64url metni üzerinde.
  const ok = verify("sha256", Buffer.from(body), { key: ec.publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(sig, "base64url"));
  assert.equal(ok, true);
});

test("AreaPilot belgesi: bozulan gövde, başka anahtar ve DER imza doğrulanmaz", () => {
  const token = signLicenseToken("areapilot", { lid: "L1", plan: "lifetime", dev: DEV_A, exp: NOW + DAY, maxDevices: 1 }, { env: ENV, now: NOW });
  const spki = ec.publicKey.export({ format: "der", type: "spki" }).toString("base64");
  assert.ok(verifyAreapilotToken(token, spki));
  const [body, sig] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ ...b64urlJson(body), maxDevices: 20 })).toString("base64url");
  assert.equal(verifyAreapilotToken(`${forged}.${sig}`, spki), null);
  const other = generateKeyPairSync("ec", { namedCurve: "prime256v1" }).publicKey.export({ format: "der", type: "spki" }).toString("base64");
  assert.equal(verifyAreapilotToken(token, other), null);
  assert.equal(verifyAreapilotToken("tek-parca", spki), null);
});

test("SyncPass belgesi değişmedi: Ed25519, gövde {v,lid,plan,dev,exp,iat}", () => {
  const token = signLicenseToken("syncpass_desktop", { lid: "L1", plan: "year", dev: DEV_A, exp: NOW + DAY, maxDevices: 3 }, { env: ENV, now: NOW });
  const [body, sig] = token.split(".");
  assert.deepEqual(b64urlJson(body), { v: 1, lid: "L1", plan: "year", dev: DEV_A, exp: NOW + DAY, iat: NOW });
  assert.equal(verify(null, Buffer.from(body), ed.publicKey, Buffer.from(sig, "base64url")), true);
  assert.equal(Buffer.from(sig, "base64url").length, 64); // Ed25519 de 64 bayt: ayrımı anahtarlar yapar
});

test("ürün anahtarları ayrı: AreaPilot belgesi SyncPass anahtarıyla, tersi AreaPilot anahtarıyla doğrulanmaz", () => {
  const apl = signLicenseToken("areapilot", { lid: "L", plan: "lifetime", dev: DEV_A, exp: NOW + DAY }, { env: ENV, now: NOW });
  const spd = signLicenseToken("syncpass_desktop", { lid: "L", plan: "lifetime", dev: DEV_A, exp: NOW + DAY }, { env: ENV, now: NOW });
  const [b1, s1] = apl.split(".");
  const [b2, s2] = spd.split(".");
  assert.equal(verify(null, Buffer.from(b1), ed.publicKey, Buffer.from(s1, "base64url")), false);
  assert.equal(verify("sha256", Buffer.from(b2), { key: ec.publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(s2, "base64url")), false);
  // AreaPilot yalnız kendi değişkenine bakar: onu silince SyncPass anahtarı devreye girmez.
  assert.throws(() => signLicenseToken("areapilot", { lid: "L", plan: "lifetime", dev: DEV_A, exp: 1 }, { env: { LICENSE_SIGNING_KEY: edPriv } }), SigningNotConfigured);
  assert.throws(() => signLicenseToken("syncpass_desktop", { lid: "L", plan: "lifetime", dev: DEV_A, exp: 1 }, { env: { LICENSE_SIGNING_KEY_AREAPILOT: ecPriv } }), SigningNotConfigured);
});

test("genel anahtar türetme: ham nokta 65 bayt (0x04||X||Y), SPKI ile tutarlı", () => {
  const pub = areapilotPublicKey(ecPriv);
  const point = Buffer.from(pub.pointB64, "base64");
  assert.equal(point.length, 65);
  assert.equal(point[0], 4);
  assert.equal(Buffer.from(pub.xB64, "base64").length, 32);
  assert.deepEqual(point.subarray(1, 33), Buffer.from(pub.xB64, "base64"));
  assert.deepEqual(point.subarray(33), Buffer.from(pub.yB64, "base64"));
  assert.equal(pub.spkiB64, ec.publicKey.export({ format: "der", type: "spki" }).toString("base64"));
  assert.equal(createPublicKey({ key: Buffer.from(pub.spkiB64, "base64"), format: "der", type: "spki" }).asymmetricKeyType, "ec");
});

test("sözleşmedeki örnek belge (sahte genel anahtar) doğrulanır; süresi dolmuş olan imzalı ama dolmuş", () => {
  const spki = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAERRoh1lkW+t/CwVpEtub3sT0sl8Y2rcSTsiq9UKITzj1+RBqM8vBrcS+D2VrTNoF/gVhdovmtigIOZZp7s/zrsg==";
  const valid =
    "eyJ2IjoxLCJsaWQiOiIxMTExMTExMS0yMjIyLTQzMzMtODQ0NC01NTU1NTU1NTU1NTUiLCJwcm9kdWN0IjoiYXJlYXBpbG90IiwicGxhbiI6ImxpZmV0aW1lIiwiZGV2IjoiYWFhYWFhYWEtYmJiYi00Y2NjLThkZGQtZWVlZWVlZWVlZWVlIiwibWF4RGV2aWNlcyI6NSwiaWF0IjoxNzkzMDAwMDAwMDAwLCJleHAiOjQxMDI0NDQ4MDAwMDB9.RH_BL0c4gvN8k2NzsBOwBEBDEG10AtljHZaQhh0xvCOcANnxmhlQ9G2jbs1vJwq7J5QWMC4tSyy38dSqBFr7Fg";
  const expired =
    "eyJ2IjoxLCJsaWQiOiIxMTExMTExMS0yMjIyLTQzMzMtODQ0NC01NTU1NTU1NTU1NTUiLCJwcm9kdWN0IjoiYXJlYXBpbG90IiwicGxhbiI6ImxpZmV0aW1lIiwiZGV2IjoiYWFhYWFhYWEtYmJiYi00Y2NjLThkZGQtZWVlZWVlZWVlZWVlIiwibWF4RGV2aWNlcyI6NSwiaWF0IjoxNzkzMDAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDAwMDB9.DOEs-jUJ55LymsR1uAIfRq-9xgRpPdM4r-f3CzvO5_prEPYoMJOIIxM-U2OcI2jGIBDxtD_fOE2GR47tyYCrcQ";
  const p = verifyAreapilotToken(valid, spki);
  assert.ok(p);
  assert.equal(p.product, "areapilot");
  assert.equal(p.exp, 4102444800000);
  const e = verifyAreapilotToken(expired, spki);
  assert.ok(e && (e.exp as number) < Date.now());
});

// ---- uç nokta mantığı (sahte depo) ----

function fakeStore(rows: LicenseRow[], opts: { failUpsert?: boolean } = {}) {
  const devices = new Map<string, Set<string>>();
  const store: LicenseStore = {
    async findLicense(key: string, product: Product) {
      return rows.find((r) => r.license_key === key && r.product === product) ?? null;
    },
    async listDevices(id: string) {
      return [...(devices.get(id) ?? [])];
    },
    async upsertDevice(id: string, dev: string) {
      if (opts.failUpsert) return false;
      devices.set(id, (devices.get(id) ?? new Set()).add(dev));
      return true;
    },
    async removeDevice(id: string, dev: string) {
      devices.get(id)?.delete(dev);
    },
  };
  return { store, devices };
}

const aplRow = row({ license_key: "APL-23456-789AB-CDEFG-HJKMN", max_devices: 1 });
const spdRow = row({ id: "99999999-2222-4333-8444-555555555555", license_key: "SPD-23456-789AB-CDEFG-HJKMN", product: "syncpass_desktop", max_devices: 3 });
const call = (op: "activate" | "renew" | "deactivate", product: Product, body: unknown, store: LicenseStore) =>
  handleLicenseRequest(op, product, body, store, { env: ENV, now: NOW });

test("etkinleştirme: AreaPilot yanıtı ürün + cihaz sayısı taşır, belge doğrulanır", async () => {
  const { store } = fakeStore([aplRow]);
  const r = await call("activate", "areapilot", { key: "apl-23456-789ab-cdefg-hjkmn", deviceId: DEV_A.toUpperCase(), appVersion: "1.0.0" }, store);
  assert.equal(r.status, 200);
  assert.equal(r.body.product, "areapilot");
  assert.equal(r.body.plan, "lifetime");
  assert.equal(r.body.maxDevices, 1);
  assert.equal(r.body.expiresAt, NOW + 90 * DAY);
  const payload = verifyAreapilotToken(String(r.body.token), areapilotPublicKey(ecPriv).spkiB64);
  assert.ok(payload);
  assert.equal(payload.dev, DEV_A, "cihaz kimliği küçük harfe çevrilir");
  assert.equal(payload.exp, NOW + 90 * DAY);
});

test("etkinleştirme: SyncPass yanıt biçimi değişmedi ({token, plan, expiresAt})", async () => {
  const { store } = fakeStore([spdRow]);
  const r = await call("activate", "syncpass_desktop", { key: "SPD-23456-789AB-CDEFG-HJKMN", deviceId: DEV_A }, store);
  assert.equal(r.status, 200);
  assert.deepEqual(Object.keys(r.body).sort(), ["expiresAt", "plan", "token"]);
  assert.equal(r.body.expiresAt, NOW + 30 * DAY);
});

test("etkinleştirme: cihaz sınırı (Bireysel 1), aynı cihaz yeniden etkinleştirilebilir, kaldırınca yer açılır", async () => {
  const { store } = fakeStore([aplRow]);
  assert.equal((await call("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store)).status, 200);
  const full = await call("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_B }, store);
  assert.equal(full.status, 409);
  assert.deepEqual(full.body, { error: "device_limit", maxDevices: 1 });
  assert.equal((await call("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store)).status, 200);
  assert.deepEqual((await call("deactivate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store)).body, { ok: true });
  assert.equal((await call("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_B }, store)).status, 200);
});

test("yenileme: kayıtlı cihaza belge verir; kaldırılmış cihaza 404 device_unknown (geri eklemez)", async () => {
  const { store, devices } = fakeStore([aplRow]);
  assert.deepEqual((await call("renew", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store)).body, { error: "device_unknown" });
  assert.equal(devices.get(aplRow.id)?.size ?? 0, 0, "yenileme cihaz eklemedi");
  await call("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store);
  const r = await call("renew", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store);
  assert.equal(r.status, 200);
  assert.ok(r.body.token);
  await call("deactivate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store);
  assert.equal((await call("renew", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store)).status, 404);
});

test("ürün denetimi: SyncPass ucu APL kodunu, AreaPilot ucu SPD kodunu 404 wrong_product yapar; depo da ürünü süzer", async () => {
  const { store } = fakeStore([aplRow, spdRow]);
  for (const op of ["activate", "renew", "deactivate"] as const) {
    assert.deepEqual((await call(op, "syncpass_desktop", { key: aplRow.license_key, deviceId: DEV_A }, store)).body, { error: "wrong_product" }, op);
    assert.deepEqual((await call(op, "areapilot", { key: spdRow.license_key, deviceId: DEV_A }, store)).body, { error: "wrong_product" }, op);
  }
  // Ön eksiz 20 karakter başka üründe kayıtlıysa: depo ürüne göre süzdüğü için bulunmaz.
  const r = await call("activate", "syncpass_desktop", { key: "23456789ABCDEFGHJKMN", deviceId: DEV_A }, store);
  assert.equal(r.status, 200, "SPD ön eksiz yazım SyncPass'te eskisi gibi çalışır");
  assert.deepEqual((await call("activate", "areapilot", { key: "23456789ABCDEFGHJKMN", deviceId: DEV_A }, fakeStore([spdRow]).store)).body, { error: "invalid_key" });
});

test("hatalar: bozuk gövde/kod/cihaz 400, bilinmeyen kod 404, iade 403 (+status), anahtar yok 503, depo hatası 500", async () => {
  const { store } = fakeStore([aplRow, row({ id: "r", license_key: "APL-22222-22222-22222-22222", status: "refunded" })]);
  for (const bad of [null, "x", [], {}, { key: aplRow.license_key }, { key: aplRow.license_key, deviceId: "not-a-uuid" }, { key: "APL-1", deviceId: DEV_A }]) {
    assert.deepEqual((await call("activate", "areapilot", bad, store)).body, { error: "bad_request" });
  }
  assert.deepEqual((await call("activate", "areapilot", { key: "APL-33333-33333-33333-33333", deviceId: DEV_A }, store)).body, { error: "invalid_key" });
  const refunded = await call("activate", "areapilot", { key: "APL-22222-22222-22222-22222", deviceId: DEV_A }, store);
  assert.equal(refunded.status, 403);
  assert.deepEqual(refunded.body, { error: "inactive", status: "refunded" });
  assert.equal((await call("renew", "areapilot", { key: "APL-22222-22222-22222-22222", deviceId: DEV_A }, store)).status, 403);

  const noKey = await handleLicenseRequest("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store, { env: {}, now: NOW });
  assert.deepEqual(noKey, { status: 503, body: { error: "not_configured" } });
  const failing = fakeStore([aplRow], { failUpsert: true });
  assert.deepEqual((await call("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, failing.store)).body, { error: "server_error" });
});

// ---- fiyat kimliği tablosu ----

test("fiyat tablosu: SyncPass'in üç fiyatı eskisi gibi, 3 cihaz, ürün syncpass_desktop", () => {
  assert.deepEqual(priceInfo("pri_01m41q184hngxx8aqz3v0bt2wp"), { product: "syncpass_desktop", plan: "month", maxDevices: 3 });
  assert.deepEqual(priceInfo("pri_01m41q27m1hgdzxabaz96v07pf"), { product: "syncpass_desktop", plan: "year", maxDevices: 3 });
  assert.deepEqual(priceInfo("pri_01m41q4dg3816kmsk2sd76npdy"), { product: "syncpass_desktop", plan: "lifetime", maxDevices: 3 });
  assert.equal(Object.keys(PADDLE_PRICE_PLANS).length, 3, "AreaPilot fiyat kimlikleri panelde açılana kadar eşleme boş");
});

test("fiyat tablosu: AreaPilot Bireysel 1 / Ofis 5 / Firma 20, hepsi tek seferlik; bilinmeyen null", () => {
  const catalog = buildPriceCatalog({ individual: "pri_x1", office: "pri_x5", firm: "pri_x20" });
  assert.deepEqual(priceInfo("pri_x1", catalog), { product: "areapilot", plan: "lifetime", maxDevices: 1 });
  assert.deepEqual(priceInfo("pri_x5", catalog), { product: "areapilot", plan: "lifetime", maxDevices: 5 });
  assert.deepEqual(priceInfo("pri_x20", catalog), { product: "areapilot", plan: "lifetime", maxDevices: 20 });
  assert.equal(priceInfo("pri_yok", catalog), null);
  assert.equal(priceInfo("__proto__", catalog), null);
  assert.equal(priceInfo("constructor", catalog), null);
  assert.equal(priceInfo(undefined, catalog), null);
  assert.equal(priceInfo(42, catalog), null);
  assert.throws(() => buildPriceCatalog({ individual: "pri_01m41q184hngxx8aqz3v0bt2wp", office: null, firm: null }), /iki kez/);
});

// ---- satış bayrağı ----

test("satış bayrağı: AreaPilot yalnız PADDLE_SALES_OPEN_AREAPILOT=1 ile açılır, SyncPass bayrağından bağımsız", () => {
  assert.equal(salesOpenFor("areapilot", {}), false);
  assert.equal(salesOpenFor("areapilot", { PADDLE_SALES_OPEN: "1" }), false);
  assert.equal(salesOpenFor("areapilot", { PADDLE_SALES_OPEN_AREAPILOT: "true" }), false);
  assert.equal(salesOpenFor("areapilot", { PADDLE_SALES_OPEN_AREAPILOT: "1" }), true);
  assert.equal(salesOpenFor("syncpass_desktop", { PADDLE_SALES_OPEN_AREAPILOT: "1" }), false);
  assert.equal(salesOpenFor("syncpass_desktop", { PADDLE_SALES_OPEN: "1" }), true);
});

// ---- e-posta sözcükleri ----

test("e-posta sözcükleri: ürün adı ve cihaz sayısı lisanstan; SyncPass metni eskisiyle aynı", () => {
  const a = licenseMailCopy("areapilot", "tr", 5);
  assert.equal(a.productName, "AreaPilot");
  assert.match(a.devices, /5 bilgisayar/);
  assert.match(a.planLine("lifetime"), /Tek ödeme/);
  assert.match(licenseMailCopy("areapilot", "en", 1).devices, /1 computer\./);
  assert.match(licenseMailCopy("areapilot", "en", 20).subject, /AreaPilot/);
  const s = licenseMailCopy("syncpass_desktop", "tr", 3);
  assert.equal(s.subject, "SyncPass Masaüstü Premium lisans kodunuz");
  assert.equal(s.planLine("lifetime"), "Plan: SyncPass Masaüstü Premium, ömür boyu. Tek ödeme, yenileme yok.");
  assert.equal(s.devices, "Aynı kodu en fazla 3 bilgisayarda kullanabilirsiniz.");
  assert.doesNotMatch(JSON.stringify([a, licenseMailCopy("areapilot", "en", 5)]), /SyncPass/);
});
