import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY, DESKTOP_LICENSE, PADDLE_BUYER_TERMS_URL } from "@/lib/site";

// /teslimat-ve-iade sayfasının İngilizce karşılığı. Biri değişirse diğeri de aynı işte güncellenir.
export const metadata: Metadata = {
  title: "Delivery and Refund Policy",
  description: "SyncPass Desktop Premium: electronic delivery, subscription cancellation and a no-questions-asked refund within 14 days.",
  alternates: { canonical: "/en/refunds", languages: { tr: "/teslimat-ve-iade", en: "/en/refunds" } },
};

const link = "text-primary hover:text-primary-light";

export default function RefundsEnPage() {
  return (
    <LegalPage eyebrow="Legal" title="Delivery and Refund Policy" lang="en" altLink={{ href: "/teslimat-ve-iade", label: "Türkçe sürüm" }}>
      <p>
        This policy applies to SyncPass Desktop Premium licences purchased through ostlertech.com. Our sales are made by
        our Merchant of Record, Paddle.com; payments and refunds are handled by Paddle.
      </p>

      <H2>1. Delivery</H2>
      <List>
        <li>The product is digital; nothing is shipped.</li>
        <li>When payment is complete, your licence key is shown immediately on the page that opens after checkout. Paddle e-mails you the receipt.</li>
        <li>If the key does not appear or you lose it, write to {COMPANY.email} from the e-mail address you used for the purchase; we will send it within 24 hours.</li>
      </List>

      <H2>2. {DESKTOP_LICENSE.refundDays}-day no-questions-asked refund</H2>
      <p>
        For every payment, we refund the full amount without asking for a reason if you request it within{" "}
        {DESKTOP_LICENSE.refundDays} days of the payment date. This applies separately to the first purchase and to each
        subscription renewal.
      </p>
      <p>To request a refund, use one of these:</p>
      <List>
        <li>the link in the receipt e-mail from Paddle, or <a href="https://paddle.net" target="_blank" rel="noopener" className={link}>paddle.net</a>;</li>
        <li>or write to {COMPANY.email} with your order number and we will forward your request to Paddle.</li>
      </List>
      <p>
        Paddle refunds the payment to the method you paid with; how long it takes to appear depends on your bank. A
        refunded licence is deactivated and the app switches to the free version.
      </p>
      <p>
        We also review and refund requests made after {DESKTOP_LICENSE.refundDays} days, for example if the app does not
        work on your computer or you accidentally paid twice.
      </p>

      <H2>3. Cancelling a subscription</H2>
      <p>
        You can cancel a monthly or yearly subscription at any time. Cancellation takes effect at the end of the period
        you have paid for; no payment is taken for the next period and you keep Premium until then.
      </p>

      <H2>4. When the licence ends</H2>
      <p>
        When your licence ends or is refunded, the app switches to the free version. Your vault is not locked: you can
        still view, copy, edit and export your entries.
      </p>

      <H2>5. Your statutory rights</H2>
      <p>
        This policy does not limit the rights given to you by the consumer laws of your country. Your purchase is also
        subject to the{" "}
        <a href={PADDLE_BUYER_TERMS_URL} target="_blank" rel="noopener" className={link}>Paddle Buyer Terms</a>.
      </p>
    </LegalPage>
  );
}
