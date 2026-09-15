# OSTLERTECH ÜRÜN PORTFÖYÜ — Ekip İçin Ortak Bağlam

> Bu dosya tüm ajanların ortak ürün bilgisidir. Görev bir ürüne dokunuyorsa
> önce buraya bak; ürün-uzmanı ajanlar buradaki tanımlarla çalışır.

## Ürünler

| Ürün | Alan | Teknik Derinlik |
|------|------|-----------------|
| **SyncPass** | Şifre yöneticisi | Zero-Knowledge şifreleme (AES-256), biyometrik kilit, Health/Güvenlik Analizi panosu, Android/iOS/Windows/macOS |
| **DiaSync** | Aile sağlık senkronizasyonu | Çocuk diyabeti odaklı; Gemini Vision besin analizi, glikoz trend tahmini, Wear OS senkronizasyonu |
| **GPS Takip** | Anlık konum izleme | Kotlin Coroutines/Flow arka plan servisleri, telemetri paketleme, ağ gecikmesi optimizasyonu |
| **Masaüstü Çözümleri** | Mobil→masaüstü taşıma | Kotlin Multiplatform (KMP) ile Windows/macOS uyarlaması, yerel API entegrasyonları |
| **Grasshopper Cephe** | Parametrik mimari | Rhino/Grasshopper; cephe tasarımı, blok tanımları, koordinat bazlı imalat verisi dışa aktarımı |

Bu repo (`ostlertech-web`): pazarlama sitesi (`web/`) + Android KPM içe
aktarma uygulaması (`app/` — KpmImportService, SecurityVault).

## Önerilen Ürün-Uzmanı Ajanlar (şimdilik dokümante; ajan dosyası yok)

1. **syncpass-zk-security** — Zero-Knowledge şifreleme ve biyometrik
   entegrasyonları denetler; Android→iOS geçişte platforma özgü güvenlik
   protokol tutarlılığını sağlar.
2. **diasync-health-vision** — Gemini Vision besin analizini optimize eder;
   çocuk diyabetinde glikoz trend tahmin doğruluğunu ve Wear OS
   senkronizasyonunu test eder.
3. **gps-telemetry-optimizer** — Coroutines/Flow arka plan servislerinde
   veri paketleme ve ağ gecikmesi minimizasyonu yapar.
4. **kmp-desktop-converter** — Mobil kod tabanlarını KMP ile Windows/macOS'a
   uyarlamada UI/UX uyumu ve yerel API entegrasyonlarını yönetir.
5. **grasshopper-parametric** — Rhino/Grasshopper'da cephe tasarımı, blok
   tanımları ve koordinat bazlı imalat verisinin hatasız hesaplanıp dışa
   aktarılmasını otomatize eder.

## Komuta Zinciri (öneri)

Ürün-uzmanı ajanlar iş ajanlarıdır: Merve değil **Atlas** komuta eder
(kod/mimari alanı); gerektiğinde Argus güvenlik denetimi yapar.
