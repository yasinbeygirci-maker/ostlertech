import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { CORNERTAB } from "@/lib/cornertab";

// English version of /cornertab/privacy. Keep both in sync. Source: OstlerTech/hukuk/2026-10-26-cornertab-gizlilik-son.md (Zeynep).
const N = CORNERTAB.name;

export const metadata: Metadata = {
  title: `${N} Privacy Policy`,
  description: `${N} customer ledger: no account, the ledger stays encrypted on your phone, no ads or analytics; Pro is bought through Google Play.`,
  alternates: { canonical: CORNERTAB.enPath, languages: { tr: CORNERTAB.path, en: CORNERTAB.enPath } },
};

const link = "text-primary hover:text-primary-light";

export default function CornerTabPrivacyEnPage() {
  return (
    <LegalPage eyebrow={N} title={`${N} Privacy Policy`} lang="en" updatedOn={CORNERTAB.updatedEn} altLink={{ href: CORNERTAB.path, label: "Türkçe sürüm" }}>
      <p>
        This policy explains which data is processed, and where, when you use the {N} mobile app (the “App”). It serves as the
        information notice under Türkiye’s Personal Data Protection Law No. 6698 (KVKK) and as information under the EU General
        Data Protection Regulation (GDPR).
      </p>

      <H2>1. Who we are and what we are responsible for</H2>
      <p>
        The App is developed by {COMPANY.legalName} – {COMPANY.tradeName} (sole proprietorship). Address: {COMPANY.address}, Türkiye.
        Contact: {COMPANY.email}. This policy covers the data that we, or components built into the App, process (purchases and
        support). The customer and supplier details you write into your ledger are your business’s records; we do not see, store or
        process them on your behalf. You, the business keeping the ledger, are the controller of those records (see section 9).
      </p>

      <H2>2. In short</H2>
      <List>
        <li>There is no account or sign-up. You do not give us your name, e-mail address or phone number.</li>
        <li>Your ledger (customers and suppliers, debts and receivables, payments, cash, stock, settings) stays on your phone in an encrypted database. It is not sent to us; we have no server of our own.</li>
        <li>We use no advertising, analytics or crash-reporting tools.</li>
        <li>Screenshots and screen recordings of the App are blocked, and its content is hidden in the recent apps list.</li>
        <li>You make your own backups: the file is encrypted with a password you choose and saved to a location you choose.</li>
        <li>Messages sent through WhatsApp, SMS or sharing are started and sent by you.</li>
        <li>
          The only part of the App that connects to the internet is Google Play’s purchase component (for Pro). Even if you have not
          bought Pro, this component asks Google Play for the purchase status each time the App opens. Your payment details do not
          reach us.
        </li>
      </List>

      <H2>3. Data that stays on your phone</H2>
      <p>
        Your business details, customer and supplier records (name, phone, address, tax number, IBAN, note), debt, receivable and
        payment records, cash and stock movements, and your settings are stored only on your phone. The database is encrypted with
        SQLCipher; its key is protected by the phone’s secure key store (Android Keystore). Your PIN is stored as a one-way hash,
        not in plain form. In Settings you choose how soon the PIN is asked for again after you leave the App and come back (default:
        after 1 minute). When the App opens WhatsApp, the share menu, the dialler or a browser for you, the lock waits at most 5
        minutes for you to come back, whatever time you chose. Fingerprint or face unlock is handled by Android; the App never sees
        your biometric data. While the App is open, screenshots and screen recordings are blocked and its content is not shown in
        the recent apps list. This data is
        excluded from Android’s Google account backup and from phone-to-phone transfer. Uninstalling the App, clearing its data, or
        using “Delete the ledger on this device” in the App deletes the ledger on the phone.
      </p>
      <p>
        <b>Country and currency suggestion.</b> On first launch, so that it can suggest your shop’s currency and phone country code,
        the App reads the selected app language, the country code of the SIM card and of the network your phone is connected to (e.g.
        “TR”) and the phone’s region setting. If the app language is Turkish, it suggests Turkish lira and +90; in other languages it
        looks at the SIM, the network and the region, in that order. You can change the suggestion on the same step. Your phone
        number, operator identity and SIM serial number are not read, and no permission is requested for this. The language and SIM
        information is used only on your phone to produce the suggestion; it is not stored, not written to logs, and not sent to us
        or anyone else. The only thing saved is the currency and country code you confirm.
      </p>
      <p>
        <b>Removing customers and clearing old records.</b> A customer with no entries at all is deleted completely. A customer with
        an open balance cannot be removed. When a customer who has entries is removed, or hidden with “Clean Archive” in Settings, it
        disappears from your lists and its name, phone number, IBAN, address, tax number and note are erased from the record on your
        phone. So that the ledger and reports still add up, amounts, dates and the descriptions you wrote on entries remain; if you
        wrote a person’s name in a description, that text remains too. Reports count these customers’ amounts in the totals without
        showing a name. “Clean Archive” covers settled customers with no activity in the period you choose; it first shows how many
        customers are affected and what will be erased, and asks for your PIN if the PIN lock is on. This cannot be undone in the
        App. Backups you made earlier still contain the erased details; if you restore such a backup, these customers’ names and
        other details come back. If you want the details gone completely, delete the old backup files as well.
      </p>

      <H2>4. Backups</H2>
      <p>
        When you make a manual backup or turn on automatic backup, a copy of your ledger is encrypted with a password you choose (key
        derived with PBKDF2, AES-256-GCM) and saved to the location you choose. With automatic backup a file is written to the folder
        you picked once a week in the free version and every day with Pro. We do not know your backup password and cannot recover it;
        if you forget it, the backup cannot be opened. Your password is not stored; so that automatic backup can run, a key derived
        from your password is kept only in your phone’s secure key store. If you pick a folder in a cloud service (e.g. Google Drive),
        the file goes to that service under your account and its terms; because it is encrypted, nobody without the password can open
        it. Manual backups stay until you delete them. For automatic backups the App deletes only older automatic backup files it
        created itself: the last 1 file is kept in the free version, the last 30 with Pro. If you leave Pro, backups made while you
        had Pro are not deleted.
      </p>

      <H2>5. Messages, calls, PDF statements</H2>
      <p>
        When you send a reminder or an account summary, the App opens WhatsApp (or WhatsApp Business), your SMS app or the share menu
        with the customer’s number and a prepared message (customer name, amount, your business name). You see the message, can change
        it, and send it yourself; the App never sends messages on its own. A sent message is subject to the terms of the app you
        chose. If WhatsApp is not installed, the message is never sent to a browser; the share menu opens instead and you choose which
        app to send it with. The “Call” button only opens your phone’s dialler.
      </p>
      <p>
        Account statements are created as PDF files on your phone. “Save as a file” saves the PDF where you choose. “Send as PDF” writes
        the file to a temporary folder that only the App can access (its cache) and opens the share menu; only the app you pick can
        read the file, and you send it from that app. The file name and content include the customer’s name and account movements.
        This temporary file is deleted the next time you use “Send as PDF”; until then it stays on your phone (Android may also delete
        it earlier to free up space). The copy you send stays in the app you chose and with the recipient, under that app’s terms.
      </p>

      <H2>6. Pro purchase (Google Play)</H2>
      <p>
        Pro is a one-time purchase through Google Play’s billing system. Your payment details and purchase record are processed by
        Google; the App checks the purchase only on your phone, by verifying the signature that Google Play provides. Your name or
        payment details do not reach us. Each time the App opens, whether or not you bought Pro, it asks Google Play for this Google
        account’s purchase status (so that a refund or a purchase made on another phone shows up). Google Play’s purchase component may
        send technical information to Google (e.g. app and device information, the result of the operation, error codes) to run and
        improve the service; it is encrypted in transit and processed under Google’s policies:{" "}
        <a href="https://policies.google.com/privacy" className={link}>Google Privacy Policy</a>. Your ledger records are never given to
        this component. Your Pro status (whether you have Pro and when it was last confirmed) is stored only on your phone; without
        internet the last known status is used for at most 90 days, after which it must be confirmed again. Refunds follow Google
        Play’s refund rules.
      </p>

      <H2>7. Purposes, method and legal bases</H2>
      <List>
        <li>Ledger and settings on your phone: for the App to work; not transferred to us.</li>
        <li>Pro purchase: to provide the service you bought (KVKK Art. 5(2)(c), GDPR Art. 6(1)(b)). Payment and purchase records are Google’s responsibility. The data is collected automatically by the Google component on your phone.</li>
        <li>Technical information from Google Play’s purchase component: under Google’s own responsibility, for the service to work securely and correctly.</li>
        <li>Support e-mails: to answer your question (KVKK Art. 5(2)(c) and 5(2)(f)). Method: e-mail.</li>
      </List>

      <H2>8. International transfers</H2>
      <p>
        Purchase data and the purchase component’s technical information are sent directly from your phone to Google LLC and its
        affiliates and may be processed on servers outside Türkiye, including the United States. OstlerTech does not make this
        transfer and has no access to this data; Google processes it under its own data protection terms. Your ledger records are not
        transferred abroad; only if you save a backup to a cloud folder hosted abroad does the encrypted file go there. For support
        e-mails, your e-mail provider’s infrastructure applies.
      </p>

      <H2>9. For businesses: your customers’ details</H2>
      <p>
        Your customers’ and suppliers’ names, phone numbers and balances are their personal data, and the duties for these records
        under data protection law (informing them, keeping only what is needed, keeping it secure, correcting and deleting on request)
        belong to the business keeping the ledger. The App gives you these tools: records stay encrypted on the phone; a PIN can be
        set; screenshots are blocked; a contact’s details can be edited; when a customer is removed or hidden by clearing old records,
        its name, phone number, IBAN, address, tax number and note are erased (section 3; earlier backups still contain them); the
        whole ledger on this phone can be deleted from Settings after confirming with your PIN (backup files, and PDFs you saved or
        sent, stay where you put them or with the recipient; delete them separately). Do not write special-category information such as health or religion in the note
        field. Check the number before sending a reminder. You may want to ask a lawyer about your own obligations.
      </p>

      <H2>10. Retention</H2>
      <List>
        <li>Ledger on the phone: until you uninstall the App, clear its data, or delete the ledger in the App.</li>
        <li>Manual backups: where you saved them, until you delete them. Automatic backups: the last 1 file (free) or 30 files (Pro) (section 4).</li>
        <li>Temporary statement from “Send as PDF”: until the next send, until the App’s data is deleted, or until Android clears the cache (section 5).</li>
        <li>
          Google Play purchase and technical information: under{" "}
          <a href="https://policies.google.com/technologies/retention" className={link}>Google’s retention policy</a>.
        </li>
        <li>Support e-mails: 1 year after the request is closed.</li>
      </List>

      <H2>11. Children</H2>
      <p>The App is designed for businesses and users aged 18 and over; it is not directed at children.</p>

      <H2>12. Your rights and how to apply</H2>
      <p>
        Under KVKK Art. 11 and the GDPR you have rights to information, correction, deletion, objection and complaint. Because we do
        not see your ledger, you can correct and delete it directly in the App. For purchase records, contact Google Play or use your{" "}
        <a href="https://myaccount.google.com" className={link}>Google account</a>. Requests sent to {COMPANY.email} are answered
        within 30 days at the latest. You may complain to the Turkish Personal Data Protection Board or, in the EU, to your country’s
        data protection authority. If you are listed in a business’s ledger (as its customer), send your request to that business; we
        cannot access those records.
      </p>

      <H2>13. Changes</H2>
      <p>If the App starts processing new data, this policy is updated before that version is released, and the date changes.</p>

      <p className="text-sm">Google Play™ and Android™ are trademarks of Google LLC. WhatsApp is a trademark of Meta Platforms, Inc.</p>
    </LegalPage>
  );
}
