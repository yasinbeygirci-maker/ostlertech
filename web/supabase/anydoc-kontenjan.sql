-- EMEKLİ / ÇALIŞTIRMAYIN (2026-11-11, Burak B3/B4): bu nesneler canlıda VAR (1 satır) ama sitede çağıran kod yok. Anon erişimi
-- supabase/2026-11-11-anydoc-guvenli.sql ile kapatılır. Bu dosyayı yeniden çalıştırmak koşulsuz anon eklemesini/üyelik sorgusunu geri açar.
-- AnyDoc Kurucu Avantajı — ilk-100 kontenjan takibi (2026-09-17)
-- Supabase Dashboard > SQL Editor'de BİR KEZ çalıştırın.
-- Sonrası: GET /api/anydoc/bekleme kalan kontenjanı döner; landing sayfası canlı gösterir.

-- Sabit: kurucu kontenjanı (ilgilenirse ileride tabloya taşınır)
-- 100 kişilik kontenjan; kayıt sayısı select count(*) üzerinden canlı hesaplanır.

-- 1) Kalan kurucu kontenjanı — anon okuyabilir, satır verisi sızmaz (security definer + sabit dönüş)
create or replace function public.anydoc_kalan_kontenjan()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select greatest(0, 100 - (select count(*) from public.anydoc_waitlist));
$$;

-- 2) Verilen e-postanın sıra numarası (kayıt sırasına göre) — anon yalnız kendi e-postasını sorabilir
create or replace function public.anydoc_sira_numarasi(p_email text)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select sira from (
    select email, row_number() over (order by olusturma asc, id asc) as sira
    from public.anydoc_waitlist
  ) r
  where lower(r.email) = lower(p_email);
$$;

-- 3) Anon execute izni (RLS fonksiyonlara uygulanmaz; ayrıca execute verilir)
grant execute on function public.anydoc_kalan_kontenjan() to anon;
grant execute on function public.anydoc_sira_numarasi(text) to anon;
