// SyncPass Masaüstü fiyat sayfası planları (tarayıcı tarafı). AreaPilot fiyat kimlikleri BİLEREK burada değil:
// paddle-tiers.ts yalnız sunucuda kullanılır; bu dosya istemci paketine girer.
import { FREE_ITEM_LIMIT_DESKTOP } from "./site";

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
      `${FREE_ITEM_LIMIT_DESKTOP} kayda kadar`,
      "Android ile aynı şifreleme (AES-256-GCM)",
      "Kopyalanan şifre Windows pano geçmişine yazılmaz",
      "Kasanın kopyası sunucularımızda tutulmaz",
    ],
    en: {
      name: "Free",
      description: "To try it out and for a few items.",
      features: [
        `Up to ${FREE_ITEM_LIMIT_DESKTOP} items`,
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
