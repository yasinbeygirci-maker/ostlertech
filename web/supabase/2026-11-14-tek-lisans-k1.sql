-- SyncPass "tek lisans, 3 cihaz" K1: Play satın almasını AYNI sp_licenses satırına bağlayan göç (Play jetonu -> SPD kodu).
-- Burak ön kapısı (guvenlik/bulgular/2026-11-14-syncpass-tek-lisans-sunucu-on-kapi.md) §6, Ş7, Ş11, Ş18.
--
-- UYGULANMADI. Yasin onayıyla Supabase SQL editöründe çalıştırılır (Can canlı veritabanına uygulamaz). Tek işlemdir (begin...commit): bir adım
-- ya da ön denetim hata verirse HİÇBİR değişiklik kalmaz. Tekrar çalıştırılabilir (idempotent). PGlite'ta (tests/play-sql.test.ts) Supabase
-- varsayılan yetkileriyle, iki kez uygulanarak sınandı; GERÇEK Supabase'te sınanmadı (aşağıdaki canlı ön denetim ilk elle yapılır).
--
-- ÖN KOŞUL: 2026-11-06-lisans-urun.sql (sp_license_devices, sp_license_resets, atomik işlevler) ve 2026-11-08-lisans-sifirlanan-kod.sql
--   (sp_license_retired_keys) uygulanmış olmalı.
-- SIRA KURALI (önemli): BU DOSYA KODDAN ÖNCE uygulanır. Yeni kod sp_licenses.source / play_* sütunlarını ve aşağıdaki işlevleri SELECT eder; sütun
--   yokken dağıtılırsa SyncPass Paddle dahil BÜTÜN activate/renew istekleri 500 server_error döner (42703). Sütunlar varsayılanlıdır: mevcut
--   satırlar otomatik source='paddle' olur, Paddle webhook'u değişmeden çalışmaya devam eder.
--
-- CANLI ÖN DENETİM (salt okur, bu dosyayı çalıştırmadan önce; çıktıları Burak'a): Burak §6/8
--   select relname, relrowsecurity from pg_class where relname in ('sp_licenses','sp_license_devices');   -- ikisi de true olmalı
--   select has_table_privilege('anon','public.sp_licenses','select'), has_table_privilege('authenticated','public.sp_licenses','select');  -- false, false
--   select conname, confdeltype from pg_constraint where conrelid = 'public.sp_license_devices'::regclass and contype = 'f';  -- 'c' = cascade
--   select column_name, is_nullable, column_default, is_identity from information_schema.columns where table_schema='public' and table_name='sp_licenses' order by 1;
--     -- D6: email disinda varsayilansiz NOT NULL sutun cikarsa DUR (gocun 0. adimi da bunu kendisi denetler ve hata verir).
--   select exists(select 1 from information_schema.columns where table_name='sp_licenses' and column_name='ended_at') as ended_at_var,
--          exists(select 1 from pg_trigger where tgname='sp_licenses_ended_at_trg') as tetikleyici_var, version();
--   select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.sp_licenses'::regclass and contype = 'c';
--     -- status denetimi 'active','canceled','paused','refunded','revoked' degerlerine izin vermeli (bu gocun yazdigi degerler); vermiyorsa DUR.
--
-- SAPMA (Burak §6/2'den): "(source='paddle') = (play_token_hash is null)" eşitliği yerine tek yönlü kural konuldu:
--   source='paddle' ise Play alanları boş. Sebep: iki satır çakışmasında (§1/S6) birleştirmede kaybeden satır `revoked` olur ve jetonunu
--   kazanan satıra devreder; jetonsuz Play satırı bu yüzden geçerli olmak zorunda. Burak'ın onayı istenir.
--
-- GERİ ALMA (SIRA ÖNEMLİ): (1) önce KODU geri al (Play alanlarını SELECT etmeyen sürüm); (2) sonra:
--   drop function if exists public.sp_claim_play_license(text,text,text,text,text,int,text,text,timestamptz,text,timestamptz,text,boolean);
--   drop function if exists public.sp_play_mark_voided(text,timestamptz);
--   drop function if exists public.sp_rotate_play_license(uuid,text,timestamptz);
--   drop function if exists public.sp_play_license_json(uuid);
--   drop function if exists public.sp_play_expire_stale(timestamptz);
--   drop table if exists public.sp_play_tokens;
--   alter table public.sp_licenses drop constraint if exists sp_licenses_play_consistency;
--   alter table public.sp_licenses drop constraint if exists sp_licenses_source_check;
--   alter table public.sp_licenses drop constraint if exists sp_licenses_play_product_check;
--   drop index if exists public.sp_licenses_play_token_hash_uq;
--   alter table public.sp_licenses drop column source, drop column play_purchase_token, drop column play_token_hash,
--     drop column play_product_id, drop column play_state, drop column play_checked_at;   -- yalnız Play satırı yokken (satırlar silinir)

begin;

-- 0) Ön denetimler ----------------------------------------------------------------------------------------------------------
do $$
declare
  v_blockers text;
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'product') then
    raise exception 'sp_licenses.product yok; once 2026-11-06-lisans-urun.sql uygulanmali';
  end if;
  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'sp_license_retired_keys') then
    raise exception 'sp_license_retired_keys yok; once 2026-11-08-lisans-sifirlanan-kod.sql uygulanmali';
  end if;
  if (select data_type from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'id') is distinct from 'uuid' then
    raise exception 'sp_licenses.id uuid degil; bu migrasyon uuid varsayar';
  end if;
  -- D6 (Burak kod kapisi): sp_claim_play_license'in insert'u yalniz asagidaki sutunlari yazar. Bunlarin disinda, varsayilansiz ve NOT NULL
  -- baska bir sutun varsa (kimlik/uretilen sutunlar haric) her yeni Play claim 500 verir: gocu BASTAN durdur.
  -- (email Play satirinda bos olur; Paddle kodu da adres yokken null yazar, yani zaten bos olabilmeli: asagida NOT NULL kaldirilir.)
  select string_agg(column_name, ', ' order by column_name) into v_blockers
    from information_schema.columns
    where table_schema = 'public' and table_name = 'sp_licenses'
      and is_nullable = 'NO' and column_default is null and is_identity = 'NO' and is_generated = 'NEVER'
      and column_name not in ('email', 'license_key', 'product', 'plan', 'max_devices', 'status', 'source');
  if v_blockers is not null then
    raise exception 'sp_licenses icinde varsayilansiz NOT NULL sutun(lar) var: %; Play satiri bunlari dolduramaz, once Burak''a sor', v_blockers;
  end if;
end $$;

alter table public.sp_licenses alter column email drop not null;

-- 1) sp_licenses: Play alanları ---------------------------------------------------------------------------------------------
alter table public.sp_licenses add column if not exists source text not null default 'paddle';
alter table public.sp_licenses add column if not exists play_purchase_token text;   -- ham jeton: yalnız Google'a yeniden sormak için; hiçbir yanıta/günlüğe girmez
alter table public.sp_licenses add column if not exists play_token_hash text;       -- sha256(jeton), arama ve tekillik
alter table public.sp_licenses add column if not exists play_product_id text;
alter table public.sp_licenses add column if not exists play_state text;
alter table public.sp_licenses add column if not exists play_checked_at timestamptz;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'sp_licenses_source_check' and conrelid = 'public.sp_licenses'::regclass) then
    alter table public.sp_licenses add constraint sp_licenses_source_check check (source in ('paddle', 'play', 'play_test'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'sp_licenses_play_product_check' and conrelid = 'public.sp_licenses'::regclass) then
    -- Aile kimlikleri K2 göçünde eklenir; 2 yıllık plan YOK (Yasin kararı 2026-11-14).
    alter table public.sp_licenses add constraint sp_licenses_play_product_check
      check (play_product_id is null or play_product_id in ('premium_monthly', 'premium_yearly', 'premium_lifetime'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'sp_licenses_play_consistency' and conrelid = 'public.sp_licenses'::regclass) then
    -- Paddle satırında Play alanı, Play satırında Paddle numarası olamaz (iki kaynak karışmasın).
    alter table public.sp_licenses add constraint sp_licenses_play_consistency check (
      (source = 'paddle' and play_purchase_token is null and play_token_hash is null and play_product_id is null)
      or (source <> 'paddle' and paddle_transaction_id is null and paddle_subscription_id is null)
    );
  end if;
end $$;

create unique index if not exists sp_licenses_play_token_hash_uq on public.sp_licenses (play_token_hash) where play_token_hash is not null;

-- 2) Jeton zinciri tablosu: YALNIZ özet, ham jeton yok; RLS açık, politika YOK -----------------------------------------------------
-- Bir lisansın etkin jetonu sp_licenses.play_token_hash'tir; eski (yerine geçilmiş) jetonlar burada superseded_at ile kalır
-- (iptal listesi eşlemesi ve eski jetonla gelen claim'in aynı kodu alması için).
create table if not exists public.sp_play_tokens (
  token_hash text primary key,
  license_id uuid not null references public.sp_licenses (id) on delete cascade,
  first_seen timestamptz not null default now(),
  superseded_at timestamptz
);
create index if not exists sp_play_tokens_license_idx on public.sp_play_tokens (license_id);
alter table public.sp_play_tokens enable row level security;
revoke all on table public.sp_play_tokens from anon, authenticated;

-- 3) İşlevler: hepsi service_role'e ait; "security definer" YOK, search_path sabit ----------------------------------------------------

-- Yanıt/okuma için lisans satırı (jeton ALANI YOK: ham jeton yalnız sunucuda findByTokenHash/findLicense ile okunur).
create or replace function public.sp_play_license_json(p_id public.sp_licenses.id%type) returns jsonb
language sql
stable
set search_path = public
as $$
  select jsonb_build_object(
    'id', l.id, 'license_key', l.license_key, 'product', l.product, 'plan', l.plan, 'status', l.status,
    'current_period_end', l.current_period_end, 'max_devices', l.max_devices, 'email', l.email,
    'source', l.source, 'play_product_id', l.play_product_id, 'play_state', l.play_state, 'play_checked_at', l.play_checked_at
  ) from public.sp_licenses l where l.id = p_id
$$;

-- Atomik kayıt (Ş7): aynı jetonla eşzamanlı çağrılar tek satır üretir. Dönüş jsonb:
--   {"result":"none"}                                   yeni satır açılması istenmedi (hak vermiyor) ve satır yok
--   {"result":"ok","license":{...},"created":b,"chained":b,"merged":b,"superseded":b}
--   {"result":"manual","license":{...}}                 iki satır çakıştı, yeni satırın cihazı var: DEĞİŞİKLİK YOK
create or replace function public.sp_claim_play_license(
  p_token_hash text,
  p_token text,
  p_linked_hash text,
  p_product_id text,
  p_plan text,
  p_max_devices int,
  p_source text,
  p_status text,
  p_period_end timestamptz,
  p_play_state text,
  p_now timestamptz,
  p_new_key text,
  p_allow_create boolean
) returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_lic public.sp_licenses.id%type;
  v_sup timestamptz;
  v_other public.sp_licenses.id%type;
  v_linked_lic public.sp_licenses.id%type;
  v_found boolean;
begin
  if p_source not in ('play', 'play_test') then
    raise exception 'bad_source';
  end if;
  -- Aynı jeton (ve zincirdeki eski jeton) için istekler sıraya girer.
  perform pg_advisory_xact_lock(hashtextextended(p_token_hash, 0));
  if p_linked_hash is not null then
    perform pg_advisory_xact_lock(hashtextextended(p_linked_hash, 0));
  end if;

  select license_id, superseded_at into v_lic, v_sup from public.sp_play_tokens where token_hash = p_token_hash;
  v_found := found;

  if v_found then
    if v_sup is not null then
      -- Yerine geçilmiş eski jeton: aynı koda ulaşır, durum DEĞİŞMEZ (etkin jeton belirler).
      return jsonb_build_object('result', 'ok', 'license', public.sp_play_license_json(v_lic), 'created', false, 'chained', false, 'merged', false, 'superseded', true);
    end if;
    -- İki satır çakışması: bu jeton L2'ye aittir, ama Google'a göre başka bir satırdaki jetonun devamı (linked).
    if p_linked_hash is not null then
      select license_id into v_other from public.sp_play_tokens where token_hash = p_linked_hash and superseded_at is null;
      if v_other is not null and v_other <> v_lic then
        perform 1 from public.sp_licenses where id in (v_lic, v_other) order by id for update;
        if exists (select 1 from public.sp_license_devices where license_id = v_lic) then
          return jsonb_build_object('result', 'manual', 'license', public.sp_play_license_json(v_lic));
        end if;
        -- Eski satır (kullanıcının elindeki kod) korunur: yeni jeton ona taşınır, yeni satır `revoked` olur ve jetonunu bırakır.
        update public.sp_licenses set status = 'revoked', play_token_hash = null, play_purchase_token = null, updated_at = p_now where id = v_lic;
        update public.sp_play_tokens set license_id = v_other where token_hash = p_token_hash;
        -- D2: kazanan satirin onceki TUM etkin jetonlari (yalniz bagli olan degil) yerine gecilmis olur; tek etkin jeton kurali.
        update public.sp_play_tokens set superseded_at = p_now
          where license_id = v_other and superseded_at is null and token_hash <> p_token_hash;
        update public.sp_licenses set
            play_token_hash = p_token_hash, play_purchase_token = p_token, play_product_id = p_product_id, plan = p_plan,
            status = p_status, current_period_end = p_period_end, play_state = p_play_state, play_checked_at = p_now,
            max_devices = p_max_devices, source = p_source, updated_at = p_now
          where id = v_other;
        return jsonb_build_object('result', 'ok', 'license', public.sp_play_license_json(v_other), 'created', false, 'chained', false, 'merged', true, 'superseded', false);
      end if;
    end if;
    perform 1 from public.sp_licenses where id = v_lic for update;
    -- İade bitiş durumudur: Play'de ters ibraz yok, yeniden açma yalnız yeni bir satın alma (zincir) ile olur.
    update public.sp_licenses set
        status = case when status = 'refunded' then status else p_status end,
        -- D1: lisans-test satirinin 14 gunu ilk claim'de verilir, yeniden claim ILERI KAYDIRMAZ (en erken olan kalir).
        current_period_end = case
          when status = 'refunded' then current_period_end
          when source = 'play_test' and p_source = 'play_test' and current_period_end is not null then least(current_period_end, p_period_end)
          else p_period_end end,
        plan = p_plan, play_product_id = p_product_id, play_state = p_play_state, play_checked_at = p_now,
        max_devices = p_max_devices, source = p_source, updated_at = p_now,
        play_purchase_token = p_token, play_token_hash = p_token_hash
      where id = v_lic;
    return jsonb_build_object('result', 'ok', 'license', public.sp_play_license_json(v_lic), 'created', false, 'chained', false, 'merged', false, 'superseded', false);
  end if;

  -- Jeton bilinmiyor. Zincir: yeni jeton, bilinen bir jetonun devamı mı (linkedPurchaseToken / expiredPurchaseToken)?
  if p_linked_hash is not null then
    select license_id into v_linked_lic from public.sp_play_tokens where token_hash = p_linked_hash;
    if found then
      perform 1 from public.sp_licenses where id = v_linked_lic for update;
      -- D2: lisansin o anki TUM etkin jetonlari eski olur (cataldaki kardes jeton dahil): etkin jeton her zaman tektir.
      update public.sp_play_tokens set superseded_at = p_now where license_id = v_linked_lic and superseded_at is null;
      insert into public.sp_play_tokens (token_hash, license_id, first_seen) values (p_token_hash, v_linked_lic, p_now);
      -- Kod ve cihazlar AYNI kalır; plan Google'ın yeni ürünü, durum yeni satın almanın durumu.
      update public.sp_licenses set
          play_token_hash = p_token_hash, play_purchase_token = p_token, play_product_id = p_product_id, plan = p_plan,
          status = p_status, current_period_end = p_period_end, play_state = p_play_state, play_checked_at = p_now,
          max_devices = p_max_devices, source = p_source, updated_at = p_now
        where id = v_linked_lic;
      return jsonb_build_object('result', 'ok', 'license', public.sp_play_license_json(v_linked_lic), 'created', false, 'chained', true, 'merged', false, 'superseded', false);
    end if;
  end if;

  if not p_allow_create then
    return jsonb_build_object('result', 'none');
  end if;

  insert into public.sp_licenses (license_key, product, plan, max_devices, status, current_period_end, source, play_purchase_token, play_token_hash, play_product_id, play_state, play_checked_at)
    values (p_new_key, 'syncpass_desktop', p_plan, p_max_devices, p_status, p_period_end, p_source, p_token, p_token_hash, p_product_id, p_play_state, p_now)
    returning id into v_lic;
  insert into public.sp_play_tokens (token_hash, license_id, first_seen) values (p_token_hash, v_lic, p_now);
  return jsonb_build_object('result', 'ok', 'license', public.sp_play_license_json(v_lic), 'created', true, 'chained', false, 'merged', false, 'superseded', false);
end $$;

-- İptal edilen satın alma listesi eşlemesi (Ş9). Yalnız ETKİN jeton satırı `refunded` yapar; eski jeton yeni aboneliği düşürmez.
-- Dönüş: 'marked' | 'unknown' | 'superseded' | 'already'.
create or replace function public.sp_play_mark_voided(p_token_hash text, p_now timestamptz) returns text
language plpgsql
set search_path = public
as $$
declare
  v_lic public.sp_licenses.id%type;
  v_sup timestamptz;
  v_status text;
  v_active text;
begin
  select license_id, superseded_at into v_lic, v_sup from public.sp_play_tokens where token_hash = p_token_hash;
  if not found then
    return 'unknown';
  end if;
  if v_sup is not null then
    return 'superseded';
  end if;
  select status, play_token_hash into v_status, v_active from public.sp_licenses where id = v_lic for update;
  -- D2: yalniz lisansin ETKIN jetonunun iadesi lisansi dusurur.
  if v_active is distinct from p_token_hash then
    return 'superseded';
  end if;
  if v_status = 'refunded' then
    return 'already';
  end if;
  update public.sp_licenses set status = 'refunded', updated_at = p_now where id = v_lic;
  return 'marked';
end $$;

-- K1 destek yolu (self servis K2): kodu yeniler, eskisini özetle kaydeder, cihazları siler, sıfırlamayı sayar. YALNIZ Play satırı.
create or replace function public.sp_rotate_play_license(p_license_id public.sp_licenses.id%type, p_new_key text, p_now timestamptz) returns text
language plpgsql
set search_path = public
as $$
declare
  v_old text;
  v_source text;
begin
  select license_key, source into v_old, v_source from public.sp_licenses where id = p_license_id for update;
  if not found then
    raise exception 'license_not_found' using errcode = 'P0002';
  end if;
  if v_source not in ('play', 'play_test') then
    raise exception 'not_a_play_license';
  end if;
  insert into public.sp_license_retired_keys (retired_key_hash, license_id, retired_at)
    values (encode(sha256(convert_to(v_old, 'UTF8')), 'hex'), p_license_id, p_now)
    on conflict (retired_key_hash) do nothing;
  update public.sp_licenses set license_key = p_new_key, updated_at = p_now where id = p_license_id;
  delete from public.sp_license_devices where license_id = p_license_id;
  insert into public.sp_license_resets (license_id, reset_at) values (p_license_id, p_now);
  return 'ok';
end $$;

-- Süresi geçmiş Play satırlarını kapatır (günlük cron): iptal listesi yalnız İADEYİ gösterir; kullanıcı uygulamayı açmazsa süresi biten abonelik
-- 'active' kalırdı ve saklama silmesi (bitiş + 1 yıl) onu hiç görmezdi. Bitiş + 7 gün (abonelik payı) geçince 'canceled' yapılır;
-- sp_licenses_ended_at_trg (2026-11-07) ended_at'i o an yazar. Dönüş: kapatılan satır sayısı.
create or replace function public.sp_play_expire_stale(p_now timestamptz) returns int
language plpgsql
set search_path = public
as $$
declare
  v_n int;
begin
  update public.sp_licenses set status = 'canceled', updated_at = p_now
    where source in ('play', 'play_test') and status in ('active', 'paused', 'past_due')
      and current_period_end is not null and current_period_end < p_now - interval '7 days';
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- 4) Yetki: yalnız service_role (Ş11) ---------------------------------------------------------------------------------------------
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname in ('sp_claim_play_license', 'sp_play_mark_voided', 'sp_rotate_play_license', 'sp_play_license_json', 'sp_play_expire_stale')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

commit;
