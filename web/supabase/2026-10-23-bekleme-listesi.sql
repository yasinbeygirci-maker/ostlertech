-- Ürün bağımsız bekleme / beta listesi (ostlertech.com). İlk kullanım: AreaPilot açık beta (indirme bağlantısı e-posta bırakana
-- sayfada verilir; e-posta yalnız beta bildirimleri içindir, satış/tanıtım e-postası gönderilmez: İYS kaydı yok, hukuk 2026-10-23 A yolu). Proje: qpwodglvptnkpjcwhmqg. 2026-10-23'te Yasin onayıyla canlıya uygulandı (migration site_waitlist_bekleme_listesi).
-- Tekrar çalıştırılabilir. 2026-10-23'te PGlite ile denendi (çift kayıt, hız sınırı, IP özetinin silinmesi, RLS).
--
-- Not: sitedeki eski components/Waitlist.tsx "waitlist" adlı, veritabanında OLMAYAN bir tabloya yazıyordu ve hiçbir sayfada
-- kullanılmıyor. Bu tablo ayrı adla (site_waitlist) kurulur; tarayıcıdan doğrudan yazılamaz, yalnız sunucu (service_role) yazar.
--
-- Kişisel veri: e-posta (+ dil, kaynak, isteğe bağlı AutoCAD sürümü). Tekillik ürün + e-posta çiftine göre. IP adresi SAKLANMAZ; yalnız hız sınırı için sunucu gizli anahtarıyla alınmış
-- HMAC özeti tutulur ve 1 gün sonra silinir. Saklama (ic-kurallar): ürün çıktıktan / satış açıldıktan 6 ay sonra silinir.

create table if not exists public.site_waitlist (
  id          uuid primary key default gen_random_uuid(),
  product     text not null check (product ~ '^[a-z0-9-]{2,40}$'),
  email       text not null check (char_length(email) between 5 and 200),
  lang        text not null default 'tr' check (lang in ('tr', 'en')),
  source      text not null default 'site' check (source ~ '^[a-z0-9_]{2,40}$'),
  autocad_version text check (autocad_version is null or autocad_version ~ '^(20(1[3-9]|2[0-7])|unknown)$'), -- isteğe bağlı (AreaPilot)
  ip_hash     text,                                   -- yalnız hız sınırı; 1 gün sonra null
  created_at  timestamptz not null default now(),
  notified_at timestamptz                             -- son beta bildirimi (kritik düzeltme, beta bitişi)
);

-- Çift kayıt yok: aynı ürün için aynı e-posta (büyük/küçük harf farkı gözetilmez) bir kez.
create unique index if not exists site_waitlist_product_email on public.site_waitlist (product, lower(email));
create index if not exists site_waitlist_ip_recent on public.site_waitlist (ip_hash, created_at) where ip_hash is not null;

alter table public.site_waitlist enable row level security;
revoke all on public.site_waitlist from anon, authenticated;

-- Kayıt: 'added' | 'exists' | 'rate_limited'. Hız sınırı aynı IP özetinden son 1 saatteki kayıt sayısıyla.
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
declare
  n integer;
begin
  -- Hız sınırı için tutulan IP özetleri 1 günden eski kayıtlarda silinir.
  update public.site_waitlist set ip_hash = null where ip_hash is not null and created_at < now() - interval '1 day';

  if p_ip_hash is not null then
    select count(*) into n from public.site_waitlist where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
    if n >= p_limit_per_hour then
      return 'rate_limited';
    end if;
  end if;

  insert into public.site_waitlist (product, email, lang, source, autocad_version, ip_hash)
  values (p_product, lower(p_email), p_lang, p_source, p_autocad_version, p_ip_hash)
  on conflict (product, lower(email)) do nothing;

  if found then
    return 'added';
  end if;
  return 'exists';
end $$;

revoke all on function public.site_waitlist_join(text, text, text, text, text, text, integer) from public, anon, authenticated;
grant execute on function public.site_waitlist_join(text, text, text, text, text, text, integer) to service_role;
