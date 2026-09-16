-- AnyDoc bekleme listesi — Atlas planı (2026-09-16)
-- Supabase Dashboard > SQL Editor'de BİR KEZ çalıştırın.
-- Sonrası: /api/anydoc/bekleme canlı kayıt almaya başlar.

-- 1) Tablo
create table if not exists public.anydoc_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  kaynak text not null default 'landing',
  olusturma timestamptz not null default now()
);

-- 2) RLS: anon yalnızca INSERT yapabilir (SELECT/UPDATE/DELETE kapalı)
alter table public.anydoc_waitlist enable row level security;

drop policy if exists "anon insert-only" on public.anydoc_waitlist;
create policy "anon insert-only"
  on public.anydoc_waitlist
  for insert
  to anon
  with check (true);

-- 3) Kayıt sayacı (basit metrik için opsiyonel görünüm)
create or replace view public.anydoc_waitlist_sayac as
  select count(*) as kayit_sayisi from public.anydoc_waitlist;
