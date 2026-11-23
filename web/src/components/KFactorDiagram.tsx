// K faktörü sayfasının etiketli kesit çizimi (90° büküm). Yalnız SVG; veri almaz, dil için üç etiket metni gelir.
// Ölçek: iç yarıçap 40, kalınlık 26 (görsel oran; gerçek ölçü değil). Etiketler 18-20 birim: 440 birim genişlik
// 342 px'e inince ~15 px.
export default function KFactorDiagram({ alt, neutral, virtual }: { alt: string; neutral: string; virtual: string }) {
  const line = "rgb(var(--c-primary))";
  const dim = "rgb(var(--c-muted))";
  const txt = "rgb(var(--c-foreground))";
  const body = "rgb(var(--c-card))";
  return (
    <svg viewBox="0 0 440 300" role="img" aria-label={alt} className="w-full h-auto">
      <title>{alt}</title>
      <defs>
        <marker id="kfa" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={dim} />
        </marker>
      </defs>

      {/* Parça: yatay kol sola, dikey kol aşağı. Dış köşe yayı (R+t = 66), iç yay R = 40, merkez (234,116). */}
      <path d="M60,50 H234 A66,66 0 0 1 300,116 V250 H274 V116 A40,40 0 0 0 234,76 H60 Z" fill={body} stroke={line} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Sanal köşeye uzanan dış yüz uzantıları */}
      <path d="M234,50 H300 V116" fill="none" stroke={line} strokeWidth="1.5" strokeDasharray="5 4" />
      <circle cx="300" cy="50" r="4.5" fill={line} />
      <text x="304" y="40" fill={txt} fontSize="18" fontWeight="600" textAnchor="start">{virtual}</text>

      {/* Nötr eksen (K·t derinlikte, r = 50) */}
      <path d="M60,63 H234 A50,50 0 0 1 284,116 V250" fill="none" stroke="rgb(var(--c-weak))" strokeWidth="2" strokeDasharray="7 5" />
      <line x1="120" y1="63" x2="120" y2="106" stroke="rgb(var(--c-weak))" strokeWidth="1.5" />
      <text x="120" y="128" fill="rgb(var(--c-weak))" fontSize="19" fontWeight="600" textAnchor="middle">{neutral}</text>

      {/* L1: üstte, soldan sanal köşeye */}
      <line x1="60" y1="22" x2="300" y2="22" stroke={dim} strokeWidth="1.5" markerStart="url(#kfa)" markerEnd="url(#kfa)" />
      <line x1="60" y1="16" x2="60" y2="50" stroke={dim} strokeWidth="1" />
      <line x1="300" y1="16" x2="300" y2="50" stroke={dim} strokeWidth="1" />
      <text x="170" y="17" fill={txt} fontSize="20" fontWeight="700" textAnchor="middle">L1</text>

      {/* OSSB: bükümün başladığı çizgiden sanal köşeye */}
      <line x1="234" y1="38" x2="300" y2="38" stroke={dim} strokeWidth="1.5" markerStart="url(#kfa)" markerEnd="url(#kfa)" />
      <line x1="234" y1="32" x2="234" y2="50" stroke={dim} strokeWidth="1" />
      <text x="206" y="43" fill={txt} fontSize="20" fontWeight="700" textAnchor="end">OSSB</text>

      {/* L2: sağda, sanal köşeden alta */}
      <line x1="335" y1="50" x2="335" y2="250" stroke={dim} strokeWidth="1.5" markerStart="url(#kfa)" markerEnd="url(#kfa)" />
      <line x1="300" y1="250" x2="341" y2="250" stroke={dim} strokeWidth="1" />
      <line x1="300" y1="50" x2="341" y2="50" stroke={dim} strokeWidth="1" />
      <text x="346" y="154" fill={txt} fontSize="20" fontWeight="700" textAnchor="start">L2</text>

      {/* t: dikey kolun kalınlığı */}
      <line x1="274" y1="272" x2="300" y2="272" stroke={dim} strokeWidth="1.5" markerStart="url(#kfa)" markerEnd="url(#kfa)" />
      <line x1="274" y1="250" x2="274" y2="278" stroke={dim} strokeWidth="1" />
      <line x1="300" y1="250" x2="300" y2="278" stroke={dim} strokeWidth="1" />
      <text x="287" y="294" fill={txt} fontSize="20" fontWeight="700" textAnchor="middle">t</text>

      {/* R: iç yarıçap, merkezden iç yaya (45° yönünde) */}
      <circle cx="234" cy="116" r="3" fill={dim} />
      <line x1="234" y1="116" x2="262" y2="88" stroke={dim} strokeWidth="1.5" markerEnd="url(#kfa)" />
      <text x="212" y="152" fill={txt} fontSize="20" fontWeight="700" textAnchor="middle">R</text>
    </svg>
  );
}
