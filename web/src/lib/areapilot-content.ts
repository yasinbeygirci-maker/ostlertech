// AreaPilot 1.0 sayfasının metni (TR + EN). Satış bölümü ayrı (AreaPilotPricing), bayrak açılınca kendiliğinden çizilir.
// Kaynak: Deniz, pazarlama/2026-10-23-areapilot-beta-sayfa.md; hukuk düzeni Zeynep, hukuk/2026-10-23-areapilot-beta-gizlilik.md
// (Bağlantı hemen sayfada; 2026-11-12: duyuru e-postası onay kutusu KALDIRILDI (Yasin kararı); 2026-11-18: indirme formundan e-posta alanı da kaldırıldı, hiçbir kişisel veri toplanmaz). Sürüm ve son gün AREAPILOT sabitinden gelir. Hitap: sayfada "sen", yasal metinde "siz".
import { AREAPILOT } from "./areapilot";
import { AREAPILOT_TIER_PRICES as P } from "./areapilot-sales";

const A = AREAPILOT;

// SSS'deki fiyat cümlesi sunucuda çizilen HTML'de durur (satış kartları tarayıcıda, bayrağa bağlı çizilir; arama motorları ve
// JS çalıştırmayan okuyucular fiyatı buradan görür). Tutarlar kartlarla aynı sabitten gelir, elle yazılmaz.
const fiyatTr = `Türkiye için KDV dahil fiyatlar: Bireysel (1 bilgisayar) ${P.individual.tr}, Ofis (5 bilgisayar) ${P.office.tr}, Firma (20 bilgisayar) ${P.firm.tr}.`;
const fiyatEn = `Prices including VAT for Türkiye: Individual (1 computer) ${P.individual.en}, Office (5 computers) ${P.office.en}, Firm (20 computers) ${P.firm.en}.`;

export type Lang = "tr" | "en";

export interface AreaPilotCopy {
  title: string;
  description: string;
  badge: string;
  h1: string;
  /** H1 içindeki küçük ikinci satır: ürün adı + arama niyeti (Deniz SEO 2026-11-07). Görünen büyük başlık h1 olarak kalır. */
  h1Sub: string;
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
  shaTitle: string;
  shaNote: string;
  shaHead: [string, string, string];
  form: {
    title: string;
    sub: string;
    button: string;
    sending: string;
    notice: string;
    noticeLink: string;
    successTitle: string;
    successNote: string;
    installer: string;
    guideTr: string;
    guideEn: string;
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
    title: "AutoCAD alan ve m² metraj eklentisi: AreaPilot",
    description:
      "AutoCAD çizimindeki kapalı alanları bulur, kodunu yanındaki yazıdan okur, m² ve çevreyi toplayıp Excel'e aktarır. 7 gün ücretsiz dene; tek seferlik lisans.",
    badge: `Sürüm ${A.version}`,
    h1: "Bu alanda kaç m² kaplama var?",
    h1Sub: "AreaPilot: AutoCAD alan ve m² metraj eklentisi",
    lead: "AreaPilot, AutoCAD çizimindeki kapalı alanları bulur, kodlarını yanındaki yazıdan okur, alan ve çevreyi toplar ve Excel'e aktarır.",
    sub: "Bir yapıdaki tüm imalatların alanlarını tek tek ölçüp hesap makinesinde toplaman gerekmez.",
    cta: "7 gün ücretsiz dene",
    ctaNote: `Windows · AutoCAD 2013-2027 · ilk kullanımdan itibaren ${A.trialDays} gün ücretsiz deneme`,
    featuresTitle: "Ne yapar",
    features: [
      { h: "Kapalı alanları seçer", p: "Birkaç alanı kendin seç ya da bir katmandaki bütün alanları tek seferde al. Xref ve blok içindeki alanlar da bulunur." },
      { h: "Kodu yanındaki yazıdan okur", p: "Alanın içindeki ya da yanındaki yazıyı (TEXT, MTEXT, blok niteliği) o alanın kodu olarak alır, aynı koddakileri gruplar. Aynı alanda birden çok yazı varsa Ayarlar'daki Kod seçimi hangisinin alınacağını belirler." },
      { h: "Alanı ve çevreyi birlikte toplar", p: "Her kod için alan, çevre, adet ve toplamlar listede görünür. Bir satırı tıklayınca o alanlar çizimde yanar; İçine Tıkla ile imlecin altında alan ve çevre görünür. Listede kod arayabilir, satırın işaretini kaldırıp toplamdan çıkarabilirsin." },
      { h: "Boşlukları ve kopyaları ayıklar", p: "İç içe alanlarda içteki boşluğu (kolon, şaft) düşer; üst üste çizilmiş aynı alanı iki kez saymaz." },
      { h: "Kapalı olmayan çizgilerden sınır çıkarır", p: "Alanın içine tıkla, bir bölgedeki bütün alanları al ya da seçtiğin çizgilerin kapattığı bölgeleri sınır olarak çizime ekle. Dış kontur, köşelerindeki küçük boşlukları çizgileri köşede uzatarak (yayları kendi doğrultusunda) kapatır ve tek kapalı sınır çıkarır." },
      {
        h: "Sonucu çizime ve Excel'e yazar",
        p: "Alan yazıları ve tablo çizime eklenir; liste ve toplamlar .xlsx dosyası olarak kaydedilir, istersen CSV, metin ya da panoya kopyalanır. İmalat sekmesinde panelleri imalat tarihine göre gruplayıp çizimde renklendirebilir, ayrı bir imalat listesi alabilirsin.",
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
    betaTitle: "Denemeden önce, açıkça",
    betaIntro:
      "AreaPilot her gün gerçek cephe çizimlerinde kullanılıyor, ama bu kullanım AutoCAD 2021'de. Eklenti AutoCAD 2013-2027 için derlendi; 2021 dışındaki sürümlerde henüz denenmedi. Başka bir sürüm kullanıyorsan önce 7 günlük tam denemeyle kendi sürümünde dene; çalışıp çalışmadığını bize yazman da büyük yardım olur.",
    betaItems: [
      {
        h: "Deneme süresi:",
        p: `ilk kullanımdan itibaren ${A.trialDays} gün, tüm özellikler açık. Kalan gün pencerenin üst bandında görünür. Süre bitince komutlar kapanmaz, AreaPilot ücretsiz moda geçer: her çalıştırmada en çok ${A.freeLimit} alan işlenir. Lisans kodu girince bu sınır kalkar.`,
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
    shaTitle: "İndirdiğin dosyayı doğrula",
    shaNote: "İndirdiğin kurulum dosyasının karması aşağıdakiyle aynı olmalı. PowerShell'de: Get-FileHash \"AreaPilot-Kurulum.exe\" -Algorithm SHA256",
    shaHead: ["Sürüm", "Yayın tarihi", "SHA-256"],
    disclaimer:
      "AreaPilot \"olduğu gibi\" sunulur. Hesaplanan alan ve miktarları kullanmadan önce kendi çiziminizle kontrol edin; hatalar olabilir. Kanunen sınırlandırılamayan sorumluluklar saklıdır.",
    form: {
      title: "AreaPilot'u indir ve dene",
      sub: "Düğmeye bas, indirme bağlantısı hemen burada açılsın. E-posta ya da başka bir bilgi istemiyoruz. İlk kullanımdan itibaren 7 gün tüm özellikler açık.",
      button: "İndirme bağlantısını al",
      sending: "Açılıyor…",
      notice:
        "Bu form e-posta adresi ya da başka bir kişisel veri istemez ve hiçbir kayıt oluşturmaz. Her web isteği gibi IP adresin barındırma sağlayıcımız Vercel'in (ABD) kısa süreli sunucu kayıtlarında görünür. Ayrıntılar:",
      noticeLink: "AreaPilot aydınlatma metni",
      successTitle: "İndirme bağlantın hazır.",
      successNote: "Kurulum dosyası ve rehberler GitHub üzerindeki sürüm sayfamızdan iner. Kurulumda iki uyarı göreceksin; ne yapacağın aşağıda yazıyor.",
      installer: `AreaPilot ${A.version} kurulum dosyası (Windows)`,
      guideTr: "Kullanım ve test rehberi (Türkçe, PDF)",
      guideEn: "User and test guide (English, PDF)",
      errServer: "Bağlantıyı şu an açamadık. Biraz sonra yeniden dene ya da bize yaz.",
    },
    faqTitle: "Sık sorulan sorular",
    faq: [
      {
        q: "AreaPilot ücretli mi?",
        a: `Evet, tek seferlik lisanslı bir üründür. İndirdikten sonra ilk kullanımdan itibaren 7 gün tüm özellikler ücretsiz açıktır; ödeme bilgisi istemeyiz. Deneme bitince AreaPilot kilitlenmez, ücretsiz modda her çalıştırmada en çok 15 alanı işler. Sınırsız kullanım için tek seferlik lisans satın alınır. ${fiyatTr} Koşullar bu sayfadaki Fiyatlar bölümünde.`,
      },
      {
        q: "Çizimlerim nereye gidiyor?",
        a: "Çizimin bilgisayarından çıkmaz. AreaPilot çizimini senin bilgisayarında işler; çizim, sonuçların ve kullanıcı adın bize gönderilmez, kullanım ölçümü ya da analitik yoktur. Yeni sürüm var mı diye bakmak için ostlertech.com'daki sürüm dosyasını okur; bu istekte çizim ya da lisans bilgisi yoktur. Lisans kodu girersen sunucumuza bağlanır: etkinleştirmede lisans kodu, rastgele cihaz numarası ve uygulama sürümü gider; ayrıca AreaPilot çalışırken bilgisayar internete bağlıysa yaklaşık haftada bir lisans durum sorgusu yapılır (yalnız lisans kodu ve cihaz numarası gider). Deneme ve ücretsiz modda lisans için internete çıkılmaz. Her internet isteğinde olduğu gibi IP adresin sunucuya görünür. Bir hata olursa rapor bilgisayarına kaydedilir, otomatik gönderilmez ve 30 gün sonra silinir; raporu bize sen göndermeye karar verirsin. Raporda çiziminin içeriği yoktur.",
      },
      {
        q: "Hangi AutoCAD sürümlerinde çalışır?",
        a: "AutoCAD 2013-2027 (64 bit) için hazırlandı. Günlük kullanımda denendiği sürüm AutoCAD 2021; diğer sürümlerde henüz denenmedi. Satın almadan önce 7 günlük tam denemeyle kendi sürümünde dene; nasıl çalıştığını yazarsan listeyi buna göre güncelleriz.",
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
      "Güncelleme kontrolü: AutoCAD'de AreaPilot penceresi her oturumda ilk açıldığında, uygulama ostlertech.com'daki sürüm dosyasını okur. Bu istekte çizim, kullanıcı adı ya da lisans bilgisi gönderilmez; sitemizin barındırıldığı sunucu (Vercel, ABD) isteğin geldiği IP adresini kısa süreli sunucu kayıtlarında tutar. İnternet yoksa kontrol atlanır. Yeni sürüm varsa size sorulur; \"Evet\" derseniz tarayıcınızda indirme sayfası açılır.",
      "Lisans işlemleri: yalnız lisans kodu girdiyseniz AreaPilot ostlertech.com'a bağlanır; kodu etkinleştirdiğinizde (lisans kodu, rastgele cihaz numarası ve uygulama sürümü gider), \"Bu bilgisayardan kaldır\"a bastığınızda, \"Cihazlarımı sıfırla (e-posta)\" dediğinizde ve AreaPilot çalışırken bilgisayar internete bağlıysa yaklaşık 7 günde bir lisans durum sorgusu için (yalnız lisans kodu ve cihaz numarası gider). Çiziminiz, kullanıcı adınız ve bilgisayar adınız gönderilmez. Durum sorgusu yapılamazsa lisansınız çalışmaya devam eder. Deneme ve ücretsiz modda lisans için internete çıkılmaz.",
      "Hata raporları yalnız bilgisayarınızda: beklenmeyen bir hata olursa ayrıntısı %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\hatalar klasörüne yazılır ve 30 günden eski raporlar silinir. Rapor hiçbir yere kendiliğinden gönderilmez. Uygulama size raporu panoya kopyalamayı önerir; bize göndermek isterseniz e-postaya yapıştırırsınız. Rapora çizim içeriği yazılmaz ve kullanıcı klasörünüzün yolu gizlenir. Ancak hata mesajı dosya ya da katman adı içeriyorsa raporda görünebilir; göndermeden önce göz atabilirsiniz.",
      "Ayarlar ve deneme süresi: dil, tema ve ölçüm ayarlarınız Windows kayıt defterinde (HKEY_CURRENT_USER\\Software\\OstlerTech\\SpaceCalc) tutulur ve kaldırınca silinir. Deneme süresinin başlangıç tarihi HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot\\Deneme anahtarında ve %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\deneme.txt dosyasında tutulur; kaldırıp yeniden kurunca süre baştan başlamasın diye kaldırmada silinmez. Dilerseniz bu dosyayı ve HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot anahtarını elle silebilirsiniz.",
      "Reklam, analitik ya da kullanım ölçümü yoktur.",
    ],
    noticeTitle: "AreaPilot indirme ve deneme: kişisel verilerin işlenmesi",
    notice: [
      {
        h: "Hangi veri, neden:",
        p: "İndirme formu e-posta adresi, AutoCAD sürümü ya da başka bir kişisel veri istemez ve veritabanımıza kayıt yazmaz; düğmeye bastığınızda indirme bağlantısı ekranda gösterilir. Bu istek, her web isteği gibi, IP adresinizle birlikte barındırma sağlayıcımız Vercel'in kısa süreli sunucu kayıtlarında görünür; bu kayıtlar sitenin güvenliği ve hata ayıklama içindir.",
      },
      { h: "Hukuki sebep:", p: "Sitenin güvenliği ve işleyişi için sunucu kayıtlarının tutulmasındaki meşru menfaatimiz (KVKK md. 5/2-f)." },
      {
        h: "Aktarım:",
        p: "Site Vercel Inc. (ABD) üzerinde çalışır; formu kullandığınızda IP adresiniz Vercel'e ulaşır. Vercel'in sunucuları yurt dışındadır ve bu aktarım bugün itibarıyla KVKK md. 9'da sayılan güvencelerden birine (yeterlilik kararı ya da Kurul'un ilan ettiği standart sözleşmenin imzalanıp Kurum'a bildirilmesi) dayanmamaktadır; Vercel ile standart sözleşme imzalanmamıştır. İmzalanırsa Kurum'a bildirir ve bu metni güncelleriz. Verinizi satmayız, reklam için paylaşmayız.",
      },
      {
        h: "Eski kayıtlar:",
        p: "18 Kasım 2026'dan önce bu formda e-posta adresi bırakmış kişilerin kayıtları (e-posta adresi, isteğe bağlı AutoCAD sürümü, kayıt tarihi, IP adresinin geri döndürülemez özeti) Supabase Pte. Ltd.'nin (Singapur şirketi) İrlanda'daki sunucularında tutuluyordu ve 18 Kasım 2026'da silindi; silme kaydı tutuldu. Bu kayıtlardan tanıtım ya da duyuru e-postası gönderilmez.",
      },
      {
        h: "Haklarınız (KVKK md. 11):",
        p: "verinizin işlenip işlenmediğini öğrenme, bilgi isteme, düzeltme, silme, itiraz ve zararın giderilmesini isteme. Başvuru: destek@ostlertech.com ya da KEP; en geç 30 gün içinde yanıt. Kişisel Verileri Koruma Kurulu'na şikâyet hakkınız saklıdır.",
      },
    ],
    trademark: "AutoCAD, Autodesk, Inc.'in tescilli markasıdır. AreaPilot, Autodesk ile bağlantılı değildir.",
  },
  en: {
    title: "AutoCAD area and m² takeoff add-in: AreaPilot",
    description:
      "Finds closed areas in AutoCAD drawings, reads their codes from nearby text, totals m² and perimeter, and exports to Excel. 7-day free trial; one-time license.",
    badge: `Version ${A.version}`,
    h1: "How many m² of cladding are in this area?",
    h1Sub: "AreaPilot: AutoCAD area and m² takeoff add-in",
    lead: "AreaPilot finds the closed areas in your AutoCAD drawing, reads their codes from the text next to them, totals the m² and exports it to Excel.",
    sub: "No more measuring the area of every work item in a building one by one and adding it up on a calculator.",
    cta: "Try free for 7 days",
    ctaNote: `Windows · AutoCAD 2013-2027 · ${A.trialDays}-day free trial from first use`,
    featuresTitle: "What it does",
    features: [
      { h: "Selects closed areas", p: "Pick a few areas yourself, or take every area on a layer at once. Areas inside xrefs and blocks are found too." },
      { h: "Reads the code from nearby text", p: "Text inside or next to an area (TEXT, MTEXT, block attributes) becomes that area's code, and areas with the same code are grouped. If an area holds several texts, the Code source setting decides which one is used." },
      { h: "Totals area and perimeter together", p: "For every code the list shows area, perimeter, count and totals. Click a row and those areas light up in the drawing; Click Inside shows area and perimeter under the cursor. Search the list by code, or untick a row to leave it out of the total." },
      { h: "Handles openings and duplicates", p: "In nested areas the inner opening (column, shaft) is subtracted; the same area drawn twice is counted once." },
      { h: "Builds boundaries from open lines", p: "Click inside an area, take every area in a region, or turn the regions closed by the lines you select into boundaries in the drawing. Outline closes small gaps at the corners by extending the lines (arcs along their own direction) and produces one closed boundary." },
      {
        h: "Writes results to the drawing and to Excel",
        p: "Area labels and a table go into the drawing; the list and totals are saved as an .xlsx file, or copied as CSV, text or to the clipboard. On the Fabrication tab you can group panels by fabrication date, color them in the drawing and export a separate fabrication list.",
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
    betaTitle: "Before you try it, plainly",
    betaIntro:
      "AreaPilot is used every day on real facade drawings, but that use is in AutoCAD 2021. The add-in is built for AutoCAD 2013-2027; versions other than 2021 have not been tested yet. If you use another version, try it first with the 7-day full trial; telling us whether it works is also very useful.",
    betaItems: [
      {
        h: "Trial:",
        p: `${A.trialDays} days from first use, all features unlocked. The days left are shown in the top band of the window. When the trial ends the commands stay available and AreaPilot switches to free mode: up to ${A.freeLimit} areas are processed per run. Entering a license code removes that limit.`,
      },
      { h: "Work on a copy of your drawing.", p: "\"Delete duplicates (OVERKILL)\" and \"Purge unused (PURGE)\" change the drawing. Both can be undone with _U, but use a copy anyway." },
      { h: "If something goes wrong,", p: "AutoCAD keeps running and an error report is saved on your computer. Nothing reaches us unless you send it." },
    ],
    warnTitle: "Two warnings you will see during setup",
    warnIntro: "The installer is not digitally signed yet, so Windows and AutoCAD each ask once. Both warnings are expected.",
    warns: [
      {
        h: "1. Windows: \"Windows protected your PC\"",
        p: "Windows stops the installer because it does not recognize the publisher. Click More info → Run anyway. Only download the file from the link we give you on this page; do not run a copy from anywhere else.",
      },
      {
        h: "2. AutoCAD: \"Security – Unsigned Executable File\"",
        p: "The first time you type AREAPILOT, AutoCAD shows this window. Choose Always Load. AutoCAD will not ask again.",
      },
    ],
    shaTitle: "Verify your download",
    shaNote: "The hash of the installer you downloaded must match the one below. In PowerShell: Get-FileHash \"AreaPilot-Kurulum.exe\" -Algorithm SHA256",
    shaHead: ["Version", "Release date", "SHA-256"],
    disclaimer:
      "AreaPilot is provided \"as is\". Check the calculated areas and quantities against your own drawing before you use them; errors may occur. Liability that cannot be limited by law is unaffected.",
    form: {
      title: "Download and try AreaPilot",
      sub: "Press the button and the download link opens right here. We do not ask for an email or any other information. All features are unlocked for 7 days from first use.",
      button: "Get the download link",
      sending: "Opening…",
      notice:
        "This form does not ask for an email address or any other personal data and creates no record. Like every web request, your IP address appears in the short-lived server logs of our hosting provider Vercel (USA). Details:",
      noticeLink: "AreaPilot privacy notice",
      successTitle: "Your download link is ready.",
      successNote: "The installer and guides download from our release page on GitHub. You will see two warnings during setup; what to do is explained below.",
      installer: `AreaPilot ${A.version} installer (Windows)`,
      guideTr: "Kullanım ve test rehberi (Turkish, PDF)",
      guideEn: "User and test guide (English, PDF)",
      errServer: "We could not open the link right now. Please try again later or write to us.",
    },
    faqTitle: "FAQ",
    faq: [
      { q: "Is AreaPilot paid?", a: `Yes, it is a one-time licensed product. After you download it, all features are free for 7 days from first use and we do not ask for payment details. When the trial ends AreaPilot does not lock; in free mode it processes up to 15 areas per run. A one-time license removes the limit. ${fiyatEn} Terms are in the Pricing section on this page.` },
      {
        q: "Where do my drawings go?",
        a: "Your drawing never leaves your computer. AreaPilot processes it on your computer; your drawing, your results and your user name are not sent to us, and there is no analytics or usage tracking. To check for a new version it reads the version file on ostlertech.com; no drawing or license information is sent with that request. If you enter a license key it connects to our server: activation sends the license key, a random device number and the application version; and while AreaPilot is running and the computer is online, about once a week it makes a license status check (only the license key and the device number are sent). In the trial and free mode nothing is sent for the license. As with any internet request, our server sees your IP address. If an error occurs, the report is saved on your computer, is never sent automatically and is deleted after 30 days; you decide whether to send it to us. The report does not contain your drawing.",
      },
      {
        q: "Which AutoCAD versions does it work with?",
        a: "It is built for AutoCAD 2013-2027 (64-bit). The version it is used and tested in every day is AutoCAD 2021; the others have not been tested yet. Try it on yours with the 7-day full trial before you buy; tell us how it runs and we will update the list.",
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
      "Update check: the first time the AreaPilot window opens in each AutoCAD session, the app reads a version file on ostlertech.com. No drawing, user name or license information is sent; the server hosting our site (Vercel, USA) keeps the requesting IP address in short-lived server logs. Without internet the check is skipped. If a new version exists you are asked; if you choose \"Yes\", the download page opens in your browser.",
      "License operations: only if you entered a license key, AreaPilot connects to ostlertech.com when you activate it (the license key, a random device number and the application version are sent), when you press \"Remove from this computer\", when you choose \"Reset my devices (email)\" and, while AreaPilot is running and the computer is online, about every 7 days for a license status check (only the license key and the device number are sent). Your drawing, user name and computer name are not sent. If the status check cannot be made, your license keeps working. In the trial and free mode nothing is sent for the license.",
      "Error reports stay on your computer: if an unexpected error occurs, details are written to %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\hatalar and reports older than 30 days are deleted. Nothing is sent automatically. The app offers to copy the report to the clipboard; if you want to send it to us, paste it into an email. Drawing content is not written and your user folder path is hidden, but an error message may contain a file or layer name, so please look before sending.",
      "Settings and trial: language, theme and measurement settings are stored in the Windows registry (HKEY_CURRENT_USER\\Software\\OstlerTech\\SpaceCalc) and removed when you uninstall. The trial start date is stored in the HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot\\Deneme key and in %LOCALAPPDATA%\\OstlerTech\\AreaPilot\\deneme.txt; it is kept after uninstalling so the trial does not restart. You can delete that file and the HKEY_CURRENT_USER\\Software\\OstlerTech\\AreaPilot key by hand.",
      "No ads, analytics or usage tracking.",
    ],
    noticeTitle: "AreaPilot download and trial: how we process your data",
    notice: [
      {
        h: "What and why:",
        p: "the download form does not ask for an email address, an AutoCAD version or any other personal data and writes no record to our database; the download link is shown on screen when you press the button. Like every web request, this request appears with your IP address in the short-lived server logs of our hosting provider Vercel; these logs serve the security of the site and debugging.",
      },
      { h: "Legal basis:", p: "our legitimate interest in keeping server logs for the security and operation of the site (KVKK Art. 5(2)(f))." },
      {
        h: "Transfers:",
        p: "the site runs on Vercel Inc. (USA); when you use the form your IP address reaches Vercel. Vercel's servers are outside Türkiye and, as of today, this transfer does not rely on any of the safeguards listed in Article 9 of KVKK (an adequacy decision, or the Board's standard contract signed and notified to the Authority); no standard contract has been signed with Vercel. If one is signed we will notify the Authority and update this text. We do not sell your data or share it for advertising.",
      },
      {
        h: "Old records:",
        p: "records of people who left an email address in this form before 18 November 2026 (email address, optional AutoCAD version, sign-up date, irreversible digest of the IP address) were kept on the servers of Supabase Pte. Ltd. (a Singapore company) in Ireland and were deleted on 18 November 2026; the deletion is logged. No promotional or announcement email is sent from these records.",
      },
      {
        h: "Your rights (KVKK Art. 11):",
        p: "to learn whether your data is processed, request information, correction or deletion, object, and claim compensation. Write to destek@ostlertech.com or our KEP address; we reply within 30 days. You may also complain to the Personal Data Protection Board.",
      },
    ],
    trademark: "AutoCAD is a registered trademark of Autodesk, Inc. AreaPilot is not affiliated with Autodesk.",
  },
};
