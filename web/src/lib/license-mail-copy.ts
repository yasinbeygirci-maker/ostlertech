// Lisans e-postasında ürüne göre değişen sözcükler (saf; birim testli: tests/license-core.test.ts, "e-posta sözcükleri").
// Hitap: Türkçede "sen" (yasal metin değil, işlem e-postası). İngilizcede "license".
// NOT: lisans kodu e-postasının gönderimi (Resend) ayrı dalda (paddle-canli, commit 62c8f94, dosya web/src/lib/license-mail.ts)
// ve henüz main'de değil. O dal birleşince buildLicenseMail içindeki sabit "SyncPass Masaüstü Premium" / "en fazla 3 bilgisayar" /
// "Ayarlar > Lisans" satırları bu işlevden gelmeli (ürün + max_devices lisans satırından okunur, custom_data'dan değil).

export type MailProduct = "syncpass_desktop" | "areapilot";
export type MailLang = "tr" | "en";

export interface LicenseMailCopy {
  /** Ürün adı (plan satırında). */
  productName: string;
  /** Konu: "<ad> lisans kodun". */
  subject: string;
  /** Etkinleştirme adımları (numarasız). */
  steps: string[];
  /** Cihaz sınırı cümlesi. */
  devices: string;
  /** Ürüne özgü ek notlar (çevrimdışı süre, bilgisayar değiştirme); yoksa boş. */
  notes: string[];
  /** Plan satırı (ödeme biçimi). */
  planLine: (plan: "month" | "year" | "lifetime") => string;
}

export function licenseMailCopy(product: MailProduct, lang: MailLang, maxDevices: number): LicenseMailCopy {
  const n = Math.max(1, Math.floor(maxDevices));
  if (product === "areapilot") {
    return lang === "en"
      ? {
          productName: "AreaPilot",
          subject: "Your AreaPilot license key",
          steps: ["Open AutoCAD and the AreaPilot license window.", "Paste the key and press Activate."],
          devices: n === 1 ? "This key works on 1 computer." : `You can use the same key on up to ${n} computers.`,
          notes: [
            "You only need to go online once every 90 days; AreaPilot renews your license quietly in the background.",
            "When you change computers, open the License window on the old one and press Remove. The slot is freed for the new computer.",
          ],
          planLine: () => "Plan: AreaPilot license, valid for all 1.x versions. One payment, no renewals.",
        }
      : {
          productName: "AreaPilot",
          subject: "AreaPilot lisans kodun",
          steps: ["AutoCAD'i ve AreaPilot lisans penceresini aç.", "Kodu yapıştırıp Etkinleştir'e bas."],
          devices: n === 1 ? "Bu kod 1 bilgisayarda kullanılabilir." : `Aynı kodu en fazla ${n} bilgisayarda kullanabilirsin.`,
          notes: [
            "90 günde bir internete bağlanman yeterli; AreaPilot lisansını arka planda sessizce yeniler.",
            "Bilgisayar değiştirirken eski bilgisayarda Lisans penceresinden Kaldır'a bas; yer yeni bilgisayara açılır.",
          ],
          planLine: () => "Plan: AreaPilot lisansı, tüm 1.x sürümlerinde geçerli. Tek ödeme, yenileme yok.",
        };
  }
  if (lang === "en") {
    return {
      productName: "SyncPass Desktop Premium",
      subject: "Your SyncPass Desktop Premium license key",
      steps: ["Open SyncPass Desktop and unlock your vault.", "Go to Settings > License.", "Paste the key and press Activate."],
      devices: `You can use the same key on up to ${n} computers.`,
      notes: [],
      planLine: (plan) =>
        plan === "lifetime"
          ? "Plan: SyncPass Desktop Premium, lifetime. One payment, no renewals."
          : `Plan: SyncPass Desktop Premium, ${plan === "month" ? "monthly" : "yearly"} subscription.`,
    };
  }
  return {
    productName: "SyncPass Masaüstü Premium",
    subject: "SyncPass Masaüstü Premium lisans kodun",
    steps: ["SyncPass Masaüstü'nü aç ve kasanın kilidini aç.", "Ayarlar > Lisans bölümüne git.", "Kodu yapıştırıp Etkinleştir'e bas."],
    devices: `Aynı kodu en fazla ${n} bilgisayarda kullanabilirsin.`,
    notes: [],
    planLine: (plan) =>
      plan === "lifetime"
        ? "Plan: SyncPass Masaüstü Premium, ömür boyu. Tek ödeme, yenileme yok."
        : `Plan: SyncPass Masaüstü Premium, ${plan === "month" ? "aylık" : "yıllık"} abonelik.`,
  };
}

/** AreaPilot "bilgisayarları sıfırla" e-postası. Bağlantı 30 dakika geçerli ve tek kullanımlıktır. */
export function resetMailCopy(lang: MailLang, link: string): { subject: string; text: string } {
  if (lang === "en") {
    return {
      subject: "Reset the computers on your AreaPilot license",
      text: [
        "You (or someone with your license key) asked to reset the computers registered to your AreaPilot license.",
        "",
        "To remove all registered computers, open this link and press Reset (valid for 30 minutes, works once):",
        link,
        "",
        "Afterwards you can activate the license again on any computer. Your drawings and files are not touched.",
        "If you did not ask for this, ignore this e-mail; nothing changes.",
        "",
        "Questions: destek@ostlertech.com",
        "OstlerTech",
      ].join("\n"),
    };
  }
  return {
    subject: "AreaPilot lisansındaki bilgisayarları sıfırla",
    text: [
      "Sen (ya da lisans kodunu bilen biri) AreaPilot lisansına kayıtlı bilgisayarların sıfırlanmasını istedi.",
      "",
      "Kayıtlı tüm bilgisayarları kaldırmak için bu bağlantıyı aç ve Sıfırla'ya bas (30 dakika geçerli, bir kez çalışır):",
      link,
      "",
      "Sonra lisansı istediğin bilgisayarda yeniden etkinleştirebilirsin. Çizimlerin ve dosyaların etkilenmez.",
      "Bunu sen istemediysen bu e-postayı yok say; hiçbir şey değişmez.",
      "",
      "Sorular: destek@ostlertech.com",
      "OstlerTech",
    ].join("\n"),
  };
}
