import type { Metadata } from "next";
import LegalPage, { H2, List, SellerBlock } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { SYNCSITE, BREVO_BAGLI, TOMBSTONE_CANLI } from "@/lib/syncsite";

// English version of /syncsite/gizlilik. Keep both in sync. Source: OstlerTech/hukuk/2026-10-29-syncsite-beta-kvkk.md (Zeynep, DRAFT).
const N = SYNCSITE.name;

export const metadata: Metadata = {
  title: `${N} Privacy Policy and Notice`,
  description: `${N} (formerly ${SYNCSITE.formerName}) construction-site tracking app: without an account your data stays on your device; with an account it is stored on servers in the EU (Ireland). The transfer abroad is explained openly.`,
  alternates: { canonical: SYNCSITE.privacyEnPath, languages: { tr: SYNCSITE.privacyPath, en: SYNCSITE.privacyEnPath } },
};

const link = "text-primary hover:text-primary-light";

export default function SyncSitePrivacyEnPage() {
  return (
    <LegalPage
      eyebrow={N}
      title={`${N} Privacy Policy and Notice`}
      lang="en"
      updatedOn={SYNCSITE.updatedEn}
      altLink={{ href: SYNCSITE.privacyPath, label: "Türkçe sürüm" }}
    >
      <p>
        This notice explains which personal data <strong className="text-foreground">{N}</strong> (published earlier as {SYNCSITE.formerName}),
        OstlerTech’s construction-site tracking app (Android and Windows apps and the cloud sync service), processes, why and how. It is our
        information notice under Article 10 of Türkiye’s Personal Data Protection Law No. 6698 (KVKK). The short notice below is also shown on the
        sign-up screen. If the Turkish and English texts differ, the Turkish text prevails.
      </p>

      <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
        <p className="font-semibold text-foreground">Short notice</p>
        <List>
          <li>You can use {N} <strong className="text-foreground">without an account</strong>: your data stays on your device and nothing reaches us.</li>
          <li>If you create an account, your data is stored on servers in the European Union (Ireland). <strong className="text-foreground">This is a transfer abroad and today it does not rely on one of the safeguards in KVKK Art. 9</strong> (section 6).</li>
          <li>There is no advertising, analytics, crash-reporting or AI service. We do not sell your data or use it for marketing.</li>
          <li>The app asks for no location (GPS) permission; location data inside photos is removed before upload.</li>
          <li>You can delete your account in the app or on the <a href={SYNCSITE.deleteEnPath} className={link}>account deletion page</a>.</li>
        </List>
      </div>

      <H2>1. Data controller</H2>
      <SellerBlock lang="en" />
      <p>
        For accounts you open for your own use, OstlerTech is the controller of your account data. If a business uses {N} with its staff, see
        section 5.
      </p>

      <H2>2. What data we process</H2>
      <p className="font-semibold text-foreground">If you create an account</p>
      <List>
        <li><strong className="text-foreground">Email address and password.</strong> We never hold your password in readable form; our sign-in service stores it as a one-way hash.</li>
        <li><strong className="text-foreground">Account ID and the date the account was created.</strong> This date is recorded as the start of the beta and of the trial period (section 4).</li>
        <li><strong className="text-foreground">The version and date of the beta terms you accepted.</strong></li>
        <li><strong className="text-foreground">Session data:</strong> a session key stored on your device to keep you signed in.</li>
        <li><strong className="text-foreground">Project membership:</strong> your role in each project (owner, editor, viewer) and team. A project owner adds you by your email address.</li>
        <li><strong className="text-foreground">Who entered a record:</strong> stored with each daily record so the team can see who entered it.</li>
        <li><strong className="text-foreground">Server logs:</strong> technical logs kept by our hosting provider when you connect (IP address, time, request type), used only for security and troubleshooting.</li>
      </List>
      <p className="font-semibold text-foreground">Site records (entered by you or your team)</p>
      <List>
        <li>Project name, description, dates; place names such as block, floor or flat (not geographic locations); team and work item names; target quantities.</li>
        <li>Daily records: date, quantity of work done, the <strong className="text-foreground">number of people</strong> on that job, notes and blocker information.</li>
        <li><strong className="text-foreground">Photos.</strong> Photos are resized and re-saved; this removes the location and device data (EXIF) inside them. Photos may show people’s faces.</li>
      </List>
      <p>
        {N} <strong className="text-foreground">does not keep per-person timesheets</strong> and does not ask for workers’ names. However, whatever you
        type in notes and team names, or capture in photos, is stored. Do not enter unnecessary personal data such as ID numbers or health information.
      </p>
      <p className="font-semibold text-foreground">On your device</p>
      <p>
        With or without an account, {N} keeps your data in a database and app folder on your device. Records entered offline sync when you are back
        online. This local database is not separately encrypted; we recommend using a screen lock. Excel, PDF and JSON files you export stay on your
        device (Documents/Projex); sharing and deleting them is up to you.
      </p>
      <p>
        In the current version, {N} data is excluded from Android Auto Backup and device-to-device transfer; you make copies yourself with Back up /
        export in the app. Versions 1.2.0 and earlier allowed backup: if you used them, Android may have backed up app data (including the session key)
        to your own Google account. That backup is between you and Google; we cannot access it.
      </p>
      <p className="font-semibold text-foreground">If you write to us</p>
      <p>Your name, email address and message in support or request emails.</p>
      <p className="font-semibold text-foreground">What we do not process</p>
      <p>GPS location, contacts, advertising ID, device identifiers, usage analytics, crash reports. Payment card data never reaches us (the beta is free).</p>

      <H2>3. How we collect it</H2>
      <p>
        You type your email and password on the sign-up screen; you or your team enter site records and photos in the app; the account creation date
        and technical logs are created automatically on the server while you use the service. Collection is electronic, through the app.
      </p>

      <H2>4. Why, legal grounds and the trial period</H2>
      <List>
        <li>
          Creating your account, signing in and password reset; syncing your records across your devices and team and sharing photos; managing the
          beta and trial period; sending necessary beta notices (end of the beta, an important change, verification codes):
          <strong className="text-foreground"> performance of a contract</strong> (KVKK Art. 5(2)(c)).
        </li>
        <li>Security, abuse prevention and troubleshooting; showing your team who entered a record: <strong className="text-foreground">legitimate interest</strong> (Art. 5(2)(f)).</li>
        <li>Answering support and data requests: performance of a contract and legal obligation (Art. 5(2)(c), 5(2)(ç), Art. 13).</li>
        <li>Invoicing and accounting (if paid plans are introduced later): legal obligation (Art. 5(2)(ç)).</li>
      </List>
      <p>
        <strong className="text-foreground">Beta and trial period.</strong> The date your account is created is recorded as the start of a 1-month trial
        period that may apply later. During the beta, no feature is restricted because of this period. The date is used only for this purpose and is
        deleted with your account. After you delete your account we do not keep your email address or a hash of it.
      </p>
      <p>
        We do not ask for explicit consent for these activities; this text is information, not a consent form. We send no marketing emails; if we ever
        want to, we will ask for your permission separately, in a separate text.
      </p>

      <H2>5. For businesses: who is the controller</H2>
      <p>
        When a business (for example a contractor or subcontractor) uses {N} with its staff and team, <strong className="text-foreground">that business is
        the data controller</strong> for personal data in the site records (staff records, people in photos), and OstlerTech is a processor acting on its
        instructions. Informing its staff is the business’s responsibility. During the open beta we do not sign individual agreements with businesses;
        instead, standard data processing terms for businesses are prepared as an addition to the beta terms, and where a business has signed a written
        pilot agreement earlier, that agreement applies. OstlerTech is the controller for account data (email, sign-in) and support correspondence.
      </p>

      <H2>6. Recipients and transfers abroad</H2>
      <p>We share your data only with these service providers, only to run the service:</p>
      <List>
        <li>
          <strong className="text-foreground">Supabase Pte. Ltd.</strong> (Singapore; parent company Supabase, Inc., USA): database, sign-in, photo
          storage. Data is stored in the European Union, Ireland (Amazon Web Services infrastructure).
        </li>
        {BREVO_BAGLI ? (
          <li>
            <strong className="text-foreground">Brevo</strong> (Sendinblue SAS, France): sending account emails (verification code, password reset).
          </li>
        ) : (
          <li>
            Account emails (verification code, password reset) are currently sent by Supabase’s own email service. If we start using a separate email
            provider, we will update this notice first.
          </li>
        )}
      </List>
      <p>
        Some of Supabase’s own service providers (support and infrastructure) are in the United States and other countries; data may be accessed from
        there during support or maintenance. Current list:{" "}
        <a href="https://supabase.com/legal/subprocessors" className={link}>supabase.com/legal/subprocessors</a>.
      </p>
      <p>
        <strong className="text-foreground">Current status of the transfer abroad.</strong> Because the servers are outside Türkiye, your data is
        transferred abroad when you create an account (KVKK Art. 9). Such a transfer must rely on an adequacy decision of the Turkish Board, or on the
        Board’s standard contract, signed unchanged by the parties and notified to the Authority. As of today:
      </p>
      <List>
        <li>We are not aware of any adequacy decision of the Board for the European Union or Ireland.</li>
        <li>
          We have Supabase’s standard data processing agreement, which is based on the EU Standard Contractual Clauses.{" "}
          <strong className="text-foreground">It is not the standard contract recognised under KVKK.</strong> The transfer therefore does not currently rely
          on one of the appropriate safeguards listed in KVKK Art. 9, and this carries a risk of non-compliance.
        </li>
        <li>
          We asked Supabase on 18.10.2026 to sign the Board’s standard contract; there has been no reply. If it is signed we will notify the Authority and
          update this notice. If it is not, we will consider moving the data to a server in Türkiye.
        </li>
      </List>
      <p>
        If you do not want to accept this, use {N} <strong className="text-foreground">without an account</strong> (“Continue without an account”): your
        data then never leaves your device. You can delete your account at any time (section 7). Apart from this, we disclose personal data only to
        authorities and courts on a lawful request, and only to the minimum extent required.
      </p>

      <H2>7. Retention and deletion</H2>
      <List>
        <li><strong className="text-foreground">Account</strong> (email, sign-in data, account creation/trial start date, accepted terms version): while your account exists; deleted immediately when you delete it.</li>
        <li><strong className="text-foreground">Projects you own and their photos:</strong> until you delete them or your account.</li>
        <li>
          <strong className="text-foreground">Records you delete one by one:</strong> the row stays in the cloud with a “deleted” mark so other devices learn of
          the deletion.{" "}
          {TOMBSTONE_CANLI
            ? "The record’s content (quantity, number of people, note, photo) and the photo file are erased; only the deleted mark remains."
            : "The record’s content is erased (in versions 1.2.1 and later; older versions left the content in the cloud), but the photo file you attached may remain in the cloud until the project or account is deleted (we are working on this; this notice will be updated)."}
        </li>
        <li><strong className="text-foreground">Records you entered in someone else’s project:</strong> that project belongs to its owner; when you delete your account the records stay but the link to you (who entered them) is removed.</li>
        <li><strong className="text-foreground">Server logs</strong> (IP address etc.): a short period set by the hosting plan (currently 1 day).</li>
        <li><strong className="text-foreground">Server backups:</strong> no automatic backups are kept at present; deleted data cannot be restored. Keep your own copies of important records using the app’s export.</li>
        <li><strong className="text-foreground">If the beta ends:</strong> we give you time after the notice to export your data; unless you move to a paid plan, beta data is then deleted from the live system (periods are in the beta terms).</li>
        <li><strong className="text-foreground">Support emails:</strong> 1 year after the request is closed. <strong className="text-foreground">Invoices and accounting records</strong> (if any): the statutory period (10 years).</li>
        <li><strong className="text-foreground">Logs or screenshots you send us:</strong> at most 30 days; deletion is recorded.</li>
        <li><strong className="text-foreground">Data on your device and exported files:</strong> until you delete them. Deleting your account also deletes the app’s local database; you delete exported files yourself.</li>
      </List>
      <p>
        How to delete your account and what is deleted or kept: <a href={SYNCSITE.deleteEnPath} className={link}>account deletion page</a>.
      </p>

      <H2>8. Security</H2>
      <p>
        The connection to the server is encrypted (HTTPS). In the database each user can see only the projects they belong to; photos are kept in a
        non-public area with access based on project role. Two-step verification is on for our service accounts and secret keys are kept out of our code
        repository. We do not put your data into AI services or test or demo environments. No system is free of risk; if a data breach occurs we will
        notify the Board and affected people as KVKK requires.
      </p>

      <H2>9. Your rights and how to apply (KVKK Art. 11)</H2>
      <p>
        You may ask us: whether your data is processed; for information about it; the purpose of processing and whether it is used accordingly; the
        recipients in Türkiye and abroad; to correct incomplete or wrong data, to erase or destroy it under Art. 7 and to notify recipients of this; to
        object to an adverse outcome resulting solely from automated analysis; and for compensation if you suffer damage from unlawful processing.
      </p>
      <p>
        <strong className="text-foreground">How to apply:</strong> email {COMPANY.email} from the address registered to your account; or in writing to{" "}
        {COMPANY.address}, Türkiye, or via KEP to {COMPANY.kep}. State your name, contact details and request; we may ask for more information to verify
        your identity. We reply free of charge within <strong className="text-foreground">30 days</strong> at the latest. Requests about site records in a
        {" "}{N} used by a business should go to that business; if they reach us, we forward them and let you know. If you are not satisfied with our reply,
        you may complain to the Turkish Personal Data Protection Board.
      </p>

      <H2>10. Children</H2>
      <p>{N} is a work app for businesses and their staff and is not directed at people under 18.</p>

      <H2>11. Changes</H2>
      <p>
        We update this notice as the product changes; the date is shown at the top. For important changes (a new service provider, a change of server
        location, a change in the status of the transfer abroad) we will notify you in the app or by email.
      </p>

      <p className="text-sm">Google Play™ and Android™ are trademarks of Google LLC.</p>
    </LegalPage>
  );
}
