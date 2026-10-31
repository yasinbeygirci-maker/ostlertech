import { KokDuzen, temelMetadata, temelViewport } from "@/lib/kok-duzen";
import "../globals.css";

// Türkçe sayfaların kök düzeni: sunucudan gelen ham HTML'de <html lang="tr">.
export const metadata = temelMetadata;
export const viewport = temelViewport;

export default function TrLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <KokDuzen lang="tr">{children}</KokDuzen>;
}
