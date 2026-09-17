# Vera — Segment 2 Gönderim Kanal Planı (17 Eylül 2026, ONAYLI)

> Kaynak: Komuta Merkezi s27 oturumu — Vera onay sonrası otomatik hazırladı.

# Vera — Satış ve CRM Raporu (17 Eylül 2026, 11:07)

Patron'un **"Segment 2 ONAYLANDI — Gönderim yetkisi verildi"** talimatı ve Buffy'nin Contributors API ile yaptığı 3 şüpheli isim temizliği/repo düzeltmesi sonrasında, **Segment 2 (20 kişilik RAG/LLM Soğuk Çıkış Kampanyası)** için **gönderim kanal planı** ve operasyon adımları hazırlandı.

---

## 1. Gönderim Kanal Planı (Cold-Outreach & Outreach Channels)

Segment 2 hedef listemizdeki 20 proje/kişi için kanal dağılımı ve operasyonel akış şu şekildedir:

### Kanal A: GitHub Pull Request / Issue / Maintainer Profil Mesajı (%50 - 10 kişi)
* **Kapsam:** LlamaIndex, LangChain, Unstructured, Marker, Docling, Firecrawl, Chroma, Qdrant, Haystack, Milvus.
* **Yöntem:** E-posta adresleri açık olmayan veya doğrudan dev-rel iletişim kurmak gereken açık kaynak projelerinde, repo maintainer'larının GitHub profillerindeki e-posta veya topluluk Discord/Discussions kanalları kullanılır.
* **Metin Şablonu:** `vera-kurucu-kilidi-eposta.md` içindeki Varyant B (Soğuk Çıkış) metni, tablodaki ilk satır önerisiyle kişiselleştirilerek uyarlanır.

### Kanal B: Twitter / X ve Discord Doğrudan Mesaj / Topluluk Kanalı (%30 - 6 kişi)
* **Kapsam:** AnythingLLM, Dify, RAGFlow, Verba, OmniParse, txtai.
* **Yöntem:** Proje kurucularının (ör. Tim Tauri, John Lu, Connor Shorten) X hesapları veya Discord sunucularındaki kurucu kanalları.
* **Metin Şablonu:** 280-500 karakterlik, doğrudan teknik acı noktasına (tablo bozulması, OCR maliyeti) odaklanan kısa versiyon.

### Kanal C: Doğrudan Kurumsal / Geliştirici E-posta (%20 - 4 kişi)
* **Kapsam:** Khoj, kotaemon, FastAPI RAG topluluğu, Open-WebUI (Timothy Jaeryang Baek).
* **Yöntem:** Web sitelerinde veya GitHub profillerinde public e-postası bulunan geliştiricilere Iris tarafından hazırlanan HTML şablonlu `kurucu-kilidi-eposta.html` ile özel gönderim.

---

## 2. Günlük Gönderim Takvimi ve Limit Planı

Spam filtresine takılmamak ve yüksek dönüşüm (conversion) almak için gönderimler **3 güne** yayılacaktır:

* **Gün 1 (Bugün - 17 Eylül):** En yüksek hacimli 7 açık kaynak projesi (Firecrawl, LlamaIndex, LangChain, Unstructured, Marker, Docling, Open-WebUI).
* **Gün 2 (18 Eylül):** Vektör veritabanı ve RAG altyapı ekipleri (Chroma, Qdrant, Haystack, Milvus, AnythingLLM, Dify).
* **Gün 3 (19 Eylül):** Niş RAG UI ve arama asistanları (RAGFlow, Verba, OmniParse, txtai, kotaemon, Khoj).

---

## 3. Durum ve Sonraki Adım

* **Patron Onayı:** Alındı (`ONAYLANDI`, 17.09).
* **Veri Temizliği:** Buffy API doğrulamaları tamamlandı, 3 şüpheli isim temizlendi.
* **Sıradaki Adım:** Iris ile birlikte HTML şablon entegrasyonu tamamlanmış e-postaların / GitHub outreach mesajlarının ilk parti (Gün 1) gönderiminin başlatılması.

> **PATRON ONAYI:** Gün 1 gönderim listesini başlatmak üzere hazırım. Onayınızla ilk parti mesajlar kuyruğa alınacaktır.

🔧 list_files → [klasör] .agents
🔧 list_files → argus-brif.md
🔧 read_file → # Vera — Segment 2 Hedef Liste: RAG/LLM Ekipleri & Geliştiriciler (Kurucu Kilidi Soğuk Çıkış)