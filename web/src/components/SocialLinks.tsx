// Sosyal medya simgeleri. Logolar resmî marka paketlerinden, değiştirilmeden (kaynak: public/img/sosyal/KAYNAK.md).
// Kılavuz kuralları: Facebook "f" logosu mavi dairesiyle tam ve değişmemiş; Instagram beyaz glyph; YouTube kırmızı
// simge (üçgen beyaz); YouTube dosyası kılavuzdaki 100 px yükseklikte (kendi iç boşluğuyla, görünen kırmızı şekil ~54 px),
// Saydam kenar (her yanda ~20 px) negatif kenar boşluğuyla götürülür, dosya kırpılmaz: görünen şekiller arası boşluk eşit.
// Facebook/Instagram/LinkedIn aynı görünür boyuta (54 px) getirildi. Oranlar korunur, gölge/çerçeve yok.
// TikTok: resmî paket sayfası TikTok'un yazılı izni olmadan logo kullanımına izin vermiyor (KAYNAK.md); bu yüzden düz yazı etiketi.
import { INSTAGRAM_URL, LINKEDIN_URL, TIKTOK_URL, YOUTUBE_URL } from "@/lib/site";

export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61592628699959";

/** Organization JSON-LD sameAs listesi: sitedeki bütün şirket hesapları tek yerden. */
export const SOCIAL_PROFILES = [INSTAGRAM_URL, YOUTUBE_URL, FACEBOOK_URL, LINKEDIN_URL, TIKTOK_URL];

type Lang = "tr" | "en";

interface Item {
  href: string;
  name: string;
  src?: string;
  w?: number;
  h?: number;
  pad?: number;
}

export default function SocialLinks({ lang = "tr" }: { lang?: Lang }) {
  const label = lang === "en" ? "Follow us" : "Bizi takip edin";
  const items: Item[] = [
    { href: INSTAGRAM_URL, name: "Instagram", src: "/img/sosyal/instagram.svg", w: 54, h: 54 },
    // Sayfada 3 kat çözünürlüklü, oranı korunmuş küçültülmüş kopya (asıl dosya 2084 px, 55 KB idi; KAYNAK.md).
    { href: FACEBOOK_URL, name: "Facebook", src: "/img/sosyal/facebook-162.png", w: 54, h: 54 },
    { href: YOUTUBE_URL, name: "YouTube", src: "/img/sosyal/youtube-300.png", w: 117, h: 100, pad: 20 },
    // LinkedIn [in] beyaz sürüm (resmî paket, ® işaretiyle birlikte, kırpılmadan); 3 kat kopya, dosya yüksekliği 54 px.
    { href: LINKEDIN_URL, name: "LinkedIn", src: "/img/sosyal/linkedin-162.png", w: 58, h: 54 },
    { href: TIKTOK_URL, name: "TikTok" },
  ];
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
        {items.map((i) => (
          <li key={i.name} style={i.pad ? { marginInline: -i.pad } : undefined}>
            <a
              href={i.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`OstlerTech ${i.name}`}
              className={
                i.src
                  ? "flex items-center justify-center min-w-[44px] min-h-[44px] opacity-90 hover:opacity-100 transition-opacity"
                  : "flex items-center justify-center min-w-[44px] min-h-[54px] rounded-full border border-line px-5 text-base font-semibold text-foreground hover:text-white hover:border-primary/60 transition-colors"
              }
            >
              {i.src ? (
                // Alt bilgide: tembel yüklenir; yoksa React her sayfanın başında yüksek öncelikli "preload" olarak ister.
                <img src={i.src} alt="" width={i.w} height={i.h} loading="lazy" decoding="async" style={{ height: i.h, width: "auto" }} />
              ) : (
                i.name
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
