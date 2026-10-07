import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY, DESKTOP_LICENSE, PADDLE_BUYER_TERMS_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Teslimat ve İade Politikası",
  description: "SyncPass Masaüstü Premium: elektronik teslimat, abonelik iptali ve 14 gün içinde koşulsuz iade.",
  alternates: { canonical: "/teslimat-ve-iade", languages: { tr: "/teslimat-ve-iade", en: "/en/refunds" } },
};

const link = "text-primary hover:text-primary-light";

export default function DeliveryRefundPage() {
  return (
    <LegalPage eyebrow="Yasal" title="Teslimat ve İade Politikası" altLink={{ href: "/en/refunds", label: "English version" }}>
      <p>
        Bu politika ostlertech.com üzerinden satın alınan {DESKTOP_LICENSE.name} lisansları için geçerlidir. Satışlarımızı
        yetkili satıcımız (<span lang="en">Merchant of Record</span>) Paddle.com yapar; ödeme ve iadeler Paddle tarafından
        yürütülür.
      </p>

      <H2>1. Teslimat</H2>
      <List>
        <li>Ürün dijitaldir; kargo yoktur.</li>
        <li>Ödeme tamamlanınca lisans kodunuz hemen, ödeme sonrası açılan sayfada gösterilir. Makbuzunuz Paddle'dan e-postanıza gelir.</li>
        <li>Kod sayfada görünmezse ya da kaybolursa, satın alırken kullandığınız e-postayla {COMPANY.email} adresine yazın; en geç 24 saat içinde iletiriz.</li>
      </List>

      <H2>2. {DESKTOP_LICENSE.refundDays} gün koşulsuz iade</H2>
      <p>
        Her ödeme için, ödeme tarihinden itibaren {DESKTOP_LICENSE.refundDays} gün içinde gerekçe göstermeden ücretin
        tamamını iade ederiz. Bu süre ilk satın alma için de abonelik yenilemeleri için de ayrı ayrı geçerlidir.
      </p>
      <p>İade istemek için şu yollardan birini kullanın:</p>
      <List>
        <li>Paddle'ın gönderdiği makbuz e-postasındaki bağlantıdan ya da <a href="https://paddle.net" target="_blank" rel="noopener" className={link}>paddle.net</a> üzerinden,</li>
        <li>ya da sipariş numaranızla {COMPANY.email} adresine yazarak; talebinizi Paddle'a biz iletiriz.</li>
      </List>
      <p>
        İade, ödemeyi yaptığınız yönteme Paddle tarafından yapılır; hesabınıza yansıma süresi bankanıza bağlıdır. İade
        edilen lisans devre dışı kalır ve uygulama ücretsiz sürüme geçer.
      </p>
      <p>
        {DESKTOP_LICENSE.refundDays} günden sonraki talepleri de, örneğin uygulama bilgisayarınızda çalışmıyorsa ya da
        aynı ödemeyi yanlışlıkla iki kez yaptıysanız, inceleyip iade ederiz.
      </p>

      <H2>3. Abonelik iptali</H2>
      <p>
        Aylık ya da yıllık aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal, ödediğiniz dönemin sonunda geçerli
        olur; sonraki dönem için ödeme alınmaz ve o güne kadar Premium kullanmaya devam edersiniz.
      </p>

      <H2>4. Lisans bitince</H2>
      <p>
        Lisansınız sona erdiğinde ya da iade edildiğinde uygulama ücretsiz sürüme geçer. Kasanız kilitlenmez: kayıtlarınızı
        görmeye, kopyalamaya, düzenlemeye ve dışa aktarmaya devam edersiniz.
      </p>

      <H2>5. Yasal haklarınız</H2>
      <p>
        Bu politika, bulunduğunuz ülkenin tüketici mevzuatının size tanıdığı hakları kısıtlamaz. Satın alma ayrıca{" "}
        <a href={PADDLE_BUYER_TERMS_URL} target="_blank" rel="noopener" className={link}>Paddle Alıcı Koşulları</a>'na tabidir.
      </p>
    </LegalPage>
  );
}
