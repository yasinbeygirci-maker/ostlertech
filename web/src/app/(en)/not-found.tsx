import type { Metadata } from "next";
import { EnHeader, EnFooter } from "@/components/EnShell";

// İngilizce 404 (global-not-found.tsx'in /en karşılığı). Sayfa (en) kök düzeninde çizilir: <html lang="en">.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function EnNotFound() {
  return (
    <main lang="en" className="min-h-screen bg-background flex flex-col">
      <EnHeader trHref="/" />
      <section className="flex-1 flex flex-col items-center justify-center text-center px-5 pt-40 pb-32">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white">We couldn&apos;t find this page.</h1>
        <p className="mt-4 max-w-md text-muted leading-relaxed">
          The address may be mistyped, or the page may have moved. Try the home page or AreaPilot instead.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a href="/en" className="btn-primary">Back to the home page</a>
          <a href="/en/areapilot" className="btn-secondary">AreaPilot</a>
        </div>
      </section>
      <EnFooter />
    </main>
  );
}
