import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";

// Kaynak: OstlerTech/hukuk/2026-11-09-oyunlar-yayin-paketi/okey/02-gizlilik-politikasi-en.md (Zeynep, YAYIN METNİ; metin değiştirilmez). Türkçesi /okey/privacy; biri değişirse diğeri de.
export const metadata: Metadata = {
  title: "Okey Privacy Policy",
  description: "Okey (classic and 101): no sign-up, played against computer opponents, no money or betting, your game stays on your device; ads via Google AdMob.",
  alternates: { canonical: "/en/okey/privacy", languages: { tr: "/okey/privacy", en: "/en/okey/privacy" } },
};

const link = "text-primary hover:text-primary-light";

export default function OkeyPrivacyEnPage() {
  return (
    <LegalPage eyebrow={"Okey"} title="Okey Privacy Policy" lang="en" updated={false} altLink={{ href: "/okey/privacy", label: "Türkçe sürüm" }}>
      <div className="space-y-6 text-[1.0625rem] leading-relaxed">
      <p>Last updated: November 9, 2026</p>
      <p>This policy explains what data is processed when you use the Okey mobile game (the &quot;Game&quot;). Okey is a tile game (classic okey and 101) played against computer-controlled opponents. It serves as the privacy notice under the Turkish Personal Data Protection Law No. 6698 (KVKK) and as information under the EU General Data Protection Regulation (GDPR).</p>
      <H2>1. Data controller</H2>
      <p>{COMPANY.legalName} – {COMPANY.tradeName} (sole proprietorship). Address: {COMPANY.address}. Contact: {COMPANY.email}</p>
      <H2>2. In short</H2>
      <List>
        <li>The Game has no sign-up. We don&apos;t ask for your name, email address or phone number.</li>
        <li>The following is stored only on your device and not sent to us: your game in progress (a record of the table and the scores).</li>
        <li>You play against computer-controlled opponents; there is no connection to other players, no chat and no leaderboard. The Game has no real or virtual money, chips, tokens or betting; points are only the game score and cannot be exchanged for anything.</li>
        <li>The Game&apos;s interface is in Turkish.</li>
        <li>The Game contains ads, served by Google AdMob: a fixed ad area (banner) at the bottom of the screen, optional rewarded ads, and a full-screen ad that opens with a short countdown after a hand has ended, once the end-of-hand panel is shown. No full-screen ad is shown while a hand is being played.</li>
        <li>The Game has no purchases.</li>
        <li>The Game is designed for users aged 16 and over. If your year of birth shows that you may be under 16, no ads are shown and no ad data is sent to Google. Users under 18 (or whose year of birth does not show for certain that they are 18 or over) only see non-personalized ads. For everyone else, ads are personalized only if you allow it; you can withdraw your permission at any time.</li>
        <li>We don&apos;t use our own analytics tools and the Game doesn&apos;t send data to any server of ours. The Game connects to the internet for ads.</li>
      </List>
      <H2>3. Data that stays on your device</H2>
      <p>The following is stored only on your device, and we can&apos;t see it: your game in progress (a record of the table and the scores). If you uninstall the Game or clear its data, this data is deleted. If Android backup is turned on, Android may include your game progress in the backup in your own Google account and in device-to-device transfers; your age group, your ad choice and the record of Google&apos;s consent tool are not included. Google manages that backup and we have no access to it.</p>
      <H2>4. Ads (Google AdMob)</H2>
      <p>Ads in the Game are served by Google&apos;s AdMob service:</p>
      <List>
        <li><b>Bottom ad area (banner):</b> a fixed area at the very bottom of the screen. The game area and the buttons end above it; the ad does not cover or overlap them.</li>
        <li><b>Rewarded ads:</b> When it is your turn, you can choose to watch an ad to get a hint, at most once per hand (the button reads &quot;İpucu (reklam)&quot;, meaning &quot;Hint (ad)&quot;). Watching ads is never required; you can play without watching ads. If no ad is ready at that moment, you see a short notice and the option can&apos;t be used right then.</li>
        <li><b>Full-screen ads:</b> shown only after a hand has ended, once the end-of-hand panel is shown, with a 3-second countdown (&quot;Reklam 3, 2, 1&quot; / &quot;Ad in 3, 2, 1&quot;). If you tap a button or press Back during the countdown, or leave the Game, the ad is skipped that time; no full-screen ad opens after you tap a button. They are not shown at the end of the first two hands in a session; after that, at most once every two hands and with at least 2 minutes between two ads (rewarded ads included). No full-screen ad is shown while a hand is being played.</li>
      </List>
      <p>To show ads, measure that they were viewed and prevent fraud, the Google Mobile Ads SDK collects the following data from your device and sends it to Google:</p>
      <List>
        <li><b>Device identifiers:</b> the Android advertising ID and app set ID (and, where applicable, identifiers of accounts signed in on the device).</li>
        <li><b>IP address:</b> may be used to estimate the device&apos;s approximate location (country or city level).</li>
        <li><b>Interaction information:</b> app launches, taps and ad video views.</li>
        <li><b>Diagnostic information:</b> performance of the app and the SDK (such as launch time, hang rate and energy use).</li>
      </List>
      <p>This data is encrypted in transit (TLS). We don&apos;t receive or store this data; AdMob only gives us aggregated ad reports (such as impressions and revenue). Google processes this data under its own responsibility and policies: <a href="https://policies.google.com/privacy" className={link}>Google Privacy Policy</a>, <a href="https://policies.google.com/technologies/partner-sites" className={link}>How Google uses information from sites or apps that use its services</a>, <a href="https://policies.google.com/technologies/ads" className={link}>Google advertising</a>.</p>
      <p><b>Consent and non-personalized ads.</b> When you first open the Game, you are first asked for your year of birth, wherever you are; until you answer, neither the ad component nor Google&apos;s consent tool runs and no connection is made for ads. If your year of birth shows that you may be under 16, the ad component is not started at all (see section 9). If you are 16 or over, Google&apos;s consent tool connects to Google to find out whether consent is required where you are. If you are 16 or 17, or if your year of birth does not show for certain that you are 18 or over, ads are always shown without personalization and you are not asked for consent. If you are 18 or over: in the European Economic Area, the United Kingdom and Switzerland Google&apos;s consent form is shown, and in all other countries, including Türkiye, our own consent window is shown; if you allow personalized ads, Google chooses ads based on your interests, and if you don&apos;t, ads are shown without personalization. No ad is requested before these steps are completed. Even for non-personalized ads, Google processes limited information to show and count ads and to prevent fraud. In certain US states, Google&apos;s privacy options are also offered, where you can opt out of the sale or sharing of your personal information for ads (the &quot;Google gizlilik seçenekleri (ABD)&quot; (Google privacy options, US) button in the Game). You can change your choice in the Game under the gear button on the main menu &gt; <b>Reklam gizlilik seçenekleri</b> (&quot;Ad privacy options&quot;; the Game&apos;s interface is in Turkish); depending on where you are, this opens Google&apos;s form or our own consent window, and tells users who may be under 16 that no ads are shown. Withdrawing is as easy as giving consent. You can reset or delete your advertising ID in your Android settings.</p>
      <p><b>Where your choice is stored.</b> Your choice in the consent window, the date of the choice and the version of the text you saw are stored only on your device and are not sent to us. Your year of birth never leaves your device and is not stored; only your age group (under 16, 16-17, 18 or over) is kept on the device. If you are in the 16-17 group, an &quot;under the age of consent&quot; signal derived from that group is sent to Google with ad requests (section 9). These records are not included in Android backups or device-to-device transfers. If you uninstall the Game or clear its data, these questions are asked again.</p>
      <H2>5. Purchases</H2>
      <p>The Game has no in-app purchases; it does not use Google Play&apos;s billing component and does not ask you for payment details.</p>
      <H2>6. Purposes and legal bases</H2>
      <List>
        <li><b>Game data on the device:</b> to run the Game; not transferred to us.</li>
        <li><b>Data collected by AdMob:</b> serving and measuring ads, fraud prevention. Personalized ads: your consent (GDPR Art. 6(1)(a), KVKK Art. 5(1)), collected through Google&apos;s consent form in the EEA, UK and Switzerland and through our in-game consent window elsewhere; you can withdraw it at any time. Non-personalized ads and fraud prevention: legitimate interest (GDPR Art. 6(1)(f), KVKK Art. 5(2)(f)). Withdrawing consent does not affect processing before withdrawal.</li>
        <li><b>Support emails:</b> to answer your question; KVKK Art. 5(2)(c) and 5(2)(f).</li>
      </List>
      <H2>7. International transfers</H2>
      <p>AdMob data is sent directly from your device to Google LLC and its affiliates through the Game&apos;s advertising component, and is processed on servers outside Türkiye, including the United States. Google acts as a controller of this data under its own data protection terms. For users in the European Union, Google&apos;s terms rely on the EU Standard Contractual Clauses and the Data Privacy Framework; they do not include the standard contract announced by the Turkish Personal Data Protection Board for transfers from Türkiye. If you do not allow personalized ads, the ad data sent to Google is limited to what is needed to show and count ads and prevent fraud.</p>
      <H2>8. Retention</H2>
      <List>
        <li>Game data on the device: until you uninstall the Game or clear its data.</li>
        <li>AdMob data: according to <a href="https://policies.google.com/technologies/retention" className={link}>Google&apos;s retention policy</a>.</li>
        <li>Support emails: 1 year after the request is closed.</li>
      </List>
      <H2>9. Children</H2>
      <p>The Game is designed for users aged 16 and over; people under 16 should not use the Game. It is not directed at children and is not part of the Google Play Families program. Ads shown in the Game are limited to content suitable for general audiences (PG). We do not verify your age; we only ask for your year of birth when the Game starts.</p>
      <List>
        <li><b>If your year of birth shows that you may be under 16:</b> a one-time note tells you that the Game is designed for users aged 16 and over. No ads are shown in the Game; the ad component and Google&apos;s consent tool are never started, so no ad data is sent to Google. You get the hint without watching an ad.</li>
        <li><b>If you are 16 or 17, or if your year of birth does not show for certain that you are 18 or over:</b> ads are always shown without personalization; a setting is sent to Google, with ad requests and with the consent tool&apos;s query, indicating that you are under the age of consent and asking for ad treatment suitable for teenagers; neither our consent window nor Google&apos;s consent form is shown to you. Even then, Google processes the limited information described in section 4 to show and count ads and to prevent fraud.</li>
      </List>
      <p>If you believe a child under 16 is using the Game, please write to {COMPANY.email}; uninstalling the Game or clearing its data is enough to delete the data on the device.</p>
      <H2>10. Your rights</H2>
      <p>Under KVKK Art. 11 and the GDPR you have the right to access, rectify and erase your data, to object and to complain. Because we keep no data that identifies you, the fastest route for most requests is Google: you can reset your advertising ID, change your consent choice in the Game, or contact Google through <a href="https://myaccount.google.com" className={link}>your Google Account</a>. Requests sent to {COMPANY.email} are answered within 30 days at the latest. You can complain to the Turkish Personal Data Protection Board or, in the EU, to the data protection authority of your country.</p>
      <H2>11. Changes</H2>
      <p>If the Game starts collecting new data, this policy is updated, and its date changed, before that version is released.</p>
      </div>
    </LegalPage>
  );
}
