# GITHUB PUSH HAZIRLIK RAPORU

> 2026-09-15 — Amaç: yerel `main`'i `origin/main`'e (github.com/yasinbeygirci-maker/ostlertech)
> güvenle taşımak. **Push yapılmadı** — Patron kararı bekliyor.

## Mevcut Durum (doğrulanmış)

| Konu | Durum |
|------|-------|
| Remote | `origin → https://github.com/yasinbeygirci-maker/ostlertech.git` ✓ |
| Kimlik doğrulama | `git ls-remote` 200 — credential sorunu yok ✓ |
| Upstream tracking | `main → origin/main` ayarlandı ✓ |
| Yerel | `90cac4f7` — 5 anlamlı commit (güvenlik paketi, /products, ekip altyapısı) |
| Uzak | `b9e3f855 "Güncelleme"` — 43 dosyalık ESKİ Next.js sitesi (src/ kökte) |
| Geçmiş ilişkisi | **İlgisiz tarihler** — ortak ata yok; düz push non-fast-forward reddedilir |

## Uzak Repodaki Kritik İçerik

- `src/app/gizlilik/page.tsx` — uygulamaların (SyncPass, DiaSync vb.) gizlilik politikası
- `src/app/privacy/page.tsx` — İngilizce sürüm
- `src/app/diasync/delete-account/page.tsx` — DiaSync hesap/veri silme talebi sayfası
- Bunlar **Google Play Console listelemelerinde URL olarak verilebilir** — silmeden önce
  Play Store kayıtlarının hangi adresleri kullandığı kontrol edilmelidir.

## Lokal Karşılaştırma

- `/gizlilik-politikasi` (Navbar'lı modern versiyon) ✓ var — ama URL FARKLI (uzak: `/gizlilik`)
- `web/src/app/diasync/privacy` ✓ var
- **hesap silme sayfasının lokali yok** ✗ — uzaktaki `delete-account` içeriği taşınmalı

## Seçenekler

### A) Zorla yayınla: `git push --force-with-lease origin main` (hızlı, uzak eski site gider)
ÖN KOŞUL: Uzaktaki 3 yasal sayfayı önce `web/src/app/` altına taşı (en azından
`/gizlilik` ve `/diasync/delete-account` rotalarını birebir koruyarak), build doğrula.

### B) Birleştir: `git merge origin/main --allow-unrelated-histories`
Çakışma: `README.md` + `.gitignore` (elle çözülür). Sonuç: kökte eski Next.js yapısı
(package.json, src/) ile `web/` birlikte yaşar — çift yapı, dağınık repo. Önerilmez.

### C) Yeni dal: `git push origin main:refs/heads/web-yeniden-kurulum`
Sıfır risk — GitHub'da karşılaştırılır, PR ile karar verilir. Yasal sayfa taşıma işi
yine de yapılmalı; PR'dan sonra force ya da merge ile main'e geçilir.

## Önerilen Sıra (A veya C için ortak)

1. Uzaktan 3 yasal sayfanın içeriğini `web/src/app/{gizlilik,privacy,diasync/delete-account}/page.tsx`
   olarak portla (mevcut Navbar/Footer stilinde)
2. `npm run build` + canlı smoke test
3. Commit: `feat(web): gizlilik ve hesap silme sayfalari (Play Store URL korunumlu)`
4. Push kararını uygula (A → force-with-lease, C → yeni dal)
5. Play Console URL'lerini doğrula
