# Argus Doğrulama Brifi (Güvenlik Denetimi)

Bu brif, **guvenlik.md** planı kapsamında **Argus** tarafından gerçekleştirilecek doğrulama ve test adımlarını detaylandırır.

---

## Doğrulama Kapsamı

Atlas gerekli kod değişikliklerini tamamlayıp commit/PR aşamasına geldiğinde veya doğrudan kod tabanında güncellemeler yapıldığında, Argus aşağıdaki bulguları tek tek kod karşısında doğrulayacaktır:

### 1. Middleware & Supabase SSR Denetimi (`web/src/middleware.ts`)
- **Kontrol Edilecekler:**
  - `web/src/middleware.ts` dosyası mevcut mu ve `@supabase/ssr` cookie client doğru yapılandırılmış mı?
  - `/dashboard` rotasına anonim (oturum açmamış) istek atıldığında doğrudan `/login` adresine 302/307 yönlendirmesi yapılıyor mu?
  - Oturum açmış kullanıcılar sorunsuz şekilde içeri girebiliyor mu?

### 2. Auth Callback Denetimi (`web/src/app/auth/callback/route.ts`)
- **Kontrol Edilecekler:**
  - `route.ts` içerisinde `exchangeCodeForSession` fonksiyonu doğru parametrelerle çağrılıyor mu?
  - Hatalı veya süresi dolmuş kod durumlarında güvenli hata yönetimi (`/login?error=...`) yapılıyor mu?

### 3. Güvenlik Başlıkları Denetimi (`web/next.config.ts`)
- **Kontrol Edilecekler:**
  - `next.config.ts` içindeki `headers()` fonksiyonu HSTS, X-Frame-Options, X-Content-Type-Options ve Referrer-Policy başlıklarını HTTP yanıtlarına ekliyor mu?
  - `curl -I` veya test araçlarıyla başlıkların varlığı doğrulanabiliyor mu?

---
*Bu brif, Argus'un güvenlik.md bulgularını kod tabanı üzerinde bağımsız olarak doğrulaması için temel teşkil eder.*
