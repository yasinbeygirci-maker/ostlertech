import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// Kaynak: OstlerTech/hukuk/2026-11-09-oyunlar-yayin-paketi/gemiza/01-gizlilik-politikasi-tr.md (Zeynep, YAYIN METNİ; metin değiştirilmez). İngilizcesi /en/gemiza/privacy; biri değişirse diğeri de.
export const metadata: Metadata = {
  title: "Gemiza Gizlilik Politikası",
  description: "Gemiza sayı birleştirme oyunu: üyelik yok, oyun cihazda, Google AdMob reklamları ve Google Play üzerinden isteğe bağlı \"Reklamları kaldır\" satın alımı.",
  alternates: { canonical: "/gemiza/privacy", languages: { tr: "/gemiza/privacy", en: "/en/gemiza/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function GemizaPrivacyPage() {
  return (
    <LegalPage eyebrow={<span lang="en">Gemiza</span>} title="Gemiza Gizlilik Politikası" updated={false} altLink={{ href: "/en/gemiza/privacy", label: "English" }}>
      <div className="space-y-6 text-[1.0625rem] leading-relaxed">
      <p>Son güncelleme: 9 Kasım 2026</p>
      <p>Bu politika, Gemiza mobil oyununu (&quot;Oyun&quot;) kullandığınızda hangi verilerin işlendiğini anlatır. Gemiza, karoları kaydırıp birleştirdiğiniz sayı birleştirme oyunudur. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni, AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında da bilgilendirme niteliğindedir.</p>
      <H2>1. Veri sorumlusu</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (şahıs işletmesi). Adres: {COMPANY.address}. İletişim: {COMPANY.email}</p>
      <H2>2. Kısaca</H2>
      <List>
        <li>Oyunda üyelik yoktur. Adınızı, e-postanızı ya da telefonunuzu sormayız.</li>
        <li>Süren oyununuz (tahta, puan, kalan güçlendirici hakları), rekor puanınız, ulaştığınız en yüksek karo ve &quot;Reklamları kaldır&quot; satın alımının cihazdaki kopyası yalnız cihazınızda tutulur; bize gelmez.</li>
        <li>Oyunda başka oyuncularla bağlantı, sohbet ya da sıralama tablosu yoktur.</li>
        <li>Oyun reklam içerir. Reklamları Google AdMob gösterir: ekranın altında sabit bir reklam alanı (banner), isteğe bağlı ödüllü reklamlar ve bir oyun bittiğinde, sonuç paneli göründükten sonra kısa bir geri sayımla açılan tam ekran reklam. Oyun sürerken, hedef karoya ulaştığınızda ya da karolar birleşirken tam ekran reklam gösterilmez.</li>
        <li>Tek seferlik &quot;Reklamları kaldır&quot; satın alımı Google Play üzerinden yapılır; banner ve oyun sonu tam ekran reklamlarını kaldırır, ödüllü reklamlar isteğe bağlı olarak kalır. Ödeme bilgileriniz bize gelmez.</li>
        <li>Oyun 16 yaş ve üzeri için tasarlanmıştır. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam gösterilmez ve Google&apos;a reklam verisi gönderilmez. 18 yaşından küçüklere (ya da 18 yaşını doldurduğu kesin anlaşılmayanlara) yalnız kişiselleştirilmemiş reklam gösterilir. Diğer kullanıcılarda reklamlar yalnız izin verirseniz kişiselleştirilir; izninizi istediğiniz zaman geri alabilirsiniz.</li>
        <li>Kendi analitik aracımızı kullanmıyoruz ve Oyun bize ait bir sunucuya veri göndermez. Oyun reklamlar ve satın alma için internete bağlanır.</li>
      </List>
      <H2>3. Cihazınızda kalan veriler</H2>
      <p>Süren oyununuz (tahta, puan, kalan güçlendirici hakları), rekor puanınız, ulaştığınız en yüksek karo ve &quot;Reklamları kaldır&quot; satın alımının cihazdaki kopyası yalnız cihazınızda saklanır; bunları biz görmeyiz. Oyunu silerseniz ya da uygulama verilerini temizlerseniz bu veriler silinir. Android yedeklemesi açıksa Android oyun ilerlemenizi sizin Google hesabınızdaki yedeğe ve yeni cihaza aktarıma alabilir; yaş grubunuz, reklam tercihiniz ve Google&apos;ın onay aracının kaydı bu yedeğe ve aktarıma alınmaz; &quot;Reklamları kaldır&quot; satın alımının durumu da yedeğe alınmaz, Google Play&apos;den geri yüklenir (5. bölüm). Bu yedeği Google yönetir, biz erişemeyiz.</p>
      <H2>4. Reklamlar (Google AdMob)</H2>
      <p>Oyundaki reklamları Google&apos;ın AdMob hizmeti gösterir:</p>
      <List>
        <li><b>Alt reklam alanı (banner):</b> ekranın en altında sabit bir alandır. Oyun alanı ve düğmeler bu alanın üstünde biter; reklam onları kapatmaz, üzerlerine binmez. &quot;Reklamları kaldır&quot; satın alındığında kalkar.</li>
        <li><b>Ödüllü reklam:</b> Oyun sürerken son hamleyi geri almak, bir karoyu kırmak (çekiç) ve karoları karıştırmak için (düğmede &quot;Reklam&quot; yazar), oyun bitince de bir kez devam etmek ya da son hamleyi geri almak için (&quot;Reklam izle: devam et / geri al&quot;) reklam izlemeyi siz seçersiniz. Reklam izlemek zorunlu değildir; reklam izlemeden de oynayabilirsiniz. Reklam o an hazır değilse kısa bir uyarı görürsünüz ve seçenek o an kullanılamaz. Ödüllü reklamlar &quot;Reklamları kaldır&quot; satın alındıktan sonra da isteğe bağlı olarak kalır.</li>
        <li><b>Tam ekran reklam:</b> yalnız bir oyun bittiğinde, sonuç paneli göründükten sonra, 3 saniyelik bir geri sayımla (&quot;Reklam 3, 2, 1&quot;) açılır. Geri sayım sırasında bir düğmeye ya da Geri tuşuna basarsanız veya Oyundan çıkarsanız o seferlik gösterilmez; bir düğmeye bastıktan sonra tam ekran reklam açılmaz. Bir oturumdaki ilk iki oyun sonunda gösterilmez; sonra en çok iki oyunda bir ve iki reklam (ödüllü reklamlar dahil) arasında en az 2 dakika olacak şekilde gösterilir. Oyun sürerken, hedef karoya ulaştığınızda ya da karolar birleşirken tam ekran reklam gösterilmez. &quot;Reklamları kaldır&quot; satın alındığında hiç gösterilmez.</li>
      </List>
      <p>Reklam gösterebilmek, izlendiğini ölçebilmek ve sahtekârlığı önleyebilmek için Google Mobile Ads SDK cihazınızdan şu verileri toplar ve Google&apos;a gönderir:</p>
      <List>
        <li><b>Cihaz kimlikleri:</b> Android reklam kimliği ve app set ID (varsa cihazda oturum açılmış hesaba ait kimlikler).</li>
        <li><b>IP adresi:</b> cihazın yaklaşık konumunun (ülke, şehir düzeyi) tahmini için kullanılabilir.</li>
        <li><b>Etkileşim bilgileri:</b> uygulamanın açılması, dokunmalar, reklam videosunun izlenmesi.</li>
        <li><b>Teşhis bilgileri:</b> uygulamanın ve SDK&apos;nın performansı (açılış süresi, takılma oranı, enerji kullanımı gibi).</li>
      </List>
      <p>Bu veriler aktarım sırasında şifrelenir (TLS). Bu verileri biz almayız ve saklamayız; AdMob bize yalnız toplu reklam raporları (gösterim sayısı, gelir gibi) verir. Google bu verileri kendi sorumluluğunda ve kendi politikalarına göre işler: <a href="https://policies.google.com/privacy" className={link}>Google Gizlilik Politikası</a>, <a href="https://policies.google.com/technologies/partner-sites" className={link}>Google&apos;ın iş ortaklarından gelen verileri kullanımı</a>, <a href="https://policies.google.com/technologies/ads" className={link}>Google reklamları</a>.</p>
      <p><b>Onay ve kişiselleştirilmemiş reklam.</b> Oyunu ilk açtığınızda, bulunduğunuz ülke ne olursa olsun önce doğum yılınız sorulur; bu soru cevaplanmadan reklam bileşeni ve Google&apos;ın onay aracı çalışmaz ve reklam için hiçbir bağlantı kurulmaz. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam bileşeni hiç başlatılmaz (ayrıntı 9. bölümde). 16 yaş ve üzerindeyseniz Google&apos;ın onay aracı, bulunduğunuz yerde onay gerekip gerekmediğini öğrenmek için Google&apos;a bağlanır. 16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa reklamlar her zaman kişiselleştirilmeden gösterilir ve size onay sorulmaz. 18 yaşını doldurduysanız: Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formu, Türkiye dahil diğer ülkelerde kendi onay penceremiz gösterilir; kişiselleştirilmiş reklama izin verirseniz Google reklamları ilgi alanınıza göre seçer, izin vermezseniz reklamlar kişiselleştirilmeden gösterilir. Bu adımlar tamamlanmadan reklam isteği yapılmaz. Kişiselleştirilmemiş reklamda da Google reklamı göstermek, saymak ve sahtekârlığı önlemek için sınırlı bilgi işler. ABD&apos;nin bazı eyaletlerinde ayrıca Google&apos;ın gizlilik seçenekleri sunulur; kişisel bilgilerinizin reklam için satılmasını veya paylaşılmasını oradan reddedebilirsiniz (Oyunda &quot;Google gizlilik seçenekleri (ABD)&quot; düğmesi). Tercihinizi Oyunda ana menüdeki dişli düğmesi (Ayarlar) &gt; <b>Reklam gizlilik seçenekleri</b> bölümünden değiştirebilirsiniz; bu bölüm, bulunduğunuz yere göre Google&apos;ın formunu ya da kendi onay penceremizi açar, 16 yaşından küçük olabileceği anlaşılan kullanıcılara ise reklam gösterilmediğini söyler. İzninizi verdiğiniz kadar kolay geri alabilirsiniz. Reklam kimliğinizi Android ayarlarından sıfırlayabilir veya silebilirsiniz.</p>
      <p><b>&quot;Reklamları kaldır&quot; satın aldıysanız.</b> Banner ve tam ekran reklam gösterilmez. Reklam bileşeni yalnız siz ilk kez bir ödüllü reklam istediğinizde başlatılır; Google&apos;ın onay aracı da ancak o zaman Google&apos;a bağlanır, o zamana kadar Google&apos;a reklam verisi gönderilmez. Ödüllü reklam istediğinizde yukarıdaki veriler Google&apos;a gönderilir.</p>
      <p><b>Tercihiniz nerede saklanır.</b> Onay penceresindeki seçiminiz, seçim tarihi ve gördüğünüz metnin sürümü yalnız cihazınızda saklanır; bize gönderilmez. Doğum yılınız cihazınızdan çıkmaz ve saklanmaz; yalnız yaş grubunuz (16 altı, 16-17, 18 ve üzeri) cihazda tutulur. 16-17 grubundaysanız bu gruptan türeyen &quot;rıza yaşının altında&quot; işareti reklam istekleriyle Google&apos;a gider (9. bölüm). Bu kayıtlar Android yedeğine ve yeni cihaza aktarıma alınmaz. Oyunu silerseniz ya da verilerini temizlerseniz bu sorular yeniden sorulur.</p>
      <H2>5. Satın almalar (Google Play)</H2>
      <List>
        <li>&quot;Reklamları kaldır&quot; tek seferlik bir satın almadır, abonelik değildir; yenilenmez ve tekrar ücret alınmaz. Satın alındığında banner ve oyun sonu tam ekran reklamları kalkar; ödüllü reklamlar isteğe bağlı olarak kalır.</li>
        <li>Satın alma Google Play faturalandırma sistemiyle yapılır. Fiyatı, ödeme yöntemini ve vergileri Google Play ödeme ekranında gösterir. Ödeme bilgileriniz ve satın alma kaydınız Google tarafından, Google Play koşullarına göre işlenir; adınız, e-postanız ya da ödeme bilginiz bize gelmez.</li>
        <li>Google Play&apos;in satın alma bileşeni yalnız doğum yılınızdan 16 yaş ve üzeri olduğunuz anlaşıldıktan sonra başlatılır. Oyun satın almayı yalnız cihazınızda Google Play&apos;e sorarak doğrular; bunun için bize ait bir sunucu kullanılmaz.</li>
        <li>Ödemeniz beklemedeyse (örneğin nakit ya da kodla ödeme), ödeme tamamlanana kadar reklamlar kalkmaz.</li>
        <li>Aynı Google hesabıyla başka bir cihazda ya da Oyunu yeniden yükledikten sonra satın alımınızı &quot;Satın alımı geri yükle&quot; ile geri alabilirsiniz.</li>
        <li><b>İade:</b> İade talepleri Google Play&apos;in iade kurallarına göre değerlendirilir. Google Play&apos;e göre satın almadan sonraki 48 saat içinde iadeyi Google Play&apos;den isteyebilirsiniz; 48 saatten sonra bize {COMPANY.email} adresinden sipariş numaranızla yazabilirsiniz, talebinizi Google Play kurallarına ve yürürlükteki mevzuata göre değerlendiririz. Satın alma iade edilir ya da Google Play satın almayı artık göstermezse banner ve oyun sonu reklamları yeniden gösterilir.</li>
        <li>16 yaşından küçük olabileceği anlaşılan kullanıcılara reklam gösterilmediği için &quot;Reklamları kaldır&quot; seçeneği de gösterilmez.</li>
      </List>
      <H2>6. İşleme amaçları ve hukuki sebepler</H2>
      <List>
        <li><b>Cihazdaki oyun verileri:</b> Oyunun çalışması; bize aktarılmaz.</li>
        <li><b>AdMob&apos;un topladığı veriler:</b> reklam gösterme ve ölçme, sahtekârlık önleme. Kişiselleştirilmiş reklam için açık rızanız (KVKK md. 5/1, GDPR md. 6/1-a): AEA, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formuyla, diğer ülkelerde Oyundaki onay penceremizle alınır ve istediğiniz zaman geri alınabilir. Kişiselleştirilmemiş reklam ve sahtekârlık önleme için meşru menfaat (KVKK md. 5/2-f, GDPR md. 6/1-f). Rızanızı geri almanız, geri almadan önceki işlemeyi etkilemez.</li>
        <li><b>Satın alma:</b> ödeme ve satın alma kaydını Google Play kendi sorumluluğunda işler. Oyun yalnız cihazda satın almanın var olup olmadığını okur ve reklamları kaldırır; bu bilgi bize aktarılmaz.</li>
        <li><b>Destek ve iade e-postaları:</b> sorunuza ya da iade talebinize yanıt vermek; KVKK md. 5/2-c ve 5/2-f.</li>
      </List>
      <H2>7. Yurt dışına aktarım</H2>
      <p>AdMob ve Google Play verileri, Oyundaki reklam ve satın alma bileşenleri aracılığıyla cihazınızdan doğrudan Google LLC ve bağlı şirketlerine gönderilir ve Türkiye dışındaki (ABD dahil) sunucularda işlenir. Google bu veriler için kendi veri koruma şartlarına göre veri sorumlusu olarak hareket eder. Google&apos;ın şartları Avrupa Birliği&apos;ndeki kullanıcılar için AB Standart Sözleşme Maddelerine ve Veri Gizliliği Çerçevesine dayanır; Türkiye&apos;den yapılan aktarımlar için Kişisel Verileri Koruma Kurulu&apos;nun ilan ettiği standart sözleşmeye yer vermez. Kişiselleştirilmiş reklama izin vermezseniz Google&apos;a giden reklam verileri reklamı göstermek, saymak ve sahtekârlığı önlemek için gereken sınırlı bilgiyle kalır.</p>
      <H2>8. Saklama süreleri</H2>
      <List>
        <li>Cihazdaki oyun verileri: Oyunu silene ya da verileri temizleyene kadar.</li>
        <li>AdMob verileri: <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;ın saklama politikasına</a> göre.</li>
        <li>Satın alma kaydı: Google Play&apos;in koşullarına göre (Google hesabınızın sipariş geçmişinde görünür).</li>
        <li>Destek ve iade e-postaları: talep kapandıktan sonra 1 yıl.</li>
      </List>
      <H2>9. Çocuklar</H2>
      <p>Oyun 16 yaş ve üzeri kullanıcılar için tasarlanmıştır; 16 yaşından küçükler Oyunu kullanmamalıdır. Oyun çocuklara yönelik değildir ve Google Play&apos;in Aileler programında yer almaz. Oyunda gösterilen reklamlar genel izleyiciye uygun (PG) içerikle sınırlıdır. Yaşınızı doğrulamıyoruz; yalnız Oyunun başında doğum yılınızı sorarız.</p>
      <List>
        <li><b>Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa:</b> size bir kez Oyunun 16 yaş ve üzeri için tasarlandığını belirten bir not gösterilir. Oyunda reklam gösterilmez; reklam bileşeni ve Google&apos;ın onay aracı hiç başlatılmaz, bu yüzden Google&apos;a reklam verisi gönderilmez. Ödüllü reklamla verilen geri alma, çekiç, karıştırma ve devam size reklam izlemeden verilir; &quot;Reklamları kaldır&quot; seçeneği gösterilmez ve Google Play&apos;in satın alma bileşeni başlatılmaz.</li>
        <li><b>16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa:</b> reklamlar her zaman kişiselleştirilmeden gösterilir; Google&apos;a, reklam isteklerinde ve onay aracının sorgusunda rıza yaşının altında olduğunuzu ve genç kullanıcılara uygun reklam işlemi istendiğini bildiren ayar gönderilir; size ne bizim onay penceremiz ne de Google&apos;ın onay formu gösterilir. Bu durumda da Google, 4. bölümde yazan sınırlı bilgiyi reklamı göstermek, saymak ve sahtekârlığı önlemek için işler. Google Play&apos;deki satın almalar, Google hesabınızın ve Google Play&apos;in yaş ve ebeveyn onayı ayarlarına tabidir.</li>
      </List>
      <p>16 yaşından küçük bir çocuğun Oyunu kullandığını düşünüyorsanız {COMPANY.email} adresine yazın; cihazdaki verileri silmek için Oyunu kaldırmanız ya da verilerini temizlemeniz yeterlidir.</p>
      <H2>10. Haklarınız</H2>
      <p>KVKK md. 11 ve GDPR kapsamında bilgi isteme, düzeltme, silme, itiraz ve şikâyet haklarına sahipsiniz. Sizi tanıtan bir veri tutmadığımız için çoğu talebin en hızlı yolu Google&apos;dır: reklam kimliğinizi sıfırlayabilir, onay tercihinizi Oyundan değiştirebilir, <a href="https://myaccount.google.com" className={link}>Google hesabınızdan</a> başvurabilirsiniz. {COMPANY.email} adresine yazdığınız başvurular en geç 30 gün içinde yanıtlanır. Kişisel Verileri Koruma Kurulu&apos;na ya da AB&apos;de bulunduğunuz ülkenin veri koruma otoritesine şikâyette bulunabilirsiniz.</p>
      <H2>11. Değişiklikler</H2>
      <p>Oyun yeni bir veri toplamaya başlarsa bu politika o sürüm yayınlanmadan önce güncellenir ve tarih değişir.</p>
      </div>
    </LegalPage>
  );
}
