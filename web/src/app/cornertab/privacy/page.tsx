import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { CORNERTAB } from "@/lib/cornertab";

// Kaynak: OstlerTech/hukuk/2026-10-26-cornertab-gizlilik-son.md (Zeynep). İngilizcesi /en/cornertab/privacy; biri değişirse diğeri de.
const N = CORNERTAB.name;

export const metadata: Metadata = {
  title: `${N} Gizlilik Politikası`,
  description: `${N} veresiye defteri: hesap yok, defter telefonda şifreli, reklam ve analitik yok; Pro satın alma Google Play ile.`,
  alternates: { canonical: CORNERTAB.path, languages: { tr: CORNERTAB.path, en: CORNERTAB.enPath } },
};

const link = "text-primary hover:text-primary-light";

export default function CornerTabPrivacyPage() {
  return (
    <LegalPage eyebrow={N} title={`${N} Gizlilik Politikası`} updatedOn={CORNERTAB.updatedTr} altLink={{ href: CORNERTAB.enPath, label: "English" }}>
      <p>
        Bu politika, {N} mobil uygulamasını (“Uygulama”) kullandığınızda hangi verilerin nerede işlendiğini anlatır. 6698 sayılı
        Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni, AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında da
        bilgilendirme niteliğindedir.
      </p>

      <H2>1. Biz kimiz, hangi verinin sorumlusuyuz</H2>
      <p>
        Uygulamayı {COMPANY.legalName} – {COMPANY.tradeName} (şahıs işletmesi) geliştirir. Adres: {COMPANY.address}. İletişim:{" "}
        {COMPANY.email}. Bu politika, bizim işlediğimiz ya da Uygulamaya eklediğimiz bileşenlerin işlediği verileri anlatır
        (satın alma ve destek). Defterinize yazdığınız müşteri ve tedarikçi bilgileri ise sizin işletmenizin kayıtlarıdır;
        bunları biz görmeyiz, saklamayız ve sizin adınıza işlemeyiz. Bu kayıtlar için veri sorumlusu, defteri tutan işletme
        olarak sizsiniz (bkz. 9. bölüm).
      </p>

      <H2>2. Kısaca</H2>
      <List>
        <li>Uygulamada hesap ya da üyelik yoktur. Adınızı, e-postanızı ya da telefonunuzu bize vermezsiniz.</li>
        <li>Defteriniz (cariler, borç ve alacaklar, tahsilatlar, kasa, stok, ayarlar) yalnız telefonunuzda, şifreli bir veritabanında durur. Bize gelmez; kendi sunucumuz yoktur.</li>
        <li>Reklam, analitik ya da çökme raporu aracı kullanmıyoruz.</li>
        <li>Yedeği siz alırsınız: dosya, sizin belirlediğiniz parolayla şifrelenip sizin seçtiğiniz yere kaydedilir.</li>
        <li>WhatsApp, SMS ya da paylaşma ile gönderilen mesajları siz başlatır ve siz gönderirsiniz.</li>
        <li>
          Uygulamanın internete bağlanan tek parçası Google Play’in satın alma bileşenidir (Pro sürüm için). Bu bileşen, Pro almamış
          olsanız da Uygulama her açıldığında Google Play’e satın alma durumunu sorar. Ödeme bilgileriniz bize gelmez.
        </li>
      </List>

      <H2>3. Telefonunuzda kalan veriler</H2>
      <p>
        Uygulamaya yazdığınız işletme bilgileri, müşteri ve tedarikçi kayıtları (ad, telefon, adres, vergi numarası, IBAN, not),
        borç, alacak ve tahsilat kayıtları, kasa ve stok hareketleri ile ayarlarınız yalnız telefonunuzda saklanır. Veritabanı
        SQLCipher ile şifrelidir; şifreleme anahtarı telefonun güvenli anahtar deposunda (Android Keystore) korunur. Giriş
        şifreniz (PIN) açık olarak değil, geri çevrilemeyen bir özet olarak tutulur. Uygulamadan ayrılıp döndüğünüzde PIN’in ne
        zaman isteneceğini Ayarlar’dan seçersiniz (varsayılan: 1 dakika sonra). Parmak izi ya da yüz tanımayı Android yapar;
        Uygulama biyometrik verinizi görmez. Bu veriler Android’in Google hesabı yedeğine ve telefondan telefona aktarıma alınmaz.
        Uygulamayı silerseniz, uygulama verilerini temizlerseniz ya da Uygulamadaki “Bu cihazdaki defteri sil” seçeneğini
        kullanırsanız telefondaki defter silinir.
      </p>
      <p>
        <b>Ülke ve para birimi önerisi.</b> İlk açılışta dükkânınızın para birimini ve telefon ülke kodunu önerebilmek için
        Uygulama, telefonunuzdaki SIM kartın ve bağlı olunan şebekenin ülke kodunu (ör. “TR”), telefonun bölge ayarını ve seçili
        dili okur. Telefon numaranız, operatör kimliğiniz ya da SIM seri numaranız okunmaz ve bunun için izin istenmez. Bu bilgiler
        yalnız telefonunuzda öneri üretmek için kullanılır; kaydedilmez, günlüğe yazılmaz, bize ya da bir başkasına gönderilmez.
        Saklanan tek şey sizin onayladığınız para birimi ve ülke kodudur.
      </p>
      <p>
        <b>Cari kaldırma.</b> Hiç kaydı olmayan bir cari tamamen silinir. Kaydı olan bir cari kaldırıldığında ya da Ayarlar’daki
        eski kayıt temizliğiyle gizlendiğinde listeden gizlenir ve gizlenirken adı, telefonu, IBAN’ı ve adresi telefondaki
        kayıttan temizlenir; defterin tutarlı kalması için yalnız tutarlar ve tarihler kalır. Açık bakiyesi olan cari
        kaldırılamaz.
      </p>

      <H2>4. Yedekler</H2>
      <p>
        Elle yedek aldığınızda ya da otomatik yedeği açtığınızda defterinizin kopyası, sizin belirlediğiniz parolayla şifrelenerek
        (PBKDF2 ile türetilen anahtar, AES-256-GCM) sizin seçtiğiniz konuma kaydedilir. Otomatik yedek açıksa seçtiğiniz klasöre
        ücretsiz sürümde haftada bir, Pro’da her gün yazılır. Parolanızı biz bilmeyiz ve kurtaramayız; parolayı unutursanız yedek
        açılamaz. Parolanız saklanmaz; otomatik yedeğin çalışabilmesi için parolanızdan türetilen anahtar yalnız telefonunuzun
        güvenli anahtar deposunda tutulur. Klasörü bir bulut hizmetinde (ör. Google Drive) seçerseniz dosya o hizmete sizin
        hesabınızla gider ve o hizmetin şartlarına tabidir; dosya şifreli olduğu için parolayı bilmeyen açamaz. Elle aldığınız
        yedekler siz silene kadar kalır. Otomatik yedekte Uygulama yalnız kendi oluşturduğu otomatik yedek dosyalarının eskilerini
        siler: ücretsiz sürümde son 1, Pro’da son 30 dosya kalır. Pro’dan çıkarsanız Pro döneminde alınmış yedekler silinmez.
      </p>

      <H2>5. Mesaj gönderme, arama, PDF ekstre</H2>
      <p>
        Hatırlatma ya da hesap özeti gönderdiğinizde Uygulama, müşterinin numarası ve hazırladığı mesajla (müşteri adı, tutar,
        işletme adınız) WhatsApp’ı (ya da WhatsApp Business’ı), SMS uygulamanızı ya da paylaşma menüsünü açar. Mesajı siz görür,
        isterseniz değiştirir ve gönderirsiniz; Uygulama kendiliğinden mesaj göndermez. Gönderilen mesaj, seçtiğiniz uygulamanın
        kendi şartlarına tabidir. Telefonunuzda WhatsApp yüklü değilse mesaj tarayıcıya gönderilmez; bunun yerine paylaşma menüsü
        açılır ve mesajı hangi uygulamayla göndereceğinizi siz seçersiniz. “Ara” düğmesi yalnız telefonun arama ekranını açar. PDF
        ekstre telefonunuzda üretilir ve seçtiğiniz yere kaydedilir.
      </p>

      <H2>6. Pro satın alma (Google Play)</H2>
      <p>
        Pro sürüm Google Play faturalandırma sistemiyle tek seferlik satın alınır. Ödeme bilgileriniz ve satın alma kaydınız Google
        tarafından işlenir; Uygulama satın almayı yalnız telefonunuzda, Google Play’in verdiği imzayı doğrulayarak kontrol eder.
        Adınız ya da ödeme bilginiz bize gelmez. Uygulama her açıldığında, Pro alıp almadığınızdan bağımsız olarak, Google Play’e bu
        Google hesabının satın alma durumunu sorar (iade ya da başka telefonda yapılan satın alma görünsün diye). Google Play’in
        satın alma bileşeni, hizmetin çalışması ve iyileştirilmesi için Google’a teknik bilgiler (ör. uygulama ve cihaz bilgisi,
        işlemin sonucu, hata kodları) gönderebilir; bu bilgiler aktarım sırasında şifrelenir ve Google’ın politikalarına göre
        işlenir:{" "}
        <a href="https://policies.google.com/privacy" className={link}>Google Gizlilik Politikası</a>. Defterinizdeki kayıtlar bu
        bileşene verilmez. Pro durumunuz (Pro olup olmadığınız ve en son ne zaman doğrulandığı) yalnız telefonunuzda saklanır;
        internet yokken son bilinen durum en çok 90 gün kullanılır, sonra doğrulama gerekir. İadeler Google Play’in iade kurallarına
        tabidir.
      </p>

      <H2>7. İşleme amaçları, yöntem ve hukuki sebepler</H2>
      <List>
        <li>Telefondaki defter ve ayarlar: Uygulamanın çalışması; bize aktarılmaz.</li>
        <li>Pro satın alma: satın aldığınız hizmetin sağlanması (KVKK md. 5/2-c, GDPR md. 6/1-b). Ödeme ve satın alma kaydı Google’ın sorumluluğundadır. Veri, telefondaki Google bileşeniyle otomatik yollarla toplanır.</li>
        <li>Google Play satın alma bileşeninin teknik bilgileri: Google’ın kendi sorumluluğunda, hizmetin güvenli ve doğru çalışması için.</li>
        <li>Destek e-postaları: sorunuza yanıt vermek (KVKK md. 5/2-c ve 5/2-f). Yöntem: e-posta.</li>
      </List>

      <H2>8. Yurt dışına aktarım</H2>
      <p>
        Satın alma ve satın alma bileşeninin teknik bilgileri, telefonunuzdan doğrudan Google LLC ve bağlı şirketlerine gönderilir
        ve Türkiye dışındaki (ABD dahil) sunucularda işlenebilir. Bu aktarımı OstlerTech yapmaz ve bu verilere erişimimiz yoktur;
        Google bunları kendi veri koruma şartlarına göre işler. Defterinizdeki kayıtlar yurt dışına aktarılmaz; yalnız siz yedeği
        yurt dışında hizmet veren bir bulut klasörüne kaydederseniz şifreli dosya oraya gider. Destek e-postası için e-posta
        sağlayıcınızın altyapısı geçerlidir.
      </p>

      <H2>9. Defterinizdeki müşteri bilgileri için (işletmeler)</H2>
      <p>
        Müşterilerinizin ve tedarikçilerinizin adı, telefonu, borç bilgisi gibi kayıtlar onların kişisel verisidir ve bu kayıtlar
        için KVKK’daki yükümlülükler (bilgilendirme, yalnız gerektiği kadar veri, güvenli saklama, talep halinde düzeltme ve silme)
        defteri tutan işletmeye aittir. Uygulama size şu araçları verir: kayıtlar telefonda şifreli durur; giriş şifresi
        kullanılabilir; bir carinin bilgileri düzenlenebilir; bir cari kaldırıldığında kişisel bilgileri temizlenir (3. bölüm);
        Ayarlar’dan bu telefondaki defter, giriş şifresi ve onayla tamamen silinebilir (daha önce aldığınız yedek dosyaları ve
        PDF’ler seçtiğiniz yerde kalır, onları ayrıca silmeniz gerekir). Not alanına sağlık, din gibi özel nitelikli bilgileri
        yazmayın. Hatırlatma mesajını göndermeden önce numaranın doğru olduğunu kontrol edin. Kendi yükümlülükleriniz hakkında bir
        hukukçuya danışabilirsiniz.
      </p>

      <H2>10. Saklama süreleri</H2>
      <List>
        <li>Telefondaki defter: Uygulamayı silene, verileri temizleyene ya da defteri Uygulamadan silene kadar.</li>
        <li>Elle alınan yedekler: siz silene kadar, seçtiğiniz yerde. Otomatik yedekler: ücretsiz sürümde son 1, Pro’da son 30 dosya (4. bölüm).</li>
        <li>
          Google Play satın alma ve teknik bilgiler:{" "}
          <a href="https://policies.google.com/technologies/retention" className={link}>Google’ın saklama politikasına</a> göre.
        </li>
        <li>Destek e-postaları: talep kapandıktan sonra 1 yıl.</li>
      </List>

      <H2>11. Çocuklar</H2>
      <p>Uygulama işletmeler ve 18 yaş üstü kullanıcılar için tasarlanmıştır; çocuklara yönelik değildir.</p>

      <H2>12. Haklarınız ve başvuru</H2>
      <p>
        KVKK md. 11 ve GDPR kapsamında bilgi isteme, düzeltme, silme, itiraz ve şikâyet haklarına sahipsiniz. Defterinizi biz
        görmediğimiz için silme ve düzeltmeyi doğrudan Uygulamadan yapabilirsiniz. Satın alma kaydı için Google Play’e ya da{" "}
        <a href="https://myaccount.google.com" className={link}>Google hesabınıza</a> başvurabilirsiniz. {COMPANY.email} adresine
        yazdığınız başvurular en geç 30 gün içinde yanıtlanır. Kişisel Verileri Koruma Kurulu’na ya da AB’de bulunduğunuz ülkenin
        veri koruma otoritesine şikâyette bulunabilirsiniz. Defterdeki bir kaydın sahibiyseniz (bir işletmenin müşterisiyseniz),
        talebinizi o işletmeye iletin; biz o kayıtlara erişemeyiz.
      </p>

      <H2>13. Değişiklikler</H2>
      <p>Uygulama yeni bir veri işlemeye başlarsa bu politika o sürüm yayınlanmadan önce güncellenir ve tarih değişir.</p>

      <p className="text-sm">Google Play™ ve Android™, Google LLC’nin ticari markalarıdır. WhatsApp, Meta Platforms, Inc.’in ticari markasıdır.</p>
    </LegalPage>
  );
}
