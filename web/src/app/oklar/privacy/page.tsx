import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// Kaynak: OstlerTech/hukuk/oklar-gizlilik-politikasi.md (Zeynep taslağı). İngilizcesi /en/oklar/privacy; biri değişirse diğeri de.
export const metadata: Metadata = {
  title: "Oklar Gizlilik Politikası",
  description: "Oklar ok bulmaca oyunu: hesap yok, ilerleme cihazda, isteğe bağlı ödüllü reklam (Google AdMob).",
  alternates: { canonical: "/oklar/privacy", languages: { tr: "/oklar/privacy", en: "/en/oklar/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function OklarPrivacyPage() {
  return (
    <LegalPage eyebrow="Oklar" title="Oklar Gizlilik Politikası" updated={false} altLink={{ href: "/en/oklar/privacy", label: "English" }}>
      <p>Son güncelleme: 18 Ekim 2026</p>
      <p>
        Bu politika, Oklar mobil oyununu (&quot;Oyun&quot;) kullandığınızda hangi verilerin işlendiğini anlatır. 6698 sayılı
        Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni, AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında
        da bilgilendirme niteliğindedir.
      </p>

      <H2>1. Veri sorumlusu</H2>
      <p>
        {COMPANY.legalName} – {COMPANY.tradeName} (şahıs işletmesi). Adres: {COMPANY.address}. İletişim: {COMPANY.email}
      </p>

      <H2>2. Kısaca</H2>
      <List>
        <li>Oyunda hesap yoktur. Adınızı, e-postanızı ya da telefonunuzu sormayız.</li>
        <li>Oyun ilerlemeniz yalnız cihazınızda tutulur; bize gelmez.</li>
        <li>Oyunda isteğe bağlı ödüllü reklam vardır: ipucu ya da ek can için reklam izlemeyi siz seçersiniz. Reklamları Google AdMob gösterir.</li>
        <li>Reklamlar yalnız izin verirseniz kişiselleştirilir; 18 yaşından küçüklere her zaman kişiselleştirilmemiş reklam gösterilir. İzninizi istediğiniz zaman geri alabilirsiniz.</li>
        <li>Tek seferlik &quot;Reklamsız paket&quot; satın alma Google Play üzerinden yapılır; ödeme bilgileriniz bize gelmez.</li>
        <li>Analitik ya da izleme aracı kullanmıyoruz.</li>
      </List>

      <H2>3. Cihazınızda kalan veriler</H2>
      <p>
        Açtığınız bölümler ve ilerlemeniz yalnız cihazınızda saklanır; bunları biz görmeyiz. Oyunu silerseniz ya da uygulama
        verilerini temizlerseniz silinir. Android yedeklemesi açıksa Android bu verileri sizin Google hesabınızdaki yedeğe
        alabilir; bu yedeği Google yönetir, biz erişemeyiz.
      </p>

      <H2>4. Reklamlar (Google AdMob)</H2>
      <p>
        Ödüllü reklamları Google&apos;ın AdMob hizmeti gösterir. Reklam gösterebilmek, izlendiğini ölçebilmek ve sahtekârlığı
        önleyebilmek için Google Mobile Ads SDK cihazınızdan şu verileri toplar ve Google&apos;a gönderir:
      </p>
      <List>
        <li><b>Cihaz kimlikleri:</b> Android reklam kimliği ve app set ID (varsa cihazda oturum açılmış hesaba ait kimlikler).</li>
        <li><b>IP adresi:</b> yaklaşık konumun (ülke, şehir düzeyi) tahmini için kullanılabilir.</li>
        <li><b>Etkileşim bilgileri:</b> uygulamanın açılması, dokunmalar, reklamın izlenmesi.</li>
        <li><b>Teşhis bilgileri:</b> uygulamanın ve SDK&apos;nın performansı.</li>
      </List>
      <p>
        Bu veriler aktarım sırasında şifrelenir (TLS). Bu verileri biz almayız ve saklamayız; AdMob bize yalnız toplu reklam
        raporları (gösterim sayısı, gelir) verir. Google bu verileri kendi politikalarına göre işler:{" "}
        <a href="https://policies.google.com/privacy" className={link}>Google Gizlilik Politikası</a>,{" "}
        <a href="https://policies.google.com/technologies/partner-sites" className={link}>Google&apos;ın iş ortaklarından gelen verileri kullanımı</a>,{" "}
        <a href="https://policies.google.com/technologies/ads" className={link}>Google reklamları</a>.
      </p>
      <p>
        <b>Onay ve kişiselleştirilmemiş reklam.</b> Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre&apos;de oyunu ilk
        açtığınızda Google&apos;ın onay formu gösterilir ve onay alınmadan reklam isteği yapılmaz. Türkiye dahil diğer ülkelerde
        oyunu ilk açtığınızda önce doğum yılınız sorulur, ardından kendi onay penceremiz gösterilir: kişiselleştirilmiş reklama
        izin verirseniz Google reklamları ilgi alanınıza göre seçer; izin vermezseniz ya da 18 yaşından küçükseniz reklamlar
        kişiselleştirilmeden gösterilir. Bu adımlar tamamlanmadan reklam isteği yapılmaz. Kişiselleştirilmemiş reklamda da
        Google reklamı göstermek, saymak ve sahtekârlığı önlemek için sınırlı bilgi işler. ABD&apos;nin bazı eyaletlerinde ayrıca
        Google&apos;ın gizlilik seçenekleri sunulur; kişisel bilgilerinizin reklam için satılmasını veya paylaşılmasını oradan
        reddedebilirsiniz (oyunda &quot;Google gizlilik seçenekleri (ABD)&quot; bağlantısı). Tercihinizi oyunda{" "}
        <b>Ayarlar &gt; Hakkında &gt; Gizlilik seçenekleri</b> bölümünden değiştirebilirsiniz (bu bölüm, bulunduğunuz yere göre
        Google&apos;ın formunu ya da kendi onay penceremizi açar; izninizi verdiğiniz kadar kolay geri alabilirsiniz). Reklam
        kimliğinizi Android ayarlarından sıfırlayabilir veya silebilirsiniz. Reklam izlemek zorunlu değildir; &quot;Reklamsız
        paket&quot; satın alındığında oyun reklam sistemini hiç başlatmaz.
      </p>
      <p>
        <b>Tercihiniz nerede saklanır.</b> Onay penceresindeki seçiminiz, seçim tarihi ve gördüğünüz metnin sürümü yalnız
        cihazınızda saklanır; bize gönderilmez. Doğum yılı sorusuna verdiğiniz cevaptan yalnız 18 yaş üstü olup olmadığınız
        cihazda tutulur. Bu kayıt Android yedeğine ve yeni cihaza aktarıma alınmaz. Oyunu silerseniz ya da verilerini
        temizlerseniz pencere yeniden gösterilir.
      </p>

      <H2>5. Satın almalar (Google Play)</H2>
      <p>
        &quot;Reklamsız paket&quot; satın alma Google Play faturalandırma sistemiyle yapılır. Ödeme bilgileriniz ve satın alma kaydınız
        Google tarafından işlenir. Oyun satın almayı yalnız cihazınızda Google Play üzerinden doğrular; adınız ya da ödeme
        bilginiz bize gelmez. İadeler Google Play&apos;in iade kurallarına tabidir.
      </p>

      <H2>6. İşleme amaçları ve hukuki sebepler</H2>
      <List>
        <li><b>Cihazdaki ilerleme:</b> oyunun çalışması; bize aktarılmaz.</li>
        <li><b>AdMob&apos;un topladığı veriler:</b> reklam gösterme ve ölçme, sahtekârlık önleme. Kişiselleştirilmiş reklam için açık rızanız (KVKK md. 5/1, GDPR md. 6/1-a): AEA, Birleşik Krallık ve İsviçre&apos;de Google&apos;ın onay formuyla, diğer ülkelerde oyundaki onay penceremizle alınır ve istediğiniz zaman geri alınabilir. Kişiselleştirilmemiş reklam ve sahtekârlık önleme için meşru menfaat (KVKK md. 5/2-f, GDPR md. 6/1-f). Rızanızı geri almanız, geri almadan önceki işlemeyi etkilemez.</li>
        <li><b>Destek e-postaları:</b> sorunuza yanıt vermek; KVKK md. 5/2-c ve 5/2-f.</li>
      </List>

      <H2>7. Yurt dışına aktarım</H2>
      <p>
        AdMob ve Google Play verileri Google LLC ve bağlı şirketlerinin Türkiye dışındaki (ABD dahil) sunucularında işlenir.
        Bu aktarım KVKK md. 9 kapsamında yapılır; AB&apos;deki kullanıcılar için Google, AB Standart Sözleşme Maddelerine ve Veri
        Gizliliği Çerçevesine dayanır.
      </p>

      <H2>8. Saklama süreleri</H2>
      <List>
        <li>Cihazdaki ilerleme: oyunu silene ya da verileri temizleyene kadar.</li>
        <li>AdMob verileri: <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;ın saklama politikasına</a> göre.</li>
        <li>Destek e-postaları: talep kapandıktan sonra 1 yıl.</li>
      </List>

      <H2>9. Çocuklar</H2>
      <p>
        Oyun 13 yaş ve üzeri kullanıcılar için tasarlanmıştır; çocuklara yönelik değildir. Bilerek 13 yaşından küçük
        çocuklardan kişisel veri toplamayız ve reklamlarda içerik sınırı (PG) uygularız. 18 yaşından küçük kullanıcılara
        kişiselleştirilmiş reklam gösterilmez; onay penceremiz onlara hiç sorulmaz. Doğum yılınızdan 18 yaşını doldurduğunuz
        kesin anlaşılmıyorsa da böyle davranılır. 13 yaşından küçük bir çocuğun oyunu
        kullandığını düşünüyorsanız {COMPANY.email} adresine yazın.
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
