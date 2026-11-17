// Play lisans çekirdeği ("tek lisans, 3 cihaz" K1 sunucusu): Play satın alma jetonunu Google'a doğrulatır, jeton zincirini TEK lisans
// satırına bağlar, iade/iptal/süre bitimini satıra yayar. Saf dosya (birim testli: tests/play-claim.test.ts): Next/server-only/Supabase yok;
// Google erişimi (PlayVerifier) ve veritabanı (PlayStore) dışarıdan verilir. Sözleşme: web/docs/tek-lisans-k1-sozlesme.md.
// Burak ön kapısı: D:\Development\OstlerTech\guvenlik\bulgular\2026-11-14-syncpass-tek-lisans-sunucu-on-kapi.md (Ş1-Ş24).
//
// KURALLAR: jeton hiçbir yanıtta ve günlükte yok (Ş5); paket adı sunucu sabiti (Ş1); plan/cihaz sayısı yalnız katalogdan (Ş2);
// Google'a ulaşılamazsa HİÇBİR satır "geçersiz" sayılmaz (Ş15); kasa verisi bu uca hiç gelmez.
import { createHash } from "node:crypto";
import { entitlementUntil, type ApiResult, type LicenseRow, type LicenseStatus } from "./license-core.ts";
import { PLAY_PACKAGE_NAME, PLAY_PRODUCTS, playProduct, type PlayKind } from "./play-catalog.ts";
import type { LicensePlan } from "./paddle-tiers";

const DAY = 24 * 60 * 60 * 1000;
/** Bir lisans için Google'a günde en çok 1 sorgu (Ş8: activate taşkını Google kotasına yansımaz). */
export const PLAY_STALE_MS = DAY;
/** Test satın alması (Ş4) en çok bu kadar hak verir. */
export const PLAY_TEST_GRANT_MS = 14 * DAY;
/** Google çağrılarında zaman aşımı (Ş15). */
export const PLAY_TIMEOUT_MS = 8000;
/** İptal edilen satın alma listesinde geriye bakılan pencere: Google'ın sınırı 30 gün (D7: cron günlerce düşse de iadeler kaçmasın). */
export const VOIDED_WINDOW_MS = 30 * DAY;
/**
 * Google "startTime 30 günden eski olamaz" der ve sınırı İSTEK VARDIĞINDA kendi saatiyle uygular. Adres erişim belirteci alımından ÖNCE kurulduğu
 * için tam "şimdi - 30 gün" her zaman sınırı birkaç sn aşıp 400 aldı (2026-11-17, Burak). Pay saat farkını ve belirteç gecikmesini kapatır;
 * günlük cron için 29 gün 23 saatlik pencere iadeyi kaçırmaz (D7 sözleşmesi: pencere yine ~30 gün).
 */
export const VOIDED_START_MARGIN_MS = 60 * 60 * 1000;
/** İptal listesi için Google'a gönderilen başlangıç (sınırın İÇİNDE). Tarama ve sağlık ucu aynı değeri kullanır. */
export function voidedStartTime(nowMs: number): number {
  return nowMs - VOIDED_WINDOW_MS + VOIDED_START_MARGIN_MS;
}
export const VOIDED_MAX_PAGES = 10;

export type PlaySource = "play" | "play_test";

/** Play satırı: LicenseRow + Play alanları (hepsi isteğe bağlı alanlar olarak LicenseRow'da tanımlı). */
export type PlayLicenseRow = LicenseRow;

// ---- Google yanıtları (yalnız kullanılan alanlar) ----

export interface GoogleSubscription {
  subscriptionState?: string;
  lineItems?: { productId?: string; expiryTime?: string }[];
  linkedPurchaseToken?: string;
  outOfAppPurchaseContext?: { expiredPurchaseToken?: string };
  /** Lisans test hesabıyla yapılan satın almada VARLIK (içerik boş olabilir). */
  testPurchase?: unknown;
}

export interface GoogleProductPurchase {
  /** 0 satın alındı, 1 iptal/iade, 2 beklemede. */
  purchaseState?: number;
  /** 0 test, 1 promosyon kodu, 2 ödüllü. */
  purchaseType?: number;
  productId?: string;
}

/** bad_request: JETONSUZ iptal listesi çağrısında 400 = bizim isteğimiz hatalı (geçersiz jeton DEĞİL); not_found'a katlanmaz (2026-11-17). */
export type PlayErrorKind = "not_found" | "auth" | "bad_request" | "unavailable";

/** Google çağrısı başarısız. Tür + (varsa) ham HTTP kodu taşır: ayrıntı (jeton içerebilir) tutulmaz. */
export class PlayApiError extends Error {
  readonly kind: PlayErrorKind;
  /** Google'ın döndürdüğü ham HTTP kodu (zaman aşımı/ağ/belirteç hatasında yok). */
  readonly httpStatus?: number;
  constructor(kind: PlayErrorKind, httpStatus?: number) {
    super(`play api: ${kind}`);
    this.kind = kind;
    this.httpStatus = httpStatus;
  }
}

/** Google hata gövdesinden günlüğe yazılabilir kısım (D3). Jeton, erişim belirteci ve uzun belirteç benzeri her dizi çıkarılmıştır. */
export interface GoogleErrorInfo {
  call: string;
  http: number;
  status?: string;
  reason?: string;
  message?: string;
}

const LOG_MESSAGE_MAX = 200;

/** Metni günlüğe uygun hâle getirir: bilinen sırlar ve 32+ karakterlik belirteç benzeri diziler "[x]" olur, uzunluk sınırlanır. */
export function sanitizeForLog(text: string, secrets: string[]): string {
  let out = text;
  for (const sec of secrets) {
    if (sec.length >= 4) out = out.split(sec).join("[x]").split(encodeURIComponent(sec)).join("[x]");
  }
  // B3: sipariş numarası (GPA.dddd-dddd-dddd-ddddd, ..N ekli biçim dahil) ve e-posta adresi hata mesajında yankılanırsa maskelenir.
  out = out.replace(/GPA\.\d{4}-\d{4}-\d{4}-\d{5}(?:\.\.\d+)?/gi, "[x]").replace(/[^\s@<>"']+@[^\s@<>"']+/g, "[x]");
  out = out.replace(/[A-Za-z0-9._~+\/=-]{32,}/g, "[x]").replace(/[\u0000-\u001f\u007f]+/g, " ");
  return out.slice(0, LOG_MESSAGE_MAX);
}

export function extractGoogleError(call: string, http: number, body: unknown, secrets: string[]): GoogleErrorInfo {
  const info: GoogleErrorInfo = { call, http };
  const e = typeof body === "object" && body !== null ? (body as { error?: unknown }).error : undefined;
  if (typeof e !== "object" || e === null) return info;
  const err = e as { status?: unknown; message?: unknown; errors?: unknown };
  if (typeof err.status === "string") info.status = sanitizeForLog(err.status, secrets).slice(0, 64);
  if (typeof err.message === "string") info.message = sanitizeForLog(err.message, secrets);
  const first = Array.isArray(err.errors) ? (err.errors[0] as { reason?: unknown } | undefined) : undefined;
  if (first && typeof first.reason === "string") info.reason = sanitizeForLog(first.reason, secrets).slice(0, 64);
  return info;
}

export interface VoidedPage {
  tokens: string[];
  nextPageToken?: string;
}

/** Google Play Developer API arayüzü (gerçek: lib/server/play-api.ts; testte sahte). Hata durumunda PlayApiError fırlatır. */
export interface PlayVerifier {
  getSubscription(purchaseToken: string): Promise<GoogleSubscription>;
  getProduct(productId: string, purchaseToken: string): Promise<GoogleProductPurchase>;
  listVoided(startTimeMs: number, pageToken?: string): Promise<VoidedPage>;
}

// ---- Google HTTP istemcisi (saf: fetch ve erişim belirteci dışarıdan) ----

const API_BASE = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications";

/** Çağrı adresleri. Paket adı HER ZAMAN sunucu sabiti (Ş1); istemciden hiçbir şey adrese girmez. */
export function subscriptionUrl(purchaseToken: string): string {
  return `${API_BASE}/${PLAY_PACKAGE_NAME}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;
}
export function productUrl(productId: string, purchaseToken: string): string {
  return `${API_BASE}/${PLAY_PACKAGE_NAME}/purchases/products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}`;
}
export function voidedUrl(startTimeMs: number, pageToken?: string): string {
  const q = new URLSearchParams({ startTime: String(Math.floor(startTimeMs)), type: "1", maxResults: "1000" });
  if (pageToken) q.set("token", pageToken);
  return `${API_BASE}/${PLAY_PACKAGE_NAME}/purchases/voidedpurchases?${q.toString()}`;
}

export type FetchLike = (url: string, init: { method: "GET"; headers: Record<string, string>; signal: AbortSignal }) => Promise<{
  status: number;
  json(): Promise<unknown>;
}>;

export interface HttpVerifierOptions {
  fetch: FetchLike;
  /** Kısa ömürlü OAuth erişim belirteci (OIDC federasyonu). Alınamazsa fırlatır -> "auth" sayılır. */
  accessToken: () => Promise<string>;
  timeoutMs?: number;
  /** D3: 200 olmayan Google yanıtının (sır ayıklanmış) nedeni. Verilmezse hiçbir şey yazılmaz. */
  onGoogleError?: (info: GoogleErrorInfo) => void;
}

/**
 * HTTP durumunu hata türüne çevirir: 404/410 (ve JETONLU çağrıda 400) geçersiz jeton, 401/403 yetki, kalan her şey (429/5xx/ağ) ulaşılamadı.
 * `tokenless` (iptal listesi): orada 400 geçersiz jeton olamaz, "bad_request" (bizim istek hatalı) olur.
 */
export function classifyStatus(status: number, tokenless = false): PlayErrorKind {
  if (status === 400 && tokenless) return "bad_request";
  if (status === 404 || status === 410 || status === 400) return "not_found";
  if (status === 401 || status === 403) return "auth";
  return "unavailable";
}

export function createHttpVerifier(opts: HttpVerifierOptions): PlayVerifier {
  const timeoutMs = opts.timeoutMs ?? PLAY_TIMEOUT_MS;
  async function getJson(url: string, call: string, secrets: string[] = [], tokenless = false): Promise<unknown> {
    // D3: erişim belirteci alımı (OIDC + STS + iamcredentials) da AYNI süre sınırının içinde; asılırsa "ulaşılamadı" (503), "auth" değil.
    let bearer: string;
    let tokenTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      bearer = await Promise.race([
        opts.accessToken(),
        new Promise<never>((_, reject) => {
          tokenTimer = setTimeout(() => reject(new PlayApiError("unavailable")), timeoutMs);
        }),
      ]);
    } catch (e) {
      if (e instanceof PlayApiError) throw e;
      throw new PlayApiError("auth");
    } finally {
      clearTimeout(tokenTimer);
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await opts.fetch(url, { method: "GET", headers: { Authorization: `Bearer ${bearer}`, Accept: "application/json" }, signal: ctrl.signal });
      if (res.status !== 200) {
        if (opts.onGoogleError) {
          let body: unknown = null;
          try {
            body = await res.json();
          } catch {
            // gövde yok/bozuk: yalnız kod yazılır
          }
          try {
            opts.onGoogleError(extractGoogleError(call, res.status, body, [...secrets, bearer]));
          } catch {
            // günlük hatası çağrıyı bozmaz
          }
        }
        throw new PlayApiError(classifyStatus(res.status, tokenless), res.status);
      }
      return await res.json();
    } catch (e) {
      if (e instanceof PlayApiError) throw e;
      throw new PlayApiError("unavailable"); // zaman aşımı, ağ hatası, bozuk gövde
    } finally {
      clearTimeout(timer);
    }
  }
  return {
    async getSubscription(token) {
      return (await getJson(subscriptionUrl(token), "subscriptionsv2", [token])) as GoogleSubscription;
    },
    async getProduct(productId, token) {
      return (await getJson(productUrl(productId, token), "products", [token])) as GoogleProductPurchase;
    },
    async listVoided(startTimeMs, pageToken) {
      const j = (await getJson(voidedUrl(startTimeMs, pageToken), "voidedpurchases", pageToken ? [pageToken] : [], true)) as {
        voidedPurchases?: { purchaseToken?: unknown }[];
        tokenPagination?: { nextPageToken?: unknown };
      };
      const tokens = (j.voidedPurchases ?? []).map((v) => v.purchaseToken).filter((t): t is string => typeof t === "string" && t.length > 0);
      const next = j.tokenPagination?.nextPageToken;
      return { tokens, nextPageToken: typeof next === "string" && next ? next : undefined };
    },
  };
}

// ---- Depo arayüzü ----

export interface StatePatch {
  status: LicenseStatus;
  current_period_end: string | null;
  play_state: string;
  plan: LicensePlan;
  play_product_id: string;
}

export interface ClaimParams {
  tokenHash: string;
  /** Ham jeton: yalnız satıra yazılır (yeniden sorgu için). Yanıta/günlüğe girmez. */
  token: string;
  linkedHash: string | null;
  productId: string;
  plan: LicensePlan;
  maxDevices: number;
  source: PlaySource;
  status: LicenseStatus;
  periodEnd: string | null;
  playState: string;
  nowIso: string;
  newKey: string;
  allowCreate: boolean;
}

export type ClaimResult =
  | { result: "none" }
  | { result: "ok"; license: PlayLicenseRow; created: boolean; chained: boolean; merged: boolean; superseded: boolean }
  /** İki satır çakıştı ve yeni satırın cihazı var: otomatik birleştirme yapılmadı, günlüğe "elle bak" yazılır. */
  | { result: "manual"; license: PlayLicenseRow };

export type VoidedMark = "marked" | "unknown" | "superseded" | "already";

/** Veritabanı hatasında FIRLATIR (çekirdek 500/503'e çevirir). */
export interface PlayStore {
  findByTokenHash(hash: string): Promise<{ license: PlayLicenseRow; superseded: boolean } | null>;
  claim(p: ClaimParams): Promise<ClaimResult>;
  updateState(licenseId: string, patch: StatePatch, nowIso: string): Promise<void>;
  /** Jeton AKTİF jetonsa satırı `refunded` yapar; eski (yerine geçilmiş) jetonda dokunmaz. Atomik. */
  markVoided(tokenHash: string, nowIso: string): Promise<VoidedMark>;
  /** Süresi (bitiş + 7 gün pay) geçmiş Play satırlarını 'canceled' yapar; kapatılan sayıyı döndürür (saklama silmesi için bitiş anı yazılsın). */
  expireStale(nowIso: string): Promise<number>;
}

interface Logger {
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
}

export interface PlayDeps {
  verifier: PlayVerifier;
  store: PlayStore;
  newKey: () => string;
  /** PLAY_ACCEPT_TEST_PURCHASES açık mı (Ş4). Varsayılan kapalı. */
  acceptTestPurchases?: boolean;
  now?: () => number;
  log?: Logger;
}

// ---- Biçim denetimi ----

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export interface ParsedClaim {
  token: string;
  productId: string;
  kind: PlayKind;
  appVersion: string | null;
}

/**
 * Gövde yalnız {purchaseToken, productId, kind, appVersion} okur; başka her alan (paket adı, e-posta, hesap kimliği, cihaz no...) YOK SAYILIR (Ş1, Ş6).
 * Biçim hatasında Google'a hiç gidilmez (kota korunur).
 */
export function parseClaimBody(raw: unknown): ParsedClaim | null {
  const b = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : null;
  if (!b) return null;
  const token = b.purchaseToken;
  // Jeton: 1-1024 karakter; kontrol karakteri ve "/" yok (adrese girer). Karakter kümesi Google'dan belgelenmediği için geniş tutuldu.
  if (typeof token !== "string" || token.length < 1 || token.length > 1024 || /[\u0000-\u001f\u007f/\\\s]/.test(token)) return null;
  const info = playProduct(b.productId);
  if (!info || typeof b.productId !== "string") return null;
  if (b.kind !== "subs" && b.kind !== "inapp") return null;
  if (b.kind !== info.kind) return null;
  const appVersion = typeof b.appVersion === "string" ? b.appVersion.slice(0, 32) : null;
  return { token, productId: b.productId, kind: info.kind, appVersion };
}

// ---- Google yanıtını hakka çevirme (Ş3 tablosu) ----

export type PlayDecision =
  | { kind: "invalid" }
  | { kind: "pending" }
  | { kind: "test_blocked" }
  | {
      kind: "state";
      status: LicenseStatus;
      periodEnd: string | null;
      playState: string;
      productId: string;
      plan: LicensePlan;
      maxDevices: number;
      source: PlaySource;
      /** Yeni satır açılabilir mi (şu an hak veriyor mu). */
      grants: boolean;
      linkedToken: string | null;
    };

/** Durum -> satır durumu (burak §1/S6). Play'de CANCELED = süre sonuna kadar hak var (Paddle'daki gibi anında bitmez). */
const SUBSCRIPTION_STATES: Record<string, LicenseStatus | "pending"> = {
  SUBSCRIPTION_STATE_ACTIVE: "active",
  SUBSCRIPTION_STATE_IN_GRACE_PERIOD: "active",
  SUBSCRIPTION_STATE_CANCELED: "canceled",
  SUBSCRIPTION_STATE_ON_HOLD: "paused",
  SUBSCRIPTION_STATE_PAUSED: "paused",
  SUBSCRIPTION_STATE_EXPIRED: "canceled",
  SUBSCRIPTION_STATE_PENDING: "pending",
  SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED: "pending",
  SUBSCRIPTION_STATE_UNSPECIFIED: "pending",
};

function grantsNow(status: LicenseStatus, plan: LicensePlan, periodEnd: string | null, source: PlaySource, now: number): boolean {
  const synthetic: LicenseRow = { id: "x", license_key: "x", product: "syncpass_desktop", plan, status, current_period_end: periodEnd, max_devices: 3, source };
  return entitlementUntil(synthetic, now) !== null;
}

export function mapSubscription(g: GoogleSubscription, now: number, acceptTest: boolean): PlayDecision {
  if (typeof g !== "object" || g === null) return { kind: "invalid" };
  const mapped = typeof g.subscriptionState === "string" && Object.hasOwn(SUBSCRIPTION_STATES, g.subscriptionState) ? SUBSCRIPTION_STATES[g.subscriptionState] : "pending";
  if (mapped === "pending") return { kind: "pending" };
  // Yalnız izin listesindeki ABONELİK ürünleri sayılır (Ş2): yabancı productId hak vermez. Birden çok kalemde en geç bitenin ürünü.
  let best: { productId: string; expiry: number } | null = null;
  for (const li of g.lineItems ?? []) {
    const info = playProduct(li?.productId);
    if (!info || info.kind !== "subs" || typeof li.productId !== "string") continue;
    const expiry = typeof li.expiryTime === "string" ? Date.parse(li.expiryTime) : NaN;
    if (Number.isNaN(expiry)) continue;
    if (!best || expiry > best.expiry) best = { productId: li.productId, expiry };
  }
  if (!best) return { kind: "invalid" };
  const info = PLAY_PRODUCTS[best.productId];
  const isTest = g.testPurchase !== undefined && g.testPurchase !== null;
  if (isTest && !acceptTest) return { kind: "test_blocked" };
  const source: PlaySource = isTest ? "play_test" : "play";
  // Test satın almada hak en çok 14 gün (Ş4); gerçekte de bitiş tarihinden ilerisi verilmez.
  const periodEndMs = isTest ? Math.min(best.expiry, now + PLAY_TEST_GRANT_MS) : best.expiry;
  const periodEnd = new Date(periodEndMs).toISOString();
  const linked = typeof g.linkedPurchaseToken === "string" && g.linkedPurchaseToken ? g.linkedPurchaseToken : typeof g.outOfAppPurchaseContext?.expiredPurchaseToken === "string" && g.outOfAppPurchaseContext.expiredPurchaseToken ? g.outOfAppPurchaseContext.expiredPurchaseToken : null;
  return {
    kind: "state",
    status: mapped,
    periodEnd,
    playState: g.subscriptionState as string,
    productId: best.productId,
    plan: info.plan,
    maxDevices: info.maxDevices,
    source,
    grants: grantsNow(mapped, info.plan, periodEnd, source, now),
    linkedToken: linked,
  };
}

export function mapProduct(g: GoogleProductPurchase, requestedProductId: string, now: number, acceptTest: boolean): PlayDecision {
  if (typeof g !== "object" || g === null) return { kind: "invalid" };
  const info = playProduct(requestedProductId);
  if (!info || info.kind !== "inapp") return { kind: "invalid" };
  // Google yanıtı ürün kimliğini taşıyorsa istenenle aynı olmalı (Ş2).
  if (g.productId !== undefined && g.productId !== requestedProductId) return { kind: "invalid" };
  const state = g.purchaseState;
  if (state === 2 || (state !== 0 && state !== 1)) return { kind: "pending" };
  const isTest = g.purchaseType === 0;
  if (isTest && !acceptTest) return { kind: "test_blocked" };
  const source: PlaySource = isTest ? "play_test" : "play";
  const status: LicenseStatus = state === 0 ? "active" : "refunded";
  // Ömür boyu satırda süre yoktur (null) AMA test satırı 14 günle sınırlıdır (Ş4).
  const periodEnd = isTest ? new Date(now + PLAY_TEST_GRANT_MS).toISOString() : null;
  return {
    kind: "state",
    status,
    periodEnd,
    playState: state === 0 ? "PURCHASED" : "CANCELED",
    productId: requestedProductId,
    plan: info.plan,
    maxDevices: info.maxDevices,
    source,
    grants: grantsNow(status, info.plan, periodEnd, source, now),
    linkedToken: null,
  };
}

function isFresh(row: PlayLicenseRow, now: number): boolean {
  const at = row.play_checked_at ? Date.parse(row.play_checked_at) : NaN;
  return !Number.isNaN(at) && now - at < PLAY_STALE_MS && now >= at;
}

/** Depo hatası iletisi `<yer>: <Postgres kodu>` biçimindedir (yalnız kod taşır). 23505 benzersiz ihlali, 40P01 kilitlenme, 40001 serileştirme. */
export function isRetryableDbError(e: unknown): boolean {
  return e instanceof Error && /: (23505|40P01|40001)$/.test(e.message);
}

function errName(e: unknown): string {
  return e instanceof Error ? e.constructor.name : "error";
}

// ---- POST /api/license/play/claim ----

export async function handlePlayClaim(rawBody: unknown, deps: PlayDeps): Promise<ApiResult> {
  const log: Logger = deps.log ?? console;
  const now = (deps.now ?? Date.now)();
  const nowIso = new Date(now).toISOString();
  const acceptTest = deps.acceptTestPurchases === true;

  const parsed = parseClaimBody(rawBody);
  if (!parsed) return { status: 400, body: { error: "bad_request" } };
  const hash = hashToken(parsed.token);

  const ok = (row: PlayLicenseRow): ApiResult => {
    const until = entitlementUntil(row, now);
    if (until === null) return { status: 403, body: { error: "inactive", status: row.status } };
    // Jeton, Google ham yanıtı, sipariş no ve e-posta ASLA dönmez (Ş5).
    return { status: 200, body: { key: row.license_key, plan: row.plan, maxDevices: row.max_devices, source: "play" } };
  };

  try {
    // 2) Önce yerel arama: taze satır varsa Google'a gitmeden döner. Yerine geçilmiş (eski) jeton Google'a hiç sorulmaz.
    const local = await deps.store.findByTokenHash(hash);
    if (local && (local.superseded || isFresh(local.license, now))) return ok(local.license);

    // 3) Google: tek çağrı, istemcinin türüne göre.
    let decision: PlayDecision;
    try {
      decision =
        parsed.kind === "subs"
          ? mapSubscription(await deps.verifier.getSubscription(parsed.token), now, acceptTest)
          : mapProduct(await deps.verifier.getProduct(parsed.productId, parsed.token), parsed.productId, now, acceptTest);
    } catch (e) {
      if (e instanceof PlayApiError) {
        if (e.kind === "not_found") return { status: 404, body: { error: "invalid_purchase" } };
        if (e.kind === "auth") {
          log.error("play claim", "play auth"); // yalnız sınıf
          return { status: 503, body: { error: "not_configured" } };
        }
        return { status: 503, body: { error: "verify_unavailable" } };
      }
      log.error("play claim", errName(e));
      return { status: 503, body: { error: "verify_unavailable" } };
    }

    if (decision.kind === "invalid") return { status: 404, body: { error: "invalid_purchase" } };
    if (decision.kind === "pending") return { status: 409, body: { error: "pending" } };
    if (decision.kind === "test_blocked") return { status: 403, body: { error: "test_purchase" } };

    // 7) Atomik kayıt. Yeni satır yalnız şu an hak veren satın almada açılır; mevcut satır (aynı jeton ya da zincir) her durumda güncellenir.
    const claimParams = {
      tokenHash: hash,
      token: parsed.token,
      linkedHash: decision.linkedToken ? hashToken(decision.linkedToken) : null,
      productId: decision.productId,
      plan: decision.plan,
      maxDevices: decision.maxDevices,
      source: decision.source,
      status: decision.status,
      periodEnd: decision.periodEnd,
      playState: decision.playState,
      nowIso,
      newKey: deps.newKey(),
      allowCreate: decision.grants,
    };
    // Gerçek Postgres'te çok bağlantılı yarış: benzersiz indeks kaybeden isteği 23505, kilit döngüsü 40P01 ile düşürür; bir kez yeniden dene (D5).
    let outcome: ClaimResult;
    try {
      outcome = await deps.store.claim(claimParams);
    } catch (e) {
      if (!isRetryableDbError(e)) throw e;
      outcome = await deps.store.claim(claimParams);
    }
    if (outcome.result === "none") return { status: 403, body: { error: "inactive", status: decision.status } };
    if (outcome.result === "manual") {
      // İki satır, yeni satırın cihazı var: otomatik birleştirme yok. Günlükte yalnız lisans kimliği (jeton/kod/e-posta yok).
      log.warn("play claim: iki lisans satiri, elle bak", { license: outcome.license.id });
    }
    return ok(outcome.license);
  } catch (e) {
    log.error("play claim store", errName(e));
    return { status: 500, body: { error: "server_error" } };
  }
}

// ---- activate/renew kancası (Ş8) ----

/**
 * Play satırı 24 saatten bayatsa Google'a yeniden sorar, durumu tazeler ve güncel satırı döndürür. Google'a ulaşılamazsa FIRLATIR
 * (çağıran kayıtlı durumla devam eder; süre uzatılmaz). İptal edilmiş/iade satırı tekrar Google'a sorulmaz (iade bitiş durumudur).
 */
export async function refreshPlayLicense(row: PlayLicenseRow, deps: PlayDeps, nowMs?: number): Promise<PlayLicenseRow> {
  const log: Logger = deps.log ?? console;
  const now = nowMs ?? (deps.now ?? Date.now)();
  if (row.source !== "play" && row.source !== "play_test") return row;
  if (row.status === "refunded" || row.status === "revoked") return row;
  if (isFresh(row, now)) return row;
  const token = row.play_purchase_token;
  const info = playProduct(row.play_product_id);
  if (!token || !info) return row;
  const acceptTest = deps.acceptTestPurchases === true;

  let decision: PlayDecision;
  try {
    decision =
      info.kind === "subs"
        ? mapSubscription(await deps.verifier.getSubscription(token), now, acceptTest)
        : mapProduct(await deps.verifier.getProduct(row.play_product_id as string, token), row.play_product_id as string, now, acceptTest);
  } catch (e) {
    if (e instanceof PlayApiError && e.kind === "not_found") {
      // Beklenmedik: ödeyen müşteriyi tek bir 404'e bakıp düşürme. Kayıtlı durum korunur.
      log.warn("play refresh: jeton Google'da bulunamadi, kayitli durum korundu", { license: row.id });
      return row;
    }
    throw e instanceof PlayApiError ? e : new PlayApiError("unavailable");
  }
  if (decision.kind !== "state") return row; // pending/invalid/test_blocked: durum değişmez

  // Test satırı süre UZATMAZ: yalnız durum değişebilir, bitiş mevcut değerde kalır (Ş4).
  const periodEnd = row.source === "play_test" ? row.current_period_end : decision.periodEnd;
  const patch: StatePatch = { status: decision.status, current_period_end: periodEnd, play_state: decision.playState, plan: decision.plan, play_product_id: decision.productId };
  await deps.store.updateState(row.id, patch, new Date(now).toISOString());
  return { ...row, status: decision.status, current_period_end: periodEnd, plan: decision.plan, play_product_id: decision.productId, play_state: decision.playState, play_checked_at: new Date(now).toISOString() };
}

// ---- Günlük iptal listesi taraması (Ş9) ----

export interface VoidedSweepResult {
  seen: number;
  marked: number;
  /** İptal listesi adımının sonucu: "ok" ya da hata türü. Hata olsa da süre bitimi kapatması (expired) ayrıca koşar (D4). */
  voided: "ok" | PlayErrorKind;
  /** Hata varsa Google'ın ham HTTP kodu (yoksa undefined). */
  voidedHttp?: number;
  /** Süresi dolup kapatılan satır sayısı (iptal listesi iadeyi gösterir, doğal süre bitimini göstermez). */
  expired: number;
}

/**
 * İptal edilen satın alma listesi (yaklaşık son 30 gün; başlangıç Google sınırının İÇİNDE, bkz. voidedStartTime). Eşleşen AKTİF jetonlu satır
 * `refunded` olur; eski (yerine geçilmiş) jeton yeni aboneliği düşürmez. Google hatası FIRLATILMAZ: sonuçta `voided` hata türünü taşır
 * (çağıran 503 döner). Süre bitimi kapatması iptal listesinin başarısına BAĞLI DEĞİLDİR (D4); depo (DB) hatası fırlatır.
 */
export async function sweepVoidedPurchases(deps: PlayDeps): Promise<VoidedSweepResult> {
  const now = (deps.now ?? Date.now)();
  const nowIso = new Date(now).toISOString();
  const start = voidedStartTime(now);
  let seen = 0;
  let marked = 0;
  let voided: VoidedSweepResult["voided"] = "ok";
  let voidedHttp: number | undefined;
  let page: string | undefined;
  try {
    for (let i = 0; i < VOIDED_MAX_PAGES; i++) {
      const res = await deps.verifier.listVoided(start, page);
      for (const t of res.tokens) {
        seen++;
        if ((await deps.store.markVoided(hashToken(t), nowIso)) === "marked") marked++;
      }
      if (!res.nextPageToken) break;
      page = res.nextPageToken;
    }
  } catch (e) {
    if (!(e instanceof PlayApiError)) {
      // Depo hatası (markVoided): süre bitimini yine dene, sonra hatayı olduğu gibi ilet.
      try {
        await deps.store.expireStale(nowIso);
      } catch {
        // asıl hata aşağıda fırlar
      }
      throw e;
    }
    voided = e.kind;
    voidedHttp = e.httpStatus;
  }
  // Doğal süre bitimi: iptal listesinde görünmez. Google'a sormadan, kayıtlı dönem sonuna göre kapatılır (hak zaten entitlementUntil ile bitmişti).
  const expired = await deps.store.expireStale(nowIso);
  return { seen, marked, expired, voided, ...(voidedHttp !== undefined ? { voidedHttp } : {}) };
}

/** Cron yanıtı (B1): saf işlev, davranış testi var. İptal listesi/Google hatası ASLA 200 olmaz (503; aksi hâlde ömür boyu iadesi sessizce kaçar). */
export function cronResponse(r: VoidedSweepResult): { status: number; body: Record<string, unknown> } {
  if (r.voided !== "ok") {
    // D4: süre bitimi kapatması iptal listesi hatasından bağımsız koştu; yanıt ikisini ayrı gösterir. Yalnız tür + ham HTTP kodu (jeton yok).
    return {
      status: 503,
      body: { error: r.voided === "auth" ? "not_configured" : "verify_unavailable", voided: r.voided, google: r.voidedHttp ?? null, expired: r.expired },
    };
  }
  return { status: 200, body: { ok: true, seen: r.seen, marked: r.marked, expired: r.expired } };
}

// ---- Cron / sağlık ucu kimlik denetimi ----

/** `Authorization: Bearer <CRON_SECRET>` denetimi; sır yoksa ya da yanlışsa false (Ş9: yoksa HER istek 401). Sabit zamanlı karşılaştırma. */
export function cronAuthorized(authHeader: string | null | undefined, secret: string | undefined): boolean {
  if (!secret || secret.length < 16) return false;
  if (typeof authHeader !== "string") return false;
  const a = createHash("sha256").update(authHeader, "utf8").digest();
  const b = createHash("sha256").update(`Bearer ${secret}`, "utf8").digest();
  // timingSafeEqual aynı uzunlukta özetlerle.
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Sağlık ucu (Ş20): yalnız HTTP durum kodlarını döndürür (veri yok). */
export async function probePlayApi(
  verifier: PlayVerifier,
  input: { subscriptionToken?: string; productId?: string; productToken?: string },
  now: number = Date.now()
): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  // Ham Google kodu varsa O döner (400/401/403/404 ayrı görünsün); yoksa (belirteç/zaman aşımı/ağ) türe göre: auth 403, kalan 503.
  const code = (e: unknown) =>
    e instanceof PlayApiError ? (e.httpStatus ?? (e.kind === "not_found" ? 404 : e.kind === "auth" ? 403 : e.kind === "bad_request" ? 400 : 503)) : 500;
  if (input.subscriptionToken) {
    try {
      await verifier.getSubscription(input.subscriptionToken);
      out.subscriptionsv2 = 200;
    } catch (e) {
      out.subscriptionsv2 = code(e);
    }
  }
  if (input.productId && input.productToken && playProduct(input.productId)?.kind === "inapp") {
    try {
      await verifier.getProduct(input.productId, input.productToken);
      out.products = 200;
    } catch (e) {
      out.products = code(e);
    }
  }
  try {
    await verifier.listVoided(voidedStartTime(now));
    out.voidedpurchases = 200;
  } catch (e) {
    out.voidedpurchases = code(e);
  }
  return out;
}
