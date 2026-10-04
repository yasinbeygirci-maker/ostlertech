import "server-only";
import { createPrivateKey, randomBytes, sign } from "node:crypto";
import { PADDLE_PRICE_PLANS } from "@/lib/paddle-tiers";

export type Plan = "month" | "year" | "lifetime";

export interface LicenseRow {
  id: string;
  license_key: string;
  plan: Plan;
  status: "active" | "past_due" | "paused" | "canceled" | "refunded" | "revoked";
  current_period_end: string | null;
  max_devices: number;
}

const DAY = 24 * 60 * 60 * 1000;
// Uygulama lisansı ~7 günde bir yeniler; sunucuya ulaşamazsa elindeki imzalı belge bu süre boyunca geçerli kalır.
const TOKEN_LIFETIME = 30 * DAY;
// Abonelik yenilemesi gecikirse (kart reddi vb.) kullanıcı hemen düşmesin.
const RENEWAL_GRACE = 7 * DAY;

// Karışan harfler (0/O, 1/I/L, U) yok: SPD-XXXXX-XXXXX-XXXXX-XXXXX, 20 karakter ≈ 100 bit.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newLicenseKey(): string {
  const bytes = randomBytes(20);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `SPD-${chars.slice(0, 5)}-${chars.slice(5, 10)}-${chars.slice(10, 15)}-${chars.slice(15, 20)}`;
}

export function normalizeKey(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const raw = input.toUpperCase().replace(/[^0-9A-Z]/g, "").replace(/^SPD/, "");
  if (raw.length !== 20 || [...raw].some((c) => !ALPHABET.includes(c))) return null;
  return `SPD-${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15, 20)}`;
}

export function planForPrice(priceId: string): Plan | null {
  return PADDLE_PRICE_PLANS[priceId] ?? null;
}

/** Lisans şu an Premium hakkı veriyor mu; veriyorsa imzalı belgenin bitiş anı. */
export function entitlementUntil(row: LicenseRow, now = Date.now()): number | null {
  if (row.status === "refunded" || row.status === "revoked" || row.status === "paused") return null;
  if (row.plan === "lifetime") return row.status === "active" ? now + TOKEN_LIFETIME : null;
  const periodEnd = row.current_period_end ? Date.parse(row.current_period_end) : NaN;
  if (Number.isNaN(periodEnd)) return null;
  const until = periodEnd + (row.status === "canceled" ? 0 : RENEWAL_GRACE);
  if (until <= now) return null;
  return Math.min(until, now + TOKEN_LIFETIME);
}

/** Uygulamanın çevrimdışı doğruladığı belge: base64url(JSON) + "." + base64url(Ed25519 imzası). */
export function signToken(payload: { lid: string; plan: Plan; dev: string; exp: number }): string {
  const pem = process.env.LICENSE_SIGNING_KEY;
  if (!pem) throw new Error("LICENSE_SIGNING_KEY tanımlı değil");
  const key = createPrivateKey({ key: Buffer.from(pem, "base64"), format: "der", type: "pkcs8" });
  const body = Buffer.from(JSON.stringify({ v: 1, ...payload, iat: Date.now() })).toString("base64url");
  const signature = sign(null, Buffer.from(body), key).toString("base64url");
  return `${body}.${signature}`;
}
