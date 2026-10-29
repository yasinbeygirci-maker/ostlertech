import { COMPANY, FOUNDER, INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/site";

// Hakkımızda (TR) ve About (EN) sayfalarındaki kurucu kartı ve kuruluş yapısal verisi.
export function FounderCard({ lang }: { lang: "tr" | "en" }) {
  const tr = lang === "tr";
  return (
    <div className="flex gap-5 items-start rounded-2xl border border-line bg-surface p-6">
      {FOUNDER.photo ? (
        <img src={FOUNDER.photo} alt={FOUNDER.name} width={80} height={80} className="shrink-0 h-20 w-20 rounded-full object-cover" />
      ) : (
        <div aria-hidden className="shrink-0 grid place-items-center h-16 w-16 rounded-full bg-primary/15 text-primary text-xl font-extrabold">
          {FOUNDER.name.split(" ").map((p) => p[0]).join("")}
        </div>
      )}
      <div className="space-y-2">
        <p className="text-lg font-bold text-white">{FOUNDER.name}</p>
        <p className="text-sm font-semibold text-primary">{tr ? FOUNDER.titleTr : FOUNDER.titleEn}</p>
        <p>
          {tr
            ? "OstlerTech'i kurdu ve yönetiyor. SyncPass, SyncPass Desktop ve Projex'in tasarımı, geliştirmesi, yayını ve kullanıcı desteği onun sorumluluğunda."
            : "Founded OstlerTech and runs it. He is responsible for the design, development, release and user support of SyncPass, SyncPass Desktop and Projex."}
        </p>
        {FOUNDER.linkedin && (
          <p><a href={FOUNDER.linkedin} rel="noopener" className="text-primary hover:text-primary-light">LinkedIn</a></p>
        )}
      </div>
    </div>
  );
}

export function OrganizationLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.brand,
    legalName: `${COMPANY.legalName} (${COMPANY.tradeName})`,
    url: "https://www.ostlertech.com",
    logo: "https://www.ostlertech.com/logo-ostlertech.png",
    email: COMPANY.email,
    telephone: COMPANY.phone,
    taxID: COMPANY.taxNumber,
    duns: COMPANY.duns,
    address: { "@type": "PostalAddress", streetAddress: COMPANY.address, addressLocality: "Erzincan", addressCountry: "TR" },
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.titleEn,
      ...(FOUNDER.photo ? { image: `https://www.ostlertech.com${FOUNDER.photo}` } : {}),
      ...(FOUNDER.linkedin ? { sameAs: [FOUNDER.linkedin] } : {}),
    },
    sameAs: [INSTAGRAM_URL, YOUTUBE_URL],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
