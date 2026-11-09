import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { TILVORA_KAYNAK as K, boyutMB } from "@/lib/tilvora-kaynak";

// Açık kaynak yükümlülüğü sayfası (MPL-2.0 md. 3.2(a): kaynak koda erişim). İngilizcesi /en/tilvora/kaynak; biri değişirse diğeri de.
// Tilvora henüz tanıtılmadığı için sayfa arama motoruna açılmaz (noindex, sitemap dışı).
export const metadata: Metadata = {
  title: "Tilvora açık kaynak bileşenleri",
  description: "Tilvora'nın kullandığı Sparrow (MIT) ve jagua-rs (MPL-2.0) bileşenlerinin sürümü, lisansı ve kaynak kodu.",
  alternates: { canonical: "/tilvora/kaynak", languages: { tr: "/tilvora/kaynak", en: "/en/tilvora/kaynak" } },
  robots: { index: false, follow: true },
};

const link = "text-primary hover:text-primary-light";

export default function TilvoraKaynakPage() {
  return (
    <LegalPage eyebrow={<span lang="en">Tilvora</span>} title="Tilvora açık kaynak bileşenleri" updated={false} altLink={{ href: "/en/tilvora/kaynak", label: "English" }}>
      <div className="space-y-6 text-[1.0625rem] leading-relaxed">
      <p>Son güncelleme: 9 Kasım 2026</p>
      <p>Tilvora, düzensiz şekilli parçaları levhaya yerleştirmek için iki açık kaynak bileşenden yararlanır: <b>Sparrow</b> ve <b>jagua-rs</b>. Bu sayfa, hangi bileşenin hangi lisansla ve hangi sürümle kullanıldığını gösterir ve kaynak kodunu indirmenize olanak verir.</p>
      <H2>1. Bileşenler</H2>
      <List>
        <li><b>Sparrow</b> (Tilvora için uyarlanmış çatal): MIT lisansı. Üst kaynak <a className={link} href={K.sparrowDepo}>github.com/JeroenGar/sparrow</a>, uyarlamanın temeli <code>{K.sparrowUstKaynakCommit}</code> commit&apos;i, Tilvora çatalı <code>{K.sparrowCommit}</code> commit&apos;i. Tilvora için yapılan eklemeler ve değişiklikler de MIT lisansıyla bu arşivdedir.</li>
        <li><b>jagua-rs</b> {K.jaguaSurum}: Mozilla Public License 2.0 (MPL-2.0). Üst kaynak <a className={link} href={K.jaguaDepo}>github.com/JeroenGar/jagua-rs</a>, <code>v{K.jaguaSurum}</code> etiketi, commit <code>{K.jaguaCommit}</code>. <b>jagua-rs&apos;e hiçbir değişiklik yapılmadı.</b> Arşivdeki kopya, crates.io&apos;daki yayımlanmış paketin değiştirilmemiş hâlidir; <code>src</code> klasörü üst kaynağın <code>v{K.jaguaSurum}</code> etiketiyle bayt bayt aynıdır.</li>
        <li><b>Diğer bağımlılıklar:</b> <code>Cargo.lock</code> dosyasıyla sürümleri sabitlenmiş, crates.io&apos;dan gelen paketlerdir ve kendi lisanslarına tabidir (çoğunlukla MIT veya Apache-2.0).</li>
      </List>
      <H2>2. Kaynak kodunu indirin</H2>
      <p>
        <a className={link} href={K.yol} download>{K.dosya}</a> ({boyutMB(K.boyutBayt, ",")} MB). Arşivde şunlar bulunur: Sparrow çatalının tam kaynağı, Tilvora&apos;nın kullandığı <code>Cargo.lock</code>, jagua-rs {K.jaguaSurum} kaynağı (<code>third_party/jagua-rs-2.0.0</code>), iki lisansın tam metni (<code>LICENSE-MIT-sparrow</code>, <code>LICENSE-MPL-2.0-jagua-rs</code>) ve kısa bir açıklama (<code>KAYNAK-NOTU.md</code>).
      </p>
      <p>SHA-256: <code className="break-all">{K.sha256}</code></p>
      <p>MPL-2.0 lisansının tam metni: <a className={link} href={K.mplMetni}>mozilla.org/MPL/2.0</a>. Arşivi bu lisansların izin verdiği şekilde kullanabilir, değiştirebilir ve dağıtabilirsiniz.</p>
      <H2>3. Tilvora bu bileşenleri nasıl kullanır</H2>
      <List>
        <li>Sparrow, jagua-rs ile birlikte derlenmiş ayrı bir program olarak (<code>sparrow.exe</code>) Tilvora&apos;nın yanında gelir.</li>
        <li>Tilvora bu programı kendi sürecinde değil, ayrı bir süreç olarak çalıştırır: parça ve levha bilgisini bir JSON dosyasıyla verir, sonucu çıktı dosyasından okur.</li>
        <li>Tilvora&apos;nın kendi kodu bu arşivde yoktur; arşivde yalnızca Sparrow ve jagua-rs bulunur. Bu iki bileşen için bu sayfadaki lisanslar geçerlidir.</li>
      </List>
      <H2>4. Derleme</H2>
      <p>Rust 1.90 veya daha yenisi ile arşivi açtıktan sonra <code>cargo build --release --locked</code> komutu yeterlidir. Çıktı <code>target/release/sparrow</code> (Windows&apos;ta <code>sparrow.exe</code>) olur. Windows derlemesi, ek bir çalışma zamanı kitaplığı istememesi için statik C çalışma zamanı kullanır (<code>.cargo/config.toml</code>).</p>
      <H2>5. İletişim</H2>
      <p>Soru veya kaynak koduyla ilgili talepleriniz için: <a className={link} href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
      <p>Bu bileşenler, ilgili lisanslarda belirtildiği gibi &quot;olduğu gibi&quot; sunulur. Tilvora için verdiğimiz herhangi bir garanti yalnızca {COMPANY.tradeName} adınadır; Sparrow ve jagua-rs&apos;in yazarlarına yüklenemez.</p>
      </div>
    </LegalPage>
  );
}
