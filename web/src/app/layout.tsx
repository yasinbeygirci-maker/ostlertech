import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OstlerTech | Geleceğin Güvenlik ve Senkronizasyon Çözümleri",
    template: "%s | OstlerTech"
  },
  description: "SyncPass ile şifrelerinizi güvence altına alın, DiaSync ile ailenizle tam senkronizasyon sağlayın. OstlerTech, yeni nesil dijital güvenlik ekosistemidir.",
  keywords: ["şifre yöneticisi", "aile takibi", "dijital güvenlik", "syncpass", "diasync", "ostlertech", "güvenli şifreleme"],
  authors: [{ name: "OstlerTech Team" }],
  creator: "OstlerTech",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.ostlertech.com",
    title: "OstlerTech | Geleceğin Güvenlik Çözümleri",
    description: "SyncPass ve DiaSync ile dijital dünyada tam kontrol ve güvenlik.",
    siteName: "OstlerTech",
    images: [
      {
        url: "https://www.ostlertech.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "OstlerTech - SyncPass & DiaSync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OstlerTech | Dijital Güvenlikte Yeni Standart",
    description: "Şifre yönetimi ve aile senkronizasyonunda devrim yaratan çözümler.",
    images: ["https://www.ostlertech.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
