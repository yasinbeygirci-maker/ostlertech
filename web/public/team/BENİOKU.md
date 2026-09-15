# EKİP FOTOĞRAFLARI — Adlandırma Kuralı

Komuta Merkezi'ndeki ekip kartlarında **gerçek fotoğraf/avatar** kullanmak için
fotoğrafları bu klasöre koy. Kurallar:

- **Dosya adı = ajan kimliği** (sunucudaki `id` alanı), küçük harf:
  - `merve.jpg` · `atlas.jpg` · `argus.jpg` · `iris.jpg` · `vera.jpg` · `mentor.jpg` · `nova.jpg` · `vega.jpg`
  - `firsat-avcisi.jpg` · `syncpass-zk-security.jpg` · `diasync-health-vision.jpg`
  - `gps-telemetry-optimizer.jpg` · `kmp-desktop-converter.jpg` · `grasshopper-parametric.jpg`
- **Kabul edilen uzantılar:** `.jpg` `.jpeg` `.png` `.webp` `.svg` (ajan başına TEK dosya; birden fazla varsa öncelik: **jpg > png > webp > svg**)
- **Önerilen boyut:** 256×256 kare, yüz ortada (kartlarda 44px yuvarlak kırpılır)

## Hazır Portreler

14 ajanın **stilize SVG portreleri zaten üretildi** (her ajan kendi renginde amblem:
hayalet monogram + halo deseni + siluet). Bunlar üretilmiş dosyalar:

- Yeniden üretmek için: `node .team/konsol/portre-uret.mjs` (deterministik — aynı TEAM → aynı portreler)
- Gerçek fotoğrafla değiştirmek için: aynı isimle `.jpg` koy (`merve.jpg`) — jpg öncelik alır, SVG gölgede kalır; SVG'yi silmene gerek yok

## Nasıl çalışır

1. Sunucu `/api/ekip`'te her ajana `fotoVar: true/false` yazar (dosya var mı yok mu)
2. Kart panelinde **"🖼️ Foto / 🎨 Avatar"** düğmesiyle geçiş yapılır
3. Seçim `localStorage`'da saklanır — sayfa kapanıp açılsa hatırlanır
4. Foto modunda dosyası olmayan ajanlar otomatik **SVG avatar** gösterir (boşluk yok)
5. Fotoğraf sunucudan `/ekip-foto/<id>.<uz>` ile servis edilir (repo dışına sızmaz)

Not: Bu klasör web sitesinin deploy'una girmez — Komuta Merkezi bunu doğrudan
dosya sisteminden okur. Sitenin kendi ekip sayfası ayrı bir iştir.
