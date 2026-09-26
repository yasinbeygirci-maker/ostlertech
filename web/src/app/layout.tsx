import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Masaüstü uygulamasıyla aynı yazı tipleri.
const sans = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono", display: "swap" });

const description =
  "SyncPass, şifrelerinizi, kartlarınızı ve 2FA kodlarınızı cihazınızda şifreli tutan şifre yöneticisidir. Hesap açmanız gerekmez; ana parolanızı bizimle paylaşmazsınız.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SyncPass — Şifreleriniz sizin cihazınızda | OstlerTech",
    template: "%s | OstlerTech",
  },
  description,
  keywords: ["şifre yöneticisi", "parola yöneticisi", "2FA", "TOTP", "passkey", "syncpass", "ostlertech", "android şifre yöneticisi"],
  authors: [{ name: "OstlerTech" }],
  creator: "OstlerTech",
  icons: { icon: "/icon.png", apple: "/logo-syncpass.png" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    title: "SyncPass — Şifreleriniz sizin cihazınızda",
    description,
    siteName: "OstlerTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SyncPass Android ve masaüstü arayüzü" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SyncPass — Şifreleriniz sizin cihazınızda",
    description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0E121A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
