import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// Kaynak: OstlerTech/hukuk/2026-11-09-oyunlar-yayin-paketi/vizviz/01-gizlilik-politikasi-tr.md (Zeynep, YAYIN METNİ; metin değiştirilmez). İngilizcesi /en/vizviz/privacy; biri değişirse diğeri de.
export const metadata: Metadata = {
  title: "Vızvız Gizlilik Politikası",
  description: "Vızvız: üyelik yok, skor cihazda; Google AdMob reklamları.",
  alternates: { canonical: "/vizviz/privacy", languages: { tr: "/vizviz/privacy", en: "/en/vizviz/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function VizvizPrivacyPage() {
  return (
    <LegalPage eyebrow={"Vızvız"} title="Vızvız Gizlilik Politikası" updated={false} altLink={{ href: "/en/vizviz/privacy", label: "English" }}>
      <div className="space-y-6 text-[1.0625rem] leading-relaxed">
      <p>Son güncelleme: 9 Kasım 2026</p>
      <p>Bu politika, Vızvız mobil oyununu (&quot;Oyun&quot;) kullandığınızda hangi verilerin işlendiğini anlatır. Vızvız, ekrana dokunarak sütunların arasından uçulan beceri oyunudur. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni, AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında da bilgilendirme niteliğindedir.</p>
      <H2>1. Veri sorumlusu</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (şahıs işletmesi). Adres: {COMPANY.address}. İletişim: {COMPANY.email}</p>
      <H2>2. Kısaca</H2>
      <List>
        <li>Oyunda üyelik yoktur. Adınızı, e-postanızı ya da telefonunuzu sormayız.</li>
        <li>En yüksek skorunuz ve topladığınız bal toplamı yalnız cihazınızda tutulur; bize gelmez.</li>
        <li>Oyunda başka oyuncularla bağlantı, sohbet ya da sıralama tablosu yoktur.</li>
        <li>Oyun reklam içerir. Reklamları Google AdMob gösterir: ekranın altında sabit bir reklam alanı (banner), isteğe bağlı ödüllü reklamlar ve bir oyun bittiğinde, &quot;Oyun bitti&quot; ekranı göründükten sonra kısa bir geri sayımla açılan tam ekran reklam. Oyun sürerken (uçarken) tam ekran reklam gösterilmez.</li>
        <li>Oyunda satın alma yoktur.</li>
        <li>Oyun 16 yaş ve üzeri için tasarlanmıştır. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam gösterilmez ve Google&apos;a reklam verisi gönderilmez. 18 yaşından küçüklere (ya da 18 yaşını doldurduğu kesin anlaşılmayanlara) yalnız kişiselleştirilmemiş reklam gösterilir. Diğer kullanıcılarda reklamlar yalnız izin verirseniz kişiselleştirilir; izninizi istediğiniz zaman geri alabilirsiniz.</li>
        <li>Kendi analitik aracımızı kullanmıyoruz ve Oyun bize ait bir sunucuya veri göndermez. Oyun reklamlar için internete bağlanır.</li>
      </List>
      <H2>3. Cihazınızda kalan veriler</H2>
      <p>En yüksek skorunuz ve topladığınız bal toplamı yalnız cihazınızda saklanır; bunları biz görmeyiz. Oyunu silerseniz ya da uygulama verilerini temizlerseniz bu veriler silinir. Android yedeklemesi açıksa Android oyun ilerlemenizi sizin Google hesabınızdaki yedeğe ve yeni cihaza aktarıma alabilir; yaş grubunuz, reklam tercihiniz ve Google&apos;ın onay aracının kaydı bu yedeğe ve aktarıma alınmaz. Bu yedeği Google yönetir, biz erişemeyiz.</p>
      <H2>4. Reklamlar (Google AdMob)</H2>
      <p>Oyundaki reklamları Google&apos;ın AdMob hizmeti gösterir:</p>
      <List>
        <li><b>Alt reklam alanı (banner):</b> ekranın en altında sabit bir alandır. Oyun alanı ve düğmeler bu alanın üstünde biter; reklam onları kapatmaz, üzerlerine binmez.</li>
        <li><b>Ödüllü reklam:</b> Oyun bittiğinde, o oyunda bir kez, &quot;Bir can daha (reklam izle)&quot; ile reklam izleyip kaldığınız yerden devam etmeyi siz seçersiniz. Reklam izlemek zorunlu değildir; reklam izlemeden de oynayabilirsiniz. Reklam o an hazır değilse kısa bir uyarı görürsünüz ve seçenek o an kullanılamaz.</li>
        <li><b>Tam ekran reklam:</b> yalnız bir oyun bittiğinde, &quot;Oyun bitti&quot; ekranı göründükten sonra, 3 saniyelik bir geri sayımla (&quot;Reklam 3, 2, 1&quot;) açılır. Geri sayım sırasında bir düğmeye ya da Geri tuşuna basarsanız veya Oyundan çıkarsanız o seferlik gösterilmez; bir düğmeye bastıktan sonra tam ekran reklam açılmaz. Bir oturumdaki ilk iki oyun sonunda gösterilmez; sonra en çok iki oyunda bir ve iki reklam (ödüllü reklamlar dahil) arasında en az 2 dakika olacak şekilde gösterilir. Oyun sürerken (uçarken) tam ekran reklam gösterilmez.</li>
      </List>
      <p>Reklam gösterebilmek, izlendiğini ölçebilmek ve sahtekârlığı önleyebilmek için Google Mobile Ads SDK cihazınızdan şu verileri toplar ve Google&apos;a gönderir:</p>
      <List>
        <li><b>Cihaz kimlikleri:</b> Android reklam kimliği ve app set ID (varsa cihazda oturum açılmış hesaba ait kimlikler).</li>
        <li><b>IP adresi:</b> cihazın yaklaşık konumunun (ülke, şehir düzeyi) tahmini için kullanılabilir.</li>
        <li><b>Etkileşim bilgileri:</b> uygulamanın açılması, dokunmalar, reklam videosunun izlenmesi.</li>
        <li><b>Teşhis bilgileri:</b> uygulamanın ve SDK&apos;nın performansı (açılış süresi, takılma oranı, enerji kullanımı gibi).</li>
      </List>
      <p>Bu veriler aktarım sırasında şifrelenir (TLS). Bu verileri biz almayız ve saklamayız; AdMob bize yalnız toplu reklam raporları (gösterim sayısı, gelir gibi) verir. Google bu verileri kendi sorumluluğunda ve kendi politikalarına göre işler: <a href="https://policies.google.com/privacy" className={link}>Google Gizlilik Politikası</a>, <a href="https://policies.google.com/technologies/partner-sites" className={link}>Google&apos;ın iş ortaklarından gelen verileri kullanımı</a>, <a href="https://policies.google.com/technologies/ads" className={link}>Google reklamları</a>.</p>
      <p><b>Onay ve kişiselleştirilmemiş reklam.</b> Oyunu ilk açtığınızda, bulunduğunuz ülke ne olursa olsun önce doğum yılınız sorulur; bu soru cevaplanmadan reklam bileşeni ve Google&apos;ın onay aracı çalışmaz ve reklam için hiçbir bağlantı kurulmaz. Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa reklam bileşeni hiç başlatılmaz (ayrıntı 9. bölümde). 16 yaş ve üzerindeyseniz Google&apos;ın onay aracı, bulunduğunuz yerde onay gerekip gerekmediğini öğrenmek için Google&apos;a bağlanır. 16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa reklamlar her zaman kişiselleştirilmeden gösterilir ve size onay sorulmaz. 18 yaşını doldurduysanız: Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formu, Türkiye dahil diğer ülkelerde kendi onay penceremiz gösterilir; kişiselleştirilmiş reklama izin verirseniz Google reklamları ilgi alanınıza göre seçer, izin vermezseniz reklamlar kişiselleştirilmeden gösterilir. Bu adımlar tamamlanmadan reklam isteği yapılmaz. Kişiselleştirilmemiş reklamda da Google reklamı göstermek, saymak ve sahtekârlığı önlemek için sınırlı bilgi işler. ABD&apos;nin bazı eyaletlerinde ayrıca Google&apos;ın gizlilik seçenekleri sunulur; kişisel bilgilerinizin reklam için satılmasını veya paylaşılmasını oradan reddedebilirsiniz (Oyunda &quot;Google gizlilik seçenekleri (ABD)&quot; düğmesi). Tercihinizi Oyunda ana ekrandaki dişli düğmesi (Ayarlar) &gt; <b>Reklam gizlilik seçenekleri</b> bölümünden değiştirebilirsiniz; bu bölüm, bulunduğunuz yere göre Google&apos;ın formunu ya da kendi onay penceremizi açar, 16 yaşından küçük olabileceği anlaşılan kullanıcılara ise reklam gösterilmediğini söyler. İzninizi verdiğiniz kadar kolay geri alabilirsiniz. Reklam kimliğinizi Android ayarlarından sıfırlayabilir veya silebilirsiniz.</p>
      <p><b>Tercihiniz nerede saklanır.</b> Onay penceresindeki seçiminiz, seçim tarihi ve gördüğünüz metnin sürümü yalnız cihazınızda saklanır; bize gönderilmez. Doğum yılınız cihazınızdan çıkmaz ve saklanmaz; yalnız yaş grubunuz (16 altı, 16-17, 18 ve üzeri) cihazda tutulur. 16-17 grubundaysanız bu gruptan türeyen &quot;rıza yaşının altında&quot; işareti reklam istekleriyle Google&apos;a gider (9. bölüm). Bu kayıtlar Android yedeğine ve yeni cihaza aktarıma alınmaz. Oyunu silerseniz ya da verilerini temizlerseniz bu sorular yeniden sorulur.</p>
      <H2>5. Satın almalar</H2>
      <p>Oyunda uygulama içi satın alma yoktur; Oyun Google Play ödeme bileşenini kullanmaz ve sizden ödeme bilgisi almaz.</p>
      <H2>6. İşleme amaçları ve hukuki sebepler</H2>
      <List>
        <li><b>Cihazdaki oyun verileri:</b> Oyunun çalışması; bize aktarılmaz.</li>
        <li><b>AdMob&apos;un topladığı veriler:</b> reklam gösterme ve ölçme, sahtekârlık önleme. Kişiselleştirilmiş reklam için açık rızanız (KVKK md. 5/1, GDPR md. 6/1-a): AEA, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formuyla, diğer ülkelerde Oyundaki onay penceremizle alınır ve istediğiniz zaman geri alınabilir. Kişiselleştirilmemiş reklam ve sahtekârlık önleme için meşru menfaat (KVKK md. 5/2-f, GDPR md. 6/1-f). Rızanızı geri almanız, geri almadan önceki işlemeyi etkilemez.</li>
        <li><b>Destek e-postaları:</b> sorunuza yanıt vermek; KVKK md. 5/2-c ve 5/2-f.</li>
      </List>
      <H2>7. Yurt dışına aktarım</H2>
      <p>AdMob verileri, Oyundaki reklam bileşeni aracılığıyla cihazınızdan doğrudan Google LLC ve bağlı şirketlerine gönderilir ve Türkiye dışındaki (ABD dahil) sunucularda işlenir. Google bu veriler için kendi veri koruma şartlarına göre veri sorumlusu olarak hareket eder. Google&apos;ın şartları Avrupa Birliği&apos;ndeki kullanıcılar için AB Standart Sözleşme Maddelerine ve Veri Gizliliği Çerçevesine dayanır; Türkiye&apos;den yapılan aktarımlar için Kişisel Verileri Koruma Kurulu&apos;nun ilan ettiği standart sözleşmeye yer vermez. Kişiselleştirilmiş reklama izin vermezseniz Google&apos;a giden reklam verileri reklamı göstermek, saymak ve sahtekârlığı önlemek için gereken sınırlı bilgiyle kalır.</p>
      <H2>8. Saklama süreleri</H2>
      <List>
        <li>Cihazdaki oyun verileri: Oyunu silene ya da verileri temizleyene kadar.</li>
        <li>AdMob verileri: <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;ın saklama politikasına</a> göre.</li>
        <li>Destek e-postaları: talep kapandıktan sonra 1 yıl.</li>
      </List>
      <H2>9. Çocuklar</H2>
      <p>Oyun 16 yaş ve üzeri kullanıcılar için tasarlanmıştır; 16 yaşından küçükler Oyunu kullanmamalıdır. Oyun çocuklara yönelik değildir ve Google Play&apos;in Aileler programında yer almaz. Oyunda gösterilen reklamlar genel izleyiciye uygun (PG) içerikle sınırlıdır. Yaşınızı doğrulamıyoruz; yalnız Oyunun başında doğum yılınızı sorarız.</p>
      <List>
        <li><b>Doğum yılınızdan 16 yaşından küçük olabileceğiniz anlaşılırsa:</b> size bir kez Oyunun 16 yaş ve üzeri için tasarlandığını belirten bir not gösterilir. Oyunda reklam gösterilmez; reklam bileşeni ve Google&apos;ın onay aracı hiç başlatılmaz, bu yüzden Google&apos;a reklam verisi gönderilmez. Ödüllü reklamla verilen bir can daha size reklam izlemeden verilir.</li>
        <li><b>16-17 yaşındaysanız ya da doğum yılınızdan 18 yaşını doldurduğunuz kesin anlaşılmıyorsa:</b> reklamlar her zaman kişiselleştirilmeden gösterilir; Google&apos;a, reklam isteklerinde ve onay aracının sorgusunda rıza yaşının altında olduğunuzu ve genç kullanıcılara uygun reklam işlemi istendiğini bildiren ayar gönderilir; size ne bizim onay penceremiz ne de Google&apos;ın onay formu gösterilir. Bu durumda da Google, 4. bölümde yazan sınırlı bilgiyi reklamı göstermek, saymak ve sahtekârlığı önlemek için işler.</li>
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
