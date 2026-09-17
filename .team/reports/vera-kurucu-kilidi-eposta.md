# Vera — "İlk 100 Kurucu Kilidi" E-posta Hamlesi (17.09.2026, ONAYLANDI — Patron iki varyantı da onayladı)

> **PATRON ONAYI GEREKLİ** — aşağıdaki metinler taslaktır; hiçbir e-posta gönderilmedi.
> Kaynaklar: `web/src/app/anydoc/page.tsx` (fiyatlar + kurucu şartları), canlı GET
> `/api/anydoc/bekleme` → 98/100 kalan (dolu: 2).

## Gerçekler (uydurma yok)

| Veri | Değer | Kaynak |
|------|-------|--------|
| Kontenjan | 98/100 boş (2 kayıt) | Canlı API, 17.09 |
| Kurucu fiyatı | Stok $29 → **$14.50/ay** · Stok $99 → **$49.50/ay** · Özel → $399+ | landing FIYATLAR |
| Kurucu şartı | İlk 100 kayıttan aboneliğe geçene **ömür boyu %50** (abonelik aktif olduğu sürece) | landing SSS |
| Ek tatlı | İlk ay **5.000 sayfa ücretsiz**, kredi kartı gerekmez | landing |
| Ürün | PDF/DOCX/XLSX/EPUB/HTML → LLM-hazır Markdown (Rust motoru, tablo/başlık korumalı) | landing |

## Varyant A — Bekleme listesindekilere (mevcut 2 kayıt + gelenler)

**Konu seçenekleri:**
1. `Kurucu yeriniz kilitli — ilk 100'den %98'i hâlâ boş`
2. `AnyDoc: $14.50/ay ömür boyu fiyatınızı kimse almadan...`

**Gövde:**

> Merhaba {ad},
>
> AnyDoc erken erişim listesine kaydolduğunuz için teşekkürler — **{sira}. sıradasınız.**
>
> Hatırlatmak isterim: ilk 100 kişi arasında aboneliğe geçen herkes, aboneliği aktif kaldığı
> sürece **ömür boyu %50 indirimli kurucu fiyatına** kilitleniyor. Yani $29 yerine **$14.50/ay** —
> her ay, sonsuza dek. Üstelik ilk ay **5.000 sayfa ücretsiz**, kredi kartı istemiyoruz.
>
> Şu an kontenjanın **%98'i boş** — ama lansman duyurusuyla birlikte dolmasını bekliyoruz.
> Sıranız sabit; fiyat avantajı ise "ilk 100'den aboneliğe geçenlere" ait.
>
> Lansmanda ilk haberi alan olun: {landing_link}
>
> Sorularınız varsa bu maili cevaplayın — doğrudan bana geliyor.
>
> Vera — OstlerTech

## Varyant B — Soğuk çıkış (RAG/LLM hattı kuran ekiplere)

**Konu:** `PDF'leriniz RAG hattınızı beslemiyor mu? Rust motorlu AnyDoc — kurucu fiyatı $14.50/ay`

**Gövde:**

> Merhaba {ad},
>
> Ekiplerinizin LLM hattına belge basıyorsanız çoğu aracı kaybediyor: tablolar dağılıyor,
> başlıklar düz metne dönüşüyor, token israfı patlıyor. AnyDoc bunu çözmek için kuruldu:
> PDF/DOCX/XLSX/EPUB'u **yapıyı koruyan, token-verimli Markdown'a** çeviren Rust motoru.
>
> Lansman öncesi **ilk 100 kurucu** arasına davet ediyorum: ömür boyu %50 indirim
> ($29 yerine $14.50/ay), ilk ay 5.000 sayfa ücretsiz, kredi kartı yok.
>
> 30 saniyede listede yerinizi alın: {landing_link}
>
> Vera — OstlerTech

## Gönderim Planı (onaydan sonra)

1. **Segment 1:** bekleme listesi kayıtları (şu an 2 kişi) — Varyant A, elle gönderim
2. **Segment 2:** 20-30 kişilik hedef liste (RAG/LLM ekipleri, Türk + global) — Varyant B
3. **Zamanlama:** Salı–Perşembe 09:30–11:00 aralığı; A/B konu testi segment 2'nin yarısında
4. **Metrik:** açılma >%40 (küçük liste), tıklama >%15, kayıt dönüşümü hedefi: +20 kayıt / hafta
5. Onay gelirse Iris'e e-posta HTML şablonu görevi, Merve üzerinden dağıtılır
