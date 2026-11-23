// Açınım şeridi: flanşlar, büküm bölgeleri (iki teğet çizgisi arası), görüş çizgileri. Ölçekli (toplam boy = çizim genişliği).
import type { BukumKonum } from "@/lib/k-faktoru";

export default function KFactorFlat({
  total, bukumler, alt, bendWord, sightShort,
}: { total: number; bukumler: BukumKonum[]; alt: string; bendWord: string; sightShort: string }) {
  const W = 380, X0 = 12, X1 = 368, Y0 = 52, H = 46;
  const k = (X1 - X0) / total;
  const x = (mm: number) => X0 + mm * k;
  const primary = "rgb(var(--c-primary))";
  const weak = "rgb(var(--c-weak))";
  return (
    <svg viewBox={`0 0 ${W} 150`} role="img" aria-label={alt} className="w-full h-auto">
      <title>{alt}</title>
      <rect x={X0} y={Y0} width={X1 - X0} height={H} fill="rgb(var(--c-card))" stroke={primary} strokeWidth="2" />
      {bukumler.map((b, i) => (
        <g key={i}>
          <rect x={x(b.bas)} y={Y0} width={Math.max(x(b.bit) - x(b.bas), 1)} height={H} fill={primary} fillOpacity="0.28" />
          <line x1={x(b.bas)} y1={Y0 - 6} x2={x(b.bas)} y2={Y0 + H + 6} stroke={primary} strokeWidth="2" />
          <line x1={x(b.bit)} y1={Y0 - 6} x2={x(b.bit)} y2={Y0 + H + 6} stroke={primary} strokeWidth="2" />
          <line x1={x(b.gorus)} y1={Y0 - 6} x2={x(b.gorus)} y2={Y0 + H + 22} stroke={weak} strokeWidth="2" strokeDasharray="5 4" />
          <text x={(x(b.bas) + x(b.bit)) / 2} y={Y0 - 12} fill="rgb(var(--c-foreground))" fontSize="19" fontWeight="700" textAnchor="middle">
            {bendWord}{i + 1}
          </text>
          <text x={x(b.gorus)} y={Y0 + H + 42} fill={weak} fontSize="19" fontWeight="700" textAnchor="middle">
            {sightShort}{i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
