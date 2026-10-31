import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { SYNCSITE, TOMBSTONE_CANLI } from "@/lib/syncsite";

// English version of /syncsite/hesap-silme. Keep both in sync. The address is entered in the Play Data safety form; do not change it.
const N = SYNCSITE.name;

export const metadata: Metadata = {
  title: `${N} Account and Data Deletion`,
  description: `How to delete your ${N} (formerly ${SYNCSITE.formerName}) account in the app or by email, when it is deleted and what remains.`,
  alternates: { canonical: SYNCSITE.deleteEnPath, languages: { tr: SYNCSITE.deletePath, en: SYNCSITE.deleteEnPath } },
};

const link = "text-primary hover:text-primary-light";

export default function SyncSiteDeleteEnPage() {
  return (
    <LegalPage
      eyebrow={N}
      title={`${N} Account and Data Deletion`}
      lang="en"
      updatedOn={SYNCSITE.updatedEn}
      altLink={{ href: SYNCSITE.deletePath, label: "Türkçe sürüm" }}
    >
      <p>
        This page explains how to delete the account you created in OstlerTech’s <strong className="text-foreground">{N}</strong> app (formerly{" "}
        {SYNCSITE.formerName}) and your data in the cloud. If you use {N} without an account we hold no data about you in the cloud; uninstalling the
        app or clearing its data is enough.
      </p>

      <H2>1. Delete in the app (fastest)</H2>
      <List>
        <li>Open {N} and sign in.</li>
        <li>Tap <strong className="text-foreground">Settings &gt; Delete my account</strong>.</li>
        <li>
          If other people are members of a project you own, you are asked again first, because the project will be deleted for them too. If you do
          not confirm, nothing is deleted.
        </li>
        <li>After you confirm, your account and the projects you own are deleted from the cloud, then the {N} data on the device.</li>
      </List>

      <H2>2. If you cannot use the app: delete by email</H2>
      <p>If you uninstalled the app or cannot access your phone or password, you can have your account deleted by email:</p>
      <List>
        <li>
          Email <a href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`${N} account deletion request`)}`} className={link}>{COMPANY.email}</a>{" "}
          <strong className="text-foreground">from the email address registered to your account</strong> and write “I want my {N} account deleted”. For a
          request from another address we ask for more information to verify your identity.
        </li>
        <li>Telling us which projects the account owns and whether other people are in them speeds things up.</li>
        <li>
          We confirm receipt and delete your account within <strong className="text-foreground">{SYNCSITE.deleteBusinessDays} business days</strong> at the
          latest. When it is done we email you.
        </li>
      </List>
      <p>
        You can also make this request as a KVKK Art. 11 application; applications are answered free of charge within 30 days. Our postal and KEP
        addresses are on the <a href="/en/privacy" className={link}>Privacy Policy</a> page and in the{" "}
        <a href={SYNCSITE.privacyEnPath} className={link}>{N} privacy policy</a>.
      </p>

      <H2>3. What is deleted</H2>
      <List>
        <li>Your account: email address, password hash, account ID, the account creation (trial start) date and the accepted beta terms version.</li>
        <li>Projects you own and everything under them: locations, work items, targets, daily records, teams, memberships and photos.</li>
        <li>All your project memberships.</li>
        <li>The {N} database on your device (if you delete from the app).</li>
      </List>

      <H2>4. What remains, and for how long</H2>
      <List>
        <li>
          <strong className="text-foreground">Records you entered in someone else’s project</strong> belong to that project’s owner and stay in the project, but the
          link to you (who entered them) is removed.
        </li>
        <li>
          <strong className="text-foreground">Records you deleted earlier, one by one:</strong>{" "}
          {TOMBSTONE_CANLI
            ? "their content and photos are already erased; the rows disappear when the account is deleted."
            : "in versions 1.2.1 and later their content is already erased (older versions may have left content in the cloud); in a project you own they disappear completely with the account, in someone else’s project only the content-free “deleted” row remains."}
        </li>
        <li><strong className="text-foreground">Hosting provider server logs</strong> (IP address, time): at most 1 day, then deleted automatically.</li>
        <li><strong className="text-foreground">Backups:</strong> no automatic server backups are kept; deleted data cannot be restored. Before deleting, export important records with the app’s Excel/JSON export.</li>
        <li>
          <strong className="text-foreground">Support emails you sent us</strong> (including your deletion request): 1 year after the request is closed. A record that the
          deletion was done is kept without personal data (only the date and type of action).
        </li>
        <li><strong className="text-foreground">Invoices and accounting records</strong> (only if you buy a paid plan in the future): the statutory period (10 years).</li>
        <li>
          <strong className="text-foreground">Files you exported yourself</strong> (Excel, PDF, JSON), backups you took and anything you shared with others stay with you or the
          recipient; you need to delete them separately.
        </li>
      </List>
      <p>
        After you delete your account we <strong className="text-foreground">do not keep</strong> your email address or a hash of it; you can open a new account with the
        same address.
      </p>

      <H2>5. Removing cloud data without deleting your account</H2>
      <p>
        If you want to keep your account but remove your cloud data, you can delete the projects you own in the app, or email{" "}
        <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a> saying which data you want deleted. If you switch to using {N} without an account,
        new data no longer goes to the cloud.
      </p>

      <H2>6. Contact</H2>
      <p>
        If you have trouble with deletion: <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>. For how data is processed, see the{" "}
        <a href={SYNCSITE.privacyEnPath} className={link}>{N} privacy policy</a>.
      </p>
    </LegalPage>
  );
}
