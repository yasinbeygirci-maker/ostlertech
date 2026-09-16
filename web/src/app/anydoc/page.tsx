import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Zap, ArrowRight, Check, FileCode2, Gauge, Lock, Database, Mail, Rocket, ShieldCheck, HelpCircle } from "lucide-react";
import BeklemeFormu from "./BeklemeFormu";

export const metadata: Metadata = {
  title: "AnyDoc — Belgelerinizi LLM Hazır Markdown'a Çevirin | OstlerTech",
  description:
    "PDF, Word, Excel ve EPUB belgelerini Rust gücüyle saniyeler içinde LLM hazırlığı yüksek Markdown'a dönüştürün. Erken erişim listesine katılın.",
};

const NASIL_CALISIR = [
  {
    baslik: "Belgeyi bırak veya URL ver",
    metin: "PDF, DOCX, XLSX, EPUB ya da HTML — format fark etmez.",
  },
  {
    baslik: "Rust motoru ayrıştırır",
    metin: "Tablolar, başlıklar, formüller ve liste yapıları yapısal olarak korunur.",
  },
  {
    baslik: "Temiz Markdown al",
    metin: "RAG boru hattına doğrudan beslenebilir, token-verimli çıktı.",
  },
];

const FORMATLAR = [
  { ozellik: "PDF (taramalı + dijital)", anydoc: true },
  { ozellik: "Word (DOCX)", anydoc: true },
  { ozellik: "Excel (XLSX) tablo koruma", anydoc: true },
  { ozellik: "EPUB / HTML", anydoc: true },
  { ozellik: "Başlık hiyerarşisi korunumu", anydoc: true },
  { ozellik: "Tablo → Markdown tablosu", anydoc: true },
];

const FIYATLAR = [
  {
    ad: "Developer",
    ikon: "🌐",
    fiyat: "$29",
    erken: "$14.50",
    limit: "Ayda 5.000 sayfa",
    fazla: "Fazlası $0.008 / sayfa",
    kim: "Kendi RAG uygulamasını geliştiren bağımsız geliştiriciler ve erken aşama projeler.",
  },
  {
    ad: "Pro",
    ikon: "⚡",
    fiyat: "$99",
    erken: "$49.50",
    limit: "Ayda 25.000 sayfa",
    fazla: "Fazlası $0.005 / sayfa + öncelikli OCR kuyruğu",
    kim: "Yoğun sözleşme ve finansal rapor analizi yapan hukuk büroları, fintech'ler ve ölçeklenen AI ürünleri.",
    vurgulu: true,
  },
  {
    ad: "Enterprise",
    ikon: "🏢",
    fiyat: "Özel",
    erken: "$399+",
    limit: "Sınırsız / özel hacim",
    fazla: "Özel SLA + on-prem seçeneği",
    kim: "Banka, sigorta ve yüksek güvenlikli veri işleyen kurumsal yapılar.",
  },
];

const SSS = [
  {
    s: "Bekleme listesi dönemi bittikten sonra kurucu indirimim geçerli kalacak mı?",
    c: "Evet. İlk 100 kayıt arasından aboneliğe geçen kullanıcılar, abonelik aktif kaldığı sürece ömür boyu %50 indirimli kurucu fiyatından yararlanır.",
  },
  {
    s: "Kullanmadığım sayfalar bir sonraki aya devreder mi?",
    c: "Pro ve Enterprise'da kullanılmayan haklar bir sonraki aya devredilir (en fazla 1 ay birikebilir). Developer paketinde haklar her ay sıfırlanır.",
  },
  {
    s: "Verilerim eğitim için kullanılıyor mu?",
    c: "Hayır. Belgeleriniz yalnızca dönüştürme için işlenir, hiçbir model eğitiminde kullanılmaz ve saklama süresi sizin seçiminize kalır.",
  },
  {
    s: "AnyDoc açık kaynak mı?",
    c: "AnyDoc, firecrawl/anydoc açık kaynak motoru üzerine kuruludur; OstlerTech tarafından yönetilen bulut servisi olarak sunulur. Kendi sunucunuzda çalıştırmak isterseniz Enterprise planındaki on-prem seçeneği tam size göre.",
  },
];

export default function AnydocPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl mb-8">
            <Rocket size={15} className="text-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">Erken Erişim — Bekleme Listesi Açık</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Karmaşık belgelerinizi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-300 to-blue-500">
              tek tıkla LLM hazır
            </span>{" "}
            Markdown&apos;a çevirin
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/60 leading-relaxed mb-10">
            PDF, Word, Excel ve EPUB belgelerini Rust gücüyle saniyeler içinde, yapısal
            bütünlüğü korunmuş temiz Markdown&apos;a dönüştürün. RAG boru hattınızın en
            sıkışık adımı artık darboğaz değil.
          </p>

          <BeklemeFormu />

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-xs text-white/50 font-medium">
            <span className="flex items-center gap-2"><Check size={14} className="text-primary" /> İlk ay 5.000 sayfa ücretsiz</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-primary" /> İlk 100 kayda ömür boyu %50</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-primary" /> Kredi kartı gerekmez</span>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-14">
            Üç adım. <span className="text-primary">Saniyeler.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {NASIL_CALISIR.map((adim, i) => (
              <div key={i} className="relative bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 hover:border-primary/30 transition-colors duration-300">
                <span className="absolute -top-4 left-8 w-9 h-9 rounded-xl bg-primary text-[#020617] font-black flex items-center justify-center shadow-lg shadow-primary/20">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold mt-4 mb-3">{adim.baslik}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{adim.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kıyaslama */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gauge size={22} className="text-primary" />
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center">Neden AnyDoc?</h2>
          </div>
          <p className="text-center text-white/55 mb-12 max-w-xl mx-auto">
            Belge ayrıştırma, AI projelerinin en büyük veri darboğazıdır. AnyDoc bu adımı
            Rust performansıyla çözer.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { ikon: FileCode2, baslik: "Yapısal doğruluk", metin: "Başlık hiyerarşisi ve tablolar bozulmadan Markdown'a taşınır — RAG kalitesinin temeli." },
              { ikon: Zap, baslik: "Rust hızı", metin: "Yorumlanan dillere göre kat kat hızlı, bellek dostu işleme — toplu arşiv dönüşümüne uygun." },
              { ikon: Lock, baslik: "Gizlilik odaklı", metin: "Belgeleriniz model eğitiminde kullanılmaz; kurumsal planlarda on-prem çalışır." },
            ].map((k, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-7">
                <k.ikon size={24} className="text-primary mb-4" />
                <h3 className="font-bold mb-2">{k.baslik}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{k.metin}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-left">
                  <th className="px-6 py-4 text-white/50 font-semibold">Desteklenen özellik</th>
                  <th className="px-6 py-4 text-center font-bold text-primary w-28">AnyDoc</th>
                </tr>
              </thead>
              <tbody>
                {FORMATLAR.map((f, i) => (
                  <tr key={i} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-6 py-3.5 text-white/70">{f.ozellik}</td>
                    <td className="px-6 py-3.5 text-center">
                      <Check size={16} className="text-primary inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Fiyat */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 mx-auto block w-fit">
            <ShieldCheck size={15} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Kurucu Avantajı — İlk 100 kayıt</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-4">
            Lansman öncesi <span className="text-primary">yarı fiyat</span>
          </h2>
          <p className="text-center text-white/55 mb-14 max-w-xl mx-auto">
            Bekleme listesine ilk 100 kişi arasında katılıp aboneliğe geçenler, ömür boyu
            %50 indirimli kurucu fiyatına kilitlenir.
          </p>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {FIYATLAR.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  p.vurgulu
                    ? "bg-primary/[0.06] border-2 border-primary/40 shadow-2xl shadow-primary/10"
                    : "bg-white/[0.02] border border-white/[0.08]"
                }`}
              >
                {p.vurgulu && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-[#020617] text-xs font-black uppercase tracking-wider whitespace-nowrap">
                    En popüler
                  </span>
                )}
                <div className="text-2xl mb-2">{p.ikon}</div>
                <h3 className="text-lg font-bold mb-4">{p.ad}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black">{p.fiyat}</span>
                  <span className="text-white/40 text-sm">/ ay</span>
                </div>
                <div className="text-xs font-bold text-primary mb-6">Kurucu fiyatı: {p.erken} / ay</div>
                <ul className="text-sm text-white/60 space-y-2.5 mb-6 flex-1">
                  <li className="flex items-start gap-2"><Check size={15} className="text-primary mt-0.5 shrink-0" />{p.limit}</li>
                  <li className="flex items-start gap-2"><Check size={15} className="text-primary mt-0.5 shrink-0" />{p.fazla}</li>
                </ul>
                <p className="text-xs text-white/45 leading-relaxed border-t border-white/[0.06] pt-4">{p.kim}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-white/40 mt-10 max-w-2xl mx-auto leading-relaxed">
            Fiyat garantisi: Pazarda bulacağınız daha ucuz ve eşdeğer kalitede doğrulanmış
            birim fiyatı belgeleriniz, aradaki farkı %10 indirimle eşitliyoruz.
          </p>
        </div>
      </section>

      {/* Bekleme Listesi CTA */}
      <section className="py-28 px-6 border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Mail size={28} className="text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Sıraya gir, kurucu fiyatını garantile</h2>
          <p className="text-white/55 mb-10">
            Erken erişim başladığında ilk haber sen olsun: API anahtarı, 5.000 ücretsiz
            sayfa ve ömür boyu %50 indirim.
          </p>
          <BeklemeFormu />
        </div>
      </section>

      {/* SSS */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <HelpCircle size={22} className="text-primary" />
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Sıkça Sorulanlar</h2>
          </div>
          <div className="space-y-4">
            {SSS.map((m, i) => (
              <details key={i} className="group bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
                <summary className="px-6 py-5 cursor-pointer font-semibold text-white/85 text-sm md:text-base flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden hover:text-primary transition-colors">
                  {m.s}
                  <ArrowRight size={16} className="text-white/30 group-open:rotate-90 group-open:text-primary transition-transform shrink-0" />
                </summary>
                <p className="px-6 pb-6 text-sm text-white/55 leading-relaxed">{m.c}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
