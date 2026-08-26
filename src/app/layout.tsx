import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OstlerTech | Dijital Güvenliğin Yeni Standartı",
  description: "SyncPass, DiaSync ve gelişmiş yazılım çözümleriyle dijital dünyada tam güvenlik ve kontrol.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="antialiased selection:bg-primary selection:text-[#020617]">
        {children}
      </body>
    </html>
  );
}