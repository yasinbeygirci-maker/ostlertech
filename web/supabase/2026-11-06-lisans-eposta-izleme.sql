-- AreaPilot lisans kodu e-postasının TEK kez gitmesi için izleme sütunu (webhook: src/lib/paddle-events.ts).
-- Webhook, e-postayı göndermeden önce "key_email_sent_at is null" koşuluyla bu sütunu atomik olarak doldurur (talep); satır alamayan
-- eşzamanlı/yinelenen olay göndermez. Gönderim başarısız olursa sütun yeniden null yapılır, sonraki müşteri olayı yeniden dener.
-- EKLEMELİ ve geri alınabilir: mevcut satırlarda NULL kalır. Eskiye dönük e-posta GÖNDERİLMEZ: kod yalnız product = 'areapilot' satırlarına
-- bakar ve migrasyon anında AreaPilot lisansı yoktur; SyncPass satırları bu sütunu hiç kullanmaz.
-- Migrasyon uygulanmadan webhook e-posta talebi yazamaz: hata günlüğe düşer, lisans yine üretilir (kod /welcome sayfasında görünür).

alter table public.sp_licenses
  add column if not exists key_email_sent_at timestamptz;

-- Gönderilmemiş AreaPilot lisanslarını (müşteri e-postası gelince taranır) hızlı bulmak için kısmi indeks.
create index if not exists sp_licenses_areapilot_mail_pending_idx
  on public.sp_licenses (paddle_customer_id)
  where product = 'areapilot' and key_email_sent_at is null and email is not null;

-- Geri alma: drop index if exists public.sp_licenses_areapilot_mail_pending_idx; alter table public.sp_licenses drop column if exists key_email_sent_at;
