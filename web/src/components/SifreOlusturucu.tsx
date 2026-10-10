"use client";

// Güvenli şifre oluşturucu: şifre bu bileşende, tarayıcının kriptografik rastgele sayı üreteciyle (crypto.getRandomValues)
// üretilir. Hiçbir yere gönderilmez, kaydedilmez. Seçilen her karakter grubundan en az bir karakter bulunur.
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

const KUCUK = "abcdefghijklmnopqrstuvwxyz";
const BUYUK = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const RAKAM = "0123456789";
const SEMBOL = "!@#$%^&*()-_=+[]{};:,.?/";
const BENZER = /[O0oIl1|]/g; // birbirine karışan karakterler

// 0..n-1 arası yansız rastgele tam sayı (reddetme örneklemesi; modülo yanlılığı yok).
function rastgele(n: number): number {
  const sinir = Math.floor(0x100000000 / n) * n;
  const kutu = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(kutu);
    if (kutu[0] < sinir) return kutu[0] % n;
  }
}

type Ayar = { uzunluk: number; buyuk: boolean; kucuk: boolean; rakam: boolean; sembol: boolean; benzersiz: boolean; semboller: string };
type SecimAnahtari = "buyuk" | "kucuk" | "rakam" | "sembol" | "benzersiz";

// Kullanıcının yazdığı sembol listesini temizler: yalnızca klavyedeki ASCII sembolleri, her biri bir kez.
// (Harf, rakam, boşluk ve Türkçe karakterler sitelerde sorun çıkarabileceği için alınmaz.)
const IZINLI_SEMBOL = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
function sembolTemizle(s: string): string {
  return [...new Set([...s].filter((c) => IZINLI_SEMBOL.includes(c)))].join("");
}

function gruplar(a: Ayar): string[] {
  const g = [a.kucuk && KUCUK, a.buyuk && BUYUK, a.rakam && RAKAM, a.sembol && sembolTemizle(a.semboller)].filter(Boolean) as string[];
  return a.benzersiz ? g.map((s) => s.replace(BENZER, "")).filter(Boolean) : g;
}

function uret(a: Ayar): string {
  const g = gruplar(a);
  if (!g.length) return "";
  const havuz = g.join("");
  const k: string[] = g.map((s) => s[rastgele(s.length)]); // her gruptan en az bir karakter
  while (k.length < a.uzunluk) k.push(havuz[rastgele(havuz.length)]);
  for (let i = k.length - 1; i > 0; i--) { const j = rastgele(i + 1); [k[i], k[j]] = [k[j], k[i]]; }
  return k.join("");
}

function guc(a: Ayar): { bit: number; etiket: string; renk: string; oran: number } {
  const havuz = gruplar(a).join("").length;
  const bit = havuz ? Math.round(a.uzunluk * Math.log2(havuz)) : 0;
  if (bit < 50) return { bit, etiket: "Zayıf", renk: "bg-red-500", oran: 25 };
  if (bit < 70) return { bit, etiket: "Orta", renk: "bg-amber-400", oran: 50 };
  if (bit < 100) return { bit, etiket: "Güçlü", renk: "bg-ok", oran: 75 };
  return { bit, etiket: "Çok güçlü", renk: "bg-ok", oran: 100 };
}

const SECENEKLER: { anahtar: SecimAnahtari; ad: string; ornek: string }[] = [
  { anahtar: "buyuk", ad: "Büyük harf", ornek: "A-Z" },
  { anahtar: "kucuk", ad: "Küçük harf", ornek: "a-z" },
  { anahtar: "rakam", ad: "Rakam", ornek: "0-9" },
  { anahtar: "sembol", ad: "Sembol", ornek: "!@#$" },
  { anahtar: "benzersiz", ad: "Karışan karakterleri çıkar", ornek: "0 O l 1" },
];

export default function SifreOlusturucu() {
  const [ayar, setAyar] = useState<Ayar>({ uzunluk: 20, buyuk: true, kucuk: true, rakam: true, sembol: true, benzersiz: false, semboller: SEMBOL });
  const [sifre, setSifre] = useState("");
  const [kopyalandi, setKopyalandi] = useState(false);

  const yenile = useCallback(() => { setSifre(uret(ayar)); setKopyalandi(false); }, [ayar]);
  useEffect(() => { yenile(); }, [yenile]); // ilk şifre tarayıcıda üretilir (sunucuda değil)

  const g = guc(ayar);

  async function kopyala() {
    if (!sifre) return;
    try { await navigator.clipboard.writeText(sifre); setKopyalandi(true); setTimeout(() => setKopyalandi(false), 2000); } catch { /* izin yoksa sessiz */ }
  }

  function degistir(anahtar: SecimAnahtari) {
    const yeni = { ...ayar, [anahtar]: !ayar[anahtar] };
    if (yeni.sembol && !sembolTemizle(yeni.semboller)) yeni.semboller = SEMBOL; // boş listeyle açılırsa varsayılana dön
    if (gruplar(yeni).length === 0) return; // en az bir karakter grubu seçili kalır
    setAyar(yeni);
  }

  function sembolleriDegistir(metin: string) {
    const yeni = { ...ayar, semboller: sembolTemizle(metin) };
    if (gruplar(yeni).length === 0) return; // tek grup sembolse liste boşaltılamaz
    setAyar(yeni);
  }

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <output
          aria-live="polite"
          aria-label="Oluşturulan şifre"
          className="flex-1 min-h-[3.5rem] flex items-center rounded-2xl border border-line bg-surface px-5 py-3 font-mono text-lg md:text-xl text-white break-all"
        >
          {sifre || " "}
        </output>
        <div className="flex gap-3">
          <button type="button" onClick={kopyala} className="btn-primary flex-1 sm:flex-none !py-3.5">
            {kopyalandi ? <Check size={18} /> : <Copy size={18} />} {kopyalandi ? "Kopyalandı" : "Kopyala"}
          </button>
          <button type="button" onClick={yenile} className="btn-secondary !py-3.5" aria-label="Yeni şifre oluştur">
            <RefreshCw size={18} /> <span className="sm:hidden md:inline">Yenile</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Güç: <strong className="text-white">{g.etiket}</strong></span>
          <span className="text-muted">yaklaşık {g.bit} bit</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
          <div className={`h-full ${g.renk} transition-all duration-300`} style={{ width: `${g.oran}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="uzunluk" className="flex items-center justify-between text-sm text-foreground font-semibold">
          Uzunluk <span className="font-mono text-white">{ayar.uzunluk} karakter</span>
        </label>
        <input
          id="uzunluk" type="range" min={8} max={64} value={ayar.uzunluk}
          onChange={(e) => setAyar({ ...ayar, uzunluk: Number(e.target.value) })}
          className="w-full accent-[var(--primary)]"
        />
      </div>

      <fieldset className="grid sm:grid-cols-2 gap-3">
        <legend className="sr-only">Karakter seçenekleri</legend>
        {SECENEKLER.map((s) => {
          const secili = ayar[s.anahtar];
          // Kapatınca hiç karakter grubu kalmayacaksa kutu kilitlenir.
          const kilitli = secili && gruplar({ ...ayar, [s.anahtar]: false }).length === 0;
          return (
            <label
              key={s.anahtar}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                secili ? "border-primary/40 bg-primary/10 text-white" : "border-line bg-white/[0.02] text-muted"
              } ${kilitli ? "cursor-not-allowed" : ""}`}
            >
              <span>{s.ad} <span className="font-mono text-xs text-muted">{s.ornek}</span></span>
              <input type="checkbox" checked={secili} disabled={kilitli} onChange={() => degistir(s.anahtar)} className="h-4 w-4 accent-[var(--primary)]" />
            </label>
          );
        })}
      </fieldset>

      {ayar.sembol && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="semboller" className="text-sm font-semibold text-foreground">Kullanılacak semboller</label>
            {ayar.semboller !== SEMBOL && (
              <button type="button" onClick={() => setAyar({ ...ayar, semboller: SEMBOL })} className="text-xs text-primary hover:text-primary-light">
                Varsayılana dön
              </button>
            )}
          </div>
          <input
            id="semboller" type="text" value={ayar.semboller} spellCheck={false} autoComplete="off"
            onChange={(e) => sembolleriDegistir(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-mono text-base text-white tracking-widest focus:border-primary/60 focus:outline-none"
          />
          <p className="text-xs text-muted">
            İstemediğiniz sembolü silin, eklemek istediğinizi yazın. Bazı siteler yalnızca belirli sembolleri kabul eder;
            o sitenin izin verdiği sembolleri bırakın. Harf, rakam ve boşluk bu kutuya eklenmez.
          </p>
        </div>
      )}

      <p className="text-xs text-muted leading-relaxed">
        Şifre bu sayfada, tarayıcınızın güvenli rastgele sayı üreteciyle oluşturulur. Hiçbir sunucuya gönderilmez ve kaydedilmez.
        Sayfayı kapattığınızda kaybolur; kullanacağınız şifreyi bir şifre yöneticisine kaydedin.
      </p>
    </div>
  );
}
