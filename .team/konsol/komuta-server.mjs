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
const TEAM = [
  { id: 'merve', ad: 'Merve', rol: 'Orkestra Şefi', ikon: '🎼', renk: '#00F5D4', alanim: 'Genel asistan — görevi dağıtır, ekipti koordine eder, önemli kararlarda senden onay ister.', sifreli: false },
  { id: 'atlas', ad: 'Atlas', rol: 'Kod & Mimari', ikon: '🏛️', renk: '#60A5FA', alanim: 'Yazılım, mimari kararlar, yayına alma hazırlığı; 5 ürün-uzmanını yönetir.', sifreli: false },
  { id: 'argus', ad: 'Argus', rol: 'Güvenlik Uzmanı', ikon: '🛡️', renk: '#F87171', alanim: 'Salt-okunur denetçi — güvenlik açıkları, CVE, secrets hijyeni; kanıtlı rapor verir.', sifreli: true },
  { id: 'iris', ad: 'Iris', rol: 'Görsel & Metin Üretimi', ikon: '🎨', renk: '#F472B6', alanim: 'Görsel, video, tasarım ve pazarlama metni üretir; teslimatı hep dosyaya yazar.', sifreli: true },
  { id: 'vera', ad: 'Vera', rol: 'Satış & CRM', ikon: '💼', renk: '#FBBF24', alanim: 'Müşteri ilişkileri, satış teklifleri, Supabase waitlist CRM takibi.', sifreli: true },
  { id: 'mentor', ad: 'Mentor', rol: 'Patron\u2019un Sıkı Sesi', ikon: '🧠', renk: '#A78BFA', alanim: 'Gelir önceliklendirme; acımasız dürüst — "30 günde nakit gelir üretir mi?" diye sorar.', sifreli: true },
  { id: 'nova', ad: 'Nova', rol: 'Reklam & Büyüme', ikon: '🚀', renk: '#34D399', alanim: 'Funnel teşhisi, reklam kanal stratejisi; bütçe harcamaları onaya düşer.', sifreli: true },
  { id: 'vega', ad: 'Vega', rol: 'Veri & Birim Ekonomi', ikon: '📊', renk: '#22D3EE', alanim: 'Rapor ve sayı — kaynaksız rakam kabul etmez, birim ekonomi hesaplar.', sifreli: true },
  { id: 'firsat-avcisi', ad: 'Fırsat Avcısı', rol: 'GitHub Trend Analisti', ikon: '🎯', renk: '#F59E0B', alanim: 'GitHub trendlerini monetizasyon gözüyle tarar; gelir modeli + potansiyel + risk sınıflandırır. Günün fırsatı + 2 haftalık doğrulama planı.', sifreli: false },
  { id: 'syncpass-zk-security', ad: 'SyncPass ZK', rol: 'Ürün Uzmanı — SyncPass', ikon: '🔐', renk: '#38BDF8', alanim: 'Zero-Knowledge şifreleme ve biyometrik denetimi; Android\u2192iOS güvenlik paritesi.', sifreli: false },
  { id: 'diasync-health-vision', ad: 'DiaSync Sağlık', rol: 'Ürün Uzmanı — DiaSync', ikon: '🩺', renk: '#4ADE80', alanim: 'Gemini Vision besin analizi, glikoz trend doğruluğu, Wear OS senkronu.', sifreli: false },
  { id: 'gps-telemetry-optimizer', ad: 'GPS Telemetri', rol: 'Ürün Uzmanı — GPS Takip', ikon: '📡', renk: '#FCD34D', alanim: 'Coroutines/Flow arka plan servisi optimizasyonu; kanıtsız iyileştirme kabul etmez.', sifreli: false },
  { id: 'kmp-desktop-converter', ad: 'KMP Masaüstü', rol: 'Ürün Uzmanı — Masaüstü', ikon: '🖥️', renk: '#C4B5FD', alanim: 'Kotlin Multiplatform ile Windows/macOS uyarlaması; UI paritesi ve yerel API entegrasyonu.', sifreli: false },
  { id: 'grasshopper-parametric', ad: 'Grasshopper', rol: 'Ürün Uzmanı — Cephe', ikon: '📐', renk: '#FDA4AF', alanim: 'Rhino/Grasshopper parametrik cephe; KPM üretim verisini repodaki ayrıştırıcıya karşı doğrular.', sifreli: false },
]

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

    if (req.method === 'GET' && rota === '/api/ekip') {
      return JSON_GONDER(res, 200, TEAM)
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
        const { oturumId, mesaj, ajan: ajanGecis } = girdi
        if (!mesaj || typeof mesaj !== 'string') return JSON_GONDER(res, 400, { hata: 'mesaj zorunlu' })

        const oturum = (oturumId && oturumlar.get(oturumId)) || oturumOlustur(ajanGecis || 'merve')
        if (ajanGecis && ajanGecis !== oturum.ajan) oturum.ajan = ajanGecis
        oturum.mesajlar.push({ rol: 'patron', metin: mesaj, zaman: Date.now() })

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
            const sonuc = await cagriCalistir(tanim, mesaj, geçmiş)
            oturum.runs.push({ __cagriGeçmiş: [...geçmiş, { role: 'user', content: mesaj }, { role: 'assistant', content: sonuc.metin }] })
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
            prompt: mesaj,
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
