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
            "You go online to activate, to remove a computer and to reset your devices. After activation your license has no expiry and AreaPilot never asks you to renew; it only checks quietly now and then whether the license was refunded and whether this computer is still registered under it. If it cannot reach the server, nothing changes and AreaPilot keeps working.",
            "When you change computers, open the License window on the old one and press Remove. The slot is freed for the new computer. Remove works up to 3 times per 30 days.",
          ],
          planLine: () => "Plan: AreaPilot license, valid for all 1.x versions. One payment, no renewals.",
        }
      : {
          productName: "AreaPilot",
          subject: "AreaPilot lisans kodun",
          steps: ["AutoCAD'i ve AreaPilot lisans penceresini aç.", "Kodu yapıştırıp Etkinleştir'e bas."],
          devices: n === 1 ? "Bu kod 1 bilgisayarda kullanılabilir." : `Aynı kodu en fazla ${n} bilgisayarda kullanabilirsin.`,
          notes: [
            "İnternete etkinleştirirken, bilgisayarı kaldırırken ve cihazları sıfırlarken bağlanırsın. Etkinleştirdikten sonra lisansın süresizdir, yenileme istenmez; AreaPilot arada bir, sadece lisansın iade edilip edilmediğine ve bu bilgisayarın lisansta kayıtlı olup olmadığına sessizce bakar. Sunucuya ulaşamazsa hiçbir şey değişmez, çalışmaya devam eder.",
            "Bilgisayar değiştirirken eski bilgisayarda Lisans penceresinden Kaldır'a bas; yer yeni bilgisayara açılır. Kaldırma 30 günde en çok 3 kez yapılabilir.",
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

/** AreaPilot "bilgisayarları sıfırla" bağlantı e-postası. Bağlantı 30 dakika geçerli ve tek kullanımlıktır. */
export function resetMailCopy(lang: MailLang, link: string): { subject: string; text: string } {
  if (lang === "en") {
    return {
      subject: "Reset the computers on your AreaPilot license",
      text: [
        "Someone (you, or a person who has your license key) asked to reset the computers registered to your AreaPilot license.",
        "",
        "To go ahead, open this link and press Reset (valid for 30 minutes, works once):",
        link,
        "",
        "Resetting removes all registered computers AND replaces your license key with a new one: the old key stops working, the new key is shown once on the page and e-mailed to you. Your drawings and files are not touched. A license can be reset at most twice per 30 days.",
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
      "AreaPilot lisansına kayıtlı bilgisayarların sıfırlanması istendi (sen ya da lisans kodunu bilen biri istemiş olabilir).",
      "",
      "Devam etmek için bu bağlantıyı aç ve Sıfırla'ya bas (30 dakika geçerli, bir kez çalışır):",
      link,
      "",
      "Sıfırlama kayıtlı tüm bilgisayarları kaldırır VE lisans kodunu yenisiyle değiştirir: eski kod çalışmaz, yeni kod sayfada bir kez gösterilir ve sana e-postayla da gönderilir. Çizimlerin ve dosyaların etkilenmez. Bir lisans 30 günde en çok 2 kez sıfırlanabilir.",
      "Bunu sen istemediysen bu e-postayı yok say; hiçbir şey değişmez.",
      "",
      "Sorular: destek@ostlertech.com",
      "OstlerTech",
    ].join("\n"),
  };
}

/** Sıfırlama onaylanınca gönderilen yeni lisans kodu e-postası. */
export function newKeyMailCopy(lang: MailLang, key: string): { subject: string; text: string } {
  if (lang === "en") {
    return {
      subject: "Your new AreaPilot license key",
      text: [
        "Your AreaPilot license was reset. Your new license key:",
        key,
        "",
        "The old key no longer works. Open the AreaPilot License window on each computer you use and activate with the new key. Computers activated with the old key switch to free mode at their next license status check while online.",
        "If you did not do this, write to destek@ostlertech.com right away.",
        "",
        "OstlerTech",
      ].join("\n"),
    };
  }
  return {
    subject: "AreaPilot yeni lisans kodun",
    text: [
      "AreaPilot lisansın sıfırlandı. Yeni lisans kodun:",
      key,
      "",
      "Eski kod artık çalışmaz. Kullandığın her bilgisayarda AreaPilot Lisans penceresini aç ve yeni kodla etkinleştir. Eski kodla etkinleştirilmiş bilgisayarlar, internete bağlıyken yapılan bir sonraki lisans durum sorgusunda ücretsiz moda geçer.",
      "Bunu sen yapmadıysan hemen destek@ostlertech.com adresine yaz.",
      "",
      "OstlerTech",
    ].join("\n"),
  };
}

/**
 * AreaPilot satın alma sonrası lisans kodu e-postası (işlem e-postası; pazarlama yok). Ürün adı, adımlar, cihaz sayısı ve notlar
 * `licenseMailCopy("areapilot", ...)` ile aynı kaynaktan gelir; ürün sözcüğü SyncPass metnine karışmaz.
 * [ZEYNEP] kapısı: iade/vergi cümlesi bu e-postada YOK (makbuz ve iade bağlantısı Paddle'ın kendi e-postasındadır); eklenecekse Zeynep onaylar.
 */
export function purchaseKeyMailCopy(lang: MailLang, key: string, maxDevices: number, downloadUrl: string): { subject: string; text: string } {
  const c = licenseMailCopy("areapilot", lang, maxDevices);
  if (lang === "en") {
    return {
      subject: c.subject,
      text: [
        "Thank you for buying AreaPilot.",
        "",
        "Your license key:",
        key,
        "",
        "How to activate:",
        ...c.steps.map((s, i) => `${i + 1}. ${s}`),
        "",
        c.devices,
        c.planLine("lifetime"),
        ...c.notes,
        "",
        `Not installed yet? Download AreaPilot: ${downloadUrl}`,
        "",
        "Do not share this key with anyone: whoever has it can activate it on their own computers and use up your slots. If you think it reached someone else, write to destek@ostlertech.com.",
        "Your receipt from Paddle (our reseller) arrives in a separate email. Keep this email: the key is also shown on the page after checkout.",
        "",
        "Questions: destek@ostlertech.com",
        "OstlerTech",
      ].join("\n"),
    };
  }
  return {
    subject: c.subject,
    text: [
      "AreaPilot'u satın aldığın için teşekkürler.",
      "",
      "Lisans kodun:",
      key,
      "",
      "Etkinleştirme:",
      ...c.steps.map((s, i) => `${i + 1}. ${s}`),
      "",
      c.devices,
      c.planLine("lifetime"),
      ...c.notes,
      "",
      `Henüz kurmadıysan AreaPilot'u buradan indir: ${downloadUrl}`,
      "",
      "Kodu kimseyle paylaşma: kodu bilen onu kendi bilgisayarlarında etkinleştirip senin yerlerini doldurabilir. Kodun başkasına ulaştığını düşünüyorsan destek@ostlertech.com adresine yaz.",
      "Makbuzun yetkili satıcımız Paddle'dan ayrı bir e-postayla gelir. Bu e-postayı sakla: kod ödeme sonrası açılan sayfada da görünür.",
      "",
      "Sorular: destek@ostlertech.com",
      "OstlerTech",
    ].join("\n"),
  };
}
