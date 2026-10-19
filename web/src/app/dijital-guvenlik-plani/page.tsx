import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideChecklist, { guideMetadata, type GuideItem } from "@/components/GuideChecklist";

// Instagram "PLAN" yorum mıknatısının sayfası. Premium ibareleri koddan: VaultHealthScreen isPremium (ortak-beyin §16).
const PATH = "/dijital-guvenlik-plani";
const title = "7 günde dijital güvenlik planı: günde 10 dakika";
const description =
  "Günde 10 dakika, her gün tek iş: e-posta hesabı, şifreleri tek yere toplamak, tekrar eden şifreler, iki adımlı doğrulama, kurtarma seçenekleri, telefon ve eski hesaplar.";

export const metadata: Metadata = guideMetadata({ path: PATH, trPath: PATH, enPath: "/en/digital-security-plan", lang: "tr", title, description });

const PLAY =
  "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dplan%26utm_content%3Dsayfa_tr";

const items: GuideItem[] = [
  {
    heading: "1. gün · Önce e-posta hesabın (10 dk)",
    lines: [
      "E-posta şifreni en az 15 karakterlik, başka hiçbir yerde kullanmadığın bir şifreyle değiştir.",
      "İki adımlı doğrulamayı aç.",
      "Neden önce bu: bütün “şifremi unuttum” bağlantıları buraya gelir. E-postayı alan, gerisini de alır.",
    ],
  },
  {
    heading: "2. gün · Şifrelerini tek yere topla (10 dk)",
    lines: [
      "Tarayıcında ya da önceki şifre yöneticinde duran şifreleri dışa aktar, sonra yeni kasana al. Not defterindekileri elle ekle.",
      "Aktardıktan sonra dışa aktarma dosyasını sil (çöp kutusundan da).",
      "SyncPass'te: Ayarlar → İçe ve Dışa Aktar; tarayıcından ya da önceki şifre yöneticinden aldığın CSV/JSON dosyasını seç. Ücretsiz sürüm 15 kayıt tutar.",
    ],
  },
  {
    heading: "3. gün · Tekrar eden şifreleri değiştir (10 dk)",
    lines: [
      "En önemli 5 hesaptan başla: e-posta, banka, telefon operatörü, sosyal medya, alışveriş.",
      "Önce sitede değiştir, sonra kasaya kaydet; tersini yaparsan eski şifre kaybolur.",
      "SyncPass'te: güvenlik puanı ekranı zayıf ve tekrar eden şifreleri listeler, kayda dokununca açar.",
    ],
  },
  {
    heading: "4. gün · İki adımlı doğrulama (10 dk)",
    lines: [
      "Banka, sosyal medya ve alışveriş hesaplarında aç.",
      "Seçenek varsa SMS yerine doğrulayıcı uygulama ya da passkey seç.",
      "Kurtarma kodlarını kaydet; telefonu kaybedersen hesaba dönüş yolun bunlar.",
      "SyncPass'te: passkey saklama; 2FA kodları ve canlı geri sayım Premium'da.",
    ],
  },
  {
    heading: "5. gün · Kurtarma seçenekleri (10 dk)",
    lines: [
      "E-posta ve önemli hesaplarda kurtarma telefonu ve e-postası güncel mi bak.",
      "Kurtarma e-postası, giriş yaptığın adresten farklı ve düzenli kullandığın bir adres olsun.",
      "Ana şifreni unutma ihtimaline karşı SyncPass'in kurtarma QR kodunu oluştur, kâğıda basıp sakla.",
    ],
  },
  {
    heading: "6. gün · Telefonun (10 dk)",
    lines: [
      "Ekran kilidi: tahmin edilmesi zor bir PIN ya da daha güçlüsü.",
      "Uzaktan bul, kilitle ve sil özelliğini aç; telefon kaybolmadan önce açık olmalı.",
      "Otomatik güncellemeleri aç.",
    ],
  },
  {
    heading: "7. gün · Sızıntı kontrolü ve eski hesaplar (10 dk)",
    lines: [
      "Şifrelerinin bilinen bir sızıntıda olup olmadığına bak; çıkanları hemen değiştir.",
      "Artık kullanmadığın hesapları kapat; kapanmayanın şifresini değiştir.",
      "SyncPass'te: sızıntı kontrolü Premium'da. Telefondan yalnız şifre özetinin ilk 5 karakteri çıkar, şifrenin kendisi asla.",
    ],
  },
];

export default function DijitalGuvenlikPlani() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <GuideChecklist
        lang="tr"
        label="Rehber"
        title="7 günde dijital güvenlik planı"
        sub="Günde 10 dakika, her gün tek iş. Bitirdiğin günü işaretle."
        pdfHref="/rehber/dijital-guvenlik-plani.pdf"
        items={items}
        numbered={false}
        after="Sonra: Ayda bir 5 dakika: güvenlik puanına bak, yeni hesapları kasaya ekle."
        ctaLabel="SyncPass'i indir"
        ctaHref={PLAY}
        disclaimer="Bu plan genel bilgilendirmedir. OstlerTech · ostlertech.com"
        related={{ href: "/guvenlik-kontrol-listesi", label: "10 maddelik güvenlik kontrol listesi" }}
      />
      <Footer />
    </main>
  );
}
