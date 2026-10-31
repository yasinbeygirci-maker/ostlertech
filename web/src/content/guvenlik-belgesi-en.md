# SyncPass security and encryption whitepaper

Last updated: 31 October 2026 · Versions covered: SyncPass Android 4.5, SyncPass Desktop (Windows) 1.4, SyncPass browser extension (Chrome) 1.1.0

This document explains how SyncPass protects your data at a technical level: how the key is generated, what is encrypted
and how, what is not encrypted, what leaves your device, and what SyncPass does and does not protect against. For a
shorter summary, see the [Security](/en#security) section.

We wrote this document by checking the app's source code, and we say where we could not verify something. The source
code is not public, so you cannot test this directly; that is why we have tried to be detailed and specific. The
question of an independent audit is covered in section 12.

## 1. In short

- Your vault stays encrypted on your device: in an encrypted database on Android, in an encrypted file on Windows.
- The key that opens the vault is derived from your master password on your device. Your master password and this key
  are never sent to us.
- No copy of your vault is kept on our servers. If you turn on sync, an encrypted copy goes to your own Google Drive.
- We do not know your master password and cannot reset it. On Android, the recovery QR code exists for this
  purpose (section 6).
- Some features connect to the internet. Section 8 lists each one and what it sends.

## 2. The key path

```
Master password (only you know it)
   │  PBKDF2-HMAC-SHA256, 600,000 iterations, random 16-byte salt per vault
   ▼
Vault key (256 bits, kept in memory only)
   ├─ Android: the database (SQLCipher) key
   ├─ Encrypting sensitive fields one by one (AES-256-GCM)
   ├─ Windows: encrypting the vault file (AES-256-GCM)
   ├─ Encrypting the Google Drive copy and backup files (AES-256-GCM)
   └─ Check value: an HMAC-SHA256 value stored to tell whether the master password was entered correctly
Wrapped copies of the vault key stored on the device (Android only, only if you turn them on):
   ├─ Unlock with fingerprint / face: wrapped with an Android Keystore key
   └─ Recovery QR code: wrapped with the random key in the QR
```

- **Key derivation:** PBKDF2-HMAC-SHA256, 600,000 iterations, random 16-byte salt. This is the minimum OWASP
  recommends for PBKDF2. The iteration count slows down every password guess; it does not make a weak master
  password strong.
- **One key:** all the uses above share the same vault key; no separate subkeys are derived.
- **Check value:** the app does not store your master password. Next to the salt it stores an HMAC-SHA256 value
  computed with the vault key. If the password you enter gives the same value, it is correct. Someone who obtains
  this value can try guessing passwords; each guess costs a 600,000-iteration derivation.
- **Randomness:** salts, initialisation vectors, the recovery key and the password generator use the operating
  system's secure random number source.
- **Older vaults:** vaults created in SyncPass 3.x keep opening with the older setting (PBKDF2-HMAC-SHA1, 200,000
  iterations). The app does not upgrade them automatically when they are opened.

## 3. Encryption format

SyncPass Android and SyncPass Desktop use the same encrypted format. Every encrypted value is stored like this:

| Part | Size | Meaning |
|---|---|---|
| Format marker | 4 bytes | `SPv2` |
| Salt | 16 bytes | The salt the key was derived with |
| Initialisation vector (IV) | 12 bytes | New and random for every encryption |
| Ciphertext + authentication tag | variable + 16 bytes | AES-256-GCM |

The whole value is encoded as text with Base64. AES-256-GCM is authenticated encryption: a value that was changed,
or written with another key, does not open and is rejected. Neither app restores a backup in which any field fails to
decrypt; neither shows ciphertext as if it were the value.

## 4. What we store on your device, and how

### Android

| What | How it is protected |
|---|---|
| Vault database (all items) | The whole database is encrypted with SQLCipher; its key is the vault key. There is no fallback to an unencrypted database. |
| Sensitive fields | Encrypted once more, field by field, with AES-256-GCM on top of the database encryption. List in section 7. |
| App settings (theme, language, sync setting, salt, check value, wrapped key for the recovery QR) | Not encrypted; kept in the private storage Android gives the app. No vault content. |
| Personal details (name, email, phone in your profile; emergency contact email; the breach-check key you entered) | Not encrypted; kept in the app's private storage and left out of Android backup. |
| Fingerprint unlock record | The vault key wrapped with an Android Keystore key (section 5). |

### Windows (SyncPass Desktop)

| What | How it is protected |
|---|---|
| Vault file, its previous version and the last sync copy | The whole file is encrypted with AES-256-GCM (same key derivation). |
| Files attached to notes | Inside the vault file, encrypted with it. No unencrypted temporary copy is written; an unencrypted copy is written only when you choose "Save to computer", at the place you pick. These files are never sent to the cloud. |
| Salt, check value, settings, license details | Not encrypted; kept in your user account's section of the Windows registry. |
| Google Drive sign-in token | Not encrypted; kept in a file in the SyncPass data folder under your user folder. The token can only reach SyncPass's own hidden folder on Drive. |
| Sync status log | Not encrypted; holds only times, a result code and item counts. No title, value or account name. |

## 5. Android Keystore and biometric unlock

If you turn on unlocking with fingerprint or face, the app creates an AES-GCM key in the Android Keystore and wraps
the vault key with it.

- The Keystore key can only be used after biometric authentication.
- If a new fingerprint is added to the device, or all are removed, the key becomes invalid; the app turns biometric
  unlock off and asks for your master password.
- By the design of the Android Keystore this key cannot be exported from the device, so fingerprint unlock does not move to a new phone.
- Whether the Keystore is hardware-backed depends on the phone model; the app does not require it.

SyncPass Desktop has no biometric unlock.

## 6. Recovery QR code (Android only)

### How it works

1. When you create a recovery QR, the app generates a random 256-bit recovery key.
2. It wraps the vault key with this recovery key using AES-256-GCM and writes the wrapped copy to the app settings.
3. It shows you the recovery key as a QR code. The app does not write the recovery key to its own settings, and it
   is never sent to us.
4. If you forget your master password, you scan the QR. The app opens the wrapped copy with the key in the QR, checks
   the result against the check value and opens the vault.

### What it protects

- It lets you get back into your vault when you forget your master password.
- The QR on its own carries no vault content. It works together with the wrapped key, which is stored in the app
  settings on your phone (and, if your Android backup is on, in that backup too; see section 8).

### What it does not protect

- **The QR stands in for your master password.** Someone who gets the QR and your phone (or your phone's Android
  backup) can open your vault without your master password. Keep the QR as carefully as your master password.
- If you send the QR to an app with "Share" (email, messages, cloud), the image stays in that app. After "Share",
  the image may also stay in the app's cache on your phone. If you can, print it or copy it onto paper.
- In SyncPass Android 4.5 the master password cannot be changed. The QR opens the vault but does not set a new master
  password.
- SyncPass Desktop has no recovery QR or recovery code. If you forget your master password on desktop, the vault
  cannot be opened.
- If you lose your master password and the QR (and, on Android, fingerprint unlock is off), your vault cannot be opened,
  and we cannot open it either. This is a deliberate design choice.

## 7. Backups and Google Drive sync

### What goes where

- If you turn on sync, the whole vault is uploaded as **one encrypted file** to your Google Drive, into the hidden
  folder Drive gives each app. SyncPass asks for access to that folder only; it cannot see your other Drive files.
- SyncPass on Android syncs in the background about every 12 hours, and more often while the app is open. SyncPass Desktop syncs
  while the app is open.
- A backup file you make by hand is encrypted the same way.
- SyncPass Desktop connects to the vault on your phone with the same master password: it derives the same key
  from the salt inside the Drive file. Your master password is still never sent between devices.

### Inside the copy: encrypted twice

The whole Drive file is encrypted with AES-256-GCM under the vault key. Neither Google nor we can open this file
without knowing your master password; how strong this protection is depends on how strong your master password is
(section 11). Inside the file, the sensitive fields below are encrypted once more, field by field:

| Item type | Fields encrypted on their own as well |
|---|---|
| Login | Title, username, password, address (URL), notes, 2FA secret, extra fields, recovery codes |
| Payment card | Card number, card type, cardholder, expiry date, CVV, CVV2, PIN |
| Identity document | First name, last name, ID number, serial number, date and place of birth, issue and expiry date, issuing authority, details, link to the document image on the phone |
| Corporate document | Organisation, tax number, social security number, policy number, license key |
| Crypto wallet | Recovery phrase, private key |
| Bank account | Bank name, account holder, IBAN, account number, branch code, SWIFT code |
| Passkey | Site, username, credential ID, user handle, private key |
| Address | Street, city, state, postcode, country |
| Secure note | Content; link to the attached file on the phone (the file itself is not in the copy) |
| Wi-Fi | Network name, password, router username and password |
| Authenticator (2FA) | Secret key, issuer, account name |
| Wallet card | Barcode data |

**Not encrypted on their own** (these stay encrypted with the whole file and never leave as plain text): titles of
items other than logins, category, item type, times, favourite mark, password strength and leak count, the phone link
of a custom icon you picked for a login, card colour, authenticator algorithm and digit settings, Wi-Fi security type,
crypto network name, organisation on a wallet card, device name and last-used time of a passkey. In the database on
your phone these fields are protected by the database encryption only.

### What Google can see

Google cannot see inside the copy. Like any cloud service, it does see that the file exists, its name, its size and
when it changed.

### Not encrypted: the full list

SyncPass does not encrypt the following. None of them contains your master password or the vault key, but you should
know about them:

- **App settings:** salt, check value, wrapped key for the recovery QR, theme/language/lock settings (in the app's private
  storage on Android, in your user registry on Windows). On Android these settings are part of Android backup.
- **Profile details (Android):** name, email and phone in your profile, emergency contact email, breach-check key.
  Kept in the app's private storage, not backed up.
- **SyncPass Desktop license details and Google Drive sign-in token:** in your Windows user account's storage.
- **Name, size and times of the Drive file:** visible to Google.
- **A value you copy to the clipboard:** sits on the clipboard as plain text until it is cleared (section 10).
- **A recovery QR image you shared:** may stay in the app you sent it to and in the cache on your phone (section 6).
- **A file you import from another password manager (CSV etc.):** a plain-text file made by that app; SyncPass reads it
  but does not change or delete it. Delete it yourself when the import is done.
- **A note attachment you take out with "Save to computer":** written as a plain file where you choose.

## 8. What leaves your device

Your master password and vault key are sent in **none** of the cases below. Items marked "automatically" run in the
background without you pressing anything.

### Derived from your vault, or written by you

| Feature | Where to | What is sent |
|---|---|---|
| Google Drive sync / backup (optional; automatic once on) | Your Google Drive | The whole vault as one encrypted file (section 7) |
| Leaked password check (Premium, Android and Desktop) | Have I Been Pwned (api.pwnedpasswords.com) | Only the first 5 characters of the password's SHA-1 hash (k-anonymity). Matching happens on the device; the password and the full hash are not sent. |
| Support chat (Android only), when you send a message | Google Gemini | The text of a question that has no built-in answer. Before sending, card numbers, email addresses, IP addresses and "password: ..." patterns are removed; this filter cannot catch every password. **Do not type passwords or personal details into the chat.** SyncPass Desktop has no such feature. |
| Email breach check (Premium, Android only, only if you enter your own Have I Been Pwned key; then automatically every 7 days) | Have I Been Pwned (haveibeenpwned.com) | The email addresses found in your vault items, over HTTPS. Without your key this check never runs. |
| Vault report (Android only), when you ask | Google Gemini | Only numbers and yes/no values: security score, item count, number of weak / reused / leaked passwords, number of email breaches, whether biometrics, sync and the emergency setting are on, the report language. No names, addresses, usernames or passwords. |

Google's terms may allow it to use content sent to Gemini to improve its services.

### Not carrying vault content

| When | Where to | What is sent |
|---|---|---|
| Activating a SyncPass Desktop license; then automatically about once a week | ostlertech.com (our server) | The license key, a random device number made by the app, the app version. The free version never connects to this server. |
| Buying Premium (Android) | Google Play | The purchase happens through Google Play; its signature is checked on the device. |
| Android's own automatic backup (if on in your phone) | Your Google account | App settings: the check value and salt used to verify your master password, the wrapped key for the recovery QR. The vault database and your personal details are not part of this backup. |
| Passkeys and autofill (Android): Google's browser list automatically every 7 days; site file when a passkey is requested | Google (gstatic.com) and the site in question | Google's browser list is downloaded. When an app asks for a passkey for a site, that site's public `assetlinks.json` file is read. Nothing from the vault is sent. |
| Text and QR recognition (Android) | Google | Recognition runs on the device. According to Google's documentation, the ML Kit library may send usage statistics. |
| If the app crashes | Google Play / Windows Error Reporting | This is done by the operating system and depends on your device settings. The app has no crash reporting service of its own. |

There are no advertising, analytics or crash reporting libraries in the app.

## 9. Browser extension and the SyncPass Desktop bridge

- The extension stores no passwords. It does not connect to the internet; it talks only to SyncPass Desktop running
  on the same computer.
- The path is: extension → the browser's native messaging channel → SyncPass → a connection that stays inside the
  computer (127.0.0.1). This connection requires a random token that is made fresh at every start.
- The page you are on is reported by the browser, not by the page. SyncPass hands out a password only for a login
  saved for that page's address (the same domain or one of its subdomains). Logins saved without an address are never
  handed to any page.
- While the vault is locked, the extension gets nothing.
- For 2FA, the extension gets only the current 6-digit code, never the secret. Copying the code is done by SyncPass
  Desktop itself (with the clipboard rule below).
- The extension can also fill `http://` pages. A password typed into an unencrypted page can be read on the network;
  prefer pages that use an encrypted connection (`https://`).

## 10. Protections inside the app

| Protection | SyncPass Android 4.5 | SyncPass Desktop (Windows) 1.4 |
|---|---|---|
| Clipboard auto-clear | Default 45 seconds (15 s, 45 s, 2 min or "never"). Cleared on time even when the app is closed. If the vault locks while the app is in the foreground, a pending value is cleared at once. | Default 30 seconds (15, 30, 45 s, 2 min or "never"). A pending value is cleared at once when the vault locks or the app closes. |
| Keeping out of clipboard history | On Android 13 and later, the copied value is marked "sensitive": hidden in previews; keyboards should not keep it in their history. | Copied with the formats that keep it out of Windows clipboard history (Win+V), the cloud clipboard and clipboard monitors. |
| Screenshot block | On. Screenshots, screen recordings and the recent-apps preview do not show the vault. | None. |
| Auto-lock | Default: at once when the app goes to the background (1 or 5 minutes can be chosen). | Off by default; in Settings you can lock after 1, 5, 15 or 30 minutes of inactivity. **We recommend turning it on.** |
| Biometric unlock | With Android Keystore (section 5). | None. |
| Root warning | A warning is shown on a rooted device; the app is not blocked. | Not applicable. |

## 11. Threat model

### What SyncPass protects against

- **A lost or stolen device (vault locked):** the vault database and vault file are encrypted. Opening them needs the
  master password, a registered fingerprint on Android, or the recovery QR.
- **Google Drive, or Google, reading the copy:** the Drive copy cannot be opened without your master password; with a strong master password, guessing it is also impractical.
- **Changes to the copy:** AES-256-GCM rejects a copy that was changed.
- **Our servers being compromised:** our servers do not hold a vault, master password or key; for SyncPass they hold only desktop license records and the email address passed on with a purchase. So your vault cannot be read from there.
- **Password guessing with the vault file:** every guess needs a 600,000-iteration key derivation. This slows
  guessing down but does not stop it; the protection depends on how long and unpredictable your master password is.
- **Another site asking for your password (extension):** a password is only given to a page that matches its saved
  address.
- **Shoulder surfing, screen sharing and clipboard history:** the screenshot block on Android; timed clipboard clearing
  and keeping out of clipboard history on both platforms.

### What SyncPass cannot protect against

- **A compromised device:** malware, a keylogger or a screen-reading app on your device can capture what you see or
  type while the vault is open. A program running under your Windows account can ask SyncPass Desktop for items while
  the vault is open. No password manager can protect a compromised device on its own.
- **Rooted or modified operating systems:** Android's app isolation and Keystore protections are weaker.
- **A weak or reused master password:** key derivation slows guessing; it does not rescue a weak password.
- **Someone getting your recovery QR:** the QR stands in for your master password (section 6).
- **A tampered installer:** if you download the app from an unofficial place, or the download path is taken over, information can be captured while the vault is open. Download SyncPass only from Google Play and ostlertech.com.
- **Someone taking over your Google account:** the encrypted copy can be deleted or replaced with an older encrypted
  copy; it cannot be read. If Android backup is on, the check value can be used to try guessing passwords. Protect
  your Google account with 2-step verification.
- **Memory:** while the vault is open, the key and the master password are in the device's
  memory. On lock, the app wipes the master password in memory and drops the key; because of how Android and Java
  manage memory, we cannot guarantee that every copy of the key is erased at that moment.
- **The clipboard on older Android versions:** Android 12 and earlier have no "sensitive" clipboard mark; some
  keyboards may keep the copied value in their own history or cloud sync. Keep the clipboard clear time short.
- **A vault left open on SyncPass Desktop:** there is no screenshot block and auto-lock is off by default.
- **What you type into the support chat:** the filter cannot catch every password or personal detail.

## 12. Independent audit and source code

- **SyncPass is not open source:** the source code is not published under a license open to everyone. You cannot test the claims in this document by reading the source code.
- **No independent security audit has been done.** No outside security firm has audited SyncPass. We run internal
  security and test reviews before releases; these do not replace an independent audit.
- When the source code is not open, the strongest basis for trust is an independent audit. There is no decision or
  timeline for an independent audit yet; if one is done, we will update this section.
- If you find something in this document that does not match the app, or you find a security vulnerability, write to
  us (section 13).

## 13. Reporting a vulnerability

If you have found a security vulnerability, write to **guvenlik@ostlertech.com** (English or Turkish). Scope, rules and
process are on the [Report a vulnerability](/en/report-vulnerability) page. We have no bounty programme.
