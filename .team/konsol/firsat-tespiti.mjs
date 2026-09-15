// FIRSAT TESPİTİ — GitHub trend → monetizasyon analizi hattı
// ------------------------------------------------------------
// Akış: GitHub Search API (star kazanımı hızlı yeni repolar) → HTML trending
// listesi → FIRSAT AVCISI ajanı (ÇAĞRI üzerinden) → .team/reports/github-firsatlari.md
// Zamanlayıcı komuta-server.mjs'te; manuel tetikleme /api/firsat/tara ile.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ajanÇalıştır } from './cagri.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJE_KOK = path.resolve(__dirname, '..', '..')
const RAPOR_YOLU = path.join(PROJE_KOK, '.team', 'reports', 'github-firsatlari.md')

// ÇAĞRI için ince tanım (sunucu .agents yükleyicisi codebuff yolu için tam tanımı kullanır)
const AVCITANIM = {
  id: 'firsat-avcisi',
  displayName: 'Fırsat Avcısı',
  instructionsPrompt: `GitHub'da popülerleşen açık kaynak projelerini para kazandırma
fırsatı olarak değerlendir. Her proje için: (1) tek cümlelik özet, (2) hedef müşteri,
(3) 1-3 ayda en hızlı gelir modeli + somut fiyat önerisi, (4) potansiyel DÜŞÜK/ORTA/YÜKSEK
+ gerekçe (star sayısı tek başına yetmez; ödeme isteği olan bir soruna çözüyor mu?),
(5) risk (tek bakımcı, lisans, dev company gölgesi).

Raporu write_file aracıyla .team/reports/github-firsatlari.md dosyasına yaz:
en üstte tarih + taranan repo sayısı, özet tablo, ilk 3-5 fırsatın derin analizi,
sonda "GÜNÜN FIRSATI" seçimi + 2 haftalık doğrulama planı (3 somut adım).
En son satır: "TOPLAM FIRSAT: <sayı>". Türkçe yaz (teknik terimler hariç).
Harcama/dağıtım kararı vermezsin — önerirsin, onay Patron'undur.`,
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

async function githubGet(url) {
  const r = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ostlertech-firsat-avcisi',
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
  })
  if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 200)}`)
  return r.json()
}

// Yeni doğmuş + hızlı star kazanan repolar → "momentum" sinyali
async function trendleriGetir(adet = 12) {
  const tarih = new Date(Date.now() - 45 * 86400000).toISOString().slice(0, 10)
  const q = encodeURIComponent(`created:>${tarih} stars:>80 sort:stars-desc`)
  const veri = await githubGet(`https://api.github.com/search/repositories?q=${q}&per_page=${adet}`)
  return (veri.items || []).map(r => ({
    ad: r.full_name,
    aciklama: (r.description || '').slice(0, 220),
    url: r.html_url,
    yildiz: r.stargazers_count,
    dil: r.language || '?',
    olusturma: (r.created_at || '').slice(0, 10),
    konular: (r.topics || []).slice(0, 5).join(', '),
  }))
}

// github.com/trending (dil-filtresiz, bugünkü hareket) — Search API'nin göremediği sinyal
async function trendingHtmlGetir() {
  try {
    const r = await fetch('https://github.com/trending', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    })
    if (!r.ok) return []
    const html = await r.text()
    const cikti = []
    const re = /<h2 class="h3 lh-condensed">[\s\S]*?href="\/([^"/]+\/[^"/]+)"[\s\S]*?<\/h2>[\s\S]*?<p class="col-9[^"]*">([\s\S]*?)<\/p>[\s\S]*?<a[^>]*class="[^"]*Link--muted[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:<span class="d-inline-block float-sm-right">([\s\S]*?)<\/span>)?/g
    let m
    while ((m = re.exec(html)) && cikti.length < 8) {
      cikti.push({
        ad: m[1].trim(),
        aciklama: m[2].replace(/<[^>]+>/g, '').trim().slice(0, 220),
        bugunYildiz: (m[4] || '').replace(/<[^>]+>/g, '').replace(/[^\d,]/g, '').trim() || '0',
      })
    }
    return cikti
  } catch {
    return [] // trending HTML değişirse sessizce atla — Search API tek başına yeterli
  }
}

export async function firsatTaramasiYap({ reposLimit = 12 } = {}) {
  const t0 = Date.now()
  const trendler = await trendleriGetir(reposLimit)
  const htmlTrend = await trendingHtmlGetir()

  const projeMetni = trendler
    .map((r, i) => `${i + 1}. ${r.ad} ★${r.yildiz} [${r.dil}] (kuruluş: ${r.olusturma}, konular: ${r.konular || 'yok'})
   ${r.aciklama}
   ${r.url}`)
    .join('\n\n')
  const htmlMetni = htmlTrend.length
    ? htmlTrend.map(t => `- ${t.ad} (bugün +${t.bugunYildiz}) — ${t.aciklama}`).join('\n')
    : '(trending HTML alınamadı — sadece Search API verisiyle devam)'

  const emir = `GitHub trend taraması — ${new Date().toLocaleDateString('tr-TR')}

SEARCH API (son 45 günde doğup 80+ star yapan, en hızlı yükselen ${trendler.length} repo):
${projeMetni}

GITHUB TRENDING (bugünkü hareket):
${htmlMetni}

Bu listeyi monetizasyon kriterlerine göre değerlendir, raporu
.team/reports/github-firsatlari.md dosyasına yaz.`

  const sonuc = await ajanÇalıştır(ADIM_AVCITANIM(), emir)

  // Rapor dosyası ajanın write_file çağrısıyla yazıldı; yoksa emir metninden kurtar
  let raporVar = false
  try {
    raporVar = fs.existsSync(RAPOR_YOLU) && fs.statSync(RAPOR_YOLU).size > 200
  } catch { /* noop */ }
  if (!raporVar && sonuc.metin && sonuc.metin.length > 400) {
    fs.mkdirSync(path.dirname(RAPOR_YOLU), { recursive: true })
    fs.writeFileSync(RAPOR_YOLU, `> (ajan dosyaya yazamadı — emir çıktısından kurtarıldı)\n\n${sonuc.metin}`)
  }

  // Ajanın bıraktığı satır yerine gerçek metrik: özet tablodaki YÜKSEK potansiyelli repo satırları
  let toplamFirsat = 0
  try {
    const icerik = fs.readFileSync(RAPOR_YOLU, 'utf8')
    toplamFirsat = (icerik.match(/^\|[^\n]*\*\*YÜKSEK\*\*/gm) || []).length
  } catch { /* noop */ }

  const adımÖzeti = (sonuc.adımlar || []).map(a => `${a.arac}: ${String(a.sonuc).split('\n')[0].slice(0, 100)}`)
  return {
    tamam: true,
    süreMs: Date.now() - t0,
    taranan: trendler.length + htmlTrend.length,
    toplamFirsat,
    raporDosyası: 'web olmayan yol: .team/reports/github-firsatlari.md',
    raporYolu: RAPOR_YOLU,
    adımlar: adımÖzeti,
    ozet: (sonuc.metin || '').slice(0, 600),
  }
}

// Tek yerden tanım üret (hem codebuff yolu hem cagri yolu aynı dosyadan beslensin)
function ADIM_AVCITANIM() {
  return {
    ...AVCITANIM,
    systemPrompt: AVCITANIM.instructionsPrompt,
  }
}
