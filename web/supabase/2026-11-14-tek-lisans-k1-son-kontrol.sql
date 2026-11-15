-- SyncPass K1 göçü SON KONTROLÜ (göç uygulandıktan hemen sonra). SALT OKUR, TEK SORGU, tek tablo. "SONUC" satırı DUR ise
-- KODU main'e BİRLEŞTİRME, tabloyu Burak'a gönder. Sonuç satırında sır yoktur.
with
fn as (
  select p.oid from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname in ('sp_claim_play_license', 'sp_play_mark_voided', 'sp_rotate_play_license', 'sp_play_license_json', 'sp_play_expire_stale')
),
src as (
  select coalesce(string_agg(source || ':' || n, ', ' order by source), 'satir yok') as v,
         coalesce(sum(n) filter (where source <> 'paddle'), 0) as play_n
  from (select coalesce(to_jsonb(l) ->> 'source', 'sutun yok') as source, count(*) as n from public.sp_licenses l group by 1) s
),
tk as (
  select coalesce(has_table_privilege('anon', t, 'select') or has_table_privilege('authenticated', t, 'select')
                  or has_table_privilege('anon', t, 'insert') or has_table_privilege('authenticated', t, 'insert'), false) as leak
  from (select to_regclass('public.sp_play_tokens') as t) z
),
r as (
  select 1 as n, 'sp_licenses yeni sutunlar (6)' as kontrol,
         (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses'
            and column_name in ('source', 'play_purchase_token', 'play_token_hash', 'play_product_id', 'play_state', 'play_checked_at'))::text as deger,
         '6' as beklenen,
         case when (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses'
            and column_name in ('source', 'play_purchase_token', 'play_token_hash', 'play_product_id', 'play_state', 'play_checked_at')) = 6 then 'TAMAM' else 'DUR' end as sonuc
  union all select 2, 'kisitlar (3)', (select count(*) from pg_constraint where conrelid = 'public.sp_licenses'::regclass and conname in ('sp_licenses_source_check', 'sp_licenses_play_product_check', 'sp_licenses_play_consistency'))::text, '3',
         case when (select count(*) from pg_constraint where conrelid = 'public.sp_licenses'::regclass and conname in ('sp_licenses_source_check', 'sp_licenses_play_product_check', 'sp_licenses_play_consistency')) = 3 then 'TAMAM' else 'DUR' end
  union all select 3, 'benzersiz jeton indeksi', exists (select 1 from pg_indexes where schemaname = 'public' and indexname = 'sp_licenses_play_token_hash_uq')::text, 'true',
         case when exists (select 1 from pg_indexes where schemaname = 'public' and indexname = 'sp_licenses_play_token_hash_uq') then 'TAMAM' else 'DUR' end
  union all select 4, 'sp_play_tokens var + RLS acik', coalesce((select relrowsecurity::text from pg_class where oid = to_regclass('public.sp_play_tokens')), 'yok'), 'true',
         case when (select relrowsecurity from pg_class where oid = to_regclass('public.sp_play_tokens')) then 'TAMAM' else 'DUR' end
  union all select 5, 'islev sayisi (5)', (select count(*) from fn)::text, '5', case when (select count(*) from fn) = 5 then 'TAMAM' else 'DUR' end
  union all select 6, 'anon/authenticated yetkili islev', (select count(*) from fn where has_function_privilege('anon', oid, 'execute') or has_function_privilege('authenticated', oid, 'execute'))::text, '0',
         case when (select count(*) from fn where has_function_privilege('anon', oid, 'execute') or has_function_privilege('authenticated', oid, 'execute')) = 0 then 'TAMAM' else 'DUR' end
  union all select 7, 'service_role yetkili islev', (select count(*) from fn where has_function_privilege('service_role', oid, 'execute'))::text, '5',
         case when (select count(*) from fn where has_function_privilege('service_role', oid, 'execute')) = 5 then 'TAMAM' else 'DUR' end
  union all select 8, 'anon/authenticated sp_play_tokens yetkisi', tk.leak::text, 'false', case when tk.leak then 'DUR' else 'TAMAM' end from tk
  union all select 9, 'satirlarin kaynagi (hepsi paddle olmali)', (select v from src), 'paddle:<N> (yalniz)', case when (select play_n from src) = 0 then 'TAMAM' else 'DUR' end
  union all select 10, 'email bos birakilabilir', coalesce((select (is_nullable = 'YES')::text from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'email'), 'yok'), 'true',
         case when (select is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'email') = 'YES' then 'TAMAM' else 'DUR' end
)
select kontrol, deger, beklenen, sonuc from (
  select n, kontrol, deger, beklenen, sonuc from r
  union all
  select 99, 'SONUC', count(*) filter (where sonuc = 'DUR')::text || ' DUR', '0 DUR',
         case when count(*) filter (where sonuc = 'DUR') = 0 then 'TAMAM' else 'DUR' end from r
) x order by n;
