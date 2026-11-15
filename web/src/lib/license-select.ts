// Lisans satırı sütun listesi ve geriye uyumlu okuma (Burak kod kapısı O1). Saf dosya: birim testli (tests/play-claim.test.ts).
// Play alanları 2026-11-14-tek-lisans-k1.sql göçüyle gelir. Kod göçten ÖNCE üretime çıksa bile mevcut Paddle/AreaPilot uçları bozulmasın diye
// yeni sütunlar yoksa (Postgres 42703 undefined_column) eski sütun listesiyle yeniden denenir. Play uçları göçsüz çalışmaz (satır yok), ama
// Paddle/AreaPilot etkinleştirme/yenileme/kaldırma/durum aynen çalışır.
export const LICENSE_COLUMNS_LEGACY = "id, license_key, product, plan, status, current_period_end, max_devices, email";
export const LICENSE_COLUMNS = `${LICENSE_COLUMNS_LEGACY}, source, play_purchase_token, play_product_id, play_state, play_checked_at`;

export interface SelectResult<T> {
  data: T | null;
  error: { code?: string } | null;
}

/** Önce tam sütun listesiyle çalıştırır; yalnız "sütun yok" (42703) hatasında eski listeyle bir kez daha dener. Başka hata aynen döner. */
export async function selectLicenseCompat<T>(run: (columns: string) => PromiseLike<SelectResult<T>>): Promise<SelectResult<T>> {
  const first = await run(LICENSE_COLUMNS);
  if (first.error?.code === "42703") return run(LICENSE_COLUMNS_LEGACY);
  return first;
}

// Sorgu zinciri: supabase-js'in kullanılan kısmı (testte sahte). license.ts sütun listesini HİÇ yazmaz; ikisi de buradan geçer (Burak S7).
interface LicenseQuery {
  select(columns: string): LicenseQuery;
  eq(column: string, value: unknown): LicenseQuery;
  maybeSingle(): PromiseLike<SelectResult<unknown>>;
}
export interface LicenseDb {
  from(table: string): unknown;
}

/** Lisans kodu + ürün ile satır (activate/renew/deactivate/status). */
export function findLicenseByKey<T>(db: LicenseDb, key: string, product: string): Promise<SelectResult<T>> {
  return selectLicenseCompat<T>((cols) => (db.from("sp_licenses") as LicenseQuery).select(cols).eq("license_key", key).eq("product", product).maybeSingle() as PromiseLike<SelectResult<T>>);
}

/** Lisans kimliği + ürün ile satır (eski kod sahibi araması). */
export function findLicenseById<T>(db: LicenseDb, id: string, product: string): Promise<SelectResult<T>> {
  return selectLicenseCompat<T>((cols) => (db.from("sp_licenses") as LicenseQuery).select(cols).eq("id", id).eq("product", product).maybeSingle() as PromiseLike<SelectResult<T>>);
}
