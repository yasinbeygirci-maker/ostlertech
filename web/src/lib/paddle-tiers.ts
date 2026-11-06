// Fiyat sayfasındaki planlar. Metni ve fiyat kimliklerini yalnızca burada değiştir.
// Fiyat kimlikleri Paddle > Catalog > Products > SyncPass Desktop Premium altındadır (gizli değildir).
// Tutarlar burada yazılmaz: sayfa her zaman Paddle'ın ziyaretçinin ülkesine göre döndürdüğü tutarı gösterir.

export type BillingCycle = "month" | "year";

export interface Tier {
  id: "free" | "premium" | "lifetime";
  name: string;
  description: string;
  features: string[];
  // /en/pricing için İngilizce karşılıklar (Türkçe değişince bunlar da aynı işte güncellenir).
  en: { name: string; description: string; features: string[] };
  // Ücretsiz plan: fiyat yok. Abonelik: aylık + yıllık. Ömür boyu: tek seferlik.
  priceId: null | { month: string; year: string } | { once: string };
  highlighted?: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "Ücretsiz",
    description: "Denemek ve az sayıda kayıt için.",
    features: [
      "15 kayda kadar",
      "Android ile aynı şifreleme (AES-256-GCM)",
      "Kopyalanan şifre Windows pano geçmişine yazılmaz",
      "Kasanın kopyası sunucularımızda tutulmaz",
    ],
    en: {
      name: "Free",
      description: "To try it out and for a few items.",
      features: [
        "Up to 15 items",
        "Same encryption as Android (AES-256-GCM)",
        "Copied passwords are kept out of Windows clipboard history",
        "We keep no copy of your vault on our servers",
      ],
    },
    priceId: null,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Tüm kasan için, aylık ya da yıllık.",
    features: [
      "Sınırsız kayıt",
      "Google Drive ile telefonla eşitleme",
      "Şifre sağlığı: zayıf, tekrar eden ve sızıntıda görülen şifreler",
      "Ctrl+Shift+P ile hızlı erişim",
      "İstediğin zaman iptal",
    ],
    en: {
      name: "Premium",
      description: "For your whole vault, monthly or yearly.",
      features: [
        "Unlimited items",
        "Sync with your phone through your own Google Drive",
        "Password health: weak, reused and breached passwords",
        "Quick access with Ctrl+Shift+P",
        "Cancel any time",
      ],
    },
    priceId: { month: "pri_01m41q184hngxx8aqz3v0bt2wp", year: "pri_01m41q27m1hgdzxabaz96v07pf" },
    highlighted: true,
  },
  {
    id: "lifetime",
    name: "Ömür boyu",
    description: "Bir kez öde, abonelik yok.",
    features: ["Premium'daki her şey", "Tek seferlik ödeme, yenileme yok", "Lisans düzenli aralıklarla sunucumuzla doğrulanır (internet bağlantısı gerekir)"],
    en: {
      name: "Lifetime",
      description: "Pay once, no subscription.",
      features: ["Everything in Premium", "One-time payment, no renewals", "The license is checked with our server at regular intervals (needs an internet connection)"],
    },
    priceId: { once: "pri_01m41q4dg3816kmsk2sd76npdy" },
  },
];

// ---- Sunucu: Paddle fiyat kimliği -> {ürün, plan, cihaz sayısı} ----
// Ürün, plan ve cihaz sınırı HER ZAMAN buradan (sunucudaki fiyat kimliği tablosundan) gelir; ödeme çağrısındaki
// custom_data istemciden gelir ve güvenilmez. Yeni fiyat eklenirse buraya eklenir ve satışa çıkmadan ÖNCE dağıtılır:
// bilinmeyen fiyat için webhook lisans üretmez (müşteri ödeyip kod alamaz), yalnız günlüğe hata yazar.
export type LicenseProduct = "syncpass_desktop" | "areapilot";
export type LicensePlan = "month" | "year" | "lifetime";

export interface PriceInfo {
  product: LicenseProduct;
  plan: LicensePlan;
  /** Bu fiyatla alınan lisansın kullanılabileceği en çok bilgisayar sayısı. */
  maxDevices: number;
}

// AreaPilot (tek seferlik lisans; katman = cihaz sayısı): Bireysel 1 / Ofis 5 / Firma 20.
// Paddle ürünü AreaPilot: pro_01m6s047558k87nenevzenkwe8 (2026-11-06). Fiyatlar tek seferlik, USD taban 39/159/399, TR geçersiz kılma ₺1.999/7.999/19.999.
export const AREAPILOT_PRICE_IDS: { individual: string | null; office: string | null; firm: string | null } = {
  individual: "pri_01m6s0acnb2qjkpsr37meb9ffg",
  office: "pri_01m6s0dj08k2spnb8kxpf9q42f",
  firm: "pri_01m6s0e6wd5x6j2bt7xgsvh3th",
};

const AREAPILOT_DEVICES = { individual: 1, office: 5, firm: 20 } as const;

export function buildPriceCatalog(areapilot: typeof AREAPILOT_PRICE_IDS = AREAPILOT_PRICE_IDS): Record<string, PriceInfo> {
  const catalog: Record<string, PriceInfo> = {
    // SyncPass Masaüstü: max_devices veritabanı varsayılanıyla (3) aynı; davranış değişmez.
    pri_01m41q184hngxx8aqz3v0bt2wp: { product: "syncpass_desktop", plan: "month", maxDevices: 3 },
    pri_01m41q27m1hgdzxabaz96v07pf: { product: "syncpass_desktop", plan: "year", maxDevices: 3 },
    pri_01m41q4dg3816kmsk2sd76npdy: { product: "syncpass_desktop", plan: "lifetime", maxDevices: 3 },
  };
  for (const tier of ["individual", "office", "firm"] as const) {
    const id = areapilot[tier];
    if (!id) continue;
    if (catalog[id]) throw new Error(`Fiyat kimliği iki kez tanımlı: ${id}`);
    catalog[id] = { product: "areapilot", plan: "lifetime", maxDevices: AREAPILOT_DEVICES[tier] };
  }
  return catalog;
}

export const PADDLE_PRICE_PLANS: Record<string, PriceInfo> = buildPriceCatalog();

/** AreaPilot'un üç katmanının fiyat kimliği de eşlemede var mı (satış bayrağı bunu ister). */
export function areapilotPricesReady(catalog: Record<string, PriceInfo> = PADDLE_PRICE_PLANS): boolean {
  const devices = new Set(Object.values(catalog).filter((p) => p.product === "areapilot").map((p) => p.maxDevices));
  return devices.has(1) && devices.has(5) && devices.has(20);
}

export function priceInfo(priceId: unknown, catalog: Record<string, PriceInfo> = PADDLE_PRICE_PLANS): PriceInfo | null {
  return typeof priceId === "string" && Object.hasOwn(catalog, priceId) ? catalog[priceId] : null;
}
