"use client";
// K faktörü hesap arayüzü. Tüm hesap tarayıcıda (src/lib/k-faktoru.ts); ağ isteği, çerez, depolama yok.
import { useId, useState } from "react";
import KFactorFlat from "@/components/KFactorFlat";
import { acinim, kBul, ortalama, sayiOku } from "@/lib/k-faktoru";
import type { Lang, Metin } from "@/lib/k-faktoru-metin";
import { EN, TR } from "@/lib/k-faktoru-metin";

type Numune = { id: number; L: string; L1: string; L2: string };
type Kenar = { id: number; v: string };

const input =
  "w-full min-h-[48px] rounded-xl border border-line bg-surface px-3 py-2 text-[17px] text-white placeholder:text-muted/70 focus:outline-none focus:border-primary";
const label = "block text-[15px] text-muted mb-1.5";
const btn =
  "inline-flex items-center justify-center min-h-[44px] rounded-xl border border-line px-4 text-[16px] font-semibold text-white hover:border-primary hover:text-primary-light transition-colors";

export default function KFactorCalculator({ lang }: { lang: Lang }) {
  const c: Metin = lang === "tr" ? TR : EN;
  const uid = useId();
  const [tab, setTab] = useState<"find" | "unfold">("find");
  const [t, setT] = useState("");
  const [R, setR] = useState("");
  const [theta, setTheta] = useState("90");
  const [rows, setRows] = useState<Numune[]>([{ id: 1, L: "", L1: "", L2: "" }]);
  const [nextId, setNextId] = useState(2);
  const [K, setK] = useState("");
  const [dims, setDims] = useState<Kenar[]>([{ id: 1, v: "" }, { id: 2, v: "" }]);

  const fmt = (x: number, d: number) => x.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const mm = (x: number) => `${fmt(x, 3)} mm`;

  const tN = sayiOku(t);
  const RN = sayiOku(R);
  const thN = sayiOku(theta);

  const setRow = (id: number, k: "L" | "L1" | "L2", v: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  const addRow = () => {
    setRows((rs) => [...rs, { id: nextId, L: "", L1: "", L2: "" }]);
    setNextId((n) => n + 1);
  };
  const addDim = () => {
    setDims((ds) => [...ds, { id: nextId, v: "" }]);
    setNextId((n) => n + 1);
  };

  // Her numune: tamamen boşsa atlanır, kısmen doluysa girdi eksik sayılır (sonuç yok), dolu ise hesaplanır.
  const sonuclar = rows.map((r) => {
    const bos = [r.L, r.L1, r.L2].every((x) => x.trim() === "");
    const eksik = [r.L, r.L1, r.L2].some((x) => x.trim() === "") || t.trim() === "" || R.trim() === "" || theta.trim() === "";
    if (bos || eksik) return { id: r.id, durum: "bekle" as const };
    return { id: r.id, durum: "sonuc" as const, s: kBul({ t: tN, R: RN, L: sayiOku(r.L), L1: sayiOku(r.L1), L2: sayiOku(r.L2), thetaDeg: thN }) };
  });
  const gecerliK = sonuclar.flatMap((x) => (x.durum === "sonuc" && x.s.ok ? [x.s.deger.K] : []));
  const ortK = gecerliK.length > 0 ? ortalama(gecerliK) : null;

  const ornekYukle = () => {
    // t=2, R=2, θ=90°: iki numune. L1 = L2 = 50 ile K ≈ 0,4006 ve ≈ 0,4324 verir (elle doğrulandı; ayrıntı tests/k-faktoru.test.ts).
    setT("2");
    setR("2");
    setTheta("90");
    setRows([
      { id: 1, L: "96.4", L1: "50", L2: "50" },
      { id: 2, L: "96.5", L1: "50", L2: "50" },
    ]);
    setNextId(3);
  };
  const temizle = () => {
    setT("");
    setR("");
    setTheta("90");
    setRows([{ id: 1, L: "", L1: "", L2: "" }]);
    setK("");
    setDims([{ id: 1, v: "" }, { id: 2, v: "" }]);
    setNextId(3);
  };

  const dolu = dims.filter((d) => d.v.trim() !== "");
  const aciSonuc =
    t.trim() === "" || R.trim() === "" || theta.trim() === "" || K.trim() === "" || dolu.length === 0
      ? null
      : acinim({ t: tN, R: RN, K: sayiOku(K), thetaDeg: thN, dis: dims.filter((d) => d.v.trim() !== "").map((d) => sayiOku(d.v)) });

  const ortakAlanlar = (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <label htmlFor={`${uid}-t`} className={label}>{c.common.t} <span className="text-muted/80">[{c.common.unit}]</span></label>
        <input id={`${uid}-t`} className={input} inputMode="decimal" autoComplete="off" value={t} onChange={(e) => setT(e.target.value)} placeholder="2" />
      </div>
      <div>
        <label htmlFor={`${uid}-r`} className={label}>{c.common.R} <span className="text-muted/80">[{c.common.unit}]</span></label>
        <input id={`${uid}-r`} className={input} inputMode="decimal" autoComplete="off" value={R} onChange={(e) => setR(e.target.value)} placeholder="2" />
      </div>
      <div>
        <label htmlFor={`${uid}-th`} className={label}>{c.common.theta} <span className="text-muted/80">[{c.common.deg}]</span></label>
        <input id={`${uid}-th`} className={input} inputMode="decimal" autoComplete="off" value={theta} onChange={(e) => setTheta(e.target.value)} placeholder="90" />
      </div>
    </div>
  );

  const hata = (kod: keyof Metin["errors"]) => (
    <p role="alert" className="rounded-xl border border-bad/50 bg-bad/10 px-4 py-3 text-[16px] text-white">{c.errors[kod]}</p>
  );
  const uyari = (kod: keyof Metin["warnings"]) => (
    <p role="status" className="rounded-xl border border-weak/60 bg-weak/10 px-4 py-3 text-[16px] text-white">{c.warnings[kod]}</p>
  );

  return (
    <div className="rounded-2xl border border-line bg-card p-5 md:p-8 space-y-6">
      <div role="tablist" aria-label="K-factor" className="grid gap-2 sm:grid-cols-2">
        {(["find", "unfold"] as const).map((k) => (
          <button
            key={k}
            id={`${uid}-tab-${k}`}
            role="tab"
            type="button"
            aria-selected={tab === k}
            aria-controls={`${uid}-panel-${k}`}
            onClick={() => setTab(k)}
            className={`min-h-[48px] rounded-xl border px-4 py-2 text-[17px] font-semibold text-left transition-colors ${
              tab === k ? "border-primary bg-primary/15 text-white" : "border-line text-muted hover:text-white"
            }`}
          >
            {c.tabs[k]}
          </button>
        ))}
      </div>

      {ortakAlanlar}

      {tab === "find" && (
        <div id={`${uid}-panel-find`} role="tabpanel" aria-labelledby={`${uid}-tab-find`} className="space-y-5">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{c.find.heading}</h2>
          <p className="text-[17px] text-muted leading-relaxed">{c.find.intro}</p>

          <div className="space-y-4">
            {rows.map((r, i) => {
              const sonuc = sonuclar[i];
              return (
                <fieldset key={r.id} className="rounded-xl border border-line p-4 space-y-3">
                  <legend className="px-2 text-[16px] font-semibold text-white">{c.find.sample} {i + 1}</legend>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["L", "L1", "L2"] as const).map((k) => (
                      <div key={k}>
                        <label htmlFor={`${uid}-${r.id}-${k}`} className={label}>{c.find.cols[k]} <span className="text-muted/80">[{c.common.unit}]</span></label>
                        <input
                          id={`${uid}-${r.id}-${k}`}
                          className={input}
                          inputMode="decimal"
                          autoComplete="off"
                          value={r[k]}
                          onChange={(e) => setRow(r.id, k, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  {sonuc.durum === "sonuc" && !sonuc.s.ok && hata(sonuc.s.hata)}
                  {sonuc.durum === "sonuc" && sonuc.s.ok && (
                    <div className="space-y-3">
                      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-[16px]">
                        <div><dt className="text-muted">{c.find.resultK}</dt><dd className="text-xl font-extrabold text-white">{fmt(sonuc.s.deger.K, 4)}</dd></div>
                        <div><dt className="text-muted">{c.outputs.BA}</dt><dd className="font-semibold text-white">{mm(sonuc.s.deger.BA)}</dd></div>
                        <div><dt className="text-muted">{c.outputs.BD}</dt><dd className="font-semibold text-white">{mm(sonuc.s.deger.BD)}</dd></div>
                        <div><dt className="text-muted">{c.outputs.OSSB}</dt><dd className="font-semibold text-white">{mm(sonuc.s.deger.OSSB)}</dd></div>
                      </dl>
                      {sonuc.s.uyarilar.map((u) => <div key={u}>{uyari(u)}</div>)}
                    </div>
                  )}
                  {rows.length > 1 && (
                    <button type="button" className={btn} onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}>{c.find.remove}</button>
                  )}
                </fieldset>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className={btn} onClick={addRow}>+ {c.find.add}</button>
            <button type="button" className={btn} onClick={ornekYukle}>{c.find.loadExample}</button>
            <button type="button" className={btn} onClick={temizle}>{c.find.clear}</button>
          </div>

          {ortK !== null ? (
            <div className="rounded-xl border border-primary/50 bg-primary/10 p-5 space-y-3" aria-live="polite">
              <p className="text-[16px] text-muted">{c.find.mean} ({gecerliK.length} {c.find.meanNote})</p>
              <p className="text-4xl font-extrabold text-white">K = {fmt(ortK, 4)}</p>
              {ortK < 0 && uyari("k-dusuk")}
              {ortK > 0.5 && uyari("k-yuksek")}
              <button
                type="button"
                className={btn}
                onClick={() => {
                  setK(String(Math.round(ortK * 10000) / 10000));
                  setTab("unfold");
                }}
              >
                {c.find.useMean}
              </button>
            </div>
          ) : (
            <p className="text-[16px] text-muted">{c.find.needValues}</p>
          )}
        </div>
      )}

      {tab === "unfold" && (
        <div id={`${uid}-panel-unfold`} role="tabpanel" aria-labelledby={`${uid}-tab-unfold`} className="space-y-5">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{c.unfold.heading}</h2>
          <p className="text-[17px] text-muted leading-relaxed">{c.unfold.intro}</p>

          <div className="max-w-xs">
            <label htmlFor={`${uid}-k`} className={label}>{c.unfold.K}</label>
            <input id={`${uid}-k`} className={input} inputMode="decimal" autoComplete="off" value={K} onChange={(e) => setK(e.target.value)} placeholder="0,4" />
            <p className="mt-1.5 text-[15px] text-muted">{c.unfold.useMeanHint}</p>
          </div>

          <div>
            <p className={label}>{c.unfold.dims} <span className="text-muted/80">[{c.common.unit}]</span></p>
            <div className="grid gap-3 sm:grid-cols-2">
              {dims.map((d, i) => (
                <div key={d.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label htmlFor={`${uid}-d-${d.id}`} className="block text-[15px] text-muted mb-1.5">{c.unfold.dim} {i + 1}</label>
                    <input
                      id={`${uid}-d-${d.id}`}
                      className={input}
                      inputMode="decimal"
                      autoComplete="off"
                      value={d.v}
                      onChange={(e) => setDims((ds) => ds.map((x) => (x.id === d.id ? { ...x, v: e.target.value } : x)))}
                    />
                  </div>
                  {dims.length > 1 && (
                    <button type="button" className={btn} onClick={() => setDims((ds) => ds.filter((x) => x.id !== d.id))} aria-label={`${c.unfold.removeDim} ${c.unfold.dim} ${i + 1}`}>
                      {c.unfold.removeDim}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className={btn} onClick={addDim}>+ {c.unfold.addDim}</button>
            <button type="button" className={btn} onClick={temizle}>{c.find.clear}</button>
          </div>

          {aciSonuc === null && <p className="text-[16px] text-muted">{c.unfold.needValues}</p>}
          {aciSonuc && !aciSonuc.ok && hata(aciSonuc.hata)}
          {aciSonuc && aciSonuc.ok && (
            <div className="rounded-xl border border-primary/50 bg-primary/10 p-5 space-y-4" aria-live="polite">
              <p className="text-[16px] text-muted">{c.unfold.flat} · {c.unfold.bends(aciSonuc.deger.bukumSayisi)}</p>
              <p className="text-4xl font-extrabold text-white">{mm(aciSonuc.deger.acinim)}</p>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-[16px]">
                <div><dt className="text-muted">{c.unfold.sumOuter}</dt><dd className="font-semibold text-white">{mm(aciSonuc.deger.toplamDis)}</dd></div>
                <div><dt className="text-muted">{c.outputs.BA}</dt><dd className="font-semibold text-white">{mm(aciSonuc.deger.BA)}</dd></div>
                <div><dt className="text-muted">{c.outputs.BD}</dt><dd className="font-semibold text-white">{mm(aciSonuc.deger.BD)}</dd></div>
                <div><dt className="text-muted">{c.outputs.OSSB}</dt><dd className="font-semibold text-white">{mm(aciSonuc.deger.OSSB)}</dd></div>
              </dl>
              {aciSonuc.uyarilar.map((u) => <div key={u}>{uyari(u)}</div>)}
            </div>
          )}
          {aciSonuc && aciSonuc.ok && aciSonuc.deger.bukumler.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-white">{c.unfold.plan.heading}</h3>
              <p className="text-[17px] text-muted leading-relaxed">{c.unfold.plan.intro}</p>
              <div className="rounded-xl border border-line bg-surface p-3">
                <KFactorFlat total={aciSonuc.deger.acinim} bukumler={aciSonuc.deger.bukumler} alt={c.unfold.plan.drawAlt} bendWord={c.unfold.plan.bend.charAt(0)} sightShort={c.unfold.plan.sightShort} />
              </div>
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[30rem] text-[16px]">
                  <thead>
                    <tr className="border-b border-line text-left text-muted">
                      <th className="px-3 py-2 font-semibold">{c.unfold.plan.bend}</th>
                      <th className="px-3 py-2 font-semibold">{c.unfold.plan.tan1}</th>
                      <th className="px-3 py-2 font-semibold">{c.unfold.plan.tan2}</th>
                      <th className="px-3 py-2 font-semibold">{c.unfold.plan.sight}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aciSonuc.deger.bukumler.map((b, i) => (
                      <tr key={i} className="border-b border-line last:border-0 text-white">
                        <td className="px-3 py-2 font-semibold">{c.unfold.plan.bend.charAt(0)}{i + 1}</td>
                        <td className="px-3 py-2">{mm(b.bas)}</td>
                        <td className="px-3 py-2">{mm(b.bit)}</td>
                        <td className="px-3 py-2">{mm(b.gorus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[16px] text-muted">
                {c.unfold.plan.flange}: {aciSonuc.deger.flans.map((f) => mm(f)).join(" · ")}
              </p>
              <p className="text-[17px] text-muted leading-relaxed">{c.unfold.plan.sightNote}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-[15px] text-muted">{c.privacy}</p>
    </div>
  );
}
