import type { Metadata } from "next";
import LegalPage, { H2, List, SellerBlock } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK Aydınlatma Metni",
  description: "ostlertech.com ve satın alma işlemlerinde kişisel verilerin işlenmesi; 6698 sayılı KVKK aydınlatma metni.",
  alternates: { canonical: "/gizlilik", languages: { tr: "/gizlilik", en: "/en/privacy" } },
};

export default function SitePrivacyPage() {
  return (
    <LegalPage eyebrow="Yasal" title="Gizlilik Politikası ve KVKK Aydınlatma Metni" updatedOn="30 Ekim 2026" altLink={{ href: "/en/privacy", label: "English version" }}>
      <p>
        Bu metin ostlertech.com web sitesini ve buradan yapılan satın almaları kapsar. Uygulamalarımızın kendi gizlilik
        politikaları ayrıdır: <a href="/syncpass/privacy" className="text-primary hover:text-primary-light">SyncPass gizlilik politikası</a>,
        {" "}<a href="/syncsite/gizlilik" className="text-primary hover:text-primary-light">SyncSite gizlilik politikası</a>
        (SyncSite hesap verileri yalnız o metinde anlatılır).
      </p>

      <H2>1. Veri sorumlusu</H2>
      <SellerBlock />

      <H2>2. Hangi verileri, neden işliyoruz</H2>
      <List>
        <li><strong className="text-foreground">Siteyi gezerken:</strong> çerez kullanmıyoruz. Hangi sayfaların ne kadar ziyaret edildiğini görmek için Vercel Web Analytics kullanıyoruz; bu araç çerez kullanmaz, sizi tanımlamaz ve ziyaretleri her gün değişen anonim bir özetle sayar (sayfa adresi, ülke, cihaz ve tarayıcı türü gibi toplu bilgiler). Barındırma hizmetimiz (Vercel) ayrıca güvenlik ve hata ayıklama için IP adresi ve tarayıcı bilgisini kısa süreli sunucu kayıtlarında tutar.</li>
        <li><strong className="text-foreground">Bekleme listesi:</strong> e-posta adresiniz, yalnızca ürün çıktığında size haber vermek için.</li>
        <li><strong className="text-foreground">Satın alma:</strong> satışlarımızı yetkili satıcımız (Merchant of Record) Paddle.com yapar. Ödeme ve fatura bilgilerinizi Paddle toplar ve kendi gizlilik politikasına göre işler. Paddle bize yalnızca e-posta adresinizi, ülkenizi, satın aldığınız planı, işlem ve abonelik numaralarını ve ödeme durumunu iletir. Amaç: lisansın teslimi, abonelik durumunun izlenmesi, iade ve destek.</li>
        <li><strong className="text-foreground">Lisans:</strong> lisans kodu, etkinleştirildiği cihazlar için uygulamanın ürettiği rastgele cihaz numarası, uygulama sürümü ve son doğrulama tarihi. Amaç: lisansın geçerliliğini ve cihaz sınırını denetlemek. Kasanızın içeriği hiçbir zaman bize gelmez.</li>
        <li><strong className="text-foreground">Destek yazışmaları:</strong> size yanıt verebilmek için e-posta içeriği.</li>
        <li><strong className="text-foreground">Instagram mesajları:</strong> @ostlertech hesabına mesaj yazdığınızda ya da bir gönderimize yorum bıraktığınızda Instagram kullanıcı adınız ve hesap numaranız, mesajınızın ya da yorumunuzun içeriği, bizimle yazışma geçmişiniz ve bir otomasyon bunu gerektiriyorsa hesabımızı takip edip etmediğiniz bilgisi işlenir. Bu mesajları ChatPlace adlı mesajlaşma otomasyonu hizmetiyle yönetiriz: belirli bir kelimeyle yazdığınızda istediğiniz bağlantı ya da bilgi size otomatik mesajla gönderilir. Mesajlarınızın bir kısmına yapay zekâ destekli otomatik asistan yanıt verebilir; bu durumda mesajınızın içeriği yanıtı üretmek için ChatPlace'in yapay zekâ hizmet sağlayıcılarına iletilir. Amaç: sorunuzu yanıtlamak ve istediğiniz bağlantıyı ya da bilgiyi göndermek; hukuki sebep, bize yazdığınız mesaja yanıt verebilmek için meşru menfaatimizdir. Bu yazışmaları başka bir yere aktarmaz, reklam için kullanmayız. ChatPlace'teki sohbet kayıtları son yazışmadan 6 ay sonra silinir. Instagram uygulamasındaki yazışma kopyası Meta'nın kendi kurallarına tabidir; onu biz silemeyiz.</li>
        <li><strong className="text-foreground">Güvenlik açığı bildirimleri:</strong> e-posta adresiniz, yazdıysanız adınız ve bildirimin içeriği; amaç bildirimi değerlendirmek, size yanıt vermek ve açığı gidermek. Hukuki sebep: ürünlerimizin güvenliğini sağlamaya yönelik meşru menfaatimiz. Adınız ya da takma adınız teşekkür listesinde yalnızca açık rızanızla yayımlanır.</li>
        <li><strong className="text-foreground">Kart bilgileri:</strong> ödemeyi Paddle alır; kart numaranız bize iletilmez ve bizde saklanmaz.</li>
      </List>

      <H2>3. Hukuki sebepler</H2>
      <p>
        Verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 5. maddesindeki şu sebeplere dayanarak işlenir:
        bir sözleşmenin kurulması veya ifası (lisans, destek), kanuni yükümlülüklerimiz, meşru menfaatimiz (site ve
        lisans güvenliği, Instagram mesajlarınıza yanıt verilmesi) ve bekleme listesi için açık rızanız.
      </p>

      <H2>4. Aktarım</H2>
      <p>Verilerinizi satmayız ve reklam amacıyla paylaşmayız. Hizmeti sunabilmek için yalnızca şu hizmet sağlayıcılarla paylaşılır:</p>
      <List>
        <li>Paddle.com Market Ltd (Birleşik Krallık): yetkili satıcı olarak ödemenin alınması, faturalandırma, vergiler, abonelik ve iadeler (<a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener" className="text-primary hover:text-primary-light">Paddle gizlilik politikası</a>).</li>
        <li>Supabase Pte. Ltd. (Singapur şirketi; veritabanı sunucuları İrlanda, AB): lisans ve bekleme listesi kayıtlarının saklanması.</li>
        <li>Vercel: sitenin ve lisans doğrulama hizmetinin barındırılması; anonim ziyaret istatistikleri (Web Analytics).</li>
        <li>ChatPlace, Inc. (ABD): Instagram mesajlaşma otomasyonu (otomatik yanıtlar ve yapay zekâ destekli asistan). ChatPlace, yapay zekâ yanıtları için mesaj içeriğini ABD'deki yapay zekâ hizmet sağlayıcılarına iletir.</li>
        <li>Cloudflare, Inc. (ABD): e-posta yönlendirme; destek@, yasin@ ve guvenlik@ostlertech.com adreslerine yazdığınız e-postalar Cloudflare üzerinden posta kutumuza iletilir.</li>
        <li>Google LLC (ABD): bu e-postaların alındığı posta kutusu (Gmail).</li>
        <li>Mali müşavir: yasal muhasebe kayıtları.</li>
        <li>YouTube: sitedeki bir videoda yalnızca siz oynat'a bastığınızda (youtube-nocookie.com üzerinden).</li>
        <li>Yetkili kamu kurumları: yalnızca kanunen zorunlu olduğunda.</li>
      </List>
      <p>
        Vercel, Supabase, ChatPlace, Cloudflare ve Google'ın sunucuları yurt dışındadır; sitemizi ziyaret ettiğinizde, bekleme listesine
        yazıldığınızda, masaüstü lisansınız doğrulandığında, bize Instagram'dan yazdığınızda ve bize e-posta gönderdiğinizde verileriniz bu sağlayıcılara aktarılır. Bu aktarım bugün itibarıyla KVKK md. 9'da
        sayılan uygun güvencelerden birine (Kurul'un yeterlilik kararı ya da Kurul'un ilan ettiği standart sözleşmenin
        imzalanıp Kurum'a bildirilmesi) dayanmamaktadır. Supabase'e standart sözleşme imzalanması için 18.10.2026 tarihinde
        talep ilettik; yanıt beklenmektedir. ChatPlace ile de standart sözleşme henüz imzalanmamıştır. İmzalanırsa Kurum'a
        bildirir ve bu metni güncelleriz. Hesap tabanlı uygulamalarımızın
        yurt dışı aktarımı kendi gizlilik politikalarında ayrıca anlatılır.
      </p>

      <H2>5. Saklama süresi</H2>
      <List>
        <li>Satışa ilişkin fatura kayıtları Paddle'da tutulur; bizdeki muhasebe kayıtları ilgili mevzuatın öngördüğü süre (10 yıl) saklanır.</li>
        <li>Lisans kayıtları: lisans süresi boyunca ve bitiminden sonra 1 yıl.</li>
        <li>Bekleme listesi: ürün çıktıktan 6 ay sonra ya da siz daha önce çıkmak isterseniz o gün silinir.</li>
        <li>Destek yazışmaları: konu kapandıktan sonra 1 yıl.</li>
        <li>Instagram sohbet kayıtları (ChatPlace): son yazışmadan 6 ay sonra silinir.</li>
        <li>Güvenlik açığı bildirimleri: konu kapandıktan sonra 2 yıl; teşekkür listesindeki ad, izninizi geri alana kadar.</li>
        <li>Uygulamalardan gelen çökme raporlarındaki kişisel bilgiler: en fazla 30 gün.</li>
      </List>

      <H2>6. Haklarınız</H2>
      <p>
        KVKK'nın 11. maddesi uyarınca verilerinizin işlenip işlenmediğini öğrenme, bilgi isteme, düzeltilmesini ya da
        silinmesini isteme, aktarıldığı üçüncü kişileri öğrenme, itiraz etme ve zararınızın giderilmesini isteme
        haklarına sahipsiniz. Başvurularınızı {COMPANY.email} adresine ya da KEP adresimize iletebilirsiniz; en geç 30 gün
        içinde yanıtlarız.
      </p>
    </LegalPage>
  );
}
