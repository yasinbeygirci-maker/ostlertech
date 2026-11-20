import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SyncPass Gizlilik Politikası / Privacy Policy",
  description:
    "SyncPass (Android ve Masaüstü) gizlilik politikası: cihazda şifreleme, Google Drive yedeği ve üçüncü taraf hizmetler.",
  alternates: { canonical: "/syncpass/privacy" },
};

const EFFECTIVE_TR = "18 Kasım 2026";
const EFFECTIVE_EN = "18 November 2026";
const CONTACT_EMAIL = "destek@ostlertech.com";

function Section({ n, title, id, children }: { n: string; title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-32">
      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-4">
        <span className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-white font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] text-white/80">{children}</div>;
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-primary hover:underline break-words">
      {children}
    </a>
  );
}

function C({ children }: { children: ReactNode }) {
  return <code className="text-white/80 break-all">{children}</code>;
}

const list = "list-disc pl-6 space-y-2";

export default function SyncPassPrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent-purple/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-40 pb-24">
        <div className="space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <span lang="tr">Yasal Döküman</span><span aria-hidden="true">·</span><span lang="en">Legal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            SyncPass <span className="text-primary">Gizlilik Politikası</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted text-xs font-bold uppercase tracking-widest pt-2">
            <span><span lang="en">Android</span> · Masaüstü</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Yürürlük: {EFFECTIVE_TR}</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <a href="#en" lang="en" hrefLang="en" className="text-primary hover:underline">English version</a>
          </div>
        </div>

        {/* ---------------- TÜRKÇE ---------------- */}
        <div id="tr" lang="tr" className="space-y-16 text-white/50 leading-relaxed font-medium">
          <Section n="01" title="Özet">
            <Highlight>
              SyncPass bir şifre yöneticisidir. Kasanız, ana şifrenizden türetilen bir anahtarla kendi cihazınızda şifrelenir.
              OstlerTech kasanızı saklayan bir sunucu işletmez; ana şifrenizi ya da verilerinizi göremez, sıfırlayamaz veya kurtaramaz.
            </Highlight>
          </Section>

          <Section n="02" title="Cihazınızda saklanan veriler">
            <ul className={list}>
              <li>Girdiğiniz kasa kayıtları: giriş bilgileri, şifreler, notlar, ödeme kartları, banka hesapları, kimlik belgeleri, adresler, Wi-Fi anahtarları, kripto cüzdanları, doğrulayıcı (TOTP) gizli anahtarları ve geçiş anahtarları (passkey).</li>
              <li>Bu kayıtlar, ana şifrenizden türetilen bir anahtarla (PBKDF2) AES-256-GCM kullanılarak şifrelenir. Android&apos;de veritabanı ayrıca SQLCipher ile şifrelenir.</li>
              <li>Yerel bir güvenlik günlüğü (örneğin kilit açma denemeleri ve senkron sonuçları) ve uygulama ayarlarınız. Şifreli bir yedeğin ya da Android sistem yedeğinin (4. bölüm) parçası olmadıkça cihazınızdan çıkmaz.</li>
            </ul>
          </Section>

          <Section n="03" title="Google ile giriş ve Google Drive yedeği (isteğe bağlı)">
            <p>Bulut senkronunu açarsanız Google hesabınızla giriş yaparsınız ve SyncPass şu izinleri ister:</p>
            <ul className={list}>
              <li><C>openid</C>, <C>userinfo.email</C>, <C>userinfo.profile</C>: yedeğin hangi Google hesabına ait olduğunu belirlemek için.</li>
              <li><C>drive.appdata</C>: sizin Google Drive&apos;ınızdaki gizli uygulama verisi klasöründe tek bir yedek dosyası oluşturmak ve güncellemek için. SyncPass Drive&apos;ınızdaki diğer dosyaları göremez.</li>
            </ul>
            <p>Yedek, yüklenmeden önce cihazınızda şifrelenir. OstlerTech sunucularında değil, Google hesabınızda saklanır ve yalnızca ana şifrenizle çözülebilir.</p>
            <p>
              Yedeği istediğiniz zaman Google Drive&apos;dan silebilirsiniz: bilgisayarda drive.google.com&apos;da dişli simge → Ayarlar → Uygulamaları yönet → SyncPass&apos;in yanındaki Seçenekler → Gizli uygulama verilerini sil.
              SyncPass&apos;in erişimini <A href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</A> adresinden kaldırabilirsiniz.
            </p>
            <p>
              SyncPass&apos;in içinde Google Drive&apos;daki yedeği silen bir düğme yoktur. Android&apos;deki &quot;Bağlantıyı Kes&quot; düğmesi yalnızca SyncPass&apos;in o telefondaki Google oturumunu kapatır;
              Drive&apos;daki yedeği silmez ve Google hesabınızdaki erişim iznini kaldırmaz.
            </p>
            <p>
              SyncPass&apos;in Google API&apos;lerinden aldığı bilgileri kullanması ve başka bir uygulamaya aktarması, Sınırlı Kullanım (Limited Use) şartları dahil olmak üzere{" "}
              <A href="https://developers.google.com/terms/api-services-user-data-policy">Google API Hizmetleri Kullanıcı Verileri Politikası</A>&apos;na uygundur.
              Google API&apos;leri aracılığıyla alınan veriler yalnızca yedekleme ve senkron özelliği için kullanılır; reklam için kullanılmaz, satılmaz ve insanlar tarafından okunmaz.
            </p>
          </Section>

          <Section n="04" title="Çevrimiçi özellikler ve üçüncü taraf hizmetler">
            <p>Bazı özellikler dış hizmetlerle iletişim kurar. Yalnızca burada belirtilen veriler gönderilir.</p>
            <Sub title="Sızdırılmış şifre kontrolü (Have I Been Pwned)">
              <p>SyncPass, bir şifrenin SHA-1 özetinin yalnızca ilk 5 karakterini <C>api.pwnedpasswords.com</C> adresine gönderir ve sonuçları cihazınızda karşılaştırır. Şifrenin kendisi asla gönderilmez.</p>
            </Sub>
            <Sub title="E-posta sızıntı kontrolü (Android, premium, isteğe bağlı)">
              <p>Kendi Have I Been Pwned API anahtarınızı ekleyip bu kontrolü çalıştırırsanız, kasanızda kullanıcı adı olarak kayıtlı e-posta adresleri <C>haveibeenpwned.com</C> adresine gönderilir. Anahtar kayıtlıyken ve kasanız açıkken bu kontrol haftada bir kendiliğinden de çalışır. Kasanızda başka kişilere ait e-posta adresleri varsa onlar da gönderilir. Kontrolü durdurmak için API anahtarını Kişisel Bilgiler ekranından silin.</p>
            </Sub>
            <Sub title="Web sitesi simgeleri">
              <p>Logolar cihazdaki marka kütüphanesinden veya sizin seçtiğiniz görsellerden gösterilir. Kasanızdaki alan adları hiçbir simge hizmetine gönderilmez.</p>
            </Sub>
            <Sub title="IBAN algılama (Android)">
              <p>Kasanız açıkken SyncPass panonuzda bir IBAN olup olmadığını kontrol eder. Bu kontrol tamamen cihazınızda yapılır; pano içeriği hiçbir yere gönderilmez.</p>
            </Sub>
            <Sub title="Google Gemini kullanan isteğe bağlı özellikler (yalnızca Android; SyncPass Masaüstü'nde yoktur)">
              <ul className={list}>
                <li><strong className="text-white/80">Yardım ekranı:</strong> uygulama içi yardım ekranına yazdığınız serbest metin, hazır yanıtlarla karşılanmayan sorularda Google Gemini API&apos;sine gönderilir. Göndermeden önce kart numarası, e-posta adresi, IP adresi ve &quot;password: ...&quot; gibi ifadeler silinir; bu süzgeç her parolayı ya da kişisel bilgiyi yakalayamaz. Yardım ekranına parola veya kişisel bilgi yazmayın.</li>
                <li><strong className="text-white/80">Kasa güvenlik raporu (premium):</strong> yalnızca sayılar ve evet/hayır bilgileri gönderilir: güvenlik puanı, kayıt sayısı, zayıf, tekrar kullanılan ve sızmış şifre sayısı, e-posta sızıntı sayısı ile biyometrik kilidin, bulut senkronunun ve acil durum erişiminin açık olup olmadığı. Şifreler, kullanıcı adları, kayıt adları ve e-posta adresleri gönderilmez.</li>
              </ul>
              <p>
                Gemini&apos;ye gönderilen içerik, Google tarafından <A href="https://aistudio.google.com/docs/terms">Gemini API Ek Hizmet Şartları</A> kapsamında işlenir.
                Bu şartlar Google&apos;ın içeriği hizmetlerini geliştirmek için kullanmasına izin verebilir.
              </p>
            </Sub>
            <Sub title="Önceki sürümler (Android)">
              <p>18 Eylül 2026&apos;dan önce yayımlanan Android sürümlerinde, kasadaki web sitelerinin alan adları logolar için Google&apos;ın <C>www.google.com</C> üzerindeki simge hizmetine gönderiliyordu. Panoda bir IBAN bulunduğunda pano metni ayrıştırılmak üzere Gemini&apos;ye gönderiliyordu. Bu tarihten sonra yayımlanan sürümlerde bunların hiçbiri yapılmaz; uygulamayı güncellemenizi öneririz. Android&apos;in eski sürümlerinde bulunan kayıt paylaşım kodu özelliği uygulamadan kaldırılmıştır.</p>
            </Sub>
            <Sub title="Belge ve QR tarama (Android)">
              <p>Kart, kimlik ve QR kodu tarama, cihazınızda çalışan Google ML Kit ile yapılır; SyncPass bu görüntüleri yüklemez. ML Kit, Google&apos;a kişiyi tanımlamayan tanılama ve kullanım bilgileri (kurulum başına bir kimlik dahil) gönderebilir.</p>
            </Sub>
            <Sub title="Geçiş anahtarı (passkey) ve otomatik doldurma (Android)">
              <p>SyncPass, Google&apos;ın tarayıcı listesini <C>www.gstatic.com</C> adresinden yaklaşık 7 günde bir kendiliğinden indirir; bu istekle bir bilgi gönderilmez. Bir uygulama bir site adına geçiş anahtarı isterse, SyncPass o sitenin herkese açık <C>/.well-known/assetlinks.json</C> dosyasını o siteden okur. Kasa içeriği gönderilmez.</p>
            </Sub>
            <Sub title="Android sistem yedeği (Android)">
              <p>
                Telefonunuzda Android&apos;in kendi otomatik yedeği açıksa Android, Google hesabınıza uygulama ayarlarınızı, ana şifrenizi doğrulamak için kullanılan tuz ve doğrulama değerini ve kurtarma anahtarı oluşturduysanız kurtarma anahtarıyla sarılmış kasa anahtarını yedekleyebilir.
                Kasa veritabanı bu yedeğe girmez; ana şifreniz de girmez. Yedeği ele geçiren biri tuz ve doğrulama değeriyle ana şifre tahmini deneyebilir (her deneme 600.000 turluk anahtar türetme maliyetindedir); sarılı kasa anahtarı ise kurtarma QR kodunuz olmadan açılmaz.
                Bu yedeği Android&apos;in yedekleme ayarlarından kapatabilirsiniz.
              </p>
            </Sub>
            <Sub title="Satın almalar ve masaüstü kodu (Android)">
              <p>Premium satın almalar Google Play Faturalandırma ile yapılır; ödeme bilgilerinizi biz görmeyiz.</p>
              <p>
                Ayarlar&apos;daki &quot;Masaüstünde de kullan&quot; ekranında &quot;Kodumu al&quot; düğmesine dokunduğunuzda uygulama, SyncPass Masaüstü için lisans kodunuzu
                üretebilmek üzere sunucumuza (ostlertech.com) Google Play satın alma jetonunu, aldığınız Premium ürününü (aylık, yıllık ya da ömür boyu) ve uygulama sürümünü gönderir.
                Bu istek yalnızca siz bu düğmeye dokunduğunuzda gider; cihaz numarası, Google hesabınızın adı ya da e-posta adresi ve kasanızın içeriği gönderilmez. Kod telefonunuza kaydedilmez.
              </p>
              <p>
                Sunucumuz satın almanın geçerli olup olmadığını Google Play&apos;e sorar ve satın almanıza bağlı bir lisans kaydı tutar: lisans kodu, plan, durum ve dönem sonu,
                satın alma jetonu (Google Play&apos;e yeniden sorabilmek için), Google Play&apos;in son bildirdiği durum ve sorgu tarihi; abonelik yenilendiğinde ya da plan değiştiğinde
                önceki jetonların yalnızca tek yönlü özeti. İade ve iptalleri görebilmek için sunucumuz günde bir kez Google Play&apos;in iade listesini okur; masaüstü lisansınız
                yenilenirken kayıt bir günden eskiyse satın almayı Google Play&apos;e yeniden sorar.
              </p>
            </Sub>
            <Sub title="Çökme raporları (Windows ve Android)">
              <ul className={list}>
                <li><strong className="text-white/80">Windows:</strong> SyncPass Masaüstü çökerse, Windows ayarlarınıza bağlı olarak Windows Hata Raporlama (Windows Error Reporting) çökmeyle ilgili teknik bilgileri Microsoft&apos;a gönderebilir. Microsoft bu bilgilerin bir kısmını Windows Desktop Application Program kapsamında bize sunar.</li>
                <li><strong className="text-white/80">Android:</strong> Google Play, Android&apos;in topladığı çökme ve donma bilgilerini (cihaz modeli, Android sürümü, hata kaydı) bize gösterir.</li>
              </ul>
              <p>
                Bu bilgileri yalnızca hataları bulmak ve düzeltmek için kullanırız; kimseyle paylaşmayız ve sizi tanımak için kullanmayız. Genellikle yalnızca hata
                sayılarına, sürüme, hata koduna ve hatanın oluştuğu kod satırlarına bakarız. Bir hatayı çözmek için kişisel bilgi içerebilecek bir veriyi (ör. bellek
                dökümü) incelememiz gerekirse onu en fazla 30 gün, şifreli ve yalnızca geliştiricinin erişebildiği bir yerde tutar, sonra sileriz. SyncPass Masaüstü,
                kasa içeriğinin çökme dosyalarına girmemesi için bellek dökümü almaz ve kendi çökme kayıtlarını bilgisayarınızda en fazla 30 gün tutar.
              </p>
            </Sub>
            <Sub title="Tarayıcı eklentisi ve otomatik yazma (Masaüstü)">
              <p>
                SyncPass tarayıcı eklentisi (Chrome) kayıtlarınızı doğrudan bilgisayarınızdaki SyncPass Masaüstü
                uygulamasından alır; bu bağlantı tarayıcının yerel ileti kanalıyla ve yalnızca aynı bilgisayarda (127.0.0.1)
                kurulur, internete çıkmaz ve bize hiçbir veri gelmez. Eklenti, açık sayfanın adresini yalnızca o siteye ait
                kayıtları bulmak için masaüstü uygulamasına iletir; şifre yalnızca o siteye ait bir kaydı seçtiğinizde ve
                kasanız açıkken verilir. Kasa kilitliyken eklenti hiçbir bilgi alamaz. Eklenti tarama geçmişi toplamaz,
                analiz ya da reklam amaçlı veri göndermez.
              </p>
              <p>
                Otomatik yazma kısayolları, öndeki pencerenin başlığına bakarak uygun kaydı bulur ve klavyeden yazar gibi
                doldurur; pano kullanılmaz, hiçbir bilgi bilgisayardan çıkmaz.
              </p>
            </Sub>
            <Sub title="Premium lisansı (Masaüstü)">
              <p>
                SyncPass Masaüstü&apos;nde Premium üç yoldan açılır: ostlertech.com üzerinden yetkili satıcımız Paddle.com aracılığıyla satın alınan lisans kodu,
                Google Play&apos;den alınan Premium için Android uygulamasında gösterilen kod (yukarıda) ya da Microsoft Store sürümünde Microsoft Store&apos;dan alınan Premium.
                Lisans kodu girdiğinizde uygulama, lisansı doğrulamak için o anda ve sonra yaklaşık haftada bir (kasanızı açtığınızda, son doğrulamanın üzerinden bir hafta
                geçtiyse) sunucumuza yalnızca lisans kodunu, kendi ürettiği rastgele bir cihaz numarasını ve uygulama sürümünü gönderir. Sunucumuz bir kodu en fazla
                3 bilgisayarda kabul eder; bunun için bu cihaz numaralarını, uygulama sürümünü ve son doğrulama tarihini lisans kaydında tutar. Microsoft Store&apos;dan alınan
                Premium&apos;u uygulama Microsoft Store&apos;a sorar; bu durumda sunucumuza bir şey gönderilmez. Kasanızın içeriği hiçbir durumda gönderilmez. Ücretsiz
                sürüm bu sunucuya hiç bağlanmaz.
              </p>
              <p>
                Lisans kayıtları (satın alma jetonu ve cihaz kayıtları dahil) lisans sürdüğü sürece ve lisansın bitiminden, iadesinden ya da iptalinden sonra 1 yıl
                saklanır, sonra silinir. Bir bilgisayarı uygulamadaki &quot;Bu bilgisayardan kaldır&quot; ile kaldırdığınızda o bilgisayarın cihaz kaydı hemen silinir.
              </p>
            </Sub>
            <Sub title="Sunucumuz, hizmet sağlayıcılarımız, yurt dışına aktarım ve hukuki sebepler">
              <p>
                Lisans ve masaüstü kodu hizmetimiz Vercel Inc. (ABD) altyapısında çalışır; lisans kayıtları Supabase Pte. Ltd.&apos;nin (Singapur şirketi) İrlanda&apos;daki (AB)
                veritabanı sunucularında saklanır. Satın almanın doğrulanması için satın alma jetonu Google LLC&apos;nin (ABD) Google Play Developer API&apos;sine gönderilir.
                Bağlantı sırasında IP adresiniz Vercel&apos;in güvenlik ve hata ayıklama için tuttuğu kısa süreli sunucu kayıtlarında görünür ve kötüye kullanıma karşı koruma için kullanılır.
              </p>
              <p>
                Bu hizmetlerin bir kısmı yurt dışındadır; verileriniz bu nedenle yurt dışında işlenir ve tutulur.
              </p>
              <p>
                Bu verileri, satın aldığınız Premium&apos;u diğer cihazlarınızda kullanabilmeniz için sözleşmenin ifasına (KVKK md. 5/2-c) ve iade edilmiş, iptal edilmiş ya da
                sahte satın almaların lisans açmasını önlemedeki meşru menfaatimize (KVKK md. 5/2-f) dayanarak işleriz.
              </p>
            </Sub>
          </Section>

          <Section n="05" title="Yapmadıklarımız">
            <ul className={list}>
              <li>Reklam göstermeyiz; reklam veya analiz amaçlı izleme yazılımları kullanmayız.</li>
              <li>Verilerinizi satmayız, kiralamayız; veriler yalnızca bu metinde sayılan hizmetlere gider.</li>
              <li>SyncPass'i kullanmak için SyncPass'e kayıt olmanız gerekmez; kasanızın kopyası sunucularımızda tutulmaz.</li>
            </ul>
          </Section>

          <Section n="06" title="Acil durum erişimi">
            <p>Acil durum erişimi bu sürümde güvendiğiniz kişiye kasanıza erişim vermez ve bu özellik için cihazınızdan veri çıkmaz. Girdiğiniz acil durum kişisinin e-posta adresi yalnızca telefonunuzda, uygulamanın özel alanında saklanır.</p>
          </Section>

          <Section n="07" title="Saklama ve silme" id="silme">
            <p>Cihazınızdaki verileriniz, siz silene, uygulamayı sıfırlayana veya kaldırana kadar cihazınızda kalır. Bu verileri biz tutmadığımız için sizin adınıza silemez veya dışa aktaramayız; bunları kendiniz yaparsınız:</p>
            <ul className={list}>
              <li>Cihazınızdaki kayıtları uygulama içinden silebilirsiniz. Android&apos;de kasanızı şifreli bir yedek dosyası olarak dışa da aktarabilirsiniz; SyncPass Masaüstü&apos;nde dosyaya dışa aktarma yoktur.</li>
              <li>Google Drive&apos;daki bulut yedeği uygulama içinden silinmez. Kasayı sıfırlamak, &quot;Bağlantıyı Kes&quot; düğmesi ya da uygulamayı kaldırmak da onu silmez. Yedek, siz 3. bölümdeki yoldan Google Drive&apos;dan silene kadar Google Drive&apos;ınızda kalır.</li>
              <li>Uygulamayı kaldırmak ya da verilerinizi silmek Google Play&apos;deki Premium aboneliğinizi iptal etmez; aboneliği Google Play&apos;den iptal edersiniz.</li>
              <li>Sunucumuzdaki lisans kayıtları (4. bölüm) bu yollarla silinmez. Silinmelerini istemek için lisans kodunuzla birlikte {CONTACT_EMAIL} adresine yazın; en geç 30 gün içinde sileriz. Bu kodla açılmış bilgisayarlar bir sonraki doğrulamada ücretsiz sürüme geçer; etkin Google Play Premium&apos;unuz varsa &quot;Kodumu al&quot; ile yeni bir kod alabilirsiniz.</li>
            </ul>
            <p>Çökme raporlarından elimize geçebilecek kişisel bilgileri en fazla 30 gün tutar, sonra sileriz (4. bölüm).</p>
          </Section>

          <Section n="08" title="Güvenlik">
            <p>Sektör standardı şifreleme kullanırız ve ana şifrenizi asla saklamayız. Ana şifrenizi unutursanız verileriniz, OstlerTech dahil hiç kimse tarafından kurtarılamaz.</p>
          </Section>

          <Section n="09" title="Çocuklar">
            <p>SyncPass 18 yaşından küçük kişilere yönelik değildir ve bilerek onların verilerini toplamayız.</p>
          </Section>

          <Section n="10" title="Haklarınız">
            <p>Bulunduğunuz yere göre (örneğin KVKK veya GDPR kapsamında) kişisel verilerinize erişme, bunları düzeltme ve silme haklarınız vardır. Kasanız cihazlarınızda ve kendi Google hesabınızda saklandığı için bu hakları kendiniz kullanırsınız: cihazınızdaki kayıtlar için uygulama içinden, Google Drive&apos;daki yedek için 3. bölümdeki Google Drive yolundan. Sunucumuzdaki lisans kayıtları (4. bölüm) için bu hakları aşağıdaki adrese yazarak kullanırsınız; en geç 30 gün içinde yanıtlarız. Her türlü sorunuz için de aynı adresten bize ulaşabilirsiniz.</p>
          </Section>

          <Section n="11" title="Değişiklikler">
            <p>Bu politikayı güncelleyebiliriz. Güncellemelerde yukarıdaki yürürlük tarihini değiştirir, önemli değişiklikleri uygulama içinde bildiririz.</p>
            <p>18 Kasım 2026 güncellemesi: lisans kayıtlarının Supabase&apos;in Avrupa Birliği&apos;ndeki (İrlanda) sunucularında, yani yurt dışında tutulduğu yurt dışı aktarım bölümünde belirtildi.</p>
            <p>17 Kasım 2026 güncellemesi: Android uygulamasındaki &quot;Masaüstünde de kullan&quot; ekranının sunucumuza gönderdiği bilgiler, sunucumuzdaki lisans kaydının içeriği ve saklama süresi, Microsoft Store Premium&apos;u, hizmet sağlayıcılarımız, yurt dışına aktarım, hukuki sebepler ve lisans kayıtlarının silinmesini isteme yolu eklendi (4., 7. ve 10. bölümler).</p>
            <p>10 Kasım 2026 güncellemesi: Google Drive&apos;daki yedeğin uygulama içinden değil Google Drive&apos;dan silindiği (silme yolu uygulamadaki anlatımla aynı yazıldı), &quot;Bağlantıyı Kes&quot; düğmesinin yedeği silmediği, SyncPass Masaüstü&apos;nde dosyaya dışa aktarma olmadığı ve uygulamayı kaldırmanın Google Play aboneliğini iptal etmediği açıkça yazıldı (3., 7. ve 10. bölümler).</p>
            <p>30 Ekim 2026 güncellemesi: Android sistem yedeği ve geçiş anahtarı bağlantıları eklendi; kasa raporu ve yardım ekranının Gemini&apos;ye ne gönderdiği koda uygun olarak düzeltildi; Play Integrity ve kayıt paylaşım kodu anlatımları kaldırıldı; iletişim adresi güncellendi.</p>
          </Section>

          <Section n="12" title="İletişim">
            <p>OstlerTech · <A href="https://www.ostlertech.com">www.ostlertech.com</A> · <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A></p>
          </Section>
        </div>

        {/* ---------------- ENGLISH ---------------- */}
        <div id="en" lang="en" className="space-y-16 text-white/50 leading-relaxed font-medium mt-24 pt-16 border-t border-white/5">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              SyncPass <span className="text-primary">Privacy Policy</span>
            </h2>
            <p className="text-muted text-xs font-bold uppercase tracking-widest">Android · Desktop · Effective {EFFECTIVE_EN}</p>
          </div>

          <Section n="01" title="Summary">
            <Highlight>
              SyncPass is a password manager. Your vault is encrypted on your own device with a key derived from your master password.
              OstlerTech does not run servers that store your vault, and we cannot see, reset or recover your master password or your data.
            </Highlight>
          </Section>

          <Section n="02" title="Data stored on your device">
            <ul className={list}>
              <li>Vault items you enter: logins, passwords, notes, payment cards, bank accounts, identity documents, addresses, Wi-Fi keys, crypto wallets, authenticator (TOTP) secrets and passkeys.</li>
              <li>These items are encrypted with AES-256-GCM using a key derived from your master password (PBKDF2). On Android the database is additionally encrypted with SQLCipher.</li>
              <li>A local security log (for example unlock attempts and sync results) and your app settings. They never leave your device unless they are part of an encrypted backup or the Android system backup (section 4).</li>
            </ul>
          </Section>

          <Section n="03" title="Google Sign-In and Google Drive backup (optional)">
            <p>If you turn on cloud sync, you sign in with your Google account and SyncPass requests these permissions:</p>
            <ul className={list}>
              <li><C>openid</C>, <C>userinfo.email</C>, <C>userinfo.profile</C>: to identify which Google account the backup belongs to.</li>
              <li><C>drive.appdata</C>: to create and update one backup file in the hidden application-data folder of your Google Drive. SyncPass cannot see any of your other Drive files.</li>
            </ul>
            <p>The backup is encrypted on your device before it is uploaded. It is stored in your Google account, not on OstlerTech servers, and it can only be decrypted with your master password.</p>
            <p>
              You can delete the backup at any time in Google Drive: on a computer at drive.google.com, gear icon → Settings → Manage apps → Options next to SyncPass → Delete hidden app data. You can remove SyncPass&apos;s access at{" "}
              <A href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</A>.
            </p>
            <p>
              SyncPass has no button that deletes the backup in Google Drive. &quot;Disconnect&quot; on Android only signs SyncPass out of Google on that phone;
              it does not delete the backup in Drive and does not remove SyncPass&apos;s access from your Google account.
            </p>
            <p>
              SyncPass&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
              <A href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</A>, including the Limited Use requirements.
              Data obtained through Google APIs is used only to provide the backup and sync feature; it is not used for advertising, not sold, and not read by people.
            </p>
          </Section>

          <Section n="04" title="Online features and third-party services">
            <p>Some features contact outside services. Only the data described here is sent.</p>
            <Sub title="Leaked password check (Have I Been Pwned)">
              <p>SyncPass sends only the first 5 characters of the SHA-1 hash of a password to <C>api.pwnedpasswords.com</C> and compares the results on your device. The password itself is never sent.</p>
            </Sub>
            <Sub title="Email breach check (Android, premium, optional)">
              <p>If you add your own Have I Been Pwned API key and run this check, email addresses saved as usernames in your vault are sent to <C>haveibeenpwned.com</C>. While a key is saved and your vault is unlocked, this check also runs automatically once a week. If your vault contains other people&apos;s email addresses, those are sent too. To stop it, remove the API key on the Personal Info screen.</p>
            </Sub>
            <Sub title="Website icons">
              <p>Logos come from a brand library on your device or from images you pick. The domain names in your vault are never sent to an icon service.</p>
            </Sub>
            <Sub title="IBAN detection (Android)">
              <p>While your vault is unlocked, SyncPass checks whether your clipboard contains an IBAN. This check runs entirely on your device; clipboard content is never sent anywhere.</p>
            </Sub>
            <Sub title="Optional features using Google Gemini (Android app only; not in SyncPass Desktop)">
              <ul className={list}>
                <li><strong className="text-white/80">Help screen:</strong> the free text you type in the in-app help screen is sent to the Google Gemini API when a question is not answered by the built-in replies. Before sending, card numbers, email addresses, IP addresses and expressions such as &quot;password: ...&quot; are removed; this filter cannot catch every password or piece of personal information. Do not type passwords or personal information into the help screen.</li>
                <li><strong className="text-white/80">Vault security report (premium):</strong> only numbers and yes/no values are sent: the security score, the number of items, the number of weak, reused and leaked passwords, the email breach count, and whether biometric unlock, cloud sync and emergency access are turned on. Passwords, usernames, item names and email addresses are not sent.</li>
              </ul>
              <p>
                Content sent to Gemini is processed by Google under the <A href="https://aistudio.google.com/docs/terms">Gemini API Additional Terms of Service</A>,
                which may allow Google to use it to improve its services.
              </p>
            </Sub>
            <Sub title="Earlier versions (Android)">
              <p>In Android versions released before 18 September 2026, the domain names of websites in your vault were sent to Google&apos;s favicon service at <C>www.google.com</C> to show logos, and clipboard text containing an IBAN was sent to Gemini to be parsed. Versions released after that date do neither; we recommend updating the app. The record share-code feature of older Android versions has been removed from the app.</p>
            </Sub>
            <Sub title="Document and QR scanning (Android)">
              <p>Card, ID and QR code scanning uses Google ML Kit on your device; SyncPass does not upload these images. ML Kit may send diagnostic and usage information that does not identify you (including a per-installation identifier) to Google.</p>
            </Sub>
            <Sub title="Passkeys and autofill (Android)">
              <p>SyncPass automatically downloads Google&apos;s browser list from <C>www.gstatic.com</C> about once every 7 days; nothing is sent with this request. If an app asks for a passkey for a website, SyncPass reads that site&apos;s public <C>/.well-known/assetlinks.json</C> file from the site. No vault content is sent.</p>
            </Sub>
            <Sub title="Android system backup (Android)">
              <p>
                If Android&apos;s own automatic backup is turned on on your phone, Android may back up to your Google account your app settings, the salt and verification value used to check your master password, and, if you created a recovery key, the vault key wrapped with that recovery key.
                The vault database is not included in this backup, and neither is your master password. Someone who obtains the backup could try to guess the master password using the salt and verification value (each guess costs 600,000 rounds of key derivation); the wrapped vault key cannot be opened without your recovery QR code.
                You can turn this backup off in Android&apos;s backup settings.
              </p>
            </Sub>
            <Sub title="Purchases and the desktop code (Android)">
              <p>Premium purchases are handled by Google Play Billing; we do not see your payment details.</p>
              <p>
                When you tap &quot;Get my code&quot; on the &quot;Use on desktop too&quot; screen in Settings, the app sends our server (ostlertech.com) your Google Play purchase token,
                the Premium product you bought (monthly, yearly or lifetime) and the app version, so that it can create your license code for SyncPass Desktop.
                This request is sent only when you tap that button; no device number, no Google account name or email address and no vault content is sent. The code is not saved on your phone.
              </p>
              <p>
                Our server asks Google Play whether the purchase is valid and keeps a license record linked to your purchase: the license code, plan, status and period end,
                the purchase token (so it can ask Google Play again), the status Google Play last reported and the date of that check; when a subscription renews or the plan changes,
                only a one-way digest of the earlier tokens. To see refunds and cancellations, our server reads Google Play&apos;s refund list once a day, and when your desktop
                license is renewed and the record is more than a day old it asks Google Play about the purchase again.
              </p>
            </Sub>
            <Sub title="Crash reports (Windows and Android)">
              <ul className={list}>
                <li><strong className="text-white/80">Windows:</strong> if SyncPass for Windows crashes, Windows Error Reporting may send technical crash information to Microsoft, depending on your Windows settings. Microsoft makes part of this information available to us through the Windows Desktop Application Program.</li>
                <li><strong className="text-white/80">Android:</strong> Google Play shows us crash and freeze information collected by Android (device model, Android version, error log).</li>
              </ul>
              <p>
                We use this information only to find and fix bugs; we do not share it and do not use it to identify you. Usually we only look at error counts, version,
                error code and the code lines where the error happened. If we need to examine data that may contain personal information (such as a memory dump) to fix
                a bug, we keep it for at most 30 days, encrypted and accessible only to the developer, and then delete it. SyncPass for Windows does not write memory
                dumps, so vault contents stay out of crash files, and keeps its own crash logs on your computer for at most 30 days.
              </p>
            </Sub>
            <Sub title="Browser extension and auto-type (Desktop)">
              <p>
                The SyncPass browser extension (Chrome) gets your logins directly from the SyncPass desktop app on your
                computer, through the browser&apos;s native messaging channel and only on the same computer (127.0.0.1); nothing
                goes over the internet and nothing reaches us. The extension passes the address of the open page to the desktop
                app only to find the logins for that site; a password is given only when you choose a login for that site and
                your vault is open. While the vault is locked the extension gets nothing. The extension does not collect browsing
                history and sends no analytics or advertising data.
              </p>
              <p>
                Auto-type shortcuts find the matching login from the title of the front window and type it as if from the
                keyboard; the clipboard is not used and nothing leaves your computer.
              </p>
            </Sub>
            <Sub title="Premium license (Desktop)">
              <p>
                Premium in SyncPass for Windows can be turned on in three ways: a license key bought on ostlertech.com through our reseller and Merchant of Record, Paddle.com;
                the code shown in the Android app for Premium bought on Google Play (see above); or, in the Microsoft Store version, Premium bought from the Microsoft Store.
                Once you enter a license key, the app checks it with our server at that moment and then about once a week (when you unlock your vault and the last check is
                more than a week old), sending only the license key, a random device number it generated itself and the app version. Our server accepts a key on up to
                3 computers; for this it keeps these device numbers, the app version and the date of the last check in the license record. For Premium bought from the
                Microsoft Store the app asks the Microsoft Store, and nothing is sent to our server. Your vault contents are never sent. The free version never contacts this server.
              </p>
              <p>
                License records (including the purchase token and device records) are kept while the license lasts and for 1 year after it ends, is refunded or is cancelled,
                and are then deleted. When you remove a computer with &quot;Remove from this computer&quot; in the app, that computer&apos;s device record is deleted at once.
              </p>
            </Sub>
            <Sub title="Our server, service providers, transfers abroad and legal bases">
              <p>
                Our license and desktop-code service runs on Vercel Inc. (USA) infrastructure; license records are stored on database servers of Supabase Pte. Ltd.
                (a Singapore company) in Ireland (EU). To verify a purchase, the purchase token is sent to the Google Play Developer API of Google LLC (USA).
                During the connection your IP address appears in the short-lived server logs Vercel keeps for security and debugging and is used to protect against abuse.
              </p>
              <p>
                Some of these services are located abroad; your data is therefore processed and stored abroad.
              </p>
              <p>
                We process this data to perform our contract with you, so that you can use the Premium you bought on your other devices (KVKK Art. 5(2)(c)), and on the basis
                of our legitimate interest in keeping refunded, cancelled or fake purchases from unlocking a license (KVKK Art. 5(2)(f)).
              </p>
            </Sub>
          </Section>

          <Section n="05" title="What we do not do">
            <ul className={list}>
              <li>We do not show ads and do not include advertising or analytics tracking SDKs.</li>
              <li>We do not sell or rent your data; data goes only to the services listed in this policy.</li>
              <li>You do not need to register with SyncPass to use it, and a copy of your vault is not kept on our servers.</li>
            </ul>
          </Section>

          <Section n="06" title="Emergency access">
            <p>In this version, emergency access does not give the person you trust access to your vault, and no data leaves your device for this feature. The emergency contact email you enter is stored only on your phone, in the app&apos;s private storage.</p>
          </Section>

          <Section n="07" title="Retention and deletion" id="deletion">
            <p>The data on your device stays there until you delete it, reset the app or uninstall it. Because we do not hold this data, we cannot delete or export it for you; you do this yourself:</p>
            <ul className={list}>
              <li>You can delete the items on your device within the app. On Android you can also export your vault as an encrypted backup file; SyncPass Desktop has no export to a file.</li>
              <li>The cloud backup in Google Drive cannot be deleted from within the app, and resetting the vault, the &quot;Disconnect&quot; button or uninstalling the app does not delete it either. It stays in your Google Drive until you delete it there as described in section 3.</li>
              <li>Uninstalling the app or deleting your data does not cancel a Premium subscription on Google Play; you cancel it in Google Play.</li>
              <li>License records on our server (section 4) are not deleted this way. To ask us to delete them, write to {CONTACT_EMAIL} with your license key; we delete them within 30 days at the latest. Computers unlocked with that key switch to the free version at their next check; if you have an active Google Play Premium you can get a new key with &quot;Get my code&quot;.</li>
            </ul>
            <p>Personal information that may reach us through crash reports is kept for at most 30 days and then deleted (section 4).</p>
          </Section>

          <Section n="08" title="Security">
            <p>We use industry-standard encryption and never store your master password. If you forget your master password, your data cannot be recovered, including by OstlerTech.</p>
          </Section>

          <Section n="09" title="Children">
            <p>SyncPass is not directed at anyone under 18 and we do not knowingly collect their data.</p>
          </Section>

          <Section n="10" title="Your rights">
            <p>Depending on where you live (for example under the GDPR or Turkey&apos;s KVKK), you have rights to access, correct and delete your personal data. Since your vault is stored on your devices and in your own Google account, you exercise these rights yourself: within the app for the items on your devices, and in Google Drive, as described in section 3, for the backup stored there. For the license records on our server (section 4) you exercise these rights by writing to the address below; we reply within 30 days at the latest. For any other question, contact us at the same address.</p>
          </Section>

          <Section n="11" title="Changes">
            <p>We may update this policy. We will change the effective date above and, for significant changes, notify you in the app.</p>
            <p>Update of 18 November 2026: stated in the transfers section that license records are stored on Supabase&apos;s servers in the European Union (Ireland), that is, outside Türkiye.</p>
            <p>Update of 17 November 2026: added what the &quot;Use on desktop too&quot; screen of the Android app sends to our server, what the license record on our server contains and how long it is kept, Premium from the Microsoft Store, our service providers, transfers abroad, the legal bases and how to ask for license records to be deleted (sections 4, 7 and 10).</p>
            <p>Update of 10 November 2026: made clear that the backup in Google Drive is deleted in Google Drive, not within the app (the steps now match the app&apos;s own instructions), that the &quot;Disconnect&quot; button does not delete it, that SyncPass Desktop has no export to a file, and that uninstalling the app does not cancel a Google Play subscription (sections 3, 7 and 10).</p>
            <p>Update of 30 October 2026: added the Android system backup and passkey connections; corrected what the vault report and help screen send to Gemini to match the code; removed the Play Integrity and record share-code descriptions; updated the contact address.</p>
          </Section>

          <Section n="12" title="Contact">
            <p>OstlerTech · <A href="https://www.ostlertech.com">www.ostlertech.com</A> · <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A></p>
          </Section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
