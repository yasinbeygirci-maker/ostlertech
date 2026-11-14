// Play lisans çekirdeği (lib/play-core.ts) birim testleri. Çalıştırma: npm test
// Burak ön kapısı Ş1-Ş10, Ş12, Ş15, Ş24 (2026-11-14-syncpass-tek-lisans-sunucu-on-kapi.md §8). Google ve veritabanı SAHTE (gerçek Google çağrısı yok).
// SQL katmanı (Ş7, Ş10, Ş11, Ş18) ayrı: tests/play-sql.test.ts (PGlite).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generateKeyPairSync, verify as cryptoVerify } from "node:crypto";
import {
  appVersionAtLeast,
  entitlementUntil,
  handleLicenseRequest,
  signLicenseToken,
  signingKeyEnvName,
  SYNCPASS_KEY_V2_ENV,
  SYNCPASS_KEY_V2_MIN_APP_VERSION,
  type LicenseRow,
  type LicenseStore,
} from "../src/lib/license-core.ts";
import { PLAY_PACKAGE_NAME, PLAY_PRODUCTS } from "../src/lib/play-catalog.ts";
import {
  PlayApiError,
  PLAY_STALE_MS,
  PLAY_TEST_GRANT_MS,
  VOIDED_WINDOW_MS,
  classifyStatus,
  createHttpVerifier,
  cronAuthorized,
  handlePlayClaim,
  hashToken,
  mapProduct,
  mapSubscription,
  parseClaimBody,
  probePlayApi,
  refreshPlayLicense,
  sweepVoidedPurchases,
  type ClaimParams,
  type ClaimResult,
  type FetchLike,
  type GoogleProductPurchase,
  type GoogleSubscription,
  type PlayDeps,
  type PlayLicenseRow,
  type PlayStore,
  type PlayVerifier,
  type StatePatch,
  type VoidedMark,
} from "../src/lib/play-core.ts";

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;
const TOKEN = "AbCdEf_-0123456789.tokenSECRETvalue.xyz";
const TOKEN2 = "second_token_ABC.123456789";
const OLD_TOKEN = "old_token_0000.987654321";
const iso = (ms: number) => new Date(ms).toISOString();

// ---- sahteler ----

function sub(state: string, productId = "premium_monthly", expiryMs = NOW + 10 * DAY, extra: Partial<GoogleSubscription> = {}): GoogleSubscription {
  return { subscriptionState: state, lineItems: [{ productId, expiryTime: iso(expiryMs) }], ...extra };
}

class FakeVerifier implements PlayVerifier {
  calls: string[] = [];
  subscription: GoogleSubscription | PlayApiError = sub("SUBSCRIPTION_STATE_ACTIVE");
  product: GoogleProductPurchase | PlayApiError = { purchaseState: 0, purchaseType: 1, productId: "premium_lifetime" };
  voided: { pages: string[][] } = { pages: [[]] };
  async getSubscription(token: string) {
    this.calls.push(`subs:${token}`);
    if (this.subscription instanceof PlayApiError) throw this.subscription;
    return this.subscription;
  }
  async getProduct(productId: string, token: string) {
    this.calls.push(`inapp:${productId}:${token}`);
    if (this.product instanceof PlayApiError) throw this.product;
    return this.product;
  }
  async listVoided(_start: number, page?: string) {
    this.calls.push(`voided:${page ?? ""}`);
    const i = page ? Number(page) : 0;
    return { tokens: this.voided.pages[i] ?? [], nextPageToken: i + 1 < this.voided.pages.length ? String(i + 1) : undefined };
  }
}

/** Depo davranışını (sp_claim_play_license) yalın biçimde taklit eder; SQL'in kendisi PGlite testinde sınanır. */
class FakeStore implements PlayStore {
  licenses = new Map<string, PlayLicenseRow>();
  tokens = new Map<string, { licenseId: string; superseded: boolean }>();
  claims: ClaimParams[] = [];
  updates: { id: string; patch: StatePatch }[] = [];
  delayMs = 0;
  failWith: Error | null = null;
  private n = 0;
  async findByTokenHash(hash: string) {
    if (this.failWith) throw this.failWith;
    const t = this.tokens.get(hash);
    if (!t) return null;
    return { license: this.licenses.get(t.licenseId)!, superseded: t.superseded };
  }
  async claim(p: ClaimParams): Promise<ClaimResult> {
    if (this.failWith) throw this.failWith;
    this.claims.push(p);
    if (this.delayMs) await new Promise((r) => setTimeout(r, this.delayMs));
    // atomik bölüm: await yok
    const known = this.tokens.get(p.tokenHash);
    if (known) {
      const lic = this.licenses.get(known.licenseId)!;
      if (!known.superseded) {
        Object.assign(lic, { status: p.status, current_period_end: p.periodEnd, plan: p.plan, play_state: p.playState, play_checked_at: p.nowIso });
      }
      return { result: "ok", license: lic, created: false, chained: false, merged: false, superseded: known.superseded };
    }
    const linked = p.linkedHash ? this.tokens.get(p.linkedHash) : undefined;
    if (linked) {
      linked.superseded = true;
      this.tokens.set(p.tokenHash, { licenseId: linked.licenseId, superseded: false });
      const lic = this.licenses.get(linked.licenseId)!;
      Object.assign(lic, { status: p.status, current_period_end: p.periodEnd, plan: p.plan, play_product_id: p.productId, play_purchase_token: p.token, play_checked_at: p.nowIso });
      return { result: "ok", license: lic, created: false, chained: true, merged: false, superseded: false };
    }
    if (!p.allowCreate) return { result: "none" };
    const id = `lic-${++this.n}`;
    const lic: PlayLicenseRow = {
      id, license_key: p.newKey, product: "syncpass_desktop", plan: p.plan, status: p.status, current_period_end: p.periodEnd, max_devices: p.maxDevices,
      email: null, source: p.source, play_purchase_token: p.token, play_product_id: p.productId, play_state: p.playState, play_checked_at: p.nowIso,
    };
    this.licenses.set(id, lic);
    this.tokens.set(p.tokenHash, { licenseId: id, superseded: false });
    return { result: "ok", license: lic, created: true, chained: false, merged: false, superseded: false };
  }
  async updateState(id: string, patch: StatePatch, nowIso: string) {
    if (this.failWith) throw this.failWith;
    this.updates.push({ id, patch });
    Object.assign(this.licenses.get(id)!, patch, { play_checked_at: nowIso });
  }
  expired = 0;
  async expireStale(): Promise<number> {
    return this.expired;
  }
  async markVoided(hash: string): Promise<VoidedMark> {
    const t = this.tokens.get(hash);
    if (!t) return "unknown";
    if (t.superseded) return "superseded";
    const lic = this.licenses.get(t.licenseId)!;
    if (lic.status === "refunded") return "already";
    lic.status = "refunded";
    return "marked";
  }
}

interface Harness {
  v: FakeVerifier;
  s: FakeStore;
  logs: unknown[][];
  deps: PlayDeps;
}
function harness(over: Partial<PlayDeps> = {}, now = NOW): Harness {
  const v = new FakeVerifier();
  const s = new FakeStore();
  const logs: unknown[][] = [];
  let k = 0;
  const log = { error: (...a: unknown[]) => void logs.push(a), warn: (...a: unknown[]) => void logs.push(a) };
  return { v, s, logs, deps: { verifier: v, store: s, log, now: () => now, newKey: () => `SPD-23456-789AB-CDEFG-HJKM${"ABCDEFGHJKMNPQRSTVWXYZ"[k++]}`, ...over } };
}
const body = (over: Record<string, unknown> = {}) => ({ purchaseToken: TOKEN, productId: "premium_monthly", kind: "subs", appVersion: "4.5.26", ...over });

// ---- katalog ----

test("katalog: yalnız aylık/yıllık/ömür boyu, hepsi 3 cihaz; 2 yıllık plan YOK", () => {
  assert.deepEqual(Object.keys(PLAY_PRODUCTS).sort(), ["premium_lifetime", "premium_monthly", "premium_yearly"]);
  assert.deepEqual(Object.values(PLAY_PRODUCTS).map((p) => p.maxDevices), [3, 3, 3]);
  assert.deepEqual(Object.values(PLAY_PRODUCTS).map((p) => p.plan).sort(), ["lifetime", "month", "year"]);
  assert.equal(PLAY_PRODUCTS.premium_lifetime.kind, "inapp");
  assert.equal(PLAY_PRODUCTS.premium_yearly.kind, "subs");
});

// ---- Ş2 biçim denetimi: Google'a hiç gidilmez ----

test("Ş2: biçim hatalarında 400 ve Google'a 0 çağrı", async () => {
  const bad: unknown[] = [
    null,
    "x",
    [],
    body({ purchaseToken: "" }),
    body({ purchaseToken: "a/b" }),
    body({ purchaseToken: "a b" }),
    body({ purchaseToken: "a\nb" }),
    body({ purchaseToken: "x".repeat(1025) }),
    body({ purchaseToken: 12345 }),
    body({ productId: "premium_2years" }),
    body({ productId: "__proto__" }),
    body({ productId: undefined }),
    body({ kind: "inapp" }), // premium_monthly abonelik
    body({ kind: "subs", productId: "premium_lifetime" }), // tür tutarsız
    body({ kind: "weird" }),
  ];
  for (const b of bad) {
    const h = harness();
    const r = await handlePlayClaim(b, h.deps);
    assert.equal(r.status, 400, JSON.stringify(b)?.slice(0, 60));
    assert.deepEqual(r.body, { error: "bad_request" });
    assert.deepEqual(h.v.calls, []);
    assert.equal(h.s.claims.length, 0);
  }
});

test("Ş2: Google yanıtında yabancı abonelik ürünü ya da yabancı tek seferlik ürün hak vermez; satır açılmaz", async () => {
  let h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "baska_urun");
  let r = await handlePlayClaim(body(), h.deps);
  assert.equal(r.status, 404);
  assert.deepEqual(r.body, { error: "invalid_purchase" });
  assert.equal(h.s.licenses.size, 0);
  // abonelik yanıtında ömür boyu (inapp) ürün kimliği de abonelik sayılmaz
  h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_lifetime");
  r = await handlePlayClaim(body(), h.deps);
  assert.equal(r.status, 404);
  // inapp: Google'ın döndürdüğü productId istenenle uyuşmuyor
  h = harness();
  h.v.product = { purchaseState: 0, purchaseType: 1, productId: "premium_monthly" };
  r = await handlePlayClaim(body({ productId: "premium_lifetime", kind: "inapp" }), h.deps);
  assert.equal(r.status, 404);
  assert.equal(h.s.licenses.size, 0);
});

test("Ş2: istemcinin plan/maxDevices/source alanları yok sayılır; plan Google'ın ürününden gelir", async () => {
  const h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_yearly");
  const r = await handlePlayClaim(body({ productId: "premium_monthly", plan: "lifetime", maxDevices: 999, source: "paddle", email: "a@b.c", deviceId: "d" }), h.deps);
  assert.equal(r.status, 200);
  assert.equal(r.body.plan, "year", "plan istemcinin söylediği aylık değil Google'ın yıllık ürünü");
  assert.equal(r.body.maxDevices, 3);
  assert.equal(h.s.claims[0].productId, "premium_yearly");
});

// ---- Ş1 paket adı ----

test("Ş1: Google adresleri HEP sunucu sabiti paket adıyla kurulur; istemci paketi yok sayılır; jeton adres güvenli kodlanır", async () => {
  const urls: string[] = [];
  const fakeFetch: FetchLike = async (url) => {
    urls.push(url);
    return { status: 200, json: async () => sub("SUBSCRIPTION_STATE_ACTIVE") };
  };
  const verifier = createHttpVerifier({ fetch: fakeFetch, accessToken: async () => "bearer-x" });
  const s = new FakeStore();
  const logs: unknown[][] = [];
  const deps: PlayDeps = { verifier, store: s, newKey: () => "SPD-AAAAA-BBBBB-CCCCC-DDDDD", now: () => NOW, log: { error: (...a) => void logs.push(a), warn: (...a) => void logs.push(a) } };
  const r = await handlePlayClaim(body({ packageName: "com.evil.app", package: "com.evil.app", applicationId: "com.evil.app" }), deps);
  assert.equal(r.status, 200);
  await verifier.getProduct("premium_lifetime", "tok+en=");
  await verifier.listVoided(NOW, "pg");
  assert.equal(urls.length, 3);
  for (const u of urls) {
    assert.ok(u.includes(`/applications/${PLAY_PACKAGE_NAME}/`), u);
    assert.ok(!u.includes("evil"), u);
  }
  assert.ok(urls[0].endsWith(`/purchases/subscriptionsv2/tokens/${encodeURIComponent(TOKEN)}`));
  assert.ok(urls[1].includes("tok%2Ben%3D"));
  assert.ok(urls[2].includes("type=1") && urls[2].includes("token=pg"));
  assert.equal(PLAY_PACKAGE_NAME, "com.ostlertech.syncpass");
});

// ---- Ş3 durum tablosu ----

test("Ş3: Google abonelik durumu x beklenen satır durumu/dönem sonu/hak (tablo güdümlü)", () => {
  const exp = NOW + 10 * DAY;
  const rows: [string, "state" | "pending", string?, boolean?, number | null?][] = [
    // [durum, tür, satır durumu, hak veriyor mu, entitlementUntil]
    ["SUBSCRIPTION_STATE_ACTIVE", "state", "active", true, exp + 7 * DAY],
    ["SUBSCRIPTION_STATE_IN_GRACE_PERIOD", "state", "active", true, exp + 7 * DAY],
    ["SUBSCRIPTION_STATE_CANCELED", "state", "canceled", true, exp], // süre sonuna kadar hak, PAY YOK (Paddle'dan farkı)
    ["SUBSCRIPTION_STATE_ON_HOLD", "state", "paused", false, null],
    ["SUBSCRIPTION_STATE_PAUSED", "state", "paused", false, null],
    ["SUBSCRIPTION_STATE_EXPIRED", "state", "canceled", false, null], // süresi geçmiş
    ["SUBSCRIPTION_STATE_PENDING", "pending"],
    ["SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED", "pending"],
    ["SUBSCRIPTION_STATE_UNSPECIFIED", "pending"],
  ];
  assert.equal(rows.length, 9);
  for (const [state, kind, status, grants, until] of rows) {
    // EXPIRED için süre geçmişte olmalı; diğerleri gelecekte
    const expiry = state === "SUBSCRIPTION_STATE_EXPIRED" ? NOW - 2 * DAY : exp;
    const d = mapSubscription(sub(state, "premium_monthly", expiry), NOW, false);
    assert.equal(d.kind, kind, state);
    if (d.kind !== "state") continue;
    assert.equal(d.status, status, state);
    assert.equal(d.grants, grants, state);
    // dönem sonu = Google'ın expiryTime'ı (canceled_at benzeri bir değer DEĞİL)
    assert.equal(d.periodEnd, iso(expiry), state);
    const row: LicenseRow = { id: "x", license_key: "k", product: "syncpass_desktop", plan: d.plan, status: d.status, current_period_end: d.periodEnd, max_devices: 3, source: d.source };
    const got = entitlementUntil(row, NOW);
    if (until === null) assert.equal(got, null, state);
    else assert.equal(got, Math.min(until as number, NOW + 30 * DAY), state);
  }
  // bilinmeyen/yeni Google durumu hak vermez
  assert.equal(mapSubscription(sub("SUBSCRIPTION_STATE_FUTURE_THING"), NOW, false).kind, "pending");
  // dönem sonu okunamıyorsa geçersiz
  assert.equal(mapSubscription({ subscriptionState: "SUBSCRIPTION_STATE_ACTIVE", lineItems: [{ productId: "premium_monthly", expiryTime: "yarın" }] }, NOW, false).kind, "invalid");
  assert.equal(mapSubscription({ subscriptionState: "SUBSCRIPTION_STATE_ACTIVE" }, NOW, false).kind, "invalid");
});

test("Ş3: tek seferlik purchaseState 0 active (ömür boyu), 1 refunded, 2 pending", () => {
  const a = mapProduct({ purchaseState: 0, purchaseType: 1 }, "premium_lifetime", NOW, false);
  assert.ok(a.kind === "state" && a.status === "active" && a.grants && a.periodEnd === null && a.plan === "lifetime");
  const row: LicenseRow = { id: "x", license_key: "k", product: "syncpass_desktop", plan: "lifetime", status: "active", current_period_end: null, max_devices: 3, source: "play" };
  assert.equal(entitlementUntil(row, NOW), NOW + 30 * DAY, "ömür boyu belge ömrü 30 gün, kayan");
  const r = mapProduct({ purchaseState: 1 }, "premium_lifetime", NOW, false);
  assert.ok(r.kind === "state" && r.status === "refunded" && !r.grants);
  assert.equal(mapProduct({ purchaseState: 2 }, "premium_lifetime", NOW, false).kind, "pending");
  assert.equal(mapProduct({}, "premium_lifetime", NOW, false).kind, "pending");
});

test("Ş3: PENDING claim 409 pending ve satır açılmaz; hak vermeyen ilk claim 403 inactive ve satır açılmaz", async () => {
  let h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_PENDING");
  let r = await handlePlayClaim(body(), h.deps);
  assert.equal(r.status, 409);
  assert.deepEqual(r.body, { error: "pending" });
  assert.equal(h.s.licenses.size, 0);
  h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_EXPIRED", "premium_monthly", NOW - DAY);
  r = await handlePlayClaim(body(), h.deps);
  assert.equal(r.status, 403);
  assert.equal(h.s.licenses.size, 0);
  assert.equal(h.s.claims[0].allowCreate, false);
});

// ---- Ş4 test satın alma ----

test("Ş4: test satın alma bayrak kapalıyken 403 test_purchase (satır yok); açıkken play_test ve 14 gün sınırlı", async () => {
  let h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_monthly", NOW + 5 * 60_000, { testPurchase: {} });
  let r = await handlePlayClaim(body(), h.deps);
  assert.equal(r.status, 403);
  assert.deepEqual(r.body, { error: "test_purchase" });
  assert.equal(h.s.licenses.size, 0);
  // açık: abonelik testi bitiş tarihini (5 dk) aşmaz
  h = harness({ acceptTestPurchases: true });
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_yearly", NOW + 365 * DAY, { testPurchase: {} });
  r = await handlePlayClaim(body({ productId: "premium_yearly" }), h.deps);
  assert.equal(r.status, 200);
  const lic = [...h.s.licenses.values()][0];
  assert.equal(lic.source, "play_test");
  assert.equal(lic.current_period_end, iso(NOW + PLAY_TEST_GRANT_MS), "yıllık test satın alması 14 günden fazla hak vermez");
  // ömür boyu test: plan lifetime olsa bile süreye bakılır
  h = harness({ acceptTestPurchases: true });
  h.v.product = { purchaseState: 0, purchaseType: 0, productId: "premium_lifetime" };
  r = await handlePlayClaim(body({ productId: "premium_lifetime", kind: "inapp" }), h.deps);
  assert.equal(r.status, 200);
  const life = [...h.s.licenses.values()][0];
  assert.equal(life.plan, "lifetime");
  assert.equal(life.source, "play_test");
  assert.equal(life.current_period_end, iso(NOW + PLAY_TEST_GRANT_MS));
  assert.equal(entitlementUntil(life, NOW + DAY), NOW + PLAY_TEST_GRANT_MS);
  assert.equal(entitlementUntil(life, NOW + PLAY_TEST_GRANT_MS + 1), null, "14 gün sonra ömür boyu test satırı da hak vermez");
  assert.equal(entitlementUntil(life, NOW + 100 * DAY), null);
});

test("Ş4: promosyon kodu (purchaseType 1) normal lisans sayılır", () => {
  const d = mapProduct({ purchaseState: 0, purchaseType: 1 }, "premium_lifetime", NOW, false);
  assert.ok(d.kind === "state" && d.source === "play");
});

test("Ş4: yalnız 'plan === lifetime' dalı süreye bakmıyordu: Paddle ömür boyu satırı değişmedi", () => {
  const paddleLife: LicenseRow = { id: "x", license_key: "k", product: "syncpass_desktop", plan: "lifetime", status: "active", current_period_end: null, max_devices: 3 };
  assert.equal(entitlementUntil(paddleLife, NOW), NOW + 30 * DAY);
  assert.equal(entitlementUntil({ ...paddleLife, source: "paddle" }, NOW), NOW + 30 * DAY);
});

// ---- Ş5 jeton sızıntısı ----

test("Ş5: jeton hiçbir yanıtta ve hiçbir günlükte yok (başarı, 404, 409, 403, 503, depo hatası)", async () => {
  const scenarios: [string, (h: Harness) => void][] = [
    ["200", () => undefined],
    ["404", (h) => (h.v.subscription = new PlayApiError("not_found"))],
    ["auth", (h) => (h.v.subscription = new PlayApiError("auth"))],
    ["unavailable", (h) => (h.v.subscription = new PlayApiError("unavailable"))],
    ["pending", (h) => (h.v.subscription = sub("SUBSCRIPTION_STATE_PENDING"))],
    ["store", (h) => (h.s.failWith = new Error(`veritabani hatasi ${TOKEN} icerik`))],
    ["verifier-throws-generic", (h) => (h.v.subscription = new Error(`ag hatasi ${TOKEN}`) as unknown as PlayApiError)],
  ];
  for (const [name, setup] of scenarios) {
    const h = harness();
    setup(h);
    const r = await handlePlayClaim(body(), h.deps);
    const out = JSON.stringify(r) + JSON.stringify(h.logs);
    assert.ok(!out.includes(TOKEN), `${name}: jeton sızdı`);
    assert.ok(!out.includes("tokenSECRET"), name);
    assert.ok(!out.toLowerCase().includes("purchasetoken"), name);
  }
  // başarı yanıtı yalnız {key, plan, maxDevices, source}
  const h = harness();
  const r = await handlePlayClaim(body(), h.deps);
  assert.deepEqual(Object.keys(r.body).sort(), ["key", "maxDevices", "plan", "source"]);
  assert.equal(r.body.source, "play");
});

// ---- hata yolları (Ş15) ----

test("Ş15: Google hataları: 404->404 invalid_purchase, 401/403->503 not_configured, 429/5xx/ağ->503 verify_unavailable; satır değişmez", async () => {
  const cases: [PlayApiError, number, string][] = [
    [new PlayApiError("not_found"), 404, "invalid_purchase"],
    [new PlayApiError("auth"), 503, "not_configured"],
    [new PlayApiError("unavailable"), 503, "verify_unavailable"],
  ];
  for (const [err, status, code] of cases) {
    const h = harness();
    h.v.subscription = err;
    const r = await handlePlayClaim(body(), h.deps);
    assert.equal(r.status, status);
    assert.deepEqual(r.body, { error: code });
    assert.equal(h.s.claims.length, 0, "Google ulaşılamazken satır yazılmaz/değişmez");
  }
});

test("Ş15: HTTP istemcisi durum kodlarını sınıflar; zaman aşımında 'unavailable'", async () => {
  assert.equal(classifyStatus(404), "not_found");
  assert.equal(classifyStatus(410), "not_found");
  assert.equal(classifyStatus(400), "not_found");
  assert.equal(classifyStatus(401), "auth");
  assert.equal(classifyStatus(403), "auth");
  assert.equal(classifyStatus(429), "unavailable");
  assert.equal(classifyStatus(500), "unavailable");
  assert.equal(classifyStatus(503), "unavailable");
  for (const [status, kind] of [[404, "not_found"], [403, "auth"], [429, "unavailable"], [503, "unavailable"]] as const) {
    const v = createHttpVerifier({ fetch: async () => ({ status, json: async () => ({}) }), accessToken: async () => "b" });
    await assert.rejects(v.getSubscription("t"), (e) => e instanceof PlayApiError && e.kind === kind);
  }
  // erişim belirteci alınamadı (federasyon kurulmadı)
  const noAuth = createHttpVerifier({ fetch: async () => ({ status: 200, json: async () => ({}) }), accessToken: async () => { throw new Error("no sts"); } });
  await assert.rejects(noAuth.getSubscription("t"), (e) => e instanceof PlayApiError && e.kind === "auth");
  // zaman aşımı: fetch iptali dinler, hiç yanıt vermez
  const hang: FetchLike = (_u, init) => new Promise((_res, rej) => init.signal.addEventListener("abort", () => rej(new Error("aborted"))));
  const slow = createHttpVerifier({ fetch: hang, accessToken: async () => "b", timeoutMs: 25 });
  const t0 = Date.now();
  await assert.rejects(slow.getSubscription("t"), (e) => e instanceof PlayApiError && e.kind === "unavailable");
  assert.ok(Date.now() - t0 < 2000);
  // bozuk JSON gövdesi
  const bad = createHttpVerifier({ fetch: async () => ({ status: 200, json: async () => { throw new SyntaxError("x"); } }), accessToken: async () => "b" });
  await assert.rejects(bad.getSubscription("t"), (e) => e instanceof PlayApiError && e.kind === "unavailable");
  // üretim zaman aşımı 8 sn
  const src = fs.readFileSync(path.join(process.cwd(), "src/lib/play-core.ts"), "utf8");
  assert.match(src, /PLAY_TIMEOUT_MS = 8000/);
});

// ---- Ş7 yarış, idempotent ----

test("Ş7: aynı jetonla eşzamanlı 10 claim -> 1 satır, 10 yanıtta aynı kod", async () => {
  const h = harness();
  h.s.delayMs = 5;
  const rs = await Promise.all(Array.from({ length: 10 }, () => handlePlayClaim(body(), h.deps)));
  assert.ok(rs.every((r) => r.status === 200));
  assert.equal(new Set(rs.map((r) => r.body.key)).size, 1);
  assert.equal(h.s.licenses.size, 1);
});

test("Ş7: ikinci claim taze satırı Google'a sormadan döndürür (kota); bayatsa yeniden sorar", async () => {
  const h = harness();
  const a = await handlePlayClaim(body(), h.deps);
  assert.equal(h.v.calls.length, 1);
  const b = await handlePlayClaim(body(), h.deps);
  assert.equal(h.v.calls.length, 1, "24 saatten tazeyse Google'a gidilmez");
  assert.equal(a.body.key, b.body.key);
  // 25 saat sonra
  const h2 = { ...h.deps, now: () => NOW + PLAY_STALE_MS + 1000 };
  const c = await handlePlayClaim(body(), h2);
  assert.equal(h.v.calls.length, 2);
  assert.equal(c.body.key, a.body.key, "bayat yeniden sorgu da aynı kodu verir");
});

// ---- Ş10 zincir (çekirdek: bağlı jeton özet olarak depoya gider) ----

test("Ş10: linkedPurchaseToken ve outOfAppPurchaseContext.expiredPurchaseToken aynı satıra bağlanır; kod ve cihaz değişmez; ham eski jeton depoya gitmez", async () => {
  const h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_monthly");
  const first = await handlePlayClaim(body({ purchaseToken: OLD_TOKEN }), h.deps);
  assert.equal(first.status, 200);
  // ay -> yıl yükseltme: yeni jeton eski jetona bağlı
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_yearly", NOW + 365 * DAY, { linkedPurchaseToken: OLD_TOKEN });
  const up = await handlePlayClaim(body({ purchaseToken: TOKEN, productId: "premium_yearly" }), h.deps);
  assert.equal(up.status, 200);
  assert.equal(up.body.key, first.body.key, "aynı kod");
  assert.equal(up.body.plan, "year", "plan Google'ın yeni ürününden");
  assert.equal(h.s.licenses.size, 1);
  assert.equal(h.s.claims[1].linkedHash, hashToken(OLD_TOKEN));
  assert.ok(!JSON.stringify(h.s.claims[1]).includes(`"${OLD_TOKEN}"`) || h.s.claims[1].linkedHash !== OLD_TOKEN, "eski jeton yalnız özet");
  // eski jetonla gelen claim: Google'a sorulmaz, aynı kod
  const calls = h.v.calls.length;
  const old = await handlePlayClaim(body({ purchaseToken: OLD_TOKEN }), h.deps);
  assert.equal(old.body.key, first.body.key);
  assert.equal(h.v.calls.length, calls);
  // Play abonelik merkezinden yeniden abonelik: expiredPurchaseToken
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_yearly", NOW + 400 * DAY, { outOfAppPurchaseContext: { expiredPurchaseToken: TOKEN } });
  const re = await handlePlayClaim(body({ purchaseToken: TOKEN2, productId: "premium_yearly" }), h.deps);
  assert.equal(re.body.key, first.body.key);
  assert.equal(h.s.licenses.size, 1);
});

// ---- Ş8 activate bayatlık ----

function licStore(row: LicenseRow): LicenseStore & { touches: number } {
  return {
    touches: 0,
    async findLicense() { return row; },
    async registerDevice() { return "ok"; },
    async touchDevice() { return true; },
    async removeDevice() { return "ok"; },
    async hasDevice() { return false; },
    async hasRemovalTrace() { return false; },
    async findRetiredKeyOwner() { return null; },
    async createResetToken() { return false; },
    async deleteResetToken() {},
    async consumeResetToken() { return { result: "invalid" }; },
  };
}
const ed = generateKeyPairSync("ed25519");
const edPriv = ed.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64");
const ENV = { LICENSE_SIGNING_KEY: edPriv };
const DEV = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";

async function playRow(h: Harness, checkedAgoMs: number): Promise<PlayLicenseRow> {
  const r = await handlePlayClaim(body(), { ...h.deps, now: () => NOW - checkedAgoMs });
  assert.equal(r.status, 200);
  return [...h.s.licenses.values()][0];
}

test("Ş8: activate Play satırı TAZEyse Google'a sormaz; BAYATsa sorar ve durumu tazeler", async () => {
  const h = harness();
  const row = await playRow(h, 2 * 60 * 60 * 1000); // 2 saat önce tazelendi
  const before = h.v.calls.length;
  const hook = (r: LicenseRow, n: number) => refreshPlayLicense(r, h.deps, n);
  let res = await handleLicenseRequest("activate", "syncpass_desktop", { key: row.license_key, deviceId: DEV }, licStore(row), { env: ENV, now: NOW, playRefresh: hook });
  assert.equal(res.status, 200);
  assert.equal(h.v.calls.length, before, "taze: Google'a 0 çağrı");
  // 30 saat sonra bayat; Google artık EXPIRED diyor (süre geçmiş)
  h.v.subscription = sub("SUBSCRIPTION_STATE_EXPIRED", "premium_monthly", NOW + 30 * 60 * 60 * 1000 - 3 * DAY);
  res = await handleLicenseRequest("activate", "syncpass_desktop", { key: row.license_key, deviceId: DEV }, licStore(row), { env: ENV, now: NOW + 30 * 60 * 60 * 1000, playRefresh: (r, n) => refreshPlayLicense(r, h.deps, n) });
  assert.equal(h.v.calls.length, before + 1);
  assert.equal(res.status, 403);
  assert.equal(h.s.updates.length, 1);
  assert.equal(h.s.updates[0].patch.status, "canceled");
});

test("Ş8: bayat satırda Google 503 -> kayıtlı durumla devam; satır DEĞİŞMEZ, süre UZATILMAZ", async () => {
  const h = harness();
  const row = await playRow(h, 3 * DAY);
  const stored = entitlementUntil(row, NOW);
  h.v.subscription = new PlayApiError("unavailable");
  const res = await handleLicenseRequest("activate", "syncpass_desktop", { key: row.license_key, deviceId: DEV }, licStore(row), { env: ENV, now: NOW, playRefresh: (r, n) => refreshPlayLicense(r, h.deps, n) });
  assert.equal(res.status, 200);
  assert.equal(res.body.expiresAt, stored, "kayıtlı durumdan hesaplanan bitişi aşmaz");
  assert.equal(h.s.updates.length, 0);
  // ve hata ayrıntısı günlüğe jeton taşımaz
  assert.ok(!JSON.stringify(h.logs).includes(TOKEN));
  // 404 de düşürmez
  h.v.subscription = new PlayApiError("not_found");
  const r2 = await handleLicenseRequest("renew", "syncpass_desktop", { key: row.license_key, deviceId: DEV }, licStore(row), { env: ENV, now: NOW, playRefresh: (r, n) => refreshPlayLicense(r, h.deps, n) });
  assert.equal(r2.status, 200);
  assert.equal(h.s.updates.length, 0);
});

test("Ş8: iade (refunded) satırı tekrar Google'a sorulmaz ve geri açılmaz; Paddle satırında kanca çağrılmaz", async () => {
  const h = harness();
  const row = await playRow(h, 3 * DAY);
  row.status = "refunded";
  const calls = h.v.calls.length;
  const out = await refreshPlayLicense(row, h.deps, NOW);
  assert.equal(out.status, "refunded");
  assert.equal(h.v.calls.length, calls);
  const res = await handleLicenseRequest("activate", "syncpass_desktop", { key: row.license_key, deviceId: DEV }, licStore(row), { env: ENV, now: NOW, playRefresh: (r, n) => refreshPlayLicense(r, h.deps, n) });
  assert.equal(res.status, 403);
  // Paddle satırı: kanca hiç çağrılmaz
  let hookCalls = 0;
  const paddle: LicenseRow = { id: "p", license_key: "SPD-23456-789AB-CDEFG-HJKMN", product: "syncpass_desktop", plan: "year", status: "active", current_period_end: iso(NOW + 100 * DAY), max_devices: 3 };
  const pr = await handleLicenseRequest("activate", "syncpass_desktop", { key: paddle.license_key, deviceId: DEV }, licStore(paddle), { env: ENV, now: NOW, playRefresh: async (r) => { hookCalls++; return r; } });
  assert.equal(pr.status, 200);
  assert.equal(hookCalls, 0);
});

test("Ş8: test satırı tazelemede süre UZAMAZ (yalnız durum değişebilir)", async () => {
  const h = harness({ acceptTestPurchases: true });
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_monthly", NOW + 100 * DAY, { testPurchase: {} });
  const row = await playRow(h, 2 * DAY);
  const end = row.current_period_end;
  const out = await refreshPlayLicense(row, h.deps, NOW + 3 * DAY);
  assert.equal(out.current_period_end, end);
  assert.equal(entitlementUntil(out, NOW + 20 * DAY), null);
});

// ---- Ş9 iptal listesi + cron kimliği ----

test("Ş9: iptal listesi yalnız ETKİN jetonu refunded yapar, eski jeton yeni aboneliği düşürmez; sayfalar gezilir", async () => {
  const h = harness();
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_monthly");
  const first = await handlePlayClaim(body({ purchaseToken: OLD_TOKEN }), h.deps);
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE", "premium_yearly", NOW + 365 * DAY, { linkedPurchaseToken: OLD_TOKEN });
  await handlePlayClaim(body({ purchaseToken: TOKEN, productId: "premium_yearly" }), h.deps);
  // ikinci, bağımsız lisans
  h.v.subscription = sub("SUBSCRIPTION_STATE_ACTIVE");
  const other = await handlePlayClaim(body({ purchaseToken: TOKEN2 }), h.deps);
  assert.notEqual(other.body.key, first.body.key);
  h.v.voided = { pages: [[OLD_TOKEN, "bilinmeyen"], [TOKEN2]] };
  const r = await sweepVoidedPurchases(h.deps);
  assert.deepEqual(r, { seen: 3, marked: 1, expired: 0 });
  const lics = [...h.s.licenses.values()];
  assert.equal(lics.find((l) => l.license_key === first.body.key)!.status, "active", "eski jetonun iadesi yeni aboneliği düşürmedi");
  assert.equal(lics.find((l) => l.license_key === other.body.key)!.status, "refunded");
  // ikinci koşu: tekrar sayılmaz
  const again = await sweepVoidedPurchases(h.deps);
  assert.equal(again.marked, 0);
});

test("Ş9: Google ulaşılamazsa tarama fırlatır, hiçbir satır değişmez", async () => {
  const h = harness();
  await handlePlayClaim(body(), h.deps);
  h.v.listVoided = async () => { throw new PlayApiError("unavailable"); };
  await assert.rejects(sweepVoidedPurchases(h.deps), (e) => e instanceof PlayApiError);
  assert.equal([...h.s.licenses.values()][0].status, "active");
});

test("Ş9: cron kimliği: CRON_SECRET yoksa/kısaysa/yanlışsa HER istek reddedilir; doğruysa kabul", () => {
  const secret = "s".repeat(32);
  assert.equal(cronAuthorized(`Bearer ${secret}`, secret), true);
  assert.equal(cronAuthorized(`Bearer ${secret}x`, secret), false);
  assert.equal(cronAuthorized("Bearer yanlis", secret), false);
  assert.equal(cronAuthorized(secret, secret), false, "Bearer öneki şart");
  assert.equal(cronAuthorized(null, secret), false);
  assert.equal(cronAuthorized("Bearer ", ""), false);
  assert.equal(cronAuthorized("Bearer undefined", undefined), false, "sır yoksa herkes reddedilir");
  assert.equal(cronAuthorized("Bearer kisa", "kisa"), false, "16 karakterden kısa sır kabul edilmez");
});

test("Ş9: vercel.json günlük cron girdisi ve her iki uç kimlik denetimiyle başlar", () => {
  const vj = JSON.parse(fs.readFileSync(path.join(process.cwd(), "vercel.json"), "utf8")) as { crons: { path: string; schedule: string }[] };
  const c = vj.crons.find((x) => x.path === "/api/license/play/cron");
  assert.ok(c, "cron girdisi yok");
  assert.match(c.schedule, /^\d+ \d+ \* \* \*$/, "günlük");
  for (const f of ["cron", "health"]) {
    const src = fs.readFileSync(path.join(process.cwd(), `src/app/api/license/play/${f}/route.ts`), "utf8");
    const iAuth = src.indexOf("cronAuthorized(req.headers.get");
    assert.ok(iAuth > 0, f);
    const iWork = Math.min(...["playDeps(", "realVerifier(", "req.json("].map((k) => (src.indexOf(k, src.indexOf("export async function")) >= 0 ? src.indexOf(k, src.indexOf("export async function")) : 1e9)));
    assert.ok(iAuth < iWork, `${f}: kimlik denetimi iş yapmadan ÖNCE olmalı`);
    assert.match(src, /status: 401/);
  }
});

// ---- Ş20 sağlık ucu ----

test("Ş20: sağlık yoklaması yalnız HTTP durum kodlarını döndürür (veri yok)", async () => {
  const v = new FakeVerifier();
  v.product = new PlayApiError("auth");
  const out = await probePlayApi(v, { subscriptionToken: TOKEN, productId: "premium_lifetime", productToken: TOKEN2 }, NOW);
  assert.deepEqual(out, { subscriptionsv2: 200, products: 403, voidedpurchases: 200 });
  assert.ok(!JSON.stringify(out).includes(TOKEN));
  // jetonsuz: yalnız iptal listesi
  assert.deepEqual(await probePlayApi(v, {}, NOW), { voidedpurchases: 200 });
  assert.ok(VOIDED_WINDOW_MS === 3 * DAY);
});

// ---- Ş12 imza anahtarı döndürme (sunucu tarafı) ----

test("Ş12: sürüm eşiği: yeni sürüme V2 anahtarı, eski/bilinmeyen sürüme eski anahtar; V2 tanımsızsa hep eski", () => {
  const oldK = generateKeyPairSync("ed25519");
  const newK = generateKeyPairSync("ed25519");
  const env = {
    LICENSE_SIGNING_KEY: oldK.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64"),
    [SYNCPASS_KEY_V2_ENV]: newK.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64"),
  };
  const sign = (appVersion: string | null | undefined, e: Record<string, string>) =>
    signLicenseToken("syncpass_desktop", { lid: "l", plan: "year", dev: DEV, exp: NOW + DAY }, { env: e, now: NOW, appVersion });
  const verifies = (token: string, pub: ReturnType<typeof generateKeyPairSync>["publicKey"]) => {
    const [b, s] = token.split(".");
    return cryptoVerify(null, Buffer.from(b), pub, Buffer.from(s, "base64url"));
  };
  const minV = SYNCPASS_KEY_V2_MIN_APP_VERSION;
  assert.ok(verifies(sign(minV, env), newK.publicKey), "eşik sürümü YENİ anahtarla imzalanır");
  assert.ok(!verifies(sign(minV, env), oldK.publicKey));
  assert.ok(verifies(sign("1.4.19", env), oldK.publicKey), "eski sürüm ESKİ anahtarla");
  assert.ok(verifies(sign(null, env), oldK.publicKey), "sürüm bilinmiyorsa eski");
  assert.ok(verifies(sign("garip", env), oldK.publicKey));
  assert.ok(verifies(sign("9.0.0", env), newK.publicKey));
  const noV2 = { LICENSE_SIGNING_KEY: env.LICENSE_SIGNING_KEY };
  assert.ok(verifies(sign("9.0.0", noV2), oldK.publicKey), "V2 tanımlı değilse davranış değişmez");
  assert.equal(signingKeyEnvName("areapilot", env, "9.9.9"), "LICENSE_SIGNING_KEY_AREAPILOT", "AreaPilot etkilenmez");
  assert.equal(appVersionAtLeast("1.5.0-beta", "1.5.0"), true);
  assert.equal(appVersionAtLeast("1.4.99", "1.5.0"), false);
  assert.equal(appVersionAtLeast("2", "1.5.0"), true);
  assert.equal(appVersionAtLeast(undefined, "1.5.0"), false);
});

test("Ş12: activate gövdesindeki appVersion imza anahtarını seçer", async () => {
  const oldK = generateKeyPairSync("ed25519");
  const newK = generateKeyPairSync("ed25519");
  const env = {
    LICENSE_SIGNING_KEY: oldK.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64"),
    [SYNCPASS_KEY_V2_ENV]: newK.privateKey.export({ format: "der", type: "pkcs8" }).toString("base64"),
  };
  const row: LicenseRow = { id: "p", license_key: "SPD-23456-789AB-CDEFG-HJKMN", product: "syncpass_desktop", plan: "year", status: "active", current_period_end: iso(NOW + 100 * DAY), max_devices: 3 };
  const call = (appVersion: string) => handleLicenseRequest("activate", "syncpass_desktop", { key: row.license_key, deviceId: DEV, appVersion }, licStore(row), { env, now: NOW });
  const ok = (r: { body: Record<string, unknown> }, pub: typeof newK.publicKey) => {
    const [b, s] = String(r.body.token).split(".");
    return cryptoVerify(null, Buffer.from(b), pub, Buffer.from(s, "base64url"));
  };
  assert.ok(ok(await call("1.5.0"), newK.publicKey));
  assert.ok(ok(await call("1.4.19"), oldK.publicKey));
});

// ---- Ş24 / istemci paketi ----

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

test("Ş24/istemci: play-catalog/play-core/play-api yalnız sunucu yollarından içe aktarılır; 'use client' dosyalar bunlara dokunmaz", () => {
  const root = path.join(process.cwd(), "src");
  const allowed = [
    /src[\\/]lib[\\/]play-(core|catalog)\.ts$/,
    /src[\\/]lib[\\/]server[\\/]play(-api)?\.ts$/,
    /src[\\/]lib[\\/]server[\\/]license\.ts$/,
    /src[\\/]app[\\/]api[\\/]license[\\/]play[\\/]/,
  ];
  for (const f of walk(root)) {
    const src = fs.readFileSync(f, "utf8");
    if (!/(play-catalog|play-core|server\/play)/.test(src.replace(/\/\/.*$/gm, ""))) continue;
    assert.ok(allowed.some((r) => r.test(f)), `${f}: Play sunucu modülünü içe aktarmamalı`);
    assert.ok(!/^["']use client["']/m.test(src), `${f}: istemci dosyası`);
  }
  // kardeş sunucu dosyaları sunucuya özgü olarak işaretli
  for (const f of ["src/lib/server/play.ts", "src/lib/server/play-api.ts"]) {
    assert.match(fs.readFileSync(path.join(process.cwd(), f), "utf8"), /import "server-only"/);
  }
});

test("Ş24: claim ucu yalnız Play katalogunu ve Play çekirdeğini kullanır (Paddle/Store lisansı üretmez)", () => {
  const src = fs.readFileSync(path.join(process.cwd(), "src/app/api/license/play/claim/route.ts"), "utf8");
  assert.ok(!/paddle/i.test(src.replace(/\/\/.*$/gm, "")));
  const core = fs.readFileSync(path.join(process.cwd(), "src/lib/play-core.ts"), "utf8");
  assert.ok(!/paddle-tiers"|paddle-events|PADDLE_PRICE_PLANS/.test(core.replace(/import type[^\n]*\n/g, "")), "play-core Paddle fiyat tablosuna dayanmaz");
  // source yalnız play/play_test üretir
  assert.ok(["play", "play_test"].includes((mapSubscription(sub("SUBSCRIPTION_STATE_ACTIVE"), NOW, true) as { source: string }).source));
});
