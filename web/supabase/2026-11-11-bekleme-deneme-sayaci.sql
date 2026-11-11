-- Bekleme listesi: hız sınırı EKLEMELERİ değil DENEMELERİ saysın (Burak B1, 2026-11-11; Cloudflare security-audit skill bulgusu).
-- UYGULANMADI. Yasin onayıyla Supabase SQL Editor'de çalıştırılır (proje qpwodglvptnkpjcwhmqg). Tekrar çalıştırılabilir.
--
-- Sorun: eski sınır yalnız site_waitlist'e EKLENEN satırları sayıyordu; var olan adres satır eklemediği için sayaç artmıyordu.
-- Aynı IP özetinden 4 yeni adres + hedef + 1 yeni adres gönderen kişi, son isteğin 200 ya da 429 dönmesinden hedefin listede olup
-- olmadığını okuyabiliyordu (429 = hedef listede değil, çünkü hedef eklenip sayacı doldurmuştu).
-- Düzeltme: her çağrı (adres listede olsun olmasın) site_waitlist_attempts'e bir satır yazar; sınır bu satırları sayar.
-- Yanıt (added / exists / rate_limited) hedefin durumundan bağımsız olarak aynı IP için aynı sınır noktasında rate_limited olur.
--
-- Gizlilik: yalnız IP'nin gizli anahtarlı HMAC özeti ve zaman damgası; 1 günden eski kayıtlar her çağrıda silinir. site_waitlist
-- satırlarına artık ip_hash YAZILMAZ (hız sınırı için ayrı tabloda tutulur); eski satırlardaki özet de 1 gün sonra silinmeye devam eder.
-- Kaynak: ic-kurallar (kişisel veri en az, saklama süresi kısa).

create table if not exists public.site_waitlist_attempts (
  ip_hash text not null,
  at      timestamptz not null default now()
);
create index if not exists site_waitlist_attempts_ip on public.site_waitlist_attempts (ip_hash, at);

alter table public.site_waitlist_attempts enable row level security;
revoke all on public.site_waitlist_attempts from anon, authenticated;

-- Artık kullanılmayan kısmi indeks (ip_hash site_waitlist'te tutulmuyor).
drop index if exists public.site_waitlist_ip_recent;

-- Ortak hız sınırı işlevi: ip_hash null ise sınır uygulanmaz (eskisi gibi; çağıran tarafta ip_hash üretilemiyorsa uyarı için bkz. rapor).
-- Eşzamanlı isteklerde say-sonra-ekle yarışı olmasın diye IP özeti başına işlem kilidi alınır.
create or replace function public.site_waitlist_rate_limited(p_ip_hash text, p_limit_per_hour integer)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  n integer;
begin
  delete from public.site_waitlist_attempts where at < now() - interval '1 day';
  if p_ip_hash is null then
    return false;
  end if;
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  insert into public.site_waitlist_attempts (ip_hash) values (p_ip_hash);
  select count(*) into n from public.site_waitlist_attempts where ip_hash = p_ip_hash and at > now() - interval '1 hour';
  return n > p_limit_per_hour;
end $$;

revoke all on function public.site_waitlist_rate_limited(text, integer) from public, anon, authenticated;
grant execute on function public.site_waitlist_rate_limited(text, integer) to service_role;

-- v1: imza aynı (geri dönüş yolu); davranış yeni sayaçla.
create or replace function public.site_waitlist_join(
  p_product text,
  p_email text,
  p_lang text,
  p_source text,
  p_autocad_version text,
  p_ip_hash text,
  p_limit_per_hour integer
) returns text
language plpgsql
set search_path = public
as $$
begin
  -- Eski sürümden kalan, hız sınırı için tutulmuş IP özetleri 1 günden eski satırlarda silinir.
  update public.site_waitlist set ip_hash = null where ip_hash is not null and created_at < now() - interval '1 day';

  if public.site_waitlist_rate_limited(p_ip_hash, p_limit_per_hour) then
    return 'rate_limited';
  end if;

  insert into public.site_waitlist (product, email, lang, source, autocad_version, ip_hash)
  values (p_product, lower(p_email), p_lang, p_source, p_autocad_version, null)
  on conflict (product, lower(email)) do nothing;

  if found then
    return 'added';
  end if;
  return 'exists';
end $$;

revoke all on function public.site_waitlist_join(text, text, text, text, text, text, integer) from public, anon, authenticated;
grant execute on function public.site_waitlist_join(text, text, text, text, text, text, integer) to service_role;

-- v2 (duyuru onayı kaydıyla): onay davranışı DEĞİŞMEDİ (Burak B2 hukuk kararı bekliyor); yalnız sayaç.
create or replace function public.site_waitlist_join_v2(
  p_product text,
  p_email text,
  p_lang text,
  p_source text,
  p_autocad_version text,
  p_ip_hash text,
  p_limit_per_hour integer,
  p_marketing boolean,
  p_consent_version text
) returns text
language plpgsql
set search_path = public
as $$
begin
  update public.site_waitlist set ip_hash = null where ip_hash is not null and created_at < now() - interval '1 day';

  if public.site_waitlist_rate_limited(p_ip_hash, p_limit_per_hour) then
    return 'rate_limited';
  end if;

  insert into public.site_waitlist (product, email, lang, source, autocad_version, ip_hash,
                                    marketing_consent, marketing_consent_at, marketing_consent_version)
  values (p_product, lower(p_email), p_lang, p_source, p_autocad_version, null,
          coalesce(p_marketing, false),
          case when coalesce(p_marketing, false) then now() end,
          case when coalesce(p_marketing, false) then p_consent_version end)
  on conflict (product, lower(email)) do nothing;

  if found then
    return 'added';
  end if;

  if coalesce(p_marketing, false) then
    update public.site_waitlist
       set marketing_consent = true, marketing_consent_at = now(), marketing_consent_version = p_consent_version, marketing_withdrawn_at = null
     where product = p_product and lower(email) = lower(p_email) and marketing_consent = false;
  end if;
  return 'exists';
end $$;

revoke all on function public.site_waitlist_join_v2(text, text, text, text, text, text, integer, boolean, text) from public, anon, authenticated;
grant execute on function public.site_waitlist_join_v2(text, text, text, text, text, text, integer, boolean, text) to service_role;
