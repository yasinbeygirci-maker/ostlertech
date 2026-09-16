/**
 * ÇAĞRI — Sağlayıcı-bağımsız mini ajan runtime'ı
 * ------------------------------------------------------------
 * Codebuff kredi duvarını aşmak için: kendi model anahtarınla
 * çalışan, dosya okuma/yazma + terminal araçları veren küçük ajan motoru.
 *
 * Desteklenen sağlayıcılar (MODEL_PROVIDER ile seçilir, yoksa otomatik):
 *   gemini      → GEMINI_API_KEY       (ücretsiz katman var — ÖNERİLEN)
 *   openai      → OPENAI_API_KEY
 *   anthropic   → ANTHROPIC_API_KEY
 *   openrouter  → OPENROUTER_API_KEY   (ücretsiz modeller mevcut)
 *   groq        → GROQ_API_KEY         (ücretsiz katman var)
 *   ollama      → yerel sunucu, anahtar gerekmez
 *
 * Model seçimi: MODEL_NAME env (örn. "gemini-2.0-flash").
 *  - gemini  varsayılan: gemini-2.0-flash
 *  - openai  varsayılan: gpt-4o-mini
 *  - anthropic varsayılan: claude-sonnet-4-5
 *  - openrouter varsayılan: google/gemini-2.0-flash-exp:free
 *  - groq    varsayılan: llama-3.3-70b-versatile
 *  - ollama  varsayılan: llama3.1
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import os from 'node:os'

const execFileAsync = promisify(execFile)

const PROJE_KOK = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', '..')
const MAKS_ADIM = 24

// Salt-okunur dış beyaz liste: ajanlar bu kökleri OKUYABİLİR (yazma hâlâ yasak).
const DIS_OKUMA_KOKLERI = ['D:\\Development\\AndroidProjects']

function disOkumaIzni(tam) {
  const n = path.normalize(tam).toLowerCase()
  return DIS_OKUMA_KOKLERI.some(k => n.startsWith(path.normalize(k).toLowerCase()))
}
const MAKS_ÇIKTI = 12000

// ---------- Sağlayıcı seçimi ----------
export async function saglayiciCoz(env = process.env) {
  const sır = [
    ['gemini', 'GEMINI_API_KEY', 'gemini-3.5-flash-lite'],
    ['openrouter', 'OPENROUTER_API_KEY', 'google/gemini-2.0-flash-exp:free'],
    ['groq', 'GROQ_API_KEY', 'llama-3.3-70b-versatile'],
    ['openai', 'OPENAI_API_KEY', 'gpt-4o-mini'],
    ['anthropic', 'ANTHROPIC_API_KEY', 'claude-sonnet-4-5'],
    ['ollama', null, 'llama3.1'],
  ]
  const istenen = env.MODEL_PROVIDER?.toLowerCase()
  for (const [ad, envAd, varsayilanModel] of sır) {
    if (istenen && ad !== istenen) continue
    if (envAd && !env[envAd]) continue
    if (ad === 'ollama') {
      // Ollama ancak gerçekten çalışıyorsa seçilir
      try {
        const r = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(1500) })
        if (!r.ok) continue
      } catch { continue }
    }
    return { saglayici: ad, model: env.MODEL_NAME || varsayilanModel }
  }
  return null
}

// ---------- Araç tanımları (OpenAI fonksiyon şeması) ----------
const ARAÇLAR = [
  {
    ad: 'read_file', açıklama: 'Projede bir dosyayı okur. Android projeleri için tam yol da olur (ör. D:\\Development\\AndroidProjects\\SyncPass\\...).',
    şema: { type: 'object', properties: { path: { type: 'string', description: 'Proje köküne göre yol ya da beyaz listede bir tam yol' } }, required: ['path'] },
    çalıştır: async ({ path: p }) => {
      const tam = path.resolve(PROJE_KOK, p)
      const kapsamda = tam.startsWith(PROJE_KOK) || disOkumaIzni(tam)
      if (!kapsamda) throw new Error('proje dışına çıkılamaz (yalnızca beyaz liste okunabilir)')
      const içerik = fs.readFileSync(tam, 'utf8')
      return içerik.length > MAKS_ÇIKTI ? içerik.slice(0, MAKS_ÇIKTI) + '\n... (kesildi)' : içerik
    },
  },
  {
    ad: 'list_files', açıklama: 'Bir klasördeki dosya ve klasörleri listeler. Android projeleri için tam yol da olur.',
    şema: { type: 'object', properties: { path: { type: 'string', description: 'Klasör (varsayılan kök) ya da beyaz listede bir tam yol' } } },
    çalıştır: async ({ path: p = '.' }) => {
      const tam = path.resolve(PROJE_KOK, p)
      const kapsamda = tam.startsWith(PROJE_KOK) || disOkumaIzni(tam)
      if (!kapsamda) throw new Error('proje dışına çıkılamaz (yalnızca beyaz liste okunabilir)')
      return fs.readdirSync(tam, { withFileTypes: true }).map(d => (d.isDirectory() ? '[klasör] ' : '') + d.name).join('\n')
    },
  },
  {
    ad: 'write_file', açıklama: 'Dosya oluşturur veya üzerine yazar (proje içinde).',
    şema: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] },
    çalıştır: async ({ path: p, content }) => {
      const tam = path.resolve(PROJE_KOK, p)
      if (!tam.startsWith(PROJE_KOK)) throw new Error('proje dışına çıkılamaz')
      fs.mkdirSync(path.dirname(tam), { recursive: true })
      fs.writeFileSync(tam, content, 'utf8')
      return `yazıldı: ${p} (${content.length} karakter)`
    },
  },
  {
    ad: 'edit_file', açıklama: 'Dosyada eski metni yenisiyle değiştirir.',
    şema: { type: 'object', properties: { path: { type: 'string' }, old: { type: 'string' }, new: { type: 'string' } }, required: ['path', 'old', 'new'] },
    çalıştır: async ({ path: p, old: eski, new: yeni }) => {
      const tam = path.resolve(PROJE_KOK, p)
      if (!tam.startsWith(PROJE_KOK)) throw new Error('proje dışına çıkılamaz')
      const içerik = fs.readFileSync(tam, 'utf8')
      if (!içerik.includes(eski)) throw new Error('eski metin bulunamadı')
      fs.writeFileSync(tam, içerik.replace(eski, yeni), 'utf8')
      return `düzenlendi: ${p}`
    },
  },
  {
    ad: 'ajan_cagir',
    açıklama: 'Bir ekip ajanını ÇAĞIRIR ve onun kendi araçlarıyla işini yapmasını sağlar. SADECE orkestra şefi (Merve) kullanabilir. Rapor, çağrılan ajanın kendi çıktısıdır — sen onun adına rapor yazamazsın.',
    şema: {
      type: 'object',
      properties: {
        ajan: { type: 'string', description: 'Ajan kimliği: argus, mentor, atlas, vera, vega, nova, iris, firsat-avcisi' },
        emir: { type: 'string', description: 'Ajana verilecek kendine yeterli görev tanımı (hangi dosya, ne çıktısı, nereye yazacağı)' },
      },
      required: ['ajan', 'emir'],
    },
    çalıştır: async ({ ajan: ajanAdı, emir }) => {
      const tanımlar = globalThis.__AJAN_TANIMLARI || []
      const kimlik = String(ajanAdı || '').trim().toLowerCase()
      const tanim = tanımlar.find(a => a.id === kimlik)
      if (!tanim) {
        const geçerli = tanımlar.map(a => a.id).join(', ')
        throw new Error(`bilinmeyen ajan ya da tanımı (.agents/*.ts) yüklü değil: ${ajanAdı}. Geçerli: ${geçerli}`)
      }
      if (kimlik === 'merve') throw new Error('merve kendini çağıramaz')
      // Derinlik koruması: yalnız şef (derinlik 0) çağırabilir — uzman uzman çağıramaz
      if (AGAN_DERINLIK > 0) throw new Error('ajan_cagir yalnızca orkestra şefi tarafından kullanılabilir (uzmanlar alt ajan çağıramaz)')
      if (String(emir || '').length < 10) throw new Error('emir çok kısa — ajana kendine yeterli görev tanımı ver')
      const kadro = globalThis.__EKIP_KADROSU || []
      const görünenAd = kadro.find(a => a.id === kimlik)?.ad || tanim.displayName || kimlik
      AGAN_DERINLIK = 1
      try {
        const alt = await ajanÇalıştır(tanim, String(emir), [])
        return `--- ${görünenAd} (${kimlik}) kendi çıktısı ---\n${alt.metin}\n--- araç izleri: ${alt.adımlar.map(a => a.arac).join(', ') || 'yok'} ---`
      } finally {
        AGAN_DERINLIK = 0
      }
    },
  },
  {
    ad: 'run_command', açıklama: 'Proje kökünde terminal komutu çalıştırır (30 sn sınır).',
    şema: { type: 'object', properties: { command: { type: 'string' } }, required: ['command'] },
    çalıştır: async ({ command }) => {
      try {
        const { stdout, stderr } = await execFileAsync('cmd.exe', ['/c', command], { cwd: PROJE_KOK, timeout: 30000, maxBuffer: 4e6 })
        const çıktı = ((stdout || '') + (stderr ? '\n[hata]\n' + stderr : '')).trim()
        return çıktı.length > MAKS_ÇIKTI ? çıktı.slice(0, MAKS_ÇIKTI) + '... (kesildi)' : (çıktı || '(boş çıktı)')
      } catch (e) {
        return `komut hatası (kod ${e.code ?? '?'}): ${(e.stdout || '') + (e.stderr || e.message)}`
      }
    },
  },
]

const ARAÇ_ŞEMALARI = ARAÇLAR.map(a => ({
  type: 'function',
  function: { name: a.ad, description: a.açıklama, parameters: a.şema },
}))

// Alt-ajan zinciri koruması: ajan_cagir çalışırken derinlik 1'e çıkar; o süre
// boyunca uzmanlara ajan_cagir GÖSTERİLMEZ — uzman uzman çağıramaz,
// sonsuz çağrı döngüsü imkânsızlaşır. (Şef = derinlik 0.)
let AGAN_DERINLIK = 0
const görünürAraçlar = () => (AGAN_DERINLIK > 0 ? ARAÇLAR.filter(a => a.ad !== 'ajan_cagir') : ARAÇLAR)
const görünürŞemalar = () => (AGAN_DERINLIK > 0 ? ARAÇ_ŞEMALARI.filter(s => s.function.name !== 'ajan_cagir') : ARAÇ_ŞEMALARI)

// ---------- Mesaj dönüştürücüler ----------
function sistemMesajı(tanim) {
  // Gerçek zaman + gerçek kadro: model tarih/isim UYDURAMASIN — sistem eline
  // gerçekleri verir (halüsinasyon önleme, 2026-09-16 gün sonu raporu dersi)
  const simdi = new Date()
  const tarihTR = simdi.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const saatTR = simdi.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  const kadro = (globalThis.__EKIP_KADROSU || []).map(a => a.ad).filter(Boolean).join(', ')
  // Orkestra şefi mi? (ajan_cagir aracı + delege kuralı yalnız ona verilir)
  const sef = tanim.id === 'merve'
  return [
    tanim.instructionsPrompt || '',
    sef
      ? 'KURAL 12 — RAPOR SAHİBİ, YAZAN KİŞİ AYNI OLMALI: Ekip ajanlarının (Argus, Mentor, Atlas, Vera, Vega, Nova, Iris, Fırsat Avcısı) adına rapor YAZMAK yasaktır — kendi bilginle onların işini özetleyemezsin. Bir ajanın işi gerekiyorsa ajan_cagir aracıyla O ajanı ÇAĞIR; raporu ajanın kendi çıktısı olur. Çağıramadığın durumda raporda "doğrulanmadı — ajan çağrılamadı" damgası kullan.'
      : '',
    tanim.displayName ? `Senin adın: ${tanim.displayName}.` : '',
    `BUGÜN GERÇEK TARİH: ${tarihTR}, saat ${saatTR} (Türkiye). Raporlarında tarih gerekirse BUNU kullan; asla başka tarih yazma.`,
    kadro ? `GERÇEK EKİP KADROSU (yalnız bu isimleri kullan, başka isim uydurma): ${kadro}. Patron, raporlarda sen (= ${tanim.displayName || 'ajan'}) de sayılır.` : '',
    'Tüm yanıtların Türkçe olacak (teknik terimler hariç).',
    'Dosya/terminal işlerinde verilen araçları kullan; araç çağrısı gerektiğinde kısa bir düşüns metni yaz.',
    'Önemli kararlarda (silme, dağıtım, ödeme, güvenlik) araç kullanmadan dur ve onay sor.',
    `Proje kökü: ${PROJE_KOK}`,
  ].filter(Boolean).join('\n\n')
}

// ---------- Sağlayıcı çağrıları ----------

// Geçici hatalarda (429, 5xx, ağ kopması) artan beklemeli yeniden deneme.
// Kalıcı hatalar (401/403/404 vb.) anında fırlatılır.
const YENIDEN_DENE_BEKLEME_MS = [1500, 3000, 6000]

async function sağlayıcıÇağır(sağ, model, mesajlar) {
  let sonHata
  for (let deneme = 0; deneme <= YENIDEN_DENE_BEKLEME_MS.length; deneme++) {
    try {
      return await sağlayıcıÇağırTek(sağ, model, mesajlar, deneme)
    } catch (err) {
      sonHata = err
      const metin = String(err?.message || err)
      const durum = Number((metin.match(/hatası (\d{3})/) || [])[1] || 0)
      const geçici = durum === 429 || (durum >= 500 && durum < 600) || /fetch failed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|socket hang up|boş yanıt/i.test(metin)
      if (!geçici || deneme === YENIDEN_DENE_BEKLEME_MS.length) throw sonHata
      if (durum === 429) throw sonHata // kota — zincir üst katmanı sıradaki modele atlar
      const bekle = YENIDEN_DENE_BEKLEME_MS[deneme]
      console.log(`[cagri] ${sağ} geçici hata (deneme ${deneme + 1}/${YENIDEN_DENE_BEKLEME_MS.length + 1}), ${bekle}ms sonra yeniden: ${metin.slice(0, 120)}`)
      await new Promise(r => setTimeout(r, bekle))
    }
  }
  throw sonHata
}

async function sağlayıcıÇağırTek(sağ, model, mesajlar, deneme = 0) {
  // Tüm sağlayıcılar için OpenAI-uyumlu sohbet formatı kullanılır;
  // Gemini kendi REST'iyle konuşulur ve forma dönüştürülür.
  if (sağ === 'gemini') return geminiÇağır(model, mesajlar, deneme)
  if (sağ === 'anthropic') return anthropicÇağır(model, mesajlar)

  const uçNokta = {
    openai: 'https://api.openai.com/v1/chat/completions',
    openrouter: 'https://openrouter.ai/api/v1/chat/completions',
    groq: 'https://api.groq.com/openai/v1/chat/completions',
    ollama: 'http://localhost:11434/v1/chat/completions',
  }[sağ]

  const başlıklar = { 'Content-Type': 'application/json' }
  if (sağ === 'openai') başlıklar.Authorization = `Bearer ${process.env.OPENAI_API_KEY}`
  if (sağ === 'openrouter') başlıklar.Authorization = `Bearer ${process.env.OPENROUTER_API_KEY}`
  if (sağ === 'groq') başlıklar.Authorization = `Bearer ${process.env.GROQ_API_KEY}`

  const cevap = await fetch(uçNokta, {
    method: 'POST',
    headers: başlıklar,
    body: JSON.stringify({ model, messages: mesajlar, tools: görünürŞemalar() }),
  })
  if (!cevap.ok) throw new Error(`${sağ} hatası ${cevap.status}: ${(await cevap.text()).slice(0, 300)}`)
  const veri = await cevap.json()
  return veri.choices[0].message
}

async function geminiÇağır(model, mesajlar, deneme = 0) {
  const sistem = mesajlar.find(m => m.role === 'system')?.content || ''
  // tool_call_id → fonksiyon adı haritası: Gemini functionResponse parçası
  // fonksiyonun ADINI ister, id'yi değil.
  const çağrıAdları = new Map()
  for (const m of mesajlar) {
    if (m.role === 'assistant' && m.tool_calls?.length) {
      for (const t of m.tool_calls) çağrıAdları.set(t.id, t.function?.name || 'bilinmeyen_araç')
    }
  }
  // Protokol: modelin functionCall'unun hemen ardından GELEN turda
  // functionResponse parçaları döner (ardışık tool mesajları tek user turunda birleşir).
  const içerikler = []
  const bekleyenSonuçlar = []
  const boşalt = () => { if (bekleyenSonuçlar.length) içerikler.push({ role: 'user', parts: bekleyenSonuçlar.splice(0) }) }
  for (const m of mesajlar) {
    if (m.role === 'system') continue
    if (m.role === 'tool') {
      bekleyenSonuçlar.push({
        functionResponse: {
          name: çağrıAdları.get(m.tool_call_id) || 'bilinmeyen_araç',
          response: { sonuc: String(m.content ?? '') },
        },
      })
      continue
    }
    boşalt()
    if (m.role === 'assistant' && m.tool_calls?.length) {
      içerikler.push({
        role: 'model',
        parts: [
          ...(m.content
            ? [{ text: m.content, ...(m.thoughtSignature ? { thoughtSignature: m.thoughtSignature } : {}) }]
            : []),
          ...m.tool_calls.map(t => {
            let args = {}
            try { args = JSON.parse(t.function.arguments || '{}') } catch { args = {} }
            return {
              functionCall: { name: t.function.name, args },
              // Gemini 3.x zorunluluğu: modelin ürettiği thoughtSignature
              // sonraki istekte AYNEN geri gönderilmeli, yoksa 400.
              ...(t.thoughtSignature ? { thoughtSignature: t.thoughtSignature } : {}),
            }
          }),
        ],
      })
      continue
    }
    içerikler.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '', ...(m.role === 'assistant' && m.thoughtSignature ? { thoughtSignature: m.thoughtSignature } : {}) }],
    })
  }
  boşalt()

  // Gemini katı kuralı: istek user turuyla BİTMEELİ. Mesaj dizisi bozulursa
  // (model turu sona kalır) 400 döner — kalkan olarak bozuk kuyruğu burada
  // onarıp logluyoruz; kök neden teşhisi için iz bırakılır.
  if (içerikler.length && içerikler[içerikler.length - 1].role === 'model') {
    console.log('[cagri] KALKAN: gemini istegi model turn ile bitiyordu — user nudge eklendi')
    içerikler.push({ role: 'user', parts: [{ text: '(Devam et.)' }] })
  }
  const gövde = {
    contents: içerikler,
    tools: [{
      functionDeclarations: görünürAraçlar().map(a => ({
        name: a.ad, description: a.açıklama, parameters: a.şema,
      })),
    }],
    ...(sistem ? { systemInstruction: { parts: [{ text: sistem }] } } : {}),
    // Bozuk tool-call'a karşı: yeniden denemelerde sıcaklığı oynat —
    // aynı istek aynı örneklemeyi üretmesin (deterministik tuzak kırılır).
    ...(deneme > 0 ? { generationConfig: { temperature: Math.min(1 + 0.35 * deneme, 2) } } : {}),
  }

  const cevap = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gövde) },
  )
  if (!cevap.ok) throw new Error(`gemini hatası ${cevap.status}: ${(await cevap.text()).slice(0, 300)}`)
  const veri = await cevap.json()
  const aday = veri.candidates?.[0]?.content?.parts || []
  const metin = aday.filter(p => p.text).map(p => p.text).join('')
  const metinImza = aday.find(p => p.text && p.thoughtSignature)?.thoughtSignature
  const çağrılar = aday.filter(p => p.functionCall).map(p => ({
    id: 'g' + Math.random().toString(36).slice(2, 8),
    type: 'function',
    function: { name: p.functionCall.name, arguments: JSON.stringify(p.functionCall.args || {}) },
    ...(p.thoughtSignature ? { thoughtSignature: p.thoughtSignature } : {}),
  }))
  if (!metin && !çağrılar.length) {
    const sebep = veri.candidates?.[0]?.finishReason || veri.promptFeedback?.blockReason || 'bilinmiyor'
    throw new Error(`gemini boş yanıt (finishReason=${sebep}): ${JSON.stringify(veri).slice(0, 220)}`)
  }
  return {
    role: 'assistant',
    content: metin || null,
    ...(metinImza ? { thoughtSignature: metinImza } : {}),
    ...(çağrılar.length ? { tool_calls: çağrılar } : {}),
  }
}

async function anthropicÇağır(model, mesajlar) {
  const sistem = mesajlar.find(m => m.role === 'system')?.content || ''
  const araçlar = görünürAraçlar().map(a => ({ name: a.ad, description: a.açıklama, input_schema: a.şema }))
  const mesajGövdesi = mesajlar.filter(m => m.role !== 'system').map(m => {
    if (m.role === 'tool') {
      return { role: 'user', content: [{ type: 'tool_result', tool_use_id: m.tool_call_id, content: m.content }] }
    }
    if (m.role === 'assistant' && m.tool_calls?.length) {
      return {
        role: 'assistant',
        content: [
          ...(m.content ? [{ type: 'text', text: m.content }] : []),
          ...m.tool_calls.map(t => ({ type: 'tool_use', id: t.id, name: t.function.name, input: JSON.parse(t.function.arguments || '{}') })),
        ],
      }
    }
    return { role: m.role, content: m.content || '' }
  })

  const cevap = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: 4096, system: sistem, tools: araçlar, messages: mesajGövdesi }),
  })
  if (!cevap.ok) throw new Error(`anthropic hatası ${cevap.status}: ${(await cevap.text()).slice(0, 300)}`)
  const veri = await cevap.json()
  const metin = (veri.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
  const çağrılar = (veri.content || []).filter(b => b.type === 'tool_use').map(b => ({
    id: b.id, type: 'function', function: { name: b.name, arguments: JSON.stringify(b.input) },
  }))
  return { role: 'assistant', content: metin || null, ...(çağrılar.length ? { tool_calls: çağrılar } : {}) }
}

// Gemini ücretsiz model zinciri — kota dolunca sıradakine atlanır.
const GEMINI_MODEL_ZİNCİRİ = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
  'gemini-3.5-flash',
]

// En son başarılı model hatırlanır — bir kez kota dolan modele tekrar gidilmez.
let aktifGeminiModeli = null

async function sağlayıcıÇağırZincir(sağ, model, mesajlar) {
  if (sağ !== 'gemini') return sağlayıcıÇağır(sağ, model, mesajlar)
  const adaylar = [...new Set([
    ...(aktifGeminiModeli ? [aktifGeminiModeli] : []),
    model,
    ...GEMINI_MODEL_ZİNCİRİ,
  ])]
  const hatalar = []
  for (const m of adaylar) {
    try {
      const sonuc = await sağlayıcıÇağır(sağ, m, mesajlar)
      aktifGeminiModeli = m
      return sonuc
    } catch (err) {
      const metin = String(err?.message || err)
      if (/hatası 429/.test(metin)) { hatalar.push(`${m}: kota`); continue } // kota dolu → sıradaki model
      if (/MALFORMED_FUNCTION_CALL|boş yanıt/i.test(metin)) {
        // Model bu konuşmada bozuk tool-call üretmekte ısrar etti (4 deneme)
        // → sıradaki model farklı bir üretim yolu izler.
        console.log(`[cagri] ${m} bozuk tool-call ısrarı — zincirde sıradakine geçiliyor`)
        hatalar.push(`${m}: bozuk tool-call`)
        continue
      }
      throw err // başka hata — gerçek sorun
    }
  }
  throw new Error(`gemini: zincirdeki tüm modeller başarısız (${hatalar.join(' · ')}) — kota yenilenmesini bekleyin ya da ücretli katmana geçin`)
}

// ---------- Ana döngü ----------
/**
 * Ajanı çalıştırır. Dönüş: { metin, adımlar: [{arac, giris, sonuc}] }
 */
// ---------- Acil durum: oturum bazlı araç kilidi ----------
// MALFORMED_FUNCTION_CALL/bozuk tool-call ısrarında oturum düz metin moduna düşer:
// model araç şemaları olmadan, yalnızca konuşma geçmişiyle çağrılır.
const ARAÇ_KİLİTLİ = new Map() // oturumKimligi -> zaman damgası
const KİLİT_SÜRESİ = 10 * 60_000 // 10 dk sonra araçlar sessizce geri döner

export function araçKilidiKoy(oturumKimligi) {
  ARAÇ_KİLİTLİ.set(String(oturumKimligi), Date.now())
}

export function araçKilidiAktif(oturumKimligi) {
  const t = ARAÇ_KİLİTLİ.get(String(oturumKimligi))
  if (!t) return false
  if (Date.now() - t > KİLİT_SÜRESİ) {
    ARAÇ_KİLİTLİ.delete(String(oturumKimligi))
    return false
  }
  return true
}

export async function ajanÇalıştır(tanim, patronMesajı, geçmiş = [], seçenekler = {}) {
  const { oturumKimligi = null, acilDurumMetni = null } = seçenekler
  const seçim = await saglayiciCoz()
  if (!seçim) {
    throw Object.assign(new Error(
      'Model anahtarı yok. .team/konsol/.env içine ücretsiz GEMINI_API_KEY ekleyin (aistudio.google.com/apikey) — ya da OPENAI/OPENROUTER/GROQ/ANTHROPIC anahtarı.'
    ), { kod: 'anahtar-yok' })
  }
  const { saglayici: sağ, model } = seçim

  // ACİL DURUM MODU: bu oturumda araç kilidi aktifse araç şemaları hiç
  // gönderilmez — model salt metinle cevap verir (tek tur, döngüsüz).
  if (oturumKimligi && araçKilidiAktif(oturumKimligi)) {
    const sistem = sistemMesajı(tanim)
    const kilitliSistem = `${sistem}\n\nACİL DURUM MODU: Araçların şu anda devre dışı. Cevabını YALNIZCA mevcut konuşma bağlamına ve bilgine dayanarak ver; dosya okuyamaz, komut çalıştıramazsın. Eksik bilgi gerekiyorsa Patron'dan isteyeceğini açıkça yaz.`
    const asistan = await sağlayıcıÇağır(sağ, model, [
      { role: 'system', content: kilitliSistem },
      ...geçmiş,
      { role: 'user', content: acilDurumMetni || patronMesajı },
    ])
    return { metin: asistan.content || '(boş yanıt)', adımlar: [], acilDurum: true }
  }

  const mesajlar = [
    { role: 'system', content: sistemMesajı(tanim) },
    ...geçmiş,
    { role: 'user', content: patronMesajı },
  ]

  const adımlar = []
  for (let adım = 0; adım < MAKS_ADIM; adım++) {
    let asistan
    try {
      asistan = await sağlayıcıÇağırZincir(sağ, model, mesajlar)
    } catch (err) {
      const metin = String(err?.message || err)
      // Bozuk tool-call ısrarı zinciri tükettiyse: oturumu kilitli moduna al
      // ve aynı turu ARAÇSIZ tek çağrıyla kurtar — hata patrona sızmaz.
      if (oturumKimligi && /MALFORMED_FUNCTION_CALL|bozuk tool-call|boş yanıt/i.test(metin)) {
        araçKilidiKoy(oturumKimligi)
        const kilitliSistem = `${sistemMesajı(tanim)}\n\nACİL DURUM MODU: Araçların şu anda devre dışı. Cevabını YALNIZCA mevcut konuşma bağlamına ve bilgine dayanarak ver; dosya okuyamaz, komut çalıştıramazsın. Eksik bilgi gerekiyorsa Patron'dan isteyeceğini açıkça yaz.`
        const kurtar = await sağlayıcıÇağır(sağ, model, [
          { role: 'system', content: kilitliSistem },
          ...geçmiş,
          { role: 'user', content: `${acilDurumMetni || patronMesajı}\n\n(Not: Araç erişimin geçici olarak kapalı — cevabını bu bilgiyle ver.)` },
        ])
        return { metin: kurtar.content || '(boş yanıt)', adımlar: [], acilDurum: true }
      }
      throw err
    }
    mesajlar.push(asistan)

    if (!asistan.tool_calls?.length) {
      return { metin: asistan.content || '(boş yanıt)', adımlar }
    }

    for (const çağrı of asistan.tool_calls) {
      const araç = ARAÇLAR.find(a => a.ad === çağrı.function.name)
      let sonuç
      try {
        sonuç = araç
          ? await araç.çalıştır(JSON.parse(çağrı.function.arguments || '{}'))
          : `bilinmeyen araç: ${çağrı.function.name}`
      } catch (e) {
        sonuç = `araç hatası: ${e.message}`
      }
      adımlar.push({ arac: çağrı.function.name, giris: çağrı.function.arguments, sonuc: String(sonuç).slice(0, 4000) })
      mesajlar.push({ role: 'tool', tool_call_id: çağrı.id, content: String(sonuç) })
    }
  }
  return { metin: '(adım sınırına ulaşıldı — kısmi sonuç)', adımlar }
}

// ---------- Açılış protokol testi ----------
/**
 * Sahte tool-call turu simüle eder: model çağrılır, functionCall üretmesi
 * beklenir, sonuç functionResponse ile geri gidip nihai metin alınır.
 * Hem functionResponse protokolünü hem thoughtSignature akışını uçtan uca
 * doğrular — MALFORMED_FUNCTION_CALL/400 tuzağı açılışta yakalanır.
 * Dönüş: { tamam, sure_ms, detay } — başarısızsa hata mesajı detay'da.
 */
export async function protokolTesti() {
  const seçim = await saglayiciCoz()
  if (!seçim) return { tamam: false, detay: 'model anahtarı yok' }
  if (seçim.saglayici !== 'gemini') {
    return { tamam: true, detay: `atlandı (${seçim.saglayici} — test yalnız gemini protokolü için)` }
  }
  const baş = Date.now()
  try {
    const mesajlar = [
      { role: 'system', content: 'Protokol testi. Tek işin: test_araci aracını çağırmak.' },
      { role: 'user', content: 'test_araci aracını argümansız çağır ve sonucu bekle.' },
    ]
    const asistan = await sağlayıcıÇağırZincir(seçim.saglayici, seçim.model, mesajlar)
    if (!asistan.tool_calls?.length) {
      return { tamam: false, sure_ms: Date.now() - baş, detay: 'model araç çağrısı üretmedi (metinle cevapladı)' }
    }
    const çağrı = asistan.tool_calls[0]
    // Gerçek döngünün birebir aynısı: assistant + tool mesajı işlenir, dönüşümcü
    // functionResponse'u kurar, imza akışı da sınanır. ÇOK TURLU: model 2-3 tur
    // daha araç çağırsa bile sahte sonuçla beslenip nihai metne ulaşmalı —
    // tek turluk varsayım testi kırıyordu (2026-09-16 "(boş)" arızası).
    mesajlar.push(asistan)
    let final = null
    for (let tur = 0; tur < 3; tur++) {
      final = await sağlayıcıÇağırZincir(seçim.saglayici, seçim.model, mesajlar)
      if (!final.tool_calls?.length) break
      // GÜVENLİK: test gerçek araç ÇALIŞTIRMAZ — her çağrıya sahte sonuç:
      mesajlar.push(final)
      for (const c of final.tool_calls) {
        mesajlar.push({ role: 'tool', tool_call_id: c.id, content: 'TEST_OK: 2+2=4' })
      }
    }
    if (!final || !final.content || !/2\s*\+?\s*2|4|dört/i.test(final.content)) {
      const çıkarım = final?.tool_calls?.length
        ? `model ${final.tool_calls.length} araç çağrısında takıldı (${final.tool_calls.map(c => c.function.name).join(', ')})`
        : `nihai içerik: ${String(final?.content || '(boş)').slice(0, 80)}`
      return { tamam: false, sure_ms: Date.now() - baş, detay: `araç sonucu işlenemedi: ${çıkarım}` }
    }
    return { tamam: true, sure_ms: Date.now() - baş, detay: `functionCall + functionResponse + imza akışı ✓ (${çağrı.function.name})` }
  } catch (err) {
    return { tamam: false, sure_ms: Date.now() - baş, detay: String(err?.message || err).slice(0, 160) }
  }
}
