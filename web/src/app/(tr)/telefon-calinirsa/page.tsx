import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhoneTheftGuide, { phoneTheftMetadata } from "@/components/PhoneTheftGuide";

// Instagram Reels "telefon-calinirsa-5-adim" ödül sayfası. Metin: src/lib/telefon-calinirsa.ts.
export const metadata = phoneTheftMetadata("tr");

export default function TelefonCalinirsa() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <PhoneTheftGuide lang="tr" />
      <Footer />
    </main>
  );
}
