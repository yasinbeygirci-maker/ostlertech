SyncPass'i biz geliştiriyoruz; bu yüzden sayfayı bunu aklında tutarak oku. Adil olmaya çalıştık: burada geçen her uygulama işini yapan, gerçek kullanıcısı olan bir şifre yöneticisi. Aralarındaki asıl farklar kasanın nerede durduğu, hangi cihazlarda çalıştığı, ücretsiz sürümün kapsamı ve kaynak kodunun ya da bağımsız denetimin açık olup olmadığı.

Bu sayfa sıralama yapmaz. Hangisinin "en iyi" olduğunu söylemiyoruz; cihazlarına ve ihtiyacına hangisinin uyduğunu görmene yardım ediyoruz. Başka bir uygulama sana daha çok uyuyorsa onu kullan.

Son kontrol: 30 Ekim 2026. Diğer ürünlerin planları ve özellikleri değişir; karar vermeden önce kendi sitelerine bak. Rakip bilgilerinin kaynakları sayfa sonundaki "Kaynaklar" bölümünde.

## Tabloları nasıl okumalı

- **Var / Yok:** Resmî sayfada ya da (SyncPass için) kodumuzda doğrulanan bilgi.
- **Belirtilmemiş:** Resmî sayfada bu bilgi yazmıyor; var ya da yok demiyoruz.
- **Doğrulanmadı:** Bilgiyi bu karşılaştırmada doğrulayamadık.
- **Ücretli plan:** Özelliğin yalnızca ücretli planda olduğunu belirtir.

## 1) Hangi cihazlarda çalışıyor?

| Ürün | Android | iOS | Windows | macOS | Linux |
|---|---|---|---|---|---|
| SyncPass | Var | Yok | Var | Yok | Yok |
| Bitwarden | Var | Var | Var | Var | Var |
| KeePassXC | Resmî uygulama yok | Resmî uygulama yok | Var | Var | Var |
| 1Password | Var | Var | Var | Var | Var |
| Proton Pass | Var | Var | Var | Var | Var |
| Dashlane | Var | Var | Belirtilmemiş | Belirtilmemiş | Belirtilmemiş |

KeePassXC bir masaüstü uygulamasıdır; telefonda aynı dosyayı açan, topluluğun yaptığı ayrı uygulamalar vardır (örneğin KeePassDX), bunlar KeePassXC projesinin parçası değildir. SyncPass'in tarayıcı eklentisi Chrome içindir ve Windows uygulamasına bağlı çalışır.

## 2) Kasan nerede duruyor, kaynak kodu ve denetim ne durumda?

| Ürün | Kasa nerede | Açık kaynak | Bağımsız denetim (kamuya açık) |
|---|---|---|---|
| SyncPass | Cihazda şifreli. İsteğe bağlı eşitleme kendi Google Drive hesabında (Premium). Kasanın kopyası sunucularımızda tutulmaz | Hayır | Yok |
| Bitwarden | Sağlayıcının bulutunda; istersen kendi sunucunda | Evet | Var: Cure53 ve diğer firmalar (2018-2025 arası liste) |
| KeePassXC | Bilgisayarındaki yerel dosya | Evet | Fransa'nın ANSSI kurumundan güvenlik vizesi (CSPN birinci düzey sertifikası, sürüm 2.7.9); bağımsız denetim raporu değil |
| 1Password | Sağlayıcının bulutunda | Belirtilmemiş | Belirtilmemiş |
| Proton Pass | Sağlayıcının bulutunda | Evet | Var: Recruity Labs 2026, Cure53 2023 |
| Dashlane | Sağlayıcının bulutunda | Belirtilmemiş | Belirtilmemiş |

"Belirtilmemiş" yazan yerlerde resmî sayfada bu bilgiye rastlamadık; bu, o ürünün açık kaynak olmadığı ya da denetlenmediği anlamına gelmez.

## 3) Özellikler

| Ürün | Paylaşım | Aile planı | 2FA kodu (TOTP) | Geçiş Anahtarı (passkey) | Sızıntı izleme |
|---|---|---|---|---|---|
| SyncPass | Yok | Yok | Ücretli plan (Premium) | Ücretli plan (Premium); Android 14 ve üstünde geçiş anahtarı sağlayıcısı olarak | Ücretli plan: Have I Been Pwned. Şifrenin kendisi değil, SHA-1 özetinin yalnızca ilk 5 karakteri gönderilir; eşleşme cihazda yapılır |
| Bitwarden | Var | Var (en fazla 6 kişi) | Ücretli plan | Var | Ücretli plan (kasa sağlığı) |
| KeePassXC | Belirtilmemiş | Belirtilmemiş | Var | Var | Belirtilmemiş |
| 1Password | Var (kasa ve süreli bağlantı) | Var (en fazla 5 kişi) | Var | Var | Var (Watchtower) |
| Proton Pass | Ücretli plan | Belirtilmemiş | Ücretli plan | Var (ücretsiz planda da) | Ücretli plan (karanlık ağ izleme) |
| Dashlane | Var | Var (en fazla 10 kişi) | Belirtilmemiş | Var | Ücretli plan (karanlık ağ) |

SyncPass'te Android'de nota eklenen dosya kasaya kopyalanmaz, yalnız telefondaki dosyanın bağlantısı tutulur. Windows uygulaması eklenen dosyayı kasanın içinde şifreli saklar. Pasaport ya da sözleşme taraması saklamak istiyorsan bunu bil.

## 4) Ücretsiz sürüm

| Ürün | Ücretsiz sürümde ne var |
|---|---|
| SyncPass | 15 kayıt, reklam yok |
| Bitwarden | Fiyat sayfasında kayıt sınırı belirtilmemiş |
| KeePassXC | Tamamen ücretsiz; bağışla desteklenir |
| 1Password | Doğrulanmadı |
| Proton Pass | Sınırsız kayıt, sınırsız cihaz |
| Dashlane | Resmî sayfada 14 günlük deneme anılıyor; ücretsiz sürüm anılmıyor |

Fiyat rakamı vermiyoruz: planlar ve para birimleri sık değişiyor. SyncPass Premium Windows'ta aylık, yıllık ya da tek seferlik ödemeli ömür boyu planla satılır; ödemeyi yetkili satıcımız Paddle alır. Android'de Premium Google Play üzerinden alınır. Fiyat bölgene göre gösterilir.

## Kime hangisi uyar?

Aşağıdakiler sıralama değil, ihtiyaç eşleştirmesidir.

- **Her cihazında, kurulumla uğraşmadan, otomatik eşitlemeli bir uygulama istiyorsan:** Bitwarden, 1Password, Proton Pass ya da Dashlane. Bunlarda kasa sağlayıcının bulutunda durur ve tüm büyük platformlarda uygulamaları vardır. Kaynak kodunun açık olması senin için önemliyse Bitwarden ve Proton Pass'in kodu açıktır.
- **Bilgisayarında, tamamen yerel bir dosyayla, ücretsiz ve açık kaynak çalışmak istiyorsan:** KeePassXC. Eşitlemeyi (bulut klasörü ya da USB) ve telefon uygulamasını sen seçersin.
- **iPhone ya da Mac'in varsa:** Bitwarden, 1Password, Proton Pass ve Dashlane iOS'ta çalışır. SyncPass'in iOS ve macOS sürümü yok.
- **Android ve Windows kullanıyorsan, kasanın cihazında şifreli durmasını ve eşitlemenin (istersen) kendi Google Drive hesabında yapılmasını istiyorsan:** SyncPass. Aynı uygulamada 2FA kodları, Geçiş Anahtarı ve sızıntı kontrolü Premium'da; şifreli yedek de var.
- **Aile ya da ekip olarak paylaşımlı kasa istiyorsan:** SyncPass şu an uygun değil; paylaşım ve aile planı yok.

## SyncPass'in eksikleri

Başlıca eksiklerimiz:

- iOS, macOS ve Linux sürümü yok.
- Kasa paylaşımı ve aile planı yok.
- **SyncPass açık kaynak değildir:** kaynak kodu herkese açık bir lisansla yayımlanmıyor. Kaynak kodunu kendin denetlemek şartsa bu ölçüte uyan seçenekler Bitwarden, Proton Pass ve KeePassXC.
- Bağımsız bir güvenlik denetimimiz yok. Kod kapalı olduğu için bu önemli bir boşluk. Bağımsız denetim yaptırmak için bir karar ya da takvimimiz yok.
- Ücretsiz sürüm 15 kayıtla sınırlı; 2FA kodları ve Geçiş Anahtarı Premium'da.
- Android'de nota eklenen dosya kasaya kopyalanmaz, yalnız bağlantısı tutulur (yukarıda).
- Tarayıcı eklentisi yalnızca Chrome için ve Windows uygulamasına bağlı.
- Hata ödülü programımız yok; bulduğun bir güvenlik açığını [Güvenlik açığı bildir](/guvenlik-acigi-bildir) sayfasındaki yolla bildirebilirsin.

Güvenlikle ilgili sınırların tam listesi [güvenlik ve şifreleme belgemizde](/guvenlik/sifreleme-belgesi) ("SyncPass neye karşı koruyamaz").

## SyncPass'in kasa ve veri hakkında söyledikleri

- Kasan cihazında şifreli durur (Android'de şifreli veritabanı, Windows'ta şifreli dosya). Kasanın kopyası sunucularımızda tutulmaz.
- Ana şifren ve kasanı açan anahtar cihazından çıkmaz; ana şifreni biz de bilmeyiz.
- Uygulamada reklam, analitik ya da çökme raporlama kütüphanesi yoktur.
- Şifreleme: Android'de kasa SQLCipher ile, hassas alanlar ve Windows'taki kasa dosyası AES-256-GCM ile şifrelenir; anahtar ana şifrenden PBKDF2-HMAC-SHA256 (600.000 tur) ile cihazında üretilir. Android'de parmak iziyle açma Android Keystore ile korunur ve ekran görüntüsü engellenir; Windows'ta kopyalanan değer pano geçmişine alınmaz. Ayrıntı: [Güvenlik ve şifreleme belgesi](/guvenlik/sifreleme-belgesi).

Bazı özellikler internete bağlanır. Hangisi neyi gönderir:

- **Google Drive eşitlemesi** (Premium, isteğe bağlı): açarsan kasanın şifreli kopyası senin kendi Google Drive hesabına gider.
- **Şifre sızıntı kontrolü:** şifrenin SHA-1 özetinin ilk 5 karakteri Have I Been Pwned'a gider.
- **E-posta sızıntı kontrolü** (Premium, Android): yalnız kendi Have I Been Pwned anahtarını girersen açılır; kasandaki e-posta adresleri 7 günde bir Have I Been Pwned'a gönderilir.
- **Yardım sohbeti ve kasa raporu** (Android): yazdığın soru ve istersen kasa raporunun özet sayıları Google Gemini'ye gider. Sohbete şifre ya da kişisel bilgi yazma.
- **Windows lisansı:** lisansı etkinleştirirken ve sonra yaklaşık haftada bir lisans anahtarın, uygulamanın ürettiği rastgele cihaz numarası ve uygulama sürümü ostlertech.com'a gider.

Tam liste: [güvenlik ve şifreleme belgesi](/guvenlik/sifreleme-belgesi), 8. bölüm.

## Çağrı

[[PLAY]] [[WINDOWS]]

## Sık sorulan sorular

**Bitwarden mi, KeePassXC mi, SyncPass mı?**
Üçü farklı ihtiyaçlara göre yapılmış. Bitwarden otomatik eşitleme ve tüm platformlarda uygulama isteyenler için; kaynak kodu açık, kasa sağlayıcının bulutunda (istersen kendi sunucunda). KeePassXC bilgisayarında yerel dosyayla, ücretsiz ve açık kaynak çalışmak isteyenler için; eşitlemeyi ve telefon uygulamasını kendin seçersin. SyncPass Android ve Windows kullananlar için; kasa cihazda şifreli durur, eşitleme istersen kendi Google Drive hesabında olur. SyncPass'in iOS sürümü, paylaşımı ve açık kaynak kodu yok.

**Bir şifre yöneticisinin güvenli olup olmadığını nasıl anlarım?**
Bu sayfa sıralama yapmıyor; bir ürünün ötekinden üstün olduğunu kanıtlayamayız. Bakabileceğin ölçütler şunlar: kasanın nerede durduğu, kaynak kodunun açık olup olmadığı, bağımsız denetimin kamuya açık olması ve ana şifrenin gücü. Yukarıdaki "Kasan nerede duruyor" tablosunda bu bilgileri ürün ürün yazdık; SyncPass'in kodu kapalı ve bağımsız denetimi yok.

**SyncPass açık kaynak mı?**
Hayır. SyncPass'in kaynak kodu herkese açık bir lisansla yayımlanmıyor. Kaynak kodunun herkes tarafından denetlenebilmesi senin için şartsa Bitwarden, Proton Pass ya da KeePassXC bu ölçüte uyar. SyncPass'in bağımsız bir güvenlik denetimi de henüz yok.

**iPhone ya da Mac kullanıyorum, SyncPass'i kullanabilir miyim?**
Şu an hayır. SyncPass Android ve Windows için var; iOS, macOS ve Linux sürümü yok. Telefonun iPhone ise Bitwarden, 1Password, Proton Pass, Dashlane gibi iOS uygulaması olan bir şifre yöneticisi daha uygun olur.

**Şifrelerimi başka bir yöneticiden SyncPass'e taşıyabilir miyim?**
Evet. Windows uygulaması Chrome, Edge, Firefox, Bitwarden, 1Password, KeePass, LastPass, Proton Pass (CSV) ve Kaspersky (TXT) dışa aktarımlarını içe aktarır. Android'de de içe aktarma var ve Google Authenticator dışa aktarma QR kodundan 2FA hesapları alınabilir. Dashlane dışa aktarımını henüz test etmedik; bunda önce küçük bir deneme yapmanı öneririz.

## Kaynaklar

Rakip bilgileri 30 Ekim 2026'da aşağıdaki resmî sayfalardan okundu. Hata görürsen [iletişim sayfamızdan](/iletisim) yaz, düzeltelim.

- 1Password: https://1password.com/features
- Bitwarden: https://bitwarden.com/help/is-bitwarden-audited/ , https://bitwarden.com/pricing/
- Proton Pass: https://proton.me/pass , denetim yazısı https://proton.me/blog/proton-pass-audit-2026
- Dashlane: https://www.dashlane.com/features
- KeePassXC: https://keepassxc.org/ , denetim ve sertifika: https://keepassxc.org/audits/ (31 Ekim 2026'da okundu)

SyncPass bilgileri kendi kodumuzdan ve sürüm 4.5 / masaüstü 1.4.15 doğrulamasından alındı (Chrome Web Store sayfası: https://chromewebstore.google.com/detail/bbighjeekihcenhofnmefgmcadddahbk). Adı geçen ürün ve markalar sahiplerine aittir; OstlerTech bu şirketlerle bağlantılı değildir.

İlgili: [Şifre yöneticisi nedir](/sifre-yoneticisi) · [İki adımlı doğrulama](/iki-adimli-dogrulama) · [Geçiş Anahtarı (passkey) nedir](/passkey-nedir)
