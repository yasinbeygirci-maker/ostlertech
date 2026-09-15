# OSTLERTECH EKİBİ — 7 AJAN

Codebuff/Freebuff custom agent sistemiyle kurulu takım (`.agents/`).
Tanımlar Codebuff'ın resmi mağaza ajanlarından (base2/Buffy orkestratörü,
editor-best-of-n, researcher-web) öğrenilen prensiplerle yazıldı.

## Org Şeması

```
                 ELONA (Patron)
        günlük akış · sözler · hatırlatmalar
                        │
                MERVE — orkestra şefi
     ┌─────┬─────┼─────┼─────┬─────┬─────┐
   IRIS  VERA ATLAS MENTOR NOVA VEGA ARGUS
  üretim satış kod   sıkı  büyüme veri güvenlik
              mimari ses
```

| Rol | Ajan | Alan | Doğrulama kanıtı |
|-----|------|------|------------------|
| Şef | `merve` | Plan, delegasyon, onay akışı, raporlama | Uzman çıktısının fiziksel kanıtı |
| Üretim | `iris` | Görsel, video, tasarım, metin | Dosyanın diskte var olması |
| Satış | `vera` | CRM (Supabase waitlist), taslak mesajlar | Onaylı taslak + segment listesi |
| Mühendis | `atlas` | Kod, mimari, yayın hazırlığı (web/) | `npm run build` çıktısı |
| Mentor | `mentor` | Gelir önceliklendirme, acı gerçek | — (salt akıl) |
| Büyüme | `nova` | Reklam, funnel, kampanya planı | Kaynaklı benchmark + onay listesi |
| Veri | `vega` | Rapor, birim ekonomi, doğrulama | Kaynaklı sayılar |
| Güvenlik | `argus` | Auth/RLS/CVE/secrets denetimi, yayın öncesi kapı | Kanıtlı bulgu raporu + şiddet sınıfı |

### Ürün-Uzmanı Kadro (Atlas komutasında)

| Rol | Ajan | Ürün | Doğrulama kanıtı |
|-----|------|------|------------------|
| ZK Güvenlik | `syncpass-zk-security` | SyncPass | Kanıtlı denetim bulguları |
| Sağlık & Vision | `diasync-health-vision` | DiaSync | Çalışan eval/test çıktıları |
| Telemetri | `gps-telemetry-optimizer` | GPS takip | Önceki/sonra metrikleri |
| Masaüstü | `kmp-desktop-converter` | KMP taşıma | Derleme kanıtı + envanter |
| Parametrik | `grasshopper-parametric` | Cephe üretimi | Üret→parse doğrulama döngüsü |

Ürün bağlamı: `.agents/PORTFOLIO.md` — tüm ekip ortak okur.

## Kullanım

```bash
# Şef üzerinden (önerilen — tüm akış Merve'de):
@Merve yeni landing bölümü istiyorum, Atlas yapsın

# Doğrudan uzman:
@Atlas web/src/app/dashboard/page.tsx'i gerçek veriye bağla
@Mentor bu hafta neye odaklanmalıyım
```

## Onay Kuralları (tüm ekip için geçerli)

Şu işler **yalnızca Patron onayıyla** yapılır; ajanlar planı sunar,
"PATRON ONAYI GEREKLİ" işaretler ve bekler:
- Para harcayan her şey (reklam bütçesi, abonelik, API maliyeti)
- Yayına alma / deployment / git push
- Dosya veya veri silme, DB yazma sorguları
- Fiyat değişikliği, indirim, kampanya başlatma
- Mimari kararlar

## Rapor Dosyaları (Elona'nın alanını besler)

- `.team/reports/gunluk-akis.md` — BUGÜN YAPILANLAR / HATIRLATMALAR
- `.team/reports/sozler-defteri.md` — verilen sözler: sahip, tarih, durum

Her iş seansının sonunda Merve bu dosyaları günceller.
Boş söz bırakılmaz; açık söz takipsiz kalmaz.

## Resmi Codebuff Yardımcıları (spawn edilebilir)

- `codebuff/file-picker@0.0.8` — ilgili dosyaları bulur
- `codebuff/code-searcher@0.0.12` — kod arar
- `codebuff/editor-best-of-n@0.0.2` — çoklu öneriden en iyi kod değişikliği
- `codebuff/researcher-web@0.0.19` — kaynaklı web araştırması
- `codebuff/researcher-docs@0.0.19` — dokümantasyon araştırması

## Güvenlik Kapısı

Yayına alma (deploy/push) planı **Argus denetimi olmadan** Merve'ye gitmez:
1. Atlas yayın planını hazırlar →
2. Argus denetler (auth, RLS, CVE, secrets) →
3. KRITIK/YÜKSEK bulgu varsa Atlas düzeltir, Argus yeniden doğrular →
4. Damgalı plan Merve üzerinden Patron onayına sunulur.

Rapor: `.team/reports/guvenlik.md`
