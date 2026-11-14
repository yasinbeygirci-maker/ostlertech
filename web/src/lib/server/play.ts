import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { newLicenseKey, type LicenseRow } from "@/lib/license-core";
import {
  refreshPlayLicense,
  type ClaimParams,
  type ClaimResult,
  type PlayDeps,
  type PlayLicenseRow,
  type PlayStore,
  type PlayVerifier,
  type StatePatch,
  type VoidedMark,
} from "@/lib/play-core";

// Play lisansının sunucuya özgü bağlantısı (Supabase deposu + Google doğrulayıcı seçimi). Mantık lib/play-core.ts'tedir (birim testli).
// Veritabanı hatasında FIRLATIR; fırlatılan hata yalnız Postgres/PostgREST kodunu taşır (ileti satır içeriği/jeton içerebilir).

function fail(error: { code?: string } | null, where: string): never {
  throw new Error(`${where}: ${error?.code ?? "hata"}`);
}

const SELECT =
  "id, license_key, product, plan, status, current_period_end, max_devices, email, source, play_purchase_token, play_product_id, play_state, play_checked_at";

export function supabasePlayStore(db: SupabaseClient): PlayStore {
  return {
    async findByTokenHash(hash) {
      const { data: tok, error } = await db.from("sp_play_tokens").select("license_id, superseded_at").eq("token_hash", hash).maybeSingle<{ license_id: string; superseded_at: string | null }>();
      if (error) fail(error, "playFind");
      if (!tok) return null;
      const { data, error: e2 } = await db.from("sp_licenses").select(SELECT).eq("id", tok.license_id).maybeSingle<PlayLicenseRow>();
      if (e2) fail(e2, "playFind");
      return data ? { license: data, superseded: tok.superseded_at !== null } : null;
    },
    async claim(p: ClaimParams): Promise<ClaimResult> {
      const { data, error } = await db.rpc("sp_claim_play_license", {
        p_token_hash: p.tokenHash,
        p_token: p.token,
        p_linked_hash: p.linkedHash,
        p_product_id: p.productId,
        p_plan: p.plan,
        p_max_devices: p.maxDevices,
        p_source: p.source,
        p_status: p.status,
        p_period_end: p.periodEnd,
        p_play_state: p.playState,
        p_now: p.nowIso,
        p_new_key: p.newKey,
        p_allow_create: p.allowCreate,
      });
      if (error) fail(error, "playClaim");
      const r = data as { result?: string; license?: PlayLicenseRow; created?: boolean; chained?: boolean; merged?: boolean; superseded?: boolean } | null;
      if (r?.result === "none") return { result: "none" };
      if (r?.result === "manual" && r.license) return { result: "manual", license: r.license };
      if (r?.result === "ok" && r.license) {
        return { result: "ok", license: r.license, created: r.created === true, chained: r.chained === true, merged: r.merged === true, superseded: r.superseded === true };
      }
      throw new Error("playClaim: beklenmeyen sonuc");
    },
    async updateState(licenseId: string, patch: StatePatch, nowIso: string) {
      // refunded/revoked bitiş durumudur: Google'dan gelen tazelemeyle yeniden açılmaz.
      const { error } = await db
        .from("sp_licenses")
        .update({ ...patch, play_checked_at: nowIso, updated_at: nowIso })
        .eq("id", licenseId)
        .not("status", "in", "(refunded,revoked)");
      if (error) fail(error, "playUpdate");
    },
    async markVoided(tokenHash: string, nowIso: string): Promise<VoidedMark> {
      const { data, error } = await db.rpc("sp_play_mark_voided", { p_token_hash: tokenHash, p_now: nowIso });
      if (error) fail(error, "playVoided");
      if (data === "marked" || data === "unknown" || data === "superseded" || data === "already") return data;
      throw new Error("playVoided: beklenmeyen sonuc");
    },
    async expireStale(nowIso: string) {
      const { data, error } = await db.rpc("sp_play_expire_stale", { p_now: nowIso });
      if (error) fail(error, "playExpire");
      return typeof data === "number" ? data : 0;
    },
  };
}

export function playAcceptsTestPurchases(): boolean {
  const v = process.env.PLAY_ACCEPT_TEST_PURCHASES;
  return v === "1" || v === "true";
}

/** Gerçek Google doğrulayıcısı (OIDC); modülü yalnız gerektiğinde yükler. */
export async function realVerifier(): Promise<PlayVerifier> {
  const { googlePlayVerifier } = await import("@/lib/server/play-api");
  return googlePlayVerifier();
}

export async function playDeps(db: SupabaseClient): Promise<PlayDeps> {
  return {
    verifier: await realVerifier(),
    store: supabasePlayStore(db),
    newKey: () => newLicenseKey("syncpass_desktop"),
    acceptTestPurchases: playAcceptsTestPurchases(),
  };
}

/** activate/renew kancası (Ş8). Paddle satırında hiçbir şey yapmaz ve Google modülünü yüklemez. */
export function playRefreshHook(db: SupabaseClient): (row: LicenseRow, now: number) => Promise<LicenseRow> {
  return async (row, now) => {
    if (row.source !== "play" && row.source !== "play_test") return row;
    return refreshPlayLicense(row, await playDeps(db), now);
  };
}
