import type { Metadata } from "next";
import { Check, Monitor } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DESKTOP_DOWNLOAD, DESKTOP_LICENSE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "SyncPass Masaüstü",
  description: `SyncPass Masaüstü (Windows): ücretsiz sürüm ve Premium (aylık, yıllık ya da ömür boyu), ${DESKTOP_LICENSE.devices} bilgisayar, kasanız bilgisayarınızda şifreli.`,
  alternates: { canonical: "/syncpass-masaustu" },
};

const features = [
  "Android ile aynı şifreleme ve kasa biçimi (AES-256-GCM)",
  "Kategoriler, liste ve ayrıntı yan yana: üç sütunlu düzen",
  "Ctrl+Shift+P ile hızlı erişim, klavyeyle kopyalama",
  "Kopyalanan şifre Windows pano geçmişine ve bulut panosuna yazılmaz",
  "Şifre sağlığı: zayıf, tekrar eden ve sızıntıda görülen şifreler",
  "Açık ve koyu tema, 12 dil",
];

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: DESKTOP_LICENSE.name,
  brand: { "@type": "Brand", name: "OstlerTech" },
  offers: { "@type": "Offer", url: `${SITE_URL}/satin-al` },
};

export default function DesktopLicensePage() {
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <Navbar />
      <section className="section-padding !pt-36">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div className="space-y-6">
            <p className="eyebrow">SyncPass Masaüstü · <span lang="en">Windows</span></p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Bilgisayarda da aynı kasa.</h1>
            <p className="text-lg text-muted leading-relaxed">
              SyncPass Masaüstü, Android uygulamasıyla aynı şifrelemeyi ve kasa biçimini kullanır. Kasanız
              bilgisayarınızda şifreli durur; hesap açmanız gerekmez.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={DESKTOP_DOWNLOAD.url} className="btn-primary !py-3.5 text-base">Ücretsiz indir (Windows)</a>
              <span className="text-sm text-muted">Sürüm {DESKTOP_DOWNLOAD.version} · {DESKTOP_DOWNLOAD.sizeLabel} · {DESKTOP_DOWNLOAD.requirements}</span>
            </div>
            <details className="rounded-2xl border border-line bg-card p-5 text-sm text-muted">
              <summary className="cursor-pointer font-semibold text-foreground">Windows "tanınmayan uygulama" uyarısı gösterirse</summary>
              <p className="mt-3">
                Kurulum dosyası henüz Microsoft Store üzerinden dağıtılmadığı için Windows SmartScreen uyarı gösterebilir. Uyarıda
                <strong className="text-foreground"> Ek bilgi → Yine de çalıştır</strong> seçeneğiyle kurulumu sürdürebilirsiniz.
                Dosyanın bizden geldiğini SHA-256 özetiyle doğrulayabilirsiniz:
              </p>
              <code className="mt-2 block break-all font-mono text-xs text-foreground">{DESKTOP_DOWNLOAD.sha256}</code>
              <p className="mt-2">
                Tüm sürümler: <a href={DESKTOP_DOWNLOAD.releasesUrl} className="text-primary hover:text-primary-light">sürüm notları</a>.
                Microsoft Store sürümü yakında.
              </p>
            </details>
            <div className="device-window">
              <img src="/screens/desktop-vault-dark.webp" alt="SyncPass Masaüstü: üç sütunlu kasa görünümü" width={1200} height={800} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 space-y-6">
            <div className="flex items-center gap-3 text-white font-bold text-lg">
              <Monitor size={22} className="text-primary" /> {DESKTOP_LICENSE.name}
            </div>
            <div className="text-sm text-muted">
              Aylık, yıllık ya da ömür boyu · {DESKTOP_LICENSE.devices} bilgisayar · fiyatlar ülkenize göre, vergiler dahil
            </div>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-foreground">
                  <Check size={18} className="mt-0.5 shrink-0 text-ok" /> {f}
                </li>
              ))}
            </ul>
            <a href="/satin-al" className="btn-primary w-full !py-3.5 text-base">Planları ve fiyatları gör</a>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>Lisans kodu ödemeden hemen sonra ekranda gösterilir.</li>
              <li>{DESKTOP_LICENSE.refundDays} gün içinde koşulsuz iade; abonelik istediğiniz zaman iptal edilir.</li>
              <li>Lisans bitince kasanız kilitlenmez; ücretsiz sürümle kullanmaya devam edersiniz.</li>
            </ul>
            <p className="text-xs text-muted">Satışlar yetkili satıcımız Paddle.com üzerinden yapılır.</p>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}
