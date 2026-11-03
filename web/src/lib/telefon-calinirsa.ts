// "Telefonun çalınırsa ilk 5 adım" sayfasının metni (TR + EN). Instagram Reels'in (telefon-calinirsa-5-adim) ödül sayfası.
// Kaynak: pazarlama/2026-11-03-telefon-calinirsa-reels-ve-sert-kapi.md bölüm A (A6 doğrulama tablosu, A7 önceden hazırla).
// Metin tek yerde durur: sayfa bileşeni, Defne'ye giden metin dosyası ve yayın kapısı testi buradan okur.
//
// TODO-DOGRULA (yayına çıkmaz; tests/telefon-calinirsa.test.ts "yayın kapısı" bu işaretleri arar):
//  1. 5. adım, IMEI'yi kapattırma: BTK'nın resmî "Kayıp/Çalıntı İşlemleri" sayfası (tuketici.btk.gov.tr/kayip-calinti-islemleri)
//     iki denemede açılamadı. e-Devlet hizmet adı ve 120 hattı yalnız ikincil kaynaklarda (Allianz 26.10.2026, CNN Türk 2017).
//     Resmî sayfadan elle teyit edilince 5. adımın IMEI cümlesine hizmet adı + bağlantı eklenir, bu işaret silinir.
//  2. 3. adım, banka: Türkiye Bankalar Birliği/BDDK'dan tek resmî kaynak bulunamadı; sayfada "genel öneri" notuyla duruyor.
//  3. SyncPass kasası telefon çalınınca ne olur: Can doğrulayana kadar sayfada "kasan güvende" türü cümle YOK.
//  4. Dil: Defne denetimi yapıldı, Must/Should düzeltmeleri uygulandı (2026-11-03); kalan Should/Nice listesi ekip-gunlugu.md girişinde.

export type Lang = "tr" | "en";
export type SourceKey = "Google" | "Apple" | "NIST";

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

// Play bağlantısı. Reels/DM'den gelen ziyaretçi (sayfa adresinde utm_source=instagram ya da k=ig) pazarlama belgesi B4'teki
// UTM'yi taşır; organik açılışta site UTM'si kullanılır. Sunucuda (statik derleme) varsayılan olarak organik bağlantı yazılır,
// tarayıcıda PlayCta adres sorgusuna bakıp gerekirse değiştirir.
const PLAY_BASE = "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=";
export const PLAY_TELEFON_CALINIRSA_INSTAGRAM =
  PLAY_BASE + "utm_source%3Dinstagram%26utm_medium%3Ddm%26utm_campaign%3D2026-11-guvenlik%26utm_content%3Dreels-telefon-calinirsa";
export const playOrganik = (lang: Lang) =>
  PLAY_BASE + `utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dtelefon-calinirsa%26utm_content%3Dsayfa_${lang}`;

/** Sayfa adresinin sorgusuna (ör. "?utm_source=instagram&utm_medium=dm" ya da "?k=ig") göre Play bağlantısı. */
export function playHref(search: string, lang: Lang): string {
  const q = new URLSearchParams(search);
  const instagram = (q.get("utm_source") ?? "").toLowerCase() === "instagram" || (q.get("k") ?? "").toLowerCase() === "ig";
  return instagram ? PLAY_TELEFON_CALINIRSA_INSTAGRAM : playOrganik(lang);
}

export const TR: Content = {
  path: "/telefon-calinirsa",
  trPath: "/telefon-calinirsa",
  enPath: "/en/if-your-phone-is-stolen",
  title: "Telefonun çalınırsa ilk 5 adım",
  description:
    "Telefonun çalındıysa sırayla beş adım: kilitle, hattı askıya aldır, bankanı ara, şifreleri değiştir, polise bildir. Çoğu adım resmî sayfalara dayanır.",
  label: "Rehber",
  h1: "Telefonun çalınırsa ilk 5 adım",
  lead: "Sırayla yap. Adımların çoğunun yanında resmî yardım sayfası var; Android™ ve iPhone için yollar ayrı yazıldı. Banka ve IMEI adımlarında kaynak bağlantısı yok, orada not düştük.",
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
        "İki adımlı doğrulama kodların çalınan telefondaysa, kaydettiğin yedek kodlarla giriş yapabilirsin.",
        "Apple Hesabında tanımadığın cihazlar varsa kaldır.",
      ],
      sources: ["Apple", "NIST", "Google"],
    },
    {
      heading: "Polise bildir, IMEI'yi kapattır",
      lines: [
        "Polise haber ver. Seri numarası istenebilir; iPhone'da bunu telefon yanında olmasa da bulabilirsin.",
        "IMEI, telefonun 15 haneli kimlik numarasıdır. Telefon başka bir hatla kullanılmasın diye IMEI'nin resmî kayıp/çalıntı bildirim yoluyla kapatılmasını da iste.",
      ],
      note: "IMEI'yi kapattırma adımı için bu sayfada resmî kaynak bağlantısı yok.",
      sources: ["Apple"],
    },
  ],
  beforeTitle: "Çalınmadan önce açık olması gerekenler",
  beforeLead: "Aşağıdakiler telefon çalınmadan önce açık olmalı. Beş dakikanı ayır, şimdi kontrol et.",
  before: [
    {
      text: "Android: Cihaz Takip Merkezi açık olsun. Ayarlar > Google > Tüm hizmetler > Hırsızlığa karşı koruma bölümünde Uzaktan Kilit gibi seçenekler bulunur; bunlar sürüme ve modele göre değişir.",
      sources: ["Google"],
    },
    {
      text: "iPhone: “Bul” özelliği açık olsun. Ayarlar > Face ID ve Parola altından Çalınan Aygıt Koruması'nı aç (iOS 17.3 ve sonrası; Apple Hesabında iki adımlı doğrulama gerekir).",
      sources: ["Apple"],
    },
    { text: "IMEI ya da seri numarasını telefondan ayrı bir yere not et.", sources: [] },
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
  ctaNote: "15 kayda kadar ücretsiz",
  sourcesTitle: "Kaynaklar (erişim 3.11.2026)",
  sources: [
    { key: "Google", name: "Android Yardım, Kaybedilen bir Android cihazı bulma, kilitleme veya silme", url: "https://support.google.com/android/answer/6160491?hl=tr" },
    { key: "Google", name: "Android Yardım, Uzaktan Kilit ve hırsızlığa karşı koruma", url: "https://support.google.com/android/answer/15146908?hl=tr" },
    { key: "Google", name: "Google Hesabı Yardım, Yedek kodlarla oturum açma", url: "https://support.google.com/accounts/answer/1187538?hl=tr" },
    { key: "Apple", name: "Apple Destek, iPhone'un kaybolur ya da çalınırsa yapılacaklar", url: "https://support.apple.com/tr-tr/120837" },
    { key: "Apple", name: "Apple Destek, Çalınan Aygıt Koruması", url: "https://support.apple.com/tr-tr/120340" },
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
    "If your phone is stolen: lock it, suspend the line, call your bank, change passwords, tell the police. Most steps follow Google and Apple help pages.",
  label: "Guide",
  h1: "If your phone is stolen: the first 5 steps",
  lead: "Do them in order. Most steps link to an official help page; Android™ and iPhone are written separately. The bank and IMEI steps have no source link, and say so.",
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
        "If your two-step verification codes were on the stolen phone, you can sign in with the backup codes you saved.",
        "If your Apple Account lists devices you don't recognise, remove them.",
      ],
      sources: ["Apple", "NIST", "Google"],
    },
    {
      heading: "Report it to the police and have the IMEI blocked",
      lines: [
        "Tell the police. They may ask for the serial number; with an iPhone you can find it even without the phone.",
        "The IMEI is the phone's 15-digit identifier. To stop the phone being used with another SIM, also ask for its IMEI to be blocked through the official lost/stolen reporting route.",
      ],
      note: "This page has no official source link for blocking the IMEI.",
      sources: ["Apple"],
    },
  ],
  beforeTitle: "What needs to be on before it is stolen",
  beforeLead: "These must be switched on before the phone is stolen. Take five minutes to check them now.",
  before: [
    {
      text: "Android: keep Find Hub on. In Settings > Google > All services > Theft protection you'll find options such as Remote Lock; they vary by version and model.",
      sources: ["Google"],
    },
    {
      text: "iPhone: keep Find My on. Under Settings > Face ID & Passcode, turn on Stolen Device Protection (iOS 17.3 or later; your Apple Account needs two-step verification).",
      sources: ["Apple"],
    },
    { text: "Write down the IMEI or serial number somewhere other than the phone.", sources: [] },
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
  ctaNote: "Free for up to 15 items",
  sourcesTitle: "Sources (accessed 3 Nov 2026)",
  sources: [
    { key: "Google", name: "Android Help, Find, secure, or erase a lost Android device", url: "https://support.google.com/android/answer/6160491?hl=en" },
    { key: "Google", name: "Android Help, Remote Lock and theft protection", url: "https://support.google.com/android/answer/15146908?hl=en" },
    { key: "Google", name: "Google Account Help, Sign in with backup codes", url: "https://support.google.com/accounts/answer/1187538?hl=en" },
    { key: "Apple", name: "Apple Support, What to do if your iPhone is lost or stolen", url: "https://support.apple.com/en-us/120837" },
    { key: "Apple", name: "Apple Support, About Stolen Device Protection", url: "https://support.apple.com/en-us/120340" },
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
