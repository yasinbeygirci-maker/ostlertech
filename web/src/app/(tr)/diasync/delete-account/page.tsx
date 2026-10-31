import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncDia - Hesap ve Veri Silme Talebi",
  description:
    "SyncDia hesabınızı ve kişisel verilerinizi kalıcı olarak silme yöntemleri, prosedür ve destek bilgileri.",
  alternates: { canonical: "/diasync/delete-account" },
  icons: { icon: [{ url: "/products/syncdia-favicon.svg", type: "image/svg+xml" }, { url: "/products/syncdia-favicon-32.png", sizes: "32x32", type: "image/png" }] },
};

export default function SyncDiaDeleteAccount() {
  return (
    <main className="min-h-screen bg-background text-foreground/80 px-6 py-16 md:px-20 lg:px-32">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <a href="/" className="text-sm text-primary hover:underline mb-4 inline-block">&larr; OstlerTech Ana Sayfa</a>
          <h1 className="text-3xl md:text-4xl font-bold text-white">SyncDia - Hesap ve Veri Silme Talebi</h1>
          <p className="text-sm text-muted mt-2">Son Güncelleme Tarihi: Ağustos 2026</p>
        </div>

        <section className="space-y-4 bg-card p-6 rounded-2xl border border-line">
          <h2 className="text-xl font-semibold text-white">Hesabınızı Nasıl Silebilirsiniz?</h2>
          <p>
            SyncDia uygulamasındaki hesabınızı ve buna bağlı tüm kişisel verilerinizi (çocuk sağlık takipleri, günlük kayıtlar ve profil bilgileri) kalıcı olarak silmek istiyorsanız aşağıdaki yöntemleri kullanabilirsiniz:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-foreground/80">
            <li><strong className="text-white">Uygulama Üzerinden:</strong> SyncDia uygulamasını açın, <span className="text-primary">Ayarlar &gt; Hesabı Sil</span> menüsüne giderek işleminizi anında gerçekleştirebilirsiniz.</li>
            <li><strong className="text-white">Web Üzerinden Talep:</strong> Uygulamaya erişiminiz yoksa, aşağıda yer alan destek e-posta adresimize kayıtlı e-posta adresinizle birlikte hesap silme talebinizi iletebilirsiniz.</li>
          </ol>
        </section>

        <section className="space-y-4 bg-card p-6 rounded-2xl border border-line">
          <h2 className="text-xl font-semibold text-white">Veri Silme Prosedürü ve Süresi</h2>
          <p>
            Hesap silme talebiniz bize ulaştıktan sonra, Firebase veritabanımızda ve yerel depolama alanlarında bulunan tüm kişisel verileriniz <strong className="text-white">en geç 7 iş günü içinde</strong> kalıcı olarak silinir ve anonimleştirilir. Yasal zorunluluklar dışında hiçbir veriniz yedek olarak saklanmaz.
          </p>
        </section>

        <section className="space-y-4 bg-card p-6 rounded-2xl border border-line">
          <h2 className="text-xl font-semibold text-white">İletişim ve Destek</h2>
          <p>
            Hesap silme süreciyle ilgili herhangi bir sorun yaşarsanız bizimle doğrudan iletişime geçebilirsiniz:
          </p>
          <p className="text-primary font-medium">
            E-posta: destek@ostlertech.com (veya web sitemiz üzerinden)
          </p>
        </section>
      </div>
    </main>
  );
}
