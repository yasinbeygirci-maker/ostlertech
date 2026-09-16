# Atlas — AnyDoc Harekâtı Teknik Brif ve Planı

**Tarih:** 16 Eylül 2026 Çarşamba, 08:11  
**Sorumlu:** Atlas  
**Hedef:** `ostlertech.com/anydoc` altında Firecrawl/AnyDoc (Rust tabanlı belge -> Markdown motoru) için yüksek dönüşümlü landing sayfası ve bekleme listesi altyapısı kurmak.

---

### 1. Sayfa Bölümleri ve Yapı
Landing sayfası Next.js App Router kullanılarak `app/anydoc/page.tsx` altında konumlandırılacak olup şu bölümlerden oluşacaktır: **Hero** (Çarpıcı başlık, Rust performans vurgusu, hızlı arama/dönüşüm önizlemesi ve "Erken Erişim Al" CTA butonu), **Nasıl Çalışır (3 Adım)** (1. Belgeyi yükle/URL gir, 2. Rust AnyDoc motoru ile anında ayrıştırma, 3. Temiz Markdown çıktısı al), **Benchmark** (Python/JS tabanlı çözümlere kıyasla 10x hız ve bellek optimizasyonu kıyaslama tablosu), **Fiyatlandırma / Paketler** (Geliştirici, Pro ve Enterprise katmanları ön izlemesi), **Bekleme Listesi CTA** (E-posta toplama formu ve anlık başarı durumu), ve **Sıkça Sorulan Sorular (SSS)** (Desteklenen formatlar, güvenlik, API erişimi hakkında akordeon yapısı).

### 2. Bekleme Listesi Veri Modeli ve Teknik Yığın Uyumu
Supabase üzerinde `anydoc_waitlist` tablosu oluşturulacaktır; tablo şeması `id` (uuid, PK), `email` (text, unique, not null), `source` (text, trafik kaynağı takibi için) ve `created_at` (timestamptz, default now()) alanlarını içerecektir. Güvenlik için Supabase RLS (Row Level Security) aktif edilerek yalnızca `anon` rolünün `INSERT` yapmasına izin verilecek (`SELECT`/`UPDATE`/`DELETE` kapatılacak). Teknik yığın olarak mevcut Next.js App Router, Tailwind CSS bileşen kütüphanesi ve proje genelinde kullanılan standart Supabase istemcisi (`@supabase/ssr` veya `@supabase/supabase-js`) kullanılacaktır.

### 3. Riskler ve Önlemler
Bu harekette öngörülen ana riskler spam kayıtlar/bot saldırıları ve API/form rate limit aşımıdır. Bu risklere karşı form seviyesinde honeypot alanı ve istemci tarafında basit bir e-posta format doğrulaması uygulanırken; Supabase tarafında veritabanı kısıtları (unique email) ve Next.js API Route / Server Action katmanında IP tabanlı rate limiting (örn. Upstash Redis veya basit bellek tabanlı eşik kontrolü) devreye alınacaktır.
