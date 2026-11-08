import type { Metadata } from "next";
import { SCREENS_VERSION, SITE_URL } from "./site";

// Sayfaya özel paylaşım kartı (Open Graph + Twitter). Next, sayfadaki openGraph'ı kök düzeninkiyle BİRLEŞTİRMEZ, yerine koyar:
// görsel, dil ve site adı burada her seferinde verilir (2026-11-03 dersi: EN sayfalarda og:image düşmüştü).
export interface PaylasimGirdisi {
  title: string;
  description: string;
  /** Sayfanın kök göreli adresi, ör. "/areapilot". og:url = SITE_URL + path. */
  path: string;
  lang: "tr" | "en";
  /** Kök göreli görsel adresi (1200x630). Verilmezse genel og-image.png. */
  image?: string;
  imageAlt?: string;
}

export function paylasimMeta(g: PaylasimGirdisi): Pick<Metadata, "openGraph" | "twitter"> {
  const image = g.image ?? `/og-image.png?v=${SCREENS_VERSION}`;
  const alt = g.imageAlt ?? (g.lang === "tr" ? "OstlerTech uygulamaları" : "OstlerTech apps");
  return {
    openGraph: {
      type: "website",
      locale: g.lang === "tr" ? "tr_TR" : "en_US",
      url: `${SITE_URL}${g.path}`,
      title: g.title,
      description: g.description,
      siteName: "OstlerTech",
      images: [{ url: image, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: g.title,
      description: g.description,
      images: [image],
    },
  };
}
