// Sosyal medya simgeleri. Logolar resmî marka paketlerinden, değiştirilmeden (kaynak: public/img/sosyal/KAYNAK.md).
// Kılavuz kuralları: Facebook "f" logosu mavi dairesiyle tam ve değişmemiş; Instagram beyaz glyph; YouTube kırmızı
// simge (üçgen beyaz); YouTube dosyası kılavuzdaki 100 px yükseklikte (kendi iç boşluğuyla, görünen kırmızı şekil ~54 px),
// Saydam kenar (her yanda ~20 px) negatif kenar boşluğuyla götürülür, dosya kırpılmaz: görünen şekiller arası boşluk eşit.
// Facebook/Instagram aynı görünür boyuta (54 px) getirildi. Oranlar korunur, gölge/çerçeve yok.
import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/site";

export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61592628699959";

type Lang = "tr" | "en";

export default function SocialLinks({ lang = "tr" }: { lang?: Lang }) {
  const label = lang === "en" ? "Follow us" : "Bizi takip edin";
  const items = [
    { href: INSTAGRAM_URL, name: "Instagram", src: "/img/sosyal/instagram.svg", w: 54, h: 54 },
    // Sayfada 3 kat çözünürlüklü, oranı korunmuş küçültülmüş kopya (asıl dosya 2084 px, 55 KB idi; KAYNAK.md).
    { href: FACEBOOK_URL, name: "Facebook", src: "/img/sosyal/facebook-162.png", w: 54, h: 54 },
    { href: YOUTUBE_URL, name: "YouTube", src: "/img/sosyal/youtube-300.png", w: 117, h: 100, pad: 20 },
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
              className="flex items-center justify-center min-w-[44px] min-h-[44px] opacity-90 hover:opacity-100 transition-opacity"
            >
              {/* Alt bilgide: tembel yüklenir; yoksa React her sayfanın başında yüksek öncelikli "preload" olarak ister. */}
              <img src={i.src} alt="" width={i.w} height={i.h} loading="lazy" decoding="async" style={{ height: i.h, width: "auto" }} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
