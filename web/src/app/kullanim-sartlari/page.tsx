import type { Metadata } from "next";
import LegalPage, { H2, List, SellerBlock } from "@/components/LegalPage";
import { COMPANY, DESKTOP_LICENSE, PADDLE_BUYER_TERMS_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kullanım ve Satış Koşulları",
  description: "OstlerTech uygulamalarının kullanım koşulları; SyncPass Masaüstü Premium lisansı, abonelik, iptal ve Paddle üzerinden satış.",
  alternates: { canonical: "/kullanim-sartlari" },
};

const link = "text-primary hover:text-primary-light";

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Yasal" title="Kullanım ve Satış Koşulları">
      <p>
        Bu koşullar {COMPANY.brand} uygulamalarının (SyncPass Android, SyncPass Masaüstü ve diğerleri) kullanımı ile
        ostlertech.com üzerinden satın alınan lisanslar için geçerlidir. Uygulamayı kullanarak ya da lisans satın alarak
        bu koşulları kabul etmiş olursunuz.
      </p>

      <H2>1. Taraflar</H2>
      <p>Yazılımın geliştiricisi ve lisans veren:</p>
      <SellerBlock />

      <H2>2. Satış: Paddle yetkili satıcımızdır</H2>
      <p>
        Sipariş süreci çevrim içi satıcımız Paddle.com tarafından yürütülür. Paddle.com tüm siparişlerimizin yetkili
        satıcısıdır (<span lang="en">Merchant of Record</span>). Ödeme, faturalandırma, vergiler, müşteri hizmetleri
        talepleri ve iadeler Paddle tarafından yürütülür. Satın alma işleminiz ayrıca{" "}
        <a href={PADDLE_BUYER_TERMS_URL} target="_blank" rel="noopener" className={link}>Paddle Alıcı Koşulları</a>'na tabidir.
      </p>
      <p lang="en" className="text-sm">
        Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all
        our orders. Paddle provides all customer service inquiries and handles returns.
      </p>

      <H2>3. Ürün ve planlar</H2>
      <p>
        <strong className="text-foreground">{DESKTOP_LICENSE.name}</strong>, SyncPass Masaüstü (Windows 10 ve 11)
        uygulamasının ücretsiz sürümdeki sınırları kaldıran lisansıdır. Ücretsiz sürümde en fazla 15 kayıt tutulabilir ve
        telefonla eşitleme kapalıdır; Premium'da kayıt sınırı yoktur ve telefonla eşitleme açıktır.
      </p>
      <List>
        <li><strong className="text-foreground">Aylık ve yıllık abonelik:</strong> seçtiğiniz dönem sonunda otomatik olarak yenilenir ve aynı ödeme yönteminden tahsil edilir. Dönem fiyatı ödeme sayfasında ve Paddle'ın e-postalarında gösterilir.</li>
        <li><strong className="text-foreground">Ömür boyu:</strong> tek seferlik ödemedir; yenilenmez. Sonraki güncellemeler dahildir.</li>
        <li>Fiyatlar bulunduğunuz ülkeye göre gösterilir ve uygulanacak vergileri içerir. Geçerli fiyat, ödemeyi onayladığınız anda ödeme sayfasında gördüğünüz tutardır.</li>
      </List>

      <H2>4. Teslimat ve etkinleştirme</H2>
      <List>
        <li>Ürün dijitaldir; kargo yoktur. Ödeme tamamlanınca lisans kodunuz ödeme sonrası açılan sayfada gösterilir; makbuzunuz Paddle tarafından e-postayla gönderilir.</li>
        <li>Kodu kaybederseniz satın alırken kullandığınız e-postayla {COMPANY.email} adresine yazın; kodunuzu yeniden iletiriz.</li>
        <li>Bir lisans aynı anda en fazla {DESKTOP_LICENSE.devices} bilgisayarda etkinleştirilebilir. Uygulamada "Bu bilgisayardan kaldır" ile yer açıp başka bir bilgisayara geçebilirsiniz.</li>
        <li>Lisans kişiseldir; satılamaz, kiralanamaz, paylaşılamaz ve cihaz sınırını aşacak şekilde kullanılamaz.</li>
        <li>Uygulama lisansı yaklaşık haftada bir doğrular. Bunun için yalnızca lisans kodu, uygulamanın ürettiği rastgele bir cihaz numarası ve uygulama sürümü gönderilir; kasanızın içeriği hiçbir zaman bize ulaşmaz.</li>
      </List>

      <H2>5. İptal ve iade</H2>
      <List>
        <li>Aboneliğinizi istediğiniz zaman Paddle'ın size gönderdiği e-postadaki bağlantıdan ya da <a href="https://paddle.net" target="_blank" rel="noopener" className={link}>paddle.net</a> üzerinden iptal edebilirsiniz. İptal, ödediğiniz dönemin sonunda geçerli olur; o güne kadar Premium kullanmaya devam edersiniz.</li>
        <li>Her ödeme için {DESKTOP_LICENSE.refundDays} gün içinde gerekçe göstermeden iade isteyebilirsiniz. Ayrıntılar: <a href="/teslimat-ve-iade" className={link}>Teslimat ve iade politikası</a>.</li>
      </List>

      <H2>6. Lisans bitince</H2>
      <p>
        Abonelik sona erdiğinde ya da ödeme iade edildiğinde uygulama ücretsiz sürüme geçer. Kasanız hiçbir durumda
        kilitlenmez: tüm kayıtlarınızı görmeye, kopyalamaya, düzenlemeye ve dışa aktarmaya devam edersiniz.
      </p>

      <H2>7. Ana şifre ve verileriniz</H2>
      <p>
        SyncPass kasanızı yalnızca sizin bildiğiniz ana şifreyle cihazınızda şifreler. Ana şifrenizi bilmediğimiz ve
        saklamadığımız için unutulan bir ana şifreyi geri getiremeyiz. Kasanızı düzenli olarak yedeklemek sizin
        sorumluluğunuzdadır.
      </p>

      <H2>8. Sorumluluğun sınırı</H2>
      <p>
        Uygulamaları özenle geliştirir ve test ederiz; ancak yazılım "olduğu gibi" sunulur ve hiçbir yazılım tamamen
        hatasız değildir. Yürürlükteki tüketici mevzuatının size tanıdığı haklar saklı kalmak kaydıyla, kasıt veya ağır
        ihmal dışındaki durumlarda dolaylı zararlardan ve veri kaybından sorumluluğumuz, son 12 ayda ödediğiniz lisans
        bedeliyle sınırlıdır.
      </p>

      <H2>9. Fikri mülkiyet</H2>
      <p>
        Uygulamaların, logoların ve içeriklerin tüm hakları {COMPANY.legalName} ({COMPANY.tradeName}) adına saklıdır.
        Lisans size yazılımı kullanma hakkı verir; kaynak koduna veya markalara ilişkin bir hak vermez. Uygulamalarda
        kullanılan açık kaynak bileşenlerin lisansları uygulama içinde listelenir.
      </p>

      <H2>10. Değişiklikler ve uygulanacak hukuk</H2>
      <p>
        Bu koşulları güncelleyebiliriz; önemli değişiklikleri sitede duyururuz. Değişiklikler, yürürlük tarihinden önce
        ödediğiniz dönemi aleyhinize etkilemez. Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır; tüketici olarak
        yerleşim yerinizdeki zorunlu tüketici koruma hükümleri ve başvuru yolları saklıdır.
      </p>
    </LegalPage>
  );
}
