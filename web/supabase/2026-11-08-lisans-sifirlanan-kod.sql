-- Cihaz sıfırlamada DEĞİŞTİRİLEN eski lisans kodunun SHA-256 özetini saklar (AreaPilot durum sorgusu, Yasin kararı K11 = a, 2026-11-07).
-- Amaç: sıfırlanan kodla etkinleştirilmiş bir bilgisayar durum sorgusunda kodu "bulunamadı" (404, istemci düşmez) yerine
-- "lisans var ama bu cihaz kayıtlı değil" diye öğrensin ve ücretsiz moda geçsin. Eski kod yalnız durum sorgusunda tanınır;
-- etkinleştirme, yenileme ve kaldırmada eskisi gibi 404 invalid_key kalır (eski kod işe yaramaz).
-- UYGULANMADI. Yasin onayıyla Supabase SQL editöründe çalıştırılır. Önce 2026-11-06-lisans-urun.sql uygulanmış olmalı.
-- Yerel Postgres olmadığı için çalıştırılarak SINANMADI; uygulamadan önce hazırlık projesinde şu iki adım denenmeli:
--   (1) sıfırlama sonrası: select count(*) from sp_license_retired_keys;  -> 1
--   (2) aynı lisansı ikinci kez sıfırla: iki satır, eski kodların özeti birbirinden farklı.
-- SIRA: (1) bu migrasyon, (2) site dağıtımı (durum ucu), (3) istemci 1.0. KOD bu migrasyondan ÖNCE dağıtılırsa sp_license_retired_keys
-- yok hatası verir ve durum ucunda BİLİNMEYEN HER KOD (yanlış yazılmış kodlar dahil; güncel kodlar etkilenmez) 404 yerine 500 döner,
-- günlük "license store" hatasıyla dolar. İstemci 5xx'te düşmez, yani zarar yok; yine de sıra korunur.
-- Saklama: satır lisansa bağlıdır (on delete cascade); lisans silinince (sp_purge_ended_licenses) birlikte gider. Dolaylı kişisel veridir
-- (lisans e-postaya bağlı): eski kodun tek yönlü özeti, lisans kimliği ve tarih tutulur; Gizlilik §4/§9 ve site ek maddesinde sayılır.
--
-- GERİ ALMA (SIRA ÖNEMLİ, numaralı):
--   (1) Önce KODU geri al (durum ucundaki findRetiredKeyOwner çağrısı olmayan sürüm): tablo düşünce bilinmeyen her kod 500 döner.
--   (2) Sonra eski sp_consume_reset_token tanımını 2026-11-06-lisans-urun.sql'den yeniden çalıştır (create or replace; yetkiler korunur).
--   (3) En son: drop table public.sp_license_retired_keys;
--       (2) yapılmadan (3) çalıştırılırsa yeni işlev tabloyu arar ve e-postayla sıfırlama "relation sp_license_retired_keys does not exist" ile 500 verir.

begin;

do $$
begin
  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'sp_license_resets') then
    raise exception 'sp_license_resets yok; once 2026-11-06-lisans-urun.sql uygulanmali';
  end if;
end $$;

create table if not exists public.sp_license_retired_keys (
  retired_key_hash text primary key,
  license_id uuid not null references public.sp_licenses (id) on delete cascade,
  retired_at timestamptz not null default now()
);
create index if not exists sp_license_retired_keys_license_idx on public.sp_license_retired_keys (license_id);
alter table public.sp_license_retired_keys enable row level security;
revoke all on table public.sp_license_retired_keys from anon, authenticated;

-- Aynı işlev, tek fark: kod değişmeden önce eski kodun özeti kaydedilir.
create or replace function public.sp_consume_reset_token(
  p_token_hash text,
  p_now timestamptz,
  p_new_key text,
  p_limit int,
  p_window_days int
) returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_license public.sp_licenses.id%type;
  v_lang text;
  v_email text;
  v_old_key text;
  v_recent int;
begin
  select license_id, lang into v_license, v_lang from public.sp_license_reset_tokens
    where token_hash = p_token_hash and used_at is null and expires_at > p_now
    for update;
  if not found then
    return jsonb_build_object('result', 'invalid');
  end if;
  perform 1 from public.sp_licenses where id = v_license for update;
  select count(*) into v_recent from public.sp_license_resets
    where license_id = v_license and reset_at > p_now - make_interval(days => p_window_days);
  if v_recent >= p_limit then
    update public.sp_license_reset_tokens set used_at = p_now where license_id = v_license and used_at is null;
    return jsonb_build_object('result', 'limit');
  end if;
  select license_key into v_old_key from public.sp_licenses where id = v_license;
  insert into public.sp_license_retired_keys (retired_key_hash, license_id, retired_at)
    values (encode(sha256(convert_to(v_old_key, 'UTF8')), 'hex'), v_license, p_now)
    on conflict (retired_key_hash) do nothing;
  update public.sp_licenses set license_key = p_new_key, updated_at = p_now where id = v_license returning email into v_email;
  delete from public.sp_license_devices where license_id = v_license;
  insert into public.sp_license_resets (license_id, reset_at) values (v_license, p_now);
  update public.sp_license_reset_tokens set used_at = p_now where license_id = v_license and used_at is null;
  return jsonb_build_object('result', 'ok', 'email', v_email, 'lang', v_lang);
end $$;

do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'sp_consume_reset_token'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

commit;
