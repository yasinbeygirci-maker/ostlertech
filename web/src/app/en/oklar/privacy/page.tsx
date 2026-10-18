import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// English version of /oklar/privacy. Keep both in sync.
export const metadata: Metadata = {
  title: "Oklar Privacy Policy",
  description: "Oklar arrow puzzle game: no account, progress stays on the device, optional rewarded ads (Google AdMob).",
  alternates: { canonical: "/en/oklar/privacy", languages: { tr: "/oklar/privacy", en: "/en/oklar/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function OklarPrivacyEnPage() {
  return (
    <LegalPage eyebrow="Oklar" title="Oklar Privacy Policy" lang="en" updated={false} altLink={{ href: "/oklar/privacy", label: "Türkçe sürüm" }}>
      <p>Last updated: 18 October 2026</p>
      <p>
        This policy explains which data is processed when you use the Oklar mobile game (the &quot;Game&quot;). It serves as the
        information notice under Turkey&apos;s Personal Data Protection Law (KVKK) and the EU General Data Protection Regulation (GDPR).
      </p>

      <H2>1. Data controller</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (sole proprietorship). Address: {COMPANY.address}, Türkiye. Contact: {COMPANY.email}</p>

      <H2>2. In short</H2>
      <List>
        <li>The Game has no account. We never ask for your name, e-mail or phone number.</li>
        <li>Your progress is stored only on your device and never reaches us.</li>
        <li>The Game has optional rewarded ads: you choose to watch an ad for a hint or an extra heart. Ads are served by Google AdMob.</li>
        <li>Ads are personalized only if you allow it; users under 18 always get non-personalized ads. You can withdraw your consent at any time.</li>
        <li>The one-time &quot;Ad-free pack&quot; purchase is made through Google Play; your payment details never reach us.</li>
        <li>We use no analytics or tracking tools.</li>
      </List>

      <H2>3. Data that stays on your device</H2>
      <p>
        Unlocked levels and progress are stored only on your device; we cannot see them. They are deleted if you uninstall the
        Game or clear its data. If Android backup is on, Android may include this data in the backup in your own Google account,
        which Google manages and we cannot access.
      </p>

      <H2>4. Ads (Google AdMob)</H2>
      <p>
        Rewarded ads are served by Google AdMob. To serve and measure ads and to prevent fraud, the Google Mobile Ads SDK collects
        the following from your device and sends it to Google:
      </p>
      <List>
        <li><b>Device identifiers:</b> Android advertising ID and app set ID (and, where applicable, identifiers of an account signed in on the device).</li>
        <li><b>IP address:</b> may be used to estimate approximate location (country, city).</li>
        <li><b>Interactions:</b> app launches, taps, ad views.</li>
        <li><b>Diagnostics:</b> app and SDK performance.</li>
      </List>
      <p>
        This data is encrypted in transit (TLS). We do not receive or store it; AdMob only gives us aggregated reports (impressions,
        revenue). Google processes it under its own policies:{" "}
        <a href="https://policies.google.com/privacy" className={link}>Google Privacy Policy</a>,{" "}
        <a href="https://policies.google.com/technologies/partner-sites" className={link}>how Google uses information from partner apps</a>,{" "}
        <a href="https://policies.google.com/technologies/ads" className={link}>Google advertising</a>.
      </p>
      <p>
        <b>Consent and non-personalized ads.</b> In the European Economic Area, the United Kingdom and Switzerland, Google&apos;s
        consent form is shown when you first open the Game, and no ad is requested before consent is obtained. In all other
        countries, including Türkiye, you are first asked for your year of birth and then our own consent window is shown when
        you first open the Game: if you allow personalized ads, Google chooses ads based on your interests; if you don&apos;t, or if
        you are under 18, ads are shown without personalization. No ad is requested before these steps are completed. Even for
        non-personalized ads, Google processes limited information to show and count ads and to prevent fraud. In certain US
        states, Google&apos;s privacy options are also offered, where you can opt out of the sale or sharing of your personal
        information for ads (&quot;Do Not Sell or Share My Personal Information&quot;). You can change your choice in the Game
        under <b>Settings &gt; About &gt; Privacy options</b> (depending on where you are, this opens Google&apos;s form or our own
        consent window; withdrawing is as easy as giving consent). You can reset or delete your advertising ID in Android
        settings. Watching ads is optional; once the &quot;Ad-free pack&quot; is purchased, the Game does not start the ad system
        at all.
      </p>
      <p>
        <b>Where your choice is stored.</b> Your choice in the consent window, the date of the choice and the version of the text
        you saw are stored only on your device and are not sent to us. From your answer to the year-of-birth question, only
        whether you are 18 or over is kept on the device. This record is excluded from Android backup and device transfer. If
        you uninstall the Game or clear its data, the window is shown again.
      </p>

      <H2>5. Purchases (Google Play)</H2>
      <p>
        &quot;Ad-free pack&quot; is purchased through Google Play Billing. Your payment details and purchase record are processed by Google. The
        Game verifies the purchase only on your device through Google Play; your name or payment details never reach us. Refunds
        follow Google Play&apos;s refund rules.
      </p>

      <H2>6. Purposes and legal bases</H2>
      <List>
        <li><b>On-device progress:</b> running the Game; not transferred to us.</li>
        <li><b>Data collected by AdMob:</b> serving and measuring ads, fraud prevention. Personalized ads: your consent (GDPR Art. 6(1)(a), KVKK Art. 5(1)), collected through Google&apos;s consent form in the EEA, UK and Switzerland and through our in-game consent window elsewhere; you can withdraw it at any time. Non-personalized ads and fraud prevention: legitimate interest (GDPR Art. 6(1)(f), KVKK Art. 5(2)(f)). Withdrawing consent does not affect processing before withdrawal.</li>
        <li><b>Support e-mails:</b> answering your request; KVKK Art. 5(2)(c) and 5(2)(f).</li>
      </List>

      <H2>7. International transfers</H2>
      <p>
        AdMob and Google Play data is processed on servers of Google LLC and its affiliates outside Türkiye, including the United
        States, under KVKK Art. 9. For EU users, Google relies on the EU Standard Contractual Clauses and the Data Privacy Framework.
      </p>

      <H2>8. Retention</H2>
      <List>
        <li>On-device progress: until you uninstall the Game or clear its data.</li>
        <li>AdMob data: per <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;s retention policy</a>.</li>
        <li>Support e-mails: 1 year after the request is closed.</li>
      </List>

      <H2>9. Children</H2>
      <p>
        The Game is designed for users aged 13 and over and is not directed at children. We do not knowingly collect personal data
        from children under 13, and we limit ad content to the PG rating. Users under 18 are not shown personalized ads, and our
        consent window is never shown to them. The same applies if your year of birth does not show for certain that you are 18
        or over. If you believe a child under 13 is using the Game, write to{" "}
        {COMPANY.email}.
      </p>

      <H2>10. Your rights</H2>
      <p>
        Under KVKK Art. 11 and the GDPR you can request information, correction, deletion, object and complain. As we hold no data
        that identifies you, the fastest route is usually Google: reset your advertising ID, change your consent in the Game, or use
        your <a href="https://myaccount.google.com" className={link}>Google account</a>. Requests sent to {COMPANY.email} are answered
        within 30 days. You may complain to Türkiye&apos;s Personal Data Protection Authority or your local EU data protection authority.
      </p>

      <H2>11. Changes</H2>
      <p>If the Game starts collecting new data, this policy is updated before that version is released and the date changes.</p>
    </LegalPage>
  );
}
