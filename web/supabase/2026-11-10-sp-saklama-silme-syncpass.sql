-- SyncPass Masaüstü lisans kayıtlarının SAKLAMA SÜRESİ SİLMESİ (TASLAK; Zeynep son okuma M5, 2026-11-09).
-- Gizlilik: "Lisans kayıtları: lisans süresi boyunca ve bitiminden sonra 1 yıl." AreaPilot için bu işi 2026-11-07-lisans-saklama-silme.sql
-- (areapilot-odeme-main-hazir dalı) yapar ve SyncPass'i bilerek DIŞARIDA bırakır; SyncPass'in 1 yıl sözünün mekanizması bu dosyadır.
--
-- !!! UYGULANMADI, ÇALIŞTIRILMADI. Veri silen bir işlev kurar: Yasin onayı + Burak sınaması olmadan canlıda çalıştırılmaz. pg_cron GÖREVİ BU DOSYADA
-- KURULMAZ (ilk koşu elle, dry-run ile; görev ayrı onayla). Yayındaki "1 yıl" cümlesi, bu işlev canlıda uygulanıp görev çalışana dek mekanizmasız kalır.
--
-- ÖN KOŞUL: 2026-11-06-lisans-urun.sql VE 2026-11-07-lisans-saklama-silme.sql (ended_at sütunu + tetikleyici + sp_purge_log) uygulanmış olmalı.
-- Bu dosya AreaPilot dalı birleşmeden uygulanamaz (ended_at orada tanımlı); bilerek ayrı işlev: AreaPilot işlevine dokunmaz, iki ürünün
-- saklama kuralı ayrı karar olarak ayrı kalır.
--
-- NE SİLİNİR (yalnız product = 'syncpass_desktop'):
--   sp_licenses  : status in ('refunded','canceled','revoked') ve BİTİŞ ANI + 1 yıl geçmiş satırlar. Bitiş anı = ended_at; ÇAKIŞMA: iptal edilmiş
--                  bir abonelikte dönem sonuna kadar Premium sürer, o yüzden bitiş anı = greatest(ended_at, current_period_end).
--                  ended_at'i BOŞ bitmiş satır silinmez; sp_purge_log.manual_review sayısına yazılır ("elle bak").
--   sp_license_devices : o lisansların bilgisayar satırları (cascade belirsiz olduğu için açıkça)
--   sp_license_removals / sp_license_resets / sp_license_reset_tokens / sp_license_retired_keys : cascade (lisans silinince gider)
--   sp_paddle_customers : silinen lisansların Paddle müşterisi, başka hiçbir lisans (AreaPilot dahil) o müşteriye bağlı kalmadıysa
--   dokunulmaz: status 'active', 'paused', 'past_due' olan hiçbir lisans (ömür boyu lisans bitmez); sp_paddle_events (kişisel veri yok).
-- imha-kaydi.md: ilk GERÇEK silmede satır yazılır (öneri aşağıda, dosyanın sonunda).
--
-- GERİ ALMA: drop function public.sp_purge_ended_licenses_syncpass(timestamptz, boolean);  (silinen veri geri gelmez; ilk koşu dry-run olmalı.)

begin;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'ended_at') then
    raise exception 'sp_licenses.ended_at yok; once 2026-11-07-lisans-saklama-silme.sql uygulanmali';
  end if;
  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'sp_purge_log') then
    raise exception 'sp_purge_log yok; once 2026-11-07-lisans-saklama-silme.sql uygulanmali';
  end if;
end $$;

create or replace function public.sp_purge_ended_licenses_syncpass(p_now timestamptz default now(), p_dry_run boolean default true)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  c_days constant int := 365;
  v_ids uuid[];
  v_customers text[];
  v_devices int := 0;
  v_cust_del int := 0;
  v_lic_del int := 0;
  v_manual int := 0;
begin
  -- p_now ileri alınarak saklama süresi atlanamasın.
  if p_now > now() + interval '1 day' then
    raise exception 'p_now gelecekte olamaz (saklama suresi atlanamaz)';
  end if;

  select coalesce(array_agg(id), '{}'), coalesce(array_agg(distinct paddle_customer_id) filter (where paddle_customer_id is not null), '{}')
    into v_ids, v_customers
    from public.sp_licenses
    where product = 'syncpass_desktop'
      and status in ('refunded', 'canceled', 'revoked')
      and ended_at is not null
      and greatest(ended_at, coalesce(current_period_end, ended_at)) < p_now - make_interval(days => c_days);

  select count(*) into v_manual from public.sp_licenses
    where product = 'syncpass_desktop' and status in ('refunded', 'canceled', 'revoked') and ended_at is null;

  select count(*) into v_devices from public.sp_license_devices where license_id = any (v_ids);

  if p_dry_run then
    return jsonb_build_object('dry_run', true, 'licenses', coalesce(array_length(v_ids, 1), 0), 'devices', v_devices, 'manual_review', v_manual, 'license_ids', to_jsonb(v_ids));
  end if;

  if coalesce(array_length(v_ids, 1), 0) > 0 then
    delete from public.sp_license_devices where license_id = any (v_ids);
    delete from public.sp_licenses
      where id = any (v_ids) and product = 'syncpass_desktop' and status in ('refunded', 'canceled', 'revoked');
    get diagnostics v_lic_del = row_count;

    delete from public.sp_paddle_customers pc
      where pc.paddle_customer_id = any (v_customers)
        and not exists (select 1 from public.sp_licenses l where l.paddle_customer_id = pc.paddle_customer_id);
    get diagnostics v_cust_del = row_count;
  end if;

  insert into public.sp_purge_log (run_at, product, retention_days, deleted_licenses, deleted_devices, deleted_customers, manual_review)
    values (p_now, 'syncpass_desktop', c_days, v_lic_del, v_devices, v_cust_del, v_manual);

  return jsonb_build_object('dry_run', false, 'licenses', v_lic_del, 'devices', v_devices, 'customers', v_cust_del, 'manual_review', v_manual);
end $$;

revoke all on function public.sp_purge_ended_licenses_syncpass(timestamptz, boolean) from public, anon, authenticated;
grant execute on function public.sp_purge_ended_licenses_syncpass(timestamptz, boolean) to service_role;

commit;

-- CANLIDA UYGULAMADAN ÖNCE (Burak D-3 ile aynı, salt okur): sp_licenses ve sp_paddle_customers'a başvuran bütün yabancı anahtarların silme kuralı
--   select conrelid::regclass, conname, confdeltype from pg_constraint where contype = 'f'
--     and confrelid in ('public.sp_licenses'::regclass, 'public.sp_paddle_customers'::regclass);
-- İlk koşu: select public.sp_purge_ended_licenses_syncpass(now(), true);  sonra (Yasin onayıyla) (now(), false). Görev (pg_cron) ayrı onayla.
--
-- imha-kaydi.md SATIR ÖNERİSİ (ilk gerçek silmede, sayılar sp_purge_log'dan):
--   | <tarih> | SyncPass Masaüstü lisans kayıtları (sp_licenses, sp_license_devices, sp_license_removals, sp_paddle_customers) | Bitişten (iade/iptal/geri alma, iptalde dönem sonu) 1 yıl geçti | sp_purge_ended_licenses_syncpass (Supabase) | <N> lisans, <N> cihaz, <N> müşteri | Can/Yasin |
-- SINAMA (hazırlık projesinde, sahte satırlarla): (a) syncpass refunded, ended_at 400 gün önce -> silinir; (b) 100 gün önce -> kalır; (c) canceled,
-- ended_at 400 gün önce AMA current_period_end 100 gün önce -> KALIR; (d) active -> kalır; (e) areapilot refunded 400 gün -> bu işlevle SİLİNMEZ;
-- (f) müşteri başka bir lisansa da bağlıysa müşteri satırı kalır.
