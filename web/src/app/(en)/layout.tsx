import { KokDuzen, temelMetadata, temelViewport } from "@/lib/kok-duzen";
import "../globals.css";

// /en altındaki İngilizce sayfaların kök düzeni: sunucudan gelen ham HTML'de <html lang="en"> (arama motorları ham HTML'e bakar).
export const metadata = temelMetadata;
export const viewport = temelViewport;

export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <KokDuzen lang="en">{children}</KokDuzen>;
}
