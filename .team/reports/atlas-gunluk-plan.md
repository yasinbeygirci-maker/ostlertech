# TODO Planı: Supabase Auth Callback ve Güvenlik Header'ları

1. Adım planını ve yapılacak işleri kesinleştir (yazıldı).
2. Mevcut Supabase client kurulumunu incelemek için `AuthForm.tsx` (veya ilgili src/ dosyalarını) oku.
3. `web/src/app/auth/callback/route.ts` dosyasını oluştur (GET handler, code değişimi, dashboard veya login?hata=oauth yönlendirmesi).
4. `web/next.config.ts` dosyasına güvenlik header'larını (`headers()`) ekle.
5. `npx tsc --noEmit` ve `npm run build` ile doğrula.
6. Kısa Türkçe rapor sun.
