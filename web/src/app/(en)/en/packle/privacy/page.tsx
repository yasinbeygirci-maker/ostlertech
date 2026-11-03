import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// English version of /packle/privacy. Keep both in sync. Source: OstlerTech/hukuk/2026-11-03-packle-gizlilik-sayfa-taslak.md.
export const metadata: Metadata = {
  title: "Packle Privacy Policy",
  description: "Packle block puzzle: no sign-up, score stays on your device, rewarded and end-of-game ads via Google AdMob.",
  alternates: { canonical: "/en/packle/privacy", languages: { tr: "/packle/privacy", en: "/en/packle/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function PacklePrivacyEnPage() {
  return (
    <LegalPage eyebrow="Packle" title="Packle Privacy Policy" lang="en" updated={false} altLink={{ href: "/packle/privacy", label: "Türkçe sürüm" }}>
      <p>Last updated: 3 November 2026</p>
      <p>This policy explains what data is processed when you use the Packle mobile game (the &quot;Game&quot;). It serves as the privacy notice under the Turkish Personal Data Protection Law No. 6698 (KVKK) and as information under the EU General Data Protection Regulation (GDPR).</p>
      <H2>1. Data controller</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (sole proprietorship). Address: {COMPANY.address}. Contact: {COMPANY.email}</p>
      <H2>2. In short</H2>
      <List>
        <li>The Game has no sign-up. We don&apos;t ask for your name, email address or phone number.</li>
        <li>Your best score, settings and unfinished game are stored only on your device; they are not sent to us.</li>
        <li>The Game shows two kinds of ads through Google AdMob: optional rewarded ads (for a second undo in a game) and full-screen ads at the end of some games.</li>
        <li>The Game is designed for users aged 16 and over. If your year of birth shows that you may be under 16, no ads are shown and no ad data is sent to Google. Users under 18 (or whose year of birth does not show for certain that they are 18 or over) only see non-personalized ads. For everyone else, ads are personalized only if you allow it; you can withdraw your permission at any time.</li>
        <li>We don&apos;t use our own analytics tools and the Game doesn&apos;t send data to any server of ours. The Game connects to the internet to load ads.</li>
      </List>
      <H2>3. Data that stays on your device</H2>
      <p>Your best score, number of games played, settings (such as sound, vibration and theme) and your unfinished game are stored only on your device; we can&apos;t see them. If you uninstall the Game or clear its data, this data is deleted. If Android backup is turned on, Android may include your score and settings in the backup in your own Google account; your unfinished game and your ad choice are not included. Google manages that backup and we have no access to it.</p>
      <H2>4. Ads (Google AdMob)</H2>
      <p>Ads in the Game are served by Google&apos;s AdMob service:</p>
      <List>
        <li><b>Rewarded ads:</b> the first undo in each game is free; for a second undo you can choose to watch an ad. Watching ads is never required.</li>
        <li><b>Full-screen ads:</b> shown at the end of some games, after your score is displayed, following a short notice. If you tap a button during the notice, the ad is skipped that time.</li>
      </List>
      <p>To show ads, measure that they were viewed and prevent fraud, the Google Mobile Ads SDK collects the following data from your device and sends it to Google:</p>
      <List>
        <li><b>Device identifiers:</b> the Android advertising ID and app set ID (and, where applicable, identifiers of accounts signed in on the device).</li>
        <li><b>IP address:</b> may be used to estimate the device&apos;s approximate location (country or city level).</li>
        <li><b>Interaction information:</b> app launches, taps and ad video views.</li>
        <li><b>Diagnostic information:</b> performance of the app and the SDK (such as launch time, hang rate and energy use).</li>
      </List>
      <p>This data is encrypted in transit (TLS). We don&apos;t receive or store this data; AdMob only gives us aggregated ad reports (such as impressions and revenue). Google processes this data under its own responsibility and policies: <a href="https://policies.google.com/privacy" className={link}>Google Privacy Policy</a>, <a href="https://policies.google.com/technologies/partner-sites" className={link}>How Google uses information from sites or apps that use its services</a>, <a href="https://policies.google.com/technologies/ads" className={link}>Google advertising</a>.</p>
      <p><b>Consent and non-personalized ads.</b> When you first open the Game, you are first asked for your year of birth, wherever you are; until you answer, neither the ad component nor Google&apos;s consent tool runs. If your year of birth shows that you may be under 16, the ad component is not started at all (see section 8). If you are 16 or 17, or if your year of birth does not show for certain that you are 18 or over, ads are always shown without personalization and you are not asked for consent. If you are 18 or over: in the European Economic Area, the United Kingdom and Switzerland Google&apos;s consent form is shown, and in all other countries, including Türkiye, our own consent window is shown; if you allow personalized ads, Google chooses ads based on your interests, and if you don&apos;t, ads are shown without personalization. No ad is requested before these steps are completed. Even for non-personalized ads, Google processes limited information to show and count ads and to prevent fraud. In certain US states, Google&apos;s privacy options are also offered, where you can opt out of the sale or sharing of your personal information for ads (the &quot;Do Not Sell or Share My Personal Information&quot; link in the Game). You can change your choice in the Game under <b>Privacy options on the home screen</b> (depending on where you are, this opens Google&apos;s form or our own consent window, and tells users who may be under 16 that no ads are shown; withdrawing is as easy as giving consent). You can reset or delete your advertising ID in your Android settings.</p>
      <p><b>Where your choice is stored.</b> Your choice in the consent window, the date of the choice and the version of the text you saw are stored only on your device and are not sent to us. From your answer to the year-of-birth question, only your age group (under 16, 16-17, 18 or over) is kept on the device, not your year of birth. This record is not included in Android backups or device-to-device transfers. If you uninstall the Game or clear its data, these questions are asked again.</p>
      <H2>5. Purposes and legal bases</H2>
      <List>
        <li><b>Score, settings and unfinished game on the device:</b> to run the Game; not transferred to us.</li>
        <li><b>Data collected by AdMob:</b> serving and measuring ads, fraud prevention. Personalized ads: your consent (GDPR Art. 6(1)(a), KVKK Art. 5(1)), collected through Google&apos;s consent form in the EEA, UK and Switzerland and through our in-game consent window elsewhere; you can withdraw it at any time. Non-personalized ads and fraud prevention: legitimate interest (GDPR Art. 6(1)(f), KVKK Art. 5(2)(f)). Withdrawing consent does not affect processing before withdrawal.</li>
        <li><b>Support emails:</b> to answer your question; KVKK Art. 5(2)(c) and 5(2)(f).</li>
      </List>
      <H2>6. International transfers</H2>
      <p>AdMob data is sent directly from your device to Google LLC and its affiliates through the Game&apos;s advertising component, and is processed on servers outside Türkiye, including the United States. Google acts as a controller of this data under its own data protection terms. For users in the European Union, Google&apos;s terms rely on the EU Standard Contractual Clauses and the Data Privacy Framework; they do not include the standard contract announced by the Turkish Personal Data Protection Board for transfers from Türkiye. If you do not allow personalized ads, the data sent to Google is limited to what is needed to show and count ads and prevent fraud.</p>
      <H2>7. Retention</H2>
      <List>
        <li>Score, settings and unfinished game on the device: until you uninstall the Game or clear its data.</li>
        <li>AdMob data: according to <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;s retention policy</a>.</li>
        <li>Support emails: 1 year after the request is closed.</li>
      </List>
      <H2>8. Children</H2>
      <p>The Game is designed for users aged 16 and over; people under 16 should not use the Game. It is not directed at children and is not part of the Google Play Families program. Ads shown in the Game are limited to content suitable for general audiences (PG). We do not verify your age; we only ask for your year of birth when the Game starts.</p>
      <List>
        <li><b>If your year of birth shows that you may be under 16:</b> a one-time note tells you that the Game is designed for users aged 16 and over. No ads are shown in the Game; the ad component and Google&apos;s consent tool are never started, so no ad data is sent to Google. The second undo, which is unlocked by watching an ad, is not available in this case.</li>
        <li><b>If you are 16 or 17, or if your year of birth does not show for certain that you are 18 or over:</b> ads are always shown without personalization, a setting is sent to Google indicating that you are under the age of consent, and neither our consent window nor Google&apos;s consent form is shown to you. Even then, Google processes the limited information described in section 4 to show and count ads and to prevent fraud.</li>
      </List>
      <p>If you believe a child under 16 is using the Game, please write to {COMPANY.email}; uninstalling the Game or clearing its data is enough to delete the data on the device.</p>
      <H2>9. Your rights</H2>
      <p>Under KVKK Art. 11 and the GDPR you have the right to access, rectify and erase your data, to object and to complain. Because we keep no data that identifies you, the fastest route for most requests is Google: you can reset your advertising ID, change your consent choice in the Game, or contact Google through <a href="https://myaccount.google.com" className={link}>your Google Account</a>. Requests sent to {COMPANY.email} are answered within 30 days at the latest. You can complain to the Turkish Personal Data Protection Board or, in the EU, to the data protection authority of your country.</p>
      <H2>10. Changes</H2>
      <p>If the Game starts collecting new data, this policy is updated, and its date changed, before that version is released.</p>
    </LegalPage>
  );
}
