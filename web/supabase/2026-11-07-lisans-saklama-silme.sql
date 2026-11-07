-- AreaPilot lisans kayıtlarının SAKLAMA SÜRESİ SİLMESİ: lisans iade/iptal olduktan 1 yıl sonra kayıt silinir.
-- (Gizlilik Politikası §9: "Lisans kayıtları lisans geçerli olduğu sürece ve lisans sona erdikten ya da iade edildikten sonra 1 yıl saklanır".)
--
-- !!! GİZLİLİK §9'DAKİ "1 YIL" CÜMLESİ BU MİGRASYON CANLIDA UYGULANANA VE pg_cron GÖREVİ ÇALIŞANA DEK YAYINLANMAMALIDIR. !!!
--
-- UYGULANMADI. Veri silen bir işlev kurar: Claude/Yasin onayıyla Supabase SQL editöründe çalıştırılır (ajan canlı veritabanına uygulamaz).
-- PGlite (bellek içi Postgres) üzerinde sahte satırlarla sınandı (Burak 2026-11-07 + düzeltmeler sonrası Can; FK cascade'li ve cascade'siz iki biçimde, iki kez
-- uygulama dahil). GERÇEK Supabase'te sınanmadı: pg_cron, gerçek FK listesi ve gerçek roller canlıda ilk elle dry-run'da görülür.
-- Tek işlem (begin...commit), tekrar çalıştırılabilir (idempotent). Önce 2026-11-06-lisans-urun.sql uygulanmış olmalı (product sütunu).
-- Geri alma: select cron.unschedule('sp-purge-ended-licenses'); drop function public.sp_purge_ended_licenses(timestamptz, boolean);
--   drop trigger sp_licenses_ended_at_trg on public.sp_licenses; drop function public.sp_licenses_set_ended_at(); drop table public.sp_purge_log;
--   alter table public.sp_licenses drop column ended_at;
--
-- NE SİLİNİR (yalnız product = 'areapilot'; SyncPass Desktop satırları bu işin DIŞINDA, kendi saklama kuralı ayrı karar):
--   sp_licenses  : status in ('refunded','canceled','revoked') VE ended_at < p_now - 1 yıl olan satırlar (e-posta, Paddle numaraları, lisans kodu)
--                  ('revoked' = sözleşmeye aykırılık nedeniyle elle iptal; Zeynep §8.2 / Burak D-2 kararı: iade ile aynı 1 yıl ölçüsü.)
--                  ended_at'i BOŞ bitmiş satır silinmez; sp_purge_log.manual_review sayısına yazılır ("elle bak").
--   sp_license_devices : o lisansların bilgisayar satırları  -> işlev AÇIKÇA siler (aşağıdaki cascade notuna bak)
--   sp_license_removals / sp_license_resets / sp_license_reset_tokens : cascade (2026-11-06-lisans-urun.sql: on delete cascade)
--   sp_paddle_customers : silinen lisansların Paddle müşterisi, başka hiçbir lisans (SyncPass dahil) o müşteriye bağlı kalmadıysa
--   dokunulmaz: sp_paddle_events (yalnız olay kimliği, kişisel veri yok); status = 'active' olan hiçbir lisans (tek seferlik lisans bitmez).
--
-- sp_license_devices CASCADE DURUMU: tablonun CREATE TABLE'ı bu depoda YOK (canlı şemada; satış planı §: PK license_id+device_id, app_version,
--   first/last_seen). license_id yabancı anahtarının "on delete cascade" olup olmadığı depodan DOĞRULANAMADI. Bu yüzden işlev önce bu tabloyu
--   kendisi siler; cascade varsa zararsız, yoksa lisans silme FK hatasıyla düşmez. Canlıda bakmak için:
--     select conname, confdeltype from pg_constraint where conrelid = 'public.sp_license_devices'::regclass and contype = 'f';  -- 'c' = cascade
--
-- ended_at (iade/iptal anı): sp_licenses.updated_at e-posta güncellemesinde de ilerlediği (paddle-events.ts:90) için 1 yıl sayacına
--   uygun değil; iade/iptal anını tutan ayrı sütun + tetikleyici eklenir. Tetikleyici sayesinde webhook kodu DEĞİŞMEZ (iade olayı
--   status'u 'refunded' yaptığı an ended_at dolar; lisans yeniden 'active' olursa ended_at boşalır).
--   Burak D-1: durum bitiş durumuna GEÇTİĞİ an ended_at = now() yazılır (updated_at DEĞİL): SQL editöründe updated_at verilmeden yapılan
--   elle iade, eski bir updated_at yüzünden bir sonraki haftalık koşuda silinmesin. Yalnız geriye dönük etiketleme (aşağıdaki 1. adım
--   update'i) updated_at kullanır; o satırlar zaten bitmiştir ve gerçek iade anına en yakın değer budur.
--
-- CANLIDA UYGULAMADAN ÖNCE (Burak D-3), salt-okur, çıktıları Yasin'e göster:
--   a) sp_licenses ve sp_paddle_customers'a başvuran BÜTÜN yabancı anahtarlar (yalnız sp_license_devices değil):
--        select conrelid::regclass as tablo, conname, confdeltype as silme_kurali  -- c = cascade
--          from pg_constraint where contype = 'f' and confrelid in ('public.sp_licenses'::regclass, 'public.sp_paddle_customers'::regclass);
--      Listede cascade'siz ('a' = no action, 'r' = restrict) ve işlevin açıkça silmediği bir tablo varsa işlev FK hatasıyla düşer: önce onu ekle.
--   b) Görev başarısızlığı SESSİZDİR (pg_cron hatayı yalnız cron.job_run_details'a yazar; hata olunca tek işlem geri sarılır, sp_purge_log'a satır da düşmez).
--      Ayda bir bak (takvim/Karargâh):
--        select status, return_message, start_time from cron.job_run_details
--          where jobid = (select jobid from cron.job where jobname = 'sp-purge-ended-licenses') order by start_time desc limit 5;
--        select * from public.sp_purge_log order by run_at desc limit 5;   -- son haftalarda satır yoksa görev çalışmıyor demektir
--   c) İlk gerçek koşu ELLE: önce select public.sp_purge_ended_licenses(now(), true); sonra (Yasin onayıyla) (now(), false).

begin;

-- 0) Ön denetim ----------------------------------------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'sp_licenses' and column_name = 'product') then
    raise exception 'sp_licenses.product yok; once 2026-11-06-lisans-urun.sql uygulanmali';
  end if;
end $$;

-- 1) ended_at sütunu + tetikleyici ------------------------------------------------------------------------------------------
alter table public.sp_licenses add column if not exists ended_at timestamptz;

-- Mevcut iade/iptal satırları için en iyi tahmin: updated_at (o satırlarda iade anına en yakın değer). Yalnız boş olanlara yazar.
-- Bugün AreaPilot satışı açılmadığı için AreaPilot satırı yoktur; bu adım SyncPass satırlarını yalnız etiketler, silmez.
update public.sp_licenses set ended_at = updated_at
  where ended_at is null and status in ('refunded', 'canceled', 'revoked') and updated_at is not null;

create or replace function public.sp_licenses_set_ended_at() returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status in ('refunded', 'canceled', 'revoked') then
    -- Bitiş anı, durum bitişe GEÇTİĞİ an now() ile bir kez yazılır (Burak D-1: updated_at'e güvenilmez).
    -- Sonraki güncellemeler (e-posta vb.) onu ilerletmez: status değişmediyse NEW.ended_at eski değeri taşır.
    -- (INSERT'te OLD yok: koşullar iç içe, tek ifadede OR ile birleştirilmez.)
    if new.ended_at is null then
      new.ended_at := now();
    elsif tg_op = 'UPDATE' then
      if old.status not in ('refunded', 'canceled', 'revoked') then
        new.ended_at := now(); -- bitişe yeni geçti: eski ended_at (varsa) geçersiz
      end if;
    end if;
  else
    new.ended_at := null; -- lisans yeniden geçerli olduysa sayaç sıfırlanır
  end if;
  return new;
end $$;

drop trigger if exists sp_licenses_ended_at_trg on public.sp_licenses;
create trigger sp_licenses_ended_at_trg
  before insert or update of status on public.sp_licenses
  for each row execute function public.sp_licenses_set_ended_at();

-- Silme sorgusunu hızlandıran kısmi indeks (yalnız bitmiş lisanslar).
create index if not exists sp_licenses_ended_idx on public.sp_licenses (product, ended_at) where ended_at is not null;

-- 2) İmha günlüğü: kişisel veri YOK, yalnız sayılar -------------------------------------------------------------------------------
-- Her gerçek çalıştırma bir satır yazar (0 silinse de: Silme/Yok Etme Yönetmeliği md. 11/2 periyodik imhanın yapıldığını göstermek ister).
-- Satırlar en az 3 yıl tutulur (Yön. md. 7/3): bu tablodan SİLME YAPILMAZ. imha-kaydi.md satırı bu tablodan elle çıkarılır (Zeynep özeti).
create table if not exists public.sp_purge_log (
  id bigint generated always as identity primary key,
  run_at timestamptz not null default now(),
  product text not null,
  retention_days int not null,
  deleted_licenses int not null,
  deleted_devices int not null,
  deleted_customers int not null
);
-- "Elle bak": status bitmiş ama ended_at BOŞ olan AreaPilot satırı sayısı (silinmez; Zeynep §8.2). Önceden kurulduysa sütun eklenir.
alter table public.sp_purge_log add column if not exists manual_review int not null default 0;
alter table public.sp_purge_log enable row level security; -- politika YOK: yalnız service_role/postgres
-- Derinlikli savunma (Burak B-2): varsayılan tablo yetkileri anon/authenticated'dan da alınır (RLS zaten kapatıyor).
revoke all on table public.sp_purge_log from anon, authenticated;

-- 3) Silme işlevi -------------------------------------------------------------------------------------------------------------
-- p_dry_run = true (VARSAYILAN): hiçbir şey silmez, sayıları ve lisans kimliklerini (kod/e-posta DEĞİL) döndürür.
-- p_dry_run = false: tek işlemde siler, sp_purge_log'a satır yazar.
create or replace function public.sp_purge_ended_licenses(
  p_now timestamptz default now(),
  p_dry_run boolean default true
) returns jsonb
language plpgsql
set search_path = public
as $$
declare
  c_days constant int := 365;
  v_ids uuid[];
  v_customers text[];
  v_devices int := 0;
  v_cust_del int := 0;
  v_lic_del int := 0;
  v_manual int := 0;
begin
  -- Burak B-2: p_now ileri alınarak saklama süresi atlanamasın (geçmişe çekmek yalnız silmeyi azaltır).
  if p_now > now() + interval '1 day' then
    raise exception 'p_now gelecekte olamaz (saklama suresi atlanamaz)';
  end if;

  select coalesce(array_agg(id), '{}'), coalesce(array_agg(distinct paddle_customer_id) filter (where paddle_customer_id is not null), '{}')
    into v_ids, v_customers
    from public.sp_licenses
    where product = 'areapilot'
      and status in ('refunded', 'canceled', 'revoked')
      and ended_at is not null
      and ended_at < p_now - make_interval(days => c_days);

  select count(*) into v_manual from public.sp_licenses
    where product = 'areapilot' and status in ('refunded', 'canceled', 'revoked') and ended_at is null;

  select count(*) into v_devices from public.sp_license_devices where license_id = any (v_ids);

  if p_dry_run then
    return jsonb_build_object(
      'dry_run', true,
      'licenses', coalesce(array_length(v_ids, 1), 0),
      'devices', v_devices,
      'manual_review', v_manual,
      'license_ids', to_jsonb(v_ids)
    );
  end if;

  if coalesce(array_length(v_ids, 1), 0) > 0 then
    -- Cascade durumu depodan doğrulanamadığı için bilgisayar satırları açıkça silinir (cascade varsa zararsız).
    delete from public.sp_license_devices where license_id = any (v_ids);
    -- removals/resets/reset_tokens: on delete cascade (2026-11-06-lisans-urun.sql).
    delete from public.sp_licenses where id = any (v_ids) and product = 'areapilot' and status in ('refunded', 'canceled', 'revoked');
    get diagnostics v_lic_del = row_count;

    -- Paddle müşterisi: başka hiçbir lisans (SyncPass dahil) ona bağlı kalmadıysa silinir.
    delete from public.sp_paddle_customers pc
      where pc.paddle_customer_id = any (v_customers)
        and not exists (select 1 from public.sp_licenses l where l.paddle_customer_id = pc.paddle_customer_id);
    get diagnostics v_cust_del = row_count;
  end if;

  insert into public.sp_purge_log (run_at, product, retention_days, deleted_licenses, deleted_devices, deleted_customers, manual_review)
    values (p_now, 'areapilot', c_days, v_lic_del, v_devices, v_cust_del, v_manual);

  return jsonb_build_object('dry_run', false, 'licenses', v_lic_del, 'devices', v_devices, 'customers', v_cust_del, 'manual_review', v_manual);
end $$;

-- Yetki: yalnız service_role (ve görevi çalıştıran postgres) çalıştırabilir.
revoke all on function public.sp_purge_ended_licenses(timestamptz, boolean) from public, anon, authenticated;
revoke all on function public.sp_licenses_set_ended_at() from public, anon, authenticated;
grant execute on function public.sp_purge_ended_licenses(timestamptz, boolean) to service_role;

-- 4) Haftalık görev (pg_cron) -------------------------------------------------------------------------------------------------
-- Supabase'de pg_cron panelden (Database > Extensions) açılır; açık değilse bu blok NOTICE verir ve görev KURULMAZ (migrasyon yine tamamlanır).
-- Pazartesi 03:17 UTC. Görev kurulmadan önce işlevi elle "select public.sp_purge_ended_licenses(now(), true);" ile dene.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('sp-purge-ended-licenses', '17 3 * * 1', $job$select public.sp_purge_ended_licenses(now(), false)$job$);
  else
    raise notice 'pg_cron kurulu degil: gorev KURULMADI. Extensions bolumunden pg_cron''u ac ve bu blogu yeniden calistir (ya da 6 ayda bir elle: select public.sp_purge_ended_licenses(now(), false);).';
  end if;
end $$;

commit;

-- SINAMA (hazırlık projesinde, canlıda DEĞİL; sahte satırlarla) -----------------------------------------------------------------
-- 1) areapilot satırları ekle: (a) refunded, ended_at = now()-400 gün, 2 cihaz; (b) refunded, now()-100 gün; (c) active, created 2 yıl önce;
--    (d) refunded 400 gün ama müşterisi başka bir ACTIVE lisansa da bağlı (müşteri satırı kalmalı).
-- 2) select public.sp_purge_ended_licenses(now(), true);  -> licenses=2 (a,d), devices=2, hiçbir satır silinmemiş.
-- 3) select public.sp_purge_ended_licenses(now(), false); -> yalnız a ve d silinir; b ve c kalır; (a)'nın müşterisi silinir, (d)'ninki kalır;
--    sp_purge_log'a 1 satır yazılır; hemen ikinci çalıştırma 0 siler (yine bir günlük satırı).
-- 4) update sp_licenses set email='x' where id = <b>;  -> ended_at DEĞİŞMEMELİ; status='active' yapınca ended_at null olmalı.
-- 5) Korumayı boz: işlevden "status in (...)" süzgecini çıkarıp testin (c)'yi sildiğini gör, sonra geri koy.
-- Canlıda ilk gerçek silme, ilk iade/bitişten 1 yıl sonra olur; imha-kaydi.md satırı ilk gerçek silmede yazılır (biçim: pazarlama/2026-11-07-areapilot-1-0-hukuk-kapisi.md §8.1).
