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

// ---------- Mesaj dönüştürücüler ----------
function sistemMesajı(tanim) {
  return [
    tanim.instructionsPrompt || '',
    tanim.displayName ? `Senin adın: ${tanim.displayName}.` : '',
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
      return await sağlayıcıÇağırTek(sağ, model, mesajlar)
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

async function sağlayıcıÇağırTek(sağ, model, mesajlar) {
  // Tüm sağlayıcılar için OpenAI-uyumlu sohbet formatı kullanılır;
  // Gemini kendi REST'iyle konuşulur ve forma dönüştürülür.
  if (sağ === 'gemini') return geminiÇağır(model, mesajlar)
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
    body: JSON.stringify({ model, messages: mesajlar, tools: ARAÇ_ŞEMALARI }),
  })
  if (!cevap.ok) throw new Error(`${sağ} hatası ${cevap.status}: ${(await cevap.text()).slice(0, 300)}`)
  const veri = await cevap.json()
  return veri.choices[0].message
}

async function geminiÇağır(model, mesajlar) {
  const sistem = mesajlar.find(m => m.role === 'system')?.content || ''
  const içerikler = mesajlar.filter(m => m.role !== 'system').map(m => {
    if (m.role === 'tool') {
      return { role: 'user', parts: [{ text: `[araç sonucu ${m.tool_call_id}] ${m.content}` }] }
    }
    if (m.role === 'assistant' && m.tool_calls?.length) {
      return {
        role: 'model',
        parts: [
          ...(m.content ? [{ text: m.content }] : []),
          ...m.tool_calls.map(t => ({
            functionCall: { name: t.function.name, args: JSON.parse(t.function.arguments || '{}') },
          })),
        ],
      }
    }
    return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content || '' }] }
  })

  const gövde = {
    contents: içerikler,
    tools: [{
      functionDeclarations: ARAÇLAR.map(a => ({
        name: a.ad, description: a.açıklama, parameters: a.şema,
      })),
    }],
    ...(sistem ? { systemInstruction: { parts: [{ text: sistem }] } } : {}),
  }

  const cevap = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gövde) },
  )
  if (!cevap.ok) throw new Error(`gemini hatası ${cevap.status}: ${(await cevap.text()).slice(0, 300)}`)
  const veri = await cevap.json()
  const aday = veri.candidates?.[0]?.content?.parts || []
  const metin = aday.filter(p => p.text).map(p => p.text).join('')
  const çağrılar = aday.filter(p => p.functionCall).map(p => ({
    id: 'g' + Math.random().toString(36).slice(2, 8),
    type: 'function',
    function: { name: p.functionCall.name, arguments: JSON.stringify(p.functionCall.args || {}) },
  }))
  if (!metin && !çağrılar.length) {
    const sebep = veri.candidates?.[0]?.finishReason || veri.promptFeedback?.blockReason || 'bilinmiyor'
    throw new Error(`gemini boş yanıt (finishReason=${sebep}): ${JSON.stringify(veri).slice(0, 220)}`)
  }
  return { role: 'assistant', content: metin || null, ...(çağrılar.length ? { tool_calls: çağrılar } : {}) }
}

async function anthropicÇağır(model, mesajlar) {
  const sistem = mesajlar.find(m => m.role === 'system')?.content || ''
  const araçlar = ARAÇLAR.map(a => ({ name: a.ad, description: a.açıklama, input_schema: a.şema }))
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
      if (/hatası 429/.test(metin)) { hatalar.push(m); continue } // kota dolu → sıradaki model
      throw err // başka hata — gerçek sorun
    }
  }
  throw new Error(`gemini: tüm ücretsiz modellerin kotası dolu (${hatalar.join(', ')}) — yarın yenilenir ya da ücretli katmana geçilir`)
}

// ---------- Ana döngü ----------
/**
 * Ajanı çalıştırır. Dönüş: { metin, adımlar: [{arac, giris, sonuc}] }
 */
export async function ajanÇalıştır(tanim, patronMesajı, geçmiş = []) {
  const seçim = await saglayiciCoz()
  if (!seçim) {
    throw Object.assign(new Error(
      'Model anahtarı yok. .team/konsol/.env içine ücretsiz GEMINI_API_KEY ekleyin (aistudio.google.com/apikey) — ya da OPENAI/OPENROUTER/GROQ/ANTHROPIC anahtarı.'
    ), { kod: 'anahtar-yok' })
  }
  const { saglayici: sağ, model } = seçim

  const mesajlar = [
    { role: 'system', content: sistemMesajı(tanim) },
    ...geçmiş,
    { role: 'user', content: patronMesajı },
  ]

  const adımlar = []
  for (let adım = 0; adım < MAKS_ADIM; adım++) {
    const asistan = await sağlayıcıÇağırZincir(sağ, model, mesajlar)
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
