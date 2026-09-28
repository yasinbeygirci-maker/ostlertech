import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center justify-center text-center px-5 pt-40 pb-32">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white">Bu sayfa burada değil.</h1>
        <p className="mt-4 max-w-md text-muted leading-relaxed">
          Adres yanlış yazılmış ya da sayfa taşınmış olabilir. Ana sayfadan ya da ürünlerimizden devam edebilirsiniz.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a href="/" className="btn-primary">Ana sayfaya dön</a>
          <a href="/products" className="btn-secondary">Ürünler</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
