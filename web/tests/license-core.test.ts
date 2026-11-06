// Lisans çekirdeği: kod biçimi, hak süresi, belge imzası (SyncPass Ed25519 / AreaPilot ECDSA P-256), uç nokta mantığı,
// fiyat kimliği tablosu, satış bayrağı, e-posta sözcükleri. Çalıştırma: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, createPublicKey, verify } from "node:crypto";
import {
  areapilotPublicKey,
  confirmDeviceReset,
  DEACTIVATE_WINDOW_DAYS,
  hashResetToken,
  KNOWN_TEST_PUBLIC_KEYS,
  parseResetRequest,
  processDeviceReset,
  PRODUCTS,
  RESET_LIMIT,
  RESET_WINDOW_DAYS,
  type ResetMailer,
  RESET_REQUEST_RESPONSE,
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
import { areapilotPricesReady, buildPriceCatalog, PADDLE_PRICE_PLANS, priceInfo } from "../src/lib/paddle-tiers.ts";
import { salesOpenFor } from "../src/lib/paddle-env.ts";
import { licenseMailCopy, newKeyMailCopy, resetMailCopy } from "../src/lib/license-mail-copy.ts";

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

interface FakeOpts {
  failAt?: "find" | "register" | "touch" | "remove";
}

function fakeStore(rows: LicenseRow[], opts: FakeOpts = {}) {
  const devices = new Map<string, Set<string>>();
  const removals = new Map<string, number[]>();
  const resets = new Map<string, number[]>();
  const resetTokens = new Map<string, { licenseId: string; expires: number; created: number; used: boolean; lang: "tr" | "en" }>();
  const store: LicenseStore = {
    async findLicense(key: string, product: Product) {
      if (opts.failAt === "find") throw new Error("db");
      return rows.find((r) => r.license_key === key && r.product === product) ?? null;
    },
    async registerDevice(id, dev) {
      if (opts.failAt === "register") throw new Error("db");
      const set = devices.get(id) ?? new Set<string>();
      devices.set(id, set);
      if (set.has(dev)) return "ok";
      const max = rows.find((r) => r.id === id)!.max_devices;
      // Gerçek depoda kontrol+ekleme tek kilitli işlemdir (sp_register_device); sınırın aşılmaması bu sözleşmeye dayanır.
      if (set.size >= max) return "limit";
      set.add(dev);
      return "ok";
    },
    async touchDevice(id, dev) {
      if (opts.failAt === "touch") throw new Error("db");
      return devices.get(id)?.has(dev) ?? false;
    },
    async removeDevice(id, dev, nowIso, limit) {
      if (opts.failAt === "remove") throw new Error("db");
      if (!devices.get(id)?.has(dev)) return "ok";
      const now = Date.parse(nowIso);
      if (limit !== null) {
        const recent = (removals.get(id) ?? []).filter((t) => t > now - DEACTIVATE_WINDOW_DAYS * DAY);
        if (recent.length >= limit) return "limit";
        removals.set(id, [...recent, now]);
      }
      devices.get(id)!.delete(dev);
      return "ok";
    },
    async createResetToken(id, hash, expiresIso, nowIso, minIntervalMs, lang) {
      const now = Date.parse(nowIso);
      for (const t of resetTokens.values()) if (t.licenseId === id && t.created > now - minIntervalMs) return false;
      if ((resets.get(id) ?? []).filter((t) => t > now - RESET_WINDOW_DAYS * DAY).length >= RESET_LIMIT) return false;
      resetTokens.set(hash, { licenseId: id, expires: Date.parse(expiresIso), created: now, used: false, lang });
      return true;
    },
    async deleteResetToken(hash) {
      resetTokens.delete(hash);
    },
    async consumeResetToken(hash, nowIso, newKey) {
      const t = resetTokens.get(hash);
      const now = Date.parse(nowIso);
      if (!t || t.used || t.expires <= now) return { result: "invalid" };
      t.used = true;
      const recent = (resets.get(t.licenseId) ?? []).filter((x) => x > now - RESET_WINDOW_DAYS * DAY);
      if (recent.length >= RESET_LIMIT) return { result: "limit" };
      resets.set(t.licenseId, [...recent, now]);
      const lic = rows.find((r) => r.id === t.licenseId)!;
      lic.license_key = newKey; // eski kod artık bulunamaz
      devices.set(t.licenseId, new Set());
      return { result: "ok", email: lic.email ?? null, lang: t.lang };
    },
  };
  return { store, devices, resetTokens, resets };
}

const aplRow = row({ license_key: "APL-23456-789AB-CDEFG-HJKMN", max_devices: 1 });
const spdRow = row({ id: "99999999-2222-4333-8444-555555555555", license_key: "SPD-23456-789AB-CDEFG-HJKMN", product: "syncpass_desktop", max_devices: 3 });
const call = (op: "activate" | "renew" | "deactivate", product: Product, body: unknown, store: LicenseStore, now = NOW) =>
  handleLicenseRequest(op, product, body, store, { env: ENV, now });

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

test("eşzamanlı 10 etkinleştirme sınırı aşmaz (çekirdek atomik registerDevice kullanır)", async () => {
  const five = row({ license_key: "APL-55555-55555-55555-55555", id: "55555555-2222-4333-8444-555555555555", max_devices: 5 });
  const { store, devices } = fakeStore([five]);
  const ids = Array.from({ length: 10 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
  const results = await Promise.all(ids.map((deviceId) => call("activate", "areapilot", { key: five.license_key, deviceId }, store)));
  assert.equal(results.filter((r) => r.status === 200).length, 5);
  assert.equal(results.filter((r) => r.status === 409).length, 5);
  assert.equal(devices.get(five.id)?.size, 5);
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

test("kaldırma sınırı: lisans başına 30 günde 3, aşılınca 429 deactivate_limit ve hiçbir şey silinmez; pencere geçince yeniden açılır", async () => {
  const five = row({ license_key: "APL-55555-55555-55555-55555", id: "55555555-2222-4333-8444-555555555555", max_devices: 5 });
  const { store, devices } = fakeStore([five]);
  const ids = [0, 1, 2, 3].map((i) => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
  for (const deviceId of ids) await call("activate", "areapilot", { key: five.license_key, deviceId }, store);
  for (const deviceId of ids.slice(0, 3)) assert.deepEqual((await call("deactivate", "areapilot", { key: five.license_key, deviceId }, store)).body, { ok: true });
  const blocked = await call("deactivate", "areapilot", { key: five.license_key, deviceId: ids[3] }, store);
  assert.equal(blocked.status, 429);
  assert.deepEqual(blocked.body, { error: "deactivate_limit", limit: 3, windowDays: 30 });
  assert.equal(devices.get(five.id)?.has(ids[3]), true, "sınır aşılınca cihaz silinmedi");
  // Kayıtsız cihazı kaldırmak sayılmaz ve sınırda da hata vermez.
  assert.equal((await call("deactivate", "areapilot", { key: five.license_key, deviceId: DEV_B }, store)).status, 200);
  const later = await call("deactivate", "areapilot", { key: five.license_key, deviceId: ids[3] }, store, NOW + 31 * DAY);
  assert.equal(later.status, 200);
});

test("ürün denetimi: SyncPass ucu APL kodunu, AreaPilot ucu SPD kodunu 404 wrong_product yapar; depo da ürünü süzer", async () => {
  const { store } = fakeStore([aplRow, spdRow]);
  for (const op of ["activate", "renew", "deactivate"] as const) {
    assert.deepEqual((await call(op, "syncpass_desktop", { key: aplRow.license_key, deviceId: DEV_A }, store)).body, { error: "wrong_product" }, op);
    assert.deepEqual((await call(op, "areapilot", { key: spdRow.license_key, deviceId: DEV_A }, store)).body, { error: "wrong_product" }, op);
  }
  const r = await call("activate", "syncpass_desktop", { key: "23456789ABCDEFGHJKMN", deviceId: DEV_A }, store);
  assert.equal(r.status, 200, "SPD ön eksiz yazım SyncPass'te eskisi gibi çalışır");
  assert.deepEqual((await call("activate", "areapilot", { key: "23456789ABCDEFGHJKMN", deviceId: DEV_A }, fakeStore([spdRow]).store)).body, { error: "invalid_key" });
});

test("hatalar: bozuk gövde/kod/cihaz 400, bilinmeyen kod 404, iade 403 (+status), anahtar yok 503", async () => {
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
});

test("depo hata verir: her işlemde 500 server_error; ASLA 404 invalid_key / 200 ok değil", async () => {
  const cases: Array<[NonNullable<FakeOpts["failAt"]>, "activate" | "renew" | "deactivate"]> = [
    ["find", "activate"],
    ["find", "renew"],
    ["find", "deactivate"],
    ["register", "activate"],
    ["touch", "renew"],
    ["remove", "deactivate"],
  ];
  for (const [failAt, op] of cases) {
    const { store } = fakeStore([aplRow], { failAt });
    // Kayıt var; depo hatası "kayıt yok" gibi görünmemeli.
    const r = await call(op, "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, store);
    assert.deepEqual(r, { status: 500, body: { error: "server_error" } }, `${failAt}/${op}`);
  }
});

test("üretimde sözleşmedeki TEST anahtarı reddedilir; üretim dışında çalışır; kendi anahtarın üretimde çalışır", () => {
  assert.equal(KNOWN_TEST_PUBLIC_KEYS.size, 1, "sözleşmedeki sahte genel anahtar listede");
  assert.ok([...KNOWN_TEST_PUBLIC_KEYS][0].startsWith("MFkwEwYHKoZIzj0CAQYI"));
  const fake = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const fakePriv = fake.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64");
  KNOWN_TEST_PUBLIC_KEYS.add(fake.publicKey.export({ format: "der", type: "spki" }).toString("base64"));
  const input = { lid: "L", plan: "lifetime" as const, dev: DEV_A, exp: NOW + DAY };
  assert.throws(() => signLicenseToken("areapilot", input, { env: { LICENSE_SIGNING_KEY_AREAPILOT: fakePriv, NODE_ENV: "production" } }), SigningNotConfigured);
  assert.ok(signLicenseToken("areapilot", input, { env: { LICENSE_SIGNING_KEY_AREAPILOT: fakePriv, NODE_ENV: "test" } }));
  assert.ok(signLicenseToken("areapilot", input, { env: { LICENSE_SIGNING_KEY_AREAPILOT: ecPriv, NODE_ENV: "production" } }));
  KNOWN_TEST_PUBLIC_KEYS.delete(fake.publicKey.export({ format: "der", type: "spki" }).toString("base64"));
});

test("üretimde test anahtarıyla etkinleştirme 503 not_configured döner", async () => {
  const fake = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  KNOWN_TEST_PUBLIC_KEYS.add(fake.publicKey.export({ format: "der", type: "spki" }).toString("base64"));
  const env = { LICENSE_SIGNING_KEY_AREAPILOT: fake.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64"), NODE_ENV: "production" };
  const r = await handleLicenseRequest("activate", "areapilot", { key: aplRow.license_key, deviceId: DEV_A }, fakeStore([aplRow]).store, { env, now: NOW });
  assert.deepEqual(r, { status: 503, body: { error: "not_configured" } });
  KNOWN_TEST_PUBLIC_KEYS.delete(fake.publicKey.export({ format: "der", type: "spki" }).toString("base64"));
});

// ---- kod üretimi (reddetmeli örnekleme) ----

test("kod üretimi: harfler eşit dağılır (modulo yanlılığı yok)", () => {
  const counts = new Map<string, number>();
  for (let i = 0; i < 20000; i++) for (const c of newLicenseKey("areapilot").replace(/-/g, "").slice(3)) counts.set(c, (counts.get(c) ?? 0) + 1);
  assert.equal(counts.size, 30);
  const values = [...counts.values()];
  // Modulo yanlılığında ilk 16 harf ~%12,5 sık çıkardı (max/min ≈ 1,12); örnekleme gürültüsü ~%2.
  assert.ok(Math.max(...values) / Math.min(...values) < 1.06, `dağılım dengesiz: ${Math.max(...values) / Math.min(...values)}`);
});

// ---- e-postayla cihaz sıfırlama ----

function mailbox(opts: { configured?: boolean; failLink?: boolean; failKey?: boolean } = {}) {
  const sent: Array<{ to: string; token: string; lang: string }> = [];
  const keys: Array<{ to: string; key: string; lang: string }> = [];
  const mailer: ResetMailer = {
    configured: () => opts.configured !== false,
    async sendLink(to, token, lang) {
      if (opts.failLink) throw new Error("smtp");
      sent.push({ to, token, lang });
    },
    async sendNewKey(to, key, lang) {
      if (opts.failKey) throw new Error("smtp");
      keys.push({ to, key, lang });
    },
  };
  return { sent, keys, mailer };
}
const mailed = () => row({ id: "77777777-2222-4333-8444-555555555555", license_key: "APL-77777-77777-77777-77777", max_devices: 5, email: "musteri@example.com" });

test("sıfırlama isteği: biçim hatası 400/404, geçerli biçim HER ZAMAN aynı 200 yanıtı", () => {
  assert.equal(parseResetRequest(null, "areapilot").ok, false);
  assert.deepEqual((parseResetRequest({ key: "SPD-23456-789AB-CDEFG-HJKMN" }, "areapilot") as { result: unknown }).result, { status: 404, body: { error: "wrong_product" } });
  const p = parseResetRequest({ key: " apl-77777-77777-77777-77777 ", lang: "en" }, "areapilot");
  assert.ok(p.ok && p.key === "APL-77777-77777-77777-77777" && p.lang === "en");
  assert.deepEqual(RESET_REQUEST_RESPONSE, { status: 200, body: { ok: true } });
});

test("sıfırlama: bağlantı kayıtlı e-postaya gider, veritabanına yalnız özet yazılır; onayda kod YENİLENİR, cihazlar silinir, eski kod geçersiz", async () => {
  const lic = mailed();
  const { store, devices, resetTokens } = fakeStore([lic]);
  const oldKey = lic.license_key;
  await call("activate", "areapilot", { key: oldKey, deviceId: DEV_A }, store);
  await call("activate", "areapilot", { key: oldKey, deviceId: DEV_B }, store);
  const box = mailbox();
  assert.equal(await processDeviceReset("areapilot", oldKey, "tr", store, box.mailer, { now: NOW }), "sent");
  assert.equal(box.sent.length, 1);
  assert.equal(box.sent[0].to, "musteri@example.com");
  const token = box.sent[0].token;
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  assert.ok(!resetTokens.has(token), "düz belirteç saklanmaz");
  assert.ok(resetTokens.has(hashResetToken(token)), "SHA-256 özeti saklanır");
  assert.equal(resetTokens.get(hashResetToken(token))!.expires, NOW + 30 * 60 * 1000);
  assert.equal(devices.get(lic.id)?.size, 2);

  const ok = await confirmDeviceReset(token, "areapilot", store, box.mailer, { now: NOW + 60_000 });
  assert.equal(ok.status, 200);
  const newKey = String(ok.body.key);
  assert.match(newKey, /^APL-[2-9A-HJKMNP-TV-Z]{5}(-[2-9A-HJKMNP-TV-Z]{5}){3}$/);
  assert.notEqual(newKey, oldKey);
  assert.equal(devices.get(lic.id)?.size, 0, "cihazlar temizlendi");
  assert.deepEqual(box.keys, [{ to: "musteri@example.com", key: newKey, lang: "tr" }], "yeni kod e-postayla da gitti");
  assert.equal((await confirmDeviceReset(token, "areapilot", store, box.mailer, { now: NOW + 61_000 })).status, 410, "ikinci kullanım reddedilir");

  // Eski kod artık hiçbir uçta çalışmaz; yeni kod çalışır.
  for (const op of ["activate", "renew", "deactivate"] as const) {
    assert.deepEqual((await call(op, "areapilot", { key: oldKey, deviceId: DEV_B }, store)).body, { error: "invalid_key" }, op);
  }
  assert.equal((await call("activate", "areapilot", { key: newKey, deviceId: DEV_B }, store)).status, 200);
});

test("sıfırlama: yeni kod e-postası gidemezse yanıtta kod yine görünür", async () => {
  const { store } = fakeStore([mailed()]);
  const box = mailbox({ failKey: true });
  await processDeviceReset("areapilot", "APL-77777-77777-77777-77777", "en", store, box.mailer, { now: NOW });
  const r = await confirmDeviceReset(box.sent[0].token, "areapilot", store, box.mailer, { now: NOW + 1000 });
  assert.equal(r.status, 200);
  assert.match(String(r.body.key), /^APL-/);
  assert.equal(box.keys.length, 0);
  assert.equal(box.sent[0].lang, "en");
});

test("sıfırlama: süresi dolan, bozuk ve bilinmeyen belirteç reddedilir", async () => {
  const { store } = fakeStore([mailed()]);
  const box = mailbox();
  await processDeviceReset("areapilot", "APL-77777-77777-77777-77777", "tr", store, box.mailer, { now: NOW });
  assert.equal((await confirmDeviceReset(box.sent[0].token, "areapilot", store, box.mailer, { now: NOW + 31 * 60 * 1000 })).status, 410);
  assert.equal((await confirmDeviceReset("kisa", "areapilot", store, box.mailer)).status, 400);
  assert.equal((await confirmDeviceReset(undefined, "areapilot", store, box.mailer)).status, 400);
  assert.equal((await confirmDeviceReset("A".repeat(43), "areapilot", store, box.mailer)).status, 410);
});

test("sıfırlama: saatte 1 e-posta; e-postasız ya da pasif lisansa e-posta gitmez (dışarıdan ayırt edilmez)", async () => {
  const { store } = fakeStore([mailed(), row({ id: "n", license_key: "APL-88888-88888-88888-88888", email: null }), row({ id: "r", license_key: "APL-22222-22222-22222-22222", status: "refunded", email: "x@example.com" })]);
  const box = mailbox();
  const go = (key: string, now: number) => processDeviceReset("areapilot", key, "tr", store, box.mailer, { now });
  assert.equal(await go("APL-77777-77777-77777-77777", NOW), "sent");
  assert.equal(await go("APL-77777-77777-77777-77777", NOW + 59 * 60 * 1000), "skipped");
  assert.equal(await go("APL-77777-77777-77777-77777", NOW + 61 * 60 * 1000), "sent");
  assert.equal(await go("APL-88888-88888-88888-88888", NOW), "skipped");
  assert.equal(await go("APL-22222-22222-22222-22222", NOW), "skipped");
  assert.equal(await go("APL-99999-99999-99999-99999", NOW), "skipped");
  assert.equal(box.sent.length, 2);
});

test("sıfırlama sınırı: 30 günde 2; üçüncüde token üretilmez (istek yine sessizce 200), onay sayfası 429 reset_limit; pencere geçince açılır", async () => {
  const lic = mailed();
  const { store } = fakeStore([lic]);
  const box = mailbox();
  const run = async (now: number) => {
    const n = box.sent.length;
    await processDeviceReset("areapilot", lic.license_key, "tr", store, box.mailer, { now });
    return box.sent.length > n ? await confirmDeviceReset(box.sent[box.sent.length - 1].token, "areapilot", store, box.mailer, { now: now + 1000 }) : null;
  };
  assert.equal((await run(NOW))?.status, 200);
  assert.equal((await run(NOW + 2 * 60 * 60 * 1000))?.status, 200);
  assert.equal(await run(NOW + 4 * 60 * 60 * 1000), null, "üçüncüde e-posta/belirteç yok");
  // Pencere dışına çıkınca yeniden açılır.
  assert.equal((await run(NOW + 31 * DAY))?.status, 200);
  // Onay anı da sınırı denetler: belirteç alındıktan sonra sayaç dolduysa (ör. başka bir yoldan) sıfırlama olmaz ve kod değişmez.
  const other = mailed();
  other.id = "88888888-2222-4333-8444-555555555555";
  other.license_key = "APL-66666-66666-66666-66666";
  const f = fakeStore([other]);
  const b2 = mailbox();
  await processDeviceReset("areapilot", other.license_key, "tr", f.store, b2.mailer, { now: NOW });
  f.resets.set(other.id, [NOW - 1000, NOW - 2000]);
  const blocked = await confirmDeviceReset(b2.sent[0].token, "areapilot", f.store, b2.mailer, { now: NOW + 1000 });
  assert.deepEqual(blocked, { status: 429, body: { error: "reset_limit", limit: 2, windowDays: 30 } });
  assert.equal(other.license_key, "APL-66666-66666-66666-66666", "kod değişmedi");
});

test("sıfırlama: e-posta ayarı yoksa belirteç üretilmez ve uyarı yazılır; gönderim başarısızsa belirteç silinir, saatlik hak harcanmaz", async () => {
  const lic = mailed();
  const { store, resetTokens } = fakeStore([lic]);
  const none = mailbox({ configured: false });
  assert.equal(await processDeviceReset("areapilot", lic.license_key, "tr", store, none.mailer, { now: NOW }), "skipped");
  assert.equal(resetTokens.size, 0, "ayar yokken belirteç üretilmedi");

  const failing = mailbox({ failLink: true });
  assert.equal(await processDeviceReset("areapilot", lic.license_key, "tr", store, failing.mailer, { now: NOW }), "skipped");
  assert.equal(resetTokens.size, 0, "gönderim başarısız: belirteç silindi");
  const ok = mailbox();
  assert.equal(await processDeviceReset("areapilot", lic.license_key, "tr", store, ok.mailer, { now: NOW + 1000 }), "sent", "saatlik hak harcanmadı");
});

test("sıfırlama: depo ya da e-posta hatası fırlatmaz; depo hatasında confirm 500", async () => {
  const failing = fakeStore([mailed()], { failAt: "find" });
  assert.equal(await processDeviceReset("areapilot", "APL-77777-77777-77777-77777", "tr", failing.store, mailbox().mailer, { now: NOW }), "skipped");
  const { store } = fakeStore([mailed()]);
  const broken: LicenseStore = { ...store, consumeResetToken: async () => { throw new Error("db"); } };
  assert.deepEqual(await confirmDeviceReset("A".repeat(43), "areapilot", broken, mailbox().mailer), { status: 500, body: { error: "server_error" } });
});

test("sıfırlama kaldırma sayacına yazılmaz: kaldırma sınırı dolsa bile e-posta yolu çalışır", async () => {
  const five = row({ license_key: "APL-55555-55555-55555-55555", id: "55555555-2222-4333-8444-555555555555", max_devices: 5, email: "a@example.com" });
  const { store, devices } = fakeStore([five]);
  const ids = [0, 1, 2, 3].map((i) => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
  for (const deviceId of ids) await call("activate", "areapilot", { key: five.license_key, deviceId }, store);
  for (const deviceId of ids.slice(0, 3)) await call("deactivate", "areapilot", { key: five.license_key, deviceId }, store);
  assert.equal((await call("deactivate", "areapilot", { key: five.license_key, deviceId: ids[3] }, store)).status, 429);
  const box = mailbox();
  await processDeviceReset("areapilot", five.license_key, "tr", store, box.mailer, { now: NOW });
  assert.equal((await confirmDeviceReset(box.sent[0].token, "areapilot", store, box.mailer, { now: NOW + 1000 })).status, 200);
  assert.equal(devices.get(five.id)?.size, 0);
});

test("SyncPass kaldırma sınırından MUAF: 3'ten fazla kaldırma 429 almaz; AreaPilot'ta alır", async () => {
  const spd = row({ id: "44444444-2222-4333-8444-555555555555", license_key: "SPD-44444-44444-44444-44444", product: "syncpass_desktop", max_devices: 9 });
  const { store } = fakeStore([spd]);
  const ids = Array.from({ length: 6 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
  for (const deviceId of ids) assert.equal((await call("activate", "syncpass_desktop", { key: spd.license_key, deviceId }, store)).status, 200);
  for (const deviceId of ids) assert.deepEqual((await call("deactivate", "syncpass_desktop", { key: spd.license_key, deviceId }, store)).body, { ok: true });
  assert.equal(PRODUCTS.syncpass_desktop.deactivateLimited, false);
  assert.equal(PRODUCTS.areapilot.deactivateLimited, true);
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

test("satış bayrağı: AreaPilot yalnız bayrak=1 VE fiyat kimlikleri tanımlıyken açılır; SyncPass bayrağından bağımsız", () => {
  const on = { PADDLE_SALES_OPEN_AREAPILOT: "1" };
  assert.equal(salesOpenFor("areapilot", { env: {}, areapilotPricesReady: true }), false);
  assert.equal(salesOpenFor("areapilot", { env: { PADDLE_SALES_OPEN: "1" }, areapilotPricesReady: true }), false);
  assert.equal(salesOpenFor("areapilot", { env: { PADDLE_SALES_OPEN_AREAPILOT: "true" }, areapilotPricesReady: true }), false);
  assert.equal(salesOpenFor("areapilot", { env: on, areapilotPricesReady: true }), true);
  // Fiyat kimlikleri yokken (ya da bilgi verilmediyse) bayrak açık olsa bile KAPALI: müşteri öder ama webhook lisans üretmezdi.
  assert.equal(salesOpenFor("areapilot", { env: on, areapilotPricesReady: false }), false);
  assert.equal(salesOpenFor("areapilot", { env: on }), false);
  assert.equal(salesOpenFor("syncpass_desktop", { env: on }), false);
  assert.equal(salesOpenFor("syncpass_desktop", { env: { PADDLE_SALES_OPEN: "1" } }), true);
});

test("areapilotPricesReady: üç katman da tanımlıysa true; bugünkü gerçek eşlemede false", () => {
  assert.equal(areapilotPricesReady(), false, "AreaPilot fiyat kimlikleri panelde açılana kadar satış kapalı kalır");
  assert.equal(areapilotPricesReady(buildPriceCatalog({ individual: "a", office: "b", firm: null })), false);
  assert.equal(areapilotPricesReady(buildPriceCatalog({ individual: "a", office: "b", firm: "c" })), true);
});

// ---- e-posta sözcükleri ----

test("e-posta sözcükleri: ürün adı ve cihaz sayısı lisanstan; AreaPilot'ta sen hitabı, license, 90 gün ve Kaldır satırları", () => {
  const a = licenseMailCopy("areapilot", "tr", 5);
  assert.equal(a.productName, "AreaPilot");
  assert.match(a.devices, /5 bilgisayar/);
  assert.match(a.planLine("lifetime"), /Tek ödeme/);
  assert.ok(a.notes.some((n) => n.includes("90 günde bir internete bağlanman yeterli")));
  assert.ok(a.notes.some((n) => n.includes("bilgisayar değiştirirken") || n.includes("Bilgisayar değiştirirken")) && a.notes.join(" ").includes("Lisans penceresinden Kaldır"));
  const en = licenseMailCopy("areapilot", "en", 1);
  assert.match(en.devices, /1 computer\./);
  assert.match(en.subject, /AreaPilot license key/);
  assert.doesNotMatch(JSON.stringify(en), /[Ll]icence/);
  assert.doesNotMatch(JSON.stringify(a), /SyncPass/);
  assert.doesNotMatch(JSON.stringify(licenseMailCopy("areapilot", "en", 5)), /SyncPass/);
  // "siz" hitabı yok (yasal metin değil): kodunuz, açın, kullanabilirsiniz...
  for (const p of ["areapilot", "syncpass_desktop"] as const) {
    const t = JSON.stringify([licenseMailCopy(p, "tr", 3), resetMailCopy("tr", "https://x")]);
    assert.doesNotMatch(t, /nuz|nız|abilirsiniz|\baçın\b|\bgidin\b|\bbasın\b/, p);
  }
  const s = licenseMailCopy("syncpass_desktop", "tr", 3);
  assert.equal(s.subject, "SyncPass Masaüstü Premium lisans kodun");
  assert.equal(s.planLine("lifetime"), "Plan: SyncPass Masaüstü Premium, ömür boyu. Tek ödeme, yenileme yok.");
  assert.equal(s.devices, "Aynı kodu en fazla 3 bilgisayarda kullanabilirsin.");
});

test("sıfırlama e-postası: bağlantı gövdede, 30 dakika uyarısı, iki dilde", () => {
  for (const lang of ["tr", "en"] as const) {
    const m = resetMailCopy(lang, "https://ostlertech.com/api/areapilot/license/reset?token=ABC");
    assert.ok(m.text.includes("https://ostlertech.com/api/areapilot/license/reset?token=ABC"));
    assert.match(m.text, /30/);
    assert.doesNotMatch(m.text, /SyncPass|[Ll]icence/);
  }
});

test("yeni kod e-postası: kodu içerir, eski kodun çalışmadığını söyler, iki dilde", () => {
  for (const lang of ["tr", "en"] as const) {
    const m = newKeyMailCopy(lang, "APL-23456-789AB-CDEFG-HJKMN");
    assert.ok(m.text.includes("APL-23456-789AB-CDEFG-HJKMN"));
    assert.match(m.subject, /AreaPilot/);
    assert.doesNotMatch(m.text, /SyncPass|[Ll]icence/);
  }
});
