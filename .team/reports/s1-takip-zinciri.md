# TAKİP ZİNCİRİ — S1-1 Kurucu Kilidi (17.09 — **GÖNDERİM ONAYLI, kanıt: Gönderilmişler**)

> **Alıcı:** yasinbeygirci@gmail.com (Patron'un kendi kaydı — canlı görünüm testi)
> **Amaç:** Mailin Gmail'de görünümünü doğrulamak + takip ritmini kurmak.
> İlk gerçek müşteri kaydında aynı zincir aynen işletilir.

## Zincir Takvimi

| Gün | Tarih | Aksiyon | Durum |
|-----|-------|---------|-------|
| G+0 | 17.09 | İlk mail gönderildi | ✅ yapıldı |
| G+1 | 18.09 | Açılış/cevap kontrolü — cevap yoksa **dokunma** (erken) | bekliyor |
| G+3 | 20.09 | Cevap yoksa → **nazik hatırlatma** (aşağıdaki metin) | bekliyor |
| G+7 | 24.09 | Hâlâ cevap yoksa → kapanış maili + satır `cevap-yok` | bekliyor |
| Cevap gelirse | — | Satır `cevap-tamam` + sonuç notu (demo? kayıt? fiyat sorusu?) | — |

## Hatırlatma Metni (G+3, cevap yoksa)

**Konu:** Yeriniz hâlâ kilitli — sadece hatırlatmak istedim 🔒

---

Merhaba,

Birkaç gün önce AnyDoc kurucu avantajını anlatan bir mail göndermiştim — gözünden kaçtıysa diye kısa bir hatırlatma:

- Bekleme listesinde **1. sıradasın** — sıran sabit
- İlk 100'den aboneliğe geçene **ömür boyu %50 indirim** ($29 yerine $14.50/ay)
- İlk ay **5.000 sayfa ücretsiz**, kredi kartı yok

İstediğin an başlayabilirsin: https://www.ostlertech.com/anydoc

Bu maili cevaplamak da yeterli — sorularını doğrudan yanıtlarım.

OstlerTech Ekibi

---

## Kapanış Metni (G+7, hâlâ cevap yoksa)

**Konu:** Kurucu listesi dolmadan son söz — sonra kapanıyorum

---

Merhaba,

Sessizliğini "şimdi değil" diye okuyorum — gayet anlaşılır. Sana tek bir bilgi bırakıp çıkıyorum:

Kurucu avantajı **ilk 100 kayıtla sınırlı** ve lansman duyurusuyla birlikte dolmasını bekliyoruz. Kontenjan bittiğinde fiyat standart târife ($29/ay) dönecek — bu maili cevaplamadığın için hiçbir şey kaybetmezsin ama **1. sıradaki yerin ve %50 ömür boyu indirimin** beklediği sürece senin.

Kapı açık: https://www.ostlertech.com/anydoc

İyi çalışmalar dilerim,
OstlerTech Ekibi

---

## Kurallar

1. Metinler `gonderim-takip.md` defterindeki S1-1 satırına işlenir — cevap gelirse **önce** defter, **sonra** aksiyon.
2. Zincir tek alıcı için elle işletilir (altyapı yok); otomatik gönderim için Resend/Edge önerisi ayrı iş.
3. Zincir tamamlanınca bu dosyanın başlığına `KAPANDI` + sonuç yazılır.
4. **Gönderim kanıtı = Gönderilmişler (Sent) klasörü.** Mail orada yoksa gönderim sayılmaz — 17.09'daki ilk deneme tam olarak bu yüzden geçersizdi (yeniden gönderim yapıldıktan sonra tarih buraya düzeltilir).
