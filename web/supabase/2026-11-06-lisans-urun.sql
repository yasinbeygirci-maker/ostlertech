-- Lisans tablosuna ürün sütunu (AreaPilot lisanslaması, plan: yonetim/2026-10-28-areapilot-satis-plani.md §2.2).
-- UYGULANMADI. Yasin onayıyla Supabase SQL editöründe çalıştırılır. Tekrar çalıştırılabilir (idempotent), yalnız ekler.
--
-- SIRA KURALI: bu dosya KODDAN ÖNCE uygulanır. Yeni kod sp_licenses.product sütununu okur/yazar; sütun yokken dağıtılırsa
-- SyncPass etkinleştirme dahil bütün lisans uç noktaları hata verir. Sütun varsayılanlı olduğundan mevcut satırlar (ve eski kod)
-- etkilenmez: mevcut satırlar otomatik 'syncpass_desktop' olur, eski kod product yazmadan eklese de varsayılan geçerli kalır.
-- Geri alma: alter table public.sp_licenses drop column product; (yalnız AreaPilot lisansı yokken).
--
-- Plan CHECK'i (month/year/lifetime) zaten yeterli: AreaPilot tek seferlik = 'lifetime'; Bireysel/Ofis/Firma farkı plan değil
-- max_devices (1/5/20), webhook bunu fiyat kimliğinden yazar.

alter table public.sp_licenses
  add column if not exists product text not null default 'syncpass_desktop';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sp_licenses_product_check' and conrelid = 'public.sp_licenses'::regclass
  ) then
    alter table public.sp_licenses
      add constraint sp_licenses_product_check check (product in ('syncpass_desktop', 'areapilot'));
  end if;
end $$;

-- Etkinleştirme sorgusu (license_key + product) license_key üzerindeki mevcut unique indeksiyle zaten hızlı; bu indeks
-- ürüne göre rapor/sayım ve e-posta ile arama içindir.
create index if not exists sp_licenses_product_status_idx on public.sp_licenses (product, status);
