-- Lisans tablosuna ürün sütunu + atomik cihaz kaydı + kaldırma sınırı + e-postayla cihaz sıfırlama
-- (AreaPilot lisanslaması, plan: D:/Development/OstlerTech/yonetim/2026-10-28-areapilot-satis-plani.md §2.2).
-- UYGULANMADI. Yasin onayıyla Supabase SQL editöründe çalıştırılır. Tekrar çalıştırılabilir (idempotent).
--
-- SIRA KURALI: bu dosya KODDAN ÖNCE uygulanır. Yeni kod sp_licenses.product sütununu ve aşağıdaki sp_* işlevlerini kullanır.
-- Sütun/işlev yokken dağıtılırsa Supabase sorgusu hata verir (42703 / 42883); kod bunu 500 server_error olarak döndürür
-- (artık 404 invalid_key DEĞİL: hatalı müşteriye "kodun geçersiz" denmez), yani SyncPass dahil BÜTÜN etkinleştirme/yenileme
-- istekleri sütun ve işlevler gelene kadar başarısız olur ve webhook lisans yazamaz (Paddle yeniden dener). Bu yüzden önce migrasyon.
-- Sütun varsayılanlıdır: mevcut satırlar otomatik 'syncpass_desktop' olur, eski kod product yazmadan eklese de varsayılan geçerli kalır.
-- Geri alma: işlevleri ve yeni tabloları drop et; alter table public.sp_licenses drop column product; (yalnız AreaPilot lisansı yokken).
--
-- Plan CHECK'i (month/year/lifetime) zaten yeterli: AreaPilot tek seferlik = 'lifetime'; Bireysel/Ofis/Firma farkı plan değil
-- max_devices (1/5/20), webhook bunu fiyat kimliğinden yazar.

-- 1) Ürün sütunu ---------------------------------------------------------------------------------------------------------
alter table public.sp_licenses
  add column if not exists product text not null default 'syncpass_desktop';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sp_licenses_product_check' and conrelid = 'public.sp_licenses'::regclass
  ) then
    alter table public.sp_licenses
      add constraint sp_licenses_product_check check (product in ('syncpass_desktop', 'areapilot'));
  end if;
end $$;

-- Etkinleştirme sorgusu (license_key + product) license_key üzerindeki mevcut unique indeksiyle zaten hızlı; bu indeks
-- ürüne göre rapor/sayım içindir.
create index if not exists sp_licenses_product_status_idx on public.sp_licenses (product, status);

-- 2) Aynı Paddle işlemi iki lisans üretmesin -------------------------------------------------------------------------------
-- Canlı şemada paddle_transaction_id için unique kısıt zaten varsa bu indeks yedektir (zararsız). RİSK: tabloda şu an aynı
-- paddle_transaction_id'ye sahip İKİ satır varsa create index HATA VERİR; önce şunu çalıştır ve çift varsa elle birleştir:
--   select paddle_transaction_id, count(*) from public.sp_licenses
--   where paddle_transaction_id is not null group by 1 having count(*) > 1;
create unique index if not exists sp_licenses_paddle_transaction_uniq
  on public.sp_licenses (paddle_transaction_id) where paddle_transaction_id is not null;

-- 3) Yeni tablolar (RLS açık, tarayıcı için politika YOK; yalnız service_role) ------------------------------------------------
-- Cihaz kaldırma sayacı: lisans başına 30 günde en çok 3 kaldırma (sp_remove_device uygular).
create table if not exists public.sp_license_removals (
  id bigint generated always as identity primary key,
  license_id uuid not null references public.sp_licenses (id) on delete cascade,
  removed_at timestamptz not null default now()
);
create index if not exists sp_license_removals_license_idx on public.sp_license_removals (license_id, removed_at desc);

-- E-postayla cihaz sıfırlama belirteçleri: YALNIZ SHA-256 özeti saklanır (düz belirteç yalnız e-postada).
create table if not exists public.sp_license_reset_tokens (
  token_hash text primary key,
  license_id uuid not null references public.sp_licenses (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);
create index if not exists sp_license_reset_tokens_license_idx on public.sp_license_reset_tokens (license_id, created_at desc);

alter table public.sp_license_removals enable row level security;
alter table public.sp_license_reset_tokens enable row level security;
revoke all on table public.sp_license_removals from anon, authenticated;
revoke all on table public.sp_license_reset_tokens from anon, authenticated;

-- 4) Atomik işlevler -------------------------------------------------------------------------------------------------------
-- Hepsi önce lisans satırını "for update" ile kilitler: aynı lisansa eşzamanlı istekler sıraya girer, sınır aşılamaz.
-- Cihaz ve lisans kimliği türü %type ile sütundan alınır (sütun uuid ya da text olsun çalışır).

-- Cihazı kaydeder: kayıtlıysa last_seen günceller; değilse sayı < max_devices ise ekler. Dönüş: 'ok' | 'limit'.
create or replace function public.sp_register_device(
  p_license_id public.sp_licenses.id%type,
  p_device_id public.sp_license_devices.device_id%type,
  p_app_version text,
  p_now timestamptz
) returns text
language plpgsql
set search_path = public
as $$
declare
  v_max int;
  v_count int;
begin
  select max_devices into v_max from public.sp_licenses where id = p_license_id for update;
  if not found then
    raise exception 'license_not_found' using errcode = 'P0002';
  end if;
  if exists (select 1 from public.sp_license_devices where license_id = p_license_id and device_id = p_device_id) then
    update public.sp_license_devices set last_seen = p_now, app_version = p_app_version
      where license_id = p_license_id and device_id = p_device_id;
    return 'ok';
  end if;
  select count(*) into v_count from public.sp_license_devices where license_id = p_license_id;
  if v_count >= v_max then
    return 'limit';
  end if;
  insert into public.sp_license_devices (license_id, device_id, app_version, last_seen)
    values (p_license_id, p_device_id, p_app_version, p_now);
  return 'ok';
end $$;

-- Cihazı kaldırır ve sayar: son p_window_days günde p_limit kaldırma yapıldıysa silmeden 'limit'. Kayıtsız cihaz: 'ok', sayılmaz.
create or replace function public.sp_remove_device(
  p_license_id public.sp_licenses.id%type,
  p_device_id public.sp_license_devices.device_id%type,
  p_now timestamptz,
  p_limit int,
  p_window_days int
) returns text
language plpgsql
set search_path = public
as $$
declare
  v_recent int;
begin
  perform 1 from public.sp_licenses where id = p_license_id for update;
  if not found then
    raise exception 'license_not_found' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.sp_license_devices where license_id = p_license_id and device_id = p_device_id) then
    return 'ok';
  end if;
  select count(*) into v_recent from public.sp_license_removals
    where license_id = p_license_id and removed_at > p_now - make_interval(days => p_window_days);
  if v_recent >= p_limit then
    return 'limit';
  end if;
  delete from public.sp_license_devices where license_id = p_license_id and device_id = p_device_id;
  insert into public.sp_license_removals (license_id, removed_at) values (p_license_id, p_now);
  return 'ok';
end $$;

-- Sıfırlama belirteci üretir (özet olarak). Lisans için son p_min_interval_seconds içinde belirteç üretildiyse false (saatte 1).
create or replace function public.sp_create_reset_token(
  p_license_id public.sp_licenses.id%type,
  p_token_hash text,
  p_expires timestamptz,
  p_now timestamptz,
  p_min_interval_seconds int
) returns boolean
language plpgsql
set search_path = public
as $$
begin
  perform 1 from public.sp_licenses where id = p_license_id for update;
  if not found then
    raise exception 'license_not_found' using errcode = 'P0002';
  end if;
  if exists (
    select 1 from public.sp_license_reset_tokens
    where license_id = p_license_id and created_at > p_now - make_interval(secs => p_min_interval_seconds)
  ) then
    return false;
  end if;
  delete from public.sp_license_reset_tokens where license_id = p_license_id and expires_at < p_now - interval '1 day';
  insert into public.sp_license_reset_tokens (token_hash, license_id, created_at, expires_at)
    values (p_token_hash, p_license_id, p_now, p_expires);
  return true;
end $$;

-- Belirteci tüketir: geçerliyse (var, kullanılmamış, süresi dolmamış) lisansın TÜM cihazlarını siler, o lisansın açık
-- belirteçlerini kapatır ve true döner. Kaldırma sayacına yazılmaz (kullanıcı e-postasını kanıtladı).
create or replace function public.sp_consume_reset_token(
  p_token_hash text,
  p_now timestamptz
) returns boolean
language plpgsql
set search_path = public
as $$
declare
  v_license public.sp_licenses.id%type;
begin
  update public.sp_license_reset_tokens set used_at = p_now
    where token_hash = p_token_hash and used_at is null and expires_at > p_now
    returning license_id into v_license;
  if v_license is null then
    return false;
  end if;
  perform 1 from public.sp_licenses where id = v_license for update;
  delete from public.sp_license_devices where license_id = v_license;
  update public.sp_license_reset_tokens set used_at = p_now where license_id = v_license and used_at is null;
  return true;
end $$;

-- 5) Yetki: yalnız service_role çalıştırabilir (anon/authenticated/public çalıştıramaz) ------------------------------------------
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('sp_register_device', 'sp_remove_device', 'sp_create_reset_token', 'sp_consume_reset_token')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;
