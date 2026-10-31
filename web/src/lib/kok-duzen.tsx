import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SCREENS_VERSION, SITE_URL } from "@/lib/site";

// TR ve EN kök düzenlerinin ortak parçası: (tr)/layout.tsx ve (en)/layout.tsx yalnız dil değerini verir.
// globals.css her kök düzende ayrıca içe aktarılır.

// Masaüstü uygulamasıyla aynı yazı tipleri.
const sans = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono", display: "swap" });

const description =
  "OstlerTech, verisini kendisinde tutmak isteyen bireyler ve küçük işletmeler için SyncPass, AreaPilot, CornerTab, SyncDia ve SyncSite uygulamalarını geliştiren bağımsız bir yazılım stüdyosudur.";

export const temelMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OstlerTech: Verisini kendinde tutmak isteyenler için uygulamalar",
    template: "%s | OstlerTech",
  },
  description,
  keywords: ["ostlertech", "syncpass", "şifre yöneticisi", "areapilot", "cornertab", "syncsite", "syncdia", "yazılım stüdyosu"],
  authors: [{ name: "OstlerTech" }],
  creator: "OstlerTech",
  icons: { icon: "/icon.png", apple: "/apple-touch-icon.png" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    title: "OstlerTech: Verisini kendinde tutmak isteyenler için uygulamalar",
    description,
    siteName: "OstlerTech",
    images: [{ url: `/og-image.png?v=${SCREENS_VERSION}`, width: 1200, height: 630, alt: "OstlerTech uygulamaları" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OstlerTech: Verisini kendinde tutmak isteyenler için uygulamalar",
    description,
    images: [`/og-image.png?v=${SCREENS_VERSION}`],
  },
  robots: { index: true, follow: true },
};

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
