// Lisans çekirdeği: ürün tanımları, kod biçimi, hak süresi, belge imzası ve etkinleştirme/yenileme/kaldırma mantığı.
// Saf dosya (birim testli: tests/license-core.test.ts): Next/server-only/Supabase yok, göreli içe aktarma yalnız `import type`.
// Veritabanı erişimi LicenseStore ile dışarıdan verilir (sunucuda lib/server/license.ts Supabase uygulamasını bağlar).
// Sözleşme: D:\Development\OstlerTech\yonetim\areapilot-lisans-sozlesmesi.md
import { createHash, createHmac, createPrivateKey, createPublicKey, randomBytes, sign, verify } from "node:crypto";
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
  /** Paddle'dan gelen alıcı e-postası (yalnız cihaz sıfırlama bağlantısı için okunur; yanıta ve günlüğe yazılmaz). */
  email?: string | null;
  /**
   * Lisansın kaynağı (yalnız Play alanları göçten sonra gelir). `paddle`: Paddle; `play`: Google Play satın alması;
   * `play_test`: Play lisans-test satın alması (Burak Ş4: hak süresi `current_period_end`'e bağlıdır, plan ne olursa olsun).
   * Alan yoksa/boşsa Paddle gibi davranılır (SyncPass ve AreaPilot satırları değişmez).
   */
  source?: "paddle" | "play" | "play_test" | null;
  /** Yalnız Play satırı: Google'a yeniden sorma için ham jeton. Hiçbir yanıta/günlüğe yazılmaz (Burak Ş5). */
  play_purchase_token?: string | null;
  play_product_id?: string | null;
  play_state?: string | null;
  play_checked_at?: string | null;
}

const DAY = 24 * 60 * 60 * 1000;
// Abonelik yenilemesi gecikirse (kart reddi vb.) kullanıcı hemen düşmesin.
const RENEWAL_GRACE = 7 * DAY;
/** Süresiz belgenin exp değeri: 2100-01-01 00:00 UTC (epoch ms). İstemci süreye bakmaz; alan biçim uyumu için durur. */
export const PERPETUAL_EXP = 4102444800000;

export interface ProductConfig {
  /** Lisans kodu ön eki: SPD-XXXXX-... */
  prefix: string;
  /** İmza anahtarının ortam değişkeni adı (değeri: PKCS#8 DER, base64). */
  keyEnv: string;
  /** Belge imza algoritması. */
  alg: "ed25519" | "es256";
  /** İmzalı belgenin ömrü; uygulama ~7 günde yeniler, sunucuya ulaşamazsa belge bu süre geçerli kalır. `perpetual` ise yok sayılır. */
  tokenLifetimeMs: number;
  /**
   * Belge SÜRESİZ mi (yalnız AreaPilot, tek seferlik lisans; Yasin kararı 2026-11-07). Etkinleştirmede bir kez verilir,
   * `PERPETUAL_EXP` sabit uzak tarihli exp taşır, istemci yenilemez. Sunucuya yalnız etkinleştirme ve kaldırma/sıfırlamada gidilir.
   */
  perpetual: boolean;
  /** Yanıtta ve belgede ürün + cihaz sayısı da yer alır mı (SyncPass'in biçimi değişmesin diye yalnız AreaPilot). */
  richPayload: boolean;
  /**
   * "Bu bilgisayardan kaldır" için 30 günde 3 sınırı uygulanır mı. SyncPass Masaüstü 429'u anlamaz (eski istemci), bu yüzden MUAF.
   */
  deactivateLimited: boolean;
}

export const PRODUCTS: Record<Product, ProductConfig> = {
  syncpass_desktop: { prefix: "SPD", keyEnv: "LICENSE_SIGNING_KEY", alg: "ed25519", tokenLifetimeMs: 30 * DAY, perpetual: false, richPayload: false, deactivateLimited: false },
  // Tek seferlik lisans: belge süresiz (PERPETUAL_EXP), yenileme yok. tokenLifetimeMs yalnız perpetual=false için anlamlıdır.
  areapilot: { prefix: "APL", keyEnv: "LICENSE_SIGNING_KEY_AREAPILOT", alg: "es256", tokenLifetimeMs: 90 * DAY, perpetual: true, richPayload: true, deactivateLimited: true },
};

export const DEFAULT_PRODUCT: Product = "syncpass_desktop";

// Karışan harfler (0/O, 1/I/L, U) yok: XXX-XXXXX-XXXXX-XXXXX-XXXXX, 20 karakter ≈ 100 bit.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newLicenseKey(product: Product = DEFAULT_PRODUCT): string {
  // Reddetmeli örnekleme: 256 % 30 != 0 olduğundan 240 ve üzeri baytlar atılır, yoksa ilk harfler daha sık çıkar.
  const limit = 256 - (256 % ALPHABET.length);
  let chars = "";
  while (chars.length < 20) {
    for (const b of randomBytes(32)) {
      if (b < limit && chars.length < 20) chars += ALPHABET[b % ALPHABET.length];
    }
  }
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
  const cfg = PRODUCTS[row.product ?? DEFAULT_PRODUCT];
  if (row.source === "play_test") {
    // Burak Ş4: lisans-test satın alması ömür boyu planda bile sınırsız hak vermez; hak current_period_end'e bağlıdır, pay yok.
    const end = row.current_period_end ? Date.parse(row.current_period_end) : NaN;
    if (Number.isNaN(end) || end <= now) return null;
    return Math.min(end, now + cfg.tokenLifetimeMs);
  }
  if (cfg.perpetual) return row.plan === "lifetime" && row.status === "active" ? PERPETUAL_EXP : null;
  const lifetime = cfg.tokenLifetimeMs;
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

/**
 * Sözleşme belgesinde (yonetim/areapilot-lisans-sozlesmesi.md §6) ve istemci testlerinde dolaşan SAHTE test anahtar çiftinin
 * genel anahtarları (SPKI, base64). Özel yarısı belgede açıktır; üretimde bu anahtarla imzalamak herkesin sahte belge
 * üretebilmesi demektir, bu yüzden NODE_ENV=production iken reddedilir. Testler kendi anahtarını bu kümeye ekleyerek sınar.
 */
export const KNOWN_TEST_PUBLIC_KEYS: Set<string> = new Set([
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAERRoh1lkW+t/CwVpEtub3sT0sl8Y2rcSTsiq9UKITzj1+RBqM8vBrcS+D2VrTNoF/gVhdovmtigIOZZp7s/zrsg==",
]);

/**
 * İmza anahtarı döndürme (Burak Ş12; B1/B2). SyncPass Masaüstü K1 sürümü İKİ genel anahtar kabul eder (eski + yeni). Sunucu
 * `appVersion` bu eşiğe eşit ya da büyükse YENİ anahtarla (LICENSE_SIGNING_KEY_V2), eski/bilinmeyen sürümlere ESKİ anahtarla imzalar.
 * V2 ortam değişkeni tanımlı değilse hep eski anahtar kullanılır (anahtar üretilip dağıtılana dek davranış değişmez).
 * Eşik, masaüstü K1 sürüm numarası kesinleşince Yasin/masaüstü hattıyla teyit edilir (şimdilik 1.5.0 varsayımı).
 */
export const SYNCPASS_KEY_V2_ENV = "LICENSE_SIGNING_KEY_V2";
export const SYNCPASS_KEY_V2_MIN_APP_VERSION = "1.5.0";

/** "1.5.0" / "1.5.0-beta" gibi sürümü sayı üçlüsüne çevirir; çözülemezse null. */
function parseVersion(v: unknown): [number, number, number] | null {
  if (typeof v !== "string") return null;
  const m = /^(\d{1,4})(?:\.(\d{1,4}))?(?:\.(\d{1,4}))?/.exec(v.trim());
  return m ? [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)] : null;
}

export function appVersionAtLeast(v: unknown, min: string): boolean {
  const a = parseVersion(v);
  const b = parseVersion(min);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return true;
}

export function signingKeyEnvName(product: Product, env: Env, appVersion?: string | null): string {
  if (product === "syncpass_desktop" && env[SYNCPASS_KEY_V2_ENV] && appVersionAtLeast(appVersion, SYNCPASS_KEY_V2_MIN_APP_VERSION)) {
    return SYNCPASS_KEY_V2_ENV;
  }
  return PRODUCTS[product].keyEnv;
}

function privateKeyFor(product: Product, env: Env, appVersion?: string | null) {
  const envName = signingKeyEnvName(product, env, appVersion);
  const b64 = env[envName];
  if (!b64) throw new SigningNotConfigured(`${envName} tanımlı değil`);
  const key = createPrivateKey({ key: Buffer.from(b64, "base64"), format: "der", type: "pkcs8" });
  if (env.NODE_ENV === "production") {
    const spki = createPublicKey(key).export({ format: "der", type: "spki" }).toString("base64");
    if (KNOWN_TEST_PUBLIC_KEYS.has(spki)) throw new SigningNotConfigured(`${envName} bilinen bir TEST anahtarı; üretimde kullanılamaz`);
  }
  return key;
}

/**
 * Uygulamanın çevrimdışı doğruladığı belge: base64url(JSON) + "." + base64url(imza). İmza gövdenin base64url METNİ üzerindedir.
 * SyncPass: Ed25519, gövde {v, lid, plan, dev, exp, iat} (değişmez). AreaPilot: ECDSA P-256/SHA-256, imza IEEE P1363 (r||s, 64 bayt),
 * gövde {v, lid, product, plan, dev, exp, maxDevices, iat}.
 */
export function signLicenseToken(product: Product, input: TokenInput, opts: { env?: Env; now?: number; appVersion?: string | null } = {}): string {
  const env = opts.env ?? process.env;
  const key = privateKeyFor(product, env, opts.appVersion);
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

/**
 * Depo işlevleri veritabanı hatasında FIRLATIR (hata "kayıt yok" gibi görünmemeli: yoksa gerçek bir müşteriye 404 invalid_key
 * denir). Çekirdek fırlatmayı 500 server_error'a çevirir.
 */
export interface LicenseStore {
  /** Kayıt yoksa null; veritabanı hatasında fırlatır. */
  findLicense(key: string, product: Product): Promise<LicenseRow | null>;
  /**
   * Cihazı ATOMİK kaydeder: kilit altında "zaten kayıtlı mı / sayı sınırı dolu mu / ekle" tek adımda yapılır, böylece eşzamanlı
   * istekler sınırı aşamaz. Kayıtlıysa yalnız last_seen/sürümü günceller. Sınır max_devices'a (lisans satırından, kilit altında) göre.
   */
  registerDevice(licenseId: string, deviceId: string, appVersion: string | null, nowIso: string): Promise<"ok" | "limit">;
  /** Yalnız KAYITLI cihazın last_seen/sürümünü günceller; cihaz kayıtlı değilse false (yeni cihaz eklemez). */
  touchDevice(licenseId: string, deviceId: string, appVersion: string | null, nowIso: string): Promise<boolean>;
  /**
   * Cihazı siler (kayıtsızsa da başarılı). `limit` verilirse (AreaPilot) kaldırmayı sayar ve ATOMİK uygular: lisans başına son
   * DEACTIVATE_WINDOW_DAYS günde `limit` kaldırma yapıldıysa hiçbir şey silmeden "limit" döner. `limit` null ise (SyncPass) sınır
   * ve sayaç yoktur. Hatada fırlatır.
   */
  removeDevice(licenseId: string, deviceId: string, nowIso: string, limit: number | null): Promise<"ok" | "limit">;
  /** Cihaz bu lisansta kayıtlı mı (salt okur; durum sorgusu için). Hatada fırlatır. */
  hasDevice(licenseId: string, deviceId: string): Promise<boolean>;
  /**
   * Bu lisansta daha önce bir cihaz GERÇEKTEN kaldırıldı mı (sp_license_removals'ta satır var mı; kayıtsız cihaz kaldırma satır bırakmaz).
   * Durum sorgusunda device_registered:false yalnız böyle bir iz varsa söylenir; iz yoksa alan hiç gelmez. Hatada fırlatır.
   */
  hasRemovalTrace(licenseId: string): Promise<boolean>;
  /**
   * Cihaz sıfırlamada DEĞİŞTİRİLMİŞ eski kodun sahibi lisans (yoksa null). Yalnız durum sorgusunda kullanılır: sıfırlanan kodla
   * etkinleştirilmiş bilgisayar, kodu "bulunamadı" (404, düşme yok) yerine "bu cihaz kayıtlı değil" diye öğrensin. Hatada fırlatır.
   */
  findRetiredKeyOwner(key: string, product: Product): Promise<LicenseRow | null>;
  /**
   * E-postayla cihaz sıfırlama için tek kullanımlık belirteç kaydeder (YALNIZ SHA-256 özeti, dil de saklanır). Hiçbir şey yazmadan
   * false döner: (a) lisans için son `minIntervalMs` içinde belirteç üretildiyse (saatte 1), (b) son RESET_WINDOW_DAYS günde
   * RESET_LIMIT sıfırlama yapıldıysa (e-posta numaralandırması sızmasın diye çağıran ikisini ayırt etmez). Atomik. Hatada fırlatır.
   */
  createResetToken(licenseId: string, tokenHash: string, expiresIso: string, nowIso: string, minIntervalMs: number, lang: ResetLang): Promise<boolean>;
  /** Gönderim başarısızsa belirteci siler; böylece saatlik hak harcanmaz. */
  deleteResetToken(tokenHash: string): Promise<void>;
  /**
   * Belirteç geçerliyse (var, kullanılmamış, süresi dolmamış) TEK ADIMDA: lisansın kodunu `newKey` ile DEĞİŞTİRİR (eski kod artık
   * bulunamaz), TÜM cihazlarını siler, sıfırlamayı sayar ve belirteci kullanılmış yapar. Son RESET_WINDOW_DAYS günde RESET_LIMIT
   * sıfırlama yapıldıysa hiçbir şey değiştirmeden "limit" döner (belirteç yakılır). Hatada fırlatır.
   */
  consumeResetToken(tokenHash: string, nowIso: string, newKey: string): Promise<ResetOutcome>;
}

export type ResetOutcome = { result: "invalid" } | { result: "limit" } | { result: "ok"; email: string | null; lang: ResetLang };

/** Durum yanıtında imzalanan (istemciyi düşürebilen) durumlar. */
const ENDING_STATUSES: ReadonlySet<string> = new Set(["refunded", "canceled", "revoked"]);

/**
 * Durum yanıtı imzası: HMAC-SHA256, anahtar = istemcinin zaten bildiği lisans kodu (yeni sır yok), hex. İleti: sürüm etiketi, durum,
 * device_registered ("true" | "false" | "-" alan yok) ve cihaz no. İstemci (LicenseClient) aynı iletiyi kurar ve YALNIZ düşürme
 * yanıtlarında imzayı doğrular; imzasız düşürme yanıtını yok sayar.
 */
export function statusSignature(key: string, status: string, deviceRegistered: boolean | undefined, deviceId: string): string {
  const dr = deviceRegistered === undefined ? "-" : deviceRegistered ? "true" : "false";
  const message = ["areapilot-status-v1", status, dr, deviceId].join("\n");
  return createHmac("sha256", key).update(message, "utf8").digest("hex");
}

/** Durum yanıtı gövdesi: yalnız refunded/canceled/revoked ya da device_registered:false ise imzalanır; active yanıtlar imzasız kalır. */
export function statusBody(key: string, deviceId: string, status: LicenseStatus, deviceRegistered: boolean | undefined): Record<string, unknown> {
  const body: Record<string, unknown> = { status };
  if (deviceRegistered !== undefined) body.device_registered = deviceRegistered;
  if (ENDING_STATUSES.has(status) || deviceRegistered === false) body.sig = statusSignature(key, status, deviceRegistered, deviceId);
  return body;
}

export type LicenseOp = "activate" | "renew" | "deactivate" | "status";
export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
}

const UUID = /^[0-9a-f-]{36}$/i;

/** Kaldırma sınırı: lisans başına bu kadar gün içinde en çok bu kadar "bu bilgisayardan kaldır". */
export const DEACTIVATE_LIMIT = 3;
export const DEACTIVATE_WINDOW_DAYS = 30;

function storeFailed(product: Product, e?: unknown): ApiResult {
  // Ayrıntı (kod, anahtar, e-posta içerebilir) yazılmaz; yalnız hata sınıfı.
  console.error("license store", product, e instanceof Error ? e.constructor.name : "error");
  return { status: 500, body: { error: "server_error" } };
}

export async function handleLicenseRequest(
  op: LicenseOp,
  product: Product,
  rawBody: unknown,
  store: LicenseStore,
  opts: {
    env?: Env;
    now?: number;
    /**
     * Play kaynaklı satırda (source play/play_test) Google'a yeniden sorma kancası (Burak Ş8): satır 24 saatten bayatsa durumu tazeler.
     * Yalnız activate/renew'de çağrılır; Paddle satırlarında kanca satırı DEĞİŞTİRMEDEN döndürmelidir. Fırlatırsa kayıtlı durumla
     * devam edilir (süre uzatılmaz).
     */
    playRefresh?: (license: LicenseRow, now: number) => Promise<LicenseRow>;
  } = {}
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

  const now = opts.now ?? Date.now();
  let license: LicenseRow;
  let until = 0;
  try {
    const found = await store.findLicense(key, product);
    if (!found) {
      if (op === "status") {
        // Sıfırlamada değiştirilmiş eski kod: lisans var ama bu kodla artık hiçbir cihaz kayıtlı değil (Yasin kararı K11 = a).
        const owner = await store.findRetiredKeyOwner(key, product);
        if (owner) return { status: 200, body: statusBody(key, deviceId, owner.status, false) };
      }
      return { status: 404, body: { error: "invalid_key" } };
    }
    license = found;

    if (op === "deactivate") {
      // Lisans başına kayan pencerede en çok DEACTIVATE_LIMIT kaldırma: kodu paylaşıp cihaz döndürmeyi (sınırı atlatmayı) kısıtlar.
      const limit = PRODUCTS[product].deactivateLimited ? DEACTIVATE_LIMIT : null;
      if ((await store.removeDevice(license.id, deviceId, new Date(now).toISOString(), limit)) === "limit") {
        return { status: 429, body: { error: "deactivate_limit", limit: DEACTIVATE_LIMIT, windowDays: DEACTIVATE_WINDOW_DAYS } };
      }
      return { status: 200, body: { ok: true } };
    }

    if (op === "status") {
      // Salt okur durum sorgusu (AreaPilot süresiz belge; istemci 7 günde bir sorar). Belge üretmez, cihaz eklemez/güncellemez,
      // süre uzatmaz. İstemci YALNIZ refunded/canceled/revoked ya da device_registered=false yanıtında lisansı düşürür; başka her
      // şeyde (ağ, 5xx, 404, bozuk yanıt) çalışır. device_registered eski istemcilerce yok sayılır (geriye uyumlu ek alan).
      // device_registered: kayıtlıysa true; kayıtlı değilse YALNIZ bu lisansta gerçek bir cihaz kaldırma izi varsa false (kaldırılan/
      // sıfırlanan cihazın kopyası düşsün); iz yoksa alan hiç gelmez (istemci için "bilinmiyor": düşme yok).
      let registered: boolean | undefined;
      if (await store.hasDevice(license.id, deviceId)) registered = true;
      else if (await store.hasRemovalTrace(license.id)) registered = false;
      return { status: 200, body: statusBody(key, deviceId, license.status, registered) };
    }

    if (opts.playRefresh && (license.source === "play" || license.source === "play_test")) {
      // Hata "Google'a ulaşılamadı" demektir: kayıtlı durum geçerli kalır, süre uzatılmaz. Hata ayrıntısı yazılmaz (jeton sızmasın).
      license = await opts.playRefresh(license, now).catch(() => license);
    }

    const entitled = entitlementUntil(license, now);
    if (!entitled) return { status: 403, body: { error: "inactive", status: license.status } };
    until = entitled;

    const nowIso = new Date(now).toISOString();
    if (op === "renew") {
      if (!(await store.touchDevice(license.id, deviceId, appVersion, nowIso))) return { status: 404, body: { error: "device_unknown" } };
    } else if ((await store.registerDevice(license.id, deviceId, appVersion, nowIso)) === "limit") {
      return { status: 409, body: { error: "device_limit", maxDevices: license.max_devices } };
    }
  } catch (e) {
    return storeFailed(product, e);
  }

  let token: string;
  try {
    token = signLicenseToken(product, { lid: license.id, plan: license.plan, dev: deviceId, exp: until, maxDevices: license.max_devices }, { env: opts.env, now, appVersion });
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

// ---- E-postayla cihaz sıfırlama ----
// Akış: (1) kod gönderilir -> HER ZAMAN aynı yanıt (e-posta var mı, kod geçerli mi, saatlik/aylık sınır dolu mu belli olmaz);
// gerçek iş yanıttan sonra yapılır. (2) Lisansın kayıtlı e-postasına 30 dk geçerli tek kullanımlık bağlantı gider (belirteç
// bağlantının #fragment kısmındadır: sunucu günlüğüne ve Referer'a düşmez). (3) Sayfadaki düğme POST eder (GET işlem yapmaz:
// posta tarayıcıları bağlantıyı önceden açar). (4) Onayda lisans kodu YENİLENİR (sızan kod işe yaramaz), cihazlar silinir, yeni
// kod sayfada bir kez gösterilir ve e-postayla da gönderilir. Lisans başına 30 günde en çok 2 sıfırlama.

export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
export const RESET_MIN_INTERVAL_MS = 60 * 60 * 1000;
export const RESET_LIMIT = 2;
export const RESET_WINDOW_DAYS = 30;
export const RESET_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export type ResetLang = "tr" | "en";
export interface ResetMailer {
  /** RESEND_API_KEY + MAIL_FROM tanımlı mı. Değilse belirteç hiç üretilmez (kimseye ulaşamayacak bağlantı yakılmaz). */
  configured(): boolean;
  /** Sıfırlama bağlantısını gönderir; başarısızlıkta fırlatır. Adres/belirteç günlüğe yazılmaz. */
  sendLink(to: string, token: string, lang: ResetLang): Promise<void>;
  /** Yeni lisans kodunu gönderir; başarısızlıkta fırlatır (çağıran yutar: kod sayfada da görünür). */
  sendNewKey(to: string, key: string, lang: ResetLang): Promise<void>;
}

export function newResetToken(): string {
  return randomBytes(32).toString("base64url"); // 43 karakter
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type ResetRequestParse = { ok: true; key: string; lang: ResetLang } | { ok: false; result: ApiResult };

/** Eşzamanlı doğrulama: yalnız biçim (veritabanına bakmaz, bu yüzden varlık sızdırmaz). */
export function parseResetRequest(rawBody: unknown, product: Product): ResetRequestParse {
  const body = typeof rawBody === "object" && rawBody !== null ? (rawBody as Record<string, unknown>) : null;
  const key = normalizeKey(body?.key, product);
  if (!key) {
    if (foreignKeyProduct(body?.key, product)) return { ok: false, result: { status: 404, body: { error: "wrong_product" } } };
    return { ok: false, result: { status: 400, body: { error: "bad_request" } } };
  }
  const lang: ResetLang = body?.lang === "en" ? "en" : "tr";
  return { ok: true, key, lang };
}

export const RESET_REQUEST_RESPONSE: ApiResult = { status: 200, body: { ok: true } };

/** Yanıttan SONRA çalışan iş. Hiçbir koşulda fırlatmaz. */
export async function processDeviceReset(
  product: Product,
  key: string,
  lang: ResetLang,
  store: LicenseStore,
  mailer: ResetMailer,
  opts: { now?: number } = {}
): Promise<"sent" | "skipped"> {
  try {
    if (!mailer.configured()) {
      // E-posta ayarı yok: belirteç üretme (hakkı da harcama). Uyarı günlüğü, kod/adres içermez.
      console.warn("license reset: e-posta ayari yok (RESEND_API_KEY/MAIL_FROM), belirtec uretilmedi");
      return "skipped";
    }
    const now = opts.now ?? Date.now();
    const license = await store.findLicense(key, product);
    if (!license || !license.email || !entitlementUntil(license, now)) return "skipped";
    const token = newResetToken();
    const hash = hashResetToken(token);
    const created = await store.createResetToken(
      license.id,
      hash,
      new Date(now + RESET_TOKEN_TTL_MS).toISOString(),
      new Date(now).toISOString(),
      RESET_MIN_INTERVAL_MS,
      lang
    );
    if (!created) return "skipped";
    try {
      await mailer.sendLink(license.email, token, lang);
    } catch (e) {
      // Gönderilemedi: bağlantı kimseye ulaşmadı; belirteci sil ve saatlik hakkı harcama.
      await store.deleteResetToken(hash).catch(() => undefined);
      console.error("license reset mail", product, e instanceof Error ? e.constructor.name : "error");
      return "skipped";
    }
    return "sent";
  } catch (e) {
    console.error("license reset", product, e instanceof Error ? e.constructor.name : "error");
    return "skipped";
  }
}

/**
 * Bağlantıdaki belirteçle sıfırlar: lisans kodu yenilenir, cihazlar silinir. 200 {ok, key} (yeni kod; sayfada bir kez gösterilir),
 * 410 geçersiz/kullanılmış/süresi dolmuş, 429 reset_limit (30 günde 2 doldu: destekle iletişim).
 * Eski kodla renew/activate bundan sonra 404 invalid_key alır (bilinçli: sızan kod işe yaramaz).
 */
export async function confirmDeviceReset(
  rawToken: unknown,
  product: Product,
  store: LicenseStore,
  mailer: ResetMailer,
  opts: { now?: number } = {}
): Promise<ApiResult> {
  if (typeof rawToken !== "string" || !RESET_TOKEN_PATTERN.test(rawToken)) return { status: 400, body: { error: "bad_request" } };
  let outcome: ResetOutcome;
  const newKey = newLicenseKey(product);
  try {
    outcome = await store.consumeResetToken(hashResetToken(rawToken), new Date(opts.now ?? Date.now()).toISOString(), newKey);
  } catch (e) {
    console.error("license reset confirm", e instanceof Error ? e.constructor.name : "error");
    return { status: 500, body: { error: "server_error" } };
  }
  if (outcome.result === "invalid") return { status: 410, body: { error: "token_invalid" } };
  if (outcome.result === "limit") return { status: 429, body: { error: "reset_limit", limit: RESET_LIMIT, windowDays: RESET_WINDOW_DAYS } };
  if (outcome.email && mailer.configured()) {
    try {
      await mailer.sendNewKey(outcome.email, newKey, outcome.lang);
    } catch (e) {
      // Gönderim başarısız: sayfadaki kod yine görünür.
      console.error("license reset new key mail", e instanceof Error ? e.constructor.name : "error");
    }
  }
  return { status: 200, body: { ok: true, key: newKey } };
}
