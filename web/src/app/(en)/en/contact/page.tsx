import type { Metadata } from "next";
import LegalPage, { H2, SellerBlock } from "@/components/LegalPage";
import { FACEBOOK_URL } from "@/components/SocialLinks";
import { COMPANY, INSTAGRAM_URL, LINKEDIN_URL, TIKTOK_URL, YOUTUBE_URL } from "@/lib/site";

// English counterpart of /iletisim. Business details come from the same SellerBlock (lang="en") as the English terms and privacy pages.
export const metadata: Metadata = {
  title: "Contact",
  description: "OstlerTech contact and business details: address, registered email (KEP) and email.",
  alternates: { canonical: "/en/contact", languages: { tr: "/iletisim", en: "/en/contact" } },
};

export default function ContactPageEn() {
  return (
    <LegalPage lang="en" eyebrow="Contact" title="Get in touch" updated={false} altLink={{ href: "/iletisim", label: "Türkçe" }}>
      <p>
        Email is the fastest way to reach us about support, licenses and refunds. On business days we usually reply the same day.
        For payment and invoice questions you can also contact Paddle, which handles our sales, at{" "}
        <a href="https://paddle.net" target="_blank" rel="noopener" className="text-primary hover:text-primary-light">paddle.net</a>.
      </p>
      <p className="text-lg">
        <a href={`mailto:${COMPANY.email}`} className="font-semibold text-primary hover:text-primary-light">{COMPANY.email}</a>
      </p>

      <H2>Business details</H2>
      <SellerBlock lang="en" />

      <H2>Social media</H2>
      <p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="text-primary hover:text-primary-light">Instagram</a>
        {" · "}
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">Facebook</a>
        {" · "}
        <a href={YOUTUBE_URL} target="_blank" rel="noopener" className="text-primary hover:text-primary-light">YouTube</a>
        {" · "}
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">LinkedIn</a>
        {" · "}
        <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">TikTok</a>
      </p>
    </LegalPage>
  );
}
