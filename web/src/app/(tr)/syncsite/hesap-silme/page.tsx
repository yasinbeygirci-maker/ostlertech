import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { SYNCSITE, TOMBSTONE_CANLI } from "@/lib/syncsite";

// SyncSite hesap silme sayfası (Google Play: uygulamaya dönmeden kullanılabilen web yolu). İngilizcesi: /en/syncsite/delete-account.
// Adres Play Veri güvenliği formuna ve uygulamaya (LegalLinks.ACCOUNT_DELETION) girilir; değiştirme.
const N = SYNCSITE.name;

export const metadata: Metadata = {
  title: `${N} Hesap ve Veri Silme`,
  description: `${N} (eski adı ${SYNCSITE.formerName}) hesabınızı uygulamadan ya da e-postayla nasıl sileceğiniz, ne zaman silineceği ve neyin kalacağı.`,
  alternates: { canonical: SYNCSITE.deletePath, languages: { tr: SYNCSITE.deletePath, en: SYNCSITE.deleteEnPath } },
};

const link = "text-primary hover:text-primary-light";

export default function SyncSiteDeletePage() {
  return (
    <LegalPage
      eyebrow={N}
      title={`${N} Hesap ve Veri Silme`}
      updatedOn={SYNCSITE.updatedTr}
      altLink={{ href: SYNCSITE.deleteEnPath, label: "English version" }}
    >
      <p>
        Bu sayfa, OstlerTech’in <strong className="text-foreground">{N}</strong> (eski adı {SYNCSITE.formerName}) uygulamasında açtığınız
        hesabı ve buluttaki verilerinizi nasıl silebileceğinizi anlatır. Hesapsız kullanıyorsanız bulutta verinizi tutmuyoruz;
        uygulamayı silmeniz ya da uygulama verilerini temizlemeniz yeter.
      </p>

      <H2>1. Uygulamadan silme (en hızlısı)</H2>
      <List>
        <li>{N}’ı açın ve hesabınızla giriş yapın.</li>
        <li><strong className="text-foreground">Ayarlar &gt; Hesabımı sil</strong> seçeneğine dokunun.</li>
        <li>
          Sahibi olduğunuz bir projede başka kişiler de varsa size ayrıca sorulur, çünkü o proje onlar için de silinecektir. Onaylamazsanız
          hiçbir şey silinmez.
        </li>
        <li>Onayınızdan sonra hesabınız ve sahibi olduğunuz projeler buluttan, ardından cihazdaki {N} verisi silinir.</li>
      </List>

      <H2>2. Uygulamaya erişemiyorsanız: e-postayla silme</H2>
      <p>
        Uygulamayı kaldırdıysanız, telefonunuza ya da şifrenize erişemiyorsanız hesabınızı e-postayla da sildirebilirsiniz:
      </p>
      <List>
        <li>
          <a href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`${N} hesap silme talebi`)}`} className={link}>{COMPANY.email}</a>{" "}
          adresine, <strong className="text-foreground">hesabınıza kayıtlı e-posta adresinden</strong> “{N} hesabımın silinmesini istiyorum”
          yazın. Başka bir adresten gelen talepte kimliğinizi doğrulamak için ek bilgi isteriz.
        </li>
        <li>Hesabın hangi projelerin sahibi olduğunu ve başka kişilerin bu projelerde olup olmadığını yazarsanız süreç hızlanır.</li>
        <li>
          Talebinizi aldığımızı bildiririz ve hesabınızı en geç <strong className="text-foreground">{SYNCSITE.deleteBusinessDays} iş günü</strong>{" "}
          içinde sileriz. Silme tamamlanınca size e-postayla haber veririz.
        </li>
      </List>
      <p>
        Hesap silmeyi KVKK md. 11 kapsamındaki bir başvuru olarak da yapabilirsiniz; başvurular en geç 30 gün içinde ücretsiz yanıtlanır.
        Posta ve KEP adresimiz <a href="/gizlilik" className={link}>Gizlilik ve KVKK</a> sayfasında ve{" "}
        <a href={SYNCSITE.privacyPath} className={link}>{N} gizlilik politikasında</a> yazılıdır.
      </p>

      <H2>3. Ne silinir</H2>
      <List>
        <li>Hesabınız: e-posta adresiniz, şifre özetiniz, hesap kimliğiniz, hesabın açıldığı (deneme başlangıcı) tarih ve kabul ettiğiniz beta şartı sürümü.</li>
        <li>Sahibi olduğunuz projeler ve altındaki her şey: konumlar, imalat kalemleri, hedefler, günlük kayıtlar, ekipler, üyelikler ve fotoğraflar.</li>
        <li>Proje üyeliklerinizin hepsi.</li>
        <li>Cihazınızdaki {N} veritabanı (uygulamadan silerseniz).</li>
      </List>

      <H2>4. Ne kalır, ne kadar</H2>
      <List>
        <li>
          <strong className="text-foreground">Başkasının projesine girdiğiniz kayıtlar</strong> o projenin sahibine aittir ve projede kalır; ancak sizinle
          bağlantısı (kaydı kimin girdiği) silinir.
        </li>
        <li>
          <strong className="text-foreground">Önceden tek tek sildiğiniz kayıtlar:</strong>{" "}
          {TOMBSTONE_CANLI
            ? "içerikleri ve fotoğrafları silinmiştir; hesap silinince satırlar da gider."
            : "1.2.1 ve sonrası sürümlerde içerikleri silinmiştir (daha eski sürümlerde içerik bulutta kalmış olabilir); sahibi olduğunuz bir projedeyse hesapla birlikte tamamen gider. Başkasının projesindeyse yalnız içeriksiz “silindi” satırı kalır."}
        </li>
        <li><strong className="text-foreground">Barındırma sağlayıcısının sunucu kayıtları</strong> (IP adresi, zaman): en fazla 1 gün, sonra kendiliğinden silinir.</li>
        <li><strong className="text-foreground">Yedekler:</strong> otomatik sunucu yedeği tutulmaz; silinen veri geri getirilemez. Silmeden önce önemli kayıtlarınızı uygulamadaki Excel/JSON dışa aktarma ile alın.</li>
        <li>
          <strong className="text-foreground">Bize yazdığınız destek e-postaları</strong> (silme talebiniz dahil): talep kapandıktan sonra 1 yıl. Silme
          işleminin yapıldığını gösteren kayıt kişisel veri içermeden (yalnız tarih ve işlem türü) saklanır.
        </li>
        <li><strong className="text-foreground">Fatura ve muhasebe kayıtları</strong> (yalnız ileride ücretli plan alırsanız): kanuni süre boyunca (10 yıl).</li>
        <li>
          <strong className="text-foreground">Kendi dışa aktardığınız dosyalar</strong> (Excel, PDF, JSON), aldığınız yedekler ve başkalarıyla paylaştıklarınız
          sizde ya da alıcıdadır; onları ayrıca silmeniz gerekir.
        </li>
      </List>
      <p>
        Hesabı sildikten sonra e-posta adresinizi ya da özetini <strong className="text-foreground">tutmayız</strong>; aynı adresle yeniden hesap
        açabilirsiniz.
      </p>

      <H2>5. Bulutta kalan verinizi hesabı silmeden temizlemek</H2>
      <p>
        Hesabınızı korumak ama bulut verinizi kaldırmak isterseniz, sahibi olduğunuz projeleri uygulamadan silebilir ya da{" "}
        <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a> adresine hangi verinin silinmesini istediğinizi yazabilirsiniz.
        {N}’ı hesapsız kullanmaya dönerseniz yeni verileriniz buluta gitmez.
      </p>

      <H2>6. İletişim</H2>
      <p>
        Silme sürecinde sorun yaşarsanız: <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>. Verilerin nasıl işlendiği için{" "}
        <a href={SYNCSITE.privacyPath} className={link}>{N} gizlilik politikasına</a> bakın.
      </p>
    </LegalPage>
  );
}
