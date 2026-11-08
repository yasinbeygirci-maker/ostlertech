// AreaPilot sayfasının SoftwareApplication yapısal verisi (saf; tests/areapilot-ld.test.ts).
// Fiyatlar görünen metinle aynı kaynaktan (AREAPILOT_TIER_PRICES) gelir: SSS cevabı ve satış kartları aynı tutarı söyler.
import { AREAPILOT } from "./areapilot";
import { AREAPILOT_COPY, type Lang } from "./areapilot-content";
import { AREAPILOT_TIER_DEVICES, AREAPILOT_TIER_IDS, AREAPILOT_TIER_PRICES, SALES_COPY } from "./areapilot-sales";
import { SITE_URL } from "./site";

/** Şirket kaydının kimliği; ana sayfadaki Organization yapısal verisi aynı @id'yi taşır. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** "₺2.398,80" -> "2398.80" (schema.org fiyatı nokta ondalıklı düz sayıdır). */
export function tryAmount(tr: string): string {
  const m = /^₺(\d{1,3}(?:\.\d{3})*),(\d{2})$/.exec(tr);
  if (!m) throw new Error(`fiyat biçimi beklenmiyor: ${tr}`);
  return `${m[1].replace(/\./g, "")}.${m[2]}`;
}

export function areapilotAppLd(lang: Lang) {
  const c = AREAPILOT_COPY[lang];
  const s = SALES_COPY[lang];
  const pageUrl = `${SITE_URL}${lang === "tr" ? AREAPILOT.path : AREAPILOT.enPath}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#software`,
    name: "AreaPilot",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "AutoCAD plugin",
    operatingSystem: "Windows 10, Windows 11",
    softwareVersion: AREAPILOT.version,
    description: c.description,
    inLanguage: lang,
    url: pageUrl,
    image: `${SITE_URL}/areapilot/${lang === "tr" ? "og-areapilot.png" : "og-areapilot-en.png"}`,
    // Tek seferlik lisans, üç katman; fiyatlar Türkiye için KDV dahil (Yasin 2026-11-07). "seller" BİLEREK yok:
    // satıcı (Merchant of Record) Paddle.com'dur, OstlerTech değil (ön bilgi ve kullanım koşulları).
    offers: AREAPILOT_TIER_IDS.map((tier) => {
      const price = tryAmount(AREAPILOT_TIER_PRICES[tier].tr);
      const n = AREAPILOT_TIER_DEVICES[tier];
      return {
        "@type": "Offer",
        name: lang === "tr" ? `${s.tiers[tier].name} lisans (${n} bilgisayar)` : `${s.tiers[tier].name} license (${n} ${n === 1 ? "computer" : "computers"})`,
        price,
        priceCurrency: "TRY",
        priceSpecification: { "@type": "PriceSpecification", price, priceCurrency: "TRY", valueAddedTaxIncluded: true },
        availability: "https://schema.org/InStock",
        url: `${pageUrl}#${s.id}`,
      };
    }),
    publisher: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "OstlerTech", url: SITE_URL },
  };
}
