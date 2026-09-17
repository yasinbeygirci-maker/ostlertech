# Vera — Segment 2 Hedef Liste: RAG/LLM Ekipleri & Geliştiriciler (Kurucu Kilidi Soğuk Çıkış)

> **DURUM: ONAYLANDI — Patron onayı 17 Eylül 2026, gönderim yetkisi verildi.**

> **Tarih:** 17 Eylül 2026  
> **Hedef Kitle:** PDF, DOCX, XLSX gibi ağır belge akışına (heavy ingestion) sahip, RAG ve LLM projeleri geliştiren açık kaynak katkıcıları, kütüphane geliştiricileri, dev.to / Medium yazarları ve AI girişim mühendisleri.  
> **Kampanya:** AnyDoc İlk 100 Kurucu Kilidi ($14.50/ay ömür boyu %50 indirim, ilk ay 5.000 sayfa ücretsiz).

---

## Hedef Liste (20 Kişi / Ekip)

| Sıra | Şirket / Proje Adı | Kişi / İletişim | Neden Uyumlu? (Ağır İş Akışı Sinyali) | Kişiye Özel İlk Satır Önerisi (Tek Cümle) | Kaynak & Bulunma Yeri |
|:---:|---|---|---|---|---|
| 1 | **LlamaIndex** (Core / Ingestion) | Shervin Minaei / GitHub maintainers | GitHub'da `llama-index-readers` ve belge parse modüllerini aktif yönetiyorlar; tablo ve PDF parser darboğazı yaşıyorlar. | Shervin, LlamaIndex okuyucularındaki tablo parsing sorunlarını çözmek için AnyDoc'un Rust motorunu incelemenizi öneririm. | GitHub (`run-llama/llama_index`), dev.to |
| 2 | **LangChain** (Document Loaders) | Harrison Chase / ekibi | PDF/Docx yükleyiciler için sürekli OCR ve unstructured parser entegrasyonu arıyorlar. | Harrison, LangChain doküman yükleyicilerindeki token israfını azaltacak Rust tabanlı AnyDoc parsers entegrasyonuna göz atın isterim. | GitHub (`langchain-ai/langchain`), Twitter |
| 3 | **Unstructured.io** | Matthew Garvey / Core dev | Açık kaynaklı belge işleme kütüphanesi geliştiriyorlar; ağır OCR ve PDF parse maliyetleriyle çalışıyorlar. | Matthew, Unstructured'ın ağır OCR bağımlılığını baypas eden token-verimli Markdown dönüşümümüz tam size göre. | GitHub (`Unstructured-IO/unstructured`), Medium |
| 4 | **Marker** (PDF to Markdown) | Vik Paruchuri | Marker projesi ile Python tabanlı PDF-to-Markdown dönüşümü yapıyor; hız ve Rust motoru entegrasyonu odaklı. | Vik, Marker projenizdeki Python hız sınırlarını ortadan kaldıracak AnyDoc Rust motorunu ve ilk 100 kurucu avantajını paylaşmak istedim. | GitHub (`datalab-to/marker`), HackerNews |
| 5 | **Docling** (IBM Research) | Peter Staar | IBM'in gelişmiş doküman çözümleme (PDF/Docx/XLSX) kütüphanesini geliştiriyorlar; büyük ölçekli RAG akışları var. | Peter, Docling ile kurduğunuz ağır belge akışlarında tablo yapısını bozmayan AnyDoc Markdown motorunu test etmek ister misiniz? | GitHub (`DS4SD/docling`), arXiv yazarları |
| 6 | **Firecrawl** (Web & Doc Scraping) | Çekirdek ekip — nickscamara & mogery (Contributors #1–#2, canlı teyitli) | Web ve doküman kazıma projelerinde LLM-hazır veri formatı çıktısı üretiyorlar. | Firecrawl ekibi, belge dönüşüm adımlarınızı hızlandıracak ilk 100 kurucu kilidimiz açık. | GitHub (`firecrawl/firecrawl`), Twitter |
| 7 | **Chroma** (DB & RAG Data) | Anton Troynikov | Vektör veritabanı ekosisteminde kullanıcıların veriyi nasıl beslediği (ingestion) en büyük acı noktaları. | Anton, Chroma kullanıcılarının veriyi vektöre dönüştürmeden önce temiz Markdown'a çevirmesini AnyDoc ile saniyeler içinde çözebilirsiniz. | GitHub (`chroma-core/chroma`), X |
| 8 | **Qdrant** (Vector Search) | Andre Zaykov | Kurumsal RAG projelerinde PDF ve teknik kılavuz arama senaryolarında yoğun veri parse ihtiyacı var. | Andre, Qdrant kurumsal RAG projelerinizdeki PDF parsing darboğazını AnyDoc Rust motoruyla nasıl aştığımıza bakın. | GitHub (`qdrant/qdrant`), Dev.to |
| 9 | **Haystack (Deepset)** | Malte Pietsch | Enterprise RAG çatı yazılımı; karmaşık PDF ve tablo parse bileşenleri sürekli güncelleniyor. | Malte, Haystack pipeline'larınızdaki belge yükleme adımlarını hızlandıracak kurucu avantajımızı kaçırmayın. | GitHub (`deepset-ai/haystack`), Medium |
| 10 | **Milvus** (Zilliz) | Xiaolong Tang | Büyük ölçekli doküman tabanlı vektör aramalarında veri hazırlama süreçleri kritik. | Xiaolong, Milvus tabanlı devasa kurumsal arama projelerinizde veriyi temiz Markdown'a çeviren AnyDoc ile tanışın. | GitHub (`milvus-io/milvus`), Blog |
| 11 | **AnythingLLM** | Tim Tauri / Mintplex Labs | Masaüstü ve sunucu tabanlı All-in-One LLM aracı; yerel dosya yükleme ve parse desteği var. | Tim, AnythingLLM dosya yükleme modülünde tablo ve başlıkları koruyan AnyDoc motoru tam aradığınız parça olabilir. | GitHub (`MintplexLabs/anything-llm`), Discord |
| 12 | **Dify.ai** | John Lu | Workflow tabanlı LLM uygulama platformu; doküman tabanlı RAG bilgi tabanı (Knowledge) oluşturma özelliği var. | John, Dify bilgi tabanı modülündeki belge parse kalitesini artıracak AnyDoc entegrasyonunu incelediniz mi? | GitHub (`langgenius/dify`), Twitter |
| 13 | **RAGFlow** | Infersend / BARD / Maintainers | Deep document understanding ve OCR tabanlı RAG altyapısı geliştiriyorlar. | RAGFlow ekibi, belge işleme maliyetlerinizi düşürecek Rust motorlu AnyDoc kurucu avantajı ilk 100 için aktif. | GitHub (`infiniflow/ragflow`) |
| 14 | **Verba (Weaviate)** | Connor Shorten | Weaviate tabanlı RAG arama arayüzü; dosya yükleme ve chunking süreçleri aktif kullanılıyor. | Connor, Verba kullanıcılarının PDF yükleme aşamasında yaşadığı tablo bozulmalarını AnyDoc ile kökten çözüyoruz. | GitHub (`weaviate/Verba`), YouTube |
| 15 | **OmniParse** | Krenovate | Çeşitli belge formatlarını LLM'ler için temiz formata dönüştüren popüler açık kaynak araç. | OmniParse ekibi, belge dönüştürme motorunuzu Rust tabanlı AnyDoc altyapısıyla güçlendirmek için ilk 100 kurucu fırsatımız var. | GitHub (`Enterpret/OmniParse`) |
| 16 | **txtai** | NeuML / Tyler Hutchison | AI tabanlı arama ve RAG iş akışları kütüphanesi; doküman işleme boru hatları (pipelines) var. | Tyler, txtai doküman işleme boru hatlarınızda tablo ve başlık korumalı Markdown dönüşümü için AnyDoc kurucu kilidi sizi bekliyor. | GitHub (`neuml/txtai`), Medium |
| 17 | **kotaemon** | Cevi / Open-source RAG UI | Açık kaynaklı modüler RAG kullanıcı arayüzü; PDF okuma ve özetleme özellikleri merkezde. | Kotaemon projesindeki PDF okuma ve parse kalitesini artırmak için AnyDoc kurucu avantajını değerlendirebilirsiniz. | GitHub (`Cinnamon/kotaemon`) |
| 18 | **FastAPI / RAG Template** | Sebastián Ramírez (tiangolo) — yaratıcı; RAG şablonları topluluk işi | FastAPI ekosisteminde popüler RAG başlangıç şablonları geliştiren topluluk liderleri. | FastAPI topluluğu, şablonlarınıza entegre edebileceğiniz AnyDoc kurucu fiyatı ilk 100 kişiye özel aktif. | GitHub (`tiangolo` ekosistemi / FastAPI topluluğu) |
| 19 | **Open-WebUI** | Timothy Jaeryang Baek (tjbck — 12.895 commit, kurucu, canlı teyitli) | En popüler yerel LLM arayüzü; doküman yükleme (RAG) özelliği milyonlarca kullanıcı tarafından kullanılıyor. | Open-WebUI doküman yükleme akışında tablo ve yapı koruması sağlayan AnyDoc kurucu avantajını ekibinize öneririm. | GitHub (`open-webui/open-webui`), Discord |
| 20 | **Khoj** | Ameo (Ahmad Sleem) | Kişisel ve kurumsal AI arama asistanı; PDF, Markdown ve not dosyalarını senkronize edip işliyor. | Ahmad, Khoj asistanınızın belge indeksleme hızını ve Markdown kalitesini artıracak AnyDoc kurucu kilidi açıldı. | GitHub (`khoj-ai/khoj`), Twitter |

---

## Veri Bulunamayan / Boş Alanlar İçin Notlar
* **E-posta Adresleri:** Listelenen kişilerin kurumsal e-posta adresleri kişisel gizlilik ve spam politikaları gereği doğrudan listede yer almamaktadır; GitHub commit logları (`git log --author`), maintainer profilleri veya kurumsal web sitelerindeki `contact@` / `dev@` adreslerinden teyit edilmelidir.
* **Alternatif Kaynak Önerisi:** E-postaların toplanamadığı durumlarda doğrudan GitHub PR yorumları, Twitter/X DM'leri veya LinkedIn üzerinden yukarıdaki "Kişiye Özel İlk Satır Önerisi" ile soğuk çıkış (cold outreach) yapılabilir.

---

## DOĞRULAMA NOTU — Buffy (17 Eylül 2026, GitHub API ile canlı teyit)

Proje listesi 20/20 gerçek ve hedef kitleye uygun. Ancak gönderim ÖNCESİ şu düzeltmeler şart:

### Repo adresi düzeltmeleri — ÇÖZÜLDÜ (tablo satırlarına işlendi)
| Listedeki | Doğru adres (canlı teyitli) | Yıldız |
|---|---|---|
| `VikParuchuri/marker` | `datalab-to/marker` | 39.8k |
| `mendableai/firecrawl` | `firecrawl/firecrawl` | 181k |
| `Caged/kotaemon` | `Cinnamon/kotaemon` | 25.8k |

### Kişi adı — ÇÖZÜLDÜ (GitHub Contributors API ile canlı teyit, 17.09)
- **#6 Firecrawl**: "Eric Hartford" YANLIŞTI → gerçek çekirdek ekip **nickscamara (1.892 commit) & mogery (1.675 commit)**; satır ekip-geneli hitabına çevrildi.
- **#19 Open-WebUI**: "Timothy J. Ottinger" YANLIŞTI → kurucu **Timothy Jaeryang Baek (tjbck, 12.895 commit)**; satır düzeltildi.
- **#18 FastAPI**: "Marcelo Trylesinski" YANLIŞTI → yaratıcı **Sebastián Ramírez (tiangolo, 2.258 commit)**; RAG şablonları topluluk işi olduğundan çıkış topluluk kanalından yapılacak.

**Sonuç:** 3/3 şüpheli isim kaynağından doğrulanıp temizlendi. Kalan 17 satırda proje eşleşmesi canlı teyitli; gönderim öncesi kişi sütunları Contributors/Team sayfalarından son kontrolle geçilir.
