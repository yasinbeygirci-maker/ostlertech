-- SyncPass K1 göçü ÖN DENETİMİ. SALT OKUR (hiçbir şey yazmaz). TEK SORGU: Supabase SQL editörüne olduğu gibi yapıştırıp çalıştır;
-- çıktı tek tablodur (kontrol / değer / beklenen / sonuc). Son satır "SONUC" bütün kararı verir: TAMAM ise göçe geçilebilir,
-- DUR ise tabloyu olduğu gibi (değerleri sır içermez) Burak'a gönder, göçü ÇALIŞTIRMA. BILGI satırları karar vermez.
-- Burak §6/8 + D6 + kod kapısı §3.6. Bu dosya canlıya Yasin tarafından yapıştırılır; Can çalıştırmaz.
with
nn as (
  select string_agg(column_name, ', ' order by column_name) as cols
  from information_schema.columns
  where table_schema = 'public' and table_name = 'sp_licenses'
    and is_nullable = 'NO' and column_default is null and is_identity = 'NO' and is_generated = 'NEVER'
    and column_name not in ('email', 'license_key', 'product', 'plan', 'max_devices', 'status', 'source')
),
fk as (
  select string_agg(conname || ':' || confdeltype::text, ', ' order by conname) as v,
         bool_and(confdeltype = 'c') as all_cascade
  from pg_constraint where conrelid = to_regclass('public.sp_license_devices') and contype = 'f'
),
st as (
  select string_agg(pg_get_constraintdef(oid), ' | ') as v,
         bool_and(pg_get_constraintdef(oid) ~ '''active''' and pg_get_constraintdef(oid) ~ '''canceled'''
                  and pg_get_constraintdef(oid) ~ '''paused''' and pg_get_constraintdef(oid) ~ '''refunded'''
                  and pg_get_constraintdef(oid) ~ '''revoked''') as ok
  from pg_constraint
  where conrelid = to_regclass('public.sp_licenses') and contype = 'c' and pg_get_constraintdef(oid) ~ 'status'
),
rows_ as (
  select 1 as n, 'tablo sp_licenses var' as kontrol, (to_regclass('public.sp_licenses') is not null)::text as deger, 'true' as beklenen,
         case when to_regclass('public.sp_licenses') is not null then 'TAMAM' else 'DUR' end as sonuc
  union all select 2, 'tablo sp_license_devices var', (to_regclass('public.sp_license_devices') is not null)::text, 'true',
         case when to_regclass('public.sp_license_devices') is not null then 'TAMAM' else 'DUR' end
  union all select 3, 'tablo sp_license_resets var', (to_regclass('public.sp_license_resets') is not null)::text, 'true',
         case when to_regclass('public.sp_license_resets') is not null then 'TAMAM' else 'DUR' end
  union all select 4, 'tablo sp_license_retired_keys var', (to_regclass('public.sp_license_retired_keys') is not null)::text, 'true',
         case when to_regclass('public.sp_license_retired_keys') is not null then 'TAMAM' else 'DUR' end
  union all select 5, 'sp_licenses.product sutunu var', exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'product')::text, 'true',
         case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'product') then 'TAMAM' else 'DUR' end
  union all select 6, 'sp_licenses.id tipi', coalesce((select data_type from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'id'), 'yok'), 'uuid',
         case when (select data_type from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'id') = 'uuid' then 'TAMAM' else 'DUR' end
  union all select 7, 'RLS sp_licenses', coalesce((select relrowsecurity::text from pg_class where oid = to_regclass('public.sp_licenses')), 'yok'), 'true',
         case when (select relrowsecurity from pg_class where oid = to_regclass('public.sp_licenses')) then 'TAMAM' else 'DUR' end
  union all select 8, 'RLS sp_license_devices', coalesce((select relrowsecurity::text from pg_class where oid = to_regclass('public.sp_license_devices')), 'yok'), 'true',
         case when (select relrowsecurity from pg_class where oid = to_regclass('public.sp_license_devices')) then 'TAMAM' else 'DUR' end
  union all select 9, 'anon/authenticated tablo yetkisi (RLS aciksa tek basina sorun degil)',
         (has_table_privilege('anon', 'public.sp_licenses', 'select') or has_table_privilege('authenticated', 'public.sp_licenses', 'select'))::text, 'bilgi (Supabase varsayilani true olabilir; koruma RLS + politikasizlik)', 'BILGI'
  union all select 10, 'sp_licenses / sp_license_devices uzerindeki RLS POLITIKA sayisi', (select count(*) from pg_policies where schemaname = 'public' and tablename in ('sp_licenses', 'sp_license_devices'))::text, '0',
         case when (select count(*) from pg_policies where schemaname = 'public' and tablename in ('sp_licenses', 'sp_license_devices')) = 0 then 'TAMAM' else 'DUR' end
  union all select 11, 'varsayilansiz NOT NULL sutun (email haric)', coalesce((select cols from nn), 'yok'), 'yok',
         case when (select cols from nn) is null then 'TAMAM' else 'DUR' end
  union all select 12, 'cihaz tablosu FK silme kurali (c = cascade)', coalesce((select v from fk), 'FK yok'), 'hepsi c',
         case when (select all_cascade from fk) is true then 'TAMAM' else 'DUR' end
  union all select 13, 'status CHECK izinli degerler', coalesce((select v from st), 'status CHECK yok (kisitlama yok)'), 'active, canceled, paused, refunded, revoked iceriyor ya da CHECK yok',
         case when (select v from st) is null or (select ok from st) then 'TAMAM' else 'DUR' end
  union all select 14, 'ended_at sutunu (2026-11-07 gocu)', exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'ended_at')::text, 'true (yoksa saklama silmesi calismaz, K1 engellenmez)',
         case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'ended_at') then 'TAMAM' else 'BILGI' end
  union all select 15, 'ended_at tetikleyicisi', exists (select 1 from pg_trigger where tgname = 'sp_licenses_ended_at_trg')::text, 'true (aynisi)',
         case when exists (select 1 from pg_trigger where tgname = 'sp_licenses_ended_at_trg') then 'TAMAM' else 'BILGI' end
  union all select 16, 'email sutunu NOT NULL mi (goc kaldirir, geri alma geri koyar)', coalesce((select (is_nullable = 'NO')::text from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'email'), 'yok'), 'bilgi', 'BILGI'
  union all select 17, 'K1 daha once uygulanmis mi (source sutunu)', exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'source')::text, 'false (true ise yeniden calistirmak zararsizdir)', 'BILGI'
  union all select 18, 'sp_licenses satir sayisi', (select count(*) from public.sp_licenses)::text, 'bilgi', 'BILGI'
  union all select 19, 'surum', split_part(version(), ' on ', 1), 'bilgi', 'BILGI'
)
select kontrol, deger, beklenen, sonuc from (
  select n, kontrol, deger, beklenen, sonuc from rows_
  union all
  select 99, 'SONUC', count(*) filter (where sonuc = 'DUR')::text || ' DUR', '0 DUR',
         case when count(*) filter (where sonuc = 'DUR') = 0 then 'TAMAM' else 'DUR' end from rows_
) x order by n;
