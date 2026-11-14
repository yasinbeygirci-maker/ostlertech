# SyncPass "tek lisans, 3 cihaz" K1: sunucu uç sözleşmesi

- Dal: `tek-lisans-k1` (ostlertech-web). Burak ön kapısı: `guvenlik/bulgular/2026-11-14-syncpass-tek-lisans-sunucu-on-kapi.md` (Ş1-Ş24).
- Durum: kod + testler hazır, **canlıya alınmadı** (Supabase SQL ve Vercel ortamı Yasin onayı ister). Google'a gerçek çağrı hiç yapılmadı.
- **DAĞITIM SIRASI (kalın kural, Burak O1): `2026-11-14-tek-lisans-k1.sql` canlıda UYGULANIP DOĞRULANMADAN `tek-lisans-k1` dalı `main`'e BİRLEŞTİRİLMEZ.** `main`'e birleştirme Vercel'de üretim dağıtımını kendiliğinden başlatır. Savunma katmanı: ortak okuma yeni sütunlar yoksa (42703) eski sütun listesine düşer (`lib/license-select.ts`), yani sıra hatası olsa bile Paddle/AreaPilot uçları çalışır; yine de Play uçları göçsüz çalışmaz (satır yok) ve sıra kuralı geçerlidir.
- Android istemcisi bu işin DIŞINDA: bu belge Android tarafının yazılacağı sözleşmedir (K1-6).

## 1. Ne yapar

Play'den abone olan (ya da ömür boyu alan) kullanıcı, Android uygulamasından satın alma jetonunu sunucuya gönderir. Sunucu jetonu Google Play
Developer API'ye doğrulatır ve **aynı `sp_licenses` satırında** bir `SPD-XXXXX-XXXXX-XXXXX-XXXXX` kodu üretir (ya da var olanı döndürür).
Masaüstü uygulaması bu kodu bugünkü `POST /api/license/activate` ile açar (masaüstünde istemci değişikliği yok, yalnız metin).
Kasa verisi, ana parola, e-posta, Google hesap kimliği ve cihaz numarası bu uca **hiç gelmez**.

## 2. `POST /api/license/play/claim`

İstek (`Content-Type: application/json`), K1'de **yalnız şu 4 alan** okunur; başka her alan yok sayılır:

| Alan | Tür | Kural |
|---|---|---|
| `purchaseToken` | metin | 1-1024 karakter; boşluk, kontrol karakteri, `/` ve `\` yok |
| `productId` | metin | `premium_monthly`, `premium_yearly` (abonelik) ya da `premium_lifetime` (tek seferlik) |
| `kind` | `"subs"` \| `"inapp"` | ürünle tutarlı olmalı (aylık/yıllık = `subs`, ömür boyu = `inapp`) |
| `appVersion` | metin, isteğe bağlı | en çok 32 karakter (yalnız bilgi) |

Android'in **GÖNDERMEYECEĞİ** alanlar (Burak Ş6): paket adı (sunucu sabiti `com.ostlertech.syncpass`), cihaz numarası/UUID (K1'de yok),
Google e-postası/hesap kimliği, `obfuscatedAccountId`, kasa bilgisi, plan, cihaz sayısı. Sunucu bunları okumaz.
`X-SyncPass-Token` kullanılmaz (APK'dan çıkarılabilir; güven yalnız Google'ın yanıtına dayanır). Eski `purchase-verify` hizmeti kullanılmaz.

Başarı `200`:

```json
{ "key": "SPD-XXXXX-XXXXX-XXXXX-XXXXX", "plan": "month|year|lifetime", "maxDevices": 3, "source": "play" }
```

Yanıtta jeton, Google ham yanıtı, sipariş no, e-posta **yoktur**. `Cache-Control: no-store`. Aynı jetonla tekrar tekrar çağrı **idempotent**:
her seferinde aynı satır ve aynı kod (yeni satır açılmaz; eşzamanlı çağrılarda da).

Hata kodları (gövde `{ "error": "<kod>" }`):

| HTTP | `error` | Anlamı | Android davranışı |
|---|---|---|---|
| 400 | `bad_request` | biçim/ürün/tür hatalı (Google'a gidilmedi) | hata; kullanıcıya "tekrar dene" |
| 403 | `inactive` (`status` alanı da gelir) | satın alma var ama şu an hak vermiyor (iptal+süre bitti, askıda, iade) | kod ekranı "şu an geçerli lisans yok" |
| 403 | `test_purchase` | lisans-test satın alması ve sunucu bayrağı kapalı | yalnız test sürecinde görülür |
| 404 | `invalid_purchase` | Google bu jetonu/ürünü tanımıyor | hata |
| 409 | `pending` | satın alma beklemede (ödeme tamamlanmadı) | "ödeme tamamlanınca kodun görünecek" |
| 429 | (Vercel Firewall) | hız sınırı (P1: 20 / 10 dk / IP) | sonra tekrar dene |
| 500 | `server_error` | sunucu/veritabanı hatası | tekrar dene |
| 503 | `verify_unavailable` | Google'a ulaşılamadı (429/5xx/zaman aşımı); hiçbir satır değişmedi | tekrar dene |
| 503 | `not_configured` | Google yetkisi/federasyon kurulu değil | yalnız kurulum sırasında görülür |

**Android kararı değişmez (Ş17):** `claim`'in HİÇBİR yanıtı (404, 409, 503, ağ yok, 5xx) Android'de Premium'u kapatmaz; yalnız "tablet ve masaüstü kodu" ekranı
"şimdi alınamadı" der. Premium yalnız Play'den (bugünkü `queryPurchasesAsync`) gelir. JSON `org.json` ile kurulur (Gson/yansıma yok, R8 tuzağı).

## 3. Sunucu içi akış (sıra)

1. Biçim (400) → 2. yerel arama: jeton özeti (`sha256`) biliniyorsa ve satır 24 saatten tazeyse Google'a gitmeden döner; eski (yerine geçilmiş) jeton hiç sorulmaz →
3. Google (tek çağrı, türe göre: `subscriptionsv2.get` / `products.get`, 8 sn zaman aşımı) → 4. durum eşlemesi (tablo aşağıda) →
5. atomik kayıt `sp_claim_play_license` (jeton tekil indeksi + zincir) → 6. yanıt.

Plan ve cihaz sayısı yalnız sunucu kataloğundan (`play-catalog.ts`): 3 ürün, hepsi 3 cihaz; **2 yıllık plan yok**.

### Durum eşlemesi (Ş3)

| Google (`subscriptionState`) | `sp_licenses.status` | `current_period_end` | `entitlementUntil` |
|---|---|---|---|
| ACTIVE, IN_GRACE_PERIOD | active | `lineItems[].expiryTime` (en geç) | bitiş + 7 gün pay (en çok şimdi+30 gün) |
| CANCELED | canceled | expiryTime | bitişe kadar, **pay yok** |
| ON_HOLD, PAUSED | paused | expiryTime | hak yok |
| EXPIRED | canceled | expiryTime | hak yok |
| PENDING, PENDING_PURCHASE_CANCELED, UNSPECIFIED, bilinmeyen | satır AÇILMAZ / değişmez (409) | - | - |
| iptal listesinde (voided) | refunded | - | hak yok |
| tek seferlik `purchaseState` 0 | active (ömür boyu) | boş | belge ömrü 30 gün, kayan |
| tek seferlik 1 / voided | refunded | - | hak yok |
| tek seferlik 2 (pending) | AÇILMAZ (409) | - | - |

`iade` bitiş durumudur: iade edilen satır aynı jetonla "active" claim ile yeniden açılmaz; yalnız yeni bir satın alma (zincir) açar.

### Zincir (`linkedPurchaseToken`, Ş10)

Yeni jeton `linkedPurchaseToken` ya da `outOfAppPurchaseContext.expiredPurchaseToken` ile bilinen bir jetona işaret ederse yeni satır açılmaz:
aynı satırın etkin jetonu değişir, eski jetonun özeti `superseded_at` alır, plan Google'ın yeni ürününden güncellenir, **kod ve cihazlar aynı kalır**.
İki satır çakışması (bağlantı işlenmeden yeni jeton ayrıca claim edildiyse): kullanıcının elindeki eski satır korunur; yeni satırın cihazı yoksa `revoked`
yapılıp jetonu eskiye taşınır; cihazı varsa **otomatik birleştirme yok**, günlüğe "elle bak" (yalnız lisans kimliği) yazılır.

### Test satın alma (Ş4)

Lisans-test hesabı (`testPurchase` / `purchaseType == 0`): `PLAY_ACCEPT_TEST_PURCHASES` kapalıysa 403 `test_purchase`. Açıksa satır `source = play_test`,
hak en çok **14 gün** (ömür boyu planda bile; `entitlementUntil` `play_test` satırında `current_period_end`'e bakar). 14 gün ilk claim'de verilir; **yeniden claim ve tazeleme süreyi ileri KAYDIRMAZ** (en erken bitiş kalır; Burak D1).
Promosyon kodu (`purchaseType 1`) normal lisanstır. Kerem turu bitince bayrak kapatılır; kapalı olduğu Burak AAB kapısında Vercel env ADI düzeyinde okunur.

## 4. Masaüstü tarafı

`POST /api/license/activate` / `renew` aynıdır; yalnız Play satırında (`source play/play_test`) **24 saatten bayatsa Google'a yeniden sorar** (Ş8).
Google ulaşılamazsa kayıtlı durumla devam eder, süre uzatmaz. Revoke'suz iade ≤24 saatte (günlük cron + bayatlık), iade yayılımı istemcide çevrimiçi ≤7 gün,
çevrimdışı ≤30 gün (belge ömrü).

İmza anahtarı döndürme (Ş12): `appVersion >= 1.5.0` (kesinleşecek, `SYNCPASS_KEY_V2_MIN_APP_VERSION`) ve `LICENSE_SIGNING_KEY_V2` tanımlıysa belge yeni
anahtarla, aksi halde eskisiyle imzalanır. Masaüstü K1 sürümü iki genel anahtar kabul etmelidir (masaüstü hattı işi).

## 5. Diğer uçlar

- `GET /api/license/play/cron`: Vercel Cron (günlük 03:17 UTC). `Authorization: Bearer $CRON_SECRET` yoksa/yanlışsa **401**. İptal listesi (`voidedpurchases`, `type=1`,
  son 30 gün = Google'ın sınırı; cron günlerce düşse de iadeler kaçmaz) + süre bitimi kapatma. Yanıt yalnız sayılar: `{ok, seen, marked, expired}`.
- `POST /api/license/play/health` (Ş20): aynı `CRON_SECRET`. Gövde (hepsi isteğe bağlı): `{subscriptionToken, productId, productToken}`. Yanıt **yalnız HTTP durum kodları**:
  `{"subscriptionsv2":200,"products":200,"voidedpurchases":200}`. 401/403 görülürse ikinci Console iznini kendiliğinden ekleme: Burak'a dön.
  Jeton adrese değil gövdeye konur (günlüğe düşmesin).
- K2 (bu işin dışında): `/api/license/play/reset` (self servis sıfırlama), cihaz kaydı/liste. K1'de sıfırlama destek yoluyla: `sp_rotate_play_license(license_id, yeni_kod, şimdi)`.

## 6. Ortam değişkenleri (hepsi YALNIZ Production; sır olmayanlar işaretli)

| Ad | Sır mı | Not |
|---|---|---|
| `GCP_PROJECT_NUMBER`, `GCP_SERVICE_ACCOUNT_EMAIL`, `GCP_WORKLOAD_IDENTITY_POOL_ID`, `GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID` | hayır | OIDC federasyonu (anahtar dosyası YOK) |
| `CRON_SECRET` | **evet (Sensitive)** | rastgele 32 bayt, en az 16 karakter; parola yöneticisinden |
| `PLAY_ACCEPT_TEST_PURCHASES` | hayır | varsayılan kapalı; yalnız Kerem turunda `1` |
| `LICENSE_SIGNING_KEY_V2` | **evet (Sensitive)** | yeni Ed25519 imza anahtarı (Yasin ile üretilir, diske düz yazılmaz); anahtar listesi masaüstüne girene dek TANIMLAMA |

## 7. Canlıya alım sırası (K1-5)

1. Canlı ön denetim (salt okur; SQL dosyasının başındaki sorgular, NOT NULL/varsayılan listesi dahil) → Burak. 2. `web/supabase/2026-11-14-tek-lisans-k1.sql` (Yasin onayıyla; **koddan ÖNCE, doğrulanmadan main'e birleştirme YOK**). 3. Vercel ortam değişkenleri.
4. Site dağıtımı. 5. Ş14 hız kuralları. 6. Ş20 sağlık ucuyla pozitif kontrol. 7. Android (K1-6) yayını bundan SONRA.
Kod SQL'den önce dağıtılırsa Play uçları çalışmaz; Paddle/AreaPilot uçları eski sütun listesine düşerek çalışır (O1 savunması, testli). Geri alma: Vercel Instant Rollback (SQL yerinde kalır; göç eski kodla uyumlu).

## 8. Ş1-Ş24 durumu

Ayrıntı ve kanıt: `D:\Development\OstlerTech\yonetim\syncpass-tek-lisans-k1-sunucu-2026-11-14.md` (tablo).
