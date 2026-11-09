import type { Metadata } from "next";
import LegalPage, { H2, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/site";
import { TILVORA_KAYNAK as K, boyutMB } from "@/lib/tilvora-kaynak";

// Open-source obligation page (MPL-2.0 s. 3.2(a): access to source code). Turkish version at /tilvora/kaynak; change one, change both.
// Tilvora has not been announced yet, so this page is kept out of search engines (noindex, not in the sitemap).
export const metadata: Metadata = {
  title: "Tilvora open-source components",
  description: "Version, licence and source code of the Sparrow (MIT) and jagua-rs (MPL-2.0) components used by Tilvora.",
  alternates: { canonical: "/en/tilvora/kaynak", languages: { tr: "/tilvora/kaynak", en: "/en/tilvora/kaynak" } },
  robots: { index: false, follow: true },
};

const link = "text-primary hover:text-primary-light";

export default function TilvoraSourcePage() {
  return (
    <LegalPage eyebrow={<span lang="en">Tilvora</span>} title="Tilvora open-source components" lang="en" updated={false} altLink={{ href: "/tilvora/kaynak", label: "Türkçe sürüm" }}>
      <div className="space-y-6 text-[1.0625rem] leading-relaxed">
      <p>Last updated: November 9, 2026</p>
      <p>Tilvora uses two open-source components to place irregularly shaped parts on sheets: <b>Sparrow</b> and <b>jagua-rs</b>. This page shows which component is used under which licence and in which version, and lets you download the source code.</p>
      <H2>1. Components</H2>
      <List>
        <li><b>Sparrow</b> (a fork adapted for Tilvora): MIT licence. Upstream <a className={link} href={K.sparrowDepo}>github.com/JeroenGar/sparrow</a>; the adaptation is based on upstream commit <code>{K.sparrowUstKaynakCommit}</code>; the Tilvora fork is commit <code>{K.sparrowCommit}</code>. The additions and changes made for Tilvora are in the archive under the MIT licence as well.</li>
        <li><b>jagua-rs</b> {K.jaguaSurum}: Mozilla Public License 2.0 (MPL-2.0). Upstream <a className={link} href={K.jaguaDepo}>github.com/JeroenGar/jagua-rs</a>, tag <code>v{K.jaguaSurum}</code>, commit <code>{K.jaguaCommit}</code>. <b>jagua-rs has not been modified.</b> The copy in the archive is the unmodified package published on crates.io; its <code>src</code> directory is byte-identical to the upstream <code>v{K.jaguaSurum}</code> tag.</li>
        <li><b>Other dependencies:</b> packages from crates.io, pinned by the <code>Cargo.lock</code> file, each under its own licence (mostly MIT or Apache-2.0).</li>
      </List>
      <H2>2. Download the source code</H2>
      <p>
        <a className={link} href={K.yol} download>{K.dosya}</a> ({boyutMB(K.boyutBayt, ".")} MB). The archive contains: the complete source of the Sparrow fork, the <code>Cargo.lock</code> Tilvora uses, the jagua-rs {K.jaguaSurum} source (<code>third_party/jagua-rs-2.0.0</code>), the full text of both licences (<code>LICENSE-MIT-sparrow</code>, <code>LICENSE-MPL-2.0-jagua-rs</code>) and a short note (<code>KAYNAK-NOTU.md</code>, English and Turkish).
      </p>
      <p>SHA-256: <code className="break-all">{K.sha256}</code></p>
      <p>The full text of the MPL-2.0 licence: <a className={link} href={K.mplMetni}>mozilla.org/MPL/2.0</a>. You may use, modify and distribute the archive as these licences permit.</p>
      <H2>3. How Tilvora uses these components</H2>
      <List>
        <li>Sparrow, compiled together with jagua-rs, ships next to Tilvora as a separate program (<code>sparrow.exe</code>).</li>
        <li>Tilvora does not run this program inside its own process; it starts it as a separate process: it hands over the parts and sheet data in a JSON file and reads the result from an output file.</li>
        <li>Tilvora&apos;s own code is not in this archive; the archive contains only Sparrow and jagua-rs. The licences on this page apply to those two components.</li>
      </List>
      <H2>4. Building</H2>
      <p>With Rust 1.90 or newer, unpack the archive and run <code>cargo build --release --locked</code>. The result is <code>target/release/sparrow</code> (<code>sparrow.exe</code> on Windows). The Windows build uses the static C runtime so that it does not need an extra runtime library (<code>.cargo/config.toml</code>).</p>
      <H2>5. Contact</H2>
      <p>For questions or requests about the source code: <a className={link} href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
      <p>These components are provided &quot;as is&quot;, as stated in the respective licences. Any warranty we give for Tilvora is given by {COMPANY.tradeName} alone and cannot be attributed to the authors of Sparrow or jagua-rs.</p>
      </div>
    </LegalPage>
  );
}
