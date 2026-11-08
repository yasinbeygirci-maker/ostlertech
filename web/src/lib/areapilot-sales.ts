// AreaPilot satın alma bölümünün saf mantığı ve metni (TR + EN). İSTEMCİ DOSYALARI bunu içe aktarabilir: burada Paddle FİYAT KİMLİĞİ YOKTUR.
// Fiyat kimlikleri yalnız sunucuda (paddle-tiers.ts) durur ve /api/areapilot/satis ile SADECE satış bayrağı açıkken tarayıcıya verilir.
// Kart fiyatları aşağıda SABİT yazılır, Türkiye için KDV DAHİL toplam (Yasin 2026-11-07, son karar): burada vergi hesabı ve Paddle önizlemesi yoktur.
// Ofis ve Firma toplamları Paddle ödeme penceresinde doğrulanmadı; ilk gerçek ödeme adımında kart ile pencere karşılaştırılır.
export type SalesLang = "tr" | "en";
export type AreaPilotTierId = "individual" | "office" | "firm";
export const AREAPILOT_TIER_IDS: readonly AreaPilotTierId[] = ["individual", "office", "firm"];

/** Katman başına bilgisayar sayısı. Gerçek sınır sunucu tablosundadır (paddle-tiers.ts); bu yalnız kart metni içindir. */
export const AREAPILOT_TIER_DEVICES: Record<AreaPilotTierId, number> = { individual: 1, office: 5, firm: 20 };

/** Kartta gösterilen KDV DAHİL toplamlar (sabit, hesaplanmaz). Ana fiyat budur; Paddle penceresindeki toplamla aynı olmalıdır. */
export const AREAPILOT_TIER_PRICES: Record<AreaPilotTierId, Record<SalesLang, string>> = {
  individual: { tr: "₺2.398,80", en: "₺2,398.80" },
  office: { tr: "₺9.598,80", en: "₺9,598.80" },
  firm: { tr: "₺23.998,80", en: "₺23,998.80" },
};

/** Küçük dipnot: KDV hariç liste fiyatı (sabit). */
export const AREAPILOT_TIER_PRICES_EXCL_TAX: Record<AreaPilotTierId, Record<SalesLang, string>> = {
  individual: { tr: "₺1.999 + KDV", en: "₺1,999 + VAT" },
  office: { tr: "₺7.999 + KDV", en: "₺7,999 + VAT" },
  firm: { tr: "₺19.999 + KDV", en: "₺19,999 + VAT" },
};

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
// Mesafeli satış ön bilgisi (iade, vergi, Paddle satıcı notu, Autodesk notu) aşağıda areapilotPreInfo() içindedir (Zeynep hukuk kapısı §5.1, yasal metin: "siz").
// AreaPilot yasal sayfa ekleri ayrı dosyada: areapilot-legal.ts (onay bekliyor, kapalı). Bayrak açılmadan önce Zeynep + Yasin onaylar; Defne dil denetimi yapar.
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
  /** Fiyatın yanındaki kısa vergi notu. */
  taxIncluded: string;
  /** Kartların altındaki tek satır. */
  priceNote: string;
  buy: string;
  highlightedLabel: string;
  tiers: Record<AreaPilotTierId, TierCopy>;
  after: string[];
  error: string;
}

const commonTr = (n: number): string[] => [
  "Tek seferlik ödeme, yenileme yok",
  "Tüm 1.x sürümlerinde geçerli (2.0 dahil değil)",
  n === 1 ? "Kodu 1 bilgisayarda kullanabilirsin" : `Aynı kodu en çok ${n} bilgisayarda kullanabilirsin`,
];
const commonEn = (n: number): string[] => [
  "One-time payment, no renewal",
  "Valid for all 1.x versions (not 2.0)",
  n === 1 ? "Use the key on 1 computer" : `Use the same key on up to ${n} computers`,
];

export const SALES_COPY: Record<SalesLang, SalesCopy> = {
  tr: {
    id: "fiyatlar",
    title: "Fiyatlar",
    lead: "AreaPilot tek seferlik lisanstır: bir kez öde, 1.x sürümlerinin hepsinde kullan. Kaç bilgisayarda kullanacağına göre katmanı seç.",
    once: "tek seferlik",
    taxIncluded: "Türkiye için KDV dahil",
    priceNote: "Gösterilen fiyatlar Türkiye için %20 KDV dahil toplamdır. Ödeyeceğin tutar ödeme adımında gösterilen toplamdır; vergi numarası girersen ya da başka bir ülkeden alırsan vergi tutarı değişebilir.",
    buy: "Satın al",
    highlightedLabel: "Çoğu ekip için",
    tiers: {
      individual: { name: "Bireysel", devices: "1 bilgisayar", features: commonTr(1) },
      office: { name: "Ofis", devices: "5 bilgisayar", features: commonTr(5) },
      firm: { name: "Firma", devices: "20 bilgisayar", features: commonTr(20) },
    },
    after: [
      "Ödeme bitince lisans kodun açılan sayfada görünür ve e-postana da gönderilir (birkaç dakika içinde gelmezse Spam ya da Güncellemeler klasörüne bak). Kodu yalnız kendi işinde ya da firmanın bilgisayarlarında, lisanstaki bilgisayar sayısı kadar kullan; firmanın dışından kimseyle paylaşma: kodu bilen onu kendi bilgisayarında etkinleştirip bilgisayar hakkını tüketebilir.",
      "Kodu girmek için AutoCAD'de AREAPILOT_LISANS yaz; \"AreaPilot Lisansı\" penceresinde kodu yapıştırıp \"Etkinleştir\"e bas.",
      "Bilgisayar değiştirirken eski bilgisayarda \"Bu bilgisayardan kaldır\"a bas (internet gerekir, 30 günde en çok 3 kez); hak yeni bilgisayara geçer. Eski bilgisayara ulaşamıyorsan \"Cihazlarımı sıfırla (e-posta)\" ile bilgisayarlarını sıfırlayabilirsin (30 günde en çok 2 kez); sıfırlamada kodun yenisiyle değişir.",
    ],
    error: "Fiyatlar şu an yüklenemedi. Sayfayı yenile; sorun sürerse destek@ostlertech.com adresine yaz.",
  },
  en: {
    id: "pricing",
    title: "Pricing",
    lead: "AreaPilot is a one-time license: pay once and use it on every 1.x version. Pick the tier by how many computers you will use it on.",
    once: "one-time",
    taxIncluded: "incl. VAT (Türkiye)",
    priceNote: "The prices shown are totals including 20% VAT for Türkiye. You pay the total shown at checkout; if you enter a tax number or buy from another country, the tax may change.",
    buy: "Buy",
    highlightedLabel: "For most teams",
    tiers: {
      individual: { name: "Individual", devices: "1 computer", features: commonEn(1) },
      office: { name: "Office", devices: "5 computers", features: commonEn(5) },
      firm: { name: "Firm", devices: "20 computers", features: commonEn(20) },
    },
    after: [
      "When the payment completes, your license key appears on the page that opens and is also emailed to you (if it does not arrive within a few minutes, check your Spam or Updates folder). Use the key only for your own work or on your company's computers, up to the number of computers in the license, and do not share it outside your company: anyone who has it can activate it on their own computer and use up your computer limit.",
      "To enter the key, type AREAPILOT_LISANS in AutoCAD, paste the key in the \"AreaPilot License\" window and press \"Activate\".",
      "When you switch computers, press \"Remove from this computer\" on the old one (needs internet, up to 3 times in 30 days). If you can't reach the old computer, use \"Reset my devices (email)\" (up to 2 times in 30 days); a reset replaces your key with a new one.",
    ],
    error: "Prices could not be loaded right now. Refresh the page; if it continues, write to destek@ostlertech.com.",
  },
};

// ---- Mesafeli satış ön bilgisi (Zeynep hukuk kapısı §5.1; yasal metin: TR "siz") ----
// SALES_COPY'den AYRI: orası "sen" hitabı ve fiyat tutarı yasağıyla taranır. Tutarlar yalnız yukarıdaki sabit tablolardan okunur (tek kaynak).
export interface PreInfoItem {
  label: string;
  text: string;
}
export interface PreInfoLink {
  label: string;
  /** null: sayfa henüz yok, bağlantı çizilmez (yayına kapalı sözleşme/gizlilik sayfaları; areapilot-legal.ts onayıyla birlikte eklenir). */
  href: string | null;
}
export interface PreInfoCopy {
  title: string;
  items: PreInfoItem[];
  links: PreInfoLink[];
  trademark: string;
}

function tierLine(lang: SalesLang, names: Record<AreaPilotTierId, string>): string {
  return AREAPILOT_TIER_IDS.map((t) => `${names[t]} ${AREAPILOT_TIER_PRICES_EXCL_TAX[t][lang]} = ${AREAPILOT_TIER_PRICES[t][lang]}`).join("; ");
}

export function areapilotPreInfo(lang: SalesLang): PreInfoCopy {
  if (lang === "en") {
    return {
      title: "Before you buy",
      items: [
        { label: "Product and compatibility", text: "AreaPilot 1.x; Windows 10 and 11 (64-bit), AutoCAD® 2013-2027 (64-bit). It does not run in AutoCAD LT. Before you buy, try it on your own version with the 7-day full trial; the versions it has been tested with are listed on this page." },
        { label: "Price, taxes and seller", text: `The amounts on the cards are totals including 20% VAT for Türkiye: ${tierLine("en", { individual: "Individual", office: "Office", firm: "Firm" })}. For other countries tax is calculated for your country. The amount you pay is the tax-inclusive total shown on the checkout page; if you enter a tax number, the tax may change. It is a one-time payment and does not renew. The seller, who takes your payment, is our reseller Paddle.com (Merchant of Record); Paddle sends your receipt, and your payment details do not reach us.` },
        { label: "Delivery", text: "Your license key is shown on the page that opens right after payment and emailed to the address you paid with." },
        { label: "License and internet", text: "The license has no end date. An internet connection is needed only for activation, \"Remove from this computer\" and \"Reset my devices (email)\"; an activated license keeps working even if our server cannot be reached. While AreaPilot is running and online, about once a week it asks whether the license has been refunded or cancelled and whether this computer is still registered; a refunded license switches to free mode at that check. Activation sends the license key, a random device number and the version; the weekly check sends only the key and the device number. \"Remove from this computer\" can be used up to 3 times and \"Reset my devices (email)\" up to 2 times in 30 days; a reset replaces your key with a new one, and computers activated with the old key switch to free mode at their next check." },
        { label: "Versions", text: "The license is valid for all 1.x versions; 2.0 and later major versions are not included." },
        { label: "Withdrawal and refunds", text: "Because the license key is digital content delivered right after payment, the statutory right of withdrawal does not apply to this purchase where your law allows this exception. We still refund the full price of Individual, Office and Firm licenses if you ask within 14 days of payment, no reason needed; refunds are for the whole license. A refunded license is cancelled; on computers that are online it switches to free mode at the next license status check, and continuing to use a refunded license breaches the license agreement." },
        { label: "Complaints", text: "destek@ostlertech.com. Consumers keep the rights and remedies of their local law." },
      ],
      links: [
        { label: "Terms of Use and Sale", href: "/en/terms" },
        { label: "Delivery and Refund Policy", href: "/en/refunds" },
        { label: "License Agreement", href: null },
        { label: "Privacy Policy", href: null },
      ],
      trademark: "AutoCAD is a registered trademark or trademark of Autodesk, Inc. and/or its subsidiaries and/or affiliates in the USA and/or other countries. AreaPilot is not made, endorsed or supported by Autodesk.",
    };
  }
  return {
    title: "Satın almadan önce",
    items: [
      { label: "Ürün ve uyumluluk", text: "AreaPilot 1.x; Windows 10 ve 11 (64 bit), AutoCAD® 2013-2027 (64 bit). AutoCAD LT'de çalışmaz. Satın almadan önce 7 günlük tam denemeyle kendi sürümünüzde deneyin; denendiği sürümler bu sayfada yazılıdır." },
      { label: "Fiyat, vergiler ve satıcı", text: `Kartlardaki tutarlar Türkiye için %20 KDV dahil toplam fiyattır: ${tierLine("tr", { individual: "Bireysel", office: "Ofis", firm: "Firma" })}. Türkiye dışında vergi bulunduğunuz ülkeye göre hesaplanır. Ödeyeceğiniz tutar, ödeme sayfasında gösterilen vergiler dahil toplamdır; vergi numarası girerseniz vergi tutarı değişebilir. Tek seferlik ödemedir, yenilenmez. Satıcı ve ödemeyi alan, yetkili satıcımız Paddle.com'dur (Merchant of Record); makbuzunuzu Paddle gönderir, ödeme bilgileriniz bize iletilmez.` },
      { label: "Teslimat", text: "Lisans kodu ödemeden hemen sonra açılan sayfada gösterilir ve ödemede kullandığınız e-posta adresine gönderilir." },
      { label: "Lisans ve internet", text: "Lisansın bitiş tarihi yoktur. İnternet yalnız etkinleştirme, \"Bu bilgisayardan kaldır\" ve \"Cihazlarımı sıfırla (e-posta)\" için gerekir; sunucumuz erişilemez olsa da etkinleştirilmiş lisans çalışmaya devam eder. AreaPilot çalışırken ve internete bağlıyken yaklaşık haftada bir lisansın iade ya da iptal edilip edilmediğini ve bu bilgisayarın kayıtlı olup olmadığını sorar; iade edilen lisans bu sorguda ücretsiz moda geçer. Etkinleştirmede lisans kodu, rastgele bir cihaz numarası ve sürüm; haftalık sorguda yalnız kod ve cihaz numarası gönderilir. \"Bu bilgisayardan kaldır\" 30 günde en çok 3 kez, \"Cihazlarımı sıfırla (e-posta)\" 30 günde en çok 2 kez kullanılabilir; sıfırlamada kodunuz yenisiyle değişir ve eski kodla etkinleştirilmiş bilgisayarlar bir sonraki sorguda ücretsiz moda geçer." },
      { label: "Sürümler", text: "Lisans bütün 1.x sürümlerinde geçerlidir; 2.0 ve sonraki ana sürümler dahil değildir." },
      { label: "Cayma ve iade", text: "Lisans kodu ödemeden hemen sonra teslim edilen dijital içerik olduğu için bu satışta yasal cayma hakkı uygulanmaz (Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ). Buna rağmen Bireysel, Ofis ve Firma lisanslarının hepsinde, ödeme tarihinden itibaren 14 gün içinde gerekçe göstermeden ücretin tamamını iade ederiz; iade lisansın tamamı için yapılır. İade edilen lisans iptal edilir; internete bağlı bilgisayarlarda bir sonraki lisans durum sorgusunda ücretsiz moda geçer, iade edilen lisansı kullanmaya devam etmek lisans sözleşmesine aykırıdır." },
      { label: "Şikâyet", text: "destek@ostlertech.com. Tüketici hakem heyetine ya da tüketici mahkemesine başvurma hakkınız saklıdır." },
    ],
    links: [
      { label: "Kullanım ve Satış Koşulları", href: "/kullanim-sartlari" },
      { label: "Teslimat ve İade Politikası", href: "/teslimat-ve-iade" },
      { label: "Lisans Sözleşmesi", href: null },
      { label: "Gizlilik Politikası", href: null },
    ],
    trademark: "AutoCAD, Autodesk, Inc.'in ve/veya bağlı şirketlerinin ABD'de ve/veya diğer ülkelerde tescilli markası ya da markasıdır. AreaPilot, Autodesk tarafından yapılmamış, onaylanmamış ve desteklenmemektedir.",
  };
}

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
        mailNote: "We also email the license key to the address you paid with. If it does not arrive within a few minutes, check your Spam or Updates folder.",
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
        mailNote: "Lisans kodunu ayrıca ödeme yaptığın e-posta adresine de gönderiyoruz. Birkaç dakika içinde gelmezse Spam ya da Güncellemeler klasörüne bak.",
        steps: ["AreaPilot'u kur (indirme bağlantısı aşağıda), sonra AutoCAD'i ve AreaPilot Lisans penceresini aç.", "Kodu yapıştırıp Etkinleştir'e bas.", same(maxDevices)],
        support: "Kodu kaybedersen satın alırken kullandığın e-postayla şu adrese yaz:",
        back: "AreaPilot'a dön",
        backHref: "/areapilot",
        download: "AreaPilot'u indir",
        downloadHref: "/areapilot#indir",
      };
}
