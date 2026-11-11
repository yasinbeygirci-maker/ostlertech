// Bekleme listesi ve AnyDoc SQL'inin gerçek PostgreSQL (PGlite) üzerinde davranış testleri. Çalıştırma: npm test
// Burak B1 (hız sınırı denemeleri saymalı, hedefin listede olup olmadığını sızdırmamalı) ve B3/B4 (AnyDoc anon erişimi).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const sqlFile = (name: string) => fs.readFileSync(path.join(process.cwd(), "supabase", name), "utf8");

// Supabase'in varsayılanlarını taklit eder: roller + public şemasındaki yeni nesnelere anon/authenticated yetkisi.
async function newDb(files: string[]) {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  `);
  for (const f of files) await db.exec(sqlFile(f));
  return db;
}

const BASE = ["2026-10-23-bekleme-listesi.sql", "2026-10-31-bekleme-onay.sql"];
const FIXED = [...BASE, "2026-11-11-bekleme-deneme-sayaci.sql"];

async function join(db: PGlite, email: string, ip = "iphash-1", limit = 5, marketing = false): Promise<string> {
  const r = await db.query<{ r: string }>(
    "select public.site_waitlist_join_v2('areapilot', $1, 'tr', 'areapilot_beta', null, $2, $3, $4, 'v1') as r",
    [email, ip, limit, marketing],
  );
  return r.rows[0].r;
}
// Rotanın dışarıya gösterdiği tek ayrım: rate_limited -> 429, aksi 200 (aynı gövde).
const observable = (result: string) => (result === "rate_limited" ? 429 : 200);

// Senaryo (Burak B1 sondası): 4 yeni adres, ardından HEDEF, ardından 1 yeni adres; sınır 5.
async function scenario(db: PGlite, targetListed: boolean): Promise<number[]> {
  if (targetListed) await join(db, "hedef@example.com", "baska-ip"); // hedef önceden başka IP'den kayıtlı
  const seen: number[] = [];
  for (let i = 1; i <= 4; i++) seen.push(observable(await join(db, `yeni${i}@example.com`)));
  seen.push(observable(await join(db, "hedef@example.com")));
  seen.push(observable(await join(db, "son@example.com")));
  return seen;
}

test("B1 sızıntı gerçek (kanıt): eski sayaçla iki senaryo AYRIŞIR; test bu yüzden ayırt edicidir", async () => {
  const a = await scenario(await newDb(BASE), true);
  const b = await scenario(await newDb(BASE), false);
  assert.notDeepEqual(a, b, "eski sürümde hedef listedeyken/değilken gözlemlenen çıktı farklıydı");
  assert.equal(a.at(-1), 200);
  assert.equal(b.at(-1), 429);
});

test("B1 düzeltme: hedef listedeyken ve değilken gözlemlenen çıktı AYNI", async () => {
  const a = await scenario(await newDb(FIXED), true);
  const b = await scenario(await newDb(FIXED), false);
  assert.deepEqual(a, b);
  assert.deepEqual(a, [200, 200, 200, 200, 200, 429], "5 deneme geçer, 6. deneme (hedefin kendisi dahil sayılır) sınıra takılır");
});

test("B1: aynı (var olan) adresi tekrar tekrar göndermek de sayaca girer", async () => {
  const db = await newDb(FIXED);
  const out: number[] = [];
  for (let i = 0; i < 7; i++) out.push(observable(await join(db, "ayni@example.com")));
  assert.deepEqual(out, [200, 200, 200, 200, 200, 429, 429]);
});

test("B1: sınır tam sınırda (limit kadar deneme geçer); v1 işlevi de aynı davranır", async () => {
  const db = await newDb(FIXED);
  const out: string[] = [];
  for (let i = 0; i < 4; i++) {
    const r = await db.query<{ r: string }>(
      "select public.site_waitlist_join('areapilot', $1, 'tr', 'areapilot_beta', null, 'iphash-v1', 3) as r", [`v1-${i}@example.com`]);
    out.push(r.rows[0].r);
  }
  assert.deepEqual(out, ["added", "added", "added", "rate_limited"]);
});

test("B1: farklı IP özeti ayrı sayılır; ip_hash boşsa sınır uygulanmaz ama deneme yazılmaz", async () => {
  const db = await newDb(FIXED);
  for (let i = 0; i < 6; i++) await join(db, `a${i}@example.com`, "ip-A");
  assert.equal(await join(db, "b0@example.com", "ip-B"), "added");
  const n0 = (await db.query<{ n: number }>("select count(*)::int as n from public.site_waitlist_attempts")).rows[0].n;
  for (let i = 0; i < 3; i++) {
    const r = await db.query<{ r: string }>("select public.site_waitlist_join('areapilot', $1, 'tr', 's_x', null, null, 1) as r", [`nohash${i}@example.com`]);
    assert.equal(r.rows[0].r, "added");
  }
  const n1 = (await db.query<{ n: number }>("select count(*)::int as n from public.site_waitlist_attempts")).rows[0].n;
  assert.equal(n1, n0, "IP özeti yoksa deneme satırı yazılmaz");
});

test("gizlilik: site_waitlist satırlarına ip_hash yazılmaz; 1 günden eski deneme satırları silinir", async () => {
  const db = await newDb(FIXED);
  await join(db, "x@example.com", "ip-X");
  const rows = (await db.query<{ ip_hash: string | null }>("select ip_hash from public.site_waitlist")).rows;
  assert.ok(rows.every((r) => r.ip_hash === null), "kayıt satırında IP özeti yok");
  await db.exec("update public.site_waitlist_attempts set at = now() - interval '2 days'");
  await join(db, "y@example.com", "ip-Y");
  const n = (await db.query<{ n: number }>("select count(*)::int as n from public.site_waitlist_attempts where ip_hash = 'ip-X'")).rows[0].n;
  assert.equal(n, 0, "1 günden eski deneme silindi");
});

test("duyuru onayı davranışı DEĞİŞMEDİ (B2 hukuk kararı bekliyor): v2 hâlâ onay kaydediyor", async () => {
  const db = await newDb(FIXED);
  assert.equal(await join(db, "onay@example.com", "ip-1", 5, true), "added");
  const r = await db.query<{ marketing_consent: boolean }>("select marketing_consent from public.site_waitlist where email = 'onay@example.com'");
  assert.equal(r.rows[0].marketing_consent, true);
});

test("deneme tablosu ve sınır işlevi anon/authenticated'a kapalı", async () => {
  const db = await newDb(FIXED);
  await join(db, "k@example.com", "ip-K");
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(db.query("select count(*) from public.site_waitlist_attempts"), /permission denied/);
    await assert.rejects(db.query("select public.site_waitlist_rate_limited('x', 1)"), /permission denied/);
    await db.exec("reset role");
  }
});

// ---- AnyDoc (B3/B4) ----
const ANYDOC_BASE = ["anydoc-waitlist.sql", "anydoc-kontenjan.sql"];
const ANYDOC_FIXED = [...ANYDOC_BASE, "2026-11-11-anydoc-guvenli.sql"];

async function anonCan(db: PGlite, sql: string): Promise<boolean> {
  await db.exec("set role anon");
  try {
    await db.query(sql);
    return true;
  } catch {
    return false;
  } finally {
    await db.exec("reset role");
  }
}

test("B3/B4 kanıt: eski AnyDoc SQL'inde anon üyeliği sorabiliyor ve sahte kayıt ekleyebiliyor", async () => {
  const db = await newDb(ANYDOC_BASE);
  await db.exec("insert into public.anydoc_waitlist (email) values ('gercek@example.com')");
  assert.equal(await anonCan(db, "select public.anydoc_sira_numarasi('gercek@example.com')"), true);
  assert.equal(await anonCan(db, "insert into public.anydoc_waitlist (email) values ('sahte1@example.com')"), true);
  assert.equal(await anonCan(db, "select * from public.anydoc_waitlist_sayac"), true);
});

test("B3/B4 düzeltme: güvenli sürümde anon için hiçbir AnyDoc erişimi yok; veri yerinde", async () => {
  const db = await newDb(ANYDOC_FIXED);
  await db.exec("insert into public.anydoc_waitlist (email) values ('gercek@example.com')");
  for (const q of [
    "select public.anydoc_sira_numarasi('gercek@example.com')",
    "select public.anydoc_kalan_kontenjan()",
    "insert into public.anydoc_waitlist (email) values ('sahte2@example.com')",
    "select * from public.anydoc_waitlist",
    "select * from public.anydoc_waitlist_sayac",
  ]) assert.equal(await anonCan(db, q), false, q);
  for (const q of ["select public.anydoc_sira_numarasi('gercek@example.com')", "select * from public.anydoc_waitlist"]) {
    await db.exec("set role authenticated");
    await assert.rejects(db.query(q), /permission denied/);
    await db.exec("reset role");
  }
  assert.equal((await db.query<{ n: number }>("select count(*)::int as n from public.anydoc_waitlist")).rows[0].n, 1, "kayıt silinmedi");
});

test("AnyDoc güvenli sürüm tekrar çalıştırılabilir (idempotent)", async () => {
  const db = await newDb([...ANYDOC_FIXED, "2026-11-11-anydoc-guvenli.sql"]);
  assert.equal(await anonCan(db, "select public.anydoc_sira_numarasi('x@example.com')"), false);
});
