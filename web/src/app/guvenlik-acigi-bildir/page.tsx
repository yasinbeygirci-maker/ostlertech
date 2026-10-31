import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { SECURITY_CONTACT_EMAIL } from "@/lib/site";

// TASLAK: politika niteliğinde; yayından önce Zeynep (hukuk) ve Burak (güvenlik) gözden geçirir.
// /en/report-vulnerability sayfasının Türkçe karşılığı. Biri değişirse diğeri de aynı işte güncellenir.
export const metadata: Metadata = {
  title: "Güvenlik açığı bildir",
  description: "OstlerTech ürünlerinde güvenlik açığı bulduysanız nasıl bildireceğinizi anlatır: kapsam, bildirimde yer alması gerekenler ve 90 günlük koordineli ifşa süreci.",
  alternates: { canonical: "/guvenlik-acigi-bildir", languages: { tr: "/guvenlik-acigi-bildir", en: "/en/report-vulnerability" } },
};

const link = "text-primary hover:text-primary-light";

export default function GuvenlikAcigiBildirPage() {
  return (
    <LegalPage
      eyebrow="Güvenlik"
      title="Güvenlik açığı bildir"
      updatedOn="31 Ekim 2026"
      altLink={{ href: "/en/report-vulnerability", label: "English version" }}
    >
      <p>
        OstlerTech ürünlerinde bir güvenlik açığı bulduğunuzu düşünüyorsanız bize bildirmenizi rica ederiz. Bildirimleri
        ciddiye alırız; doğrulanan açıklar için düzeltme ya da önlem hazırlar, kullanıcıları etkileyen durumlarda bunu düzeltmenin yer aldığı sürümün notunda belirtiriz.
      </p>
      <p>
        Bildirim için:{" "}
        <a href={`mailto:${SECURITY_CONTACT_EMAIL}?subject=${encodeURIComponent("Güvenlik açığı bildirimi")}`} className={`font-semibold ${link}`}>{SECURITY_CONTACT_EMAIL}</a>
        {" "}(konu satırına &quot;Güvenlik açığı bildirimi&quot; yazmanız işimizi kolaylaştırır). Bu adres{" "}
        <a href="/.well-known/security.txt" className={link}>security.txt</a> dosyamızda da yer alır.
      </p>

      <H2>Kapsam</H2>
      <p>Aşağıdakilerde bulunan güvenlik açıkları kapsamdadır:</p>
      <List>
        <li>SyncPass Android uygulaması (Google Play&apos;de yayımlanmış sürüm)</li>
        <li>SyncPass Masaüstü (Windows) uygulaması</li>
        <li>SyncPass Chrome eklentisi</li>
        <li>ostlertech.com sitesi ve bu sitenin sunduğu hizmetler (ör. lisans anahtarı sayfası)</li>
      </List>

      <H2>Kapsam dışı</H2>
      <List>
        <li>Sosyal mühendislik (kandırma, oltalama), fiziksel saldırılar ve OstlerTech çalışanlarına ya da kullanıcılarına yönelik her türlü deneme.</li>
        <li>Hizmeti aksatmaya yönelik testler (DoS/DDoS), yoğun otomatik tarama ve istek yağdırma.</li>
        <li>Cihazı zaten ele geçirmiş birinin yapabilecekleri (root/jailbreak edilmiş cihaz, cihaza kötü amaçlı yazılım kurulmuş olması, kilidi açık ve başkasının elinde olan cihaz).</li>
        <li>Etkisi gösterilemeyen bulgular: yalnızca otomatik tarama aracı çıktısı, eksik güvenlik başlığı ya da çerez bayrağı gibi somut bir saldırıya dönüştürülemeyen tespitler.</li>
        <li>Üçüncü tarafların kendi sistemleri (ör. Google Play, Paddle, Supabase, Cloudflare, tarayıcı mağazaları). Bunlardaki açıkları ilgili şirkete bildirin.</li>
        <li>Desteği sona ermiş eski sürümler ve yayımlanmamış test derlemeleri.</li>
        <li>Spam, e-posta yapılandırması (SPF/DMARC) önerileri ve benzeri sıkılaştırma (hardening) önerileri; bunları da memnuniyetle okuruz, ancak güvenlik açığı bildirimi sayılmaz.</li>
      </List>

      <H2>Test ederken</H2>
      <List>
        <li>Yalnızca kendi hesabınız, kendi kasanız ve kendi cihazlarınızla test edin. Başkasının verisine erişmeyin; yanlışlıkla erişirseniz durun ve bize bildirin.</li>
        <li>Bildirimlere gerçek şifre, kasa içeriği ya da başka kişilere ait kişisel veri eklemeyin. Gerekirse sahte (örnek) veri kullanın.</li>
        <li>Bulduğunuz açığı doğrulamak için gerekenden fazlasını yapmayın: veriyi indirmeyin, değiştirmeyin, silmeyin.</li>
        <li>ostlertech.com&apos;da yalnızca kendi lisansınızla ve normal kullanım düzeyinde istekle test edin; başkasının lisansını ya da kaydını denemeyin.</li>
      </List>

      <H2>Bildirimde neler yazılmalı</H2>
      <List>
        <li>Etkilenen ürün ve sürüm (uygulama ayarlarındaki sürüm numarası), cihaz ve işletim sistemi.</li>
        <li>Açığın kısa özeti ve etkisi: bir saldırgan bununla ne yapabilir?</li>
        <li>Adım adım yeniden üretme yolu; mümkünse ekran görüntüsü, kısa video ya da kavram kanıtı kodu.</li>
        <li>Bulguyu başka kimlerle paylaştığınız ve herkese açık bir ifşa tarihi planlayıp planlamadığınız.</li>
        <li>Teşekkür listesinde adınızın (ya da takma adınızın) yer almasını isteyip istemediğiniz.</li>
      </List>
      <p>
        Güvenli bir iletişim kanalı gerekiyorsa ilk e-postada yalnızca kısa bilgi verin ve bunu belirtin; ayrıntıları
        iletmek için birlikte uygun bir yol belirleriz.
      </p>

      <H2>Süreç ve 90 günlük koordineli ifşa</H2>
      <List>
        <li>Bildiriminizin bize ulaştığını genellikle birkaç iş günü içinde yazılı olarak teyit etmeyi hedefleriz.</li>
        <li>Bulguyu doğrular, etkisini değerlendirir ve düzeltme için tahmini bir takvim paylaşırız.</li>
        <li>Düzeltme yayımlanana kadar ayrıntıları üçüncü kişilerle paylaşmamanızı ve herkese açık yayımlamamanızı rica ederiz.</li>
        <li>Koordineli ifşa için üst sınır, bildirimin bize ulaştığı tarihten itibaren <strong className="text-foreground">90 gün</strong>dür. Bu süre içinde düzeltme yayımlanırsa ifşa tarihini birlikte belirleriz. Düzeltme 90 günde tamamlanamazsa gerekçesini yazarak sizinle görüşürüz; süre uzatması karşılıklı anlaşmayla yapılır. 90 gün dolduğunda bulguyu yayımlamadan önce bize haber vermenizi ve kullanıcıları doğrudan riske atacak çalışan saldırı kodunu yayımlamamanızı rica ederiz.</li>
        <li>Kullanıcıları doğrudan ilgilendiren bir açık için düzeltme çıkınca sürümün notunda bunu belirtiriz.</li>
      </List>

      <H2>Teşekkür listesi</H2>
      <p>
        Düzeltilen açıkları bildirenlerin adını ya da takma adını, yalnızca bize yazılı olarak açıkça izin verirlerse
        burada teşekkürle anarız. Listede yer almak isteğe bağlıdır; izninizi istediğiniz zaman geri alabilirsiniz,
        adınızı listeden çıkarırız.
      </p>
      <p className="rounded-2xl border border-line bg-surface p-5 text-foreground">Listede henüz adı geçen kimse yok.</p>

      <H2>Bu sayfanın kapsamı</H2>
      <p>
        Bu sayfa, bildirimlerin nasıl ele alındığını anlatır. Ödül (bug bounty) ya da herhangi bir ödeme taahhüdü
        içermez; ayrıca hukuki bir güvence ya da bağışıklık sağlamaz. Bununla birlikte, yukarıdaki kurallara uyarak
        iyi niyetle yapılan bildirimlere iyi niyetle karşılık vermeyi amaçlarız. Kişisel verilerin işlenmesi için{" "}
        <a href="/gizlilik" className={link}>Gizlilik ve KVKK</a> metnine bakabilirsiniz.
      </p>
    </LegalPage>
  );
}
