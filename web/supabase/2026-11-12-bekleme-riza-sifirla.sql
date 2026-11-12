-- Bekleme listesi: tek eski duyuru rıza kaydının SIFIRLANMASI (Zeynep metin kapısı, 2026-11-12; Yasin kararı: duyuru e-postası gönderilmeyecek).
-- UYGULANMADI, ÇALIŞTIRILMADI. Yasin onayıyla Supabase SQL Editor'de çalıştırılır (proje qpwodglvptnkpjcwhmqg).
--
-- SIRA (zorunlu): (1) yeni site yayınlanır (formda kutu yok), (2) 2026-11-12-bekleme-duyuru-kaldir.sql
--   (o da 2026-11-11-bekleme-deneme-sayaci.sql'den sonra), (3) bu dosya, (4) OstlerTech\imha-kaydi.md'ye satır eklenir (e-posta yazılmaz).
--
-- Yalnız rıza alanları boşaltılır; e-posta satırı SİLİNMEZ (bekleme listesi amacı sürüyor). Kaynak ve gerekçe:
--   hukuk/2026-11-12-bekleme-duyuru-kaldirma-metin-kapisi.md bölüm 2. Tekrar çalıştırılabilir.

-- 1) Önce say (salt okuma). Beklenen: rizali = 1, toplam = 7.
select count(*) filter (where marketing_consent) as rizali,
       count(*) filter (where marketing_consent_at is not null
                          or marketing_consent_version is not null
                          or marketing_withdrawn_at is not null) as riza_izi,
       count(*) as toplam
from public.site_waitlist;

-- 2) Sıfırla (yalnız rıza alanları; e-posta satırı kalır).
update public.site_waitlist
   set marketing_consent = false,
       marketing_consent_at = null,
       marketing_consent_version = null,
       marketing_withdrawn_at = null
 where marketing_consent
    or marketing_consent_at is not null
    or marketing_consent_version is not null
    or marketing_withdrawn_at is not null;

-- 3) Doğrula: 1. sorguyu yeniden çalıştır. Beklenen: rizali = 0, riza_izi = 0, toplam = 7.

-- 4) Başka tabloda rıza/pazarlama alanı var mı (salt okuma). Beklenen: yalnız site_waitlist'in 4 sütunu.
select table_name, column_name from information_schema.columns
 where table_schema = 'public' and (column_name ilike '%consent%' or column_name ilike '%marketing%');
