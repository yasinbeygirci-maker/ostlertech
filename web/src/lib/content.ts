import "server-only";
import fs from "node:fs";
import path from "node:path";

// src/content/*.md dosyalarını okur (derleme sırasında). Kaynak metinler OstlerTech\site-icerik\2026-10-31 altındadır;
// scripts/icerik-esitle.mjs yayın metni bölümünü buraya kopyalar. Bu klasördeki dosyayı elle değiştirme.
export function readContent(name: string): string {
  return fs.readFileSync(path.join(process.cwd(), "src", "content", name), "utf8");
}
