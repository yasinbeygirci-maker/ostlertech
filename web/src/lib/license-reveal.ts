// Ödeme sonrası sayfanın (/welcome) lisans kodunu gösterip göstermeyeceği kararı (saf; birim testli: tests/areapilot-sales.test.ts).
// Burak D1: işlem numarasını (txn_...) bilen biri 48 saat içinde, sızdı diye SIFIRLANMIŞ lisansın yeni kodunu da alabiliyordu ve durum
// süzgeci yoktu. Kural: yalnız ödemeden sonraki ilk kodu göster (sıfırlama olduysa gösterme) ve yalnız etkin lisansı.
export const REVEAL_WINDOW_MS = 48 * 60 * 60 * 1000;

export interface RevealInput {
  status: string;
  /** sp_license_resets'te bu lisans için kayıt sayısı (sıfırlama = kod değişti). */
  resetCount: number;
  createdAtMs: number;
  nowMs: number;
}

export function revealDecision(i: RevealInput): "show" | "hide" {
  if (i.status !== "active") return "hide";
  if (i.resetCount > 0) return "hide";
  if (!Number.isFinite(i.createdAtMs) || i.nowMs - i.createdAtMs > REVEAL_WINDOW_MS) return "hide";
  return "show";
}
