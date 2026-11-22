import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// Kaynak: OstlerTech/hukuk/2026-11-03-packle-gizlilik-sayfa-taslak.md (Zeynep taslağı, YAYIN METNİ). İngilizcesi /en/packle/privacy; biri değişirse diğeri de.
export const metadata: Metadata = {
  title: "Packle Gizlilik Politikası",
  description: "Packle blok bulmaca: üyelik yok, skor cihazda, Google AdMob ile ödüllü ve oyun sonu reklam.",
  alternates: { canonical: "/packle/privacy", languages: { tr: "/packle/privacy", en: "/en/packle/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function PacklePrivacyPage() {
  return (
    <LegalPage eyebrow="Packle" title="Packle Gizlilik Politikası" updated={false} altLink={{ href: "/en/packle/privacy", label: "English" }}>
      <p>Son güncelleme: 23 Kasım 2026</p>
      <p>Bu politika, Packle mobil oyununu (&quot;Oyun&quot;) kullandığınızda hangi verilerin işlendiğini anlatır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni, AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında da bilgilendirme niteliğindedir.</p>
      <H2>1. Veri sorumlusu</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (şahıs işletmesi). Adres: {COMPANY.address}. İletişim: {COMPANY.email}</p>
      <H2>2. Kısaca</H2>
      <List>
        <li>Oyunda üyelik yoktur. Adınızı, e-postanızı ya da telefonunuzu sormayız.</li>
        <li>En yüksek skorunuz, günlük meydan okuma kaydınız (günün en iyi skoru ve gün seriniz), ayarlarınız, yarım kalan oyununuz ve Oyunun kendi kaydı (örneğin puan penceresinin daha önce istenip istenmediği, rehberin daha önce görülüp görülmediği) yalnız cihazınızda tutulur; bize gönderilmez.</li>
        <li>Oyunda Google AdMob ile iki tür reklam gösterilir: isteğe bağlı ödüllü reklam (oyun başına ikinci geri alma hakkı için ya da oyun bittiğinde, oyun başına bir kez &quot;Devam et&quot; için) ve bazı oyunların sonunda tam ekran reklam.</li>
        <li>Oyun 16 yaş ve üzeri için tasarlanmıştır. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam gösterilmez ve Google&apos;a reklam verisi gönderilmez. 18 yaşından küçüklere (ya da 18 yaşını doldurduğu kesin anlaşılmayanlara) yalnız kişiselleştirilmemiş reklam gösterilir. Diğer kullanıcılarda reklamlar yalnız izin verirseniz kişiselleştirilir; izninizi istediğiniz zaman geri alabilirsiniz.</li>
        <li>Bir oyun bittiğinde, yalnız siz isterseniz skorunuzu (günlük meydan okumada ayrıca tarihi ve gün serinizi) ve Oyunun Google Play bağlantısını telefonunuzun paylaşım penceresiyle seçtiğiniz uygulamaya gönderebilirsiniz; Oyun bu metni kendisi hiçbir yere göndermez ve paylaşım bize gelmez. Bir oyun bittiğinde Oyun, en çok bir kez, Google Play&apos;in uygulama içi puan penceresini açmayı deneyebilir; bu pencereyi Google Play işletir, verdiğiniz puanı ve yorumu Oyun görmez. 18 yaşını doldurduğu anlaşılan kullanıcılara ana ekranda &quot;Diğer oyunlarımız&quot; bölümü de gösterilir.</li>
        <li>&quot;Diğer oyunlarımız&quot; bölümündeki ve paylaşım metnindeki Google Play bağlantıları, hangi oyundan ve hangi yoldan (tanıtım ya da paylaşım) gelindiğini belirten sabit bir etiket taşır; bu etiket sizi ya da cihazınızı tanıtan bir kimlik içermez. Google Play bu etikete göre bize yalnız toplu sayılar (mağaza ziyareti ve yükleme gibi) gösterebilir.</li>
        <li>Kendi analitik aracımızı kullanmıyoruz ve Oyun bize ait bir sunucuya veri göndermez. Reklamlar için Oyun internete bağlanır; puan penceresini ve &quot;Diğer oyunlarımız&quot; bağlantılarını cihazınızdaki Google Play açar.</li>
      </List>
      <H2>3. Cihazınızda kalan veriler</H2>
      <p>En yüksek skorunuz, oynadığınız oyun sayısı, günlük meydan okuma kaydınız (günün en iyi skoru ve gün seriniz), ayarlarınız (ses, titreşim, tema gibi), Oyunun kendi kaydı (puan penceresinin daha önce istenip istenmediği, rehberin daha önce görülüp görülmediği) ve yarım kalan oyunlarınız (yalnız aynı gün devam ettirilebilen yarım günlük meydan okuma dahil) yalnız cihazınızda saklanır; bunları biz görmeyiz. Günlük meydan okumanın parçaları cihazınızın tarihine göre, internete bağlanmadan cihazınızda üretilir. Oyunu silerseniz ya da uygulama verilerini temizlerseniz bu veriler silinir. Android yedeklemesi açıksa Android skorunuzu, günlük meydan okuma kaydınızı, ayarlarınızı, puan penceresi kaydını ve rehberin görüldü bilgisini sizin Google hesabınızdaki yedeğe alabilir; yarım kalan oyunlar (yarım günlük meydan okuma dahil), Oyundaki onay penceremizdeki seçiminiz ve yaş grubunuz bu yedeğe alınmaz. Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formunda yaptığınız seçim ve Google&apos;ın onay aracının cihazdaki kaydı ise yedeğe alınabilir. Bu yedeği Google yönetir, biz erişemeyiz.</p>
      <H2>4. Reklamlar (Google AdMob)</H2>
      <p>Oyundaki reklamları Google&apos;ın AdMob hizmeti gösterir:</p>
      <List>
        <li><b>Ödüllü reklam:</b> her oyunda ilk geri alma hakkı ücretsizdir; ikinci geri alma hakkı için ve oyun bittiğinde (oyun başına bir kez) &quot;Devam et&quot; için reklam izlemeyi siz seçersiniz. Reklam izlemek zorunlu değildir.</li>
        <li><b>Tam ekran reklam:</b> bazı oyunların sonunda, skorunuz gösterildikten sonra kısa bir uyarıyla açılır. Uyarı sırasında bir düğmeye basarsanız o seferlik gösterilmez.</li>
      </List>
      <p>Reklam gösterebilmek, izlendiğini ölçebilmek ve sahtekârlığı önleyebilmek için Google Mobile Ads SDK cihazınızdan şu verileri toplar ve Google&apos;a gönderir:</p>
      <List>
        <li><b>Cihaz kimlikleri:</b> Android reklam kimliği ve app set ID (varsa cihazda oturum açılmış hesaba ait kimlikler).</li>
        <li><b>IP adresi:</b> cihazın yaklaşık konumunun (ülke, şehir düzeyi) tahmini için kullanılabilir.</li>
        <li><b>Etkileşim bilgileri:</b> uygulamanın açılması, dokunmalar, reklam videosunun izlenmesi.</li>
        <li><b>Teşhis bilgileri:</b> uygulamanın ve SDK&apos;nın performansı (açılış süresi, takılma oranı, enerji kullanımı gibi).</li>
      </List>
      <p>Bu veriler aktarım sırasında şifrelenir (TLS). Bu verileri biz almayız ve saklamayız; AdMob bize yalnız toplu reklam raporları (gösterim sayısı, gelir gibi) verir. Google bu verileri kendi sorumluluğunda ve kendi politikalarına göre işler: <a href="https://policies.google.com/privacy" className={link}>Google Gizlilik Politikası</a>, <a href="https://policies.google.com/technologies/partner-sites" className={link}>Google&apos;ın iş ortaklarından gelen verileri kullanımı</a>, <a href="https://policies.google.com/technologies/ads" className={link}>Google reklamları</a>.</p>
      <p><b>Onay ve kişiselleştirilmemiş reklam.</b> Oyunu ilk açtığınızda, bulunduğunuz ülke ne olursa olsun önce doğum yılınız sorulur; bu soru cevaplanmadan reklam bileşeni ve Google&apos;ın onay aracı çalışmaz. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam bileşeni hiç başlatılmaz (ayrıntı 8. bölümde). 16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa reklamlar her zaman kişiselleştirilmeden gösterilir, size onay sorulmaz ve Google&apos;ın onay aracından bilgi istenmez. 18 yaşını doldurduysanız: Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formu, Türkiye dahil diğer ülkelerde kendi onay penceremiz gösterilir; kişiselleştirilmiş reklama izin verirseniz Google reklamları ilgi alanınıza göre seçer, izin vermezseniz reklamlar kişiselleştirilmeden gösterilir. Bu adımlar tamamlanmadan reklam isteği yapılmaz. Kişiselleştirilmemiş reklamda da Google reklamı göstermek, saymak ve sahtekârlığı önlemek için sınırlı bilgi işler. ABD&apos;nin bazı eyaletlerinde ayrıca Google&apos;ın gizlilik seçenekleri sunulur; kişisel bilgilerinizin reklam için satılmasını veya paylaşılmasını oradan reddedebilirsiniz (Oyunda &quot;Google gizlilik seçenekleri (ABD)&quot; bağlantısı). Tercihinizi Oyunda <b>ana ekrandaki Gizlilik seçenekleri</b> bölümünden değiştirebilirsiniz (18 yaşını doldurduysanız bu bölüm, bulunduğunuz yere göre Google&apos;ın formunu ya da kendi onay penceremizi açar; 18 yaşından küçük olduğu anlaşılan kullanıcılara kişiselleştirilmiş reklam gösterilmediğini, 16 yaşından küçük olabileceği anlaşılanlara ise reklam gösterilmediğini söyler ve bu kullanıcılarda Google&apos;ın formunu açmaz; yaşınız henüz sorulmadıysa önce doğum yılınızı sorar; izninizi verdiğiniz kadar kolay geri alabilirsiniz). Reklam kimliğinizi Android ayarlarından sıfırlayabilir veya silebilirsiniz.</p>
      <p><b>Tercihiniz nerede saklanır.</b> Onay penceresindeki seçiminiz, seçim tarihi ve gördüğünüz metnin sürümü yalnız cihazınızda saklanır; bize gönderilmez. Doğum yılı sorusuna verdiğiniz cevaptan doğum yılınız değil, yalnız yaş grubunuz (16 altı, 16-17, 18 ve üzeri) cihazda tutulur. Bu kayıt Android yedeğine ve yeni cihaza aktarıma alınmaz. Oyunu silerseniz ya da verilerini temizlerseniz bu sorular yeniden sorulur.</p>
      <H2>5. İşleme amaçları ve hukuki sebepler</H2>
      <List>
        <li><b>Cihazdaki skor, günlük meydan okuma kaydı, ayarlar ve yarım oyun:</b> Oyunun çalışması; bize aktarılmaz.</li>
        <li><b>AdMob&apos;un topladığı veriler:</b> reklam gösterme ve ölçme, sahtekârlık önleme. Kişiselleştirilmiş reklam için açık rızanız (KVKK md. 5/1, GDPR md. 6/1-a): AEA, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formuyla, diğer ülkelerde Oyundaki onay penceremizle alınır ve istediğiniz zaman geri alınabilir. Kişiselleştirilmemiş reklam ve sahtekârlık önleme için meşru menfaat (KVKK md. 5/2-f, GDPR md. 6/1-f). Rızanızı geri almanız, geri almadan önceki işlemeyi etkilemez.</li>
        <li><b>Destek e-postaları:</b> sorunuza yanıt vermek; KVKK md. 5/2-c ve 5/2-f.</li>
        <li><b>Google Play puan ve yorumları:</b> Google Play&apos;de Oyun için yayımladığınız puanı ve yorumu Google Play Console&apos;da görürüz. Google Play bunu kullanıcı adınız ve tarihle, bazı yorumlarda ayrıca cihaz bilgisi (üretici, ekran boyutu, Android sürümü), Oyunun sürüm numarası ve dil bilgisiyle birlikte gösterir. Bu bilgileri yorumunuza Google Play&apos;de herkese açık yanıt vermek ve Oyunu geliştirmek için kullanırız; KVKK md. 5/2-f, GDPR md. 6/1-f. Oyun ve puan penceresi bize bunun dışında bir bilgi göndermez.</li>
      </List>
      <H2>6. Yurt dışına aktarım</H2>
      <p>AdMob verileri, Oyundaki reklam bileşeni aracılığıyla cihazınızdan doğrudan Google LLC ve bağlı şirketlerine gönderilir ve Türkiye dışındaki (ABD dahil) sunucularda işlenir. Google bu veriler için kendi veri koruma şartlarına göre veri sorumlusu olarak hareket eder. Kişiselleştirilmiş reklama izin vermezseniz Google&apos;a giden veriler reklamı göstermek, saymak ve sahtekârlığı önlemek için gereken sınırlı bilgiyle kalır.</p>
      <H2>7. Saklama süreleri</H2>
      <List>
        <li>Cihazdaki skor, günlük meydan okuma kaydı, ayarlar ve yarım oyun: Oyunu silene ya da verileri temizleyene kadar.</li>
        <li>AdMob verileri: <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;ın saklama politikasına</a> göre.</li>
        <li>Destek e-postaları: talep kapandıktan sonra 1 yıl.</li>
        <li>Google Play puan ve yorumları: Google Play&apos;in koşullarına göre. Yorumunuz Google hesabınıza bağlıdır ve herkese açıktır; Google Play&apos;den istediğiniz zaman düzenleyebilir ya da silebilirsiniz.</li>
      </List>
      <H2>8. Çocuklar</H2>
      <p>Oyun 16 yaş ve üzeri kullanıcılar için tasarlanmıştır; 16 yaşından küçükler Oyunu kullanmamalıdır. Oyun çocuklara yönelik değildir ve Google Play&apos;in Aileler programında yer almaz. Oyunda gösterilen reklamlar genel izleyiciye uygun (PG) içerikle sınırlıdır. Yaşınızı doğrulamıyoruz; yalnız Oyunun başında doğum yılınızı sorarız.</p>
      <List>
        <li><b>Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa:</b> size bir kez Oyunun 16 yaş ve üzeri için tasarlandığını belirten bir not gösterilir. Oyunda reklam gösterilmez; reklam bileşeni ve Google&apos;ın onay aracı hiç başlatılmaz, bu yüzden Google&apos;a reklam verisi gönderilmez. Reklamla açılan ikinci geri alma hakkı bu durumda kullanılamaz; 16 yaşından küçüklere &quot;Devam et&quot; de sunulmaz.</li>
        <li><b>16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa:</b> reklamlar her zaman kişiselleştirilmeden gösterilir, Google&apos;a rıza yaşının altında olduğunuzu bildiren ayar gönderilir ve size ne bizim onay penceremiz ne de Google&apos;ın onay formu gösterilir. Bu durumda da Google, 4. bölümde yazan sınırlı bilgiyi reklamı göstermek, saymak ve sahtekârlığı önlemek için işler. Google&apos;ın onay aracından bilgi de istenmez.</li>
      </List>
      <p>&quot;Diğer oyunlarımız&quot; bölümü 18 yaşın altındaki ve yaşı bilinmeyen kullanıcılara gösterilmez. Google Play&apos;in uygulama içi puan penceresi ise yaşınıza bakılmadan, 16 yaşından küçük olabileceği anlaşılan kullanıcılarda da açılabilir; bu pencereyi cihazınızdaki Google Play açar ve işletir, Oyun bunun için reklam bileşenini başlatmaz ve verdiğiniz puanı ya da yorumu görmez. Skor paylaşımı her yaşta kullanılabilir ve bize veri göndermez.</p>
      <p>16 yaşından küçük bir çocuğun Oyunu kullandığını düşünüyorsanız {COMPANY.email} adresine yazın; cihazdaki verileri silmek için Oyunu kaldırmanız ya da verilerini temizlemeniz yeterlidir.</p>
      <H2>9. Haklarınız</H2>
      <p>KVKK md. 11 ve GDPR kapsamında bilgi isteme, düzeltme, silme, itiraz ve şikâyet haklarına sahipsiniz. Sizi tanıtan bir veri tutmadığımız için çoğu talebin en hızlı yolu Google&apos;dır: reklam kimliğinizi sıfırlayabilir, onay tercihinizi Oyundan değiştirebilir, <a href="https://myaccount.google.com" className={link}>Google hesabınızdan</a> başvurabilirsiniz. {COMPANY.email} adresine yazdığınız başvurular en geç 30 gün içinde yanıtlanır. Kişisel Verileri Koruma Kurulu&apos;na ya da AB&apos;de bulunduğunuz ülkenin veri koruma otoritesine şikâyette bulunabilirsiniz.</p>
      <H2>10. Değişiklikler</H2>
      <p>Oyun yeni bir veri toplamaya başlarsa bu politika o sürüm yayınlanmadan önce güncellenir ve tarih değişir.</p>
      <p>15 Kasım 2026 güncellemesi (Oyun sürüm 1.1.0): 16-17 yaşındaki ya da 18 yaşını doldurduğu kesin anlaşılmayan kullanıcılarda Oyun, reklam bileşenini Google&apos;ın onay aracından bilgi istemeden, doğrudan kişiselleştirilmemiş reklam ayarıyla başlatır; günlük meydan okuma (günün en iyi skoru ve gün serisi yalnız cihazda), skor paylaşımı, Google Play uygulama içi puan penceresi ve yalnız 18 yaşını doldurduğu anlaşılan kullanıcılara gösterilen &quot;Diğer oyunlarımız&quot; bölümü eklendi. Paylaşım ve puan penceresi Oyun üzerinden bize veri göndermez; Google Play bağlantılarındaki etiket kişisel bir kimlik içermez.</p>
    </LegalPage>
  );
}
