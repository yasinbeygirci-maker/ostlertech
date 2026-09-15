# GÜVENLİK RAPORU

> Argus bu dosyayı günceller. Kural: her bulgu kanıtlı, şiddet sınıflı,
> durum işaretli. KRITIK bulgu varsa en üstte PATRON UYARISI.

## PATRON UYARISI — 2026-09-14 (İlk Tam Denetim)

> **ÇÖZÜLDÜ (2026-09-14):** next@15.5.25'e yükseltildi, build doğrulandı,
> audit critical=0. Detay: KAPALI BULGULAR #3.

Bulgu #3 doğrulandı ve **KRITIK**'e yükseltildi: `next@15.1.0` üzerinde
**30+ birikmiş güvenlik açığı** var. En ağır olanları:

- **RCE, CVSS 10.0** — "Next.js is vulnerable to RCE in React flight protocol"
- **RCE, CVSS 9.0** — "Unauthenticated Remote Code Execution on windows-hosted servers" (bu proje Windows'ta geliştiriliyor)
- **Yetki atlaması, CVSS 9.1** — "Authorization Bypass in Next.js Middleware" (dashboard koruması tam da middleware'e oturacaktı — önce yükseltme yapılmalı)
- **SSRF, CVSS 8.6** — WebSocket upgrade üzerinden
- ayrıca çok sayıda DoS/cache-poisoning/XSS açığı

**Yama mevcut:** `next@15.5.25` (major değil, doğrudan yükseltilebilir).

---

## AÇIK BULGULAR

### 4. [ORTA] Supabase RLS politikaları denetlenemedi — ERİŞİM ENGELİ
- Durum: `acik`
- Kanıt: Repoda `supabase/` dizini ve migration dosyası yok;
  `Waitlist.tsx` anon key ile `waitlist` tablosuna insert yapıyor.
  RLS durumu repodan belirlenemiyor — Supabase dashboard/CLI erişimi şart.
- Atlas brifingi: `supabase db dump --role postgres` veya dashboard'dan
  policy dökümü; hedef: `waitlist` için insert-only anon policy, select kısıtı.

### 6. [DÜŞÜK — YENİ] CI'da secret taraması yok
- Durum: `acik`
- Kanıt: Repo'da `.github/workflows` yok; tarama rutini bulunmadı.
- Atlas brifingi: Faz 4 CI işine gitleaks veya benzeri adım eklenecek.

---

## KAPALI BULGULAR

### 1. [YÜKSEK — KAPALI (2026-09-15)] /dashboard oturum koruması yok
- Durum: `kapali (2026-09-15)`
- Kanıt: `web/src/middleware.ts` incelendi. `@supabase/ssr` (`^0.12.7`) ile `createServerClient` kullanılıyor. İstek/yanıt çerezleri (`request.cookies.getAll`, `cookiesToSet`) güvenli şekilde senkronize ediliyor. `await supabase.auth.getUser()` ile güvenli sunucu tarafı oturum doğrulaması yapılıyor. `/dashboard` rotaları (`/dashboard/:path*`) oturum yoksa `/login` adresine yönlendiriliyor. `npx tsc --noEmit` hatasız geçti.

### 2. [YÜKSEK — KAPALI (2026-09-15)] OAuth callback akışı eksikti
- Durum: `kapali (2026-09-15)`
- Kanıt: `web/src/app/auth/callback/route.ts` incelendi. `supabase.auth.exchangeCodeForSession(code)` çağrısı ile yetkilendirme kodu güvenle oturuma dönüştürülüyor. Başarılı durumda `/dashboard` adresine yönlendirme yapılırken, hata durumunda `/login?hata=oauth` adresine yönlendirme güvenli şekilde sağlanıyor.

### 3. [KRITIK — KAPALI (2026-09-14)] next@15.1.0 — 30+ birikmiş açık
- Durum: `kapali (2026-09-14)` — next@15.5.25 yüklendi
- Kanıt: `npm audit` (2026-09-14): metadata total=4 (1 critical, 3 high);
  `next` paketi 33 advisory listeliyor. En ağır: RCE CVSS 10.0 (React flight
  protocol), RCE CVSS 9.0 (Windows), Middleware Authorization Bypass CVSS 9.1,
  SSRF CVSS 8.6. Kaynak: GHSA kayıtları, audit çıktısında URL'leriyle mevcut.
- Çözüm kanıtı: `npm install --save-exact next@15.5.25` (eslint-config-next
  15.5.25 ile eşlendi) → `npm run build` ✓ 9 rota → audit: critical=0,
  total=3 (hepsi build-zinciri: postcss high, js-yaml high, next moderate
  sadece postcss'ten geçme). `node -e require('next/package.json')` → 15.5.25.

### 5. [ORTA — KAPALI (2026-09-15)] Güvenlik başlıkları yapılandırılmamıştı
- Durum: `kapali (2026-09-15)`
- Kanıt: `web/next.config.ts` dosyasına `headers()` asenkron fonksiyonu eklendi. Tüm rotalar (`/(.*)`) için HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` ve `Permissions-Policy` başlıkları eksiksiz olarak tanımlandı.

### 7. [BİLGİ — KAPALI] .env / secrets sızmması — TEMİZ
- Durum: `kapali`
- Kanıt: `git ls-files | grep -iE '\.env|secret'` → boş; hardcoded secret
  desen taraması (sk_live, ghp_, AIza, JWT) → 0 eşleşme; `.env.local` yalnızca
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` içeriyor.

### 8. [BİLGİ] Geçişli bağımlılıklar (build zinciri)
- Kanıt: `npm audit`: js-yaml high (GHSA-2883-xcg3-v3hh, dev zinciri),
  postcss high (build-time, sourceMappingURL açıkları), sharp high
  (libvips/libheif 2026 CVE'leri; site `unoptimized:true` kullandığından
  runtime etkisi sınırlı).

## SONRAKİ ADIMLAR (sıralı)
1. ~~Atlas: next@15.5.25 yükseltmesi (KRITIK)~~ → KAPALI 2026-09-14
2. ~~Atlas: middleware + @supabase/ssr (bulgu #1) + OAuth callback (bulgu #2)~~ → KAPALI 2026-09-15
3. ~~Atlas: security headers (bulgu #5)~~ → KAPALI 2026-09-15
4. Patron: Supabase erişimi verildiğinde Argus RLS denetimini tamamlar (bulgu #4)
5. Atlas: CI secret-scan (bulgu #6, Faz 4)
