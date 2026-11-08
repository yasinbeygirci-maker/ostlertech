# Sosyal medya simgeleri: kaynak ve kullanım (okuma tarihi 2026-11-01)

Logolar yalnız resmî marka paketlerinden alındı, yeniden çizilmedi, renk/oran değiştirilmedi (ic-kurallar.md §10).

| Dosya | Resmî kaynak | Pakette dosya |
|---|---|---|
| facebook.png | https://about.meta.com/brand/resources/facebook/logo/ (Facebook-Brand-Asset-Pack.zip) | Logo/Primary Logo/Facebook_Logo_Primary.png (mavi daire, beyaz f; pakette SVG yok, PNG 2084x2084 olduğu gibi) |
| instagram.svg | https://about.meta.com/brand/resources/instagram/instagram-brand/ (IG_brand_asset_pack_2023.zip) | 01 Static Glyph/02 White Glyph/Instagram_Glyph_White.svg (karanlık zeminde beyaz glyph) |
| youtube.png | https://brand.youtube/youtube-icon/ (youtube-icon.zip, ayrıca https://brand.youtube/ ve /color) | YouTube_Icon/Digital/01 Red/yt_icon_red_digital.png (kırmızı, üçgen beyaz; 1255x1075) |

## Uyulan kılavuz kuralları
- Facebook: logo tam ve değişmemiş; yeniden renklendirme, gölge, çerçeve yok; boşluk = genişliğin 1/4'ü; dijital en küçük genişlik 16 px; başka sosyal ağlar yalnız genel "Bizi takip edin / Follow us" çağrısı altında anılır.
- Instagram: resmî glyph, beyaz sürüm; değiştirme yok; yalnız "Follow us" çağrısı bağlamında Facebook ile birlikte.
- YouTube: kırmızı simgede üçgen her zaman beyaz; renk/gölge/çerçeve/eğme/sıkıştırma/uzatma yok; kılavuz dijitalde yüksekliği en az 100 px ister, YouTube dosyası 100 px yükseklikte kullanılır (dosyanın kendi saydam iç boşluğuyla; görünen kırmızı şekil yaklaşık 54 px). Facebook ve Instagram bununla görsel olarak eşleşsin diye 54 px (kılavuz alt sınırı Facebook 16 px, Instagram için sayısal sınır yok). Oran hepsinde korunur; simgeler arası boşluk 24 px.
- Sayfaya yalnız `SocialLinks.tsx` koyar; her bağlantıda `aria-label="OstlerTech <Ad>"`, `target="_blank"`, `rel="noopener noreferrer"`, dokunma hedefi >= 44 px.
- Not: Facebook ve Instagram Meta'nın, YouTube Google'ın tescilli markasıdır.
- 2026-11-08 (LinkedIn ve TikTok eklendi):
  - linkedin.png: https://brand.linkedin.com/downloads → "[in] Logo" (in-logo.zip, https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/logos/in-logo.zip), pakette `in-logo/InBug-White.png` (840x779, beyaz kare, "in" saydam, ® dahil) olduğu gibi. Sayfada `linkedin-162.png` (175x162, LANCZOS, kırpma yok) 54 px yükseklikte.
  - LinkedIn kılavuzu (https://brand.linkedin.com/in-logo, okuma 2026-11-08): [in] logosu şirket sayfasına bağlantı olarak ve "bir dizi sosyal medya simgesi" içinde kullanılabilir; renk ve biçim değiştirilmez, yalnız pakette verilen mavi/siyah/beyaz sürümler; sosyal simge dizisinde arka plan rengi serbest; başka sembol ya da kelimeyle birleştirilmez, LinkedIn'in onayı izlenimi verilmez. Koyu alt bilgide Instagram'ın beyaz glyph'iyle uyumlu olsun diye beyaz sürüm seçildi.
  - TikTok: resmî paket TikTok for Developers tasarım kılavuzundaki logo-pack.zip (https://developers.tiktok.com/docs/en/getting-started-design-guidelines). Aynı sayfa "TikTok logoları, simgeleri ... önceden yazılı izin olmadan kullanılamaz" diyor; tiktokbrandbook.com kullanım kuralları sayfası oturumsuz okunamadı. İzin doğrulanamadığı için logo KONMADI, alt bilgide düz yazı "TikTok" etiketi var (aynı aria-label, 54 px yükseklik, 44 px dokunma hedefi). İzin/kural sayfası okunursa logo bu tabloya eklenerek konur.
  - Not: LinkedIn, LinkedIn Corporation'ın; TikTok, ByteDance/TikTok'un tescilli markasıdır.
- 2026-11-08 (hız): sayfada `facebook-162.png` (162x162) ve `youtube-300.png` (350x300) kullanılır: asıl dosyaların gösterim boyutunun 3 katına, oran korunarak (LANCZOS) küçültülmüş kopyaları; kırpma, renk ya da biçim değişikliği yok. Asıl dosyalar kaynak olarak duruyor.
