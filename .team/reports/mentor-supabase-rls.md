# Mentor — Supabase RLS Denetimi (16 Eylül 2026)

> **Dürüstlük notu:** İlk sürümü Merve benim adıma özet yazmıştı; denetim iddia düzeyindeydi.
> Bu sürüm **Buffy'nin repo üzerinde satır satır yaptığı gerçek denetimin** çıktısıdır.
> Kapsam: repodaki tüm SQL dosyaları + Supabase istemci kodu. Canlı Supabase projesindeki
> diğer tablolar repodan görülemez — oradaki RLS durumu Dashboard'dan ayrıca kontrol edilmelidir.

## Denetim Kapsamı

| Dosya | İçerik |
|-------|--------|
| `web/supabase/anydoc-waitlist.sql` | anydoc bekleme listesi tablosu + RLS |
| `web/src/lib/supabase.ts` | istemci (anon key) |
| `web/src/app/api/anydoc/bekleme/route.ts` | server-side insert |
| `web/src/app/auth/callback/route.ts` | OAuth kod değişimi |
| `web/src/middleware.ts`, `AuthForm.tsx`, `Waitlist.tsx` | oturum/form akışları |

## Bulgu 1 — `anydoc_waitlist`: DOĞRU ✓

- `enable row level security` aktif
- Politika: **yalnızca** `for insert to anon with check (true)` — anon SELECT/UPDATE/DELETE kapalı
- İsimli politika + `drop policy if exists` ile idempotent kurulum
- **Tek eksik:** sayacın dayandığı `anydoc_waitlist_sayac` görünümü owner hakkıyla okur, sorun değil; ancak `security_invoker = true` önerilir (RLS'li tablo üstündeki görünümler için Postgres 15+ iyi uygulaması)

## Bulgu 2 — `auth/callback/route.ts`: ORTA RİSK ⚠

`exchangeCodeForSession` başarılıysa kullanıcı `/dashboard`'a yönlendiriliyor; hata durumunda `?hata=oauth` ile login'e dönülüyor. Doğru desen. **Ancak:**

- `/dashboard` sayfası istemcide oturum kontrolü yapıyor mu doğrulanmalı — middleware koruması oturum çerezine bakıyorsa OK, bakmıyorsa dashboard statik olarak prerender edilebilir (build çıktısında ○ statik görünüyor) → oturumsuz ziyaretçinin boş dashboard görmemesi için middleware `matcher`'ında `/dashboard` bulunduğundan emin ol

## Bulgu 3 — service_role anahtarı yok: İYİ ✓

Repo ve `.env*` dosyalarında `SERVICE_ROLE` referansı sıfır. Sunucu route'ları anon key kullanıyor — RLS politikalarıyla sınırlı kalır, doğru tasarım.

## Eylem Maddeleri (Patron onayına sunulur)

1. Canlı Supabase Dashboard'unda **tüm tabloların** RLS durumunu gözle kontrol et (repo dışı risk alanı) — 10 dakikalık iş
2. `anydoc-waitlist.sql`'e `alter view ... set (security_invoker = true)` satırını ekle
3. `/dashboard` middleware korumasını canlıda oturumsuz istekle test et

---
*Denetleyen: Buffy (Buffy doğrulamalı) · Yöntem: dosya okuma + grep taraması + build çıktısı analizi*
