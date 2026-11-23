// K faktörü hesabı (sac büküm). Saf fonksiyonlar: arayüz, test ve (aynı tanımla) MakerKit C# kodu bu tanımları paylaşır.
// Tanımlar (hepsi mm ve radyan):
//   BA   = θ · (R + K·t)            büküm payı (nötr eksen boyunca yay uzunluğu)
//   OSSB = (R + t) · tan(θ/2)       dış sanal köşe uzaklığı (outside setback)
//   BD   = 2·OSSB − BA              büküm azalması (bend deduction)
//   Düz boy L = L1 + L2 − BD        (L1, L2: dıştan sanal köşeye ölçülen iki kenar)
//   K    = (BA/θ − R) / t
// Burada θ, sacın DÖNME açısıdır (90° büküm = 90°), iki kenar arasındaki iç açı değil.

export type UyariKodu = "k-dusuk" | "k-yuksek" | "acinim-buyuk";

export type Sonuc<T> = { ok: true; deger: T; uyarilar: UyariKodu[] } | { ok: false; hata: HataKodu };

export type HataKodu =
  | "kalinlik" // t <= 0
  | "yaricap" // R < 0
  | "aci" // θ aralık dışı
  | "sayi" // sayı değil
  | "kenarlar" // L1 + L2 <= L (BD <= 0)
  | "payi" // BA <= 0
  | "olcu" // negatif ya da sıfır ölçü
  | "flans" // bir flanşın düz boyu <= 0 (dış ölçü OSSB'den kısa)
  | "bos"; // ölçü listesi boş



const derece = (d: number) => (d * Math.PI) / 180;
const gecerli = (x: number) => Number.isFinite(x);

export function buk(R: number, K: number, t: number, thetaDeg: number) {
  const th = derece(thetaDeg);
  const BA = th * (R + K * t);
  const OSSB = (R + t) * Math.tan(th / 2);
  const BD = 2 * OSSB - BA;
  return { BA, OSSB, BD };
}

/** Bükümden sonraki iki dış kenar için kesilmesi gereken düz boy (ileri hesap; testte gidiş-dönüş için kullanılır). */
export function duzBoy(L1: number, L2: number, R: number, K: number, t: number, thetaDeg: number): number {
  return L1 + L2 - buk(R, K, t, thetaDeg).BD;
}

export type DenemeGirdi = { t: number; R: number; L: number; L1: number; L2: number; thetaDeg: number };
export type DenemeSonuc = { K: number; BA: number; BD: number; OSSB: number };

/** Tek deneme bükümünden K. */
export function kBul(g: DenemeGirdi): Sonuc<DenemeSonuc> {
  const { t, R, L, L1, L2, thetaDeg } = g;
  if (![t, R, L, L1, L2, thetaDeg].every(gecerli)) return { ok: false, hata: "sayi" };
  if (t <= 0) return { ok: false, hata: "kalinlik" };
  if (R < 0) return { ok: false, hata: "yaricap" };
  if (!(thetaDeg > 0 && thetaDeg < 180)) return { ok: false, hata: "aci" };
  if (L <= 0 || L1 <= 0 || L2 <= 0) return { ok: false, hata: "olcu" };
  const th = derece(thetaDeg);
  const OSSB = (R + t) * Math.tan(th / 2);
  const BD = L1 + L2 - L;
  if (BD <= 0) return { ok: false, hata: "kenarlar" };
  const BA = 2 * OSSB - BD;
  if (BA <= 0) return { ok: false, hata: "payi" };
  const K = (BA / th - R) / t;
  return { ok: true, deger: { K, BA, BD, OSSB }, uyarilar: kUyarilari(K) };
}

export function kUyarilari(K: number): UyariKodu[] {
  if (K < 0) return ["k-dusuk"];
  if (K > 0.5) return ["k-yuksek"];
  return [];
}

export type AcinimGirdi = { t: number; R: number; K: number; thetaDeg: number; dis: number[] };
export type BukumKonum = { bas: number; bit: number; gorus: number };
export type AcinimSonuc = {
  BA: number; BD: number; OSSB: number; bukumSayisi: number; toplamDis: number; acinim: number;
  /** Her flanşın düz boyu: ilk/son = dış ölçü − OSSB, ortadakiler = dış ölçü − 2·OSSB. */
  flans: number[];
  /** Her bükümün birinci teğet çizgisi (bas), ikinci teğet çizgisi (bit) ve görüş çizgisi (gorus): ilk kenardan (açınımın başından) mm. */
  bukumler: BukumKonum[];
};

/**
 * K biliniyorsa açınım: düz boy = Σ dış ölçü − (n−1)·BD (her büküm aynı t, R, K, θ).
 * Teğet çizgileri: bas_i = Σ(önceki flanşlar) + (i−1)·BA, bit_i = bas_i + BA.
 * Görüş çizgisi (sight line): birinci teğet çizgisinden bükümün içine doğru R kadar: gorus_i = bas_i + R.
 * Sağlama: θ <= 90° iken açınım, dış ölçülerin toplamından küçük olmalı; değilse uyarı.
 */
export function acinim(g: AcinimGirdi): Sonuc<AcinimSonuc> {
  const { t, R, K, thetaDeg, dis } = g;
  if (![t, R, K, thetaDeg].every(gecerli) || !dis.every(gecerli)) return { ok: false, hata: "sayi" };
  if (t <= 0) return { ok: false, hata: "kalinlik" };
  if (R < 0) return { ok: false, hata: "yaricap" };
  if (!(thetaDeg > 0 && thetaDeg < 180)) return { ok: false, hata: "aci" };
  if (dis.length === 0) return { ok: false, hata: "bos" };
  if (dis.some((d) => d <= 0)) return { ok: false, hata: "olcu" };
  const { BA, OSSB, BD } = buk(R, K, t, thetaDeg);
  if (BA <= 0) return { ok: false, hata: "payi" };
  const n = dis.length;
  const toplamDis = dis.reduce((a, b) => a + b, 0);
  const boy = toplamDis - (n - 1) * BD;
  if (boy <= 0) return { ok: false, hata: "olcu" };
  const flans = dis.map((d, i) => d - (n === 1 ? 0 : i === 0 || i === n - 1 ? OSSB : 2 * OSSB));
  if (flans.some((f) => f <= 0)) return { ok: false, hata: "flans" };
  const bukumler: BukumKonum[] = [];
  let x = 0;
  for (let i = 0; i < n - 1; i++) {
    x += flans[i];
    bukumler.push({ bas: x, bit: x + BA, gorus: x + R });
    x += BA;
  }
  const uyarilar: UyariKodu[] = kUyarilari(K);
  if (n > 1 && thetaDeg <= 90 && boy >= toplamDis) uyarilar.push("acinim-buyuk");
  return { ok: true, deger: { BA, BD, OSSB, bukumSayisi: n - 1, toplamDis, acinim: boy, flans, bukumler }, uyarilar };
}

/** Virgüllü ya da noktalı ondalık yazımı sayıya çevirir; boş ya da geçersizse NaN. */
export function sayiOku(s: string): number {
  const x = s.trim().replace(/\s/g, "").replace(",", ".");
  if (x === "" || !/^[+-]?(\d+\.?\d*|\.\d+)$/.test(x)) return NaN;
  return Number(x);
}

/** Birden çok numunenin K değerlerinin aritmetik ortalaması. */
export function ortalama(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
