# Defne dil denetimi bekleniyor (yayın kapısı)

Bu dosya duruyorsa `YAYIN_KAPISI=1 npm test` kırmızıdır ve sayfa yayınlanmaz (tests/telefon-calinirsa.test.ts).
Defne bulgusu işlenince dosyayı sil, sonra kapıyı yeniden koş.

Denetlenecek yeni/değişen metin (tek kaynak: src/lib/telefon-calinirsa.ts, TR ve EN):
- 4. adım: Google oturumunu kapatma satırı.
- 5. adım: başlık, dört satır ve not (e-Devlet "Kayıp/Çalıntı İhbar Bildirimi", kendi adına kayıtlı hat, iki IMEI, iptal).
- "Çalınmadan önce": SIM PIN / PUK maddesi, IMEI + *#06# maddesi.
- ctaNote (kayıt sınırı sayısız).
- Kaynak listesindeki yeni adlar (Google 41078 ve 3067630, Apple 118228 ve 108037, e-Devlet, Mevzuat).
- Kart ve Reels metni: pazarlama\gorsel\2026-11-03-telefon-calinirsa\kaynak\uret.py (IMEI_TR / IMEI_EN, 5. adım, src satırı).

## Durum (3 Kas 2026, gece)
Düzeltmeler işlendi (Defne 2. denetim: M1, S1-S9, S11-S14, N1, N4; S5 ve S10 bilerek yapılmadı), tekrar denetim bekliyor.
Bu dosya Defne ikinci gözden geçirmeyi bitirene kadar SİLİNMEZ; duruyorsa YAYIN_KAPISI=1 npm test kırmızıdır.
