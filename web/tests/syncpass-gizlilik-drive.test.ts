// SyncPass gizlilik sayfası (TR + EN aynı dosyada): Google Drive yedeğinin silme yolu (Zeynep 2026-11-10, Burak B2 / Kerem 2. tur).
// Uygulamada Drive'daki yedeği silen düğme yok; "Bağlantıyı Kes" yalnız oturumu kapatır. Metin bunu "uygulama içinden" diye anlatmamalı.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const yol = path.join(process.cwd(), "src", "app", "(tr)", "syncpass", "privacy", "page.tsx");
const metin = fs.readFileSync(yol, "utf8");
const trBolum = metin.slice(metin.indexOf('id="tr"'), metin.indexOf('id="en"'));
const enBolum = metin.slice(metin.indexOf('id="en"'));

test("syncpass/privacy: eski 'her ikisini de uygulama içinden' ve 'directly in the app' cümleleri yok", () => {
  assert.doesNotMatch(metin, /her ikisini de uygulama içinden/);
  assert.doesNotMatch(metin, /doğrudan uygulama içinden kullanabilirsiniz/);
  assert.doesNotMatch(metin, /You can do both yourself within the app/);
  assert.doesNotMatch(metin, /exercise these rights directly in the app/);
});

test("syncpass/privacy TR: Drive yedeği uygulama içinden silinmez, Bağlantıyı Kes yedeği silmez", () => {
  assert.match(trBolum, /Google Drive&apos;daki bulut yedeği uygulama içinden silinmez/);
  assert.match(trBolum, /&quot;Bağlantıyı Kes&quot; düğmesi yalnızca SyncPass&apos;in o telefondaki Google oturumunu kapatır/);
  assert.match(trBolum, /Gizli uygulama verilerini sil/);
  assert.match(trBolum, /Google Drive&apos;daki yedek için 3\. bölümdeki Google Drive yolundan/);
});

test("syncpass/privacy EN: Drive backup is not deleted within the app, Disconnect does not delete it", () => {
  assert.match(enBolum, /cannot be deleted from within the app/);
  assert.match(enBolum, /&quot;Disconnect&quot; on Android only signs SyncPass out of Google on that phone/);
  assert.match(enBolum, /Delete hidden app data/);
  assert.match(enBolum, /in Google Drive, as described in section 3, for the backup stored there/);
});

test("syncpass/privacy: silme bölümü bağlantı çapası (Play hesap silme bağlantısı) ve abonelik uyarısı TR+EN", () => {
  assert.match(trBolum, /title="Saklama ve silme" id="silme"/);
  assert.match(enBolum, /title="Retention and deletion" id="deletion"/);
  assert.match(trBolum, /Premium aboneliğinizi iptal etmez/);
  assert.match(enBolum, /does not cancel a Premium subscription on Google Play/);
});

test("syncpass/privacy: 4.5.25 düğmesi için gelecek vaadi yok", () => {
  assert.doesNotMatch(metin, /yakında|coming soon|sonraki sürümde|next version/i);
});
