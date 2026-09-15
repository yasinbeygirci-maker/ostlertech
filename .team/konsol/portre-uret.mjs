/**
 * PORTRE ÜRETİCİ — 14 ajan için stilize SVG portre avatarları
 * ------------------------------------------------------------
 * Kaynak: .team/konsol/komuta-server.mjs içindeki TEAM dizisi
 * (regex ile ayrıştırılır — tek kaynak, çift bakım yok)
 * Çıktı:  web/public/team/<ajanId>.svg
 *
 * Çalıştır: node .team/konsol/portre-uret.mjs
 * Yeniden üretmek güvenlidir — aynı TEAM → aynı portreler (deterministik).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KONSOL_DIR = path.dirname(fileURLToPath(import.meta.url))
const PROJE_KOK = path.resolve(KONSOL_DIR, '..', '..')
const SERVER = path.join(KONSOL_DIR, 'komuta-server.mjs')
const CIKTI_DIR = path.join(PROJE_KOK, 'web', 'public', 'team')

// ---- TEAM'i sunucudan ayrıştır ----
const kaynak = fs.readFileSync(SERVER, 'utf8')
const ekip = []
const rx = /\{ id: '([^']+)', ad: '([^']+)', rol: '([^']*)', ikon: '([^']+)', renk: '([^']+)'/g
let m
while ((m = rx.exec(kaynak))) {
  ekip.push({ id: m[1], ad: m[2], rol: m[3], ikon: m[4], renk: m[5] })
}
if (ekip.length < 10) {
  console.error('TEAM ayrıştırılamadı — bulunan:', ekip.length)
  process.exit(1)
}

// ---- Deterministik hash ----
function hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

// Renk yardımcıları
function karis(renk, hedef, oran) {
  const p = (r) => [1, 3, 5].map(i => parseInt(r.slice(i, i + 2), 16))
  const [r1, g1, b1] = p(renk), [r2, g2, b2] = p(hedef)
  const c = (a, b) => Math.round(a + (b - a) * oran).toString(16).padStart(2, '0')
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`
}
function opak(renk, a) {
  const r = renk.slice(1)
  return `#${r}${Math.round(a * 255).toString(16).padStart(2, '0')}`
}

// ---- Halo desen varyantları (arka planda amblem) ----
function halo(varyant, cx, cy, r, renk) {
  switch (varyant % 5) {
    case 0: // kesik halka
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${renk}" stroke-width="3" stroke-dasharray="14 9" opacity=".5"/>`
    case 1: // nokta yörüngesi
      return Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="3" fill="${renk}" opacity=".45"/>`
      }).join('')
    case 2: // ışın demeti
      return Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        const x1 = cx + Math.cos(a) * (r - 10), y1 = cy + Math.sin(a) * (r - 10)
        const x2 = cx + Math.cos(a) * (r + 12), y2 = cy + Math.sin(a) * (r + 12)
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${renk}" stroke-width="2.5" opacity=".4"/>`
      }).join('')
    case 3: // çift konsantrik
      return `<circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="${renk}" stroke-width="2" opacity=".35"/>` +
             `<circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="none" stroke="${renk}" stroke-width="1.5" opacity=".25"/>`
    default: // altıgen çerçeve
      return Array.from({ length: 6 }, (_, i) => {
        const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2, a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2
        return `<line x1="${(cx + Math.cos(a1) * r).toFixed(1)}" y1="${(cy + Math.sin(a1) * r).toFixed(1)}" x2="${(cx + Math.cos(a2) * r).toFixed(1)}" y2="${(cy + Math.sin(a2) * r).toFixed(1)}" stroke="${renk}" stroke-width="3" opacity=".45"/>`
      }).join('')
  }
}

// ---- Portre SVG'si üret ----
function portre(a) {
  const h = hash(a.id)
  const cx = 128, basY = 118, basR = 52
  const koyu = '#0b1222', siluet = karis(a.renk, '#0f172a', 0.82)
  const monogram = a.ad.trim()[0].toUpperCase()

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${a.ad} portresi">
<defs>
  <radialGradient id="glow" cx="50%" cy="38%" r="65%">
    <stop offset="0" stop-color="${opak(a.renk, 0.34)}"/>
    <stop offset="1" stop-color="${koyu}"/>
  </radialGradient>
  <linearGradient id="govde" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${karis(a.renk, '#1e293b', 0.55)}"/>
    <stop offset="1" stop-color="${siluet}"/>
  </linearGradient>
</defs>
<rect width="256" height="256" fill="url(#glow)"/>
<!-- doku ızgarası -->
${Array.from({ length: 5 }, (_, i) => `<line x1="0" y1="${32 * (i + 1)}" x2="256" y2="${32 * (i + 1)}" stroke="${opak(a.renk, 0.06)}" stroke-width="1"/>`).join('')}
${Array.from({ length: 5 }, (_, i) => `<line x1="${32 * (i + 1)}" y1="0" x2="${32 * (i + 1)}" y2="256" stroke="${opak(a.renk, 0.06)}" stroke-width="1"/>`).join('')}
<!-- halo amblem -->
${halo(h, cx, basY, basR + 34, a.renk)}
<!-- hayalet monogram -->
<text x="128" y="86" font-family="Segoe UI, Arial, sans-serif" font-size="120" font-weight="800" text-anchor="middle" fill="${opak(a.renk, 0.14)}">${monogram}</text>
<!-- omuzlar -->
<path d="M36 256 C40 196 84 176 128 176 C172 176 216 196 220 256 Z" fill="url(#govde)"/>
<!-- yaka çizgisi (renk şeridi) -->
<path d="M100 256 C104 218 112 204 128 200 C144 204 152 218 156 256 Z" fill="${opak(a.renk, 0.8)}"/>
<!-- baş -->
<circle cx="${cx}" cy="${basY}" r="${basR}" fill="${siluet}"/>
<circle cx="${cx}" cy="${basY}" r="${basR}" fill="none" stroke="${opak(a.renk, 0.55)}" stroke-width="2.5"/>
<!-- yüz hatları (minimal) -->
<circle cx="${cx - 17}" cy="${basY - 6}" r="4.5" fill="${opak(a.renk, 0.85)}"/>
<circle cx="${cx + 17}" cy="${basY - 6}" r="4.5" fill="${opak(a.renk, 0.85)}"/>
<path d="M112 ${basY + 22} Q128 ${basY + 30} 144 ${basY + 22}" fill="none" stroke="${opak(a.renk, 0.5)}" stroke-width="3" stroke-linecap="round"/>
<!-- ışık vurgusu -->
<path d="M ${cx - basR + 6} ${basY - 30} A ${basR - 4} ${basR - 4} 0 0 1 ${cx + 20} ${basY - basR + 8}" fill="none" stroke="${opak(a.renk, 0.65)}" stroke-width="4" stroke-linecap="round"/>
</svg>\n`
}

// ---- Üret ----
fs.mkdirSync(CIKTI_DIR, { recursive: true })
for (const a of ekip) {
  const dosya = path.join(CIKTI_DIR, a.id + '.svg')
  fs.writeFileSync(dosya, portre(a))
  console.log('✓', a.id + '.svg', '—', a.ad)
}
console.log(`\n${ekip.length} portre üretildi → web/public/team/`)
