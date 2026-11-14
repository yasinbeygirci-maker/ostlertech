// SyncPass Play ürün kataloğu: Play ürün kimliği -> {tür, plan, cihaz sayısı}. YALNIZ SUNUCUDA kullanılır (paddle-tiers.ts gibi
// istemci paketine girmez; tests/play-claim.test.ts bunu denetler). Plan ve cihaz sayısı HER ZAMAN buradan gelir: istemci
// gövdesindeki hiçbir plan/sayı alanı okunmaz. Paket adı da sunucu sabitidir (Burak Ş1): istemcinin gönderdiği paket adı yok sayılır.
// Kararlar (Yasin 2026-11-14): tek lisans 3 cihaz; aylık / yıllık / ömür boyu; 2 yıllık plan YOK. Aile kimlikleri K2'de eklenir.
import type { LicensePlan } from "./paddle-tiers";

export const PLAY_PACKAGE_NAME = "com.ostlertech.syncpass";

export type PlayKind = "subs" | "inapp";

export interface PlayProductInfo {
  /** subs: abonelik (subscriptionsv2), inapp: tek seferlik (products). */
  kind: PlayKind;
  plan: LicensePlan;
  /** Bu satın almayla açılan lisansın en çok cihaz sayısı (tek lisans = 3 cihaz). */
  maxDevices: number;
}

export const PLAY_PRODUCTS: Record<string, PlayProductInfo> = {
  premium_monthly: { kind: "subs", plan: "month", maxDevices: 3 },
  premium_yearly: { kind: "subs", plan: "year", maxDevices: 3 },
  premium_lifetime: { kind: "inapp", plan: "lifetime", maxDevices: 3 },
};

export function playProduct(productId: unknown): PlayProductInfo | null {
  return typeof productId === "string" && Object.hasOwn(PLAY_PRODUCTS, productId) ? PLAY_PRODUCTS[productId] : null;
}
