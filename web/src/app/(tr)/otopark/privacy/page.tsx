import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { OTOPARK } from "@/lib/otopark";

// Kaynak: OstlerTech/hukuk/otopark-gizlilik-ve-play-beyanlari.md (Zeynep taslağı). İngilizcesi /en/otopark/privacy;
// biri değişirse diğeri de. Oyun adı ve tarih src/lib/otopark.ts'den gelir.
const N = OTOPARK.name;

export const metadata: Metadata = {
  title: `${N} Gizlilik Politikası`,
  description: `${N} araç park bulmacası: üyelik yok, ilerleme cihazda, isteğe bağlı ödüllü reklam (Google AdMob).`,
  alternates: { canonical: OTOPARK.path, languages: { tr: OTOPARK.path, en: OTOPARK.enPath } },
};

const link = "text-primary hover:text-primary-light";

export default function OtoparkPrivacyPage() {
  return (
    <LegalPage eyebrow={N} title={`${N} Gizlilik Politikası`} updated={false} altLink={{ href: OTOPARK.enPath, label: "English" }}>
      <p>Son güncelleme: {OTOPARK.updatedTr}</p>
      <p>
        Bu politika, {N} mobil oyununu (&quot;Oyun&quot;) kullandığınızda hangi verilerin işlendiğini anlatır. 6698 sayılı
        Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni, AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında
        da bilgilendirme niteliğindedir.
      </p>

      <H2>1. Veri sorumlusu</H2>
      <p>
        {COMPANY.legalName} – {COMPANY.tradeName} (şahıs işletmesi). Adres: {COMPANY.address}. İletişim: {COMPANY.email}
      </p>

      <H2>2. Kısaca</H2>
      <List>
        <li>Oyunda üyelik yoktur. Adınızı, e-postanızı ya da telefonunuzu sormayız.</li>
        <li>Bölüm ilerlemeniz, günlük bulmacalarınız, kupalarınız ve ayarlarınız yalnız cihazınızda tutulur; bize gelmez.</li>
        <li>Oyunda isteğe bağlı ödüllü reklam vardır: ek ipucu ya da ek can için reklam izlemeyi siz seçersiniz. Reklamları Google AdMob gösterir.</li>
        <li>Reklamlar yalnız izin verirseniz kişiselleştirilir. Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre dışında 18 yaşından küçüklere her zaman kişiselleştirilmemiş reklam gösterilir. İzninizi istediğiniz zaman geri alabilirsiniz.</li>
        <li>Tek seferlik &quot;Reklamsız paket&quot; satın alımı Google Play üzerinden yapılır. Ödeme kartı bilgileriniz bize gelmez.</li>
        <li>Kendi analitik aracımızı kullanmıyoruz ve oyun bize ait bir sunucuya veri göndermez. Reklam ve satın alma için oyun internete bağlanır.</li>
      </List>

      <H2>3. Cihazınızda kalan veriler</H2>
      <p>
        Açtığınız bölümler, günlük bulmaca ilerlemeniz, kupalarınız ve ayarlarınız (ses, titreşim, tema gibi) yalnız
        cihazınızda saklanır; bunları biz görmeyiz. Günün bulmacası da internete bağlanmadan cihazınızda üretilir. Oyunu
        silerseniz ya da uygulama verilerini temizlerseniz bu veriler silinir. Android yedeklemesi açıksa Android bu verileri
        sizin Google hesabınızdaki yedeğe alabilir; bu yedeği Google yönetir, biz erişemeyiz.
      </p>

      <H2>4. Reklamlar (Google AdMob)</H2>
      <p>
        Ödüllü reklamları Google&apos;ın AdMob hizmeti gösterir. Reklam gösterebilmek, izlendiğini ölçebilmek ve sahtekârlığı
        önleyebilmek için Google Mobile Ads SDK cihazınızdan şu verileri toplar ve Google&apos;a gönderir:
      </p>
      <List>
        <li><b>Cihaz kimlikleri:</b> Android reklam kimliği ve app set ID (varsa cihazda oturum açılmış hesaba ait kimlikler).</li>
        <li><b>IP adresi:</b> cihazın yaklaşık konumunun (ülke, şehir düzeyi) tahmini için kullanılabilir.</li>
        <li><b>Etkileşim bilgileri:</b> uygulamanın açılması, dokunmalar, reklam videosunun izlenmesi.</li>
        <li><b>Teşhis bilgileri:</b> uygulamanın ve SDK&apos;nın performansı (açılış süresi, takılma oranı, enerji kullanımı gibi).</li>
      </List>
      <p>
        Bu veriler aktarım sırasında şifrelenir (TLS). Bu verileri biz almayız ve saklamayız; AdMob bize yalnız toplu reklam
        raporları (gösterim sayısı, gelir gibi) verir. Google bu verileri kendi sorumluluğunda ve kendi politikalarına göre
        işler:{" "}
        <a href="https://policies.google.com/privacy" className={link}>Google Gizlilik Politikası</a>,{" "}
        <a href="https://policies.google.com/technologies/partner-sites" className={link}>Google&apos;ın iş ortaklarından gelen verileri kullanımı</a>,{" "}
        <a href="https://policies.google.com/technologies/ads" className={link}>Google reklamları</a>.
      </p>
      <p>
        <b>Onay ve kişiselleştirilmemiş reklam.</b> Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de oyunu ilk
        açtığınızda Google&apos;ın onay formu gösterilir ve onay alınmadan reklam isteği yapılmaz. Türkiye dahil diğer ülkelerde
        oyunu ilk açtığınızda önce doğum yılınız sorulur, ardından kendi onay penceremiz gösterilir: kişiselleştirilmiş reklama
        izin verirseniz Google reklamları ilgi alanınıza göre seçer; izin vermezseniz ya da 18 yaşından küçükseniz reklamlar
        kişiselleştirilmeden gösterilir. Bu adımlar tamamlanmadan reklam isteği yapılmaz. Kişiselleştirilmemiş reklamda da Google
        reklamı göstermek, saymak ve sahtekârlığı önlemek için sınırlı bilgi işler. ABD&apos;nin bazı eyaletlerinde ayrıca
        Google&apos;ın gizlilik seçenekleri sunulur; kişisel bilgilerinizin reklam için satılmasını veya paylaşılmasını oradan
        reddedebilirsiniz (oyunda &quot;Google gizlilik seçenekleri (ABD)&quot; bağlantısı). Tercihinizi oyunda <b>Ayarlar &gt; Hakkında &gt; Gizlilik seçenekleri</b> bölümünden
        değiştirebilirsiniz (bu bölüm, bulunduğunuz yere göre Google&apos;ın formunu ya da kendi onay penceremizi açar; izninizi
        verdiğiniz kadar kolay geri alabilirsiniz). Reklam kimliğinizi Android ayarlarından sıfırlayabilir veya silebilirsiniz.
        Reklam izlemek zorunlu değildir; reklam izlemeden de oynayabilirsiniz. &quot;Reklamsız paket&quot; satın alındığında
        oyun reklam sistemini hiç başlatmaz.
      </p>
      <p>
        <b>Tercihiniz nerede saklanır.</b> Onay penceresindeki seçiminiz, seçim tarihi ve gördüğünüz metnin sürümü yalnız
        cihazınızda saklanır; bize gönderilmez. Doğum yılı sorusuna verdiğiniz cevaptan yalnız 18 yaş üstü olup olmadığınız
        cihazda tutulur. Bu kayıt Android yedeğine ve yeni cihaza aktarıma alınmaz. Oyunu silerseniz ya da verilerini
        temizlerseniz pencere yeniden gösterilir.
      </p>

      <H2>5. Satın almalar (Google Play)</H2>
      <List>
        <li>&quot;Reklamsız paket&quot; tek seferlik bir satın almadır, abonelik değildir; yenilenmez ve tekrar ücret alınmaz. Satın alındığında oyunda reklam gösterilmez; ipucu ve ek can için video izlemeniz gerekmez. Bu durumda oyun reklam sistemini hiç başlatmaz. Oyunu yeniden yüklediğinizde Google Play&apos;e ulaşılamıyorsa, satın alımınız doğrulanana kadar reklam gösterilebilir.</li>
        <li>Satın alma düğmesi oyunun bölüm ekranında bulunur. Ürün Google Play&apos;de satışa açık değilse ya da ülkenizde sunulmuyorsa satın alma yapılamaz.</li>
        <li>Satıcı: {COMPANY.tradeName} ({COMPANY.legalName}, şahıs işletmesi), {COMPANY.address}, {COMPANY.email}. Satış Google Play üzerinden yapılır; Google bazı ülkelerde (Avrupa Ekonomik Alanı ve Birleşik Krallık gibi) satıcı sıfatıyla, diğer ülkelerde bizim adımıza aracı olarak işlem yapar. Fiyatı, ödeme yöntemini ve vergileri Google Play ödeme ekranında gösterir.</li>
        <li>Ödeme bilgileriniz ve satın alma kaydınız Google tarafından, Google Play koşullarına göre işlenir. Google bize sipariş numarası, tarih, ürün, tutar ve alıcının ülkesi/bölgesi gibi sipariş bilgilerini gösterir; ödeme kartı bilginiz bize gelmez.</li>
        <li>Oyun, satın alımınız olup olmadığını ve satın alma seçeneğinin ürün bilgisini (fiyatını) her açılışta cihazınızdaki Google Play&apos;e sorar; bunun için bize ait bir sunucu kullanılmaz ve sonuç yalnız cihazınızda tutulur.</li>
        <li>Ödemeniz beklemedeyse (örneğin nakit ya da kodla ödeme), ödeme tamamlanana kadar paket açılmaz.</li>
        <li>Aynı Google hesabıyla başka bir cihazda ya da oyunu yeniden yükledikten sonra satın alımınızı &quot;Satın alımı geri yükle&quot; ile geri alabilirsiniz; oyun bunu açılışta kendiliğinden de dener.</li>
        <li>Cayma hakkı: Satın aldığınız paket ödeme tamamlanır tamamlanmaz cihazınızda açılan bir dijital içerik olduğu için, Türkiye&apos;deki satışlarda Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca yasal cayma hakkı uygulanmaz. Bulunduğunuz ülkenin hukuku size daha geniş bir hak tanıyorsa o hak saklıdır.</li>
        <li>İade: İade talepleri Google Play&apos;in iade kurallarına göre değerlendirilir. Google Play&apos;e göre satın almadan sonraki 48 saat içinde iadeyi Google Play&apos;den isteyebilirsiniz; 48 saatten sonra bize {COMPANY.email} adresinden sipariş numaranızla yazabilirsiniz, talebinizi Google Play kurallarına ve yürürlükteki mevzuata göre değerlendiririz. Satın alma iade edilir ya da Google Play satın almayı artık göstermezse reklamlar yeniden gösterilir.</li>
        <li>Şikâyet: {COMPANY.email}. Türkiye&apos;de tüketici hakem heyetine ya da tüketici mahkemesine başvurabilirsiniz.</li>
      </List>

      <H2>6. İşleme amaçları ve hukuki sebepler</H2>
      <List>
        <li><b>Cihazdaki ilerleme ve ayarlar:</b> oyunun çalışması; bize aktarılmaz.</li>
        <li><b>AdMob&apos;un topladığı veriler:</b> reklam gösterme ve ölçme, sahtekârlık önleme. Kişiselleştirilmiş reklam için açık rızanız (KVKK md. 5/1, GDPR md. 6/1-a): AEA, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formuyla, diğer ülkelerde oyundaki onay penceremizle alınır ve istediğiniz zaman geri alınabilir. Kişiselleştirilmemiş reklam ve sahtekârlık önleme için meşru menfaat (KVKK md. 5/2-f, GDPR md. 6/1-f). Rızanızı geri almanız, geri almadan önceki işlemeyi etkilemez.</li>
        <li><b>Satın alma ve sipariş kayıtları:</b> satışı yapmak, iade ve destek taleplerini yanıtlamak, vergi ve muhasebe yükümlülüklerini yerine getirmek; KVKK md. 5/2-c (sözleşmenin kurulması ve ifası) ve 5/2-ç (hukuki yükümlülük), GDPR md. 6/1-b ve 6/1-c.</li>
        <li><b>Destek e-postaları:</b> sorunuza yanıt vermek; KVKK md. 5/2-c ve 5/2-f.</li>
      </List>

      <H2>7. Yurt dışına aktarım</H2>
      <p>
        AdMob ve Google Play verileri, oyundaki reklam ve satın alma bileşenleri aracılığıyla cihazınızdan doğrudan Google
        LLC ve bağlı şirketlerine gönderilir ve Türkiye dışındaki (ABD dahil) sunucularda işlenir. Google bu veriler için
        kendi veri koruma şartlarına göre veri sorumlusu olarak hareket eder. Google&apos;ın şartları Avrupa Birliği&apos;ndeki
        kullanıcılar için AB Standart Sözleşme Maddelerine ve Veri Gizliliği Çerçevesine dayanır; Türkiye&apos;den yapılan
        aktarımlar için Kişisel Verileri Koruma Kurulu&apos;nun ilan ettiği standart sözleşmeye yer vermez. Kişiselleştirilmiş
        reklama izin vermezseniz Google&apos;a giden veriler reklamı göstermek, saymak ve sahtekârlığı önlemek için gereken
        sınırlı bilgiyle kalır; &quot;Reklamsız paket&quot; satın aldığınızda oyun reklam sistemini hiç başlatmaz.
      </p>

      <H2>8. Saklama süreleri</H2>
      <List>
        <li>Cihazdaki ilerleme ve ayarlar: oyunu silene ya da verileri temizleyene kadar.</li>
        <li>AdMob verileri: <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;ın saklama politikasına</a> göre.</li>
        <li>Satın alma kaydı: Google Play&apos;in koşullarına göre (Google hesabınızın sipariş geçmişinde görünür). Google Play Console&apos;daki sipariş bilgileri, vergi ve muhasebe mevzuatının gerektirdiği süre boyunca saklanır.</li>
        <li>Destek ve iade e-postaları: talep kapandıktan sonra 1 yıl.</li>
      </List>

      <H2>9. Çocuklar</H2>
      <p>
        Oyun 16 yaş ve üzeri kullanıcılar için tasarlanmıştır; çocuklara yönelik değildir ve Google Play&apos;in Aileler programında yer almaz. Oyunda gösterilen reklamlar genel izleyiciye uygun (PG) içerikle sınırlıdır. Yaşınızı doğrulamıyoruz. Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre dışında oyunu ilk açtığınızda doğum yılınızı sorarız: 18 yaşından küçükseniz ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa reklamlar her zaman kişiselleştirilmeden gösterilir ve onay penceremiz size gösterilmez; bu durumda da Google, 4. bölümde yazan sınırlı bilgiyi reklamı göstermek, saymak ve sahtekârlığı önlemek için işler. Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de doğum yılı sorulmaz; reklamların kişiselleştirilip kişiselleştirilmeyeceği Google&apos;ın onay formundaki seçiminize göre belirlenir. Oyun, satın alma olup olmadığını ve ürün bilgisini yaşınıza bakmadan Google Play&apos;e (Google hesabınızla) sorar; bu sorguda reklam verisi gönderilmez, ancak Google Play bileşeni kendi işleyiş ve teşhis verisini Google&apos;a gönderebilir. 16 yaşından küçük bir çocuğun oyunu kullandığını düşünüyorsanız {COMPANY.email} adresine yazın; cihazdaki verileri silmek için oyunu kaldırmanız ya da verilerini temizlemeniz yeterlidir.
      </p>

      <H2>10. Haklarınız</H2>
      <p>
        KVKK md. 11 ve GDPR kapsamında bilgi isteme, düzeltme, silme, itiraz ve şikâyet haklarına sahipsiniz. Sizi tanıtan
        bir veri tutmadığımız için çoğu talebin en hızlı yolu Google&apos;dır: reklam kimliğinizi sıfırlayabilir, onay
        tercihinizi oyundan değiştirebilir, <a href="https://myaccount.google.com" className={link}>Google hesabınızdan</a>{" "}
        başvurabilirsiniz. {COMPANY.email} adresine yazdığınız başvurular en geç 30 gün içinde yanıtlanır. Kişisel Verileri
        Koruma Kurulu&apos;na ya da AB&apos;de bulunduğunuz ülkenin veri koruma otoritesine şikâyette bulunabilirsiniz.
      </p>

      <H2>11. Değişiklikler</H2>
      <p>
        Oyun yeni bir veri toplamaya başlarsa bu politika o sürüm yayınlanmadan önce güncellenir ve tarih değişir.
      </p>
    </LegalPage>
  );
}
