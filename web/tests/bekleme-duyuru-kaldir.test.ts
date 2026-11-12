// Bekleme listesinden duyuru e-postası vazgeçildi (Yasin, 2026-11-12): rıza kutusu, rıza vaadi ve rıza yazan yol kalmaz.
// Çalıştırma: npm test
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const root = process.cwd();
const read = (...p: string[]) => fs.readFileSync(path.join(root, ...p), "utf8");

test("form: duyuru onay kutusu yok ve istek gövdesi marketing göndermez", () => {
  const f = read("src", "components", "BetaDownloadForm.tsx");
  assert.doesNotMatch(f, /type="checkbox"|marketing|Marketing/);
});

test("rota: rıza alanı okunmaz, v2 (rıza) işlevi çağrılmaz, WAITLIST_CONSENT_DB yok", () => {
  const r = read("src", "app", "api", "bekleme", "route.ts");
  assert.doesNotMatch(r, /marketing|site_waitlist_join_v2|WAITLIST_CONSENT_DB|MARKETING_CONSENT_VERSION|consent_unavailable/);
  assert.match(r, /site_waitlist_join/);
});

test("istek denetimi: gövdedeki marketing:true yok sayılır, sonuçta rıza alanı yok", async () => {
  const { checkWaitlistRequest, WAITLIST_MIN_FILL_MS } = await import("../src/lib/waitlist-core.ts");
  const now = 1_800_000_000_000;
  const r = checkWaitlistRequest({ product: "areapilot", email: "a@example.com", t: now - WAITLIST_MIN_FILL_MS - 1, marketing: true }, now);
  assert.equal(r.kind, "ok");
  assert.ok(!("marketing" in r));
});

test("metinler (TR+EN): duyuru kutusu, duyuru vaadi ve olmayan çıkış bağlantısı vaadi kalmadı", () => {
  const files = [
    read("src", "lib", "areapilot-content.ts"),
    read("src", "app", "(tr)", "gizlilik", "page.tsx"),
    read("src", "app", "(en)", "en", "privacy", "page.tsx"),
  ];
  const yasak = [
    /e-postadaki bağlantıdan/i,
    /via the link in the email/i,
    /kampanya duyuru/i,
    /campaign announcement/i,
    /ayrı kutu/i,
    /separate box/i,
    /kutuyu işaretle/i,
    /tick the box/i,
    /Rızanızın tarihi/i,
  ];
  for (const text of files) for (const re of yasak) assert.doesNotMatch(text, re, String(re));
});

test("ölü bileşen Waitlist.tsx kaldırıldı ve hiçbir yerde içe aktarılmıyor", () => {
  assert.equal(fs.existsSync(path.join(root, "src", "components", "Waitlist.tsx")), false);
  const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const f of walk(path.join(root, "src")).filter((x) => /\.(tsx?|mjs)$/.test(x))) {
    assert.doesNotMatch(fs.readFileSync(f, "utf8"), /components\/Waitlist["']|from ["']\.\/Waitlist["']/, f);
  }
});

// ---- SQL: v2 artık var olan satırın (ya da yeni satırın) rızasını yazamaz ----
const sql = (n: string) => fs.readFileSync(path.join(root, "supabase", n), "utf8");
const FILES = ["2026-10-23-bekleme-listesi.sql", "2026-10-31-bekleme-onay.sql", "2026-11-11-bekleme-deneme-sayaci.sql"];
const NEW = "2026-11-12-bekleme-duyuru-kaldir.sql";

async function newDb(files: string[]) {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  `);
  for (const f of files) await db.exec(sql(f));
  return db;
}
const v2 = (db: PGlite, email: string, marketing: boolean) =>
  db.query<{ r: string }>("select public.site_waitlist_join_v2('areapilot', $1, 'tr', 'areapilot_beta', null, 'ip-1', 50, $2, 'v1') as r", [email, marketing]);

test("SQL kanıtı: eski v2 var olan satırın rızasını doğrulamasız açıyordu (test ayırt edicidir)", async () => {
  const db = await newDb(FILES);
  await v2(db, "kisi@example.com", false);
  await v2(db, "kisi@example.com", true);
  const r = await db.query<{ marketing_consent: boolean }>("select marketing_consent from public.site_waitlist where email = 'kisi@example.com'");
  assert.equal(r.rows[0].marketing_consent, true);
});

test("SQL düzeltme: yeni v2 hiçbir satırda rıza yazmaz; kayıt yine eklenir; mevcut rıza kayıtlarına dokunmaz", async () => {
  const db = await newDb(FILES);
  // Eski sürümden kalan kayıtlar: biri rızalı, biri değil.
  await v2(db, "eski-onayli@example.com", true);
  await v2(db, "kisi@example.com", false);
  const before = (await db.query("select email, marketing_consent, marketing_consent_at, marketing_consent_version, marketing_withdrawn_at from public.site_waitlist order by email")).rows;
  await db.exec(sql(NEW));
  const after0 = (await db.query("select email, marketing_consent, marketing_consent_at, marketing_consent_version, marketing_withdrawn_at from public.site_waitlist order by email")).rows;
  assert.deepEqual(after0, before, "göç mevcut rıza kayıtlarını değiştirmez ve silmez");

  // Var olan satır + kutu: rıza açılmaz.
  assert.equal((await v2(db, "kisi@example.com", true)).rows[0].r, "exists");
  // Yeni satır + kutu: satır eklenir, rıza yazılmaz.
  assert.equal((await v2(db, "yeni@example.com", true)).rows[0].r, "added");
  const rows = (await db.query<{ email: string; marketing_consent: boolean; marketing_consent_at: unknown }>("select email, marketing_consent, marketing_consent_at from public.site_waitlist")).rows;
  const by = (e: string) => rows.find((x) => x.email === e)!;
  assert.equal(by("kisi@example.com").marketing_consent, false);
  assert.equal(by("yeni@example.com").marketing_consent, false);
  assert.equal(by("yeni@example.com").marketing_consent_at, null);
  assert.equal(by("eski-onayli@example.com").marketing_consent, true, "eski rıza kaydı olduğu gibi duruyor");
});

test("SQL: hız sınırı davranışı korunur; göç tekrar çalıştırılabilir; anon çağıramaz", async () => {
  const db = await newDb([...FILES, NEW, NEW]);
  const out: string[] = [];
  for (let i = 0; i < 3; i++) {
    const r = await db.query<{ r: string }>("select public.site_waitlist_join_v2('areapilot', $1, 'tr', 's_x', null, 'ip-L', 2, false, null) as r", [`l${i}@example.com`]);
    out.push(r.rows[0].r);
  }
  assert.deepEqual(out, ["added", "added", "rate_limited"]);
  await db.exec("set role anon");
  await assert.rejects(db.query("select public.site_waitlist_join_v2('areapilot','z@example.com','tr','s_x',null,'i',5,false,null)"), /permission denied/);
  await db.exec("reset role");
});
