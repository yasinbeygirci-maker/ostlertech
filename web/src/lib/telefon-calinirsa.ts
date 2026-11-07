// "Telefonun çalınırsa ilk 5 adım" sayfasının metni (TR + EN). Instagram Reels'in (telefon-calinirsa-5-adim) ödül sayfası.
// Kaynak: pazarlama/2026-11-03-telefon-calinirsa-reels-ve-sert-kapi.md bölüm A (A6 doğrulama tablosu, A7 önceden hazırla).
// Metin tek yerde durur: sayfa bileşeni, Defne'ye giden metin dosyası ve yayın kapısı testi buradan okur.
//
// Doğrulama durumu (2026-11-03, Burak kapısı: guvenlik/bulgular/2026-11-03-telefon-calinirsa-kapi.md):
//  - IMEI adımı: e-Devlet hizmet adı/adresi ve "kendi adına kayıtlı hat" kuralı resmî sayfa + Yönetmelik m.15 ile doğrulandı.
//    "120" ve BİM numarası doğrulanamadı: sayfaya YAZILMAZ (test yasaklar).
//  - Banka adımı: tek resmî kaynak yok; "genel öneri" notuyla duruyor (kaynak bağlantısı yok diye açıkça yazılı).
//  - "Kasan cihazında şifreli tutulur": koddan doğrulandı (AppDatabase.kt:251, EncryptionManager.kt:27-30).
//  - Dil: Defne yeni IMEI / Google oturumu / SIM PIN cümlelerini denetleyecek. O zamana kadar tests/DEFNE-BEKLIYOR dosyası durur
//    ve "YAYIN_KAPISI=1 npm test" kırmızıdır. Defne bulgusu işlenince dosya silinir.

export type Lang = "tr" | "en";
export type SourceKey = "Google" | "Apple" | "NIST" | "e-Devlet" | "Mevzuat";

export type Platform = { name: string; text: string };

export type Step = {
  heading: string;
  lines?: string[];
  platforms?: Platform[];
  note?: string;
  sources: SourceKey[];
};

export type Source = { key: SourceKey; name: string; url: string };

export type Content = {
  path: string;
  trPath: string;
  enPath: string;
  title: string;
  description: string;
  label: string;
  h1: string;
  lead: string;
  calmNote: string;
  stepsTitle: string;
  steps: Step[];
  beforeTitle: string;
  beforeLead: string;
  before: { text: string; sources: SourceKey[]; href?: string }[];
  helperTitle: string;
  helperText: string;
  ctaLabel: string;
  ctaNote: string;
  sourcesTitle: string;
  sources: Source[];
  disclaimer: string;
  trademarks: string;
  related: { href: string; label: string }[];
  backToTop?: string;
};

// Play bağlantısının kaynağa göre UTM'si: src/lib/play-utm.ts (telefon sayfası + kontrol listesi sayfaları ortak kullanır).

export const TR: Content = {
  path: "/telefon-calinirsa",
  trPath: "/telefon-calinirsa",
  enPath: "/en/if-your-phone-is-stolen",
  title: "Telefonun çalınırsa ilk 5 adım",
  description:
    "Telefonun çalındıysa sırayla beş adım: kilitle, hattı askıya aldır, bankanı ara, şifreleri değiştir, polise haber ver. Çoğu adım resmî sayfalara dayanır.",
  label: "Rehber",
  h1: "Telefonun çalınırsa ilk 5 adım",
  lead: "Sırayla yap. Adımların çoğunun yanında resmî kaynak var; Android™ ve iPhone için yollar ayrı yazıldı. Banka adımında kaynak bağlantısı yok, orada not düştük.",
  calmNote: "Telefonu haritada görsen bile kendin almaya gitme. Konumu polise ver.",
  stepsTitle: "5 adım",
  steps: [
    {
      heading: "Başka bir cihazdan telefonu kayıp olarak işaretle ve kilitle",
      lines: ["Önce kilitle; başkası telefona girmesin. Bu, telefon açık ve internete bağlıyken çalışır."],
      platforms: [
        {
          name: "Android",
          text: "Başka bir cihazda Cihaz Takip Merkezi uygulamasını aç ya da android.com/find adresine git. Giriş yap, telefonunu seç, sonra “Kayıp olarak işaretle” seçeneğine dokun. Telefon PIN, desen ya da şifreyle kilitlenir.",
        },
        {
          name: "iPhone",
          text: "Başka bir cihazda icloud.com/find adresine git, Apple Hesabınla giriş yap, telefonunu seç ve “Kayıp olarak işaretle”yi seç. Telefonunu Bul listesinden kaldırma.",
        },
      ],
      note: "Uzaktan Kilit önceden açıksa Android telefonu android.com/lock adresinden doğrulanmış telefon numaranla da kilitleyebilirsin.",
      sources: ["Google", "Apple"],
    },
    {
      heading: "Operatörünü ara, hattı askıya aldır",
      lines: [
        "Başka bir telefondan operatörünü ara ve hattını askıya almalarını iste. Böylece kimse hattını kullanamaz.",
      ],
      sources: ["Apple"],
    },
    {
      heading: "Bankanı ara, kartını ve mobil bankacılığını geçici olarak bloke ettir",
      lines: [
        "Bankanın müşteri hizmetlerini başka bir telefondan ara; kartı ve mobil bankacılık girişini geçici olarak bloke ettirmelerini iste. Numara bankaya göre değişir.",
      ],
      note: "Bu adım genel bir öneridir ve bu sayfada resmî kaynak bağlantısı yok. Ayrıntı için bankanın kendi yardım sayfasına bak.",
      sources: [],
    },
    {
      heading: "E-posta, Google ve Apple hesaplarının şifrelerini başka cihazdan değiştir",
      lines: [
        "Önce e-posta hesabın: diğer hesapların “şifremi unuttum” bağlantıları oraya gelir. Sonra Google ve Apple hesapların, sonra banka ve sosyal medya.",
        "Yeni şifren en az 15 karakter olsun ve her hesapta farklı olsun.",
        "Google Hesabında Güvenlik ve oturum açma > Cihazlarınız > Tüm cihazları yönet bölümüne git, çalınan telefonu seç ve oturumu kapat. Şifreyi değiştirmek tek başına yetmeyebilir: oturum açarken kimliğini doğrulamak için kullandığın cihazın oturumu açık kalabilir.",
        "İki adımlı doğrulama kodların çalınan telefondaysa, kaydettiğin yedek kodlarla giriş yapabilirsin.",
        "Apple Hesabında tanımadığın cihazlar varsa kaldır.",
      ],
      sources: ["Apple", "NIST", "Google"],
    },
    {
      heading: "Polise haber ver, IMEI'yi e-Devlet'ten kapattır",
      lines: [
        "Polise haber ver. Seri numarası istenebilir; iPhone'da bunu telefon yanında olmasa da bulabilirsin.",
        "IMEI, telefonun 15 haneli kimlik numarasıdır. Telefon yanında değilse Android için Cihaz Takip Merkezi uygulamasında ya da android.com/find adresinde telefonunu seçip Ayarlar'a bak; iPhone için account.apple.com adresinde Aygıtlar bölümüne bak. Çift hatlı telefonda iki IMEI olur.",
        "IMEI'yi kapattırmak için e-Devlet'te Bilgi Teknolojileri ve İletişim Kurumu'nun “Kayıp/Çalıntı İhbar Bildirimi” hizmetini kullan. İhbarı, telefonda kullandığın hat kendi adına kayıtlıysa sen yaparsın; hat başkasının adınaysa o kişi yapar. Çift hatlı telefonda iki IMEI'yi de gir.",
        "İhbar onaylanınca telefon mobil ağdan hizmet alamaz. Telefonu geri alırsan ihbarı e-Devlet'teki “Kayıp/Çalıntı İhbar Sorgulama/İptal” hizmetinden iptal edebilirsin.",
      ],
      note: "IMEI ihbarı e-Devlet'ten yapılır; polise haber vermek ayrı bir adımdır. Hattı askıya aldırmak ile IMEI'yi kapattırmak da ayrı işlemlerdir; ikisini de yap.",
      sources: ["Apple", "Google", "e-Devlet", "Mevzuat"],
    },
  ],
  beforeTitle: "Çalınmadan önce hazır olması gerekenler",
  beforeLead: "Bunları telefon çalınmadan önce yap. Beş dakikanı ayır, şimdi kontrol et.",
  before: [
    {
      text: "Android: Cihaz Takip Merkezi açık olsun. Ayarlar > Google > Tüm hizmetler > Hırsızlığa karşı koruma bölümünde Uzaktan Kilit gibi seçenekler bulunur; bunlar sürüme ve modele göre değişir.",
      sources: ["Google"],
    },
    {
      text: "iPhone: “Bul” özelliği açık olsun. Ayarlar > Face ID ve Parola altından Çalınan Aygıt Koruması'nı aç (iOS 17.3 ve sonrası; Apple Hesabında iki adımlı doğrulama gerekir).",
      sources: ["Apple"],
    },
    {
      text: "SIM kartına PIN koy. iPhone'da Ayarlar > Hücresel > SIM PIN; Android'de bu ayarın yeri telefon markasına göre değişir. PIN'i ya da PUK kodunu tahmin etmeye çalışma: yanlış girişlerde SIM kalıcı olarak kilitlenebilir. PIN'ini unutursan operatöründen PUK kodunu iste.",
      sources: ["Apple"],
    },
    {
      text: "IMEI ya da seri numarasını telefondan ayrı bir yere not et. IMEI'yi telefonun arama ekranında *#06# tuşlayarak görebilirsin. Çift hatlı telefonda iki IMEI vardır; ikisini de not et.",
      sources: ["e-Devlet"],
    },
    {
      text: "Kurtarma kodlarını ve kurtarma e-postasını güncel tut.",
      sources: [],
      href: "/guvenlik-kontrol-listesi",
    },
  ],
  helperTitle: "Yeni şifreleri nerede üretirsin?",
  helperText:
    "SyncPass'in şifre üreticisi uzun şifreler üretir; her hesap için farklı bir şifre kullanmanı kolaylaştırır. Kasan cihazında şifreli tutulur.",
  ctaLabel: "SyncPass'i indir",
  ctaNote: "Ücretsiz sürüm sınırlı sayıda kayıt tutar",
  sourcesTitle: "Kaynaklar (erişim 3.11.2026)",
  sources: [
    { key: "Google", name: "Android Yardım, Kaybedilen bir Android cihazı bulma, kilitleme veya silme", url: "https://support.google.com/android/answer/6160491?hl=tr" },
    { key: "Google", name: "Android Yardım, Uzaktan Kilit ve hırsızlığa karşı koruma", url: "https://support.google.com/android/answer/15146908?hl=tr" },
    { key: "Google", name: "Google Hesabı Yardım, Yedek kodlarla oturum açma", url: "https://support.google.com/accounts/answer/1187538?hl=tr" },
    { key: "Apple", name: "Apple Destek, iPhone'un kaybolur ya da çalınırsa yapılacaklar", url: "https://support.apple.com/tr-tr/120837" },
    { key: "Apple", name: "Apple Destek, Çalınan Aygıt Koruması", url: "https://support.apple.com/tr-tr/120340" },
    { key: "Apple", name: "Apple Destek, iPhone veya iPad için SIM PIN kullanma", url: "https://support.apple.com/tr-tr/118228" },
    { key: "Apple", name: "Apple Destek, Seri numarasını ya da IMEI numarasını bulma", url: "https://support.apple.com/tr-tr/108037" },
    { key: "Google", name: "Google Hesabı Yardım, Şifrenizi değiştirme veya sıfırlama", url: "https://support.google.com/accounts/answer/41078?hl=tr" },
    { key: "Google", name: "Google Hesabı Yardım, Hesaba erişimi olan cihazları görme", url: "https://support.google.com/accounts/answer/3067630?hl=tr" },
    { key: "e-Devlet", name: "e-Devlet (BTK), Kayıp/Çalıntı İhbar Bildirimi", url: "https://www.turkiye.gov.tr/btk-kayip-calinti-ihbar-bildirimi" },
    { key: "e-Devlet", name: "e-Devlet (BTK), Kayıp/Çalıntı İhbar Sorgulama/İptal", url: "https://www.turkiye.gov.tr/btk-kayip-calinti-ihbar-sorgulama-iptal" },
    { key: "Mevzuat", name: "Mevzuat, Elektronik Kimlik Bilgisini Haiz Cihazların Kayıt Altına Alınmasına Dair Yönetmelik (madde 10, 15, 16)", url: "https://www.mevzuat.gov.tr/anasayfa/MevzuatFihristDetayIframe?MevzuatTur=7&MevzuatNo=19873&MevzuatTertip=5" },
    { key: "NIST", name: "NIST SP 800-63B-4, Digital Identity Guidelines: Authentication", url: "https://pages.nist.gov/800-63-4/sp800-63b.html" },
  ],
  disclaimer: "Bu sayfa genel bilgilendirmedir. Ayrıntılar telefona, operatöre ve bankaya göre değişebilir. OstlerTech · ostlertech.com",
  trademarks:
    "Google ve Android, Google LLC'nin ticari markalarıdır. Apple ve iPhone, Apple Inc.'in ABD'de ve diğer ülkelerde tescilli ticari markalarıdır.",
  related: [
    { href: "/guvenlik-kontrol-listesi", label: "10 maddelik güvenlik kontrol listesi" },
    { href: "/dijital-guvenlik-plani", label: "7 günde dijital güvenlik planı" },
  ],
};

export const EN: Content = {
  path: "/en/if-your-phone-is-stolen",
  trPath: "/telefon-calinirsa",
  enPath: "/en/if-your-phone-is-stolen",
  title: "If your phone is stolen: the first 5 steps",
  description:
    "If your phone is stolen: lock it, suspend the line, call your bank, change passwords, tell the police. Most steps follow official pages.",
  label: "Guide",
  h1: "If your phone is stolen: the first 5 steps",
  lead: "Do them in order. Most steps link to an official source; Android™ and iPhone are written separately. The bank step has no source link, and says so.",
  calmNote: "Even if you see the phone on a map, don't try to get it back yourself. Give the location to the police.",
  stepsTitle: "5 steps",
  steps: [
    {
      heading: "From another device, mark the phone as lost and lock it",
      lines: ["Lock it first so nobody can get in. This works while the phone is on and connected to the internet."],
      platforms: [
        {
          name: "Android",
          text: "On another device, open the Find Hub app or go to android.com/find. Sign in, pick your phone and choose “Mark as lost”. The phone locks with your PIN, pattern or password.",
        },
        {
          name: "iPhone",
          text: "On another device, go to icloud.com/find, sign in with your Apple Account, pick your phone and choose “Mark as Lost”. Don't remove the phone from Find My.",
        },
      ],
      note: "If Remote Lock was already on, you can also lock an Android phone at android.com/lock with your verified phone number.",
      sources: ["Google", "Apple"],
    },
    {
      heading: "Call your carrier and have the line suspended",
      lines: ["From another phone, call your carrier and ask them to suspend your line, so nobody else can use it."],
      sources: ["Apple"],
    },
    {
      heading: "Call your bank and have the card and mobile banking temporarily blocked",
      lines: [
        "Call your bank's customer service from another phone and ask them to temporarily block the card and mobile banking sign-in. The number depends on your bank.",
      ],
      note: "This is general advice and this page has no official source link for it. For details, see your bank's own help page.",
      sources: [],
    },
    {
      heading: "From another device, change the passwords for your email, Google and Apple accounts",
      lines: [
        "Email first: the “forgot password” links of your other accounts arrive there. Then your Google and Apple accounts, then banking and social media.",
        "Choose a new password that is at least 15 characters long and different for every account.",
        "In your Google Account, go to Security & sign-in > Your devices > Manage all devices, pick the stolen phone and sign out. Changing the password may not be enough: the device you use to verify your identity when you sign in can stay signed in.",
        "If your two-step verification codes were on the stolen phone, you can sign in with the backup codes you saved.",
        "If your Apple Account lists devices you don't recognize, remove them.",
      ],
      sources: ["Apple", "NIST", "Google"],
    },
    {
      heading: "Tell the police and have the IMEI blocked",
      lines: [
        "Tell the police. They may ask for the serial number; with an iPhone you can find it even without the phone.",
        "The IMEI is the phone's 15-digit identifier. If you don't have the phone with you: for Android, open the Find Hub app or go to android.com/find, pick the phone and open Settings; for iPhone, sign in at account.apple.com and look under Devices. A dual-SIM phone has two IMEIs.",
        "In Türkiye, block the IMEI by filing a report in the “Kayıp/Çalıntı İhbar Bildirimi” (lost/stolen report) service of the Information and Communication Technologies Authority (BTK) on e-Devlet (turkiye.gov.tr). The line you use in the phone must be registered in your name; if it is registered to someone else, that person files the report. Enter both IMEIs on a dual-SIM phone. Outside Türkiye, ask your carrier how to block it.",
        "Once the report is confirmed, the phone can't get service from the mobile network. If you get the phone back, you can cancel the report in e-Devlet's “Kayıp/Çalıntı İhbar Sorgulama/İptal” service.",
      ],
      note: "In Türkiye the IMEI report is filed on e-Devlet by the owner of the line, and it is separate from telling the police. Suspending the line and blocking the IMEI are also separate actions; do both.",
      sources: ["Apple", "Google", "e-Devlet", "Mevzuat"],
    },
  ],
  beforeTitle: "What to set up before it is stolen",
  beforeLead: "Do these before the phone is stolen. Take five minutes to check them now.",
  before: [
    {
      text: "Android: keep Find Hub on. In Settings > Google > All services > Theft protection you'll find options such as Remote Lock; they vary by version and model.",
      sources: ["Google"],
    },
    {
      text: "iPhone: keep Find My on. Under Settings > Face ID & Passcode, turn on Stolen Device Protection (iOS 17.3 or later; your Apple Account needs two-step verification).",
      sources: ["Apple"],
    },
    {
      text: "Set a SIM PIN. On an iPhone: Settings > Cellular > SIM PIN; on Android the setting's location varies by phone maker. Don't keep guessing the SIM PIN or PUK code: wrong guesses can lock the SIM permanently. If you forget the PIN, ask your carrier for the PUK code.",
      sources: ["Apple"],
    },
    {
      text: "Write down the IMEI or serial number somewhere other than the phone. You can find the IMEI by dialling *#06# in the phone app. A dual-SIM phone has two IMEIs; write down both.",
      sources: ["e-Devlet"],
    },
    {
      text: "Keep your recovery codes and recovery email up to date.",
      sources: [],
      href: "/en/security-checklist",
    },
  ],
  helperTitle: "Where do you create new passwords?",
  helperText:
    "SyncPass's password generator creates long passwords, so you can use a different one for every account. Your vault is kept encrypted on your device.",
  ctaLabel: "Get SyncPass",
  ctaNote: "The free plan holds a limited number of records",
  sourcesTitle: "Sources (accessed 3 Nov 2026)",
  sources: [
    { key: "Google", name: "Android Help, Find, secure, or erase a lost Android device", url: "https://support.google.com/android/answer/6160491?hl=en" },
    { key: "Google", name: "Android Help, Remote Lock and theft protection", url: "https://support.google.com/android/answer/15146908?hl=en" },
    { key: "Google", name: "Google Account Help, Sign in with backup codes", url: "https://support.google.com/accounts/answer/1187538?hl=en" },
    { key: "Apple", name: "Apple Support, What to do if your iPhone is lost or stolen", url: "https://support.apple.com/en-us/120837" },
    { key: "Apple", name: "Apple Support, About Stolen Device Protection", url: "https://support.apple.com/en-us/120340" },
    { key: "Apple", name: "Apple Support, Use a SIM PIN for your iPhone or iPad", url: "https://support.apple.com/en-us/118228" },
    { key: "Apple", name: "Apple Support, Find the serial number or IMEI", url: "https://support.apple.com/en-us/108037" },
    { key: "Google", name: "Google Account Help, Change or reset your password", url: "https://support.google.com/accounts/answer/41078?hl=en" },
    { key: "Google", name: "Google Account Help, See devices with account access", url: "https://support.google.com/accounts/answer/3067630?hl=en" },
    { key: "e-Devlet", name: "e-Devlet (Türkiye, in Turkish), Kayıp/Çalıntı İhbar Bildirimi", url: "https://www.turkiye.gov.tr/btk-kayip-calinti-ihbar-bildirimi" },
    { key: "e-Devlet", name: "e-Devlet (Türkiye, in Turkish), Kayıp/Çalıntı İhbar Sorgulama/İptal", url: "https://www.turkiye.gov.tr/btk-kayip-calinti-ihbar-sorgulama-iptal" },
    { key: "Mevzuat", name: "Mevzuat (Türkiye, in Turkish), Regulation on Registering Devices with Electronic Identity Information (articles 10, 15, 16)", url: "https://www.mevzuat.gov.tr/anasayfa/MevzuatFihristDetayIframe?MevzuatTur=7&MevzuatNo=19873&MevzuatTertip=5" },
    { key: "NIST", name: "NIST SP 800-63B-4, Digital Identity Guidelines: Authentication", url: "https://pages.nist.gov/800-63-4/sp800-63b.html" },
  ],
  disclaimer: "This page is general information. Details vary by phone, carrier and bank. OstlerTech · ostlertech.com",
  trademarks:
    "Google and Android are trademarks of Google LLC. Apple and iPhone are trademarks of Apple Inc., registered in the U.S. and other countries.",
  related: [
    { href: "/en/security-checklist", label: "The 10-point security checklist" },
    { href: "/en/digital-security-plan", label: "Your 7-day digital security plan" },
  ],
};
