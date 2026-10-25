// AreaPilot açık beta sayfasının metni (TR + EN).
// Kaynak: Deniz, pazarlama/2026-10-23-areapilot-beta-sayfa.md; hukuk düzeni Zeynep, hukuk/2026-10-23-areapilot-beta-gizlilik.md
// (A yolu: formda yalnız e-posta + isteğe bağlı AutoCAD sürümü, bağlantı hemen sayfada, satış duyurusu kutusu YOK, aydınlatma
// onay kutusu değil bilgi satırı). Sürüm ve son gün AREAPILOT sabitinden gelir. Hitap: sayfada "sen", yasal metinde "siz".
import { AREAPILOT } from "./areapilot";

const A = AREAPILOT;

export type Lang = "tr" | "en";

export interface AreaPilotCopy {
  title: string;
  description: string;
  badge: string;
  h1: string;
  lead: string;
  sub: string;
  cta: string;
  ctaNote: string;
  featuresTitle: string;
  features: { h: string; p: string }[];
  languages: string;
  howTitle: string;
  how: { h: string; p: string }[];
  reqTitle: string;
  req: string[];
  betaTitle: string;
  betaIntro: string;
  betaItems: { h: string; p: string }[];
  warnTitle: string;
  warnIntro: string;
  warns: { h: string; p: string }[];
  disclaimer: string;
  form: {
    title: string;
    sub: string;
    email: string;
    emailPh: string;
    acad: string;
    acadUnknown: string;
    acadNone: string;
    button: string;
    sending: string;
    notice: string;
    noticeLink: string;
    successTitle: string;
    successNote: string;
    installer: string;
    guideTr: string;
    guideEn: string;
    errEmail: string;
    errRate: string;
    errServer: string;
  };
  faqTitle: string;
  faq: { q: string; a: string }[];
  feedbackTitle: string;
  feedbackLead: string;
  feedbackItems: string[];
  feedbackDrawing: string;
  privacyTitle: string;
  appPrivacyTitle: string;
  appPrivacy: string[];
  noticeTitle: string;
  notice: { h: string; p: string }[];
  trademark: string;
}

export const AREAPILOT_COPY: Record<Lang, AreaPilotCopy> = {
  tr: {
    title: "AreaPilot: AutoCAD için alan ve metraj eklentisi (açık beta)",
    description:
      "Çizimdeki kapalı alanları bulur, kodlarını yanındaki yazıdan okur, alan ve çevreyi toplar ve Excel'e aktarır. AutoCAD 2013-2027, Windows. Açık beta, 30 gün.",
    badge: `Açık beta · Sürüm ${A.version}`,
    h1: "Bu cephede kaç m² cam var?",
    lead: "AreaPilot, AutoCAD çizimindeki kapalı alanları bulur, kodlarını yanındaki yazıdan okur, alan ve çevreyi toplar ve Excel'e aktarır.",
    sub: "Cam, cephe paneli, oda: alanları tek tek ölçüp hesap makinesinde toplaman gerekmez.",
    cta: "İndirme bağlantısını al",
    ctaNote: `Windows · AutoCAD 2013-2027 · ilk açılıştan itibaren ${A.trialDays} gün ücretsiz deneme`,
    featuresTitle: "Ne yapar",
    features: [
      { h: "Kapalı alanları seçer", p: "Birkaç alanı kendin seç ya da bir katmandaki bütün alanları tek seferde al. Xref ve blok içindeki alanlar da bulunur." },
      { h: "Kodu yanındaki yazıdan okur", p: "Alanın içindeki ya da yanındaki yazıyı (TEXT, MTEXT, blok niteliği) o alanın kodu olarak alır, aynı koddakileri gruplar. Aynı alanda birden çok yazı varsa Ayarlar'daki Kod seçimi hangisinin alınacağını belirler." },
      { h: "Alanı ve çevreyi birlikte toplar", p: "Her kod için alan, çevre, adet ve toplamlar listede görünür. Bir satırı tıklayınca o alanlar çizimde yanar; İçine Tıkla ile imlecin altında alan ve çevre görünür. Listede kod arayabilir, satırın işaretini kaldırıp toplamdan çıkarabilirsin." },
      { h: "Boşlukları ve kopyaları ayıklar", p: "İç içe alanlarda içteki boşluğu (kolon, şaft) düşer; üst üste çizilmiş aynı alanı iki kez saymaz." },
      { h: "Kapalı olmayan çizgilerden sınır çıkarır", p: "Alanın içine tıkla, bir bölgedeki bütün alanları al ya da seçtiğin çizgilerin kapattığı bölgeleri sınır olarak çizime ekle. Dış kontur, köşelerindeki küçük boşlukları çizgileri köşede uzatarak (yayları kendi doğrultusunda) kapatır ve tek kapalı sınır çıkarır." },
      {
        h: "Sonucu çizime ve Excel'e yazar",
        p: "Alan yazıları ve tablo çizime eklenir; liste ve toplamlar .xlsx dosyası olarak kaydedilir, istersen CSV, metin ya da panoya kopyalanır. İmalat sekmesinde panelleri imalat tarihine göre gruplayıp çizimde renklendirebilir, alan ve çevreli ayrı bir imalat listesi alabilirsin.",
      },
    ],
    languages: "Arayüz 10 dilde: Türkçe, English, Deutsch, Français, Español, Italiano, Português, Русский, 日本語, 简体中文.",
    howTitle: "Nasıl çalışır",
    how: [
      { h: "Kur.", p: "Kurulum dosyasını çalıştır. Yönetici izni gerekmez; AutoCAD kapalı olmalı." },
      { h: "Aç.", p: "AutoCAD'de komut satırına AREAPILOT yaz. Pencere AutoCAD'in yanında açılır." },
      { h: "Seç ve al.", p: "Alanları seç; liste, kodlar ve toplam m² gelir. Çizime uygula ya da Excel'e aktar." },
    ],
    reqTitle: "Sistem gereksinimi",
    req: [
      "Windows 10 ya da 11, 64 bit",
      "AutoCAD 2013-2027, 64 bit",
      "AutoCAD 2013-2020 için .NET Framework 4.8 (Windows 10 ve 11'de zaten kurulu)",
      "AutoCAD LT ile çalışmaz.",
      "Excel'in kurulu olması gerekmez; dosyayı AreaPilot kendisi oluşturur.",
    ],
    betaTitle: "Beta hakkında, açıkça",
    betaIntro:
      "Bu bir beta sürümü. AreaPilot her gün gerçek cephe çizimlerinde kullanılıyor, ama bu kullanım AutoCAD 2021'de. Eklenti AutoCAD 2013-2027 için derlendi; 2021 dışındaki sürümlerde henüz denenmedi. Başka bir sürüm kullanıyorsan çalışıp çalışmadığını bize yazman en büyük yardım olur.",
    betaItems: [
      {
        h: "Deneme süresi:",
        p: `ilk açılıştan itibaren ${A.trialDays} gün. Bu sürüm en geç ${A.trialHardEndTr} tarihine kadar çalışır. Kalan gün pencerenin üst bandında görünür. Süre bitince komutlar çalışmaz; yeni sürüm çıktığında AreaPilot pencereyi açtığında haber verir.`,
      },
      { h: "Çizimin kopyasında dene.", p: "\"Kopyaları sil (OVERKILL)\" ve \"Kullanılmayanları temizle (PURGE)\" çizimi değiştirir. İkisi de _U ile geri alınır, ama yine de kopya üzerinde çalış." },
      { h: "Bir hata olursa", p: "AutoCAD çalışmaya devam eder, hata raporu bilgisayarına kaydedilir. Raporu sen göndermedikçe bize hiçbir şey gelmez." },
    ],
    warnTitle: "Kurulumda göreceğin iki uyarı",
    warnIntro: "Kurulum dosyası henüz dijital olarak imzalı değil. Bu yüzden Windows ve AutoCAD birer kez sorar. İkisi de beklenen uyarılardır.",
    warns: [
      {
        h: "1. Windows: \"Bilgisayarınız korundu\"",
        p: "Windows bu dosyanın yayıncısını tanımadığı için kurulumu durdurur. Ek bilgi → Yine de çalıştır'a bas. Dosyayı yalnızca bu sayfada verdiğimiz bağlantıdan indir; başka bir yerden gelen kopyayı çalıştırma.",
      },
      {
        h: "2. AutoCAD: \"İmzasız çalıştırılabilir dosya\"",
        p: "AREAPILOT komutunu ilk yazdığında AutoCAD bu pencereyi açar (İngilizce AutoCAD'de: Security – Unsigned Executable File). Her zaman yükle (Always Load) seç. AutoCAD bir daha sormaz.",
      },
    ],
    disclaimer:
      "AreaPilot beta sürümüdür ve ücretsiz, \"olduğu gibi\" sunulur. Hesaplanan alan ve miktarları kullanmadan önce kendi çiziminizle kontrol edin; beta sürecinde hatalar olabilir. Kanunen sınırlandırılamayan sorumluluklar saklıdır.",
    form: {
      title: "Beta'yı indir",
      sub: "E-posta adresini bırak, indirme bağlantısı hemen burada açılsın.",
      email: "E-posta adresin",
      emailPh: "ad@firma.com",
      acad: "Hangi AutoCAD'i kullanıyorsun? (isteğe bağlı)",
      acadUnknown: "Bilmiyorum",
      acadNone: "Seçmek istemiyorum",
      button: "İndirme bağlantısını al",
      sending: "Gönderiliyor…",
      notice:
        "E-postanızı AreaPilot beta indirme bağlantısını vermek ve beta ile ilgili önemli bildirimler (kritik düzeltme, beta bitişi) için kullanırız; reklam göndermeyiz. Ayrıntılar:",
      noticeLink: "AreaPilot beta aydınlatma metni",
      successTitle: "İndirme bağlantın hazır.",
      successNote: "Kurulum dosyası ve rehberler GitHub üzerindeki sürüm sayfamızdan iner. Kurulumda iki uyarı göreceksin; ne yapacağın aşağıda yazıyor.",
      installer: `AreaPilot ${A.version} kurulum dosyası (Windows)`,
      guideTr: "Kullanım ve test rehberi (Türkçe, PDF)",
      guideEn: "User and test guide (English, PDF)",
      errEmail: "Gönderilemedi. Adresi kontrol edip yeniden dene.",
      errRate: "Çok fazla deneme yapıldı. Biraz sonra yeniden dene.",
      errServer: "Şu an kaydedemedik. Biraz sonra yeniden dene ya da bize yaz.",
    },
    faqTitle: "Sık sorulan sorular",
    faq: [
      {
        q: "AreaPilot ücretli mi?",
        a: "Beta ücretsiz; ödeme bilgisi istemiyoruz. Satış henüz açılmadı. Satış açıldığında bunu sitede ve uygulamanın içinde duyururuz.",
      },
      {
        q: "Çizimlerim nereye gidiyor?",
        a: "Hiçbir yere. AreaPilot çizimini senin bilgisayarında işler, çizim bilgisayarından çıkmaz. İnternete yalnızca yeni sürüm var mı diye bakmak için çıkar: ostlertech.com'daki sürüm dosyasını okur; bu istekle kimlik, çizim ya da kişisel bilgi gönderilmez (her internet isteğinde olduğu gibi IP adresin sunucuya görünür). Bir hata olursa rapor bilgisayarına kaydedilir, otomatik gönderilmez ve 30 gün sonra silinir; raporu bize sen göndermeye karar verirsin. Raporda çiziminin içeriği yoktur.",
      },
      {
        q: "Hangi AutoCAD sürümlerinde çalışır?",
        a: "AutoCAD 2013-2027 (64 bit) için hazırlandı. Günlük kullanımda denendiği sürüm AutoCAD 2021; diğer sürümler beta kapsamında, henüz denenmedi. Senin sürümünde nasıl çalıştığını yazarsan listeyi buna göre güncelleriz.",
      },
      { q: "AutoCAD LT'de çalışır mı?", a: "Hayır. AreaPilot, AutoCAD'in .NET eklenti altyapısını kullanır; AutoCAD LT bu tür eklentileri yüklemez." },
      {
        q: "Nasıl kaldırırım?",
        a: "Windows Ayarlar → Uygulamalar → Yüklü uygulamalar → AreaPilot → Kaldır. Eklenti dosyaları ve ayarları silinir. Deneme süresi kaydı bilgisayarda kalır (yeniden kurunca süre baştan başlamaz).",
      },
    ],
    feedbackTitle: "Geri bildirim",
    feedbackLead: "Bir şey ters gittiyse ya da beklediğin gibi çalışmadıysa yaz:",
    feedbackItems: [
      "AutoCAD sürümün ve AreaPilot sürümü (pencerenin üst bandında, \"Alan Hesaplama · Metraj\" yazısının yanında)",
      "Ne yaptın, ne bekliyordun, ne oldu",
      "Mümkünse ekran görüntüsü. Hata raporu için komut satırına AREAPILOT_HATARAPORU yaz, rapor panoya kopyalanır; e-postana yapıştır.",
    ],
    feedbackDrawing:
      "Çizim dosyası göndermen gerekmez. Bir hatayı ancak çizimle gösterebiliyorsan müşteri bilgisi içermeyen küçük bir parça gönder; yalnızca hatayı bulmak için kullanır, en geç 30 gün içinde sileriz.",
    privacyTitle: "Gizlilik",
    appPrivacyTitle: "AreaPilot ve verileriniz",
    appPrivacy: [
      "Çizimleriniz bilgisayarınızdan çıkmaz. AreaPilot alan ölçümünü AutoCAD içinde, bilgisayarınızda yapar. Excel çıktıları yalnız sizin seçtiğiniz klasöre kaydedilir.",
      "Güncelleme kontrolü: AutoCAD'de AreaPilot penceresi her oturumda ilk açıldığında, uygulama ostlertech.com'daki sürüm dosyasını okur. Bu istekte çizim, kullanıcı adı ya da kimlik bilgisi gönderilmez; sitemizin barındırıldığı sunucu (Vercel, ABD) isteğin geldiği IP adresini kısa süreli sunucu kayıtlarında tutar. İnternet yoksa kontrol atlanır. Yeni sürüm varsa size sorulur; \"Evet\" derseniz tarayıcınızda indirme sayfası açılır.",
      "Hata raporları yalnız bilgisayarınızda: beklenmeyen bir hata olursa ayrıntısı %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\hatalar klasörüne yazılır ve 30 günden eski raporlar silinir. Rapor hiçbir yere kendiliğinden gönderilmez. Uygulama size raporu panoya kopyalamayı önerir; bize göndermek isterseniz e-postaya yapıştırırsınız. Rapora çizim içeriği yazılmaz ve kullanıcı klasörünüzün yolu gizlenir. Ancak hata mesajı dosya ya da katman adı içeriyorsa raporda görünebilir; göndermeden önce göz atabilirsiniz.",
      "Ayarlar ve deneme süresi: dil, tema ve ölçüm ayarlarınız Windows kayıt defterinde (HKEY_CURRENT_USER\\Software\\OstlerTech\\SpaceCalc) tutulur ve kaldırınca silinir. Beta deneme süresinin başlangıç tarihi HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot\\Deneme anahtarında ve %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\deneme.txt dosyasında tutulur; kaldırıp yeniden kurunca süre baştan başlamasın diye kaldırmada silinmez. Dilerseniz bu dosyayı ve HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot anahtarını elle silebilirsiniz.",
      "Reklam, analitik ya da kullanım ölçümü yoktur.",
    ],
    noticeTitle: "AreaPilot açık beta: kişisel verilerin işlenmesi",
    notice: [
      {
        h: "Hangi veri, neden:",
        p: "Beta formuna yazdığınız e-posta adresi, isteğe bağlı olarak seçtiğiniz AutoCAD sürümü ve kaydın tarihi. Amaç: indirme bağlantısını vermek ve beta sürümüyle ilgili önemli bildirimleri (kritik hata düzeltmesi, beta süresinin bitişi, koşul değişikliği) göndermek. Bu bildirimler tanıtım içermez. Satış ya da kampanya duyurusu e-postayla gönderilmez; satış açıldığında bunu sitede ve uygulamanın içinde duyururuz.",
      },
      { h: "Hukuki sebep:", p: "Beta kullanımına ilişkin ilişkinin kurulması ve ifası (KVKK md. 5/2-c) ve bildirimlerin yapılmasındaki meşru menfaatimiz (md. 5/2-f)." },
      {
        h: "Aktarım:",
        p: "E-postanız Supabase Pte. Ltd.'nin (Singapur şirketi) İrlanda'daki sunucularında saklanır; site Vercel Inc. (ABD) üzerinde çalışır ve formu gönderdiğinizde IP adresiniz bu sağlayıcılara ulaşır. Bu sağlayıcıların sunucuları yurt dışındadır; onlarla KVKK md. 9 uyarınca Kurul'un ilan ettiği standart sözleşmeleri imzalama sürecini yürütüyoruz. Verinizi satmayız, reklam için paylaşmayız.",
      },
      { h: "Saklama:", p: "Beta sona erdikten 6 ay sonra ya da siz daha önce isterseniz silinir; silme kaydı tutulur." },
      {
        h: "Haklarınız (KVKK md. 11):",
        p: "verinizin işlenip işlenmediğini öğrenme, bilgi isteme, düzeltme, silme, itiraz ve zararın giderilmesini isteme. Başvuru: destek@ostlertech.com ya da KEP; en geç 30 gün içinde yanıt. Kişisel Verileri Koruma Kurulu'na şikâyet hakkınız saklıdır.",
      },
    ],
    trademark: "AutoCAD, Autodesk, Inc.'in tescilli markasıdır. AreaPilot, Autodesk ile bağlantılı değildir.",
  },
  en: {
    title: "AreaPilot: area takeoff add-in for AutoCAD (open beta)",
    description:
      "Finds closed areas in your drawing, reads their codes from nearby text, totals m² and exports to Excel. AutoCAD 2013-2027, Windows. Open beta, 30 days.",
    badge: `Open beta · Version ${A.version}`,
    h1: "How many m² of glass are on this façade?",
    lead: "AreaPilot finds the closed areas in your AutoCAD drawing, reads their codes from the text next to them, totals the m² and exports it to Excel.",
    sub: "Glazing, curtain wall panels, rooms: no more measuring each area and adding it up on a calculator.",
    cta: "Get the download link",
    ctaNote: `Windows · AutoCAD 2013-2027 · ${A.trialDays}-day free trial from first launch`,
    featuresTitle: "What it does",
    features: [
      { h: "Selects closed areas", p: "Pick a few areas yourself, or take every area on a layer at once. Areas inside xrefs and blocks are found too." },
      { h: "Reads the code from nearby text", p: "Text inside or next to an area (TEXT, MTEXT, block attributes) becomes that area's code, and areas with the same code are grouped. If an area holds several texts, the Code source setting decides which one is used." },
      { h: "Totals area and perimeter together", p: "For every code the list shows area, perimeter, count and totals. Click a row and those areas light up in the drawing; Click Inside shows area and perimeter under the cursor. Search the list by code, or untick a row to leave it out of the total." },
      { h: "Handles openings and duplicates", p: "In nested areas the inner opening (column, shaft) is subtracted; the same area drawn twice is counted once." },
      { h: "Builds boundaries from open lines", p: "Click inside an area, take every area in a region, or turn the regions closed by the lines you select into boundaries in the drawing. Outline closes small gaps at the corners by extending the lines (arcs along their own direction) and produces one closed boundary." },
      {
        h: "Writes results to the drawing and to Excel",
        p: "Area labels and a table go into the drawing; the list and totals are saved as an .xlsx file, or copied as CSV, text or to the clipboard. On the Fabrication tab you can group panels by fabrication date, colour them in the drawing and export a separate fabrication list with area and perimeter.",
      },
    ],
    languages: "The interface is available in 10 languages: English, Türkçe, Deutsch, Français, Español, Italiano, Português, Русский, 日本語, 简体中文.",
    howTitle: "How it works",
    how: [
      { h: "Install.", p: "Run the installer. No administrator rights needed; AutoCAD must be closed." },
      { h: "Open.", p: "Type AREAPILOT at the AutoCAD command line. The window opens next to your drawing." },
      { h: "Select and export.", p: "Select the areas; you get the list, the codes and the total m². Write them to the drawing or export to Excel." },
    ],
    reqTitle: "Requirements",
    req: [
      "Windows 10 or 11, 64-bit",
      "AutoCAD 2013-2027, 64-bit",
      "AutoCAD 2013-2020 needs .NET Framework 4.8 (already included in Windows 10 and 11)",
      "Does not work with AutoCAD LT.",
      "Excel does not need to be installed; AreaPilot creates the file itself.",
    ],
    betaTitle: "About this beta, plainly",
    betaIntro:
      "This is a beta. AreaPilot is used every day on real façade drawings, but that use is in AutoCAD 2021. The add-in is built for AutoCAD 2013-2027; versions other than 2021 have not been tested yet. If you use another version, telling us whether it works is the most useful thing you can do.",
    betaItems: [
      {
        h: "Trial:",
        p: `${A.trialDays} days from first launch. This build runs until ${A.trialHardEndEn} at the latest. The days left are shown in the top band of the window. When the trial ends the commands stop working; when a new version is out, AreaPilot tells you when you open its window.`,
      },
      { h: "Work on a copy of your drawing.", p: "\"Delete duplicates (OVERKILL)\" and \"Purge unused (PURGE)\" change the drawing. Both can be undone with _U, but use a copy anyway." },
      { h: "If something goes wrong,", p: "AutoCAD keeps running and an error report is saved on your computer. Nothing reaches us unless you send it." },
    ],
    warnTitle: "Two warnings you will see during setup",
    warnIntro: "The installer is not digitally signed yet, so Windows and AutoCAD each ask once. Both warnings are expected.",
    warns: [
      {
        h: "1. Windows: \"Windows protected your PC\"",
        p: "Windows stops the installer because it does not recognise the publisher. Click More info → Run anyway. Only download the file from the link we give you on this page; do not run a copy from anywhere else.",
      },
      {
        h: "2. AutoCAD: \"Security – Unsigned Executable File\"",
        p: "The first time you type AREAPILOT, AutoCAD shows this window. Choose Always Load. AutoCAD will not ask again.",
      },
    ],
    disclaimer:
      "AreaPilot is a beta, provided free of charge and \"as is\". Check the calculated areas and quantities against your own drawing before you use them; errors may occur during the beta. Liability that cannot be limited by law is unaffected.",
    form: {
      title: "Download the beta",
      sub: "Leave your email and the download link opens right here.",
      email: "Your email",
      emailPh: "name@company.com",
      acad: "Which AutoCAD do you use? (optional)",
      acadUnknown: "Not sure",
      acadNone: "Prefer not to say",
      button: "Get the download link",
      sending: "Sending…",
      notice:
        "We use your e-mail to give you the AreaPilot beta download link and to send important beta notices (critical fixes, end of beta); we do not send marketing. Details:",
      noticeLink: "AreaPilot beta privacy notice",
      successTitle: "Your download link is ready.",
      successNote: "The installer and guides download from our release page on GitHub. You will see two warnings during setup; what to do is explained below.",
      installer: `AreaPilot ${A.version} installer (Windows)`,
      guideTr: "Kullanım ve test rehberi (Turkish, PDF)",
      guideEn: "User and test guide (English, PDF)",
      errEmail: "Could not send. Check the address and try again.",
      errRate: "Too many attempts. Please try again a little later.",
      errServer: "We could not save it right now. Please try again later or write to us.",
    },
    faqTitle: "FAQ",
    faq: [
      { q: "Is AreaPilot paid?", a: "The beta is free and we do not ask for payment details. Sales have not opened yet. When they do, we will announce it on our site and inside the app." },
      {
        q: "Where do my drawings go?",
        a: "Nowhere. AreaPilot processes your drawing on your computer; the drawing never leaves it. The only time it goes online is to check for a new version: it reads the version file on ostlertech.com, and no identity, drawing or personal information is sent with that request (as with any internet request, the server sees your IP address). If an error occurs, the report is saved on your computer, is never sent automatically and is deleted after 30 days; you decide whether to send it to us. The report does not contain your drawing.",
      },
      {
        q: "Which AutoCAD versions does it work with?",
        a: "It is built for AutoCAD 2013-2027 (64-bit). The version it is used and tested in every day is AutoCAD 2021; the others are part of the beta and have not been tested yet. Tell us how it runs on yours and we will update the list.",
      },
      { q: "Does it work in AutoCAD LT?", a: "No. AreaPilot uses AutoCAD's .NET add-in platform, and AutoCAD LT does not load this kind of add-in." },
      {
        q: "How do I uninstall it?",
        a: "Windows Settings → Apps → Installed apps → AreaPilot → Uninstall. The add-in files and settings are removed. The trial record stays on the computer (reinstalling does not restart the trial).",
      },
    ],
    feedbackTitle: "Feedback",
    feedbackLead: "If something went wrong or did not work as you expected, write to:",
    feedbackItems: [
      "Your AutoCAD version and the AreaPilot version (in the top band of the window, next to \"Area Takeoff · Quantities\")",
      "What you did, what you expected, what happened",
      "A screenshot if possible. For the error report, type AREAPILOT_HATARAPORU at the command line; the report is copied to the clipboard, paste it into your email.",
    ],
    feedbackDrawing:
      "You do not need to send drawing files. If a problem can only be shown with a drawing, send a small part without client information; we use it only to find the problem and delete it within 30 days.",
    privacyTitle: "Privacy",
    appPrivacyTitle: "AreaPilot and your data",
    appPrivacy: [
      "Your drawings never leave your computer. AreaPilot measures areas inside AutoCAD on your computer. Excel exports are saved only to the folder you choose.",
      "Update check: the first time the AreaPilot window opens in each AutoCAD session, the app reads a version file on ostlertech.com. No drawing, user name or identifier is sent; the server hosting our site (Vercel, USA) keeps the requesting IP address in short-lived server logs. Without internet the check is skipped. If a new version exists you are asked; if you choose \"Yes\", the download page opens in your browser.",
      "Error reports stay on your computer: if an unexpected error occurs, details are written to %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\hatalar and reports older than 30 days are deleted. Nothing is sent automatically. The app offers to copy the report to the clipboard; if you want to send it to us, paste it into an e-mail. Drawing content is not written and your user folder path is hidden, but an error message may contain a file or layer name, so please look before sending.",
      "Settings and trial: language, theme and measurement settings are stored in the Windows registry (HKEY_CURRENT_USER\\Software\\OstlerTech\\SpaceCalc) and removed when you uninstall. The beta trial start date is stored in the HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot\\Deneme key and in %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\deneme.txt; it is kept after uninstalling so the trial does not restart. You can delete that file and the HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot key by hand.",
      "No ads, analytics or usage tracking.",
    ],
    noticeTitle: "AreaPilot open beta: how we process your data",
    notice: [
      {
        h: "What and why:",
        p: "the e-mail address you enter in the beta form, the AutoCAD version you optionally select and the date you signed up. Purpose: giving you the download link and sending important notices about the beta (critical fixes, end of the beta, changes to its terms). These notices contain no promotion. We do not send sales or marketing e-mails; when sales open, we announce it on our site and inside the app.",
      },
      { h: "Legal basis:", p: "establishing and performing the beta use relationship (KVKK Art. 5(2)(c)) and our legitimate interest in sending these notices (Art. 5(2)(f))." },
      {
        h: "Transfers:",
        p: "your e-mail is stored on Supabase Pte. Ltd. (a Singapore company) servers in Ireland; the site runs on Vercel Inc. (USA), which receives your IP address when you submit the form. These servers are outside Türkiye; we are in the process of signing the standard contracts announced by the Turkish Personal Data Protection Board under Article 9 of KVKK with these providers. We do not sell your data or share it for advertising.",
      },
      { h: "Retention:", p: "deleted 6 months after the beta ends, or earlier if you ask; deletions are logged." },
      {
        h: "Your rights (KVKK Art. 11):",
        p: "to learn whether your data is processed, request information, correction or deletion, object, and claim compensation. Write to destek@ostlertech.com or our KEP address; we reply within 30 days. You may also complain to the Personal Data Protection Board.",
      },
    ],
    trademark: "AutoCAD is a registered trademark of Autodesk, Inc. AreaPilot is not affiliated with Autodesk.",
  },
};
