import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LicenseReveal from "@/components/LicenseReveal";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Teşekkürler",
  robots: { index: false },
};

// Paddle ödemesi tamamlanınca buraya yönlendirilir.
export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding !pt-36">
        <div className="max-w-xl mx-auto text-center space-y-5">
          <CheckCircle2 size={56} className="mx-auto text-ok" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Teşekkürler, ödemeniz alındı</h1>
          <p className="text-muted">Makbuzunuz Paddle'dan e-postanıza gelecek.</p>
          <LicenseReveal />
          <ol className="text-left text-sm text-muted space-y-2 rounded-2xl border border-line bg-card p-6 list-decimal list-inside">
            <li>SyncPass Masaüstü'nü açın ve kasanızın kilidini açın.</li>
            <li>Ayarlar → Lisans bölümüne kodu yapıştırıp Etkinleştir'e basın.</li>
            <li>Aynı kodu en fazla 3 bilgisayarda kullanabilirsiniz.</li>
          </ol>
          <p className="text-sm text-muted">
            Kodu kaybederseniz satın alırken kullandığınız e-postayla{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-primary-light">{CONTACT_EMAIL}</a> adresine yazın.
          </p>
          <a href="/syncpass-masaustu" className="btn-primary inline-flex !py-3">SyncPass Masaüstü'ne dön</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
