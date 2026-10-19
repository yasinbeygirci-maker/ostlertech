import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideChecklist, { guideMetadata, type GuideItem } from "@/components/GuideChecklist";

// Instagram "LİSTE" yorum mıknatısının sayfası. Premium ibareleri koddan: VaultHealthScreen isPremium (ortak-beyin §16).
const PATH = "/guvenlik-kontrol-listesi";
const title = "Güvenlik kontrol listesi: telefonun çalınsa hesapların güvende mi?";
const description =
  "10 maddelik güvenlik kontrol listesi: ayrı şifre, en az 15 karakter, iki adımlı doğrulama, kurtarma kodları, ekran kilidi, sızıntı kontrolü. Hepsi NIST, CISA ve Google kaynaklı.";

export const metadata: Metadata = guideMetadata({ path: PATH, trPath: PATH, enPath: "/en/security-checklist", lang: "tr", title, description });

const PLAY =
  "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dliste%26utm_content%3Dsayfa_tr";

const items: GuideItem[] = [
  { heading: "Her hesaba ayrı şifre", lines: ["Bir sızıntı tek hesapta kalsın. Akılda tutmayı şifre yöneticisine bırak."], sources: ["CISA"], syncpass: "Güvenlik puanı tekrar eden şifreleri gösterir" },
  { heading: "En az 15 karakter", lines: ["Uzunluk, karmaşık kurallardan daha çok işe yarar. Birkaç kelimelik bir cümle de olur."], sources: ["NIST"], syncpass: "Şifre üretici" },
  { heading: "E-posta ve bankada iki adımlı doğrulama", lines: ["Şifre ele geçse bile ikinci adım girişi durdurur."], sources: ["CISA"], syncpass: "2FA kodları (Premium)" },
  { heading: "Mümkünse SMS yerine uygulama ya da passkey", lines: ["NIST, SMS ile doğrulamayı “kısıtlı” yöntemler arasında sayar."], sources: ["NIST"], syncpass: "Passkey saklama; 2FA kodları (Premium)" },
  { heading: "Kurtarma kodlarını güvenli yerde sakla", lines: ["Telefonu kaybedince hesaba dönüş yolun bunlar."], syncpass: "Güvenli not" },
  { heading: "Kurtarma e-postası ve telefonu güncel", lines: ["Giriş e-postandan farklı, düzenli kullandığın bir adres seç. Telefon numarası değişikliği 7 güne kadar sürebilir."], sources: ["Google"] },
  { heading: "Ekran kilidi ve uzaktan bul/kilitle/sil açık", lines: ["Bu özellik telefon kaybolmadan önce açık olmalı."], sources: ["Google"], syncpass: "Uygulamadan çıkınca kasa kilitlenir" },
  { heading: "Güncellemeler otomatik", lines: ["Güvenlik açıkları güncellemeyle kapanır."], sources: ["CISA"] },
  { heading: "Şifren bir sızıntıda var mı?", lines: ["Sızmış şifreyi hemen değiştir. NIST de yeni şifrenin sızıntı listelerine karşı denetlenmesini ister."], sources: ["NIST"], syncpass: "Sızıntı kontrolü (Premium); şifre telefondan çıkmaz, yalnız özetin ilk 5 karakteri" },
  { heading: "Bağlantıyla gelen sayfaya şifre yazma", lines: ["Adresi kendin yaz ya da uygulamayı aç. Şüpheli mesajı bildir."], sources: ["CISA"], syncpass: "Otomatik doldurma yalnız eşleşen sitede önerir" },
];

export default function GuvenlikKontrolListesi() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <GuideChecklist
        lang="tr"
        label="Rehber"
        title="Telefonun çalınsa hesapların güvende mi? 10 kontrol"
        sub="Her maddenin yanına işaret koy. Hepsi resmî kaynaklardan; kaynaklar sayfanın altında."
        pdfHref="/rehber/guvenlik-kontrol-listesi.pdf"
        items={items}
        ctaLabel="SyncPass'i ücretsiz başlat"
        ctaHref={PLAY}
        disclaimer="Bu liste genel bilgilendirmedir. OstlerTech · ostlertech.com"
        related={{ href: "/dijital-guvenlik-plani", label: "Sıradaki adım: 7 günde dijital güvenlik planı" }}
      />
      <Footer />
    </main>
  );
}
