import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { priceInfo } from "@/lib/paddle-tiers";
import { handleLicenseRequest, type ApiResult, type LicenseOp, type LicenseRow, type LicenseStore, type Product } from "@/lib/license-core";

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

const SELECT = "id, license_key, product, plan, status, current_period_end, max_devices";

export function supabaseLicenseStore(db: SupabaseClient): LicenseStore {
  return {
    async findLicense(key: string, product: Product) {
      const { data } = await db.from("sp_licenses").select(SELECT).eq("license_key", key).eq("product", product).maybeSingle<LicenseRow>();
      return data ?? null;
    },
    async listDevices(licenseId: string) {
      const { data } = await db.from("sp_license_devices").select("device_id").eq("license_id", licenseId);
      return (data ?? []).map((d: { device_id: string }) => d.device_id);
    },
    async upsertDevice(licenseId: string, deviceId: string, appVersion: string | null, nowIso: string) {
      const { error } = await db
        .from("sp_license_devices")
        .upsert({ license_id: licenseId, device_id: deviceId, app_version: appVersion, last_seen: nowIso }, { onConflict: "license_id,device_id" });
      return !error;
    },
    async removeDevice(licenseId: string, deviceId: string) {
      await db.from("sp_license_devices").delete().eq("license_id", licenseId).eq("device_id", deviceId);
    },
  };
}

/** Uç nokta gövdesi: JSON'u okur, çekirdeğe verir. Dönüş HTTP durumu + gövde. */
export async function runLicenseRoute(req: Request, op: LicenseOp, product: Product, db: SupabaseClient): Promise<ApiResult> {
  const body = await req.json().catch(() => null);
  return handleLicenseRequest(op, product, body, supabaseLicenseStore(db));
}
