# KURUCU KİLİDİ GÖNDERİM TAKİBİ — Segment 1 + Segment 2 (20 hedef)

> **Sorumlu:** Vera · **Kural:** her gönderim/cevap sonrası ilgili satır güncellenir,
> ÖZET bloğu her gün tazelenir. Takip dosyası olmadan gönderim YAPILMAZ.
>
> **Durum sözlüğü:** `beklemede` → `gonderildi` → `cevap-tamam` / `cevap-yok` /
> `izlem-değil` / `kapandi`
>
> **Kaynak dosyalar:** metinler **`vera-kanal-metinleri-EN.md` (GİDECEK OLAN — İngilizce)** ·
> iç referans (Türkçe TDK): `vera-kanal-a-gonderim-metinleri.md` + `vera-kanal-b-c-gonderim-metinleri.md` ·
> plan `vera-segment2-gonderim-kanal-plani.md`
> **DİL KURALI (18.09):** hedef kitle uluslararası → giden mesajlar İNGİLİZCE; Türkçe metinler yalnız iç kullanım.

## ÖZET (günlük tazelenir)

| Tarih | Gönderilen | Cevap | Kurucu kontenjanı (canlı API) |
|---|---|---|---|
| 17.09 | **1/22** (S1-1 canlı test, Gönderilmişler kanıtlı) | 0 | 99/100 kaldı |
| 18.09 | 1/22 (değişiklik yok) | 0 | **99/100 canlı doğrulandı** — 5 test kaydı silindi (Supabase SQL), tabloda yalnızca Patron'un kaydı |
| 18.09 (akşam) | **2/22** — A-01 LlamaIndex gönderildi (Patron, Discussions üzerinden) | 0 | 99/100 |

## SEGMENT 1 — Bekleme listesi (2 kayıt)

E-posta adresleri Supabase Table Editor'de (`anydoc_waitlist`) — Vera erişemez,
gönderim Patron'la. Test kaydı (`test-dogrulama@`) gönderilmez, tablodaki gerçek
kayıtlar hedeftir.

| # | Hedef | Kanal | DURUM | Gönderim tarihi | CEVAP | Sonuç |
|---|---|---|---|---|---|---|
| S1-1 | yasinbeygirci@gmail.com — **Patron'un kendi kaydı (1. sıra)** → gönderim = mail görünümünün canlı kendi-kendine testi | E-posta — HTML şablonu | **gonderildi** (kanıtlı: Gönderilmişler doğrulandı) | 17.09 | — | canlı test — Gmail görünümü Patron onayında |
| S1-2 | test-dogrulama@ostlertech.com — doğrulama testi (Buffy) | — | gonderilmez | — | — | — |

## SEGMENT 2 — Kanal A: GitHub (10 hedef)

| # | Hedef | Kanal | DURUM | Gönderim tarihi | CEVAP | Sonuç |
|---|---|---|---|---|---|---|
| A-01 | LlamaIndex (`run-llama/llama_index`) — **Jerry Liu** (`jerryjliu`) | GitHub Discussions ✓ (has_discussions: true) | **gonderildi** | 18.09 | bekleniyor | TDK'lı metinle gönderildi; G+3: 21.09 |
| A-02 | LangChain (`langchain-ai/langchain`) — **Harrison Chase** (`hwchase17`) | **forum.langchain.com → Talking Shop** (kanal değişti 18.09: GitHub Discussions kapatıldı, "moved to LangChain Forum" duyurusu canlı teyitli) | beklemede | — | — | isim teyitli (contributors #2) |
| A-03 | Unstructured (`Unstructured-IO/unstructured`) — **Matthew Robinson** (`MthwRobinson`) | GitHub Discussions ✓ | beklemede | — | — | soyadı düzeltildi 18.09 ("Garvey" → Robinson) |
| A-04 | Marker (`datalab-to/marker`) — **Vik Paruchuri** (`VikParuchuri`) | **Discord** (discord.gg/KuZwXNGnfH) — repo Discussions kapalı | beklemede | — | — | kanal değişti 18.09: GitHub Discussions → Discord |
| A-05 | Docling (`docling-project/docling`) — **Peter Staar** (`staar`, IBM) | GitHub Discussions ✓ | beklemede | — | — | repo düzeltildi 18.09: DS4SD → docling-project |
| A-06 | Firecrawl (`firecrawl/firecrawl`) — ekip geneli | GitHub Discussions | beklemede | — | — | — |
| A-07 | Chroma (`chroma-core/chroma`) | GitHub Discussions/Issue | beklemede | — | — | — |
| A-08 | Qdrant (`qdrant/qdrant`) | GitHub Discussions/Issue | beklemede | — | — | — |
| A-09 | Haystack (`deepset-ai/haystack`) | GitHub Discussions/Issue | beklemede | — | — | — |
| A-10 | Milvus (`milvus-io/milvus`) | GitHub Discussions/Issue | beklemede | — | — | — |

## SEGMENT 2 — Kanal B: X/Discord DM (6 hedef)

| # | Hedef | Kanal | DURUM | Gönderim tarihi | CEVAP | Sonuç |
|---|---|---|---|---|---|---|
| B-01 | AnythingLLM | X/Discord DM | beklemede | — | — | — |
| B-02 | Dify | X/Discord DM | beklemede | — | — | — |
| B-03 | RAGFlow (topluluk) | X/Discord DM | beklemede | — | — | — |
| B-04 | Verba (Weaviate) | X/Discord DM | beklemede | — | — | — |
| B-05 | OmniParse | X/Discord DM | beklemede | — | — | — |
| B-06 | txtai | X/Discord DM | beklemede | — | — | — |

## SEGMENT 2 — Kanal C: Kurumsal e-posta (4 hedef)

| # | Hedef | Kanal | DURUM | Gönderim tarihi | CEVAP | Sonuç |
|---|---|---|---|---|---|---|
| C-01 | Khoj (iletişim formu/GitHub Discussions) | E-posta/form | beklemede | — | — | — |
| C-02 | kotaemon | E-posta | beklemede | — | — | — |
| C-03 | Infiniflow (`info@infiniflow.com` ✓ teyitli) | E-posta | beklemede | — | — | — |
| C-04 | Unstructured (`support@unstructured.io` ✓ teyitli) | E-posta | beklemede | — | — | — |

## NOTLAR

- **Çift kanal hedefleri:** RAGFlow (B-03 + C-03) ve Unstructured (A-03 + C-04)
  iki kanaldan yaklaşılmaz — önce topluluk/GitHub kanalı, 7 gün cevap yoksa
  kurumsal e-posta ikame.
- **Kontenjan takibi:** ÖZET'teki kontenjan canlı API'den (`GET /api/anydoc/bekleme`);
  kampanya gönderimleri kayıt getirirse bar düşer — etkiyi buraya not et.
- **Kapanış:** 20 hedefin tamamı sonuçlandığında dosya başlığına `KAPANDI` +
  sonuç özeti (gönderim → cevap → demo/kayıt dönüşümü) yazılır.
- **S1-1 paket hazır (17.09):** kurucu-kilidi-s1-gonderim-paketi/ (eposta.html + README).
  Alıcı: 1. sıradaki gerçek kayıt — e-postayı Patron Table Editor'den alıp gönderecek;
  gönderim sonrası S1-1 satırı gonderildi olarak işaretlenecek. S1-2 (test kaydı)
  gönderilmez, ileride gerçek kayıt gelirse A varyantı aynen kullanılır.
