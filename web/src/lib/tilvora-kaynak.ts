// Tilvora açık kaynak bileşenleri: /tilvora/kaynak ve /en/tilvora/kaynak sayfalarının ortak verisi.
// Arşiv değişirse (yeni commit) dosya adı, boyut ve SHA-256 birlikte güncellenir; tests/tilvora-kaynak.test.ts dosyayı bu değerlerle karşılaştırır.
export const TILVORA_KAYNAK = {
  dosya: "tilvora-sparrow-kaynak-b44b411.zip",
  yol: "/tilvora/tilvora-sparrow-kaynak-b44b411.zip",
  boyutBayt: 1099834,
  sha256: "f998b7f3673b29dd9d3e84c11d22af9bd0b972235e7aa7502374a59b4a255e73",
  sparrowCommit: "b44b411",
  sparrowUstKaynakCommit: "ca4ee65",
  jaguaSurum: "2.0.0",
  jaguaCommit: "783a1f27171c3ee64c0ac7282d961ff210bb97ee",
  sparrowDepo: "https://github.com/JeroenGar/sparrow",
  jaguaDepo: "https://github.com/JeroenGar/jagua-rs",
  mplMetni: "https://www.mozilla.org/MPL/2.0/",
} as const;

export function boyutMB(bayt: number, ondalik: string): string {
  return (bayt / 1024 / 1024).toFixed(1).replace(".", ondalik);
}
