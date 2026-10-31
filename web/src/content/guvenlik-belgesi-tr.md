# SyncPass güvenlik ve şifreleme belgesi

Son güncelleme: 31 Ekim 2026 · Kapsadığı sürümler: SyncPass Android 4.5, SyncPass Masaüstü (Windows) 1.4, SyncPass tarayıcı eklentisi (Chrome) 1.1.0

Bu belge SyncPass'in verini teknik olarak nasıl koruduğunu anlatır: anahtarın nasıl üretildiği, neyin hangi yöntemle
şifrelendiği, neyin şifrelenmediği, cihazından neyin çıktığı ve SyncPass'in neye karşı koruyup neye karşı koruyamadığı.
Daha kısa bir özet için [Güvenlik](/syncpass#guvenlik) bölümüne bak.

Bu belgeyi uygulamanın kaynak koduna bakarak yazdık; kodla doğrulayamadığımız noktaları ilgili yerde belirttik. Kaynak
kod herkese açık olmadığı için bunu sen doğrudan sınayamazsın; bu yüzden ayrıntılı ve açık yazmaya çalıştık. Bağımsız
denetim konusu 12. bölümde.

## 1. Kısaca

- Kasan cihazında şifreli durur: Android'de şifreli bir veritabanında, Windows'ta şifreli bir dosyada.
- Kasayı açan anahtar, ana şifrenden cihazında üretilir. Ana şifren ve bu anahtar bize gönderilmez.
- Kasanın kopyası sunucularımızda tutulmaz. Eşitlemeyi açarsan şifreli kopya senin kendi Google Drive hesabına gider.
- Ana şifreni biz bilmeyiz; unutursan sıfırlayamayız. Android'de kurtarma QR kodu bunun için var (6. bölüm).
- Bazı özellikler internete bağlanır. Hangisinin ne gönderdiği 8. bölümde tek tek yazılı.

## 2. Anahtarın yolu

```
Ana şifre (yalnız sen bilirsin)
   │  PBKDF2-HMAC-SHA256, 600.000 tur, kasaya özel 16 baytlık rastgele tuz
   ▼
Kasa anahtarı (256 bit, yalnız bellekte)
   ├─ Android: veritabanının (SQLCipher) anahtarı
   ├─ Hassas alanların tek tek şifrelenmesi (AES-256-GCM)
   ├─ Windows: kasa dosyasının şifrelenmesi (AES-256-GCM)
   ├─ Google Drive kopyasının ve yedek dosyasının şifrelenmesi (AES-256-GCM)
   └─ Doğrulama değeri: ana şifrenin doğru girildiğini anlamak için saklanan HMAC-SHA256 değeri
Kasa anahtarının cihazda saklanan sarmalanmış kopyaları (yalnız Android, yalnız açarsan):
   ├─ Parmak izi / yüz ile açma: Android Keystore anahtarıyla sarmalanmış
   └─ Kurtarma QR kodu: QR'daki rastgele anahtarla sarmalanmış
```

- **Anahtar türetme:** PBKDF2-HMAC-SHA256, 600.000 tur (yineleme), 16 baytlık rastgele tuz. Bu, OWASP'ın PBKDF2 için önerdiği
  alt sınırdır. Tur sayısı her şifre tahminini yavaşlatır; zayıf bir ana şifreyi güçlü yapmaz.
- **Tek anahtar:** Yukarıdaki işlerin hepsi aynı kasa anahtarını kullanır; ayrı alt anahtarlar türetilmez.
- **Doğrulama değeri:** Uygulama ana şifreni saklamaz. Tuzla birlikte, kasa anahtarıyla hesaplanmış bir HMAC-SHA256
  değeri saklar. Girdiğin şifreden aynı değer çıkarsa şifre doğrudur. Bu değeri ele geçiren biri şifre tahmini
  deneyebilir; her deneme 600.000 turluk türetme maliyetindedir.
- **Rastgelelik:** Tuz, başlatma vektörleri, kurtarma anahtarı ve şifre üreticisi işletim sisteminin güvenli rastgele
  sayı kaynağını kullanır.
- **Eski kasalar:** SyncPass 3.x'te oluşturulmuş kasalar eski ayarla (PBKDF2-HMAC-SHA1, 200.000 tur) açılmaya devam
  eder. Uygulama bu kasaları açılışta yeni ayara kendiliğinden geçirmez.

## 3. Şifreleme biçimi

SyncPass Android ve SyncPass Masaüstü aynı şifreli biçimi kullanır. Her şifreli değer şöyle saklanır:

| Parça | Boyut | Açıklama |
|---|---|---|
| Biçim işareti | 4 bayt | `SPv2` |
| Tuz | 16 bayt | Anahtarın türetildiği tuz |
| Başlatma vektörü (IV) | 12 bayt | Her şifrelemede yeni ve rastgele |
| Şifreli metin + doğrulama etiketi | değişken + 16 bayt | AES-256-GCM |

Bütün parça Base64 ile metne çevrilir. AES-256-GCM kimlik doğrulamalı bir şifrelemedir: değiştirilmiş ya da başka bir
anahtarla yazılmış bir değer açılmaz, reddedilir. İki uygulama da alanlarından biri açılamayan bir yedeği geri
yüklemez; şifreli metni değer gibi göstermez.

## 4. Cihazında neyi, nasıl saklıyoruz

### Android

| Ne | Nasıl korunur |
|---|---|
| Kasa veritabanı (bütün kayıtlar) | Veritabanının tamamı SQLCipher ile şifreli; anahtarı kasa anahtarıdır. Şifresiz veritabanına geri dönüş yolu yoktur. |
| Hassas alanlar | Veritabanı şifresinin üstüne bir kez daha alan alan AES-256-GCM ile şifrelenir. Liste 7. bölümde. |
| Uygulama ayarları (tema, dil, eşitleme ayarı, tuz, doğrulama değeri, kurtarma için sarmalanmış anahtar) | Şifrelenmez; Android'in uygulamaya ayırdığı özel alanda durur. Kasa içeriği taşımaz. |
| Kişisel bilgiler (profildeki ad, e-posta, telefon; acil durum kişisi e-postası; sızıntı kontrolü için girdiğin anahtar) | Şifrelenmez; uygulamanın özel alanında durur ve Android yedeğine girmez. |
| Parmak iziyle açma kaydı | Kasa anahtarı Android Keystore anahtarıyla sarmalanmış (5. bölüm). |

### Windows (SyncPass Masaüstü)

| Ne | Nasıl korunur |
|---|---|
| Kasa dosyası, önceki sürümü ve son eşitleme kopyası | Dosyanın tamamı AES-256-GCM ile şifreli (aynı anahtar türetme). |
| Notlara eklenen dosyalar | Kasa dosyasının içinde, onunla birlikte şifreli. Diske şifresiz geçici kopya yazılmaz; şifresiz kopya yalnız sen "Bilgisayara kaydet"i seçersen, seçtiğin yere yazılır. Bu dosyalar buluta gönderilmez. |
| Tuz, doğrulama değeri, ayarlar, lisans bilgisi | Şifrelenmez; Windows'ta senin kullanıcı hesabına ait kayıt defteri bölümünde durur. |
| Google Drive oturum belirteci | Şifrelenmez; senin kullanıcı klasöründe, SyncPass veri klasöründe bir dosyada durur. Belirteç yalnız SyncPass'in Drive'daki kendi gizli klasörüne erişebilir. |
| Eşitleme durum kaydı | Şifrelenmez; yalnız zaman, sonuç kodu ve kayıt sayısı içerir. Başlık, değer ya da hesap adı içermez. |

## 5. Android Keystore ve biyometrik açma

Parmak izi ya da yüzle kilit açmayı etkinleştirirsen uygulama Android Keystore'da bir AES-GCM anahtarı üretir ve kasa
anahtarını onunla sarmalar.

- Keystore anahtarı yalnız biyometrik doğrulamadan sonra kullanılabilir.
- Cihaza yeni bir parmak izi eklenirse ya da hepsi silinirse bu anahtar geçersiz olur; uygulama biyometrik açmayı
  kapatır ve ana şifreni ister.
- Android Keystore'un tasarımı gereği bu anahtar cihazdan dışarı alınamaz; bu yüzden parmak iziyle açma yeni bir telefona
  taşınmaz.
- Keystore'un donanımla korunup korunmadığı telefonun modeline bağlıdır; uygulama bunu ayrıca şart koşmaz.

SyncPass Masaüstü'nde biyometrik açma yoktur.

## 6. Kurtarma QR kodu (yalnız Android)

### Nasıl çalışır

1. Kurtarma QR'ı oluşturduğunda uygulama rastgele 256 bitlik bir kurtarma anahtarı üretir.
2. Kasa anahtarını bu kurtarma anahtarıyla AES-256-GCM kullanarak sarmalar ve sarmalanmış kopyayı uygulama ayarlarına
   yazar.
3. Kurtarma anahtarını sana QR kodu olarak gösterir. Uygulama kurtarma anahtarını kendi ayarlarına yazmaz; bize
   de gönderilmez.
4. Ana şifreni unutursan QR'ı okutursun. Uygulama sarmalanmış kopyayı QR'daki anahtarla açar, çıkan anahtarı doğrulama
   değeriyle karşılaştırır ve kasayı açar.

### Neyi korur

- Ana şifreni unuttuğunda kasana yeniden erişmeni sağlar.
- QR tek başına kasa içeriği taşımaz. Sarmalanmış anahtarla birlikte çalışır; sarmalanmış anahtar telefonundaki uygulama
  ayarlarında durur (Android yedeğin açıksa o yedekte de bulunur, bkz. 8. bölüm).

### Neyi korumaz

- **QR, ana şifrenin yerine geçer.** QR'ı ve telefonunu (ya da telefonunun Android yedeğini) ele geçiren biri ana
  şifren olmadan kasanı açabilir. QR'ı ana şifren kadar dikkatli sakla.
- QR'ı "Paylaş" ile bir uygulamaya gönderirsen (e-posta, mesaj, bulut) görüntü o uygulamada kalır. "Paylaş"tan sonra
  görüntü telefonunda uygulamanın önbelleğinde de kalabilir. Mümkünse yazdır ya da kâğıda geçir.
- SyncPass Android 4.5'te ana şifre değiştirilemez. QR kasayı açar ama yeni ana şifre belirletmez.
- SyncPass Masaüstü'nde kurtarma QR'ı ya da kurtarma kodu yoktur. Masaüstünde ana şifreni unutursan kasa açılamaz.
- Ana şifreni ve QR'ı kaybedersen (Android'de parmak iziyle açma da kapalıysa) kasan açılamaz; biz de açamayız. Bu,
  tasarımın bilinçli bir sonucudur.

## 7. Yedek ve Google Drive eşitlemesi

### Ne gider, nereye

- Eşitlemeyi açarsan kasanın tamamı **tek bir şifreli dosya** olarak senin Google Drive hesabına, Drive'ın uygulamaya
  ayırdığı gizli klasöre yüklenir. SyncPass yalnız bu klasöre erişim izni ister; Drive'daki diğer dosyalarını göremez.
- SyncPass Android arka planda yaklaşık 12 saatte bir, uygulama açıkken daha sık eşitler. SyncPass Masaüstü uygulama
  açıkken eşitler.
- Elle aldığın yedek dosyası da aynı biçimde şifrelidir.
- SyncPass Masaüstü telefonundaki kasayla aynı ana şifreyi kullanarak eşleşir: Drive'daki dosyanın içindeki tuzdan aynı
  anahtarı türetir. Ana şifren yine cihazlar arasında gönderilmez.

### Kopyanın içi: iki kat şifreleme

Drive'daki dosyanın tamamı kasa anahtarıyla AES-256-GCM ile şifrelidir. Google ve biz bu dosyayı ana şifreni bilmeden
açamayız; bu korumanın gücü ana şifrenin gücüne bağlıdır (11. bölüm). Dosyanın içinde, aşağıdaki hassas alanlar ayrıca, alan alan bir kez daha şifrelenir:

| Kayıt türü | Ayrıca şifrelenen alanlar |
|---|---|
| Giriş bilgisi | Başlık, kullanıcı adı, şifre, adres (URL), notlar, 2FA anahtarı, ek alanlar, kurtarma kodları |
| Banka kartı | Kart numarası, kart türü, kart sahibi, son kullanma tarihi, CVV, CVV2, PIN |
| Kimlik belgesi | Ad, soyad, kimlik numarası, seri numarası, doğum tarihi ve yeri, veriliş ve son geçerlilik tarihi, veren kurum, ayrıntılar, belge görselinin telefondaki bağlantısı |
| Kurumsal belge | Kurum, vergi numarası, sosyal güvenlik numarası, poliçe numarası, lisans anahtarı |
| Kripto cüzdanı | Kurtarma kelimeleri, özel anahtar |
| Banka hesabı | Banka adı, hesap sahibi, IBAN, hesap numarası, şube kodu, SWIFT kodu |
| Geçiş Anahtarı (passkey) | Site, kullanıcı adı, kimlik bilgisi numarası, kullanıcı tanıtıcısı, özel anahtar |
| Adres | Sokak, şehir, il, posta kodu, ülke |
| Güvenli not | İçerik; ek dosyanın telefondaki bağlantısı (dosyanın kendisi kopyaya girmez) |
| Wi-Fi | Ağ adı, şifre, modem kullanıcı adı ve şifresi |
| Doğrulayıcı (2FA) | Gizli anahtar, sağlayıcı, hesap adı |
| Cüzdan kartı | Barkod verisi |

**Alan düzeyinde ayrıca şifrelenmeyenler** (bunlar da dosyanın tamamıyla birlikte şifreli kalır, düz metin olarak
dışarı çıkmaz): giriş bilgisi dışındaki kayıtların başlığı, kategori, kayıt türü, zaman bilgileri, sık kullanılan
işareti, şifre gücü ve sızıntı sayısı, giriş bilgisine seçtiğin özel simgenin telefondaki bağlantısı, kart rengi,
doğrulayıcının algoritma ve hane ayarları, Wi-Fi güvenlik türü, kripto ağı adı, cüzdan kartında kurum adı, geçiş
anahtarında cihaz adı ve son kullanım zamanı. Telefonundaki veritabanında da bu alanlar yalnız veritabanı şifresiyle korunur.

### Google'ın görebildikleri

Google kopyanın içini göremez. Ancak her bulut hizmeti gibi dosyanın varlığını, adını, boyutunu ve değişiklik
zamanlarını görür.

### Şifreli olmayanlar: tek liste

Aşağıdakiler SyncPass tarafından şifrelenmez. Hiçbiri ana şifreni ya da kasa anahtarını içermez; yine de bilmen
gerekir:

- **Uygulama ayarları:** tuz, doğrulama değeri, kurtarma için sarmalanmış anahtar, tema/dil/kilit ayarları (Android'de
  uygulamanın özel alanında, Windows'ta kullanıcı kayıt defterinde). Android'de bu ayarlar Android yedeğine girer.
- **Profil bilgileri (Android):** profildeki ad, e-posta, telefon, acil durum kişisi e-postası, sızıntı kontrolü
  anahtarı. Uygulamanın özel alanında durur, yedeğe girmez.
- **SyncPass Masaüstü lisans bilgisi ve Google Drive oturum belirteci:** senin Windows kullanıcı hesabının alanında.
- **Drive dosyasının adı, boyutu ve zamanları:** Google görür.
- **Panoya kopyaladığın değer:** silinene kadar panoda düz metin olarak durur (10. bölüm).
- **Paylaştığın kurtarma QR görüntüsü:** gönderdiğin uygulamada ve telefonundaki önbellekte kalabilir (6. bölüm).
- **Başka bir şifre yöneticisinden içe aktardığın dosya (CSV vb.):** o uygulamanın verdiği düz metin dosyadır;
  SyncPass onu okur ama değiştirmez ya da silmez. İçe aktarma bitince dosyayı kendin sil.
- **"Bilgisayara kaydet" ile dışarı aldığın not eki:** seçtiğin yere düz dosya olarak yazılır.

## 8. Cihazından çıkan bilgiler

Ana şifren ve kasa anahtarın aşağıdaki durumların **hiçbirinde** gönderilmez. "Kendiliğinden" yazan işler sen bir şeye
basmadan, arka planda çalışır.

### Kasa içeriğinden türeyen ya da senin yazdığın

| Özellik | Nereye | Ne gider |
|---|---|---|
| Google Drive eşitlemesi / yedeği (isteğe bağlı; açıksa kendiliğinden) | Senin Google Drive hesabın | Kasanın tamamı, şifreli tek dosya (7. bölüm) |
| Şifre sızıntı kontrolü (Premium, Android ve Masaüstü) | Have I Been Pwned (api.pwnedpasswords.com) | Şifrenin SHA-1 özetinin (hash) yalnız ilk 5 karakteri (k-anonimlik). Eşleşme cihazda yapılır; şifre ve tam özet gönderilmez. |
| Destek sohbeti (yalnız Android), sen yazınca | Google Gemini | Hazır yanıtı olmayan sorunun metni. Gönderilmeden önce kart numarası, e-posta adresi, IP adresi ve "password: ..." biçimli ifadeler silinir; bu süzgeç her şifreyi yakalayamaz. **Sohbete şifre ya da kişisel bilgi yazma.** Masaüstü uygulamasında bu özellik yoktur. |
| E-posta sızıntı kontrolü (Premium, yalnız Android, yalnız kendi Have I Been Pwned anahtarını girersen; sonra kendiliğinden, 7 günde bir) | Have I Been Pwned (haveibeenpwned.com) | Kasandaki kayıtlarda bulunan e-posta adresleri, HTTPS ile. Anahtar girmezsen bu kontrol hiç çalışmaz. |
| Kasa raporu (yalnız Android), sen isteyince | Google Gemini | Yalnız sayılar ve evet/hayır bilgileri: güvenlik puanı, kayıt sayısı, zayıf / tekrar kullanılan / sızmış şifre sayısı, e-posta sızıntısı sayısı, biyometri, eşitleme ve acil durum ayarının açık olup olmadığı, raporun dili. Ad, adres, kullanıcı adı ya da şifre gönderilmez. |

Google'ın şartları, Gemini'ye gönderilen içeriği hizmetlerini geliştirmek için kullanmasına izin verebilir.

### Kasa içeriği taşımayanlar

| Ne zaman | Nereye | Ne gider |
|---|---|---|
| SyncPass Masaüstü lisansını etkinleştirirken; sonra kendiliğinden, yaklaşık haftada bir | ostlertech.com (bizim sunucumuz) | Lisans anahtarı, uygulamanın ürettiği rastgele cihaz numarası, uygulama sürümü. Ücretsiz sürüm bu sunucuya bağlanmaz. |
| Premium satın alırken (Android) | Google Play | Satın alma Google Play üzerinden yapılır; imzası cihazda doğrulanır. |
| Android'in kendi otomatik yedeği (telefonunda açıksa) | Senin Google hesabın | Uygulama ayarları: ana şifreni doğrulamaya yarayan değer ve tuz, kurtarma QR'ı için sarmalanmış anahtar. Kasa veritabanı ve kişisel bilgiler bu yedeğe girmez. |
| Geçiş Anahtarı ve otomatik doldurma (Android): Google'ın tarayıcı listesi kendiliğinden 7 günde bir; site dosyası geçiş anahtarı istendiğinde | Google (gstatic.com) ve ilgili site | Google'ın tarayıcı listesi indirilir. Bir uygulama bir site adına geçiş anahtarı isterse, o sitenin herkese açık `assetlinks.json` dosyası okunur. Kasadan bir şey gönderilmez. |
| Metin ve QR tanıma (Android) | Google | Tanıma cihazda yapılır. Google'ın belgelerine göre ML Kit kütüphanesi kullanım istatistiği gönderebilir. |
| Uygulama çökerse | Google Play / Windows Hata Raporlama | Bunu işletim sistemi yapar ve cihaz ayarına bağlıdır. Uygulamada ayrıca bir çökme raporlama hizmeti yoktur. |

Uygulamada reklam, analitik ya da çökme raporlama kütüphanesi yoktur.

## 9. Tarayıcı eklentisi ve SyncPass Masaüstü köprüsü

- Eklentinin içinde şifre saklanmaz. Eklenti internete bağlanmaz; yalnız aynı bilgisayarda çalışan SyncPass
  Masaüstü ile konuşur.
- Yol şudur: eklenti → tarayıcının yerel uygulama ileti kanalı (native messaging) → SyncPass → bilgisayarın içinden
  (127.0.0.1) açılan bir bağlantı. Bu bağlantı her açılışta yeniden üretilen rastgele bir belirteç ister.
- Hangi sayfada olduğun bilgisini sayfa değil tarayıcı verir. SyncPass bir şifreyi yalnız o sayfanın adresine
  (aynı alan adı ya da onun alt alan adı) kayıtlı giriş için verir. Adresi kaydedilmemiş girişler hiçbir sayfaya
  verilmez.
- Kasa kilitliyken eklenti hiçbir kayıt alamaz.
- 2FA kodu için eklentiye gizli anahtar değil, yalnız o anki 6 haneli kod verilir. Kodu kopyalamayı SyncPass
  Masaüstü'nün kendisi yapar (aşağıdaki pano kuralıyla).
- Eklenti `http://` sayfalarda da doldurabilir. Şifreli olmayan bir sayfaya yazılan şifre ağda okunabilir; şifreli
  bağlantı (`https://`) kullanan sayfaları tercih et.

## 10. Uygulama içindeki korumalar

| Koruma | SyncPass Android 4.5 | SyncPass Masaüstü (Windows) 1.4 |
|---|---|---|
| Panodan otomatik silme | Varsayılan 45 saniye (15 sn, 45 sn, 2 dk ya da "hiç"). Uygulama kapalıyken de zamanında silinir. Uygulama ön plandayken kasa kilitlenirse bekleyen değer hemen silinir. | Varsayılan 30 saniye (15, 30, 45 sn, 2 dk ya da "hiç"). Kasa kilitlenince ya da uygulama kapanınca bekleyen değer hemen silinir. |
| Pano geçmişinden uzak tutma | Android 13 ve üstünde kopyalanan değer "hassas" işaretlenir: önizlemede gizlenir; klavyelerin geçmişine almaması gerekir. | Windows pano geçmişine (Win+V), bulut panosuna ve pano izleyicilerine alınmaması için gereken biçimlerle kopyalanır. |
| Ekran görüntüsü engeli | Açık. Ekran görüntüsü, ekran kaydı ve son uygulamalar önizlemesi kasayı göstermez. | Yok. |
| Otomatik kilit | Varsayılan: uygulama arka plana geçince hemen (1 ya da 5 dakika sonra seçilebilir). | Varsayılan kapalı; 1, 5, 15 ya da 30 dakika hareketsizlikten sonra kilitlemeyi Ayarlar'dan açabilirsin. **Açmanı öneririz.** |
| Biyometrik açma | Android Keystore ile (5. bölüm). | Yok. |
| Root uyarısı | Root'lu cihazda uyarı gösterilir; uygulama engellenmez. | Uygulanamaz. |

## 11. Tehdit modeli

### SyncPass neye karşı korur

- **Kaybolan ya da çalınan cihaz (kilitli kasa):** Kasa veritabanı ve kasa dosyası şifrelidir. Açmak için ana şifre,
  Android'de kayıtlı parmak izi ya da kurtarma QR'ı gerekir.
- **Google Drive hesabının ya da Google'ın kopyayı okuması:** Drive'daki kopya ana şifren olmadan açılamaz; güçlü bir
  ana şifreyle tahmin yoluyla açılması da pratikte çok zordur.
- **Kopyanın değiştirilmesi:** AES-256-GCM, değiştirilmiş bir kopyayı reddeder.
- **Bizim sunucumuzun ele geçirilmesi:** Sunucularımızda kasa, ana şifre ya da anahtar tutulmaz; SyncPass için yalnızca
  masaüstü lisans kayıtları ve satın almada iletilen e-posta adresi tutulur. Bu yüzden kasan oradan okunamaz.
- **Kasa dosyasıyla şifre tahmini:** Her deneme 600.000 turluk anahtar türetme gerektirir. Bu, tahmini yavaşlatır
  ama durdurmaz; korumanın gücü ana şifrenin uzunluğuna ve tahmin edilemezliğine bağlıdır.
- **Başka bir sitenin şifreni istemesi (eklenti):** Şifre yalnız kayıtlı adresine uyan sayfaya verilir.
- **Omuz üstünden bakma (shoulder surfing), ekran paylaşımı ve pano geçmişi:** Android'de ekran görüntüsü engeli; iki platformda
  süreli pano temizleme ve pano geçmişinden uzak tutma.

### SyncPass neye karşı koruyamaz

- **Ele geçirilmiş cihaz:** Cihazında kötü amaçlı yazılım, tuş kaydedici ya da ekran okuyan bir uygulama varsa, kasa
  açıkken gördüğün ya da yazdığın bilgiyi alabilir. Bilgisayarında senin Windows hesabınla çalışan bir program,
  kasa açıkken SyncPass Masaüstü'nden kayıt isteyebilir. Hiçbir şifre yöneticisi ele geçirilmiş bir cihazı tek
  başına koruyamaz.
- **Root'lu ya da işletim sistemi değiştirilmiş cihazlar:** Android'in uygulama yalıtımı ve Keystore korumaları zayıflar.
- **Zayıf ya da başka yerde kullanılan ana şifre:** Anahtar türetme tahmini yavaşlatır, zayıf şifreyi kurtarmaz.
- **Kurtarma QR'ının ele geçirilmesi:** QR, ana şifrenin yerine geçer (6. bölüm).
- **Değiştirilmiş kurulum dosyası:** Uygulamayı resmi olmayan bir yerden indirirsen ya da indirme yolu ele geçirilirse
  kasa açıkken bilgiler alınabilir. SyncPass'i yalnız Google Play'den ve ostlertech.com'dan indir.
- **Google hesabının ele geçirilmesi:** Şifreli kopya silinebilir ya da daha eski bir şifreli kopyayla
  değiştirilebilir; okunamaz. Android yedeği açıksa doğrulama değeri ile şifre tahmini denenebilir. Google hesabını
  iki adımlı doğrulamayla koru.
- **Kasa açıkken bellek:** Kasa açıkken anahtar ve ana şifre cihazın belleğindedir. Kilitlenince uygulama ana şifreyi
  bellekte sıfırlar ve anahtarı bırakır; Android ve Java'nın bellek yönetimi yüzünden anahtarın her kopyasının o anda
  silindiğini garanti edemeyiz.
- **Eski Android sürümlerinde pano:** Android 12 ve öncesinde "hassas" pano işareti yoktur; bazı klavyeler kopyalanan
  değeri kendi geçmişine ya da bulut eşitlemesine alabilir. Pano temizleme süresini kısa tut.
- **SyncPass Masaüstü'nde açık bırakılan kasa:** Ekran görüntüsü engeli yoktur ve otomatik kilit varsayılan olarak
  kapalıdır.
- **Destek sohbetine yazdığın bilgi:** Süzgeç her şifreyi ya da kişisel bilgiyi yakalayamaz.

## 12. Bağımsız denetim ve kaynak kod

- **SyncPass açık kaynak değildir:** kaynak kodu herkese açık bir lisansla yayımlanmıyor. Bu belgedeki iddiaları
  kaynak koda bakarak doğrudan sınayamazsın.
- **Bağımsız bir güvenlik denetimi yapılmadı.** SyncPass'i dışarıdan bir güvenlik firması denetlemedi. Sürümlerden önce
  kendi içimizde güvenlik ve test incelemesi yapıyoruz; bu, bağımsız denetimin yerini tutmaz.
- Kaynak kod açık olmadığında güvenin en güçlü dayanağı bağımsız bir denetimdir. Bağımsız denetim yaptırmak için bir
  karar ya da takvimimiz yok. Bir denetim yapılırsa bu bölümü güncelleriz.
- Bu belgede yazdığımız bir şeyin kodla uyuşmadığını görürsen ya da bir güvenlik açığı bulursan bize yaz (13. bölüm).

## 13. Güvenlik açığı bildirme

Bir güvenlik açığı bulduysan **guvenlik@ostlertech.com** adresine yaz (Türkçe ya da İngilizce). Kapsam, kurallar ve
süreç [Güvenlik açığı bildir](/guvenlik-acigi-bildir) sayfasında. Ödül programımız yoktur.
