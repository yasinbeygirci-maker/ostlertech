// Yayın metnini OstlerTech\site-icerik\2026-10-31 taslaklarından web/src/content/ altına kopyalar.
// Kullanım: node scripts/icerik-esitle.mjs   (taslak klasörü için KAYNAK ortam değişkeni verilebilir)
// Yalnız "YAYIN METNİ BAŞLANGICI/SONU" (EN: PUBLISHED TEXT START/END) işaretleri arasını alır; iç notlar sayfaya girmez.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const kaynak = process.env.KAYNAK || "D:/Development/OstlerTech/site-icerik/2026-10-31";
const hedef = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "content");
fs.mkdirSync(hedef, { recursive: true });

const isler = [
  ["karsilastirma-tr.md", "sifre-yoneticisi-karsilastirma.md"],
  ["guvenlik-belgesi-tr.md", "guvenlik-belgesi-tr.md"],
  ["guvenlik-belgesi-en.md", "guvenlik-belgesi-en.md"],
];
for (const [ad, hedefAd] of isler) {
  const s = fs.readFileSync(path.join(kaynak, ad), "utf8").replace(/\r\n/g, "\n");
  const m = /<!-- ===== (?:YAYIN METNİ|PUBLISHED TEXT) (?:BAŞLANGICI|START) ===== -->([\s\S]*?)<!-- ===== (?:YAYIN METNİ|PUBLISHED TEXT) (?:SONU|END) ===== -->/.exec(s);
  if (!m) throw new Error(`İşaretler bulunamadı: ${ad}`);
  fs.writeFileSync(path.join(hedef, hedefAd), m[1].trim() + "\n");
  console.log("yazıldı:", hedefAd);
}
