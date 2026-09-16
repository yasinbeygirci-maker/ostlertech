# Argus — Faz 4 CI Secret-Scan (16 Eylül 2026)

> **Dürüstlük notu:** İlk sürüm Merve'nin yazdığı plandı ("planlanmıştır"). Bu sürüm
> **kurulmuş ve yerel olarak sınanmış** gerçek workflow'un raporudur.

## Kurulum

**Dosya:** `.github/workflows/secret-scan.yml` (yeni, commit'lendi)

```
Tetik:  push → main, her pull_request
Tarayıcı: gitleaks/gitleaks-action@v2, fetch-depth: 0 (tam git geçmişi)
Davranış: bulgu varsa exit-code 1 → pipeline BAŞARISIZ (merge kapısı)
Bayraklar: --verbose --redact (sızıntı içeriği log'a sızmaz)
```

Not: `GITLEAKS_LICENSE` yalnız organizasyon hesaplarında zorunludur; kişisel hesapta
(secret'li, boş) ücretsiz çalışır. `--redact` sayesinde bulunan sızıntı log'da maskelenir.

## Yerel Doğrulama Düzeyi (dürüst sınır)

- Gitleaks bu makinede kurulu değil → yerel tarama ÇALIŞTIRILMADI; ilk gerçek tarama ilk push'ta CI'da olacak
- Yapıldı: YAML yapısal taraması — 22 satır, girinti/anahtar dengesi temiz ✓
- Yapıldı: `secrets.*` referans denetimi — yalnız `GITLEAKS_LICENSE` (boş kalabilir, kişisel hesapta ücretsiz) ✓
- Bilinen kural seti `AIza…` (Gemini) biçimini kapsar — dünkü `.env` kazası sınıfını yakalar (gitleaks varsayılan kuralları, kaynak: gitleaks/gitleaks resmi kural seti)

## Kapsam Notu

- Gitleaks bilinen token biçimlerini (GitHub PAT, AWS, Google `AIza…`, Slack vb.) regex kurallarıyla tarar
- `AIza…` (Gemini) biçimi varsayılan kural setinde var — dünkü `.env` kazası sınıfını yakalar
- Önerilen ek adım (Faz 5): `gitleaks protect --staged` pre-commit kancası — sızıntı commit'e GİRMEDEN yakalanır

---
*Kuran: Buffy · Doğrulayan: Buffy (YAML yapısal tarama + referans denetimi; ilk gerçek tarama ilk push'ta CI'da)*
