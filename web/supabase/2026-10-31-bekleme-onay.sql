-- Bekleme listesi: yeni ürün / kampanya duyurusu e-postası için AYRI açık rıza kaydı (Zeynep T4-B, 2026-10-31).
-- UYGULANMADI. Yasin onayıyla uygulanır; ardından Vercel'de WAITLIST_CONSENT_DB=1 verilip site yeniden yayınlanır.
-- Uygulanmadan site yayınlanırsa: kutu işaretsiz kayıtlar eskisi gibi çalışır, kutu İŞARETLİ gönderim 503 ile reddedilir (onay sessizce kaybolmaz).
-- Tekrar çalıştırılabilir. Eski site_waitlist_join işlevi değişmez (geri dönüş yolu).
--
-- Kural: duyuru e-postası YALNIZ marketing_consent = true ve marketing_withdrawn_at is null satırlara gönderilir.
-- Beta bildirimleri (güncelleme, son kullanım tarihi) bu alana bağlı değildir (md. 5/2-c).

alter table public.site_waitlist
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists marketing_consent_at timestamptz,
  add column if not exists marketing_consent_version text check (marketing_consent_version is null or char_length(marketing_consent_version) <= 40),
  add column if not exists marketing_withdrawn_at timestamptz;

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
declare
  n integer;
begin
  update public.site_waitlist set ip_hash = null where ip_hash is not null and created_at < now() - interval '1 day';

  if p_ip_hash is not null then
    select count(*) into n from public.site_waitlist where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
    if n >= p_limit_per_hour then
      return 'rate_limited';
    end if;
  end if;

  insert into public.site_waitlist (product, email, lang, source, autocad_version, ip_hash,
                                    marketing_consent, marketing_consent_at, marketing_consent_version)
  values (p_product, lower(p_email), p_lang, p_source, p_autocad_version, p_ip_hash,
          coalesce(p_marketing, false),
          case when coalesce(p_marketing, false) then now() end,
          case when coalesce(p_marketing, false) then p_consent_version end)
  on conflict (product, lower(email)) do nothing;

  if found then
    return 'added';
  end if;

  -- Önceden kayıtlı kişi bu kez kutuyu işaretlediyse rıza kaydedilir (işaretlememesi mevcut rızayı silmez; geri alma ayrı yoldan).
  if coalesce(p_marketing, false) then
    update public.site_waitlist
       set marketing_consent = true, marketing_consent_at = now(), marketing_consent_version = p_consent_version, marketing_withdrawn_at = null
     where product = p_product and lower(email) = lower(p_email) and marketing_consent = false;
  end if;
  return 'exists';
end $$;

revoke all on function public.site_waitlist_join_v2(text, text, text, text, text, text, integer, boolean, text) from public, anon, authenticated;
grant execute on function public.site_waitlist_join_v2(text, text, text, text, text, text, integer, boolean, text) to service_role;
