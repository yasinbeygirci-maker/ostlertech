# OstlerTech Web

OstlerTech'in dijital güvenlik ekosistemi için tanıtım ve dönüşüm sitesi:
**SyncPass** (şifre yöneticisi) ve **DiaSync** (aile senkronizasyonu).

## Repo Yapısı

```
.
├── web/          # Next.js 15 + React 19 + Tailwind CSS + framer-motion web sitesi
├── app/          # Android uygulaması (Kotlin) — KPM içe aktarma servisi
└── settings.gradle.kts
```

- `web/` — asıl ürün: pazarlama sitesi, Supabase auth (`/login`), kullanıcı paneli (`/dashboard`), waitlist formu.
- `app/` — Android Studio projesi; web sitesiyle aynı repoda, bağımsız derlenir.

## Web Sitesi (web/)

```bash
cd web
npm install

# .env.local oluşturun:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi
```

### Sayfalar

| Rota | Açıklama |
|------|----------|
| `/` | Landing: Hero, Showcase, Features, Pricing |
| `/login` | Supabase e-posta/şifre + GitHub/Google OAuth |
| `/dashboard` | Kullanıcı paneli (henüz korumasız — Faz 1'de middleware gelecek) |
| `/gizlilik-politikasi`, `/kullanim-sartlari` | Yasal sayfalar |
| `/diasync/privacy` | DiaSync gizlilik politikası |

## Android Uygulaması (app/)

Android Studio ile açın veya:

```bash
./gradlew :app:assembleDebug
```

`MainActivity` SAF üzerinden KPM dosyası seçimini `KpmImportService`'e (foreground service) devreder; `SecurityVault` içe aktarma durumunu yönetir.
