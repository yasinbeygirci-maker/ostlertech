import type { Metadata } from "next";
import LegalPage, { H2, List, SellerBlock } from "@/components/LegalPage";
import { FounderCard, OrganizationLd } from "@/components/AboutTeam";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "OstlerTech: verisini kendisinde tutmak isteyen insanlar için kendi güvenlik ve iş uygulamalarını geliştiren bağımsız yazılım şirketi. Kurucu ve şirket bilgileri.",
  alternates: { canonical: "/hakkimizda", languages: { tr: "/hakkimizda", en: "/en/about" } },
};

export default function AboutPage() {
  return (
    <LegalPage eyebrow="Hakkımızda" title="OstlerTech" updated={false} altLink={{ href: "/en/about", label: "English version" }}>
      <OrganizationLd />
      <p>
        OstlerTech, Türkiye'de kurulu, kendi ürünlerini geliştiren bağımsız bir yazılım şirketi. Verisini kendisinde tutmak
        isteyen insanlar ve küçük işletmeler için sade, güvenli ve reklamsız uygulamalar geliştiriyoruz.
      </p>

      <H2>Kurucu ve ekip</H2>
      <FounderCard lang="tr" />
      <p>
        OstlerTech, kurucusu tarafından yönetilen küçük bir şirket. Ürün kararları, geliştirme ve destek doğrudan kurucudan
        geçer; bu yüzden yazdığınız her e-postayı ürünü yapan kişi okur.
      </p>

      <H2>Ne yapıyoruz</H2>
      <List>
        <li><strong className="text-foreground">SyncPass</strong>: şifreleri, kartları ve 2FA kodlarını cihazda şifreli tutan şifre yöneticisi (Android ve Windows; Windows için Chrome eklentisi).</li>
        <li><strong className="text-foreground">SyncSite</strong>: şantiyede günlük imalatı, plan ile gerçekleşeni büro ve saha arasında izleyen takip programı (test aşamasında; Windows ve Android, iOS ve macOS yakında).</li>
      </List>

      <H2>Nasıl çalışıyoruz</H2>
      <List>
        <li>Verin senin: SyncPass kasanı hiçbir sunucuya göndermez, hesap açtırmaz.</li>
        <li>SyncPass&apos;te reklam ve izleme yok: uygulamada reklam ya da analitik izleme kütüphanesi bulunmaz. Oyunlarımızdaki isteğe bağlı reklamlar her oyunun gizlilik politikasında anlatılır.</li>
        <li>Söylediğimizi yaparız: sitede ve mağazada yalnızca uygulamada gerçekten olan özellikleri anlatırız.</li>
      </List>

      <H2>Şirket bilgileri</H2>
      <SellerBlock />

      <H2>Bize ulaşın</H2>
      <p>
        Soru, öneri ve destek için <a href={`mailto:${COMPANY.email}`} className="text-primary hover:text-primary-light">{COMPANY.email}</a> adresine
        yazabilir ya da <a href="/iletisim" className="text-primary hover:text-primary-light">iletişim sayfasındaki</a> bilgileri
        kullanabilirsiniz.
      </p>
    </LegalPage>
  );
}
