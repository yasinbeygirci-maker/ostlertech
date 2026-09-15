# Adım Planı: /products Sayfası Oluşturulması

1. **Adım:** `Navbar.tsx` içerisindeki "Ürünler" linklerini `/products` olarak güncelle (hem masaüstü hem mobil).
2. **Adım:** `web/src/app/products/page.tsx` dosyasını oluştur:
   - Metadata (`title: "Ürünler | OstlerTech"`, açıklama vb.)
   - `URUNLER` verisini `web/src/lib/urunler.ts`'ten içe aktar.
   - İkon eşleme için `lucide-react`'ten dinamik ikon bileşenleri haritalaması (`HeartPulse`, `Store`, `Kanban`, `ShieldCheck`, `Monitor` vb.).
   - Framer-motion animasyonları ile modern koyu tema tasarım dili (`bg-background`, cam efekti/backdrop blur, kart grid düzeni: mobil 1, tablet 2, desktop 3 kolon).
   - Kart tasarımı: Üstte renkli ikon + "Yakında" rozeti, ad + slogan, açıklama, altta platform etiketi ve url `null` olduğu için indirme butonu yerine "Yakında" pazarlama vurgusu (örn. yakında seninle / beklemede kal).
3. **Adım:** `npx tsc --noEmit` ve `npx next build` komutlarını çalıştırarak doğrulama yap.
4. **Adım:** Kısa Türkçe rapor hazırla.
