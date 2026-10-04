import type { Metadata } from "next";
import LegalPage, { H2, SellerBlock } from "@/components/LegalPage";
import { COMPANY, INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "OstlerTech iletişim ve firma bilgileri: adres, KEP adresi ve e-posta.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <LegalPage eyebrow="İletişim" title="Bize ulaşın" updated={false}>
      <p>
        Destek, lisans ve iade konularında en hızlı yol e-posta. İş günlerinde genellikle aynı gün yanıt veriyoruz.
        Ödeme ve fatura soruları için satışlarımızı yapan Paddle'a da{" "}
        <a href="https://paddle.net" target="_blank" rel="noopener" className="text-primary hover:text-primary-light">paddle.net</a>{" "}
        üzerinden ulaşabilirsiniz.
      </p>
      <p className="text-lg">
        <a href={`mailto:${COMPANY.email}`} className="font-semibold text-primary hover:text-primary-light">{COMPANY.email}</a>
      </p>

      <H2>Firma bilgileri</H2>
      <SellerBlock />

      {COMPANY.chamberName && (
        <>
          <H2>Meslek odası</H2>
          <p>
            Kayıtlı olduğumuz oda: <span className="text-foreground">{COMPANY.chamberName}</span>
            {COMPANY.chamberUrl && (
              <>
                {" "}· meslek kuralları ve iletişim bilgileri için:{" "}
                <a href={COMPANY.chamberUrl} target="_blank" rel="noopener" className="text-primary hover:text-primary-light">{COMPANY.chamberUrl}</a>
              </>
            )}
          </p>
        </>
      )}

      <H2>Sosyal medya</H2>
      <p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="text-primary hover:text-primary-light">Instagram</a>
        {" · "}
        <a href={YOUTUBE_URL} target="_blank" rel="noopener" className="text-primary hover:text-primary-light">YouTube</a>
      </p>
    </LegalPage>
  );
}
