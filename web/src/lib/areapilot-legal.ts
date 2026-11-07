// AreaPilot yasal sayfa ekleri (TR + EN): /kullanim-sartlari (+/en/terms), /teslimat-ve-iade (+/en/refunds), /gizlilik (+/en/privacy).
// Kaynak: Zeynep hukuk kapısı (pazarlama/2026-11-07-areapilot-1-0-hukuk-kapisi.md §6) + dünkü ürün eki taslağı (zeynep-taslaklar/2026-11-07-areapilot-satis-metinleri.md §1.9, §2).
//
// KAPALI: AREAPILOT_LEGAL_ONAY_BEKLIYOR true iken sayfalar eskisi gibi çizilir (AreaPilot bölümü ve bölüm numarası kayması YOK).
// Zeynep + Yasin son okumayı yapınca bayrak false yapılır. Satış bayrağı (PADDLE_SALES_OPEN_AREAPILOT) ayrı ve bu dosyaya bağlı değildir.
// Bu dosya ISTEMCİ ya da sunucu ortam değişkeni okumaz; saf metindir. "{EMAIL}" çizimde destek adresiyle değişir.
//
// Hitap: yasal metin, "siz". Yasak ifade: "internetsiz", "çevrimdışı", "vergileri içerir" (fiyat kartı KDV dahil toplamı gösterir, bkz. areapilot-sales.ts).
export const AREAPILOT_LEGAL_ONAY_BEKLIYOR = true;

export type LegalLang = "tr" | "en";

export interface LegalItem {
  /** Kalın başlangıç ("5.1 Teslimat."). */
  lead?: string;
  text: string;
}
export interface LegalSection {
  heading: string;
  items: LegalItem[];
}

/** Sayfa AreaPilot ekini göstersin mi. Onay beklerken false. */
export function areapilotLegalLive(): boolean {
  return !AREAPILOT_LEGAL_ONAY_BEKLIYOR;
}

/** Eklenen bölüm sayısı kadar sonraki bölümler kayar (yalnız /kullanim-sartlari: 7-11 yeni). */
export const TERMS_SHIFT = 5;

// ------------------------------------------------------------------ /kullanim-sartlari

export const TERMS_INTRO2: Record<LegalLang, string> = {
  tr: "Satış koşulları ürünü nereden satın aldığınıza göre ayrılır: ostlertech.com üzerinden Paddle ile satılan lisanslara 2. bölüm; SyncPass Masaüstü lisanslarına ayrıca 3-5. bölümler; AreaPilot lisanslarına 7-11. bölümler; Google Play üzerinden satılan SyncPass Android Premium planlarına 6. bölüm uygulanır. Diğer bölümler hepsi için geçerlidir.",
  en: "The sales terms depend on where you bought the product: section 2 applies to licenses sold on ostlertech.com through Paddle; sections 3-5 also apply to SyncPass Desktop licenses; sections 7-11 apply to AreaPilot licenses; section 6 applies to SyncPass Android Premium plans sold through Google Play. The other sections apply to all of them.",
};

export const TERMS_SECTIONS: Record<LegalLang, LegalSection[]> = {
  tr: [
    {
      heading: "7. AreaPilot: ürün, deneme ve planlar",
      items: [
        {
          text: "AreaPilot, AutoCAD® yazılımı için alan ve çevre metrajı eklentisidir. İlk kullanımdan başlayarak 7 gün boyunca bütün özellikleri açıktır (deneme). Deneme bittikten sonra lisans almazsanız AreaPilot süresiz olarak ücretsiz modda çalışır; bu modda her çalıştırmada en çok 15 alan işlenir. Ücretsiz modun kapsamını yeni sürümlerde değiştirebiliriz. Deneme ve ücretsiz modu, ticari işler dahil kendi işiniz ya da kuruluşunuzun işi için ücretsiz kullanabilirsiniz. Lisans tek seferlik ödemedir, abonelik değildir. Planlar: Bireysel (1 bilgisayar), Ofis (en çok 5 bilgisayar), Firma (en çok 20 bilgisayar). Fiyatlar Türkiye için %20 KDV dahil toplam olarak gösterilir; başka ülkelerde vergi bulunduğunuz ülkeye göre ödeme sayfasında hesaplanır. Ödeyeceğiniz tutar, ödemeyi onayladığınız anda ödeme sayfasında gördüğünüz vergiler dahil toplamdır.",
        },
      ],
    },
    {
      heading: "8. AreaPilot: lisansın kapsamı",
      items: [
        {
          text: "Yazılım size satılmaz, lisanslanır. Lisansla, AreaPilot'u geçerli lisansına sahip olduğunuz AutoCAD® yazılımıyla ve o lisansın kapsamında, kendi işiniz ya da lisansı satın alan kuruluşun işi için kullanma hakkı alırsınız; bu hak münhasır değildir ve yazılı iznimiz olmadan devredilemez. Bireysel lisans bir kişi ve bir bilgisayar içindir. Ofis ve Firma lisanslarını satın alan kuruluş, kendi çalışanlarının bilgisayarlarında, lisanstaki bilgisayar sayısını aşmadan kullanabilir. Lisans kodunu kuruluşunuzun dışındaki kişilerle paylaşamaz, satamaz, kiralayamaz; deneme ya da ücretsiz mod sınırını ve cihaz sınırını aşmaya çalışamazsınız. Ayrıntılar: AreaPilot Lisans Sözleşmesi (kurulum sırasında ve “AreaPilot Hakkında” penceresinde gösterilir).",
        },
      ],
    },
    {
      heading: "9. AreaPilot: etkinleştirme, bilgisayar değiştirme ve sıfırlama",
      items: [
        {
          text: "Lisans kodunu girdiğinizde ve sonra AutoCAD'de AreaPilot çalıştırıldığında, son doğrulamadan 7 gün geçtiyse, AreaPilot lisansı sunucumuzla yeniden doğrular; her doğrulama en çok 90 gün geçerlidir. Bu yüzden etkinleştirmek için bir kez, sonra en az 90 günde bir internet bağlantısı gerekir; 90 gün hiç doğrulanmayan bilgisayarda AreaPilot ücretsiz moda geçer ve doğrulandığında yeniden tam çalışır. Doğrulamada yalnız lisans kodu, uygulamanın ürettiği rastgele bir cihaz numarası ve uygulama sürümü gönderilir; çizimleriniz gönderilmez. Bir bilgisayardan lisansı AreaPilot Lisansı penceresindeki “Bu bilgisayardan kaldır” ile kaldırıp yerini başka bilgisayara açabilirsiniz; bu işlem internet ister ve bir lisans için 30 günde en çok 3 kez yapılabilir. AreaPilot'u Windows'tan kaldırmak yeri açmaz. Eski bilgisayara ulaşamıyorsanız “Cihazlarımı sıfırla (e-posta)” ile kayıtlı bütün bilgisayarları sıfırlayabilirsiniz; sıfırlamada lisans kodunuz yenisiyle değişir, eski kod çalışmaz ve bir lisans 30 günde en çok 2 kez sıfırlanabilir. Bu sınırlar dolarsa {EMAIL} adresine yazın. Lisans doğrulama hizmetini sonlandırmamız gerekirse bunu en az 90 gün önce duyururuz ve geçerli lisansların doğrulamasız çalışmasını sağlayan bir güncelleme yayımlarız. Ayrıntılar: AreaPilot Lisans Sözleşmesi.",
        },
      ],
    },
    {
      heading: "10. AreaPilot: sürümler ve uyumluluk",
      items: [
        {
          text: "Lisans, satın aldığınız ana sürümün (1.x) bütün sürümlerinde çalışır; 2.0 ve sonraki ana sürümler bu lisansa dahil değildir. Yasal ya da güvenlik zorunluluğu dışında, bir 1.x sürümündeki özelliği sonraki bir 1.x güncellemesinde, yalnız 2.0'a geçirmek için kaldırmayız. AreaPilot, Windows'ta AutoCAD® 2013-2027 (64 bit) için hazırlanmıştır; AutoCAD LT'de çalışmaz. Denendiği AutoCAD sürümleri ürün sayfasında listelenir; satın almadan önce 7 günlük denemeyle kendi sürümünüzde denemenizi öneririz. AreaPilot'un hesapladığı alan ve çevre değerlerini, teklif, hakediş ya da sipariş gibi işlerde kullanmadan önce kontrol etmek sizin sorumluluğunuzdadır. AutoCAD®, Autodesk, Inc.'in ve/veya bağlı şirketlerinin ABD'de ve/veya diğer ülkelerde tescilli markası ya da markasıdır; AreaPilot Autodesk tarafından yapılmamış, onaylanmamış ve desteklenmemektedir.",
        },
      ],
    },
    {
      heading: "11. AreaPilot: iade ve lisans bitince",
      items: [
        {
          text: "Ödeme tarihinden itibaren 14 gün içinde gerekçe göstermeden iade isteyebilirsiniz; yasal cayma hakkının bu satışa uygulanmaması bu hakkı etkilemez. Ayrıntılar: Teslimat ve iade politikası (5. bölüm). Lisans iade edilir ya da bu koşullara aykırılık nedeniyle sona ererse AreaPilot ücretsiz moda geçer; çizimlerinize, çizime yazılmış alan ve tablolara ve Excel dosyalarınıza dokunulmaz.",
        },
      ],
    },
  ],
  en: [
    {
      heading: "7. AreaPilot: product, trial and plans",
      items: [
        {
          text: "AreaPilot is an area and perimeter measurement add-in for AutoCAD®. For 7 days from first use all of its features are available (the trial). If you do not buy a license after the trial, AreaPilot keeps working in free mode with no time limit; in free mode it processes up to 15 areas per run. We may change what free mode includes in new versions. You may use the trial and free mode free of charge for your own work or your organisation's work, including commercial work. A license is a one-time payment, not a subscription. Plans: Individual (1 computer), Office (up to 5 computers), Company (up to 20 computers). Prices are shown as totals including 20% VAT for Türkiye; for other countries tax is calculated for your country on the checkout page. The amount you pay is the tax-inclusive total you see on the checkout page when you confirm the payment.",
        },
      ],
    },
    {
      heading: "8. AreaPilot: scope of the license",
      items: [
        {
          text: "The software is licensed, not sold. The license lets you use AreaPilot with AutoCAD® software you hold a valid license for, within the scope of that license, for your own work or the work of the organisation that bought the license; this right is non-exclusive and cannot be transferred without our written permission. An Individual license is for one person and one computer. An organisation that buys an Office or Company license may use it on its own employees' computers, without exceeding the number of computers in the license. You may not share the license key with people outside your organisation, sell it or rent it, or try to get around the trial, free-mode or computer limits. Details: the AreaPilot License Agreement (shown during installation and in the “About AreaPilot” window).",
        },
      ],
    },
    {
      heading: "9. AreaPilot: activation, switching computers and reset",
      items: [
        {
          text: "When you enter the license key, and afterwards whenever AreaPilot is run in AutoCAD and 7 days have passed since the last check, AreaPilot checks the license with our server; each check is valid for up to 90 days. So you need an internet connection once to activate and then at least once every 90 days; on a computer that has not been checked for 90 days AreaPilot switches to free mode and works fully again once it is checked. A check sends only the license key, a random device number generated by the application and the application version; your drawings are not sent. You can remove the license from a computer with “Remove from this computer” in the AreaPilot License window and free the slot for another computer; this needs internet and can be done up to 3 times in 30 days per license. Uninstalling AreaPilot from Windows does not free the slot. If you cannot reach the old computer, “Reset my devices (email)” resets all registered computers; a reset replaces your license key with a new one, the old key stops working, and a license can be reset up to 2 times in 30 days. If these limits are used up, write to {EMAIL}. If we ever have to end the license check service, we will announce it at least 90 days in advance and release an update that lets valid licenses work without the check. Details: the AreaPilot License Agreement.",
        },
      ],
    },
    {
      heading: "10. AreaPilot: versions and compatibility",
      items: [
        {
          text: "The license works with every version of the major version you bought (1.x); 2.0 and later major versions are not included. Except where the law or security requires it, we will not remove a feature of a 1.x version in a later 1.x update just to move it to 2.0. AreaPilot is made for AutoCAD® 2013-2027 (64-bit) on Windows; it does not run in AutoCAD LT. The AutoCAD versions it has been tested with are listed on the product page; we recommend trying it on your own version with the 7-day trial before you buy. Checking the area and perimeter values AreaPilot calculates before you use them in quotes, progress payments or orders is your responsibility. AutoCAD® is a registered trademark or trademark of Autodesk, Inc. and/or its subsidiaries and/or affiliates in the USA and/or other countries; AreaPilot is not made, endorsed or supported by Autodesk.",
        },
      ],
    },
    {
      heading: "11. AreaPilot: refunds and when the license ends",
      items: [
        {
          text: "You can ask for a refund within 14 days of payment, no reason needed; the fact that the statutory right of withdrawal does not apply to this sale does not affect this. Details: the Delivery and refund policy (section 5). If a license is refunded or ends because of a breach of these terms, AreaPilot switches to free mode; your drawings, the areas and tables written to them and your Excel files are not touched.",
        },
      ],
    },
  ],
};

// ------------------------------------------------------------------ /teslimat-ve-iade

export const REFUND_INTRO: Record<LegalLang, string> = {
  tr: "Bu politika ostlertech.com üzerinden satın alınan SyncPass Masaüstü Premium ve AreaPilot lisansları için geçerlidir. Satışlarımızı yetkili satıcımız (Merchant of Record) Paddle.com yapar; ödeme ve iadeler Paddle tarafından yürütülür. SyncPass Masaüstü için 1-4. bölümler, AreaPilot için 5. bölüm, her ikisi için 6. bölüm geçerlidir.",
  en: "This policy applies to SyncPass Desktop Premium and AreaPilot licenses bought on ostlertech.com. Our reseller Paddle.com (Merchant of Record) makes the sale; Paddle handles payments and refunds. Sections 1-4 apply to SyncPass Desktop, section 5 to AreaPilot and section 6 to both.",
};
export const REFUND_DESCRIPTION: Record<LegalLang, string> = {
  tr: "SyncPass Masaüstü Premium ve AreaPilot: elektronik teslimat, 14 gün içinde koşulsuz iade.",
  en: "SyncPass Desktop Premium and AreaPilot: electronic delivery and a full refund within 14 days.",
};

export const REFUND_SECTION: Record<LegalLang, LegalSection> = {
  tr: {
    heading: "5. AreaPilot",
    items: [
      { lead: "5.1 Teslimat.", text: "AreaPilot lisansı dijitaldir; kargo yoktur. Ödeme tamamlanınca lisans kodunuz ödeme sonrası açılan sayfada gösterilir ve ödemede kullandığınız e-posta adresine gönderilir. Makbuzunuz Paddle'dan ayrı bir e-postayla gelir. Kod size ulaşmazsa satın alırken kullandığınız e-postayla {EMAIL} adresine yazın; hedefimiz 24 saat içinde iletmektir." },
      { lead: "5.2 Yasal cayma hakkı.", text: "Lisans kodu ödemeden hemen sonra teslim edilen bir dijital içerik olduğu için, Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca bu satışta yasal cayma hakkı uygulanmaz. Aşağıdaki 14 günlük iade hakkını bundan bağımsız olarak tanıyoruz." },
      { lead: "5.3 14 gün koşulsuz iade.", text: "Bireysel, Ofis ve Firma lisanslarının hepsi için, ödeme tarihinden itibaren 14 gün içinde gerekçe göstermeden ücretin tamamını iade ederiz. İadeyi şu yollardan biriyle isteyebilirsiniz: Paddle'ın makbuz e-postasındaki bağlantı ya da paddle.net; ya da sipariş numaranızla {EMAIL} adresine yazarak. İadeyi Paddle üzerinden biz başlatırız; tutar ödemeyi yaptığınız yönteme döner, hesabınıza yansıma süresi bankanıza bağlıdır. İade yalnız lisansın tamamı için yapılır; bir lisansın bilgisayar sayısının bir kısmı iade edilmez. 14 günden sonraki talepleri de, örneğin AreaPilot AutoCAD sürümünüzde çalışmıyorsa ya da aynı ödemeyi yanlışlıkla iki kez yaptıysanız, inceleyip iade ederiz. Sahtecilik ya da iade istismarı durumunda Paddle'ın İade Politikası uygulanır." },
      { lead: "5.4 İadeden sonra lisans.", text: "İade edilen lisans bütün bilgisayarlarda devre dışı kalır. Bilgisayar lisansı, AutoCAD'de AreaPilot çalıştırıldığında ve son doğrulamadan 7 gün geçtiyse sunucuyla yeniden doğrular; her doğrulama en çok 90 gün geçerlidir. Bu yüzden geçiş hemen olmayabilir: bilgisayar internete bağlıysa genellikle 7 gün içinde, hiç bağlanmazsa en geç 90 gün içinde. Sonrasında AreaPilot, deneme süreniz bittiyse ücretsiz modda çalışır (her çalıştırmada en çok 15 alan). Çizimlerinize, çizime yazılmış alan ve tablolara ve kaydettiğiniz Excel dosyalarına dokunulmaz." },
      { lead: "5.5 Abonelik yoktur.", text: "AreaPilot lisansı tek seferlik ödemedir; yenilenmez ve sizden tekrar ödeme alınmaz." },
    ],
  },
  en: {
    heading: "5. AreaPilot",
    items: [
      { lead: "5.1 Delivery.", text: "An AreaPilot license is digital; nothing is shipped. When the payment completes, your license key is shown on the page that opens and emailed to the address you paid with. Paddle sends your receipt in a separate email. If the key does not reach you, write from the email you paid with to {EMAIL}; we aim to send it within 24 hours." },
      { lead: "5.2 Statutory withdrawal.", text: "Because the license key is digital content delivered right after payment, the statutory right of withdrawal does not apply to this purchase where your local law allows that exception. We give you the 14-day refund below regardless. This does not limit any mandatory right your local consumer law gives you." },
      { lead: "5.3 14-day refund.", text: "For Individual, Office and Company licenses alike, we refund the full price if you ask within 14 days of payment, no reason needed. Ask through the link in Paddle's receipt email or paddle.net, or write to {EMAIL} with your order number. We start the refund through Paddle; the money goes back to your payment method, and how long it takes to appear depends on your bank. Refunds are for the whole license only, not for part of its computers. We also review later requests, for example if AreaPilot does not work with your AutoCAD version or you paid twice by mistake. In cases of fraud or refund abuse, Paddle's Refund Policy applies." },
      { lead: "5.4 After a refund.", text: "A refunded license stops working on all computers. A computer checks its license with our server when AreaPilot is run in AutoCAD and 7 days have passed since the last check; each check is valid for up to 90 days. So the change may not be immediate: usually within 7 days on a computer that goes online, and at the latest within 90 days on one that never does. After that AreaPilot runs in free mode if your trial has ended (up to 15 areas per run). Your drawings, the areas and tables written to them and your saved Excel files are not touched." },
      { lead: "5.5 No subscription.", text: "An AreaPilot license is a one-time payment; it does not renew and you are not charged again." },
    ],
  },
};

// ------------------------------------------------------------------ /gizlilik

export interface PrivacyAdditions {
  /** §2 "Lisans:" maddesinin AreaPilot'u da kapsayan hâli (mevcut maddenin yerine). */
  license: string;
  /** §2'ye yeni madde. */
  licenseMail: string;
  /** §4 listesine yeni madde. */
  resendItem: string;
  /** §4 yurt dışı paragrafına eklenen cümle. */
  resendTransfer: string;
}
export const PRIVACY_ADDITIONS: Record<LegalLang, PrivacyAdditions> = {
  tr: {
    license:
      "lisans kodu, etkinleştirildiği cihazlar için uygulamanın ürettiği rastgele cihaz numarası, uygulama sürümü, ilk ve son doğrulama tarihi; AreaPilot'ta ayrıca bilgisayar kaldırma ve e-postayla sıfırlama işlemlerinin tarihleri ve sıfırlama bağlantısının şifrelenmiş özeti. Amaç: lisansın geçerliliğini, cihaz sınırını ve kaldırma/sıfırlama sınırlarını uygulamak. SyncPass kasanızın içeriği ve AreaPilot çizimleriniz hiçbir zaman bize gelmez.",
    licenseMail:
      "lisans kodunuzu, bilgisayar sıfırlama bağlantısını ve sıfırlama sonrası yeni kodunuzu satın alırken kullandığınız e-posta adresine gönderiyoruz. Bu e-postalar işlem e-postasıdır, tanıtım içermez.",
    resendItem: "Resend (Plus Five Five, Inc., ABD): lisans kodu ve sıfırlama e-postalarının gönderimi (alıcı adresi ve e-postanın içeriği).",
    resendTransfer: "Resend ile de standart sözleşme henüz imzalanmamıştır; lisans e-postası gönderildiğinde alıcı adresiniz ve e-postanın içeriği ABD'ye aktarılır.",
  },
  en: {
    license:
      "the license key, the random device number the application generates for each activated device, the application version, and the first and last check dates; for AreaPilot also the dates of computer removals and email resets and an encrypted digest of the reset link. Purpose: to enforce license validity, the device limit and the removal and reset limits. The contents of your SyncPass vault and your AreaPilot drawings never reach us.",
    licenseMail:
      "we send your license key, the computer reset link and your new key after a reset to the email address you used when buying. These are transactional emails and contain no promotions.",
    resendItem: "Resend (Plus Five Five, Inc., USA): sending license-key and reset emails (the recipient address and the content of the email).",
    resendTransfer: "A standard contract has not yet been signed with Resend either; when a license email is sent, your address and the email content are transferred to the USA.",
  },
};
