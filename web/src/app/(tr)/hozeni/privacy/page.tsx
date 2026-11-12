import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// Kaynak: OstlerTech/hukuk/2026-11-03-hozeni-gizlilik-sayfa-taslak.md (Zeynep taslağı, YAYIN METNİ). İngilizcesi /en/hozeni/privacy; biri değişirse diğeri de.
export const metadata: Metadata = {
  title: "Hozeni Gizlilik Politikası",
  description: "Hozeni sudoku: üyelik yok, bulmacalar cihazda, Google AdMob ile ödüllü ve bulmaca sonu reklam.",
  alternates: { canonical: "/hozeni/privacy", languages: { tr: "/hozeni/privacy", en: "/en/hozeni/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function HozeniPrivacyPage() {
  return (
    <LegalPage eyebrow={<span lang="en">Hozeni</span>} title="Hozeni Gizlilik Politikası" updated={false} altLink={{ href: "/en/hozeni/privacy", label: "English" }}>
      <p>Son güncelleme: 12 Kasım 2026</p>
      <p>Bu politika, Hozeni mobil oyununu (&quot;Oyun&quot;) kullandığınızda hangi verilerin işlendiğini anlatır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni, AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında da bilgilendirme niteliğindedir.</p>
      <H2>1. Veri sorumlusu</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (şahıs işletmesi). Adres: {COMPANY.address}. İletişim: {COMPANY.email}</p>
      <H2>2. Kısaca</H2>
      <List>
        <li>Oyunda üyelik yoktur. Adınızı, e-postanızı ya da telefonunuzu sormayız.</li>
        <li>Bulmacalarınız, istatistikleriniz ve ayarlarınız yalnız cihazınızda tutulur; bize gelmez.</li>
        <li>Oyunda Google AdMob ile iki tür reklam gösterilir: isteğe bağlı ödüllü reklam (ek ipucu için) ve bazı bulmacaların sonunda tam ekran reklam.</li>
        <li>Oyun 16 yaş ve üzeri için tasarlanmıştır. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam gösterilmez ve Google&apos;a reklam verisi gönderilmez. 18 yaşından küçüklere (ya da 18 yaşını doldurduğu kesin anlaşılmayanlara) yalnız kişiselleştirilmemiş reklam gösterilir. Diğer kullanıcılarda reklamlar yalnız izin verirseniz kişiselleştirilir; izninizi istediğiniz zaman geri alabilirsiniz.</li>
        <li>18 yaşını doldurduğu anlaşılan kullanıcılara isteğe bağlı, tek seferlik &quot;Reklamları kaldır&quot; satın alımı Google Play üzerinden sunulur. Ödeme kartı bilgileriniz bize gelmez.</li>
        <li>Kendi analitik aracımızı kullanmıyoruz ve Oyun bize ait bir sunucuya veri göndermez. Oyun reklamlar ve satın alma için internete bağlanır.</li>
      </List>
      <H2>3. Cihazınızda kalan veriler</H2>
      <p>Yarım kalan bulmacanız, istatistikleriniz (çözdüğünüz bulmacalar, süreler, seriler ve koruma günleri gibi) ve ayarlarınız yalnız cihazınızda saklanır; bunları biz görmeyiz. Günün bulmacası da internete bağlanmadan cihazınızda üretilir. Oyunu silerseniz ya da uygulama verilerini temizlerseniz bu veriler silinir. Android yedeklemesi açıksa Android bulmacalarınızı, istatistiklerinizi ve ayarlarınızı sizin Google hesabınızdaki yedeğe alabilir; reklam tercihiniz bu yedeğe alınmaz; &quot;Reklamları kaldır&quot; satın alımının cihazdaki durumu da yedeğe ve yeni cihaza aktarıma alınmaz, Google Play&apos;den geri yüklenir (5. bölüm). Bu yedeği Google yönetir, biz erişemeyiz.</p>
      <H2>4. Reklamlar (Google AdMob)</H2>
      <p>Oyundaki reklamları Google&apos;ın AdMob hizmeti gösterir:</p>
      <List>
        <li><b>Ödüllü reklam:</b> her bulmacada ilk 3 ipucu ücretsizdir; sonraki ipuçları için reklam izlemeyi siz seçersiniz. Reklam o an hazır değilse ipucu yine ücretsiz verilir. Reklam izlemek zorunlu değildir.</li>
        <li><b>Tam ekran reklam:</b> bazı bulmacaların sonunda, kazanma ekranı gösterildikten sonra kısa bir geri sayımla açılır. Geri sayım sırasında bir düğmeye basarsanız o seferlik gösterilmez.</li>
      </List>
      <p>Reklam gösterebilmek, izlendiğini ölçebilmek ve sahtekârlığı önleyebilmek için Google Mobile Ads SDK cihazınızdan şu verileri toplar ve Google&apos;a gönderir:</p>
      <List>
        <li><b>Cihaz kimlikleri:</b> Android reklam kimliği ve app set ID (varsa cihazda oturum açılmış hesaba ait kimlikler).</li>
        <li><b>IP adresi:</b> cihazın yaklaşık konumunun (ülke, şehir düzeyi) tahmini için kullanılabilir.</li>
        <li><b>Etkileşim bilgileri:</b> uygulamanın açılması, dokunmalar, reklam videosunun izlenmesi.</li>
        <li><b>Teşhis bilgileri:</b> uygulamanın ve SDK&apos;nın performansı (açılış süresi, takılma oranı, enerji kullanımı gibi).</li>
      </List>
      <p>Bu veriler aktarım sırasında şifrelenir (TLS). Bu verileri biz almayız ve saklamayız; AdMob bize yalnız toplu reklam raporları (gösterim sayısı, gelir gibi) verir. Google bu verileri kendi sorumluluğunda ve kendi politikalarına göre işler: <a href="https://policies.google.com/privacy" className={link}>Google Gizlilik Politikası</a>, <a href="https://policies.google.com/technologies/partner-sites" className={link}>Google&apos;ın iş ortaklarından gelen verileri kullanımı</a>, <a href="https://policies.google.com/technologies/ads" className={link}>Google reklamları</a>.</p>
      <p><b>Onay ve kişiselleştirilmemiş reklam.</b> Oyunu ilk açtığınızda, bulunduğunuz ülke ne olursa olsun önce doğum yılınız sorulur; bu soru cevaplanmadan reklam bileşeni ve Google&apos;ın onay aracı çalışmaz. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam bileşeni hiç başlatılmaz (ayrıntı 9. bölümde). 16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa reklamlar her zaman kişiselleştirilmeden gösterilir ve size onay sorulmaz. 18 yaşını doldurduysanız: Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formu, Türkiye dahil diğer ülkelerde kendi onay penceremiz gösterilir; kişiselleştirilmiş reklama izin verirseniz Google reklamları ilgi alanınıza göre seçer, izin vermezseniz reklamlar kişiselleştirilmeden gösterilir. Bu adımlar tamamlanmadan reklam isteği yapılmaz. Kişiselleştirilmemiş reklamda da Google reklamı göstermek, saymak ve sahtekârlığı önlemek için sınırlı bilgi işler. ABD&apos;nin bazı eyaletlerinde ayrıca Google&apos;ın gizlilik seçenekleri sunulur; kişisel bilgilerinizin reklam için satılmasını veya paylaşılmasını oradan reddedebilirsiniz (Oyunda &quot;Google gizlilik seçenekleri (ABD)&quot; bağlantısı). Tercihinizi Oyunda <b>Ayarlar &gt; Reklam gizlilik seçenekleri</b> bölümünden değiştirebilirsiniz (bu bölüm, bulunduğunuz yere göre Google&apos;ın formunu ya da kendi onay penceremizi açar, 16 yaşından küçük olabileceği anlaşılan kullanıcılara ise reklam gösterilmediğini söyler; izninizi verdiğiniz kadar kolay geri alabilirsiniz). Reklam kimliğinizi Android ayarlarından sıfırlayabilir veya silebilirsiniz.</p>
      <p><b>Tercihiniz nerede saklanır.</b> Onay penceresindeki seçiminiz, seçim tarihi ve gördüğünüz metnin sürümü yalnız cihazınızda saklanır; bize gönderilmez. Doğum yılı sorusuna verdiğiniz cevaptan doğum yılınız değil, yalnız yaş grubunuz (16 altı, 16-17, 18 ve üzeri) cihazda tutulur. Bu kayıt Android yedeğine ve yeni cihaza aktarıma alınmaz. Oyunu silerseniz ya da verilerini temizlerseniz bu sorular yeniden sorulur.</p>
      <H2>5. Satın almalar (Google Play)</H2>
      <List>
        <li>&quot;Reklamları kaldır&quot; tek seferlik bir satın almadır, abonelik değildir; yenilenmez ve tekrar ücret alınmaz. Satın alındığında bulmacalar arası tam ekran reklamlar gösterilmez, ipuçları için reklam izlemeniz gerekmez ve Kâğıt ile Gece tahta temaları açılır. Bu durumda reklam bileşeni hiç başlatılmaz ve Google&apos;a reklam verisi gönderilmez.</li>
        <li>Satıcı: {COMPANY.tradeName} ({COMPANY.legalName}, şahıs işletmesi), {COMPANY.address}, {COMPANY.email}. Satış Google Play üzerinden yapılır; Google bazı ülkelerde (Avrupa Ekonomik Alanı ve Birleşik Krallık gibi) satıcı sıfatıyla, diğer ülkelerde bizim adımıza aracı olarak işlem yapar. Fiyatı, ödeme yöntemini ve vergileri Google Play ödeme ekranında gösterir.</li>
        <li>Ödeme bilgileriniz ve satın alma kaydınız Google tarafından, Google Play koşullarına göre işlenir. Google bize sipariş numarası, tarih, ürün, tutar ve alıcının ülkesi/bölgesi gibi sipariş bilgilerini gösterir; ödeme kartı bilginiz bize gelmez.</li>
        <li>Oyun, satın alımınız olup olmadığını her açılışta, yaşınızdan bağımsız olarak, cihazınızdaki Google Play&apos;e sorarak doğrular; bunun için bize ait bir sunucu kullanılmaz ve sonuç yalnız cihazınızda tutulur. Satın alma seçeneği ve fiyatı için Google Play&apos;den ürün bilgisi ise yalnız doğum yılınızdan 18 yaşını doldurduğunuz anlaşılırsa istenir ve yalnız bu durumda gösterilir.</li>
        <li>Ödemeniz beklemedeyse (örneğin nakit ya da kodla ödeme), ödeme tamamlanana kadar içerik açılmaz.</li>
        <li>Aynı Google hesabıyla başka bir cihazda ya da Oyunu yeniden yükledikten sonra satın alımınızı &quot;Satın alımı geri yükle&quot; ile geri alabilirsiniz; Oyun bunu açılışta kendiliğinden de dener.</li>
        <li>Cayma hakkı: Satın aldığınız içerik ödeme tamamlanır tamamlanmaz cihazınızda açılan bir dijital içerik olduğu için, Türkiye&apos;deki satışlarda Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca yasal cayma hakkı uygulanmaz. Bulunduğunuz ülkenin hukuku size daha geniş bir hak tanıyorsa o hak saklıdır.</li>
        <li>İade: İade talepleri Google Play&apos;in iade kurallarına göre değerlendirilir. Google Play&apos;e göre satın almadan sonraki 48 saat içinde iadeyi Google Play&apos;den isteyebilirsiniz; 48 saatten sonra bize {COMPANY.email} adresinden sipariş numaranızla yazabilirsiniz, talebinizi Google Play kurallarına ve yürürlükteki mevzuata göre değerlendiririz. Satın alma iade edilir ya da Google Play satın almayı artık göstermezse reklamlar yeniden gösterilir ve tahta teması Hozeni&apos;ye döner.</li>
        <li>Şikâyet: {COMPANY.email}. Türkiye&apos;de tüketici hakem heyetine ya da tüketici mahkemesine başvurabilirsiniz.</li>
      </List>
      <H2>6. İşleme amaçları ve hukuki sebepler</H2>
      <List>
        <li><b>Cihazdaki bulmacalar, istatistikler ve ayarlar:</b> Oyunun çalışması; bize aktarılmaz.</li>
        <li><b>AdMob&apos;un topladığı veriler:</b> reklam gösterme ve ölçme, sahtekârlık önleme. Kişiselleştirilmiş reklam için açık rızanız (KVKK md. 5/1, GDPR md. 6/1-a): AEA, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formuyla, diğer ülkelerde Oyundaki onay penceremizle alınır ve istediğiniz zaman geri alınabilir. Kişiselleştirilmemiş reklam ve sahtekârlık önleme için meşru menfaat (KVKK md. 5/2-f, GDPR md. 6/1-f). Rızanızı geri almanız, geri almadan önceki işlemeyi etkilemez.</li>
        <li><b>Satın alma ve sipariş kayıtları:</b> satışı yapmak, iade ve destek taleplerini yanıtlamak, vergi ve muhasebe yükümlülüklerini yerine getirmek; KVKK md. 5/2-c (sözleşmenin kurulması ve ifası) ve 5/2-ç (hukuki yükümlülük), GDPR md. 6/1-b ve 6/1-c.</li>
        <li><b>Destek e-postaları:</b> sorunuza yanıt vermek; KVKK md. 5/2-c ve 5/2-f.</li>
      </List>
      <H2>7. Yurt dışına aktarım</H2>
      <p>AdMob ve Google Play verileri, Oyundaki reklam ve satın alma bileşenleri aracılığıyla cihazınızdan doğrudan Google LLC ve bağlı şirketlerine gönderilir ve Türkiye dışındaki (ABD dahil) sunucularda işlenir. Google bu veriler için kendi veri koruma şartlarına göre veri sorumlusu olarak hareket eder. Google&apos;ın şartları Avrupa Birliği&apos;ndeki kullanıcılar için AB Standart Sözleşme Maddelerine ve Veri Gizliliği Çerçevesine dayanır; Türkiye&apos;den yapılan aktarımlar için Kişisel Verileri Koruma Kurulu&apos;nun ilan ettiği standart sözleşmeye yer vermez. Kişiselleştirilmiş reklama izin vermezseniz Google&apos;a giden veriler reklamı göstermek, saymak ve sahtekârlığı önlemek için gereken sınırlı bilgiyle kalır.</p>
      <H2>8. Saklama süreleri</H2>
      <List>
        <li>Cihazdaki bulmacalar, istatistikler ve ayarlar: Oyunu silene ya da verileri temizleyene kadar.</li>
        <li>AdMob verileri: <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;ın saklama politikasına</a> göre.</li>
        <li>Satın alma kaydı: Google Play&apos;in koşullarına göre (Google hesabınızın sipariş geçmişinde görünür). Google Play Console&apos;daki sipariş bilgileri, vergi ve muhasebe mevzuatının gerektirdiği süre boyunca saklanır.</li>
        <li>Destek ve iade e-postaları: talep kapandıktan sonra 1 yıl.</li>
      </List>
      <H2>9. Çocuklar</H2>
      <p>Oyun 16 yaş ve üzeri kullanıcılar için tasarlanmıştır; 16 yaşından küçükler Oyunu kullanmamalıdır. Oyun çocuklara yönelik değildir ve Google Play&apos;in Aileler programında yer almaz. Oyunda gösterilen reklamlar genel izleyiciye uygun (PG) içerikle sınırlıdır. Yaşınızı doğrulamıyoruz; yalnız Oyunun başında doğum yılınızı sorarız.</p>
      <List>
        <li><b>Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa:</b> size bir kez Oyunun 16 yaş ve üzeri için tasarlandığını belirten bir not gösterilir. Oyunda reklam gösterilmez; reklam bileşeni ve Google&apos;ın onay aracı hiç başlatılmaz, bu yüzden Google&apos;a reklam verisi gönderilmez. İpuçları reklam izlemeden verilir; satın alma seçeneği gösterilmez ve tüm tahta temaları açıktır.</li>
        <li><b>16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa:</b> reklamlar her zaman kişiselleştirilmeden gösterilir, Google&apos;a rıza yaşının altında olduğunuzu bildiren ayar gönderilir ve size ne bizim onay penceremiz ne de Google&apos;ın onay formu gösterilir. Bu durumda da Google, 4. bölümde yazan sınırlı bilgiyi reklamı göstermek, saymak ve sahtekârlığı önlemek için işler. Satın alma seçeneği gösterilmez ve tüm tahta temaları açıktır. Daha önce bu Google hesabıyla satın alma yapılmışsa hakkı yine uygulanır.</li>
      </List>
      <p>18 yaşın altındaki ve yaşı bilinmeyen kullanıcılarda Oyun, Google Play&apos;den satın alma seçeneği ya da fiyat bilgisi istemez; yalnız önceden satın alma olup olmadığını sorar. Bu sahiplik sorgusu 16 yaşın altındaki kullanıcılarda da Google Play&apos;e (Google hesabınızla) gider ve Google Play bileşeni kendi işleyiş ve teşhis verisini Google&apos;a gönderebilir; bu sorguda reklam verisi gönderilmez ve reklam hizmeti başlatılmaz.</p>
      <p>16 yaşından küçük bir çocuğun Oyunu kullandığını düşünüyorsanız {COMPANY.email} adresine yazın; cihazdaki verileri silmek için Oyunu kaldırmanız ya da verilerini temizlemeniz yeterlidir.</p>
      <H2>10. Haklarınız</H2>
      <p>KVKK md. 11 ve GDPR kapsamında bilgi isteme, düzeltme, silme, itiraz ve şikâyet haklarına sahipsiniz. Sizi tanıtan bir veri tutmadığımız için çoğu talebin en hızlı yolu Google&apos;dır: reklam kimliğinizi sıfırlayabilir, onay tercihinizi Oyundan değiştirebilir, <a href="https://myaccount.google.com" className={link}>Google hesabınızdan</a> başvurabilirsiniz. {COMPANY.email} adresine yazdığınız başvurular en geç 30 gün içinde yanıtlanır. Kişisel Verileri Koruma Kurulu&apos;na ya da AB&apos;de bulunduğunuz ülkenin veri koruma otoritesine şikâyette bulunabilirsiniz.</p>
      <H2>11. Değişiklikler</H2>
      <p>Oyun yeni bir veri toplamaya başlarsa bu politika o sürüm yayınlanmadan önce güncellenir ve tarih değişir.</p>
    </LegalPage>
  );
}
