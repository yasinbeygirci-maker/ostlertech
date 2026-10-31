import type { Metadata } from "next";
import LegalPage, { H2, List, SellerBlock } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { SYNCSITE, BREVO_BAGLI, TOMBSTONE_CANLI } from "@/lib/syncsite";

// SyncSite (eski adı Projex) gizlilik politikası ve KVKK aydınlatma metni. İngilizcesi: /en/syncsite/privacy; biri değişirse diğeri de.
// Kaynak: OstlerTech/hukuk/2026-10-29-syncsite-beta-kvkk.md + hukuk/projex-gizlilik-ve-aydinlatma.md (Zeynep, TASLAK; avukat soruları açık).
const N = SYNCSITE.name;

export const metadata: Metadata = {
  title: `${N} Gizlilik Politikası ve Aydınlatma Metni`,
  description: `${N} (eski adı ${SYNCSITE.formerName}) şantiye takip uygulaması: hesapsız kullanımda veri cihazda kalır; hesap açılırsa AB’deki (İrlanda) sunucuda tutulur. Yurt dışı aktarım durumu açıkça anlatılır.`,
  alternates: { canonical: SYNCSITE.privacyPath, languages: { tr: SYNCSITE.privacyPath, en: SYNCSITE.privacyEnPath } },
};

const link = "text-primary hover:text-primary-light";

export default function SyncSitePrivacyPage() {
  return (
    <LegalPage
      eyebrow={N}
      title={`${N} Gizlilik Politikası ve Aydınlatma Metni`}
      updatedOn={SYNCSITE.updatedTr}
      altLink={{ href: SYNCSITE.privacyEnPath, label: "English version" }}
    >
      <p>
        Bu metin, OstlerTech’in şantiye takip uygulaması <strong className="text-foreground">{N}</strong>’ın ({SYNCSITE.formerName} adıyla
        yayınlanmış sürümleri dahil; Android ve Windows uygulamaları ve bulut eşitleme hizmeti) hangi kişisel verileri, neden ve nasıl
        işlediğini anlatır. 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (KVKK) 10. maddesi uyarınca hazırlanmış aydınlatma
        metnidir. Aşağıdaki “Kısa bilgi” kutusu kayıt ekranında da gösterilir.
      </p>

      <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
        <p className="font-semibold text-foreground">Kısa bilgi</p>
        <List>
          <li>{N}’ı <strong className="text-foreground">hesapsız</strong> kullanabilirsiniz: verileriniz yalnız cihazınızda kalır, bize hiçbir şey gelmez.</li>
          <li>Hesap açarsanız verileriniz Avrupa Birliği’ndeki (İrlanda) sunucularda tutulur. <strong className="text-foreground">Bu bir yurt dışı aktarımdır ve bugün KVKK md. 9’daki güvencelerden birine dayanmamaktadır</strong> (6. bölüm).</li>
          <li>Reklam, analiz (istatistik), çökme raporu ve yapay zekâ servisi yoktur. Verilerinizi satmaz, pazarlamada kullanmayız.</li>
          <li>Konum (GPS) izni istenmez; fotoğraflardaki konum bilgisi buluta gitmeden silinir.</li>
          <li>Hesabınızı uygulamadan ya da <a href={SYNCSITE.deletePath} className={link}>hesap silme sayfasından</a> silebilirsiniz.</li>
        </List>
      </div>

      <H2>1. Veri sorumlusu</H2>
      <SellerBlock />
      <p>
        Kendi kullanımınız için hesap açtıysanız hesap verileriniz bakımından veri sorumlusu OstlerTech’tir. Bir işletme çalışanlarıyla
        birlikte kullanıyorsa 5. bölüme bakın.
      </p>

      <H2>2. Hangi verileri işliyoruz</H2>
      <p className="font-semibold text-foreground">Hesap açarsanız</p>
      <List>
        <li><strong className="text-foreground">E-posta adresi ve şifre.</strong> Şifreniz bizde açık hâlde durmaz; giriş hizmetimiz onu tek yönlü özet (hash) olarak saklar.</li>
        <li><strong className="text-foreground">Hesap kimliği ve hesabın açıldığı tarih.</strong> Bu tarih beta ve deneme süresinin başlangıcı olarak kaydedilir (4. bölüm).</li>
        <li><strong className="text-foreground">Kabul ettiğiniz beta şartlarının sürümü ve tarihi.</strong></li>
        <li><strong className="text-foreground">Oturum bilgisi:</strong> giriş yaptığınızı hatırlamak için cihazınızda saklanan oturum anahtarı.</li>
        <li><strong className="text-foreground">Proje üyeliği:</strong> hangi projede hangi rolde (sahip, düzenleyen, görüntüleyen) ve hangi ekipte olduğunuz. Bir proje sahibi sizi projeye e-posta adresinizle ekler.</li>
        <li><strong className="text-foreground">Kaydı giren hesap:</strong> bir günlük kaydı kimin girdiği, ekibin denetimi için kayıtla birlikte tutulur.</li>
        <li><strong className="text-foreground">Sunucu kayıtları:</strong> sunucuya bağlandığınızda barındırma sağlayıcısının tuttuğu teknik kayıtlar (IP adresi, zaman, istek türü). Yalnız güvenlik ve hata giderme için kullanılır.</li>
      </List>
      <p className="font-semibold text-foreground">Şantiye kayıtları (siz ya da ekibiniz girdiğinde)</p>
      <List>
        <li>Proje adı, açıklama, tarihler; blok, kat, daire gibi yer adları (coğrafi konum değildir); ekip ve imalat kalemi adları; hedef miktarlar.</li>
        <li>Günlük kayıtlar: tarih, yapılan iş miktarı, o işte çalışan <strong className="text-foreground">kişi sayısı</strong>, not ve engel bilgisi.</li>
        <li>
          <strong className="text-foreground">Fotoğraflar.</strong> Fotoğraf küçültülüp yeniden kaydedilir; bu sırada içindeki konum ve cihaz bilgileri (EXIF)
          silinir. Fotoğrafta yüzü görünen kişiler olabilir.
        </li>
      </List>
      <p>
        {N} <strong className="text-foreground">kişi bazlı puantaj tutmaz</strong> ve işçi adı istemez. Ancak not, ekip adı ve fotoğraf
        alanlarına yazdığınız ya da çektiğiniz her şey kaydedilir. Bu alanlara kimlik numarası, sağlık bilgisi gibi gereksiz kişisel
        veri girmeyin.
      </p>
      <p className="font-semibold text-foreground">Cihazınızda</p>
      <p>
        Hesapsız da hesaplı da kullansanız, {N} verilerinizi cihazınızdaki bir veritabanında ve uygulama klasöründe tutar. Çevrimdışıyken
        girilen kayıtlar internet gelince eşitlenir. Bu yerel veritabanı ayrıca şifrelenmez; cihazınızın ekran kilidini kullanmanızı
        öneririz. Dışa aktardığınız Excel, PDF ve JSON dosyaları cihazınızda (Belgeler/Projex) kalır; onları paylaşmak ve silmek
        sizin elinizdedir.
      </p>
      <p>
        Güncel sürümde {N} verisi Android’in Otomatik Yedekleme’sine ve cihazdan cihaza aktarıma alınmaz; kopyayı uygulamadaki
        Yedek Al / dışa aktar ile siz alırsınız. 1.2.0 ve öncesi sürümlerde yedekleme açıktı: bu sürümleri kullandıysanız Android,
        uygulama verilerini (oturum anahtarı dahil) sizin kendi Google hesabınıza yedeklemiş olabilir. Bu yedek sizinle Google
        arasındadır; biz ona erişemeyiz.
      </p>
      <p className="font-semibold text-foreground">Bize yazarsanız</p>
      <p>Destek ya da başvuru için gönderdiğiniz e-postadaki adınız, e-posta adresiniz ve mesajınız.</p>
      <p className="font-semibold text-foreground">İşlemediklerimiz</p>
      <p>GPS konumu, rehber, reklam kimliği, cihaz kimliği, kullanım istatistiği, çökme raporu. Ödeme kartı bilgisi bize hiç gelmez (beta ücretsizdir).</p>

      <H2>3. Verileri nasıl topluyoruz</H2>
      <p>
        E-postanızı ve şifrenizi kayıt ekranına siz yazarsınız; şantiye kayıtlarını ve fotoğrafları uygulamaya siz ya da ekibiniz girer;
        hesap açılış tarihi ve teknik kayıtlar hizmet kullanılırken sunucuda kendiliğinden oluşur. Toplama elektronik ortamda,
        uygulama üzerinden yapılır.
      </p>

      <H2>4. Neden işliyoruz, hukuki sebep ve deneme süresi</H2>
      <List>
        <li>
          Hesabı açmak, giriş ve şifre sıfırlama; kayıtlarınızı cihazlarınız ve ekibiniz arasında eşitlemek, fotoğrafları paylaşmak; beta
          ve deneme süresini yönetmek; beta ile ilgili zorunlu bilgileri (beta bitişi, önemli değişiklik, doğrulama kodu) iletmek:
          <strong className="text-foreground"> sözleşmenin kurulması ve ifası</strong> (KVKK md. 5/2-c).
        </li>
        <li>Güvenlik, kötüye kullanımı önleme, hata giderme; kaydı kimin girdiğini ekibe göstermek: <strong className="text-foreground">meşru menfaat</strong> (md. 5/2-f).</li>
        <li>Destek ve başvuruları yanıtlamak: sözleşmenin ifası ve hukuki yükümlülük (md. 5/2-c, 5/2-ç, md. 13).</li>
        <li>Fatura ve muhasebe (ileride ücretli plan olursa): hukuki yükümlülük (md. 5/2-ç).</li>
      </List>
      <p>
        <strong className="text-foreground">Beta ve deneme süresi.</strong> Hesabınızın açıldığı tarih, ileride uygulanabilecek 1 aylık
        deneme süresinin başlangıcı olarak kaydedilir. Beta boyunca bu süre nedeniyle hiçbir özellik kısıtlanmaz. Bu tarih yalnız bu amaçla
        kullanılır; hesabınızla birlikte silinir. Hesap sildikten sonra e-postanızı ya da özetini tutmayız.
      </p>
      <p>
        Bu işlemeler için açık rıza istemiyoruz; bu metin bir onay değil, bilgilendirmedir. Pazarlama e-postası göndermiyoruz; ileride
        göndermek istersek ayrıca ve ayrı bir metinle izninizi isteriz.
      </p>

      <H2>5. İşletmeler için: kim veri sorumlusu</H2>
      <p>
        {N}’ı bir firma (ör. bir yüklenici ya da taşeron) çalışanları ve ekibiyle kullanıyorsa, şantiye kayıtlarındaki kişisel veriler
        (çalışanların kayıtları, fotoğraflardaki kişiler) bakımından <strong className="text-foreground">veri sorumlusu o firmadır</strong>;
        OstlerTech bu veriler için firmanın talimatıyla çalışan veri işleyendir. Çalışanların aydınlatılması firmanın sorumluluğundadır.
        Açık beta süresince firmalarla tek tek sözleşme imzalanmaz; bunun yerine firmalar için standart veri işleme şartları beta
        şartlarına ek olarak hazırlanır, daha önce yazılı pilot sözleşmesi imzalamış işletmelerde o sözleşme geçerlidir. Hesap bilgileri
        (e-posta, giriş) ve destek yazışmaları için veri sorumlusu OstlerTech’tir.
      </p>

      <H2>6. Kimlere aktarıyoruz ve yurt dışına aktarım</H2>
      <p>Verilerinizi yalnız hizmeti çalıştırmak için şu hizmet sağlayıcılara aktarırız:</p>
      <List>
        <li>
          <strong className="text-foreground">Supabase Pte. Ltd.</strong> (Singapur şirketi; ana şirket Supabase, Inc., ABD): veritabanı, giriş, fotoğraf
          depolama. Veriler Avrupa Birliği’nde, İrlanda’da (Amazon Web Services altyapısı) tutulur.
        </li>
        {BREVO_BAGLI ? (
          <li>
            <strong className="text-foreground">Brevo</strong> (Sendinblue SAS, Fransa): hesap e-postalarının gönderimi (doğrulama kodu, şifre sıfırlama).
          </li>
        ) : (
          <li>
            Hesap e-postaları (doğrulama kodu, şifre sıfırlama) şu an Supabase’in kendi e-posta hizmetiyle gönderilir. Ayrı bir e-posta
            sağlayıcısı kullanmaya başlarsak önce bu metni güncelleriz.
          </li>
        )}
      </List>
      <p>
        Supabase’in kendi hizmet sağlayıcılarından bazıları (destek ve altyapı) ABD’de ve başka ülkelerdedir; destek ya da bakım
        sırasında verilere oradan erişilebilir. Güncel liste:{" "}
        <a href="https://supabase.com/legal/subprocessors" className={link}>supabase.com/legal/subprocessors</a>.
      </p>
      <p>
        <strong className="text-foreground">Yurt dışına aktarımın şu anki durumu.</strong> Sunucular Türkiye dışında olduğu için hesap
        açtığınızda verileriniz yurt dışına aktarılır (KVKK md. 9). Bu aktarımın; Kurul’un yeterlilik kararına ya da Kurul’un ilan ettiği
        standart sözleşmenin değiştirilmeden imzalanıp Kurum’a bildirilmesine dayanması gerekir. Bugün itibarıyla:
      </p>
      <List>
        <li>Kurul’un Avrupa Birliği ya da İrlanda için verdiği bir yeterlilik kararını bilmiyoruz.</li>
        <li>
          Supabase’in standart veri işleme sözleşmesi var; bu sözleşme Avrupa Birliği’nin standart sözleşme maddelerine dayanır,{" "}
          <strong className="text-foreground">KVKK’nın kabul ettiği standart sözleşme değildir.</strong> Bu nedenle aktarım şu an KVKK
          md. 9’da sayılan uygun güvencelerden birine dayanmamaktadır; bu, hukuka aykırılık riski taşıyan bir durumdur.
        </li>
        <li>
          Supabase’den Kurul’un standart sözleşmesini imzalamasını 18.10.2026 tarihinde istedik; yanıt gelmedi. İmzalanırsa Kurum’a
          bildirir ve bu metni güncelleriz. İmzalanmazsa verileri Türkiye’deki bir sunucuya taşımayı değerlendireceğiz.
        </li>
      </List>
      <p>
        Bunu kabul etmek istemezseniz {N}’ı <strong className="text-foreground">hesapsız</strong> kullanın (“Hesapsız devam et”): verileriniz
        cihazınızdan çıkmaz. Hesabınızı istediğiniz an silebilirsiniz (7. bölüm). Bunların dışında kişisel verileri yalnız yetkili kurum ve
        mahkemelerin hukuka uygun talebi üzerine, gereken en az ölçüde paylaşırız.
      </p>

      <H2>7. Ne kadar saklıyoruz ve nasıl silinir</H2>
      <List>
        <li><strong className="text-foreground">Hesap</strong> (e-posta, giriş bilgisi, hesap açılış/deneme başlangıç tarihi, kabul edilen şart sürümü): hesabınız açık olduğu sürece; hesabı silince hemen silinir.</li>
        <li><strong className="text-foreground">Sahibi olduğunuz projeler ve fotoğrafları:</strong> siz silene ya da hesabınızı silene kadar.</li>
        <li>
          <strong className="text-foreground">Tek tek sildiğiniz kayıtlar:</strong> diğer cihazlara “silindi” bilgisi ulaşsın diye satır, silindi işaretiyle bulutta kalır.{" "}
          {TOMBSTONE_CANLI
            ? "Kaydın içeriği (miktar, kişi sayısı, not, fotoğraf) ve fotoğraf dosyası silinir; yalnız silindi işareti kalır."
            : "Kaydın içeriği (1.2.1 ve sonrası sürümlerde; daha eski sürümler içeriği buluta bıraktı) silinir; ancak eklediğiniz fotoğraf dosyası proje ya da hesap silinene kadar bulutta kalabilir (bunu gidermek için çalışıyoruz; yapılınca bu metin güncellenir)."}
        </li>
        <li><strong className="text-foreground">Başkasının projesine girdiğiniz kayıtlar:</strong> o proje projenin sahibinindir; hesabınızı silince kayıtlar projede kalır, sizinle bağlantısı (kimin girdiği) silinir.</li>
        <li><strong className="text-foreground">Sunucu kayıtları</strong> (IP adresi vb.): barındırma planına göre kısa süre (şu an 1 gün).</li>
        <li><strong className="text-foreground">Sunucu yedekleri:</strong> şu an otomatik yedek tutulmaz; silinen veri geri getirilemez. Bu yüzden önemli kayıtlarınızın kopyasını uygulamadan kendiniz alın.</li>
        <li><strong className="text-foreground">Beta sona ererse:</strong> bildirimden sonra veriyi dışa aktarmanız için süre veririz; ücretli plana geçmediyseniz beta verisi bu sürenin ardından canlı sistemden silinir (süreler beta şartlarında).</li>
        <li><strong className="text-foreground">Destek e-postaları:</strong> talep kapandıktan sonra 1 yıl. <strong className="text-foreground">Fatura ve muhasebe kayıtları</strong> (varsa): kanuni süre boyunca (10 yıl).</li>
        <li><strong className="text-foreground">Bize gönderdiğiniz hata kaydı ya da ekran görüntüsü:</strong> en fazla 30 gün; silindiği kayda geçer.</li>
        <li><strong className="text-foreground">Cihazınızdaki veri ve dışa aktarılan dosyalar:</strong> siz silene kadar. Hesabı silince uygulamadaki yerel veritabanı da silinir; dışa aktardığınız dosyaları siz silersiniz.</li>
      </List>
      <p>
        Hesabı nasıl sileceğiniz, neyin silinip neyin kaldığı: <a href={SYNCSITE.deletePath} className={link}>Hesap silme sayfası</a>.
      </p>

      <H2>8. Güvenlik</H2>
      <p>
        Sunucuyla bağlantı şifrelidir (HTTPS). Veritabanında her kullanıcı yalnız üyesi olduğu projeleri görür; fotoğraflar herkese açık
        olmayan bir alanda, proje rolüne göre erişimle tutulur. Hizmet hesaplarımızda iki adımlı doğrulama açıktır, gizli anahtarlar kod
        deposuna konmaz. Verilerinizi yapay zekâ hizmetlerine, test ya da tanıtım ortamlarına koymayız. Hiçbir sistem tamamen risksiz
        değildir; bir veri ihlali olursa KVKK’ya göre Kurul’a ve etkilenen kişilere bildiririz.
      </p>

      <H2>9. Haklarınız ve başvuru (KVKK md. 11)</H2>
      <p>
        Bize başvurarak şunları isteyebilirsiniz: verilerinizin işlenip işlenmediğini öğrenmek; işlenmişse bilgi istemek; işleme amacını ve
        amaca uygun kullanılıp kullanılmadığını öğrenmek; yurt içinde ve yurt dışında aktarıldığı kişileri bilmek; eksik ya da yanlışsa
        düzeltilmesini, md. 7 şartlarıyla silinmesini ya da yok edilmesini ve bunun aktarılan kişilere bildirilmesini istemek; yalnız
        otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etmek; kanuna aykırı işleme nedeniyle zarara
        uğradıysanız zararın giderilmesini istemek.
      </p>
      <p>
        <strong className="text-foreground">Nasıl başvurulur:</strong> {COMPANY.email} adresine hesabınızda kayıtlı e-posta adresinden; ya
        da yazılı olarak {COMPANY.address} adresine ya da KEP ile {COMPANY.kep} adresine. Başvuruda adınızı, iletişim bilginizi ve talebinizi
        yazın; kimliğinizi doğrulamak için ek bilgi isteyebiliriz. Başvurunuzu en geç <strong className="text-foreground">30 gün</strong> içinde
        ücretsiz yanıtlarız. Bir işletmenin kullandığı {N}’taki şantiye kayıtlarıyla ilgili başvurunuzu o işletmeye yapmanız gerekir; bize
        gelirse işletmeye iletir ve size bildiririz. Yanıtımızdan memnun kalmazsanız Kişisel Verileri Koruma Kurulu’na şikâyette bulunabilirsiniz.
      </p>

      <H2>10. Çocuklar</H2>
      <p>{N} işletmeler ve çalışanlar için bir iş uygulamasıdır; 18 yaşından küçüklere yönelik değildir.</p>

      <H2>11. Değişiklikler</H2>
      <p>
        Bu metni ürün değiştikçe güncelleriz; tarih en üstte yazar. Önemli bir değişiklikte (yeni bir hizmet sağlayıcı, sunucu yerinin değişmesi,
        yurt dışı aktarım durumunun değişmesi) uygulamada ya da e-postayla haber veririz.
      </p>

      <p className="text-sm">Google Play™ ve Android™, Google LLC’nin ticari markalarıdır.</p>
    </LegalPage>
  );
}
