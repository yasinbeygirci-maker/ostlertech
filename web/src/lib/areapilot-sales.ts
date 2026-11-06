// AreaPilot satın alma bölümünün saf mantığı ve metni (TR + EN). İSTEMCİ DOSYALARI bunu içe aktarabilir: burada Paddle FİYAT KİMLİĞİ YOKTUR.
// Fiyat kimlikleri yalnız sunucuda (paddle-tiers.ts) durur ve /api/areapilot/satis ile SADECE satış bayrağı açıkken tarayıcıya verilir.
// Tutarlar da burada yazılmaz: kartlardaki fiyatı Paddle ziyaretçinin ülkesine göre döndürür (Burak O3, Zeynep/Defne kapıları için metin notları aşağıda).
export type SalesLang = "tr" | "en";
export type AreaPilotTierId = "individual" | "office" | "firm";
export const AREAPILOT_TIER_IDS: readonly AreaPilotTierId[] = ["individual", "office", "firm"];

/** Katman başına bilgisayar sayısı. Gerçek sınır sunucu tablosundadır (paddle-tiers.ts); bu yalnız kart metni içindir. */
export const AREAPILOT_TIER_DEVICES: Record<AreaPilotTierId, number> = { individual: 1, office: 5, firm: 20 };

export type AreaPilotPriceIds = Record<AreaPilotTierId, string>;

export type SalesPayload =
  | { open: false }
  | { open: true; environment: "production" | "sandbox"; token: string; prices: AreaPilotPriceIds };

export interface SalesInputs {
  /** salesOpenFor("areapilot", { areapilotPricesReady }) sonucu (paddle-env.ts); bayrak kapalıysa false. */
  open: boolean;
  /** Sunucu fiyat tablosundaki kimlikler (paddle-tiers.ts AREAPILOT_PRICE_IDS). */
  ids: { individual: string | null; office: string | null; firm: string | null };
  /** paddleConfig(): geçersizse fırlatır. Yalnız `open` true iken çağrılır. */
  getConfig: () => { environment: string; token: string };
}

/**
 * Satış bölümünün sunucu kararı. Bayrak kapalıysa ya da bir fiyat kimliği eksikse ya da Paddle ayarı geçersizse KAPALI döner ve içinde
 * hiçbir kimlik/belirteç olmaz. Ayar hatası sessiz değildir: çağıran `onConfigError` ile günlüğe yazar (değer yazılmaz).
 */
export function salesPayload(input: SalesInputs, onConfigError: (e: unknown) => void = () => {}): SalesPayload {
  if (!input.open) return { open: false };
  const { individual, office, firm } = input.ids;
  if (!individual || !office || !firm) return { open: false };
  let cfg: { environment: string; token: string };
  try {
    cfg = input.getConfig();
  } catch (e) {
    onConfigError(e);
    return { open: false };
  }
  if (cfg.environment !== "production" && cfg.environment !== "sandbox") return { open: false };
  return { open: true, environment: cfg.environment, token: cfg.token, prices: { individual, office, firm } };
}

/**
 * Checkout.open girdisi. quantity HER ZAMAN 1 (adet artırma yok; Paddle'da fiyatın adet sınırı da 1 olmalı). custom_data yalnız bilgidir:
 * ürün, plan ve cihaz sayısını webhook sunucu tablosundan alır (istemciden gelen hiçbir şeye güvenilmez).
 */
export function checkoutRequest(priceId: string, lang: SalesLang, origin: string, email?: string) {
  return {
    items: [{ priceId, quantity: 1 }],
    customData: { app: "areapilot", lang },
    ...(email ? { customer: { email } } : {}),
    settings: {
      displayMode: "overlay" as const,
      variant: "one-page" as const,
      locale: lang,
      successUrl: `${origin}/welcome?urun=areapilot&lang=${lang}`,
    },
  };
}

// ---- Metin ----
// Hitap: "sen" (yasal metin değil, satış sayfası). Yasak: çevrimdışı/internetsiz, reklamsız, "en iyi", rakip adı, sevkiyat/takip/birleştirme/montaj,
// yapay zekâ. tests/areapilot-sales.test.ts bunları tarar.
// [ZEYNEP] kapısı: aşağıdaki "legal" satırları (iade, vergi, Paddle satıcı notu, tek seferlik lisans, Autodesk notu) mevcut SyncPass metninden
// ve 2026-10-28 satış planından alındı; AreaPilot için ürün eki (teslimat-ve-iade/kullanim-sartlari sayfalarında AreaPilot yok) YAZILMADI.
// Bayrak açılmadan önce Zeynep onaylar; Defne dil denetimi yapar.
export interface TierCopy {
  name: string;
  devices: string;
  features: string[];
}

export interface SalesCopy {
  id: string;
  title: string;
  lead: string;
  once: string;
  buy: string;
  loadingPrice: string;
  highlightedLabel: string;
  tiers: Record<AreaPilotTierId, TierCopy>;
  after: string[];
  legal: {
    paddle: string;
    refund: string;
    trademark: string;
    termsLabel: string;
    termsHref: string;
    refundLabel: string;
    refundHref: string;
  };
  error: string;
}

const commonTr = (n: number): string[] => [
  "Tek seferlik ödeme, yenileme yok",
  "Tüm 1.x sürümlerinde geçerli",
  n === 1 ? "Kod 1 bilgisayarda kullanılır" : `Aynı kodu en fazla ${n} bilgisayarda kullanabilirsin`,
];
const commonEn = (n: number): string[] => [
  "One payment, no renewals",
  "Valid for all 1.x versions",
  n === 1 ? "The key works on 1 computer" : `Use the same key on up to ${n} computers`,
];

export const SALES_COPY: Record<SalesLang, SalesCopy> = {
  tr: {
    id: "fiyatlar",
    title: "Fiyatlar",
    lead: "AreaPilot tek seferlik lisanstır: bir kez öde, 1.x sürümlerinin hepsinde kullan. Kaç bilgisayarda kullanacağına göre katmanı seç.",
    once: "tek seferlik",
    buy: "Satın al",
    loadingPrice: "Fiyat yükleniyor",
    highlightedLabel: "Çoğu ekip için",
    tiers: {
      individual: { name: "Bireysel", devices: "1 bilgisayar", features: commonTr(1) },
      office: { name: "Ofis", devices: "5 bilgisayar", features: commonTr(5) },
      firm: { name: "Firma", devices: "20 bilgisayar", features: commonTr(20) },
    },
    after: [
      "Ödeme bitince lisans kodun hemen açılan sayfada görünür ve e-postana da gönderilir. Kodu başkasıyla paylaşma: kodu bilen onu kendi bilgisayarına kurabilir.",
      "Bilgisayar değiştirirken eski bilgisayarda AreaPilot Lisans penceresinden Kaldır'a basarsın; yer yeni bilgisayara açılır.",
    ],
    legal: {
      paddle:
        "Fiyatlar bulunduğun ülkeye göre gösterilir ve vergiler dahildir. Siparişin yetkili satıcımız Paddle.com (Merchant of Record) tarafından işlenir; kart bilgilerin bize iletilmez.",
      refund: "Ödeme tarihinden itibaren 14 gün içinde gerekçe göstermeden ücretin tamamını iade ederiz.",
      trademark: "AutoCAD, Autodesk, Inc.'in tescilli markasıdır. AreaPilot, Autodesk ile bağlantılı değildir.",
      termsLabel: "Kullanım ve satış koşulları",
      termsHref: "/kullanim-sartlari",
      refundLabel: "Teslimat ve iade politikası",
      refundHref: "/teslimat-ve-iade",
    },
    error: "Fiyatlar şu an yüklenemedi. Sayfayı yenile; sorun sürerse destek@ostlertech.com adresine yaz.",
  },
  en: {
    id: "pricing",
    title: "Pricing",
    lead: "AreaPilot is a one-time license: pay once and use it on every 1.x version. Pick the tier by how many computers you will use it on.",
    once: "one-time",
    buy: "Buy",
    loadingPrice: "Loading price",
    highlightedLabel: "For most teams",
    tiers: {
      individual: { name: "Individual", devices: "1 computer", features: commonEn(1) },
      office: { name: "Office", devices: "5 computers", features: commonEn(5) },
      firm: { name: "Firm", devices: "20 computers", features: commonEn(20) },
    },
    after: [
      "When the payment completes, your license key appears on the page that opens and is also emailed to you. Do not share the key: anyone who has it can install it on their own computer.",
      "When you change computers, press Remove in the AreaPilot License window on the old one; the slot is freed for the new computer.",
    ],
    legal: {
      paddle:
        "Prices are shown for your country and include taxes. Your order is processed by our reseller Paddle.com, the Merchant of Record; your card details never reach us.",
      refund: "You can ask for a full refund within 14 days of payment, no questions asked.",
      trademark: "AutoCAD is a registered trademark of Autodesk, Inc. AreaPilot is not affiliated with Autodesk.",
      termsLabel: "Terms of use and sale",
      termsHref: "/en/terms",
      refundLabel: "Delivery and refund policy",
      refundHref: "/en/refunds",
    },
    error: "Prices could not be loaded right now. Refresh the page; if it continues, write to destek@ostlertech.com.",
  },
};

/** Teşekkür sayfası (/welcome) metni, ürüne göre. SyncPass metni ayrı kalır (welcome/page.tsx), burada yalnız AreaPilot. */
export interface WelcomeCopy {
  title: string;
  receipt: string;
  mailNote: string;
  steps: string[];
  support: string;
  back: string;
  backHref: string;
  download: string;
  downloadHref: string;
}

export function areapilotWelcomeCopy(lang: SalesLang, maxDevices?: number): WelcomeCopy {
  const same = (n?: number) =>
    lang === "en"
      ? n === 1
        ? "This key works on 1 computer."
        : n
          ? `You can use the same key on up to ${n} computers.`
          : "The number of computers you can use depends on the tier you bought."
      : n === 1
        ? "Bu kod 1 bilgisayarda kullanılabilir."
        : n
          ? `Aynı kodu en fazla ${n} bilgisayarda kullanabilirsin.`
          : "Kaç bilgisayarda kullanabileceğin aldığın katmana bağlıdır.";
  return lang === "en"
    ? {
        title: "Thank you, your payment was received",
        receipt: "Your receipt will arrive by email from Paddle.",
        mailNote: "We also email the license key to the address you paid with.",
        steps: ["Install AreaPilot (download link below), then open AutoCAD and the AreaPilot License window.", "Paste the key and press Activate.", same(maxDevices)],
        support: "If you lose the key, write from the email you paid with to",
        back: "Back to AreaPilot",
        backHref: "/en/areapilot",
        download: "Download AreaPilot",
        downloadHref: "/en/areapilot#indir",
      }
    : {
        title: "Teşekkürler, ödemen alındı",
        receipt: "Makbuzun Paddle'dan e-postana gelecek.",
        mailNote: "Lisans kodunu ayrıca ödeme yaptığın e-posta adresine de gönderiyoruz.",
        steps: ["AreaPilot'u kur (indirme bağlantısı aşağıda), sonra AutoCAD'i ve AreaPilot Lisans penceresini aç.", "Kodu yapıştırıp Etkinleştir'e bas.", same(maxDevices)],
        support: "Kodu kaybedersen satın alırken kullandığın e-postayla şu adrese yaz:",
        back: "AreaPilot'a dön",
        backHref: "/areapilot",
        download: "AreaPilot'u indir",
        downloadHref: "/areapilot#indir",
      };
}
