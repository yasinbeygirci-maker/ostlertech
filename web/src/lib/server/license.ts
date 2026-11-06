import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { priceInfo } from "@/lib/paddle-tiers";
import {
  DEACTIVATE_LIMIT,
  DEACTIVATE_WINDOW_DAYS,
  handleLicenseRequest,
  type ApiResult,
  type LicenseOp,
  type LicenseRow,
  type LicenseStore,
  type Product,
} from "@/lib/license-core";

// Mantığın tamamı lib/license-core.ts içindedir (birim testli); bu dosya yalnız sunucuya özgü bağlantıyı yapar.
export { entitlementUntil, newLicenseKey, normalizeKey, signToken, type LicenseRow, type Plan, type Product } from "@/lib/license-core";

/** Paddle fiyat kimliğinden {ürün, plan, cihaz sayısı}; bilinmiyorsa null. */
export function infoForPrice(priceId: unknown) {
  return priceInfo(priceId);
}

/** Eski ad (yalnız plan). */
export function planForPrice(priceId: string) {
  return priceInfo(priceId)?.plan ?? null;
}

const SELECT = "id, license_key, product, plan, status, current_period_end, max_devices, email";

// Veritabanı hatasında FIRLATIR (çekirdek 500 server_error yapar); hata asla "kayıt yok" gibi görünmez.
// Fırlatılan hata yalnız Postgres/PostgREST kodunu taşır: ileti satır içeriği (kod, e-posta) içerebilir.
function fail(error: { code?: string } | null, where: string): never {
  throw new Error(`${where}: ${error?.code ?? "hata"}`);
}

export function supabaseLicenseStore(db: SupabaseClient): LicenseStore {
  return {
    async findLicense(key: string, product: Product) {
      const { data, error } = await db.from("sp_licenses").select(SELECT).eq("license_key", key).eq("product", product).maybeSingle<LicenseRow>();
      if (error) fail(error, "findLicense");
      return data ?? null;
    },
    async registerDevice(licenseId, deviceId, appVersion, nowIso) {
      const { data, error } = await db.rpc("sp_register_device", { p_license_id: licenseId, p_device_id: deviceId, p_app_version: appVersion, p_now: nowIso });
      if (error) fail(error, "registerDevice");
      if (data === "ok" || data === "limit") return data;
      throw new Error("registerDevice: beklenmeyen sonuc");
    },
    async touchDevice(licenseId, deviceId, appVersion, nowIso) {
      const { data, error } = await db
        .from("sp_license_devices")
        .update({ app_version: appVersion, last_seen: nowIso })
        .eq("license_id", licenseId)
        .eq("device_id", deviceId)
        .select("device_id");
      if (error) fail(error, "touchDevice");
      return (data?.length ?? 0) > 0;
    },
    async removeDevice(licenseId, deviceId, nowIso) {
      const { data, error } = await db.rpc("sp_remove_device", {
        p_license_id: licenseId,
        p_device_id: deviceId,
        p_now: nowIso,
        p_limit: DEACTIVATE_LIMIT,
        p_window_days: DEACTIVATE_WINDOW_DAYS,
      });
      if (error) fail(error, "removeDevice");
      if (data === "ok" || data === "limit") return data;
      throw new Error("removeDevice: beklenmeyen sonuc");
    },
    async createResetToken(licenseId, tokenHash, expiresIso, nowIso, minIntervalMs) {
      const { data, error } = await db.rpc("sp_create_reset_token", {
        p_license_id: licenseId,
        p_token_hash: tokenHash,
        p_expires: expiresIso,
        p_now: nowIso,
        p_min_interval_seconds: Math.round(minIntervalMs / 1000),
      });
      if (error) fail(error, "createResetToken");
      return data === true;
    },
    async consumeResetToken(tokenHash, nowIso) {
      const { data, error } = await db.rpc("sp_consume_reset_token", { p_token_hash: tokenHash, p_now: nowIso });
      if (error) fail(error, "consumeResetToken");
      return data === true;
    },
  };
}

/** Uç nokta gövdesi: JSON'u okur, çekirdeğe verir. Dönüş HTTP durumu + gövde. */
export async function runLicenseRoute(req: Request, op: LicenseOp, product: Product, db: SupabaseClient): Promise<ApiResult> {
  const body = await req.json().catch(() => null);
  return handleLicenseRequest(op, product, body, supabaseLicenseStore(db));
}
