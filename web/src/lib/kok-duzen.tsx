import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SCREENS_VERSION, SITE_URL } from "@/lib/site";

// TR ve EN kök düzenlerinin ortak parçası: (tr)/layout.tsx ve (en)/layout.tsx yalnız dil değerini verir.
// globals.css her kök düzende ayrıca içe aktarılır.

// Masaüstü uygulamasıyla aynı yazı tipleri.
const sans = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });
// preload: false (2026-11-08 hız): eş aralıklı yazı yalnız birkaç küçük öğede (SHA, lisans kodu, sayaç); önceden her sayfada iki dosya
// (~56 KB) yüksek öncelikle iniyordu. Artık yalnız o yazının kullanıldığı sayfada, gerektiğinde iner (display: swap).
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono", display: "swap", preload: false });

const TEMEL = {
  tr: {
    title: "OstlerTech: Verisini kendinde tutmak isteyenler için uygulamalar",
    description:
      "Verisini kendinde tutmak isteyen kişiler ve küçük işletmeler için SyncPass, AreaPilot, CornerTab, SyncDia ve SyncSite'ı geliştiren bağımsız yazılım stüdyosu.",
    locale: "tr_TR",
    imageAlt: "OstlerTech uygulamaları",
  },
  en: {
    title: "OstlerTech: Privacy-first apps that keep your data with you",
    description:
      "Independent software studio building SyncPass, AreaPilot, CornerTab, SyncDia and SyncSite for people and small businesses who keep their data with them.",
    locale: "en_US",
    imageAlt: "OstlerTech apps",
  },
} as const;

// Kök düzenin paylaşım kartı. og:url BİLEREK yok: sayfa kendi openGraph'ını vermezse paylaşılan adres kullanılır
// (önceden her sayfa og:url olarak ana sayfayı taşıyordu). Sayfa openGraph verirse bu blok bütünüyle yerine geçer,
// bu yüzden sayfalar paylasimMeta() (lib/paylasim-meta.ts) ile görseli de verir.
export function temelMetadataFor(lang: "tr" | "en"): Metadata {
  const t = TEMEL[lang];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: "%s | OstlerTech" },
    description: t.description,
    keywords: ["ostlertech", "syncpass", "şifre yöneticisi", "areapilot", "cornertab", "syncsite", "syncdia", "yazılım stüdyosu"],
    authors: [{ name: "OstlerTech" }],
    creator: "OstlerTech",
    icons: { icon: "/icon.png", apple: "/apple-touch-icon.png" },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: t.locale,
      title: t.title,
      description: t.description,
      siteName: "OstlerTech",
      images: [{ url: `/og-image.png?v=${SCREENS_VERSION}`, width: 1200, height: 630, alt: t.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [`/og-image.png?v=${SCREENS_VERSION}`],
    },
    robots: { index: true, follow: true },
  };
}

export const temelMetadata: Metadata = temelMetadataFor("tr");

export const temelViewport: Viewport = {
  themeColor: "#0B0D11",
  colorScheme: "dark",
};

// Yalniz gelistirme/onizleme: ?palet=mevcut (eski palet; apple = varsayilan), ?tema=acik (yalniz onizleme; varsayilan = Apple koyu). Secim sekme boyunca saklanir.
// Uretimde (NODE_ENV=production) PALET_ONIZLEME=1 verilmedikce eklenmez; varsayilan palet hic degismez.
const PALET_ONIZLEME = process.env.NODE_ENV !== "production" || process.env.PALET_ONIZLEME === "1";
const paletBetigi = `(function(){try{var q=new URLSearchParams(location.search),h=document.documentElement,s=sessionStorage,p=q.get("palet"),t=q.get("tema");if(p==="mevcut")s.setItem("palet","mevcut");else if(p==="apple")s.removeItem("palet");if(t==="acik")s.setItem("tema","acik");else if(t==="koyu"||t==="sistem")s.removeItem("tema");if(s.getItem("palet")==="mevcut")h.setAttribute("data-palet","mevcut");var v=s.getItem("tema");if(v)h.setAttribute("data-tema",v)}catch(e){}})()`;

export function KokDuzen({ lang, children }: Readonly<{ lang: "tr" | "en"; children: React.ReactNode }>) {
  return (
    <html lang={lang}className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      {PALET_ONIZLEME && (
        <head>
          <script dangerouslySetInnerHTML={{ __html: paletBetigi }} />
        </head>
      )}
      <body className="font-sans antialiased">
        {children}
        {/* Çerezsiz, anonim sayfa görüntüleme sayımı (gizlilik metninde belirtildi). */}
        <Analytics />
      </body>
    </html>
  );
}
