-- AnyDoc tablosu ve işlevleri: anon erişimini KAPAT (Burak B3/B4, 2026-11-11; Cloudflare security-audit skill bulguları).
-- UYGULANMADI. Yasin onayıyla Supabase SQL Editor'de çalıştırılır (proje qpwodglvptnkpjcwhmqg). Tekrar çalıştırılabilir.
--
-- Durum (2026-11-11, salt okur sorguyla canlıda görüldü): anydoc_waitlist tablosu (1 satır), anydoc_waitlist_sayac görünümü ve
-- anydoc_kalan_kontenjan / anydoc_sira_numarasi işlevleri CANLIDA VAR; iki işlev anon ve authenticated'a açık. Sitede (src/) bu
-- nesneleri çağıran kod ve /api/anydoc ucu YOK. Ürün (AnyDoc, "Atlas" planı) yürütülmüyor.
-- Bulgular: B3 anydoc_sira_numarasi security definer + anon: herkes bir e-postanın listede olup olmadığını ve sırasını öğrenir.
-- B4 anon insert politikası koşulsuz (with check true): sahte kayıtlarla 100'lük kurucu kontenjanı doldurulabilir; sayaç görünümü
-- security_invoker olmadığı için anon'a kayıt sayısını gösterir.
--
-- Bu dosya VERİYİ SİLMEZ. Anon/authenticated için her erişimi kapatır; tablo ve işlevler yerinde kalır (yeniden açmak istenirse
-- karar sonradan verilir). Kalıcı kaldırma için en alttaki yorum satırlı blok, 1 satırlık kaydın silineceği ve Yasin'in onayıyla.

-- 1) Koşulsuz anon insert politikasını kaldır
drop policy if exists "anon insert-only" on public.anydoc_waitlist;

-- 2) Tablo, görünüm ve işlevlerde anon/authenticated yetkisi yok
revoke all on public.anydoc_waitlist from anon, authenticated;
revoke all on public.anydoc_waitlist_sayac from anon, authenticated;
revoke all on function public.anydoc_kalan_kontenjan() from public, anon, authenticated;
revoke all on function public.anydoc_sira_numarasi(text) from public, anon, authenticated;

-- 3) Görünüm bundan sonra çağıranın yetkisiyle çalışsın (PostgreSQL 15+)
alter view public.anydoc_waitlist_sayac set (security_invoker = true);

-- Kalıcı kaldırma (Yasin onayı + Zeynep: 1 satırdaki e-posta kişisel veri; imha kaydı yazılır):
-- drop view if exists public.anydoc_waitlist_sayac;
-- drop function if exists public.anydoc_kalan_kontenjan();
-- drop function if exists public.anydoc_sira_numarasi(text);
-- drop table if exists public.anydoc_waitlist;
