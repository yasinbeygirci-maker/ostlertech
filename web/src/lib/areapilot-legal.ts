// AreaPilot yasal sayfa ekleri (TR + EN): /kullanim-sartlari (+/en/terms), /teslimat-ve-iade (+/en/refunds), /gizlilik (+/en/privacy).
// Kaynak: Zeynep hukuk kapısı (pazarlama/2026-11-07-areapilot-1-0-hukuk-kapisi.md §6) + dünkü ürün eki taslağı (zeynep-taslaklar/2026-11-07-areapilot-satis-metinleri.md §1.9, §2).
//
// KAPALI: AREAPILOT_LEGAL_ONAY_BEKLIYOR true iken sayfalar eskisi gibi çizilir (AreaPilot bölümü ve bölüm numarası kayması YOK).
// Zeynep + Yasin son okumayı yapınca bayrak false yapılır. Satış bayrağı (PADDLE_SALES_OPEN_AREAPILOT) ayrı ve bu dosyaya bağlı değildir.
// Bu dosya ISTEMCİ ya da sunucu ortam değişkeni okumaz; saf metindir. "{EMAIL}" çizimde destek adresiyle değişir.
//
// Hitap: yasal metin, "siz". Yasak ifade: "internetsiz", "çevrimdışı", "vergileri içerir" (fiyat kartı KDV dahil toplamı gösterir, bkz. areapilot-sales.ts).
export const AREAPILOT_LEGAL_ONAY_BEKLIYOR = false;

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
          text: "Yazılım size satılmaz, lisanslanır. Lisansla, AreaPilot'u geçerli lisansına sahip olduğunuz AutoCAD® yazılımıyla ve o lisansın kapsamında, kendi işiniz ya da lisansı satın alan kuruluşun işi için kullanma hakkı alırsınız; bu hak münhasır değildir ve yazılı iznimiz olmadan devredilemez. Bireysel lisans bir kişi ve bir bilgisayar içindir. Ofis ve Firma lisanslarını satın alan kuruluş, kendi çalışanlarının bilgisayarlarında, lisanstaki bilgisayar sayısını aşmadan kullanabilir. Lisans kodunu kuruluşunuzun dışındaki kişilerle paylaşamazsınız, satamazsınız, kiralayamazsınız; deneme ya da ücretsiz mod sınırını ve cihaz sınırını aşmaya çalışamazsınız. Ayrıntılar: AreaPilot Lisans Sözleşmesi (kurulum sırasında ve “AreaPilot Hakkında” penceresinde gösterilir).",
        },
      ],
    },
    {
      heading: "9. AreaPilot: etkinleştirme, bilgisayar değiştirme ve sıfırlama",
      items: [
        {
          text: "Lisans kodunu “AreaPilot Lisansı” penceresine yazıp “Etkinleştir”e bastığınızda AreaPilot lisansı sunucumuzla doğrular; bunun için internet bağlantısı gerekir. Etkinleştirilen lisansın bitiş tarihi yoktur. İnternet yalnız etkinleştirme, “Bu bilgisayardan kaldır” ve “Cihazlarımı sıfırla (e-posta)” için gerekir; sunucumuz erişilemez olsa da lisans çalışmaya devam eder. AreaPilot çalışırken ve bilgisayar internete bağlıyken yaklaşık 7 günde bir, lisansın iade ya da iptal edilip edilmediğini ve bu bilgisayarın lisansta kayıtlı olup olmadığını sunucumuza arka planda sorar (lisans durum sorgusu). Etkinleştirmede lisans kodu, uygulamanın ürettiği rastgele bir cihaz numarası ve uygulama sürümü; durum sorgusunda yalnız lisans kodu ve cihaz numarası gönderilir; çizimleriniz gönderilmez. Sunucumuz lisansın iade ya da iptal edildiğini ya da bu bilgisayarın artık lisansta kayıtlı olmadığını açıkça bildirirse lisans o bilgisayardan silinir, AreaPilot ücretsiz moda geçer ve bu size bir iletiyle gösterilir; sorgu yapılamazsa lisansınız çalışmaya devam eder. Bir bilgisayardan lisansı “Bu bilgisayardan kaldır” ile kaldırıp yerini başka bilgisayara açabilirsiniz; bu işlem internet ister ve bir lisans için 30 günde en çok 3 kez yapılabilir. AreaPilot'u Windows'tan kaldırmak yeri açmaz. Eski bilgisayara ulaşamıyorsanız “Cihazlarımı sıfırla (e-posta)” ile kayıtlı bütün bilgisayarları sıfırlayabilirsiniz; sıfırlamada lisans kodunuz yenisiyle değişir, eski kodla yeniden etkinleştirilemez ve bir lisans 30 günde en çok 2 kez sıfırlanabilir. Eski kodla etkinleştirilmiş bilgisayarlar, internete bağlıyken yapılan bir sonraki lisans durum sorgusunda ücretsiz moda geçer; yeni kodu kullanmak istediğiniz bilgisayarlarda yeniden etkinleştirin. Bu sınırlar dolarsa {EMAIL} adresine yazın. Ayrıntılar: AreaPilot Lisans Sözleşmesi.",
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
          text: "Ödeme tarihinden itibaren 14 gün içinde gerekçe göstermeden iade isteyebilirsiniz; yasal cayma hakkının bu satışa uygulanmaması bu hakkı etkilemez. Ayrıntılar: Teslimat ve iade politikası (5. bölüm). İade edilen lisansı sunucumuzda iptal ederiz; iptal edilen lisans yeniden ya da yeni bir bilgisayarda etkinleştirilemez ve AreaPilot, internete bağlıyken yapılan bir sonraki lisans durum sorgusunda ücretsiz moda geçer. İnternete bağlanmayan bir bilgisayarda bu geçiş olmasa da iade edilmiş ya da bu koşullara aykırılık nedeniyle sona ermiş bir lisansı kullanmaya devam etmek bu koşullara aykırıdır. Çizimlerinize, çizime yazılmış alan ve tablolara ve Excel dosyalarınıza dokunulmaz.",
        },
      ],
    },
  ],
  en: [
    {
      heading: "7. AreaPilot: product, trial and plans",
      items: [
        {
          text: "AreaPilot is an area and perimeter measurement add-in for AutoCAD®. For 7 days from first use all of its features are available (the trial). If you do not buy a license after the trial, AreaPilot keeps working in free mode with no time limit; in free mode it processes up to 15 areas per run. We may change what free mode includes in new versions. You may use the trial and free mode free of charge for your own work or your organization's work, including commercial work. A license is a one-time payment, not a subscription. Plans: Individual (1 computer), Office (up to 5 computers), Firm (up to 20 computers). Prices are shown as totals including 20% VAT for Türkiye; for other countries tax is calculated for your country on the checkout page. The amount you pay is the tax-inclusive total you see on the checkout page when you confirm the payment.",
        },
      ],
    },
    {
      heading: "8. AreaPilot: scope of the license",
      items: [
        {
          text: "The software is licensed, not sold. The license lets you use AreaPilot with AutoCAD® software you hold a valid license for, within the scope of that license, for your own work or the work of the organization that bought the license; this right is non-exclusive and cannot be transferred without our written permission. An Individual license is for one person and one computer. An organization that buys an Office or Firm license may use it on its own employees' computers, without exceeding the number of computers in the license. You may not share the license key with people outside your organization, sell it or rent it, or try to get around the trial, free-mode or computer limits. Details: the AreaPilot License Agreement (shown during installation and in the “About AreaPilot” window).",
        },
      ],
    },
    {
      heading: "9. AreaPilot: activation, switching computers and reset",
      items: [
        {
          text: "When you enter the license key in the “AreaPilot License” window and press “Activate”, AreaPilot checks the license with our server; this needs an internet connection. An activated license has no end date. An internet connection is needed only for activation, “Remove from this computer” and “Reset my devices (email)”; the license keeps working even if our server cannot be reached. While AreaPilot is running and the computer is online, about once every 7 days it asks our server in the background whether the license has been refunded or cancelled and whether this computer is still registered under it (the license status check). Activation sends the license key, a random device number generated by the application and the application version; the status check sends only the license key and the device number; your drawings are not sent. If our server clearly reports that the license has been refunded or cancelled, or that this computer is no longer registered under it, the license is removed from that computer, AreaPilot switches to free mode and you are shown a message saying so; if the check cannot be made, your license keeps working. You can remove the license from a computer with “Remove from this computer” and free the slot for another computer; this needs internet and can be done up to 3 times in 30 days per license. Uninstalling AreaPilot from Windows does not free the slot. If you cannot reach the old computer, “Reset my devices (email)” resets all registered computers; a reset replaces your license key with a new one, the old key can no longer be activated, and a license can be reset up to 2 times in 30 days. Computers activated with the old key switch to free mode at their next license status check made while online; activate the new key on the computers where you want to use it. If these limits are used up, write to {EMAIL}. Details: the AreaPilot License Agreement.",
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
          text: "You can ask for a refund within 14 days of payment, no reason needed; the fact that the statutory right of withdrawal does not apply to this sale does not affect this. Details: the Delivery and refund policy (section 5). We cancel a refunded license on our server; a cancelled license cannot be activated again or on a new computer, and AreaPilot switches to free mode at the next license status check made while online. Even if this switch does not happen because a computer never goes online, continuing to use a license that has been refunded or has ended because of a breach of these terms is a breach of these terms. Your drawings, the areas and tables written to them and your Excel files are not touched.",
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
      { lead: "5.1 Teslimat.", text: "AreaPilot lisansı dijitaldir; kargo yoktur. Ödeme tamamlanınca lisans kodunuz ödeme sonrası açılan sayfada gösterilir ve ödemede kullandığınız e-posta adresine gönderilir. Makbuzunuz Paddle'dan ayrı bir e-postayla gelir. E-posta birkaç dakika içinde gelmezse Spam ya da Güncellemeler klasörüne bakın. Kod size ulaşmazsa satın alırken kullandığınız e-postayla {EMAIL} adresine yazın; hedefimiz 24 saat içinde iletmektir." },
      { lead: "5.2 Yasal cayma hakkı.", text: "Lisans kodu ödemeden hemen sonra teslim edilen bir dijital içerik olduğu için, Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca bu satışta yasal cayma hakkı uygulanmaz. Aşağıdaki 14 günlük iade hakkını bundan bağımsız olarak tanıyoruz." },
      { lead: "5.3 14 gün koşulsuz iade.", text: "Bireysel, Ofis ve Firma lisanslarının hepsi için, ödeme tarihinden itibaren 14 gün içinde gerekçe göstermeden ücretin tamamını iade ederiz. İadeyi şu yollardan biriyle isteyebilirsiniz: Paddle'ın makbuz e-postasındaki bağlantı ya da paddle.net; ya da sipariş numaranızla {EMAIL} adresine yazarak. İadeyi Paddle üzerinden biz başlatırız; tutar ödemeyi yaptığınız yönteme döner, hesabınıza yansıma süresi bankanıza bağlıdır. İade yalnız lisansın tamamı için yapılır; bir lisansın bilgisayar sayısının bir kısmı iade edilmez. 14 günden sonraki talepleri de, örneğin AreaPilot AutoCAD sürümünüzde çalışmıyorsa ya da aynı ödemeyi yanlışlıkla iki kez yaptıysanız, inceleyip iade ederiz. Sahtecilik ya da iade istismarı durumunda Paddle'ın İade Politikası uygulanır." },
      { lead: "5.4 İadeden sonra lisans.", text: "İade edilen lisansı sunucumuzda iptal ederiz; iptal edilen lisans yeniden ya da yeni bir bilgisayarda etkinleştirilemez. Lisansın etkinleştirildiği bilgisayarlar iadeyi, internete bağlıyken yapılan bir sonraki lisans durum sorgusunda (çoğunlukla 7 gün içinde) öğrenir; AreaPilot o bilgisayarda ücretsiz moda geçer (her çalıştırmada en çok 15 alan) ve bunu bir iletiyle gösterir. İnternete bağlanmayan bir bilgisayarda bu geçiş olmayabilir; bu durumda iade edilen lisansı kullanmaya devam etmek Lisans Sözleşmesi'ne aykırıdır. Çizimlerinize, çizime yazılmış alan ve tablolara ve kaydettiğiniz Excel dosyalarına dokunulmaz." },
      { lead: "5.5 Abonelik yoktur.", text: "AreaPilot lisansı tek seferlik ödemedir; yenilenmez ve sizden tekrar ödeme alınmaz." },
    ],
  },
  en: {
    heading: "5. AreaPilot",
    items: [
      { lead: "5.1 Delivery.", text: "An AreaPilot license is digital; nothing is shipped. When the payment completes, your license key is shown on the page that opens and emailed to the address you paid with. Paddle sends your receipt in a separate email. If the email does not arrive within a few minutes, check your Spam or Updates folder. If the key does not reach you, write from the email you paid with to {EMAIL}; we aim to send it within 24 hours." },
      { lead: "5.2 Statutory withdrawal.", text: "Because the license key is digital content delivered right after payment, the statutory right of withdrawal does not apply to this purchase where your local law allows that exception. We give you the 14-day refund below regardless. This does not limit any mandatory right your local consumer law gives you." },
      { lead: "5.3 14-day refund.", text: "For Individual, Office and Firm licenses alike, we refund the full price if you ask within 14 days of payment, no reason needed. Ask through the link in Paddle's receipt email or paddle.net, or write to {EMAIL} with your order number. We start the refund through Paddle; the money goes back to your payment method, and how long it takes to appear depends on your bank. Refunds are for the whole license only, not for part of its computers. We also review later requests, for example if AreaPilot does not work with your AutoCAD version or you paid twice by mistake. In cases of fraud or refund abuse, Paddle's Refund Policy applies." },
      { lead: "5.4 After a refund.", text: "We cancel a refunded license on our server; a cancelled license cannot be activated again or on a new computer. Computers where the license is activated learn about the refund at their next license status check made while online (usually within 7 days); AreaPilot then switches to free mode on that computer (up to 15 areas per run) and shows a message. A computer that does not go online may not switch; in that case continuing to use the refunded license breaches the License Agreement. Your drawings, the areas and tables written to them and your saved Excel files are not touched." },
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
      "lisans kodu, etkinleştirildiği cihazlar için uygulamanın ürettiği rastgele cihaz numarası, uygulama sürümü, ilk ve son doğrulama tarihi (AreaPilot'ta etkinleştirme tarihi); AreaPilot'ta ayrıca bilgisayar kaldırma ve e-postayla sıfırlama işlemlerinin tarihleri ve sıfırlama bağlantısının tek yönlü özeti ile sıfırlamada değiştirilen eski kodun tek yönlü özeti ve değiştirilme tarihi. Amaç: lisansı teslim etmek, lisansın geçerliliğini, cihaz sınırını, kaldırma/sıfırlama sınırlarını ve iadeyi uygulamak. AreaPilot lisanslıyken, çalışırken ve bilgisayar internete bağlıyken yaklaşık haftada bir sunucumuza arka planda lisans durum sorgusu gönderir (lisans kodu ve cihaz numarası); sorgu yapılamazsa lisans çalışmaya devam eder, yalnız sunucumuz lisansın iade ya da iptal edildiğini ya da bu bilgisayarın artık kayıtlı olmadığını bildirirse lisans o bilgisayardan silinir. SyncPass kasanızın içeriği ve AreaPilot çizimleriniz hiçbir zaman bize gelmez.",
    licenseMail:
      "lisans kodunuzu, bilgisayar sıfırlama bağlantısını ve sıfırlama sonrası yeni kodunuzu satın alırken kullandığınız e-posta adresine gönderiyoruz. Bu e-postalar işlem e-postasıdır, tanıtım içermez.",
    resendItem: "Resend (Plus Five Five, Inc., ABD): lisans kodu ve sıfırlama e-postalarının gönderimi (alıcı adresi ve e-postanın içeriği).",
    resendTransfer: "Resend ile de standart sözleşme henüz imzalanmamıştır; lisans e-postası gönderildiğinde alıcı adresiniz ve e-postanın içeriği ABD'ye aktarılır.",
  },
  en: {
    license:
      "the license key, the random device number the application generates for each activated device, the application version, and the first and last check dates (for AreaPilot, the activation date); for AreaPilot also the dates of computer removals and email resets, a one-way digest of the reset link, and a one-way digest of a code replaced in a reset with the date it was replaced. Purpose: to deliver the license and to enforce its validity, the device limit, the removal and reset limits and refunds. While AreaPilot is running with a license and the computer is online, about once a week it sends our server a background license status check (the license key and the device number); if the check cannot be made, the license keeps working, and the license is removed from that computer only if our server reports that it has been refunded or cancelled or that this computer is no longer registered. The contents of your SyncPass vault and your AreaPilot drawings never reach us.",
    licenseMail:
      "we send your license key, the computer reset link and your new key after a reset to the email address you used when buying. These are transactional emails and contain no promotions.",
    resendItem: "Resend (Plus Five Five, Inc., USA): sending license-key and reset emails (the recipient address and the content of the email).",
    resendTransfer: "A standard contract has not yet been signed with Resend either; when a license email is sent, your address and the email content are transferred to the USA.",
  },
};
