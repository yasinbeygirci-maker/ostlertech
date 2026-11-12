-- Bekleme listesi: duyuru (pazarlama) rızası toplamaktan vazgeçildi (Yasin kararı, 2026-11-12; Burak B2).
-- UYGULANMADI. Yasin onayıyla Supabase SQL Editor'de çalıştırılır (proje qpwodglvptnkpjcwhmqg). Tekrar çalıştırılabilir.
--
-- SIRA (zorunlu): önce 2026-10-23-bekleme-listesi.sql ve 2026-10-31-bekleme-onay.sql (canlıda uygulı), sonra
--   2026-11-11-bekleme-deneme-sayaci.sql (UYGULANMADI, hız sınırı işlevi site_waitlist_rate_limited'ı o kurar), EN SON bu dosya.
--   Bu dosya 2026-11-11 dosyalarından önce çalıştırılamaz (rate_limited işlevi yoksa v2 hata verir).
--
-- Ne yapar: site_waitlist_join_v2 imzasını korur (eski site sürümü çağırsa bile kırılmaz) ama artık HİÇBİR satırda rıza yazmaz:
--   * yeni satırda marketing_consent = false kalır,
--   * var olan satırın rızasını açmaz (Burak B2: doğrulamasız rıza açma kapanır),
--   * p_marketing ve p_consent_version parametreleri yok sayılır.
-- Yeni site sürümü zaten v2'yi çağırmaz (yalnız site_waitlist_join). v2 yalnız geri dönüş/uyumluluk için durur.
--
-- Ne YAPMAZ: marketing_consent sütunlarına ve MEVCUT rıza kayıtlarına (marketing_consent = true satırlar) DOKUNMAZ, silmez, sıfırlamaz.
--   Bu satırların sayısı bilinmiyor; kayıtların silinip silinmeyeceği (kanıt olarak tutma / imha) Zeynep + Yasin kararıdır.
--   Sayı için (salt okunur): select count(*) from public.site_waitlist where marketing_consent;

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

  -- Rıza sütunları hiç yazılmaz (varsayılan false/null). p_marketing bilerek kullanılmıyor.
  insert into public.site_waitlist (product, email, lang, source, autocad_version, ip_hash)
  values (p_product, lower(p_email), p_lang, p_source, p_autocad_version, null)
  on conflict (product, lower(email)) do nothing;

  if found then
    return 'added';
  end if;
  return 'exists';
end $$;

revoke all on function public.site_waitlist_join_v2(text, text, text, text, text, text, integer, boolean, text) from public, anon, authenticated;
grant execute on function public.site_waitlist_join_v2(text, text, text, text, text, text, integer, boolean, text) to service_role;
