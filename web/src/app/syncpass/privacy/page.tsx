import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SyncPass Gizlilik Politikası / Privacy Policy | OstlerTech",
  description:
    "SyncPass (Android ve Masaüstü) gizlilik politikası: cihazda şifreleme, Google Drive yedeği ve üçüncü taraf hizmetler.",
};

const EFFECTIVE_TR = "18 Eylül 2026";
const EFFECTIVE_EN = "18 September 2026";
const CONTACT_EMAIL = "yasin@ostlertech.com";

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Yasal Döküman · Legal
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            SyncPass <span className="text-primary">Gizlilik Politikası</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest pt-2">
            <span>Android · Masaüstü</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Yürürlük: {EFFECTIVE_TR}</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <a href="#en" className="text-primary hover:underline">English version</a>
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
              <li>Yerel bir güvenlik günlüğü (örneğin kilit açma denemeleri ve senkron sonuçları) ve uygulama ayarlarınız. Şifreli bir yedeğin parçası olmadıkça cihazınızdan çıkmaz.</li>
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
              Yedeği istediğiniz zaman Google Drive&apos;dan silebilirsiniz (Ayarlar → Uygulamaları yönet → SyncPass → Gizli uygulama verilerini sil).
              SyncPass&apos;in erişimini <A href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</A> adresinden kaldırabilirsiniz.
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
              <p>Kendi Have I Been Pwned API anahtarınızı ekleyip bu kontrolü çalıştırırsanız, kasanızda kullanıcı adı olarak kayıtlı e-posta adresleri <C>haveibeenpwned.com</C> adresine gönderilir.</p>
            </Sub>
            <Sub title="Web sitesi simgeleri">
              <p>Logolar cihazdaki marka kütüphanesinden veya sizin seçtiğiniz görsellerden gösterilir. Kasanızdaki alan adları hiçbir simge hizmetine gönderilmez.</p>
            </Sub>
            <Sub title="IBAN algılama (Android)">
              <p>Kasanız açıkken SyncPass panonuzda bir IBAN olup olmadığını kontrol eder. Bu kontrol tamamen cihazınızda yapılır; pano içeriği hiçbir yere gönderilmez.</p>
            </Sub>
            <Sub title="Google Gemini ile yapay zekâ özellikleri (Android)">
              <ul className={list}>
                <li><strong className="text-white/80">Destek sohbeti:</strong> uygulama içi asistana yazdığınız mesajlar Google Gemini API&apos;sine gönderilir.</li>
                <li><strong className="text-white/80">Güvenlik analizi (premium):</strong> yalnızca şifre özellikleri (uzunluk ve hangi karakter türlerinin kullanıldığı) ile kasanız hakkındaki özet sayılar gönderilir. Şifreler, kullanıcı adları ve kayıt adları gönderilmez.</li>
              </ul>
              <p>
                Gemini&apos;ye gönderilen içerik, Google tarafından <A href="https://ai.google.dev/gemini-api/terms">Gemini API Ek Hizmet Şartları</A> kapsamında işlenir.
                Bu şartlar Google&apos;ın içeriği hizmetlerini geliştirmek için kullanmasına izin verebilir.
              </p>
            </Sub>
            <Sub title="Önceki sürümler (Android)">
              <p>18 Eylül 2026&apos;dan önce yayımlanan Android sürümlerinde, kasadaki web sitelerinin alan adları logolar için Google&apos;ın <C>www.google.com</C> üzerindeki simge hizmetine gönderiliyordu. Panoda bir IBAN bulunduğunda pano metni ayrıştırılmak üzere Gemini&apos;ye gönderiliyordu. Bu tarihten sonra yayımlanan sürümlerde bunların hiçbiri yapılmaz; uygulamayı güncellemenizi öneririz.</p>
            </Sub>
            <Sub title="Belge ve QR tarama (Android)">
              <p>Kart, kimlik ve QR kodu tarama, cihazınızda çalışan Google ML Kit ile yapılır; SyncPass bu görüntüleri yüklemez. ML Kit, Google&apos;a anonim tanılama ve kullanım bilgileri gönderebilir.</p>
            </Sub>
            <Sub title="Satın almalar ve uygulama bütünlüğü (Android)">
              <p>Premium satın almalar Google Play Faturalandırma ile yapılır; biz ödeme bilgilerinizi değil, yalnızca satın alma durumunu görürüz. Uygulamanın gerçek bir cihazda çalıştığını doğrulamak için Google Play Integrity kullanılır.</p>
            </Sub>
            <Sub title="Tarayıcı entegrasyonu (Masaüstü)">
              <p>Etkinleştirildiğinde masaüstü tarayıcı köprüsü yalnızca aynı bilgisayardan (127.0.0.1) gelen bağlantıları kabul eder; ağdan erişilemez.</p>
            </Sub>
          </Section>

          <Section n="05" title="Yapmadıklarımız">
            <ul className={list}>
              <li>Reklam göstermeyiz; reklam veya analiz amaçlı izleme yazılımları kullanmayız.</li>
              <li>Verilerinizi satmayız, kiralamayız veya paylaşmayız.</li>
              <li>Kullanıcı hesabı işletmeyiz ve kasanızı sunucularımızda saklamayız.</li>
            </ul>
          </Section>

          <Section n="06" title="Paylaşım ve acil durum erişimi">
            <p>Bir kaydı paylaştığınızda veya acil durum erişimini kurduğunuzda veriler, cihazınızdan çıkmadan önce şifrelenir ve sizin seçtiğiniz bir kanalla iletilir. OstlerTech bu verileri almaz ve saklamaz.</p>
          </Section>

          <Section n="07" title="Saklama ve silme">
            <p>Verileriniz, siz silene, uygulamayı sıfırlayana veya kaldırana kadar cihazınızda kalır. Bulut yedeği, 3. bölümde anlatıldığı şekilde silene kadar Google Drive&apos;ınızda kalır. Verilerinizi biz tutmadığımız için sizin adınıza silemez veya dışa aktaramayız; her ikisini de uygulama içinden kendiniz yapabilirsiniz.</p>
          </Section>

          <Section n="08" title="Güvenlik">
            <p>Sektör standardı şifreleme kullanırız ve ana şifrenizi asla saklamayız. Ana şifrenizi unutursanız verileriniz, OstlerTech dahil hiç kimse tarafından kurtarılamaz.</p>
          </Section>

          <Section n="09" title="Çocuklar">
            <p>SyncPass 13 yaşından küçük çocuklara yönelik değildir ve bilerek onların verilerini toplamayız.</p>
          </Section>

          <Section n="10" title="Haklarınız">
            <p>Bulunduğunuz yere göre (örneğin KVKK veya GDPR kapsamında) kişisel verilerinize erişme, bunları düzeltme ve silme haklarınız vardır. Kasanız cihazlarınızda ve kendi Google hesabınızda saklandığı için bu hakları doğrudan uygulama içinden kullanabilirsiniz. Her türlü sorunuz için aşağıdaki adresten bize ulaşabilirsiniz.</p>
          </Section>

          <Section n="11" title="Değişiklikler">
            <p>Bu politikayı güncelleyebiliriz. Güncellemelerde yukarıdaki yürürlük tarihini değiştirir, önemli değişiklikleri uygulama içinde bildiririz.</p>
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
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Android · Desktop · Effective {EFFECTIVE_EN}</p>
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
              <li>A local security log (for example unlock attempts and sync results) and your app settings. They never leave your device unless they are part of an encrypted backup.</li>
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
              You can delete the backup at any time in Google Drive (Settings → Manage apps → SyncPass → Delete hidden app data) and remove SyncPass&apos;s access at{" "}
              <A href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</A>.
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
              <p>If you add your own Have I Been Pwned API key and run this check, email addresses saved as usernames in your vault are sent to <C>haveibeenpwned.com</C>.</p>
            </Sub>
            <Sub title="Website icons">
              <p>Logos come from a brand library on your device or from images you pick. The domain names in your vault are never sent to an icon service.</p>
            </Sub>
            <Sub title="IBAN detection (Android)">
              <p>While your vault is unlocked, SyncPass checks whether your clipboard contains an IBAN. This check runs entirely on your device; clipboard content is never sent anywhere.</p>
            </Sub>
            <Sub title="AI features with Google Gemini (Android)">
              <ul className={list}>
                <li><strong className="text-white/80">Support chat:</strong> the messages you type in the in-app assistant are sent to the Google Gemini API.</li>
                <li><strong className="text-white/80">Security analysis (premium):</strong> only password characteristics (length and which character types are used) and summary counts about your vault are sent. Passwords, usernames and item names are not sent.</li>
              </ul>
              <p>
                Content sent to Gemini is processed by Google under the <A href="https://ai.google.dev/gemini-api/terms">Gemini API Additional Terms of Service</A>,
                which may allow Google to use it to improve its services.
              </p>
            </Sub>
            <Sub title="Earlier versions (Android)">
              <p>In Android versions released before 18 September 2026, the domain names of websites in your vault were sent to Google&apos;s favicon service at <C>www.google.com</C> to show logos, and clipboard text containing an IBAN was sent to Gemini to be parsed. Versions released after that date do neither; we recommend updating the app.</p>
            </Sub>
            <Sub title="Document and QR scanning (Android)">
              <p>Card, ID and QR code scanning uses Google ML Kit on your device; SyncPass does not upload these images. ML Kit may send anonymous diagnostic and usage information to Google.</p>
            </Sub>
            <Sub title="Purchases and app integrity (Android)">
              <p>Premium purchases are handled by Google Play Billing; we receive the purchase status, not your payment details. Google Play Integrity is used to check that the app runs on a genuine device.</p>
            </Sub>
            <Sub title="Browser integration (Desktop)">
              <p>When enabled, the desktop browser bridge accepts connections only from the same computer (127.0.0.1) and is not reachable from the network.</p>
            </Sub>
          </Section>

          <Section n="05" title="What we do not do">
            <ul className={list}>
              <li>We do not show ads and do not include advertising or analytics tracking SDKs.</li>
              <li>We do not sell, rent or share your data.</li>
              <li>We do not operate user accounts or store your vault on our servers.</li>
            </ul>
          </Section>

          <Section n="06" title="Sharing and emergency access">
            <p>When you share an item or set up emergency access, the data is encrypted on your device before it leaves it and is passed on through a channel you choose. OstlerTech does not receive or store it.</p>
          </Section>

          <Section n="07" title="Retention and deletion">
            <p>Your data stays on your device until you delete it, reset the app or uninstall it. The cloud backup stays in your Google Drive until you delete it as described in section 3. Because we do not hold your data, we cannot delete or export it for you. You can do both yourself within the app.</p>
          </Section>

          <Section n="08" title="Security">
            <p>We use industry-standard encryption and never store your master password. If you forget your master password, your data cannot be recovered, including by OstlerTech.</p>
          </Section>

          <Section n="09" title="Children">
            <p>SyncPass is not directed at children under 13 and we do not knowingly collect their data.</p>
          </Section>

          <Section n="10" title="Your rights">
            <p>Depending on where you live (for example under the GDPR or Turkey&apos;s KVKK), you have rights to access, correct and delete your personal data. Since your vault is stored on your devices and in your own Google account, you can exercise these rights directly in the app. For any question, contact us using the address below.</p>
          </Section>

          <Section n="11" title="Changes">
            <p>We may update this policy. We will change the effective date above and, for significant changes, notify you in the app.</p>
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
