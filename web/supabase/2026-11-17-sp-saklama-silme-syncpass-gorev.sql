-- SyncPass masaustu lisans kayitlari: saklama silmesi KURULUM / DRY-RUN / GOREV / GERI AL (Ö3, Zeynep 2026-11-17 §3.3).
-- UYGULANMADI. Yasin Supabase SQL Editor'de (proje "OstlerTech") BIR BLOK ARDINDAN OBURU calistirir; MCP'den denenmez.
-- On kosul: 2026-11-10-sp-saklama-silme-syncpass.sql (islevi kurar, veri silmez, gorev kurmaz) dosyasinin TAMAMI once calismis olmali.
-- Sira: 0 -> (2026-11-10 dosyasi) -> 1 -> 2 -> 3 (ilk gercek kosu, Yasin onayi) -> 4 (gorev, ayri onay) -> 5 (dogrulama).

-- 0) ON DENETIM (salt okur): sp_licenses'a bagli bütün FK'ler cascade olmali (confdeltype = 'c'); bugun oyle.
-- select conrelid::regclass as tablo, confdeltype from pg_constraint where confrelid = 'public.sp_licenses'::regclass and contype = 'f';

-- 1) DRY-RUN (hicbir sey silmez). Beklenen bugun: licenses 0, devices 0, manual_review 0.
select public.sp_purge_ended_licenses_syncpass(now(), true);

-- 2) ILK GERCEK KOSU (elle, Yasin onayi): bugun 0 siler ama sp_purge_log'a 'syncpass_desktop' satiri yazar (imha kaydi ilk kosu olcutu).
-- select public.sp_purge_ended_licenses_syncpass(now(), false);

-- 3) GOREV (ayri onay): haftalik, Pazartesi 03:27 UTC (AreaPilot gorevi 03:17 ile 10 dk arayla; Silme Yon. md. 11/2 "en cok 6 ay" araliginin icinde).
-- select cron.schedule('sp-purge-ended-licenses-syncpass', '27 3 * * 1', $job$select public.sp_purge_ended_licenses_syncpass(now(), false)$job$);

-- 4) DOGRULAMA (salt okur)
-- select proname from pg_proc where proname = 'sp_purge_ended_licenses_syncpass';
-- select jobname, schedule, active, command from cron.job where jobname like 'sp-purge%';
-- select status, return_message, start_time from cron.job_run_details
--  where jobid = (select jobid from cron.job where jobname = 'sp-purge-ended-licenses-syncpass') order by start_time desc limit 3;  -- ilk pazartesiden sonra
-- select run_at, product, deleted_licenses, manual_review from public.sp_purge_log order by run_at desc limit 5;  -- 'syncpass_desktop' satiri gorunmeli

-- GERI AL (gorevi kaldirir; silinen veri geri gelmez, bu yuzden ilk kosu dry-run):
-- select cron.unschedule('sp-purge-ended-licenses-syncpass');
-- drop function public.sp_purge_ended_licenses_syncpass(timestamptz, boolean);   -- yalniz islevi de kaldirmak istenirse

-- imha-kaydi.md: kurulum gunu "mekanizma kuruldu, 0 silme" satiri; ilk gercek silmede 2026-11-10 dosyasinin sonundaki satir onerisi.
-- Gorev hatasi sessizdir (pg_cron yalniz job_run_details'e yazar): Karargah aylik bakisina bu iki sorgu eklenir.
