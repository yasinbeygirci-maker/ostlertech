// Fiyat sayfasındaki planlar. Metni ve fiyat kimliklerini yalnızca burada değiştirin.
// Fiyat kimlikleri Paddle > Catalog > Products > SyncPass Desktop Premium altındadır (gizli değildir).
// Tutarlar burada yazılmaz: sayfa her zaman Paddle'ın ziyaretçinin ülkesine göre döndürdüğü tutarı gösterir.

export type BillingCycle = "month" | "year";

export interface Tier {
  id: "free" | "premium" | "lifetime";
  name: string;
  description: string;
  features: string[];
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
      "Hesap açmak gerekmez",
    ],
    priceId: null,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Tüm kasanız için, aylık ya da yıllık.",
    features: [
      "Sınırsız kayıt",
      "Google Drive ile telefonla eşitleme",
      "Şifre sağlığı: zayıf, tekrar eden ve sızıntıda görülen şifreler",
      "Ctrl+Shift+P ile hızlı erişim",
      "İstediğiniz zaman iptal",
    ],
    priceId: { month: "pri_01m41q184hngxx8aqz3v0bt2wp", year: "pri_01m41q27m1hgdzxabaz96v07pf" },
    highlighted: true,
  },
  {
    id: "lifetime",
    name: "Ömür boyu",
    description: "Bir kez ödeyin, abonelik yok.",
    features: ["Premium'daki her şey", "Tek seferlik ödeme, yenileme yok", "Gelecek sürümler dahil"],
    priceId: { once: "pri_01m41q4dg3816kmsk2sd76npdy" },
  },
];

// Sunucunun Paddle bildirimindeki fiyattan lisans türünü bulması için. Yeni fiyat eklenirse buraya da eklenir.
export const PADDLE_PRICE_PLANS: Record<string, "month" | "year" | "lifetime"> = {
  pri_01m41q184hngxx8aqz3v0bt2wp: "month",
  pri_01m41q27m1hgdzxabaz96v07pf: "year",
  pri_01m41q4dg3816kmsk2sd76npdy: "lifetime",
};
