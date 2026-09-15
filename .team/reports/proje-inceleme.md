# OstlerTech Ürün İnceleme ve Web Modernizasyon Raporu

**Tarih:** 2026-09-15  
**Hazırlayan:** Merve (Genel Asistan ve Orkestra Şefi) & Atlas (Web Mimar & Modernizasyon Lideri)

---

## 1. Giriş ve Proje Genel Bakış
Bu rapor, OstlerTech ekosistemine ait 5 ana mobil/masaüstü projenin teknik incelemelerini, ürün özetlerini ve `ostlertech.com` web sitesinin modern Next.js tabanlı mimari planını içermektedir.

---

## 2. Android ve Masaüstü Projeleri Ürün Özetleri

### 2.1. DiaSync
* **Konum:** `D:\Development\AndroidProjects\DiaSync`
* **Tür:** Android Mobil & Wear OS Uygulaması
* **Özet:** Sağlık/Diyabet takibi odaklı bir senkronizasyon uygulamasıdır. Akıllı telefon uygulaması ile akıllı saat (Wear OS) arasında entegre çalışarak sağlık verilerinin anlık takibini ve güvenli senkronizasyonunu sağlar.

### 2.2. EsnafCep
* **Konum:** `D:\Development\AndroidProjects\EsnafCep`
* **Tür:** Android Mobil Uygulaması
* **Özet:** Küçük esnaf ve KOBİ'lerin dijitalleşmesini, stok, cari hesap, satış ve gelir-gider takibini cep telefonlarından kolayca yapabilmelerini sağlayan pratik bir işletme yönetim aracıdır.

### 2.3. Projex
* **Konum:** `D:\Development\AndroidProjects\Projex`
* **Tür:** Kotlin Multiplatform / Masaüstü (Compose Multiplatform) Uygulaması
* **Özet:** Proje ve görev yönetim sistemidir. Compose Multiplatform altyapısı sayesinde hem masaüstü (`Projex.exe`) hem de çapraz platformda yüksek performanslı bir çalışma alanı sunar.

### 2.4. SyncPass
* **Konum:** `D:\Development\AndroidProjects\SyncPass`
* **Tür:** Android Mobil Şifre Yöneticisi & Bulut Senkronizasyon Uygulaması
* **Özet:** Kullanıcıların hassas verilerini ve şifrelerini güvenli bir kasada (`vault.dat`, bulut senkronizasyon özellikleri) saklayan, modern arayüze ve güvenlik mekanizmalarına sahip bir şifre yöneticisidir.

### 2.5. SyncPassDesktop
* **Konum:** `D:\Development\AndroidProjects\SyncPassDesktop`
* **Tür:** Desktop (JVM / Kotlin) Şifre Yöneticisi Uygulaması
* **Özet:** SyncPass ekosisteminin masaüstü uzantısıdır. JVM üzerinde çalışarak masaüstü ortamında şifre kasalarına güvenli erişim ve yönetim imkanı tanır.

---

## 3. ostlertech.com Modernizasyon Planı (Atlas)

Mevcut `web/` klasöründeki Next.js (`App Router`, `TypeScript`, `Tailwind CSS`) altyapısı temel alınarak aşağıdaki modernizasyon planı çıkarılmıştır:

1. **Ana Sayfa (Landing Page):**
   - OstlerTech vizyonunu yansıtan modern hero bölümü.
   - Öne çıkan ürünlerin (DiaSync, EsnafCep, Projex, SyncPass) kartları ve hızlı erişim bağlantıları.
2. **Ürünler Sayfası (`/products`):**
   - Her bir ürün için detaylı özellikler, ekran görüntüleri/mockup alanları ve indirme/inceleme bağlantıları.
3. **Kurumsal / Hakkımızda (`/about`):**
   - Ekip vizyonu, teknoloji yığını (Kotlin, Compose Multiplatform, Next.js, Android).
4. **İletişim (`/contact`):**
   - Modern form bileşenleri ve sosyal/kurumsal iletişim kanalları.
5. **Teknik Altyapı İyileştirmeleri:**
   - Tailwind CSS ile koyu/açık tema (Dark/Light mode) desteği.
   - SEO optimizasyonları (`sitemap.ts`, `robots.txt`, OpenGraph etiketleri).
   - Performans optimizasyonu (Image optimization, Server Components).
