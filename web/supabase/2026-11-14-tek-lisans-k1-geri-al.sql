-- SyncPass K1 göçünü GERİ ALIR (2026-11-14-tek-lisans-k1.sql'in tersi). UYGULANMADI; Yasin onayıyla Supabase SQL editöründe çalıştırılır.
--
-- NE ZAMAN: yalnız göçten sonra SORUN çıktıysa VE henüz hiç Play satırı yokken. Kod sorunuysa asıl geri alma Vercel "Instant Rollback"tir
--   (eski kod yeni sütunları okumaz, göç eski kodla uyumludur); bu dosya veritabanını da eski hâline döndürmek istediğinde kullanılır.
-- SIRA: (1) ÖNCE KODU geri al (Vercel önceki dağıtım; Play alanlarını SELECT etmeyen sürüm), (2) sonra bu dosya.
-- KORUMA: tek işlem. Herhangi bir Play satırı (source <> 'paddle'), jeton özeti (sp_play_tokens) ya da Play alanı dolu satır varsa HİÇBİR ŞEY yapmadan
--   hata verir (Play alıcılarının kodları ve jeton kayıtları gider; bu bilinçli ayrı karar ve ayrı onay ister). Paddle/AreaPilot satırlarına dokunmaz.
-- email: göç, K1 öncesi NOT NULL ise sütunun 'k1-oncesi-not-null' notunu bırakır; bu dosya NOT NULL'ı o durumda geri koyar (boş e-postalı satır
--   varsa durur ve söyler; önce o satırları elle düzelt). Not yoksa email olduğu gibi (boş bırakılabilir) kalır.
-- Dosyada "begin; ... commit;" vardır; bir adım hata verirse hiçbir değişiklik kalmaz.

begin;

do $$
declare
  v_play bigint := 0;
  v_tok bigint := 0;
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'source') then
    execute $q$select count(*) from public.sp_licenses
               where source <> 'paddle' or play_token_hash is not null or play_purchase_token is not null or play_product_id is not null$q$ into v_play;
  end if;
  if to_regclass('public.sp_play_tokens') is not null then
    execute 'select count(*) from public.sp_play_tokens' into v_tok;
  end if;
  if v_play > 0 or v_tok > 0 then
    raise exception 'Geri alma DURDU: % Play lisans satiri ve % jeton ozeti var; bunlari silmek ayri karar (Yasin + Burak). Hicbir sey degismedi.', v_play, v_tok;
  end if;
end $$;

drop function if exists public.sp_claim_play_license(text, text, text, text, text, int, text, text, timestamptz, text, timestamptz, text, boolean);
drop function if exists public.sp_play_mark_voided(text, timestamptz);
drop function if exists public.sp_rotate_play_license(uuid, text, timestamptz);
drop function if exists public.sp_play_license_json(uuid);
drop function if exists public.sp_play_expire_stale(timestamptz);
drop table if exists public.sp_play_tokens;

alter table public.sp_licenses drop constraint if exists sp_licenses_play_consistency;
alter table public.sp_licenses drop constraint if exists sp_licenses_source_check;
alter table public.sp_licenses drop constraint if exists sp_licenses_play_product_check;
drop index if exists public.sp_licenses_play_token_hash_uq;
alter table public.sp_licenses
  drop column if exists source,
  drop column if exists play_purchase_token,
  drop column if exists play_token_hash,
  drop column if exists play_product_id,
  drop column if exists play_state,
  drop column if exists play_checked_at;

do $$
begin
  if coalesce(col_description('public.sp_licenses'::regclass, (select attnum from pg_attribute where attrelid = 'public.sp_licenses'::regclass and attname = 'email')), '') = 'k1-oncesi-not-null' then
    if exists (select 1 from public.sp_licenses where email is null) then
      raise exception 'email K1 oncesi NOT NULL idi ama bos e-postali satir var; once o satirlari duzelt, sonra bu dosyayi yeniden calistir (hicbir sey degismedi)';
    end if;
    alter table public.sp_licenses alter column email set not null;
    comment on column public.sp_licenses.email is null;
  end if;
end $$;

commit;
