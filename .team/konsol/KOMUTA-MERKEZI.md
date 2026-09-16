# OSTLERTECH KOMUTA MERKEZİ — Jarvis

> **Arayüz (2026-09-15 yenilendi):** ChatGPT/Open WebUI düzeni — kalıcı kenar çubuğu
> (🧭 Otomatik + 14 ajan avatarı + kayıtlı sohbetler hep görünür), slim üst bar (aktif ajan chip'i +
> model rozeti), çok satırlı komposer (Enter gönder, Shift+Enter satır), hızlı emir
> çipleri, paneller karşılıklı dışlamalı (Ekip ↔ Fırsat), mobilde hamburger menü.
>
> **🧭 Otomatik yönlendirme:** ajan seçmeden yazılan emir Merve'ye
> "MERVE, YONLENDIRME: ..." direktifiyle gider — o içeriğe bakıp doğru ajana dağıtır.
> Sohbete patron mesajı BİREBİR kaydedilir (direktif sadece modele gider); otomatik
> mesajlar `otomatik: true` işaretli.

> **ŞİMDİLİK:** Jarvis (web arayüzü) bekletiliyor — Codebuff SDK kredi istediği
> için (402) sohbet geçici olarak **terminalden** yürütülüyor: proje kökündeki
> **`ekip.cmd`**'ye çift tıkla (ya da `node .team/konsol/node_modules/codebuff/index.js`).
> CLI'ın reklamlı ücretsiz modunda ajanlar kredisiz konuşur; `.agents/` otomatik yüklenir.
> Gemini anahtarı `.env`'e girilip sunucu dönünce Jarvis yeniden devreye girer.

Patron'un kendi "Jarvis"i: tarayıcıdan 13 kişilik ekiple sohbet edilen komuta merkezi.
Codebuff ajanlarını (`.agents/`) `@codebuff/sdk` üzerinden çalıştırır. Bu klasör
**iç kullanımdır** — web sitesine (`web/`) ait değildir, yayına çıkmaz.

## Fırsat Avcısı (14. ajan)

Her gün 08:00'de (yerel saat) GitHub trendlerini tarayıp monetizasyon analizi yapar:
- **Veri:** Search API (son 45 günde doğup 80+ star yapan repolar) + github.com/trending (bugünkü hareket)
- **Analiz:** FIRSAT AVCISI ajanı (`.agents/firsat-avcisi.ts`) — gelir modeli, fiyat önerisi, potansiyel sınıfı, risk
- **Rapor:** `.team/reports/github-firsatlari.md` — "GÜNÜN FIRSATI" + 2 haftalık doğrulama planı
- **API:** `GET /api/firsat` (durum), `GET /api/firsat/rapor` (içerik), `POST /api/firsat/tara` (manuel tetik)
- **Arayüz:** üst barda "🎯 Fırsatlar" butonu — panelden tarama başlatma + rapor okuma
- Opsiyonel: `GITHUB_TOKEN` (.env) ile API limiti 60→5000 istek/saat

## Mimari

```
.team/konsol/
├── komuta-server.mjs   Komuta sunucusu (Node, port 4311)
│     • .agents/*.ts tanımlarını sıcak yükler (15 sn'de bir tazeler)
│     • /api/ekip → yetenek çipleri + üslup + fotoVar bilgisiyle ekip verisi
│     • /ekip-foto/<id> → gerçek ajan fotoğrafı (web/public/team/<id>.jpg, varsa)
│     • /ekip-panosu.html → görsel ekip panosu (pano panelinin iframe sekmcesi)
│     • /api/pano/todos · /api/pano/raporlar · /api/pano/rapor?ad= → pano verisi (salt-okunur, traversal korumalı)
│     • client.run({ agent, prompt, previousRun }) ile ajan çalıştırır
│     • Oturum başına sohbet hafızası tutar (previousRun zinciri)
│     • KALICI HAFIZA: her mesajdan sonra oturum .team/konsol/oturumlar/*.json
│       olarak diske yazılır; restart sonrası otomatik geri yüklenir —
│       mesaj geçmişi + ÇAĞRI model-hafızası (sohbet kaldığı yerden devam eder)
├── oturumlar/          Kalıcı sohbet kayıtları (JSON) — silmek geçmişi temizler
├── index.html          Jarvis arayüzü (ajan şeridi + sohbet, neon tema)
├── baslat.cmd          Çift tıkla başlat (Windows)
├── node_modules/       @codebuff/sdk + codebuff CLI + tsx (lokal, --no-save)
└── .env                (isteğe bağlı) GEMINI_API_KEY / CODEBUFF_API_KEY

(Proje kökünde ayrıca `ekip.cmd` — terminal modunun çift tıkla başlatıcısı.)
```

## Çalıştırma

**Yol 1 — Çift tıkla:** `.team/konsol/baslat.cmd`
**Yol 2 — Terminal:** `node .team/konsol/komuta-server.mjs`
**Yol 3 — Arkaplanda (PowerShell):**

```powershell
(Start-Process -FilePath 'node.exe' -ArgumentList '.team/konsol/komuta-server.mjs' -WindowStyle Hidden -PassThru).Id
```

Ardından tarayıcıda: **http://localhost:4311**

## Kimlik (tek seferlik kurulum)

Sunucu iki yolda çalışır — **ÇAĞRI yolu (önerilen, ücretsiz)** önce denenir:

1. **ÇAĞRI — kendi model anahtarın (ücretsiz):** `.team/konsol/.env` içine
   `GEMINI_API_KEY=...` yaz ([aistudio.google.com/apikey](https://aistudio.google.com/apikey),
   ücretsiz katman yeterli). OpenAI/Anthropic/OpenRouter/Groq anahtarı da olur —
   hangisi varsa otomatik seçilir. Ajanlar bu modelle Codebuff'sız çalışır.
2. **Codebuff SDK (kredi ister):** Codebuff kredisi olmayan hesapta ajan
   mesajları "Payment Required" döner. `codebuff login` ya da
   `CODEBUFF_API_KEY=...` bu yolu açar; ücretli kullanıma geçince otomatik devreye girer.

Kimlik yoksa arayüz üstte **"kimlik gerekli"** uyarısıyla açık durur — konuşma
başlatılamaz, ilk mesajda sistem mesajı olarak gereken adım yazar.

## Ajan ekleme / değiştirme

`.agents/` klasörüne yeni `*.ts` tanımı koymak yeterli — sunucu 15 saniye içinde
sıcak yükler, arayüz şeridini elle güncellemek gerekmez (roller `komuta-server.mjs`
içindeki `TEAM` listesinden gelir; ikon/renk/rol oradan düzenlenir).

## Port çakışırsa

```powershell
$env:KOMUTA_PORT = 4312 ; node .team/konsol/komuta-server.mjs
```
