-- SyncPass K1 Ş-B (Burak 2026-11-15 canlıya alma kapısı): lisans tablolarında anon/authenticated yetkisini GERİ AL (savunma derinliği).
-- Neden: bu tablolar panelden kuruldu ve Supabase varsayılanıyla anon/authenticated'a TÜM yetkili (TRUNCATE dahil); tek katman RLS.
-- K1 ile sp_licenses'e ham Play jetonu girer. Site yalnız service_role ile erişir (supabaseAdmin), davranış değişmez.
-- UYGULANMADI. Yasin onayıyla Supabase SQL editöründe, K1 göçüyle AYNI oturumda çalıştırılır. Sıra: ön denetim -> K1 göçü -> K1 son kontrol -> BU DOSYA.
-- Tek işlem, idempotent. Dosyanın SON ifadesi salt okur doğrulama sorgusudur (editör son sonucu gösterir): SONUC satırı TAMAM olmalı.
-- Geri alma (gerekirse; önerilmez): grant all on table public.sp_licenses, public.sp_license_devices, public.sp_paddle_customers, public.sp_paddle_events to anon, authenticated;

begin;

do $$
declare
  t text;
begin
  foreach t in array array['sp_licenses', 'sp_license_devices', 'sp_paddle_customers', 'sp_paddle_events'] loop
    if to_regclass('public.' || t) is not null then
      execute format('revoke all on table public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;

commit;

-- Doğrulama (salt okur, TEK sorgu): var olan dört tabloda anon/authenticated için select/insert/update/delete/truncate/references/trigger = false;
-- service_role select = true.
with t as (select unnest(array['sp_licenses', 'sp_license_devices', 'sp_paddle_customers', 'sp_paddle_events']) as tablo),
x as (
  select t.tablo, to_regclass('public.' || t.tablo) as oid from t
),
leak as (
  select x.tablo, r.rol, p.yetki
  from x cross join (values ('anon'), ('authenticated')) as r(rol)
  cross join (values ('select'), ('insert'), ('update'), ('delete'), ('truncate'), ('references'), ('trigger')) as p(yetki)
  where x.oid is not null and has_table_privilege(r.rol, x.oid, p.yetki)
),
svc as (
  select x.tablo from x where x.oid is not null and not has_table_privilege('service_role', x.oid, 'select')
)
select 'anon/authenticated acik yetki sayisi' as kontrol, (select count(*) from leak)::text as deger, '0' as beklenen,
       case when (select count(*) from leak) = 0 then 'TAMAM' else 'DUR' end as sonuc
union all
select 'service_role select eksik tablo sayisi', (select count(*) from svc)::text, '0', case when (select count(*) from svc) = 0 then 'TAMAM' else 'DUR' end
union all
select 'bakilan tablo sayisi', (select count(*) from x where oid is not null)::text, '3 ya da 4 (sp_paddle_events yoksa 3)', 'BILGI'
union all
select 'SONUC', ((select count(*) from leak) + (select count(*) from svc))::text || ' DUR', '0 DUR',
       case when (select count(*) from leak) + (select count(*) from svc) = 0 then 'TAMAM' else 'DUR' end;
