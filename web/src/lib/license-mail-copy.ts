// Lisans e-postasında ürüne göre değişen sözcükler (saf, birim testli: tests/license-mail-copy.test.ts).
// NOT: e-posta gönderimi (Resend) ayrı dalda (paddle-canli, 62c8f94) ve henüz main'de değil. O dal birleşince
// buildLicenseMail içindeki sabit "SyncPass Masaüstü Premium" / "en fazla 3 bilgisayar" / "Ayarlar > Lisans" satırları
// bu işlevden gelmeli (ürün + max_devices lisans satırından okunur, custom_data'dan değil).

export type MailProduct = "syncpass_desktop" | "areapilot";
export type MailLang = "tr" | "en";

export interface LicenseMailCopy {
  /** Ürün adı (plan satırında). */
  productName: string;
  /** Konu: "<ad> lisans kodunuz". */
  subject: string;
  /** Etkinleştirme adımları (numarasız). */
  steps: string[];
  /** Cihaz sınırı cümlesi. */
  devices: string;
  /** Plan satırı (ödeme biçimi). */
  planLine: (plan: "month" | "year" | "lifetime") => string;
}

export function licenseMailCopy(product: MailProduct, lang: MailLang, maxDevices: number): LicenseMailCopy {
  const n = Math.max(1, Math.floor(maxDevices));
  if (product === "areapilot") {
    return lang === "en"
      ? {
          productName: "AreaPilot",
          subject: "Your AreaPilot licence key",
          steps: ["Open AutoCAD and the AreaPilot licence window.", "Paste the key and press Activate."],
          devices: n === 1 ? "This key works on 1 computer." : `You can use the same key on up to ${n} computers.`,
          planLine: () => "Plan: AreaPilot licence, valid for all 1.x versions. One payment, no renewals.",
        }
      : {
          productName: "AreaPilot",
          subject: "AreaPilot lisans kodunuz",
          steps: ["AutoCAD'i ve AreaPilot lisans penceresini açın.", "Kodu yapıştırıp Etkinleştir'e basın."],
          devices: n === 1 ? "Bu kod 1 bilgisayarda kullanılabilir." : `Aynı kodu en fazla ${n} bilgisayarda kullanabilirsiniz.`,
          planLine: () => "Plan: AreaPilot lisansı, tüm 1.x sürümlerinde geçerli. Tek ödeme, yenileme yok.",
        };
  }
  if (lang === "en") {
    return {
      productName: "SyncPass Desktop Premium",
      subject: "Your SyncPass Desktop Premium licence key",
      steps: ["Open SyncPass Desktop and unlock your vault.", "Go to Settings > Licence.", "Paste the key and press Activate."],
      devices: `You can use the same key on up to ${n} computers.`,
      planLine: (plan) =>
        plan === "lifetime"
          ? "Plan: SyncPass Desktop Premium, lifetime. One payment, no renewals."
          : `Plan: SyncPass Desktop Premium, ${plan === "month" ? "monthly" : "yearly"} subscription.`,
    };
  }
  return {
    productName: "SyncPass Masaüstü Premium",
    subject: "SyncPass Masaüstü Premium lisans kodunuz",
    steps: ["SyncPass Masaüstü'nü açın ve kasanızın kilidini açın.", "Ayarlar > Lisans bölümüne gidin.", "Kodu yapıştırıp Etkinleştir'e basın."],
    devices: `Aynı kodu en fazla ${n} bilgisayarda kullanabilirsiniz.`,
    planLine: (plan) =>
      plan === "lifetime"
        ? "Plan: SyncPass Masaüstü Premium, ömür boyu. Tek ödeme, yenileme yok."
        : `Plan: SyncPass Masaüstü Premium, ${plan === "month" ? "aylık" : "yıllık"} abonelik.`,
  };
}
