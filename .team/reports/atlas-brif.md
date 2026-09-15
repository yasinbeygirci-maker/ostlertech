# Atlas Uygulama Brifi (Güvenlik İyileştirmeleri)

Bu brif, **guvenlik.md** planı kapsamında **Atlas** tarafından uygulanacak kritik güvenlik ve kimlik doğrulama iyileştirmelerini detaylandırır.

---

## Bulgular ve Uygulama Kapsamı

### 1. Web Middleware ve Supabase SSR Cookie Client (`/dashboard` Koruması)
- **Dosya:** `web/src/middleware.ts`
- **Hedef:** 
  - `@supabase/ssr` kullanarak güvenli bir cookie client oluşturulacak.
  - `/dashboard` ve altındaki tüm yollar (`/dashboard/*`) korunacak.
  - Kullanıcının oturumu (session) yoksa, kullanıcı güvenli bir şekilde `/login` sayfasına yönlendirilecek (`NextResponse.redirect`).
  - Token yenileme ve cookie senkronizasyonu middleware üzerinden doğru şekilde yönetilecek.

### 2. Auth Callback Route (`exchangeCodeForSession`)
- **Dosya:** `web/src/app/auth/callback/route.ts`
- **Hedef:**
  - OAuth veya e-posta doğrulama dönüşlerinde (code exchange) `exchangeCodeForSession` doğru şekilde çağrılacak.
  - Kod değişimi başarılı olduğunda kullanıcı hedeflenen sayfaya (`/dashboard` veya istenen `next` parametresi) yönlendirilecek.

### 5. Next.js Güvenlik Başlıkları (`next.config.ts`)
- **Dosya:** `web/next.config.ts`
- **Hedef:**
  - `headers()` konfigürasyonu eklenerek şu HTTP güvenlik başlıkları (security headers) aktif edilecek:
    - **HSTS** (Strict-Transport-Security)
    - **X-Frame-Options** (DENY / SAMEORIGIN)
    - **X-Content-Type-Options** (nosniff)
    - **Referrer-Policy** (strict-origin-when-cross-origin)
    - (Varsa CSP veya diğer gerekli başlıklar)

---
*Bu brif, guvenlik.md doğrultusunda Atlas'ın kod geliştirme adımlarına rehberlik etmek üzere hazırlanmıştır.*
