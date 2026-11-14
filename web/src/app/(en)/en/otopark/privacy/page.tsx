import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { OTOPARK } from "@/lib/otopark";

// English version of /otopark/privacy. Keep both in sync. Game name and date come from src/lib/otopark.ts.
const N = OTOPARK.name;

export const metadata: Metadata = {
  title: `${N} Privacy Policy`,
  description: `${N} car parking puzzle: no sign-up, progress stays on the device, optional rewarded ads (Google AdMob).`,
  alternates: { canonical: OTOPARK.enPath, languages: { tr: OTOPARK.path, en: OTOPARK.enPath } },
};

const link = "text-primary hover:text-primary-light";

export default function OtoparkPrivacyEnPage() {
  return (
    <LegalPage eyebrow={N} title={`${N} Privacy Policy`} lang="en" updated={false} altLink={{ href: OTOPARK.path, label: "Türkçe sürüm" }}>
      <p>Last updated: {OTOPARK.updatedEn}</p>
      <p>
        This policy explains which data is processed when you use the {N} mobile game (the &quot;Game&quot;). It serves as the
        information notice under Turkey&apos;s Personal Data Protection Law No. 6698 (KVKK) and the EU General Data Protection
        Regulation (GDPR).
      </p>

      <H2>1. Data controller</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (sole proprietorship). Address: {COMPANY.address}, Türkiye. Contact: {COMPANY.email}</p>

      <H2>2. In short</H2>
      <List>
        <li>The Game has no sign-up. We never ask for your name, email or phone number.</li>
        <li>Your level progress, daily puzzles, trophies, settings and in-game counters (for example, the counters that decide when the rating prompt is shown) are stored only on your device and never reach us.</li>
        <li>The Game has optional rewarded ads: you choose to watch an ad for an extra hint or an extra heart. Ads are served by Google AdMob.</li>
        <li>When you first open the Game, you are asked for your year of birth, wherever you are. Ads are personalized only if you allow it; in every country, users under 18 (or whose year of birth does not show for certain that they are 18 or over) only get non-personalized ads. You can withdraw your consent at any time.</li>
        <li>In countries where the product is on sale, users who are shown to be 18 or over are offered an optional one-time &quot;Ad-free pack&quot; purchase through Google Play. Your payment card details never reach us.</li>
        <li>You can share the result of the daily puzzle only if you choose to, through your phone&apos;s share sheet; that share does not reach us. The Game may occasionally open Google Play&apos;s in-app rating prompt. Users who are shown to be 18 or over also see the Game&apos;s &quot;Our other games&quot; section.</li>
        <li>We don&apos;t use our own analytics tools and the Game doesn&apos;t send data to any server of ours. The Game connects to the internet for ads, purchases and the rating prompt.</li>
      </List>

      <H2>3. Data that stays on your device</H2>
      <p>
        Unlocked levels, daily puzzle progress, trophies and settings (such as sound, vibration and theme), together with the Game&apos;s own counters
        (the number of completed levels and daily puzzles, and whether the rating prompt has already been shown), are stored only on your device;
        we cannot see them. The daily puzzle is also generated on your device without going online. This data is deleted if you uninstall the Game
        or clear its data. If Android backup is on, Android may include this data in the backup in your own Google account, which Google manages
        and we cannot access.
      </p>

      <H2>4. Ads (Google AdMob)</H2>
      <p>
        Rewarded ads are served by Google AdMob. To serve and measure ads and to prevent fraud, the Google Mobile Ads SDK collects
        the following from your device and sends it to Google:
      </p>
      <List>
        <li><b>Device identifiers:</b> Android advertising ID and app set ID (and, where applicable, identifiers of an account signed in on the device).</li>
        <li><b>IP address:</b> may be used to estimate the device&apos;s approximate location (country, city).</li>
        <li><b>Interactions:</b> app launches, taps, ad video views.</li>
        <li><b>Diagnostics:</b> app and SDK performance (such as launch time, hang rate, energy use).</li>
      </List>
      <p>
        This data is encrypted in transit (TLS). We do not receive or store it; AdMob only gives us aggregated reports (such as
        impressions and revenue). Google processes it under its own responsibility and policies:{" "}
        <a href="https://policies.google.com/privacy" className={link}>Google Privacy Policy</a>,{" "}
        <a href="https://policies.google.com/technologies/partner-sites" className={link}>how Google uses information from partner apps</a>,{" "}
        <a href="https://policies.google.com/technologies/ads" className={link}>Google advertising</a>.
      </p>
      <p>
        <b>Consent and non-personalized ads.</b> When you first open the Game, you are first asked for your year of birth, wherever you are;
        until you answer, neither the ad component nor Google&apos;s consent tool runs. If you are under 18, or if your year of birth does not
        show for certain that you are 18 or over, ads are always shown without personalization, a setting is sent to Google indicating that you
        are under the age of consent, and neither our consent window nor Google&apos;s consent form is shown to you. If you are 18 or over: in
        the European Economic Area, the United Kingdom and Switzerland Google&apos;s consent form is shown, and in all other countries,
        including Türkiye, our own consent window is shown; if you allow personalized ads, Google chooses ads based on your interests, and if
        you don&apos;t, ads are shown without personalization. No ad is requested before these steps are completed. Even for non-personalized
        ads, Google processes limited information to show and count ads and to prevent fraud. In certain US states, Google&apos;s privacy options
        are also offered, where you can opt out of the sale or sharing of your personal information for ads (&quot;Do Not Sell or Share My
        Personal Information&quot;). You can change your choice in the Game under <b>Settings &gt; About &gt; Privacy options</b> (depending
        on where you are, this opens Google&apos;s form or our own consent window, and tells users under 18 that they are not shown personalized
        ads; withdrawing is as easy as giving consent). You can reset or delete your advertising ID in Android settings. Watching ads is
        optional; you can play without them. After the &quot;Ad-free pack&quot; is purchased, the Game does not start the ad system at all.
      </p>
      <p>
        <b>Where your choice is stored.</b> Your choice in the consent window, the date of the choice and the version of the text
        you saw are stored only on your device and are not sent to us. From your answer to the year-of-birth question, only
        whether you are 18 or over is kept on the device. This record is excluded from Android backup and device transfer. If
        you uninstall the Game or clear its data, the window is shown again.
      </p>

      <H2>5. Purchases (Google Play)</H2>
      <List>
        <li>The &quot;Ad-free pack&quot; is a one-time purchase, not a subscription; it does not renew and you are not charged again. Once purchased, no ads are shown in the Game, and hints and extra hearts need no video. The Game then never starts its ad system. If Google Play cannot be reached when you reinstall the Game, ads may be shown until your purchase is verified.</li>
        <li>The pack depends on Google Play&apos;s purchase record: the Game asks Google Play whether you own the purchase, and if the purchase is refunded or Google Play no longer shows it, the pack is switched off. Buying and restoring need an Android device with Google Play and a signed-in Google account; no other hardware or software is needed.</li>
        <li>The purchase row is on the Game&apos;s level screen and is shown only in countries where the product is on sale, only to users who are shown to be 18 or over from their year of birth, and only if Google Play reports the price. When you tap the purchase button, before the payment screen opens, a window shows the price, who takes the payment, the right-of-withdrawal information and the refund terms; you reach payment only by tapping &quot;Ad-free pack&quot; in that window, and you can back out with &quot;Cancel&quot;. If the product is not on sale or is not offered in your country, the purchase cannot be made.</li>
        <li>Provider: {COMPANY.tradeName} ({COMPANY.legalName}, sole proprietorship), tax office / number: {COMPANY.taxOffice} / {COMPANY.taxNumber}, address: {COMPANY.address}, phone: {COMPANY.phone}, email: {COMPANY.email}. The sale is made through Google Play; in some countries (such as the European Economic Area and the United Kingdom) Google acts as the seller, elsewhere it acts as our agent. Google Play shows the price, payment method and taxes on its payment screen; the amount on the payment screen is the final amount including taxes.</li>
        <li>Your payment details and purchase record are processed by Google under the Google Play terms. Google shows us order information such as the order number, date, product, amount and the buyer&apos;s country/region; your payment card details never reach us.</li>
        <li>Each time it opens, the Game asks Google Play on your device, regardless of your age, whether you own the purchase and for the product information (the price) of the purchase option; no server of ours is used and the result is kept only on your device. The purchase button, the restore button and the information window are shown only if you are shown to be 18 or over. The right of a user who has already purchased applies at any age.</li>
        <li>If your payment is pending (for example, cash or code payments), the pack is not unlocked until the payment completes.</li>
        <li>You can restore your purchase on another device with the same Google account, or after reinstalling the Game, with &quot;Restore purchase&quot;; the Game also tries this automatically when it opens.</li>
        <li>Right of withdrawal: because the purchased pack is digital content unlocked on your device as soon as the payment completes, the statutory right of withdrawal does not apply to sales in Türkiye under Article 15(1)(ğ) of the Turkish Distance Contracts Regulation (services performed instantly in an electronic environment and intangible goods delivered instantly). This information is also shown before payment, in the window that opens after the purchase button. Any wider right granted to you by the law of your country remains unaffected.</li>
        <li>Refunds: refund requests are handled under Google Play&apos;s refund rules. According to Google Play, you can request a refund from Google Play within 48 hours of purchase; after 48 hours you can email us at {COMPANY.email} with your order number, and we will consider your request under Google Play&apos;s rules and applicable law. If the purchase is refunded, or Google Play no longer shows it, ads are shown again.</li>
        <li>Complaints: {COMPANY.email}. In Türkiye, for disputes you can apply to consumer arbitration committees or, after applying to a mediator before filing suit, to consumer courts.</li>
        <li>In versions of the Game earlier than 1.4.0, the purchase button may be shown without the age check and without the information window; if you use such a version, we recommend updating the Game.</li>
      </List>

      <H2>6. Purposes and legal bases</H2>
      <List>
        <li><b>On-device progress and settings:</b> running the Game; not transferred to us.</li>
        <li><b>Data collected by AdMob:</b> serving and measuring ads, fraud prevention. Personalized ads: your consent (GDPR Art. 6(1)(a), KVKK Art. 5(1)), collected through Google&apos;s consent form in the EEA, UK and Switzerland and through our in-game consent window elsewhere; you can withdraw it at any time. Non-personalized ads and fraud prevention: legitimate interest (GDPR Art. 6(1)(f), KVKK Art. 5(2)(f)). Withdrawing consent does not affect processing before withdrawal.</li>
        <li><b>Purchase and order records:</b> to make the sale, answer refund and support requests, and meet tax and accounting obligations; KVKK Art. 5(2)(c) and 5(2)(ç), GDPR Art. 6(1)(b) and 6(1)(c).</li>
        <li><b>Support emails:</b> answering your request; KVKK Art. 5(2)(c) and 5(2)(f).</li>
      </List>

      <H2>7. International transfers</H2>
      <p>
        AdMob and Google Play data is sent directly from your device to Google LLC and its affiliates through the game&apos;s
        advertising and purchase components, and is processed on servers outside Türkiye, including the United States.
        Google acts as a controller of this data under its own data protection terms. For users in the European Union,
        Google&apos;s terms rely on the EU Standard Contractual Clauses and the Data Privacy Framework; they do not include the
        standard contract announced by the Turkish Personal Data Protection Board for transfers from Türkiye. If you do not
        allow personalized ads, the data sent to Google is limited to what is needed to show and count ads and prevent
        fraud; if you buy the &quot;Ad-free pack&quot;, the game does not start the ad system at all.
      </p>

      <H2>8. Retention</H2>
      <List>
        <li>On-device progress and settings: until you uninstall the Game or clear its data.</li>
        <li>AdMob data: per <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;s retention policy</a>.</li>
        <li>Purchase record: under the Google Play terms (visible in your Google account&apos;s order history). Order information in Google Play Console is kept for as long as tax and accounting law requires.</li>
        <li>Support and refund emails: 1 year after the request is closed.</li>
      </List>

      <H2>9. Children</H2>
      <p>
        The Game is designed for users aged 16 and over, is not directed at children and is not part of Google Play&apos;s Families program. Ads shown in the Game are limited to content suitable for general audiences (PG). We do not verify your age. When you first open the Game, we ask for your year of birth, wherever you are: if you are under 18, or if your year of birth does not show for certain that you are 18 or over, ads are always shown without personalization, a setting is sent to Google indicating that you are under the age of consent, and neither our consent window nor Google&apos;s consent form is shown to you; even then, Google processes the limited information described in section 4 to show and count ads and to prevent fraud. The purchase option, the information window and the &quot;Our other games&quot; section are not shown to users under 18 or whose age is unknown; however, regardless of your age, the Game asks Google Play (with your Google account) whether a purchase was made and for the product information. No ad data is sent in this request, but the Google Play component may send its own operational and diagnostic data to Google. Likewise, Google Play&apos;s in-app rating prompt may be shown regardless of your age; Google Play operates that prompt. If you believe a child under 16 is using the Game, write to {COMPANY.email}; uninstalling the Game or clearing its data is enough to delete the data on the device.
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
      <p>
        Update of 14 November 2026 (Game version 1.4.0): your year of birth is now asked in every country, before ad consent; in the European
        Economic Area, the United Kingdom and Switzerland, Google&apos;s consent form is no longer shown to users under 18; the purchase is
        offered only to users who are shown to be 18 or over and an information window is shown before payment; a &quot;Our other games&quot;
        section, sharing of the daily puzzle and Google Play&apos;s in-app rating prompt were added. No new data flow starts with this version:
        sharing and the rating prompt do not send data to us.
      </p>
    </LegalPage>
  );
}
