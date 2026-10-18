import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "OstlerTech: verisini kendisinde tutmak isteyen insanlar için güvenlik ve iş uygulamaları geliştiren bağımsız yazılım stüdyosu.",
  alternates: { canonical: "/hakkimizda" },
};

export default function AboutPage() {
  return (
    <LegalPage eyebrow="Hakkımızda" title="OstlerTech" updated={false}>
      <p>
        OstlerTech, Türkiye'de kurulu bağımsız bir yazılım stüdyosu. Verisini kendisinde tutmak isteyen insanlar ve küçük
        işletmeler için sade, güvenli ve reklamsız uygulamalar geliştiriyoruz.
      </p>

      <H2>Ne yapıyoruz</H2>
      <List>
        <li><strong className="text-foreground">SyncPass</strong>: şifreleri, kartları ve 2FA kodlarını cihazda şifreli tutan şifre yöneticisi (Android ve Windows; Windows için Chrome eklentisi).</li>
        <li><strong className="text-foreground">Projex</strong>: şantiyede günlük imalatı, plan ile gerçekleşeni büro ve saha arasında izleyen takip programı (test aşamasında).</li>
      </List>

      <H2>Nasıl çalışıyoruz</H2>
      <List>
        <li>Verin senin: SyncPass kasanı hiçbir sunucuya göndermez, hesap açtırmaz.</li>
        <li>SyncPass&apos;te reklam ve izleme yok: uygulamada reklam ya da analitik izleme kütüphanesi bulunmaz. Oyunlarımızdaki isteğe bağlı reklamlar her oyunun gizlilik politikasında anlatılır.</li>
        <li>Söylediğimizi yaparız: sitede ve mağazada yalnızca uygulamada gerçekten olan özellikleri anlatırız.</li>
      </List>

      <H2>Bize ulaşın</H2>
      <p>
        Soru, öneri ve destek için <a href={`mailto:${COMPANY.email}`} className="text-primary hover:text-primary-light">{COMPANY.email}</a> adresine
        yazabilir ya da <a href="/iletisim" className="text-primary hover:text-primary-light">iletişim sayfasındaki</a> bilgileri
        kullanabilirsiniz.
      </p>
    </LegalPage>
  );
}
