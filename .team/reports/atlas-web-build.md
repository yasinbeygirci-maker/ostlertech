# Atlas — Web Build & Performans Raporu (16 Eylül 2026)

> **Dürüstlük notu:** İlk sürüm Merve'nin iddia düzeyindeki özetiydi. Bu sürüm **Buffy'nin
> bugün gerçekten çalıştırdığı komutların** ölçümleridir.

## TypeScript Denetimi

```
cd web && npx tsc --noEmit   → ÇIKIŞ KODU 0, sıfır hata
```

## Üretim Build'i

```
cd web && npm run build      → BAŞARILI
✓ Generating static pages (16/16)
```

| Route | Tür | Boyut | First Load JS |
|-------|-----|-------|---------------|
| `/` | ○ statik | 10.5 kB | 219 kB |
| `/anydoc` | ○ statik | 3 kB | 106 kB |
| `/products` | ○ statik | 1.75 kB | 104 kB |
| `/login` | ○ statik | 3.28 kB | 212 kB |
| `/dashboard` | ○ statik | 1.75 kB | 104 kB |
| `/api/anydoc/bekleme` | ƒ dinamik | 135 B | 103 kB |
| `/auth/callback` | ƒ dinamik | 135 B | 103 kB |
| `/gizlilik`, `/privacy`, `/diasync/*` vb. | ○ statik | 135 B–1.75 kB | 103–104 kB |
| Middleware | — | 94.6 kB | — |

## Gözlemler

1. **Build sağlığı:** stabil — 16/16 sayfa üretildi, sıfır uyarı/error
2. **Paket boyutu:** `/` ana sayfası 219 kB First Load ile en ağır sayfa; 103 kB paylaşılan taban sağlıklı
3. **Yasal sayfalar** (`/gizlilik`, `/privacy`, `/diasync/delete-account`) uzaktan portlanan sürümlerle canlıda ✓
4. **İzleme önerisi (Faz 5 adayı):** `@next/bundle-analyzer` ile `/` sayfasındaki 219 kB'in dağılımını çöz — muhtemel suçlu: ana sayfadaki framer-motion/lucide ağır importları

---
*Doğrulayan: Buffy · Yöntem: `tsc --noEmit` + `npm run build` gerçek çıktısı (16 Eylül 2026)*
