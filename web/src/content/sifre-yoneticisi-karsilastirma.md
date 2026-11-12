SyncPass'i biz geliştiriyoruz; bu yüzden sayfayı bunu aklında tutarak oku. Bu sayfa belirli ürünleri değerlendirmez ve sıralama yapmaz. Şifre yöneticilerini iki yaygın yaklaşıma göre gruplar ve SyncPass'i yanlarına koyar: bulut kasalı yöneticiler ve yerel dosyalı, açık kaynak yöneticiler. Aralarındaki asıl farklar kasanın nerede durduğu, hangi cihazlarda çalıştığı, ücretsiz sürümün kapsamı ve kaynak kodunun açık olup olmadığıdır.

Son kontrol: 8 Kasım 2026. SyncPass bilgileri kendi kodumuzdan ve Android için SyncPass 4.5 ile SyncPass Masaüstü 1.4 sürümlerinden alındı. Kategori satırları genel bilgilerdir; her üründe farklı olabilir, karar vermeden önce ilgilendiğin ürünün kendi sayfasına bak.

## İki yaklaşım ve SyncPass

- **Bulut kasalı yöneticiler:** kasa sağlayıcının sunucularında şifreli durur ve cihazların arasında otomatik eşitlenir. Genellikle sağlayıcıda hesap açılır.
- **Yerel dosyalı, açık kaynak yöneticiler:** kasa bilgisayarındaki şifreli bir dosyadır. Hesap gerekmez; dosyayı nasıl eşitleyeceğini ya da telefonda nasıl açacağını sen seçersin.
- **SyncPass:** kasa telefonda ve bilgisayarda şifreli durur; isteğe bağlı eşitleme kendi Google Drive hesabın üzerinden yapılır.

## 1) Hangi cihazlarda çalışıyor?

| Yaklaşım | Telefon | Bilgisayar |
|---|---|---|
| SyncPass | Android (iOS sürümü yok) | Windows (macOS ve Linux sürümü yok) |
| Bulut kasalı yöneticiler | Üründen ürüne değişir; çoğunun telefon uygulaması var | Üründen ürüne değişir |
| Yerel dosyalı, açık kaynak yöneticiler | Üründen ürüne değişir; telefonda aynı dosyayı açan ayrı uygulamalar olabilir | Üründen ürüne değişir |

SyncPass'in tarayıcı eklentisi Chrome içindir ve Windows uygulamasına bağlı çalışır.

## 2) Kasan nerede duruyor, hesap ve kaynak kodu ne durumda?

| Yaklaşım | Kasa nerede | Hesap | Eşitleme | Kaynak kodu |
|---|---|---|---|---|
| SyncPass | Cihazda şifreli: Android'de şifreli veritabanı, Windows'ta şifreli dosya. Kasanın kopyası sunucularımızda tutulmaz | Başlamak için SyncPass hesabı gerekmez | İsteğe bağlı, kendi Google Drive hesabın üzerinden (Premium) | Açık değil; bağımsız güvenlik denetimi yok |
| Bulut kasalı yöneticiler | Sağlayıcının sunucularında şifreli | Genellikle sağlayıcı hesabı gerekir | Sağlayıcı üzerinden otomatik | Üründen ürüne değişir |
| Yerel dosyalı, açık kaynak yöneticiler | Bilgisayarındaki şifreli dosya | Hesap gerekmez | Dosyayı kendin taşırsın ya da bir bulut klasörüyle eşitlersin | Açık |

Bağımsız denetimin kamuya açık olup olmadığı üründen ürüne değişir; ilgilendiğin ürünün kendi sayfasına bak.

## 3) Özellikler

| Yaklaşım | Paylaşım ve aile planı | 2FA kodu (TOTP) | Geçiş Anahtarı (passkey) | Sızıntı kontrolü |
|---|---|---|---|---|
| SyncPass | Yok | Var (Premium) | Android 14 ve üstünde ücretsiz; Windows'ta gösterilir ama oluşturulamaz ve düzenlenemez | Var (Premium): Have I Been Pwned. Şifrenin kendisi değil, SHA-1 özetinin yalnızca ilk 5 karakteri gönderilir; eşleşme cihazda yapılır |
| Bulut kasalı yöneticiler | Üründen ürüne değişir | Üründen ve plandan plana değişir | Üründen ürüne değişir | Üründen ve plandan plana değişir |
| Yerel dosyalı, açık kaynak yöneticiler | Üründen ürüne değişir | Üründen ürüne değişir | Üründen ürüne değişir | Üründen ürüne değişir |

SyncPass'te Android'de nota eklenen dosya kasaya kopyalanmaz, yalnız telefondaki dosyanın bağlantısı tutulur. Windows uygulaması eklenen dosyayı kasanın içinde şifreli saklar. Pasaport ya da sözleşme taraması saklamak istiyorsan bunu bil.

## 4) Ücretsiz sürüm

| Yaklaşım | Ücretsiz sürümde ne var |
|---|---|
| SyncPass | Android'de 25, masaüstünde 15 kayıt |
| Bulut kasalı yöneticiler | Ürüne ve plana göre değişir |
| Yerel dosyalı, açık kaynak yöneticiler | Üründen ürüne değişir |

Fiyat rakamı vermiyoruz: planlar ve para birimleri sık değişiyor. SyncPass Premium Windows'ta aylık, yıllık ya da tek seferlik ödemeli ömür boyu planla satılır; ödemeyi yetkili satıcımız Paddle alır. Android'de Premium Google Play üzerinden alınır. Fiyat bölgene göre gösterilir.

## Kime hangisi uyar?

Aşağıdakiler sıralama değil, ihtiyaç eşleştirmesidir.

- **Her cihazında, kurulumla uğraşmadan, otomatik eşitlemeli bir uygulama istiyorsan:** bulut kasalı yöneticiler. Kasa sağlayıcının sunucularında durur ve cihazların arasında otomatik eşitlenir.
- **Bilgisayarında tamamen yerel bir dosyayla ve açık kaynaklı bir araçla çalışmak istiyorsan:** yerel dosyalı, açık kaynak yöneticiler. Eşitlemeyi (bulut klasörü ya da USB) ve telefon uygulamasını sen seçersin.
- **Android ve Windows kullanıyorsan, kasanın cihazında şifreli durmasını ve eşitlemenin (istersen) kendi Google Drive hesabında yapılmasını istiyorsan:** SyncPass. Aynı uygulamada geçiş anahtarı (Android 14 ve üstünde ücretsiz), ayrıca 2FA kodları ve sızıntı kontrolü (Premium) var; şifreli yedek de var.
- **iPhone, Mac ya da Linux kullanıyorsan, ailenle ya da ekibinle kasa paylaşmak istiyorsan ya da kaynak kodunun açık olması şartsa:** SyncPass şu an uygun değil.

## SyncPass'in eksikleri

Başlıca eksiklerimiz:

- iOS, macOS ve Linux sürümü yok.
- Kasa paylaşımı ve aile planı yok.
- **SyncPass açık kaynak değildir:** kaynak kodu herkese açık bir lisansla yayımlanmıyor. Kaynak kodunu kendin denetlemek şartsa açık kaynak lisanslı bir şifre yöneticisi bu ölçüte uyar.
- Bağımsız bir güvenlik denetimimiz yok. Kod kapalı olduğu için bu önemli bir boşluk. Bağımsız denetim yaptırmak için bir karar ya da takvimimiz yok.
- Ücretsiz sürüm Android'de 25, masaüstünde 15 kayıtla sınırlı; 2FA kodları ve sızıntı kontrolü Premium'da.
- Android'de nota eklenen dosya kasaya kopyalanmaz, yalnız bağlantısı tutulur (yukarıda).
- Tarayıcı eklentisi yalnızca Chrome için ve Windows uygulamasına bağlı.
- Hata ödülü programımız yok; bulduğun bir güvenlik açığını [Güvenlik açığı bildir](/guvenlik-acigi-bildir) sayfasındaki yolla bildirebilirsin.

Güvenlikle ilgili sınırların tam listesi [güvenlik ve şifreleme belgemizde](/guvenlik/sifreleme-belgesi) ("SyncPass neye karşı koruyamaz").

## SyncPass'in kasa ve veri hakkında söyledikleri

- Kasan cihazında şifreli durur (Android'de şifreli veritabanı, Windows'ta şifreli dosya). Kasanın kopyası sunucularımızda tutulmaz.
- Ana şifren ve kasanı açan anahtar cihazından çıkmaz; ana şifreni biz de bilmeyiz.
- Uygulamada analitik ya da çökme raporlama kütüphanesi yoktur.
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

**Bulut kasalı mı, yerel dosyalı mı yönetici seçmeliyim?**
İkisi farklı ihtiyaçlara göre yapılmış. Bulut kasalı yöneticilerde kasa sağlayıcının sunucularında şifreli durur; otomatik eşitleme isteyenlere uyar. Yerel dosyalı, açık kaynak yöneticilerde kasa bilgisayarındaki dosyadır; yerel çalışmak, eşitlemeyi ve telefon uygulamasını kendin seçmek isteyenlere uyar. SyncPass Android ve Windows kullananlar için; kasa cihazda şifreli durur, eşitleme istersen kendi Google Drive hesabında olur. SyncPass'in iOS sürümü, paylaşımı ve açık kaynak kodu yok.

**Bir şifre yöneticisinin güvenli olup olmadığını nasıl anlarım?**
Bu sayfa sıralama yapmıyor; bir yaklaşımın ötekinden üstün olduğunu söylemiyoruz. Bakabileceğin ölçütler şunlar: kasanın nerede durduğu, kaynak kodunun açık olup olmadığı, bağımsız denetimin kamuya açık olması ve ana şifrenin gücü. SyncPass'in kodu kapalı ve bağımsız bir güvenlik denetimi yapılmadı; kasa ise cihazında şifreli durur.

**SyncPass açık kaynak mı?**
Hayır. SyncPass'in kaynak kodu herkese açık bir lisansla yayımlanmıyor. Kaynak kodunun herkes tarafından denetlenebilmesi senin için şartsa açık kaynak lisanslı bir şifre yöneticisi bu ölçüte uyar.

**iPhone ya da Mac kullanıyorum, SyncPass'i kullanabilir miyim?**
Şu an hayır. SyncPass Android ve Windows için var; iOS, macOS ve Linux sürümü yok. Telefonun iPhone ise iOS uygulaması olan bir şifre yöneticisi daha uygun olur.

**Şifrelerimi başka bir yöneticiden SyncPass'e taşıyabilir miyim?**
Çoğu durumda evet. Android ve Windows uygulamaları, tarayıcıların ve birçok şifre yöneticisinin dışa aktardığı CSV dosyalarını içe aktarır; desteklenen kaynakların listesi uygulamanın içe aktarma ekranında. Android'de ayrıca 2FA hesapları, standart 2FA kurulum QR kodlarından ve Google Authenticator'ın “Hesapları aktar” dışa aktarma QR kodundan alınabilir. Listede olmayan bir kaynaktan taşıyorsan önce küçük bir deneme yapmanı öneririz.

## Bu sayfa hakkında

Bu karşılaştırma kategorilere göredir; belirli ürünleri değerlendirmez. Ürünlerin özellikleri ve planları zamanla değişebilir: kendi ihtiyacına göre değerlendir ve ilgilendiğin ürünün kendi sayfasına bak. Yanlış ya da eski bir bilgi görürsen [iletişim sayfamızdan](/iletisim) yaz, düzeltelim.

SyncPass'in Chrome eklentisi: https://chromewebstore.google.com/detail/bbighjeekihcenhofnmefgmcadddahbk

İlgili: [Şifre yöneticisi nedir](/sifre-yoneticisi) · [İki adımlı doğrulama](/iki-adimli-dogrulama) · [Geçiş Anahtarı (passkey) nedir](/passkey-nedir)

Google, Android, Google Play, Google Drive, Google Authenticator, Chrome ve Gemini, Google LLC'nin ticari markalarıdır. Windows, Microsoft şirketler grubunun ticari markasıdır. iPhone, Mac ve macOS, Apple Inc.'in ABD'de ve diğer ülke ve bölgelerde tescilli ticari markalarıdır. iOS, Cisco'nun ABD'de ve diğer ülkelerde ticari markası ya da tescilli ticari markasıdır ve lisansla kullanılır. Linux, Linus Torvalds'ın ABD'de ve diğer ülkelerde tescilli ticari markasıdır. Diğer ürün adları sahiplerine ait olabilir. OstlerTech bu şirketlerle bağlantılı değildir.
