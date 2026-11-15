// K1 canlıya alma paketi SQL testleri (PGlite): ön denetim, son kontrol, geri alma. Çalıştırma: npm test
// Canlı sp_licenses şeması depoda yok: TABAN burada bilinen sütunlarla yeniden kurulur (play-sql.test.ts ile aynı), yani bu testler
// canlı şemanın kendisini değil, belgelenmiş taban şemasını kanıtlar. Canlı şemayı ön denetim sorgusu (Yasin) yoklar.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const sqlFile = (name: string) => fs.readFileSync(path.join(process.cwd(), "supabase", name), "utf8");
const K1 = "2026-11-14-tek-lisans-k1.sql";
const PRE = "2026-11-14-tek-lisans-k1-on-denetim.sql";
const POST = "2026-11-14-tek-lisans-k1-son-kontrol.sql";
const BACK = "2026-11-14-tek-lisans-k1-geri-al.sql";
const REVOKE = "2026-11-15-tek-lisans-k1-revoke.sql";

async function baseDb(opts: { emailNotNull?: boolean; extra?: string } = {}) {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    create table public.sp_licenses (
      id uuid primary key default gen_random_uuid(),
      license_key text not null unique,
      plan text not null check (plan in ('month','year','lifetime')),
      status text not null default 'active' check (status in ('active','past_due','paused','canceled','refunded','revoked')),
      email text, paddle_customer_id text, paddle_transaction_id text unique, paddle_subscription_id text,
      current_period_end timestamptz, max_devices int not null default 3, key_email_sent_at timestamptz,
      created_at timestamptz not null default now(), updated_at timestamptz not null default now()
    );
    create table public.sp_license_devices (
      license_id uuid not null references public.sp_licenses (id) on delete cascade,
      device_id text not null, app_version text,
      first_seen timestamptz not null default now(), last_seen timestamptz not null default now(),
      primary key (license_id, device_id)
    );
    create table public.sp_paddle_customers (paddle_customer_id text primary key, email text);
    alter table public.sp_licenses enable row level security;
    alter table public.sp_license_devices enable row level security;
  `);
  for (const f of ["2026-11-06-lisans-urun.sql", "2026-11-08-lisans-sifirlanan-kod.sql"]) await db.exec(sqlFile(f));
  if (opts.emailNotNull) await db.exec("alter table public.sp_licenses alter column email set not null");
  if (opts.extra) await db.exec(opts.extra);
  return db;
}

// Şemanın parmak izi: sütunlar (ad, null, varsayılan), tablolar, işlevler, kısıtlar, indeksler, e-posta notu.
async function snapshot(db: PGlite) {
  const q = async (s: string) => (await db.query<{ v: string }>(s)).rows.map((r) => r.v);
  return {
    cols: await q("select table_name||'.'||column_name||':'||is_nullable||':'||coalesce(column_default,'') as v from information_schema.columns where table_schema='public' order by 1"),
    tables: await q("select table_name as v from information_schema.tables where table_schema='public' order by 1"),
    funcs: await q("select p.oid::regprocedure::text as v from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' order by 1"),
    cons: await q("select conrelid::regclass::text||'.'||conname as v from pg_constraint where connamespace='public'::regnamespace order by 1"),
    idx: await q("select indexname as v from pg_indexes where schemaname='public' order by 1"),
    note: await q("select coalesce(col_description('public.sp_licenses'::regclass,(select attnum from pg_attribute where attrelid='public.sp_licenses'::regclass and attname='email')),'') as v"),
  };
}

type Row = { kontrol: string; deger: string; beklenen: string; sonuc: string };
const run = async (db: PGlite, file: string) => (await db.query<Row>(sqlFile(file))).rows;
const byName = (rows: Row[], k: string) => rows.find((r) => r.kontrol === k)!;

test("ön denetim: TEK sorgu, taban şemada SONUC = TAMAM; salt okur (veri ve şema değişmez)", async () => {
  const db = await baseDb();
  const before = await snapshot(db);
  const rows = await run(db, PRE);
  assert.equal(byName(rows, "SONUC").sonuc, "TAMAM", JSON.stringify(rows.filter((r) => r.sonuc === "DUR")));
  assert.ok(rows.length >= 15, "bütün kontroller dönüyor");
  assert.deepEqual(await snapshot(db), before);
  assert.equal(byName(rows, "K1 daha once uygulanmis mi (source sutunu)").deger, "false");
});

test("ön denetim: varsayılansız NOT NULL sütun, RLS kapalı, anon yetkisi ve eksik tablo DUR verir (her biri ayrı)", async () => {
  const cases: [string, string, string][] = [
    ["alter table public.sp_licenses add column zorunlu text not null default 'x'; alter table public.sp_licenses alter column zorunlu drop default", "varsayilansiz NOT NULL sutun (email haric)", "zorunlu"],
    ["alter table public.sp_licenses disable row level security", "RLS sp_licenses", "false"],
    ["create policy herkes_okur on public.sp_licenses for select using (true)", "sp_licenses / sp_license_devices uzerindeki RLS POLITIKA sayisi", "1"],
    ["drop table public.sp_license_resets", "tablo sp_license_resets var", "false"],
    ["alter table public.sp_licenses drop constraint sp_licenses_status_check; alter table public.sp_licenses add constraint sp_licenses_status_check check (status in ('active','canceled'))", "status CHECK izinli degerler", ""],
  ];
  for (const [ddl, kontrol, deger] of cases) {
    const db = await baseDb({ extra: ddl });
    const rows = await run(db, PRE);
    assert.equal(byName(rows, kontrol).sonuc, "DUR", kontrol);
    if (deger) assert.equal(byName(rows, kontrol).deger, deger, kontrol);
    assert.equal(byName(rows, "SONUC").sonuc, "DUR", kontrol);
  }
});

test("göç ön koşulsuz (sp_license_resets yok) BAŞTAN durur ve hiçbir şey bırakmaz", async () => {
  const db = await baseDb({ extra: "drop table public.sp_license_resets" });
  const before = await snapshot(db);
  await assert.rejects(db.exec(sqlFile(K1)), /sp_license_resets yok/);
  await db.exec("rollback"); // PGlite açık işlemi bırakır; SQL editöründe hata işlemi zaten geri alır
  assert.deepEqual(await snapshot(db), before);
});

test("son kontrol: göçten önce DUR, göçten sonra TAMAM (Play satırı yokken); tek sorgu", async () => {
  const db = await baseDb();
  // göçten önce nesneler yok: işlev/tablo bulunmadığında sorgu hata vermez, DUR döner
  assert.equal(byName(await run(db, POST), "SONUC").sonuc, "DUR");
  await db.exec(sqlFile(K1));
  const rows = await run(db, POST);
  assert.equal(byName(rows, "SONUC").sonuc, "TAMAM", JSON.stringify(rows.filter((r) => r.sonuc === "DUR")));
  assert.equal(byName(rows, "islev sayisi (5)").deger, "5");
});

test("son kontrol: yetki sızıntısı (anon işlev yetkisi) DUR verir", async () => {
  const db = await baseDb();
  await db.exec(sqlFile(K1));
  await db.exec("grant execute on function public.sp_play_expire_stale(timestamptz) to anon");
  const rows = await run(db, POST);
  assert.equal(byName(rows, "anon/authenticated yetkili islev").sonuc, "DUR");
});

for (const emailNotNull of [false, true]) {
  test(`geri alma (email NOT NULL taban: ${emailNotNull}): göç -> geri al -> şema TABANA EŞİT; yeniden uygulanır; Paddle satırı korunur`, async () => {
    const db = await baseDb({ emailNotNull });
    await db.query("insert into public.sp_licenses (license_key, plan, product, paddle_transaction_id, email, current_period_end) values ('SPD-23456-789AB-CDEFG-HJKMA','year','syncpass_desktop','txn_1','a@b.c','2027-01-01Z')");
    const base = await snapshot(db);
    await db.exec(sqlFile(K1));
    const migrated = await snapshot(db);
    assert.notDeepEqual(migrated, base, "göç gerçekten bir şey değiştirdi");
    await db.exec(sqlFile(BACK));
    assert.deepEqual(await snapshot(db), base, "geri alma sonrası şema tabanla aynı (email nullability ve not dahil)");
    assert.equal((await db.query<{ n: number }>("select count(*)::int as n from public.sp_licenses")).rows[0].n, 1);
    // geri alma iki kez de zararsız, ardından göç yeniden uygulanır
    await db.exec(sqlFile(BACK));
    await db.exec(sqlFile(K1));
    assert.deepEqual(await snapshot(db), migrated);
    assert.equal(byName(await run(db, POST), "SONUC").sonuc, "TAMAM");
  });
}

test("geri alma: Play satırı ya da jeton özeti varken DURUR ve hiçbir şeyi değiştirmez", async () => {
  const db = await baseDb();
  await db.exec(sqlFile(K1));
  await db.query("select public.sp_claim_play_license('h1','raw1',null,'premium_monthly','month',3,'play','active','2026-12-14T12:00:00Z','SUBSCRIPTION_STATE_ACTIVE','2026-11-14T12:00:00Z','SPD-23456-789AB-CDEFG-HJKMA',true)");
  const before = await snapshot(db);
  await assert.rejects(db.exec(sqlFile(BACK)), /Geri alma DURDU: 1 Play lisans satiri ve 1 jeton ozeti/);
  await db.exec("rollback"); // PGlite açık işlemi bırakır; SQL editöründe hata işlemi zaten geri alır
  assert.deepEqual(await snapshot(db), before);
  assert.equal((await db.query<{ n: number }>("select count(*)::int as n from public.sp_licenses where source='play'")).rows[0].n, 1);
});

test("geri alma: email K1 öncesi NOT NULL idi ve boş e-postalı satır var -> DURUR, hiçbir şey değişmez", async () => {
  const db = await baseDb({ emailNotNull: true });
  await db.exec(sqlFile(K1));
  await db.query("insert into public.sp_licenses (license_key, plan, product, email) values ('SPD-23456-789AB-CDEFG-HJKMB','year','syncpass_desktop', null)");
  const before = await snapshot(db);
  await assert.rejects(db.exec(sqlFile(BACK)), /bos e-postali satir var/);
  await db.exec("rollback"); // PGlite açık işlemi bırakır; SQL editöründe hata işlemi zaten geri alır
  assert.deepEqual(await snapshot(db), before);
});

// ---- S8: ön denetim sp_license_devices RLS satırı ve son kontrol sp_play_tokens yetki satırı gerçekten DUR verir ----
test("S8: ön denetim sp_license_devices RLS kapalıyken DUR verir", async () => {
  const db = await baseDb({ extra: "alter table public.sp_license_devices disable row level security" });
  const rows = await run(db, PRE);
  assert.equal(byName(rows, "RLS sp_license_devices").sonuc, "DUR");
  assert.equal(byName(rows, "RLS sp_licenses").sonuc, "TAMAM", "yalnız o satır");
});

test("S8: son kontrol sp_play_tokens anon yetkisi sızarsa DUR verir (yalnız o satır)", async () => {
  const db = await baseDb();
  await db.exec(sqlFile(K1));
  await db.exec("grant select on table public.sp_play_tokens to anon");
  const rows = await run(db, POST);
  assert.equal(byName(rows, "anon/authenticated sp_play_tokens yetkisi").sonuc, "DUR");
  assert.equal(byName(rows, "anon/authenticated yetkili islev").sonuc, "TAMAM");
});

// ---- Ş-B: revoke dosyası ----
async function revokeParts() {
  const full = sqlFile(REVOKE);
  const i = full.indexOf("-- Doğrulama (salt okur");
  return { apply: full.slice(0, i), check: full.slice(i) };
}

test("Ş-B: revoke öncesi anon/authenticated TÜM yetkili (varsayılan), sonrası 0; service_role etkilenmez; iki kez uygulanır; doğrulama SONUC TAMAM", async () => {
  const db = await baseDb({ extra: "create table public.sp_paddle_events (id text primary key)" });
  await db.exec(sqlFile(K1));
  const { apply, check } = await revokeParts();
  const priv = async (role: string, p: string) =>
    (await db.query<{ ok: boolean }>(`select has_table_privilege('${role}','public.sp_licenses','${p}') as ok`)).rows[0].ok;
  for (const role of ["anon", "authenticated"]) for (const p of ["select", "insert", "update", "delete", "truncate"]) assert.equal(await priv(role, p), true, `öncesi ${role} ${p}`);
  assert.equal(byName((await db.query<Row>(check)).rows, "SONUC").sonuc, "DUR", "revoke öncesi doğrulama DUR");
  await db.exec(apply);
  await db.exec(apply);
  for (const role of ["anon", "authenticated"]) for (const p of ["select", "insert", "update", "delete", "truncate"]) assert.equal(await priv(role, p), false, `sonrası ${role} ${p}`);
  const rows = (await db.query<Row>(check)).rows;
  assert.equal(byName(rows, "SONUC").sonuc, "TAMAM", JSON.stringify(rows));
  assert.equal(byName(rows, "bakilan tablo sayisi").deger, "4");
  // site yolu (service_role) çalışmaya devam eder: select + insert + K1 işlevi (canlıda service_role bypassrls)
  await db.exec("alter role service_role bypassrls");
  await db.exec("set role service_role");
  await db.query("select count(*) from public.sp_licenses");
  const c = await db.query<{ r: { result: string } }>("select public.sp_claim_play_license('hx','rawx',null,'premium_monthly','month',3,'play','active','2026-12-14T12:00:00Z','SUBSCRIPTION_STATE_ACTIVE','2026-11-14T12:00:00Z','SPD-23456-789AB-CDEFG-HJKMC',true) as r");
  assert.equal(c.rows[0].r.result, "ok");
  await db.exec("reset role; set role anon");
  await assert.rejects(db.query("select * from public.sp_licenses"), /permission denied/);
  await db.exec("reset role");
});

test("Ş-B: sp_paddle_events yoksa dosya hata vermez (3 tablo); K1 son kontrolü revoke'dan bağımsız TAMAM", async () => {
  const db = await baseDb();
  await db.exec(sqlFile(K1));
  assert.equal(byName(await run(db, POST), "SONUC").sonuc, "TAMAM", "revoke olmadan da K1 son kontrol TAMAM (sırayı kilitlemez)");
  const { apply, check } = await revokeParts();
  await db.exec(apply);
  const rows = (await db.query<Row>(check)).rows;
  assert.equal(byName(rows, "SONUC").sonuc, "TAMAM");
  assert.equal(byName(rows, "bakilan tablo sayisi").deger, "3");
});

test("Ş-B: doğrulama sızıntıyı yakalar (revoke sonrası anon'a tek yetki geri verilince DUR)", async () => {
  const db = await baseDb();
  await db.exec(sqlFile(K1));
  const { apply, check } = await revokeParts();
  await db.exec(apply);
  await db.exec("grant truncate on table public.sp_license_devices to authenticated");
  assert.equal(byName((await db.query<Row>(check)).rows, "SONUC").sonuc, "DUR");
});
