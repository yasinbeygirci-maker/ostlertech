/**
 * OSTLERTECH KOMUTA MERKEZİ — Komuta Sunucusu
 * ------------------------------------------------------------
 * Patron'un Jarvis'i: tarayıcıdan konuşulan emirleri alır,
 * seçili ajanı .agents/ tanımlarıyla @codebuff/sdk üzerinden
 * çalıştırır, sohbet hafızasını oturum başına tutar.
 *
 * Çalıştırma:  node .team/konsol/komuta-server.mjs
 * Port:        4311  (env: KOMUTA_PORT ile değiştirilebilir)
 *
 * NOT: CODEBUFF_API_KEY gerektirir.
 *   - Önceki oturumda `codebuff login` yapıldıysa kimlik otomatik
 *     çözülür (CodebuffClient credential fallback).
 *   - Aksi halde .team/konsol/.env içine koy: CODEBUFF_API_KEY=...
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
import { ajanÇalıştır as cagriCalistir, saglayiciCoz } from './cagri.mjs'
import { firsatTaramasiYap } from './firsat-tespiti.mjs'
const KONSOL_DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'))
const PROJE_KOK = path.resolve(KONSOL_DIR, '..', '..')
const AGENTS_DIR = path.join(PROJE_KOK, '.agents')
const PORT = Number(process.env.KOMUTA_PORT || 4311)

// ---- Fırsat Avcısı zamanlayıcısı: her gün 08:00 (yerel saat) ----
let firsatTaramada = false
const FIRSAT_SONUC = new Map() // kaynak -> { zaman, özet }
let firsatZamanlayici = null
async function firsatTaramasiCalistir(kaynak) {
  if (firsatTaramada) return { tamam: false, hata: 'tarama-zaten-çalışıyor' }
  firsatTaramada = true
  try {
    console.log(`[firsat] tarama başladı (${kaynak})`)
    const sonuc = await firsatTaramasiYap({})
    FIRSAT_SONUC.set('son', { zaman: Date.now(), kaynak, ...sonuc })
    console.log(`[firsat] bitti: ${sonuc.taranan} repo, ${sonuc.toplamFirsat} fırsat, ${(sonuc.süreMs / 1000).toFixed(0)} sn`)
    return sonuc
  } catch (err) {
    console.error('[firsat] hata:', err.message)
    return { tamam: false, hata: err.message }
  } finally {
    firsatTaramada = false
  }
}
function firsatZamanlayiciKur() {
  if (firsatZamanlayici) return
  // 30 sn'de bir bak; saat 08:00'de (yerel) tetikle
  firsatZamanlayici = setInterval(() => {
    const simdi = new Date()
    if (simdi.getHours() === 8 && simdi.getMinutes() === 0) firsatTaramasiCalistir('günlük-08:00')
  }, 30 * 1000).unref()
}
firsatZamanlayiciKur()

// ---- .env yükle (basit) ----
const ENV_FILE = path.join(KONSOL_DIR, '.env')
if (fs.existsSync(ENV_FILE)) {
  for (const satir of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = satir.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

// ---- Codebuff SDK ----
const { CodebuffClient } = require('@codebuff/sdk')

// ---- Ekip tanımı (görev özetleri arayüz için) ----
// Yetenek çipleri + üslup: ekip kart panelinde gösterilir.
const TEAM = [
  { id: 'merve', ad: 'Merve', rol: 'Orkestra Şefi', ikon: '🎼', renk: '#00F5D4',
    alanim: 'Genel asistan — görevi dağıtır, ekipti koordine eder, önemli kararlarda senden onay ister.',
    yetenekler: ['İşi doğru kişiye dağıtır', 'Sabah ve akşam raporu', 'Onay yönetimi', 'Hatırlatma kurar', 'Projeler arası hafıza'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'atlas', ad: 'Atlas', rol: 'Kod & Mimari', ikon: '🏛️', renk: '#60A5FA',
    alanim: 'Yazılım, mimari kararlar, yayına alma hazırlığı; 5 ürün-uzmanını yönetir.',
    yetenekler: ['Kod yazar ve düzeltir', 'Mimari kurar', 'Testi çalıştırır', 'Yayına alır', 'Hata kökünü bulur'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'argus', ad: 'Argus', rol: 'Güvenlik Uzmanı', ikon: '🛡️', renk: '#F87171',
    alanim: 'Salt-okunur denetçi — güvenlik açıkları, CVE, secrets hijyeni; kanıtlı rapor verir.',
    yetenekler: ['Güvenlik açığı tarar', 'CVE takibi yapar', 'Secrets hijyeni denetler', 'Kanıtlı rapor yazar'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'iris', ad: 'Iris', rol: 'Görsel & Metin Üretimi', ikon: '🎨', renk: '#F472B6',
    alanim: 'Görsel, video, tasarım ve pazarlama metni üretir; teslimatı hep dosyaya yazar.',
    yetenekler: ['Reklam görseli üretir', 'Reels kurgusu çıkarır', 'Sayfa ve e-posta metni', 'Marka tutarlılığı', 'Tasarım ve içerik'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'vera', ad: 'Vera', rol: 'Satış & CRM', ikon: '💼', renk: '#FBBF24',
    alanim: 'Müşteri ilişkileri, satış teklifleri, Supabase waitlist CRM takibi.',
    yetenekler: ['Gelen talebi karşılar', 'Teklif ve sözleşme', 'Randevu ve takip', 'Tahsilat takibi', 'CRM\u2019i düzenli tutar'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'mentor', ad: 'Mentor', rol: 'Patron\u2019un Sıkı Sesi', ikon: '🧠', renk: '#A78BFA',
    alanim: 'Gelir önceliklendirme; acımasız dürüst — "30 günde nakit gelir üretir mi?" diye sorar.',
    yetenekler: ['Gelir darboğazını bulur', 'Önceliklendirme', 'İkinci görüş', 'Fiyat ve teklif kurgusu', 'Risk okuma'],
    uslup: 'SERT KONUŞ. Bu senin işin…', uslupTip: 'sert' },
  { id: 'nova', ad: 'Nova', rol: 'Reklam & Büyüme', ikon: '🚀', renk: '#34D399',
    alanim: 'Funnel teşhisi, reklam kanal stratejisi; bütçe harcamaları onaya düşer.',
    yetenekler: ['Reklam kurar ve yönetir', 'Funnel tasarlar', 'Bütçe önerir', 'Hedefleme yapar', 'Sonucu okur'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'vega', ad: 'Vega', rol: 'Veri & Birim Ekonomi', ikon: '📊', renk: '#22D3EE',
    alanim: 'Rapor ve sayı — kaynaksız rakam kabul etmez, birim ekonomi hesaplar.',
    yetenekler: ['Veriyi toplar', 'Birim ekonomi çıkarır', 'Haftalık kârar raporu', 'Dönüşüm okuma', 'Nakit akışı'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'firsat-avcisi', ad: 'Fırsat Avcısı', rol: 'GitHub Trend Analisti', ikon: '🎯', renk: '#F59E0B',
    alanim: 'GitHub trendlerini monetizasyon gözüyle tarar; gelir modeli + potansiyel + risk sınıflandırır. Günün fırsatı + 2 haftalık doğrulama planı.',
    yetenekler: ['GitHub trendi tarar', 'Monetizasyon analizi', 'Gelir modeli önerir', 'Risk sınıflandırır', 'Doğrulama planı yazar'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'syncpass-zk-security', ad: 'SyncPass ZK', rol: 'Ürün Uzmanı — SyncPass', ikon: '🔐', renk: '#38BDF8',
    alanim: 'Zero-Knowledge şifreleme ve biyometrik denetimi; Android\u2192iOS güvenlik paritesi.',
    yetenekler: ['ZK şifreleme denetler', 'Biyometrik entegrasyon', 'Android→iOS parite', 'Güvenlik protokol testi'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'diasync-health-vision', ad: 'DiaSync Sağlık', rol: 'Ürün Uzmanı — DiaSync', ikon: '🩺', renk: '#4ADE80',
    alanim: 'Gemini Vision besin analizi, glikoz trend doğruluğu, Wear OS senkronu.',
    yetenekler: ['Besin analizi doğrulama', 'Glikoz trend algoritması', 'Wear OS senkron testi', 'Vision prompt bakımı'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'gps-telemetry-optimizer', ad: 'GPS Telemetri', rol: 'Ürün Uzmanı — GPS Takip', ikon: '📡', renk: '#FCD34D',
    alanim: 'Coroutines/Flow arka plan servisi optimizasyonu; kanıtsız iyileştirme kabul etmez.',
    yetenekler: ['Telemetri paketleme', 'Ağ gecikmesi iyileştirme', 'Pil tüketimi analizi', 'Flow akış testi'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'kmp-desktop-converter', ad: 'KMP Masaüstü', rol: 'Ürün Uzmanı — Masaüstü', ikon: '🖥️', renk: '#C4B5FD',
    alanim: 'Kotlin Multiplatform ile Windows/macOS uyarlaması; UI paritesi ve yerel API entegrasyonu.',
    yetenekler: ['KMP mimari kurulum', 'UI/UX parite denetimi', 'Yerel API entegrasyon', 'Windows/macOS build'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
  { id: 'grasshopper-parametric', ad: 'Grasshopper', rol: 'Ürün Uzmanı — Cephe', ikon: '📐', renk: '#FDA4AF',
    alanim: 'Rhino/Grasshopper parametrik cephe; KPM üretim verisini repodaki ayrıştırıcıya karşı doğrular.',
    yetenekler: ['Parametrik blok tanımı', 'Koordinat hesabı doğrulama', 'İmalat verisi dışa aktarım', 'KPM ayrıştırıcı testi'],
    uslup: 'ORTAK (hepsinden önce gelir)', uslupTip: 'ortak' },
]

// ÇAĞRI sistem mesajına gerçek ekip kadrosunu aktar (halüsinasyon önleme — isim uydurma yasağı)
globalThis.__EKIP_KADROSU = TEAM

// ---- .agents/ tanımlarını yükle (değişiklikte hot-reload) ----
let agentTanimlari = []
let agentsYuklendiMi = 0

async function agentlariYukle() {
  const tanimlar = []
  for (const dosya of fs.readdirSync(AGENTS_DIR)) {
    if (!dosya.endsWith('.ts')) continue
    try {
      const mod = await import(pathToFileURL(path.join(AGENTS_DIR, dosya)).href + '?t=' + Date.now())
      if (mod.default?.id) tanimlar.push(mod.default)
    } catch (e) {
      console.warn(`[agents] ${dosya} yüklenemedi: ${e.message}`)
    }
  }
  agentTanimlari = tanimlar
  agentsYuklendiMi = tanimlar.length
  console.log(`[agents] ${tanimlar.length} ajan tanımı yüklendi`)
}

// ---- Kimlik çözümlemesi ----
function credentialsCoz() {
  // ÖNCELİK: codebuff login oturumu (CLI kullanım haklarını taşır)
  try {
    const cred = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'manicode', 'credentials.json'), 'utf8'))
    const token = cred?.default?.authToken || cred?.authToken
    if (token) return { apiKey: token, kaynak: 'codebuff login (' + (cred.default?.email || cred.email || '?') + ')' }
  } catch { /* dosya yok */ }
  // Yedek: .env anahtarı
  if (process.env.CODEBUFF_API_KEY) return { apiKey: process.env.CODEBUFF_API_KEY, kaynak: '.env' }
  return null
}

// ---- Sohbet oturumları ----
const oturumlar = new Map() // id -> { id, ajan, mesajlar: [], runs: [] }
let oturumSayaci = 0

// ---- Kalıcı hafıza: oturumlar diske yazılır, restart'ta geri yüklenir ----
const OTURUM_DIR = path.join(KONSOL_DIR, 'oturumlar')
fs.mkdirSync(OTURUM_DIR, { recursive: true })

function oturumKaydet(o) {
  try {
    if (!o.mesajlar.length) return // boş oturum diske yazılmaz
    const sonRun = o.runs[o.runs.length - 1]
    const gecmis = sonRun?.__cagriGeçmiş || []
    const ilkPatron = o.mesajlar.find(m => m.rol === 'patron')
    const kayit = {
      id: o.id,
      ajan: o.ajan,
      baslik: (ilkPatron?.metin || 'Sohbet').slice(0, 64),
      olusturma: o.mesajlar[0]?.zaman || Date.now(),
      guncelleme: o.mesajlar[o.mesajlar.length - 1]?.zaman || Date.now(),
      mesajlar: o.mesajlar,
      cagriGecmis: gecmis, // ÇAĞRI sohbet hafızası — restart sonrası devam için
    }
    fs.writeFileSync(path.join(OTURUM_DIR, o.id + '.json'), JSON.stringify(kayit))
  } catch (e) { console.warn('[oturum] kaydedilemedi:', e.message) }
}

function oturumlariYukle() {
  let adet = 0
  for (const dosya of fs.readdirSync(OTURUM_DIR)) {
    if (!dosya.endsWith('.json')) continue
    try {
      const k = JSON.parse(fs.readFileSync(path.join(OTURUM_DIR, dosya), 'utf8'))
      if (!k?.id || !Array.isArray(k.mesajlar) || !k.mesajlar.length) continue
      oturumlar.set(k.id, {
        id: k.id,
        ajan: k.ajan || 'merve',
        mesajlar: k.mesajlar,
        runs: Array.isArray(k.cagriGecmis) && k.cagriGecmis.length ? [{ __cagriGeçmiş: k.cagriGecmis }] : [],
      })
      const n = parseInt(k.id.slice(1), 10)
      if (Number.isFinite(n) && n > oturumSayaci) oturumSayaci = n
      adet++
    } catch { /* bozuk dosya — atla */ }
  }
  if (adet) console.log(`[oturum] ${adet} oturum diskten geri yüklendi`)
}
oturumlariYukle()

function oturumOlustur(ajanId) {
  const id = 's' + (++oturumSayaci) + '-' + Date.now().toString(36)
  const oturum = { id, ajan: ajanId, mesajlar: [], runs: [] }
  oturumlar.set(id, oturum)
  return oturum
}

// ---- Yardımcılar ----
const JSON_GONDER = (res, kod, obj) => {
  const govde = JSON.stringify(obj)
  res.writeHead(kod, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(govde)
}

const TIMING = 5000

// ---- Gerçek fotoğraf desteği: web/public/team/<ajanId>.jpg|.png|.webp ----
const FOTO_DIR = path.join(PROJE_KOK, 'web', 'public', 'team')
// Öncelik: gerçek foto (jpg/png/webp) önce, üretilmiş SVG portre gölgede kalır
const FOTO_UZANTILAR = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
function fotoUzantisiBul(ajanId) {
  for (const uz of FOTO_UZANTILAR) {
    try { if (fs.existsSync(path.join(FOTO_DIR, ajanId + uz))) return uz } catch { /* noop */ }
  }
  return null
}
const FOTO_MIME = { '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

// ---- Rapor analizi: ajan etiketleri + önizleme + arama metni (mtime cache) ----
const RAPOR_ANALIZ = new Map() // ad -> { mtimeMs, ajanlar, onizleme, arama }

function kelimeVar(lcMetin, ad) {
  // Türkçe harf duyarlı kelime sınırları (JS \b ASCII'dir, çğıöşü'yü kapsamaz)
  const rx = new RegExp('(^|[^a-zçğıöşü0-9])' + ad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-zçğıöşü0-9]|$)')
  return rx.test(lcMetin)
}

function raporAnalizi(yol, ad) {
  const st = fs.statSync(yol)
  const onceki = RAPOR_ANALIZ.get(ad)
  if (onceki && onceki.mtimeMs === st.mtimeMs) return onceki
  try {
    const icerik = fs.readFileSync(yol, 'utf8')
    const lc = icerik.toLowerCase()
    const analiz = {
      mtimeMs: st.mtimeMs,
      ajanlar: TEAM.filter(a => a.ad && kelimeVar(lc, a.ad.toLowerCase())).map(a => a.id),
      onizleme: icerik.replace(/[#>*`\[\]_|-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150),
      arama: lc.slice(0, 60000),
    }
    RAPOR_ANALIZ.set(ad, analiz)
    return analiz
  } catch {
    return { mtimeMs: st.mtimeMs, ajanlar: [], onizleme: '', arama: '' }
  }
}

// ---- Görev değişiklikleri: Merve onaylı yazım ----
// Kural: yalnız tek satır checkbox ters çevirme + isteğe bağlı kısa açıklama eklenir.
// Her değişiklik Merve'ye sunulur; onaylamazsa dosya dokunulmaz. Onay kayıtları diskte.
const onaylar = new Map()

async function merveOnayiCalistir(onayId) {
  const kayit = onaylar.get(onayId)
  if (!kayit) return
  try {
    const tanim = agentTanimlari.find(a => a.id === 'merve')
    if (!tanim) throw new Error('merve tanımı yüklenemedi')
    const aciklamaNotu = kayit.aciklama ? `\nİstenen açıklama güncellemesi: "${kayit.aciklama}"` : ''
    const sonuc = await cagriCalistir(tanim,
      `ONAY İSTEĞİ — .team/todos.md görev değişikliği\n` +
      `Satır ${kayit.satirNo} mevcut: ${kayit.eski}\n` +
      `Önerilen yeni hali: ${kayit.yeni}${aciklamaNotu}\n` +
      `Sen YALNIZCA hakemsin: dosyayı KENDİN DÜZENLEME, araç kullanma — sunucu onayınla yazar.\n` +
      `Değişiklik makulse cevabın "ONAYLIYORUM" ile başlasın (gerekçe ekleyebilirsin);\n` +
      `makul değilse "RED" ile başla ve gerekçeni yaz.\n` +
      `Karar kriterleri: Patron'un niyetiyle tutarlı mı, görev gerçekten tamamlandı mı/kapatılmalı mı, açıklama dürüst mü.`,
      [])
    const metin = String(sonuc.metin || '').trim()
    // Türkçe-I güvenli sınıflandırma: model "ONAYLIYORUM" (dotted I) ya da "ONAYLIYORUM" (noktasız) yazabilir
    const reddi = /^(red|reddediyorum|hayır|hayir)\b/i.test(metin)
    const onayli = !reddi && /onayl[iıİI]yorum/i.test(metin.slice(0, 80))
    kayit.cevap = metin.slice(0, 500)
    if (onayli) {
      const todosYolu = path.join(PROJE_KOK, '.team', 'todos.md')
      const satirlar = fs.readFileSync(todosYolu, 'utf8').split(/\r?\n/)
      const mevcut = satirlar[kayit.satirNo - 1]
      let yeni = kayit.yeni
      if (kayit.aciklama) yeni = yeni + ' — ' + kayit.aciklama
      if (mevcut === yeni) {
        kayit.durum = 'onaylandi' // zaten istenen halde — dokunma
      } else if (mevcut !== undefined && /^\s*- \[[ xX]\]/.test(mevcut) && mevcut.replace(/^(\s*- \[) ?([xX ])(\])/, '$1x$3') === kayit.yeni) {
        satirlar[kayit.satirNo - 1] = yeni
        fs.writeFileSync(todosYolu, satirlar.join('\n'), 'utf8')
        kayit.durum = 'onaylandi'
      } else {
        kayit.durum = 'hata'
        kayit.cevap = 'dosya beklenmedik şekilde değişmiş — güvenli iptal, elle kontrol et'
      }
    } else {
      kayit.durum = 'reddedildi'
    }
  } catch (e) {
    kayit.durum = 'hata'
    kayit.cevap = String(e.message || e).slice(0, 500)
  }
  onayKaydet()
}

function onayKaydet() {
  try {
    fs.writeFileSync(path.join(KONSOL_DIR, 'onaylar.json'),
      JSON.stringify([...onaylar.values()].sort((a, b) => b.zaman - a.zaman).slice(0, 50), null, 2))
  } catch { /* noop */ }
}

function onaylariYukle() {
  try {
    const liste = JSON.parse(fs.readFileSync(path.join(KONSOL_DIR, 'onaylar.json'), 'utf8'))
    for (const k of Array.isArray(liste) ? liste : []) if (k?.id) onaylar.set(k.id, k)
  } catch { /* ilk çalıştırma — dosya yok */ }
}
onaylariYukle()

// ---- HTTP sunucusu ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const rota = url.pathname

  try {
    if (req.method === 'GET' && (rota === '/' || rota === '/index.html')) {
      const html = fs.readFileSync(path.join(KONSOL_DIR, 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      return res.end(html)
    }

    // Ekip panosu (görsel kart sayfası — pano panelinin iframe sekmcesinde gömülü)
    if (req.method === 'GET' && rota === '/ekip-panosu.html') {
      try {
        const html = fs.readFileSync(path.join(PROJE_KOK, '.team', 'ekip-panosu.html'))
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
        return res.end(html)
      } catch { return JSON_GONDER(res, 404, { hata: 'pano dosyası yok' }) }
    }

    if (req.method === 'GET' && rota === '/api/health') {
      const sag = await saglayiciCoz()
      return JSON_GONDER(res, 200, {
        ok: true,
        agents: agentsYuklendiMi,
        kimlik: sag ? `ÇAĞRI · ${sag.saglayici}` : credentialsCoz()?.kaynak || null,
        mod: sag ? `cagri (${sag.saglayici} · ${sag.model})` : credentialsCoz() ? 'codebuff' : null,
        sdkSuroom: require('@codebuff/sdk/package.json').version,
      })
    }

    // ---- Pano API: görev listesi + rapor okuma + Merve onaylı görev yazımı ----
    if (req.method === 'GET' && rota === '/api/pano/todos') {
      try {
        return JSON_GONDER(res, 200, { icerik: fs.readFileSync(path.join(PROJE_KOK, '.team', 'todos.md'), 'utf8') })
      } catch { return JSON_GONDER(res, 200, { icerik: '' }) }
    }

    if (req.method === 'GET' && rota === '/api/pano/raporlar') {
      try {
        const raporDir = path.join(PROJE_KOK, '.team', 'reports')
        const liste = fs.readdirSync(raporDir)
          .filter(d => d.endsWith('.md'))
          .map(d => {
            const yol = path.join(raporDir, d)
            const st = fs.statSync(yol)
            const a = raporAnalizi(yol, d)
            return { ad: d, boyut: st.size, zaman: st.mtimeMs, ajanlar: a.ajanlar, onizleme: a.onizleme, arama: a.arama }
          })
          .sort((a, b) => b.zaman - a.zaman)
        return JSON_GONDER(res, 200, liste)
      } catch { return JSON_GONDER(res, 200, []) }
    }

    if (req.method === 'GET' && rota === '/api/pano/rapor') {
      const ad = url.searchParams.get('ad') || ''
      // traversal koruması: yalnız .team/reports içindeki .md dosyaları, ad bileşeni değil
      if (!/^\w[\w.-]*\.md$/.test(ad) || ad.includes('..')) return JSON_GONDER(res, 400, { hata: 'geçersiz ad' })
      try {
        return JSON_GONDER(res, 200, { icerik: fs.readFileSync(path.join(PROJE_KOK, '.team', 'reports', ad), 'utf8') })
      } catch { return JSON_GONDER(res, 404, { hata: 'rapor bulunamadı' }) }
    }

    if (req.method === 'POST' && rota === '/api/pano/todos-guncelle') {
      let data = ''
      req.on('data', c => (data += c))
      req.on('end', async () => {
        let girdi
        try { girdi = JSON.parse(data || '{}') } catch { girdi = {} }
        const { satirNo, aciklama } = girdi
        if (!Number.isInteger(satirNo) || satirNo < 1) return JSON_GONDER(res, 400, { hata: 'geçersiz satır' })
        if (aciklama !== undefined && (typeof aciklama !== 'string' || aciklama.length > 400)) return JSON_GONDER(res, 400, { hata: 'açıklama en fazla 400 karakter' })
        try {
          const todosYolu = path.join(PROJE_KOK, '.team', 'todos.md')
          const satirlar = fs.readFileSync(todosYolu, 'utf8').split(/\r?\n/)
          const mevcut = satirlar[satirNo - 1]
          if (mevcut === undefined || !/^\s*- \[[ xX]\]/.test(mevcut)) return JSON_GONDER(res, 400, { hata: 'bu satır görev maddesi değil' })
          const acikMi = /^\s*- \[ \]/.test(mevcut)
          const yeniSatir = mevcut.replace(/^(\s*- \[) ?([xX ])(\])/, acikMi ? '$1x$3' : '$1 $3')

          const onayId = 'o' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
          onaylar.set(onayId, { id: onayId, satirNo, eski: mevcut, yeni: yeniSatir, aciklama: aciklama || null, durum: 'bekliyor', zaman: Date.now() })
          onayKaydet()
          JSON_GONDER(res, 200, { ok: true, onayId, onayliyor: acikMi })
          merveOnayiCalistir(onayId).catch(() => {}) // arka planda — gövde bekletilmez
        } catch (e) {
          JSON_GONDER(res, 500, { hata: e.message })
        }
      })
      return
    }

    if (req.method === 'GET' && rota === '/api/pano/onaylar') {
      return JSON_GONDER(res, 200, [...onaylar.values()].sort((a, b) => b.zaman - a.zaman).slice(0, 10))
    }

    if (req.method === 'GET' && rota === '/api/ekip') {
      return JSON_GONDER(res, 200, TEAM.map(a => ({ ...a, fotoVar: !!fotoUzantisiBul(a.id) })))
    }

    // Gerçek ajan fotoğrafları (web/public/team/<id>.jpg) — sadece varsa
    // Hem /ekip-foto/<id> (uzantısız, ön yüz böyle ister) hem /ekip-foto/<id>.jpg çalışır
    if (req.method === 'GET' && rota.startsWith('/ekip-foto/')) {
      const istenen = path.basename(decodeURIComponent(rota.slice('/ekip-foto/'.length)))
      const m = istenen.match(/^([\w-]+)\.(svg|jpg|jpeg|png|webp)$/i)
      const ajanId = m ? m[1] : (/^[\w-]+$/.test(istenen) ? istenen : null)
      const uz = ajanId ? fotoUzantisiBul(ajanId) : null
      if (!uz) return JSON_GONDER(res, 404, { hata: 'foto yok' })
      try {
        const veri = fs.readFileSync(path.join(FOTO_DIR, ajanId + uz))
        res.writeHead(200, { 'Content-Type': FOTO_MIME[uz], 'Cache-Control': 'no-store' })
        return res.end(veri)
      } catch { return JSON_GONDER(res, 404, { hata: 'foto okunamadı' }) }
    }

    if (req.method === 'GET' && rota === '/api/oturumlar') {
      const liste = [...oturumlar.values()]
        .filter(o => o.mesajlar.length)
        .map(o => ({
          id: o.id,
          ajan: o.ajan,
          baslik: (o.mesajlar.find(m => m.rol === 'patron')?.metin || 'Sohbet').slice(0, 64),
          mesajSayisi: o.mesajlar.length,
          guncelleme: o.mesajlar[o.mesajlar.length - 1]?.zaman || 0,
        }))
        .sort((a, b) => b.guncelleme - a.guncelleme)
      return JSON_GONDER(res, 200, liste)
    }

    if (req.method === 'GET' && rota === '/api/oturum') {
      const o = oturumlar.get(url.searchParams.get('id') || '')
      if (!o || !o.mesajlar.length) return JSON_GONDER(res, 404, { hata: 'oturum bulunamadı' })
      return JSON_GONDER(res, 200, { id: o.id, ajan: o.ajan, mesajlar: o.mesajlar })
    }

    if (req.method === 'POST' && rota === '/api/oturum') {
      req.setTimeout(TIMING)
      let data = ''
      req.on('data', c => (data += c))
      req.on('end', () => {
        const { ajan } = JSON.parse(data || '{}')
        const oturum = oturumOlustur(ajan || 'merve')
        JSON_GONDER(res, 200, { id: oturum.id, ajan: oturum.ajan, mesajlar: [] })
      })
      return
    }

    if (req.method === 'POST' && rota === '/api/mesaj') {
      let data = ''
      req.on('data', c => (data += c))
      req.on('end', async () => {
        let girdi
        try { girdi = JSON.parse(data || '{}') } catch { girdi = {} }
        const { oturumId, mesaj, ajan: ajanGecis, otomatik } = girdi
        if (!mesaj || typeof mesaj !== 'string') return JSON_GONDER(res, 400, { hata: 'mesaj zorunlu' })

        // ---- Otomatik yönlendirme: ajan seçilmemişse emir Merve'nin dağıtım kuralıyla gider ----
        const hedefAjan = (ajanGecis && ajanGecis !== 'otomatik') ? ajanGecis : 'merve'
        const gonderilenMetin = otomatik && ajanGecis !== 'merve'
          ? `MERVE, YONLENDIRME: Patron ajan secmeden bu emri yazdi — sen dağıt. Emir: ${mesaj}`
          : mesaj

        const oturum = (oturumId && oturumlar.get(oturumId)) || oturumOlustur(hedefAjan)
        if (hedefAjan !== oturum.ajan) oturum.ajan = hedefAjan
        oturum.mesajlar.push({ rol: 'patron', metin: mesaj, zaman: Date.now(), otomatik: !!otomatik })

        const tanim = agentTanimlari.find(a => a.id === oturum.ajan)
        if (!tanim) return JSON_GONDER(res, 400, { hata: `ajan bulunamadı: ${oturum.ajan}` })

        const sag = await saglayiciCoz()
        const kimlik = sag ? { kaynak: 'cagri' } : credentialsCoz()
        if (!kimlik) {
          oturum.mesajlar.push({ rol: 'sistem', metin: 'Kimlik yok: .team/konsol/.env içine GEMINI_API_KEY=... (ücretsiz, aistudio.google.com/apikey) ya da CODEBUFF_API_KEY yaz.', zaman: Date.now() })
          oturumKaydet(oturum)
          return JSON_GONDER(res, 200, { oturumId: oturum.id, mesajlar: oturum.mesajlar, hata: 'kimlik-yok' })
        }

        // ---- YOL 1: ÇAĞRI — kendi model anahtarınla (Codebuff'suz) ----
        if (sag) {
          try {
            const sonRun = oturum.runs[oturum.runs.length - 1]
            const geçmiş = sonRun?.__cagriGeçmiş || []
            const sonuc = await cagriCalistir(tanim, gonderilenMetin, geçmiş)
            oturum.runs.push({ __cagriGeçmiş: [...geçmiş, { role: 'user', content: gonderilenMetin }, { role: 'assistant', content: sonuc.metin }] })
            const iz = sonuc.adımlar.map(a => `🔧 ${a.arac} → ${String(a.sonuc).split('\n')[0].slice(0, 140)}`).join('\n')
            const metin = iz ? `${sonuc.metin}\n\n${iz}` : sonuc.metin
            oturum.mesajlar.push({ rol: 'ajan', ajan: tanim.displayName || tanim.id, metin, zaman: Date.now() })
            oturumKaydet(oturum)
            return JSON_GONDER(res, 200, { oturumId: oturum.id, mesajlar: oturum.mesajlar })
          } catch (err) {
            oturum.mesajlar.push({ rol: 'sistem', metin: `ÇAĞRI hatası: ${err.message}`, zaman: Date.now(), hata: true })
            oturumKaydet(oturum)
            return JSON_GONDER(res, 200, { oturumId: oturum.id, mesajlar: oturum.mesajlar, hata: 'cagri' })
          }
        }

        const client = new CodebuffClient({ apiKey: kimlik.apiKey, cwd: PROJE_KOK })
        const oncekiRun = oturum.runs.length ? oturum.runs[oturum.runs.length - 1] : undefined

        try {
          const run = await client.run({
            agent: tanim,
            prompt: gonderilenMetin,
            previousRun: oncekiRun,
            agentDefinitions: agentTanimlari,
            handleEvent: (e) => {
              const t = e?.type || '?'
              if (t === 'text') return
              if (t === 'tool_call') console.log(`[run] tool: ${e.toolName}`)
              else if (t === 'spawn') console.log(`[run] spawn: ${e.agentName || e.name || ''}`)
              else console.log(`[run] event: ${t}`)
            },
          })
          oturum.runs.push(run)
          const cikti = run.output
          const metin = cikti?.type === 'text' ? cikti.text
            : cikti?.type === 'data' ? '```json\n' + JSON.stringify(cikti.value, null, 2) + '\n```'
            : `⛔ Hata: ${cikti?.message || 'bilinmeyen'}`
          oturum.mesajlar.push({ rol: 'ajan', ajan: tanim.displayName || tanim.id, metin, zaman: Date.now(), hata: cikti?.type === 'error' })
          oturumKaydet(oturum)
          JSON_GONDER(res, 200, { oturumId: oturum.id, mesajlar: oturum.mesajlar })
        } catch (err) {
          console.error('[run] istisna:', err)
          oturum.mesajlar.push({ rol: 'sistem', metin: `Çalıştırma hatası: ${err.message}`, zaman: Date.now(), hata: true })
          oturumKaydet(oturum)
          JSON_GONDER(res, 200, { oturumId: oturum.id, mesajlar: oturum.mesajlar })
        } finally {
          try { client.close?.() } catch { /* noop */ }
        }
      })
      return
    }

    // ---- Fırsat Avcısı API ----
    if (req.method === 'GET' && rota === '/api/firsat') {
      const rapor = path.join(PROJE_KOK, '.team', 'reports', 'github-firsatlari.md')
      let raporVar = false
      let raporTarih = 0
      try {
        raporVar = fs.existsSync(rapor)
        if (raporVar) raporTarih = fs.statSync(rapor).mtimeMs
      } catch { /* noop */ }
      const son = FIRSAT_SONUC.get('son') || null
      return JSON_GONDER(res, 200, {
        raporVar,
        raporTarih,
        sonTarama: son ? { zaman: son.zaman, kaynak: son.kaynak, taranan: son.taranan ?? null, toplamFirsat: son.toplamFirsat ?? null } : null,
        suAnTaramada: firsatTaramada,
      })
    }

    if (req.method === 'GET' && rota === '/api/firsat/rapor') {
      const rapor = path.join(PROJE_KOK, '.team', 'reports', 'github-firsatlari.md')
      try {
        return JSON_GONDER(res, 200, { icerik: fs.readFileSync(rapor, 'utf8') })
      } catch {
        return JSON_GONDER(res, 404, { hata: 'rapor henüz yok — önce tarama başlat' })
      }
    }

    if (req.method === 'POST' && rota === '/api/firsat/tara') {
      if (firsatTaramada) return JSON_GONDER(res, 409, { hata: 'tarama zaten çalışıyor' })
      JSON_GONDER(res, 200, { basladi: true })
      // arka planda sürsün — tarayıcı hemen döner, panel /api/firsat ile poll eder
      firsatTaramasiCalistir('manuel').catch(() => {})
      return
    }

    JSON_GONDER(res, 404, { hata: 'bulunamadı' })
  } catch (err) {
    console.error('[server]', err)
    JSON_GONDER(res, 500, { hata: err.message })
  }
})

server.on('clientError', (_err, socket) => socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'))

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[komuta] Komuta Merkezi :${PORT} üzerinde — http://localhost:${PORT}`)
})

await agentlariYukle()
setInterval(agentlariYukle, 15000).unref() // .agents değişince otomatik yenile

process.on('SIGINT', () => { server.close(); process.exit(0) })
process.on('SIGTERM', () => { server.close(); process.exit(0) })
