// Lisans çekirdeği: ürün tanımları, kod biçimi, hak süresi, belge imzası ve etkinleştirme/yenileme/kaldırma mantığı.
// Saf dosya (birim testli: tests/license-core.test.ts): Next/server-only/Supabase yok, göreli içe aktarma yalnız `import type`.
// Veritabanı erişimi LicenseStore ile dışarıdan verilir (sunucuda lib/server/license.ts Supabase uygulamasını bağlar).
// Sözleşme: D:\Development\OstlerTech\yonetim\areapilot-lisans-sozlesmesi.md
import { createPrivateKey, createPublicKey, randomBytes, sign, verify } from "node:crypto";
import type { LicensePlan, LicenseProduct } from "./paddle-tiers";

export type Plan = LicensePlan;
export type Product = LicenseProduct;
export type LicenseStatus = "active" | "past_due" | "paused" | "canceled" | "refunded" | "revoked";

export interface LicenseRow {
  id: string;
  license_key: string;
  product: Product;
  plan: Plan;
  status: LicenseStatus;
  current_period_end: string | null;
  max_devices: number;
}

const DAY = 24 * 60 * 60 * 1000;
// Abonelik yenilemesi gecikirse (kart reddi vb.) kullanıcı hemen düşmesin.
const RENEWAL_GRACE = 7 * DAY;

export interface ProductConfig {
  /** Lisans kodu ön eki: SPD-XXXXX-... */
  prefix: string;
  /** İmza anahtarının ortam değişkeni adı (değeri: PKCS#8 DER, base64). */
  keyEnv: string;
  /** Belge imza algoritması. */
  alg: "ed25519" | "es256";
  /** İmzalı belgenin ömrü; uygulama ~7 günde yeniler, sunucuya ulaşamazsa belge bu süre geçerli kalır. */
  tokenLifetimeMs: number;
  /** Yanıtta ve belgede ürün + cihaz sayısı da yer alır mı (SyncPass'in biçimi değişmesin diye yalnız AreaPilot). */
  richPayload: boolean;
}

export const PRODUCTS: Record<Product, ProductConfig> = {
  syncpass_desktop: { prefix: "SPD", keyEnv: "LICENSE_SIGNING_KEY", alg: "ed25519", tokenLifetimeMs: 30 * DAY, richPayload: false },
  // Şantiye bilgisayarları günlerce çevrimdışı olabilir: 90 gün.
  areapilot: { prefix: "APL", keyEnv: "LICENSE_SIGNING_KEY_AREAPILOT", alg: "es256", tokenLifetimeMs: 90 * DAY, richPayload: true },
};

export const DEFAULT_PRODUCT: Product = "syncpass_desktop";

// Karışan harfler (0/O, 1/I/L, U) yok: XXX-XXXXX-XXXXX-XXXXX-XXXXX, 20 karakter ≈ 100 bit.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newLicenseKey(product: Product = DEFAULT_PRODUCT): string {
  const bytes = randomBytes(20);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${PRODUCTS[product].prefix}-${chars.slice(0, 5)}-${chars.slice(5, 10)}-${chars.slice(10, 15)}-${chars.slice(15, 20)}`;
}

function squash(input: unknown): string | null {
  return typeof input === "string" ? input.toUpperCase().replace(/[^0-9A-Z]/g, "") : null;
}

/** Kodu biçimler; yalnız `product`un ön ekini (ya da ön eksiz 20 karakteri) kabul eder. */
export function normalizeKey(input: unknown, product: Product = DEFAULT_PRODUCT): string | null {
  const squashed = squash(input);
  if (squashed === null) return null;
  const prefix = PRODUCTS[product].prefix;
  const raw = squashed.startsWith(prefix) && squashed.length === 20 + prefix.length ? squashed.slice(prefix.length) : squashed;
  if (raw.length !== 20 || [...raw].some((c) => !ALPHABET.includes(c))) return null;
  return `${prefix}-${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15, 20)}`;
}

/** Kod başka bir ürünün biçiminde mi (ör. AreaPilot ucuna SPD kodu)? Öyleyse o ürünü döndürür. */
export function foreignKeyProduct(input: unknown, product: Product): Product | null {
  const squashed = squash(input);
  if (squashed === null) return null;
  for (const other of Object.keys(PRODUCTS) as Product[]) {
    if (other === product) continue;
    if (normalizeKey(squashed, other) && squashed.startsWith(PRODUCTS[other].prefix)) return other;
  }
  return null;
}

/** Lisans şu an hak veriyor mu; veriyorsa imzalı belgenin bitiş anı (epoch ms). */
export function entitlementUntil(row: LicenseRow, now = Date.now()): number | null {
  if (row.status === "refunded" || row.status === "revoked" || row.status === "paused") return null;
  const lifetime = PRODUCTS[row.product ?? DEFAULT_PRODUCT].tokenLifetimeMs;
  if (row.plan === "lifetime") return row.status === "active" ? now + lifetime : null;
  const periodEnd = row.current_period_end ? Date.parse(row.current_period_end) : NaN;
  if (Number.isNaN(periodEnd)) return null;
  const until = periodEnd + (row.status === "canceled" ? 0 : RENEWAL_GRACE);
  if (until <= now) return null;
  return Math.min(until, now + lifetime);
}

// ---- Belge imzası ----

export interface TokenInput {
  lid: string;
  plan: Plan;
  dev: string;
  /** Bitiş, epoch ms. */
  exp: number;
  maxDevices?: number;
}

type Env = Record<string, string | undefined>;

export class SigningNotConfigured extends Error {}

function privateKeyFor(product: Product, env: Env) {
  const b64 = env[PRODUCTS[product].keyEnv];
  if (!b64) throw new SigningNotConfigured(`${PRODUCTS[product].keyEnv} tanımlı değil`);
  return createPrivateKey({ key: Buffer.from(b64, "base64"), format: "der", type: "pkcs8" });
}

/**
 * Uygulamanın çevrimdışı doğruladığı belge: base64url(JSON) + "." + base64url(imza). İmza gövdenin base64url METNİ üzerindedir.
 * SyncPass: Ed25519, gövde {v, lid, plan, dev, exp, iat} (değişmez). AreaPilot: ECDSA P-256/SHA-256, imza IEEE P1363 (r||s, 64 bayt),
 * gövde {v, lid, product, plan, dev, exp, maxDevices, iat}.
 */
export function signLicenseToken(product: Product, input: TokenInput, opts: { env?: Env; now?: number } = {}): string {
  const env = opts.env ?? process.env;
  const key = privateKeyFor(product, env);
  const iat = opts.now ?? Date.now();
  const payload =
    product === "areapilot"
      ? { v: 1, lid: input.lid, product, plan: input.plan, dev: input.dev, exp: input.exp, maxDevices: input.maxDevices ?? 1, iat }
      : { v: 1, lid: input.lid, plan: input.plan, dev: input.dev, exp: input.exp, iat };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const data = Buffer.from(body);
  const signature =
    PRODUCTS[product].alg === "es256"
      ? sign("sha256", data, { key, dsaEncoding: "ieee-p1363" })
      : sign(null, data, key);
  return `${body}.${signature.toString("base64url")}`;
}

/** SyncPass'in eski çağrı biçimi (değişmedi). */
export function signToken(payload: { lid: string; plan: Plan; dev: string; exp: number }): string {
  return signLicenseToken("syncpass_desktop", payload);
}

/** AreaPilot belgesini genel anahtarla doğrular (testler ve istemci için başvuru uygulaması). Geçerliyse gövdeyi döndürür. */
export function verifyAreapilotToken(token: string, spkiB64: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const key = createPublicKey({ key: Buffer.from(spkiB64, "base64"), format: "der", type: "spki" });
  const ok = verify("sha256", Buffer.from(parts[0]), { key, dsaEncoding: "ieee-p1363" }, Buffer.from(parts[1], "base64url"));
  if (!ok) return null;
  try {
    return JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Özel anahtardan (PKCS#8 DER, base64) istemciye gömülecek genel anahtar biçimlerini türetir. */
export function areapilotPublicKey(privateKeyB64: string): { pointB64: string; xB64: string; yB64: string; spkiB64: string } {
  const pub = createPublicKey(createPrivateKey({ key: Buffer.from(privateKeyB64, "base64"), format: "der", type: "pkcs8" }));
  const jwk = pub.export({ format: "jwk" });
  const x = Buffer.from(String(jwk.x), "base64url");
  const y = Buffer.from(String(jwk.y), "base64url");
  return {
    pointB64: Buffer.concat([Buffer.from([4]), x, y]).toString("base64"),
    xB64: x.toString("base64"),
    yB64: y.toString("base64"),
    spkiB64: pub.export({ format: "der", type: "spki" }).toString("base64"),
  };
}

// ---- Etkinleştirme / yenileme / kaldırma ----

export interface LicenseStore {
  findLicense(key: string, product: Product): Promise<LicenseRow | null>;
  listDevices(licenseId: string): Promise<string[]>;
  /** Cihazı ekler ya da last_seen/sürümünü günceller; başarıyı döndürür. */
  upsertDevice(licenseId: string, deviceId: string, appVersion: string | null, nowIso: string): Promise<boolean>;
  removeDevice(licenseId: string, deviceId: string): Promise<void>;
}

export type LicenseOp = "activate" | "renew" | "deactivate";
export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
}

const UUID = /^[0-9a-f-]{36}$/i;

export async function handleLicenseRequest(
  op: LicenseOp,
  product: Product,
  rawBody: unknown,
  store: LicenseStore,
  opts: { env?: Env; now?: number } = {}
): Promise<ApiResult> {
  const body = typeof rawBody === "object" && rawBody !== null ? (rawBody as Record<string, unknown>) : null;
  const key = normalizeKey(body?.key, product);
  if (!key) {
    // Başka ürünün kodu (ör. AreaPilot ucuna SPD kodu): yanlış uygulamaya yapıştırmayı açıkça söyle.
    if (foreignKeyProduct(body?.key, product)) return { status: 404, body: { error: "wrong_product" } };
    return { status: 400, body: { error: "bad_request" } };
  }
  const rawDevice = typeof body?.deviceId === "string" ? body.deviceId : null;
  const deviceId = op === "deactivate" ? (rawDevice ? rawDevice.toLowerCase() : null) : rawDevice && UUID.test(rawDevice) ? rawDevice.toLowerCase() : null;
  if (!deviceId) return { status: 400, body: { error: "bad_request" } };
  const appVersion = typeof body?.appVersion === "string" ? body.appVersion.slice(0, 32) : null;

  const license = await store.findLicense(key, product);
  if (!license) return { status: 404, body: { error: "invalid_key" } };

  if (op === "deactivate") {
    await store.removeDevice(license.id, deviceId);
    return { status: 200, body: { ok: true } };
  }

  const now = opts.now ?? Date.now();
  const until = entitlementUntil(license, now);
  if (!until) return { status: 403, body: { error: "inactive", status: license.status } };

  const devices = await store.listDevices(license.id);
  const known = devices.includes(deviceId);
  if (op === "renew" && !known) return { status: 404, body: { error: "device_unknown" } };
  if (!known && devices.length >= license.max_devices) {
    return { status: 409, body: { error: "device_limit", maxDevices: license.max_devices } };
  }
  if (!(await store.upsertDevice(license.id, deviceId, appVersion, new Date(now).toISOString()))) {
    return { status: 500, body: { error: "server_error" } };
  }

  let token: string;
  try {
    token = signLicenseToken(product, { lid: license.id, plan: license.plan, dev: deviceId, exp: until, maxDevices: license.max_devices }, { env: opts.env, now });
  } catch (e) {
    // Anahtar içeriği/ayrıntı günlüğe yazılmaz; yalnız hata sınıfı.
    console.error("license sign", product, e instanceof Error ? e.constructor.name : "error");
    if (e instanceof SigningNotConfigured) return { status: 503, body: { error: "not_configured" } };
    return { status: 500, body: { error: "server_error" } };
  }
  return {
    status: 200,
    body: PRODUCTS[product].richPayload
      ? { token, product, plan: license.plan, maxDevices: license.max_devices, expiresAt: until }
      : { token, plan: license.plan, expiresAt: until },
  };
}
