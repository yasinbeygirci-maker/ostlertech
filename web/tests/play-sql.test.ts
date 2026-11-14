// 2026-11-14-tek-lisans-k1.sql davranış testleri, gerçek PostgreSQL (PGlite) üzerinde. Çalıştırma: npm test
// Burak Ş7 (eşzamanlı claim), Ş10 (zincir, iki satır), Ş11 (RLS/yetki, göç iki kez), Ş18 (saklama silmesi Play satırını ve jeton özetini siler).
// Canlıda var olan ama depoda CREATE'i bulunmayan tablolar (sp_licenses, sp_license_devices, sp_paddle_customers) bu testte BİLİNEN sütunlarla kurulur.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const sqlFile = (name: string) => fs.readFileSync(path.join(process.cwd(), "supabase", name), "utf8");
const K1 = "2026-11-14-tek-lisans-k1.sql";

// Supabase'in varsayılanlarını taklit eder: roller + yeni nesnelere anon/authenticated yetkisi (asıl koruma RLS + açık revoke).
async function newDb(opts: { retention?: boolean } = {}) {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;

    -- Canlıdaki mevcut tablolar (depoda CREATE'leri yok): bilinen sütunlarla.
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
  if (opts.retention) for (const f of ["2026-11-07-lisans-saklama-silme.sql", "2026-11-10-sp-saklama-silme-syncpass.sql"]) await db.exec(sqlFile(f));
  await db.exec(sqlFile(K1));
  return db;
}

const NOW = "2026-11-14T12:00:00Z";
const th = (n: string) => `hash-${n}`;
const KEY = (n: number) => `SPD-23456-789AB-CDEFG-HJKM${"ABCDEFGHJKMNPQRSTVWXYZ"[n]}`;

interface ClaimOpts {
  token?: string; linked?: string | null; product?: string; plan?: string; status?: string; periodEnd?: string | null;
  source?: string; key?: string; allowCreate?: boolean; now?: string;
}
async function claim(db: PGlite, o: ClaimOpts = {}) {
  const t = o.token ?? "A";
  const r = await db.query<{ r: Record<string, unknown> }>(
    "select public.sp_claim_play_license($1,$2,$3,$4,$5,3,$6,$7,$8,'SUBSCRIPTION_STATE_ACTIVE',$9,$10,$11) as r",
    [th(t), `raw-${t}`, o.linked ? th(o.linked) : null, o.product ?? "premium_monthly", o.plan ?? "month", o.source ?? "play", o.status ?? "active",
      o.periodEnd === undefined ? "2026-12-14T12:00:00Z" : o.periodEnd, o.now ?? NOW, o.key ?? KEY(0), o.allowCreate ?? true],
  );
  return r.rows[0].r as { result: string; license?: Record<string, unknown>; created?: boolean; chained?: boolean; merged?: boolean; superseded?: boolean };
}
const count = async (db: PGlite, table = "sp_licenses") => Number((await db.query<{ n: string }>(`select count(*) as n from public.${table}`)).rows[0].n);
async function addDevice(db: PGlite, licenseId: string, dev = "d1") {
  await db.query("insert into public.sp_license_devices (license_id, device_id) values ($1,$2)", [licenseId, dev]);
}

test("Ş11: göç İKİ KEZ uygulanır (idempotent) ve mevcut Paddle satırı değişmeden kalır", async () => {
  const db = await newDb();
  await db.query("insert into public.sp_licenses (license_key, plan, product, paddle_transaction_id, paddle_subscription_id, current_period_end) values ($1,'year','syncpass_desktop','txn_1','sub_1','2027-01-01Z')", [KEY(5)]);
  await db.exec(sqlFile(K1));
  await db.exec(sqlFile(K1));
  const r = await db.query<{ source: string; play_token_hash: string | null; status: string }>("select source, play_token_hash, status from public.sp_licenses");
  assert.deepEqual(r.rows, [{ source: "paddle", play_token_hash: null, status: "active" }]);
});

test("Ş11: yeni tablo ve işlevler anon/authenticated'a KAPALI (Supabase varsayılan yetkileriyle)", async () => {
  const db = await newDb();
  for (const role of ["anon", "authenticated"]) {
    for (const fn of [
      "sp_claim_play_license(text,text,text,text,text,int,text,text,timestamptz,text,timestamptz,text,boolean)",
      "sp_play_mark_voided(text,timestamptz)",
      "sp_rotate_play_license(uuid,text,timestamptz)",
      "sp_play_license_json(uuid)",
      "sp_play_expire_stale(timestamptz)",
    ]) {
      const r = await db.query<{ ok: boolean }>(`select has_function_privilege('${role}', 'public.${fn}', 'execute') as ok`);
      assert.equal(r.rows[0].ok, false, `${role} ${fn}`);
    }
    assert.equal((await db.query<{ ok: boolean }>(`select has_table_privilege('${role}','public.sp_play_tokens','select') as ok`)).rows[0].ok, false, `${role} sp_play_tokens`);
    assert.equal((await db.query<{ ok: boolean }>(`select has_table_privilege('${role}','public.sp_play_tokens','insert') as ok`)).rows[0].ok, false);
  }
  assert.equal((await db.query<{ ok: boolean }>("select has_function_privilege('service_role','public.sp_play_mark_voided(text,timestamptz)','execute') as ok")).rows[0].ok, true);
  assert.equal((await db.query<{ s: boolean }>("select relrowsecurity as s from pg_class where relname='sp_play_tokens'")).rows[0].s, true);
  // gerçek rol değişimiyle de dene
  await db.exec("set role anon");
  await assert.rejects(db.query("select * from public.sp_play_tokens"), /permission denied/);
  await assert.rejects(db.query(`select public.sp_claim_play_license('h','t',null,'premium_monthly','month',3,'play','active',null,'x',now(),'K',true)`), /permission denied/);
  await db.exec("reset role; set role authenticated");
  await assert.rejects(db.query("select public.sp_play_mark_voided('h', now())"), /permission denied/);
  await db.exec("reset role");
});

test("tutarlılık: Paddle satırında Play alanı ve Play satırında Paddle numarası YASAK; geçersiz kaynak/ürün reddedilir", async () => {
  const db = await newDb();
  await assert.rejects(db.query("insert into public.sp_licenses (license_key, plan, product, play_token_hash) values ($1,'year','syncpass_desktop','h')", [KEY(1)]), /play_consistency/);
  await assert.rejects(db.query("insert into public.sp_licenses (license_key, plan, product, source, paddle_transaction_id) values ($1,'year','syncpass_desktop','play','txn')", [KEY(1)]), /play_consistency/);
  await assert.rejects(db.query("insert into public.sp_licenses (license_key, plan, product, source) values ($1,'year','syncpass_desktop','baska')", [KEY(1)]), /source_check/);
  await assert.rejects(db.query("insert into public.sp_licenses (license_key, plan, product, source, play_product_id) values ($1,'year','syncpass_desktop','play','premium_2years')", [KEY(1)]), /play_product_check/);
});

test("Ş7: yeni jeton -> 1 satır + jeton özeti; aynı jetonla ikinci claim aynı satır ve aynı kod", async () => {
  const db = await newDb();
  const a = await claim(db);
  assert.equal(a.result, "ok");
  assert.equal(a.created, true);
  assert.equal(a.license?.license_key, KEY(0));
  assert.equal(a.license?.source, "play");
  assert.equal(a.license?.max_devices, 3);
  assert.ok(!("play_purchase_token" in (a.license ?? {})), "okuma JSON'ında ham jeton yok");
  const b = await claim(db, { key: KEY(1) });
  assert.equal(b.created, false);
  assert.equal(b.license?.license_key, KEY(0), "ikinci istek yeni kod üretmedi");
  assert.equal(await count(db), 1);
  assert.equal(await count(db, "sp_play_tokens"), 1);
  // ham jeton yalnız sp_licenses.play_purchase_token'da; sp_play_tokens'ta yalnız özet
  const cols = await db.query<{ column_name: string }>("select column_name from information_schema.columns where table_name='sp_play_tokens' order by 1");
  assert.deepEqual(cols.rows.map((r) => r.column_name), ["first_seen", "license_id", "superseded_at", "token_hash"]);
});

test("Ş7: aynı jetonla EŞZAMANLI 10 claim -> 1 satır, 10 yanıtta aynı kod", async () => {
  const db = await newDb();
  const rs = await Promise.all(Array.from({ length: 10 }, (_, i) => claim(db, { key: KEY(i) })));
  assert.equal(await count(db), 1);
  assert.equal(await count(db, "sp_play_tokens"), 1);
  assert.equal(new Set(rs.map((r) => r.license?.license_key)).size, 1);
  assert.equal(rs.filter((r) => r.created).length, 1);
});

test("hak vermeyen ilk claim satır açmaz (allow_create=false -> none); mevcut satır yine güncellenir", async () => {
  const db = await newDb();
  assert.equal((await claim(db, { allowCreate: false, status: "canceled" })).result, "none");
  assert.equal(await count(db), 0);
  await claim(db);
  const up = await claim(db, { allowCreate: false, status: "canceled", periodEnd: "2026-11-15T00:00:00Z" });
  assert.equal(up.result, "ok");
  assert.equal(up.license?.status, "canceled");
});

test("Ş10: zincir (ay -> yıl): AYNI satır, kod ve cihazlar aynı, plan/ürün yeni, eski jeton superseded; eski jetonla claim aynı kodu verir ve durumu DEĞİŞTİRMEZ", async () => {
  const db = await newDb();
  const first = await claim(db, { token: "OLD" });
  await addDevice(db, String(first.license!.id));
  const up = await claim(db, { token: "NEW", linked: "OLD", product: "premium_yearly", plan: "year", periodEnd: "2027-11-14T12:00:00Z", key: KEY(2) });
  assert.equal(up.chained, true);
  assert.equal(up.license?.id, first.license?.id);
  assert.equal(up.license?.license_key, KEY(0), "kod değişmedi");
  assert.equal(up.license?.plan, "year");
  assert.equal(up.license?.play_product_id, "premium_yearly");
  assert.equal(await count(db), 1);
  assert.equal(await count(db, "sp_license_devices"), 1, "cihazlar aynı kaldı");
  const toks = await db.query<{ token_hash: string; superseded_at: string | null }>("select token_hash, superseded_at from public.sp_play_tokens order by token_hash");
  assert.equal(toks.rows.find((t) => t.token_hash === th("OLD"))!.superseded_at !== null, true);
  assert.equal(toks.rows.find((t) => t.token_hash === th("NEW"))!.superseded_at, null);
  // etkin jeton satırda
  const row = await db.query<{ play_token_hash: string; play_purchase_token: string }>("select play_token_hash, play_purchase_token from public.sp_licenses");
  assert.deepEqual(row.rows[0], { play_token_hash: th("NEW"), play_purchase_token: "raw-NEW" });
  // eski jetonla claim: aynı kod, durum yerinde (eski jetonun "expired" bilgisi yeni aboneliği bozmaz)
  const old = await claim(db, { token: "OLD", status: "canceled", plan: "month", periodEnd: "2020-01-01T00:00:00Z" });
  assert.equal(old.superseded, true);
  assert.equal(old.license?.license_key, KEY(0));
  assert.equal(old.license?.status, "active");
  assert.equal(old.license?.plan, "year");
  // üçüncü halka (expiredPurchaseToken ile yeniden abonelik)
  const third = await claim(db, { token: "THIRD", linked: "NEW", product: "premium_yearly", plan: "year", key: KEY(3) });
  assert.equal(third.chained, true);
  assert.equal(third.license?.license_key, KEY(0));
  assert.equal(await count(db), 1);
});

test("Ş10: iki satır çakışması: kullanıcının elindeki ESKİ satır korunur, cihazsız yeni satır revoked olur ve jetonu eskiye taşınır", async () => {
  const db = await newDb();
  const a = await claim(db, { token: "OLD", key: KEY(0) });
  const b = await claim(db, { token: "NEW", key: KEY(1) }); // bağlantı işlenmeden ayrı claim edilmişti
  assert.notEqual(a.license?.id, b.license?.id);
  assert.equal(await count(db), 2);
  const m = await claim(db, { token: "NEW", linked: "OLD", product: "premium_yearly", plan: "year", key: KEY(2) });
  assert.equal(m.merged, true);
  assert.equal(m.license?.license_key, KEY(0), "eski satırın kodu korundu");
  assert.equal(m.license?.plan, "year");
  const rows = await db.query<{ id: string; status: string; play_token_hash: string | null }>("select id, status, play_token_hash from public.sp_licenses");
  const loser = rows.rows.find((r) => r.id === b.license?.id)!;
  assert.equal(loser.status, "revoked");
  assert.equal(loser.play_token_hash, null);
  const winner = rows.rows.find((r) => r.id === a.license?.id)!;
  assert.equal(winner.play_token_hash, th("NEW"));
  // jetonlar: NEW artık kazanan satırda ve etkin, OLD superseded
  const toks = await db.query<{ token_hash: string; license_id: string; superseded_at: string | null }>("select * from public.sp_play_tokens");
  assert.equal(toks.rows.find((t) => t.token_hash === th("NEW"))!.license_id, a.license?.id);
  assert.notEqual(toks.rows.find((t) => t.token_hash === th("OLD"))!.superseded_at, null);
});

test("Ş10: iki satırdan YENİSİNİN cihazı varsa otomatik birleştirme YOK (manual), hiçbir şey değişmez", async () => {
  const db = await newDb();
  const a = await claim(db, { token: "OLD", key: KEY(0) });
  const b = await claim(db, { token: "NEW", key: KEY(1) });
  await addDevice(db, String(b.license!.id));
  const m = await claim(db, { token: "NEW", linked: "OLD", key: KEY(2) });
  assert.equal(m.result, "manual");
  assert.equal(m.license?.id, b.license?.id);
  const rows = await db.query<{ status: string }>("select status from public.sp_licenses");
  assert.deepEqual(rows.rows.map((r) => r.status), ["active", "active"]);
  assert.equal(a.license?.status, "active");
});

test("iade bitiş durumudur: refunded satır, aynı jetonla gelen 'active' claim ile yeniden açılmaz; yeni satın alma (zincir) açar", async () => {
  const db = await newDb();
  await claim(db, { token: "A" });
  assert.equal((await db.query<{ r: string }>("select public.sp_play_mark_voided($1,$2) as r", [th("A"), NOW])).rows[0].r, "marked");
  const again = await claim(db, { token: "A", status: "active" });
  assert.equal(again.license?.status, "refunded");
  // kullanıcı yeniden satın aldı (yeni jeton, eskiye bağlı): yeni geçerli satın alma lisansı açar
  const re = await claim(db, { token: "B", linked: "A" });
  assert.equal(re.chained, true);
  assert.equal(re.license?.status, "active");
});

test("Ş9: iptal listesi eşlemesi: etkin jeton marked, eski jeton superseded (dokunmaz), bilinmeyen unknown, ikinci kez already", async () => {
  const db = await newDb();
  await claim(db, { token: "OLD" });
  await claim(db, { token: "NEW", linked: "OLD", key: KEY(1) });
  const mark = async (t: string) => (await db.query<{ r: string }>("select public.sp_play_mark_voided($1,$2) as r", [th(t), NOW])).rows[0].r;
  assert.equal(await mark("OLD"), "superseded");
  assert.equal((await db.query<{ s: string }>("select status as s from public.sp_licenses")).rows[0].s, "active");
  assert.equal(await mark("YOK"), "unknown");
  assert.equal(await mark("NEW"), "marked");
  assert.equal(await mark("NEW"), "already");
  assert.equal((await db.query<{ s: string }>("select status as s from public.sp_licenses")).rows[0].s, "refunded");
});

test("süre bitimi: bitiş + 7 gün geçmiş Play satırı canceled olur; Paddle ve ömür boyu satır dokunulmaz", async () => {
  const db = await newDb();
  await claim(db, { token: "EXP", periodEnd: "2026-11-01T00:00:00Z", key: KEY(0) }); // 13 gün önce bitti
  await claim(db, { token: "GRACE", periodEnd: "2026-11-10T00:00:00Z", key: KEY(1) }); // 4 gün önce: pay içinde
  await claim(db, { token: "LIFE", product: "premium_lifetime", plan: "lifetime", periodEnd: null, key: KEY(2) });
  await db.query("insert into public.sp_licenses (license_key, plan, product, paddle_transaction_id, current_period_end) values ($1,'year','syncpass_desktop','t','2020-01-01Z')", [KEY(3)]);
  const n = (await db.query<{ n: number }>("select public.sp_play_expire_stale($1) as n", [NOW])).rows[0].n;
  assert.equal(n, 1);
  const rows = await db.query<{ license_key: string; status: string }>("select license_key, status from public.sp_licenses order by license_key");
  assert.deepEqual(rows.rows.map((r) => r.status), ["canceled", "active", "active", "active"]);
});

test("K1 destek yolu: kod yenileme eskisini özetle kaydeder, cihazları siler, sıfırlamayı sayar; Paddle satırında reddedilir", async () => {
  const db = await newDb();
  const a = await claim(db);
  await addDevice(db, String(a.license!.id), "d1");
  await addDevice(db, String(a.license!.id), "d2");
  await db.query("select public.sp_rotate_play_license($1,$2,$3)", [a.license!.id, KEY(9), NOW]);
  const row = await db.query<{ license_key: string }>("select license_key from public.sp_licenses");
  assert.equal(row.rows[0].license_key, KEY(9));
  assert.equal(await count(db, "sp_license_devices"), 0);
  assert.equal(await count(db, "sp_license_resets"), 1);
  const retired = await db.query<{ h: string }>("select retired_key_hash as h from public.sp_license_retired_keys");
  assert.equal(retired.rows.length, 1);
  assert.match(retired.rows[0].h, /^[0-9a-f]{64}$/);
  assert.ok(!JSON.stringify(retired.rows).includes(KEY(0)), "eski kod düz yazılmadı");
  const p = await db.query<{ id: string }>("insert into public.sp_licenses (license_key, plan, product, paddle_transaction_id) values ($1,'year','syncpass_desktop','tp') returning id", [KEY(8)]);
  await assert.rejects(db.query("select public.sp_rotate_play_license($1,$2,$3)", [p.rows[0].id, KEY(7), NOW]), /not_a_play_license/);
});

test("Ş18: saklama silmesi: bitiş + 1 yıl geçmiş Play satırı, cihazları ve jeton özetleri silinir; taze/aktif Play satırı kalır", async () => {
  const db = await newDb({ retention: true });
  const old = await claim(db, { token: "OLDLIC", key: KEY(0) });
  await claim(db, { token: "OLDLIC2", linked: "OLDLIC", key: KEY(4) }); // zincir: iki jeton tek lisans
  await addDevice(db, String(old.license!.id));
  const live = await claim(db, { token: "LIVE", key: KEY(1) });
  const fresh = await claim(db, { token: "FRESH", key: KEY(2) });
  // eski lisans iade oldu ve bitiş anı 400 gün önce (ended_at tetikleyiciyle yazıldı; test geçmişe çeker)
  await db.query("select public.sp_play_mark_voided($1,$2)", [th("OLDLIC2"), NOW]);
  await db.query("update public.sp_licenses set ended_at = now() - interval '400 days', current_period_end = now() - interval '400 days' where id = $1", [old.license!.id]);
  // 100 gün önce biten başka bir satır kalmalı
  await db.query("select public.sp_play_mark_voided($1,$2)", [th("FRESH"), NOW]);
  await db.query("update public.sp_licenses set ended_at = now() - interval '100 days', current_period_end = now() - interval '100 days' where id = $1", [fresh.license!.id]);

  const dry = (await db.query<{ r: { licenses: number; dry_run: boolean } }>("select public.sp_purge_ended_licenses_syncpass(now(), true) as r")).rows[0].r;
  assert.equal(dry.dry_run, true);
  assert.equal(dry.licenses, 1);
  assert.equal(await count(db), 3, "dry-run silmedi");
  const res = (await db.query<{ r: { licenses: number; devices: number } }>("select public.sp_purge_ended_licenses_syncpass(now(), false) as r")).rows[0].r;
  assert.equal(res.licenses, 1);
  assert.equal(res.devices, 1);
  const left = await db.query<{ id: string }>("select id from public.sp_licenses");
  assert.deepEqual(left.rows.map((r) => r.id).sort(), [String(live.license!.id), String(fresh.license!.id)].sort());
  assert.equal(await count(db, "sp_license_devices"), 0);
  const toks = await db.query<{ token_hash: string }>("select token_hash from public.sp_play_tokens order by 1");
  assert.deepEqual(toks.rows.map((t) => t.token_hash), [th("FRESH"), th("LIVE")], "silinen lisansın İKİ jeton özeti de gitti");
  assert.equal(await count(db, "sp_purge_log"), 1);
});
