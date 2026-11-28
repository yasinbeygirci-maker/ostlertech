# Graph Report - web  (2026-11-18)

## Corpus Check
- 106 files · ~61,399 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 492 nodes · 1232 edges · 27 communities (22 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- site.ts
- Footer
- bekleme/route.ts
- app/page.tsx
- AreaPilotLanding.tsx
- satin-al/page.tsx
- package.json
- GuideChecklist.tsx
- compilerOptions
- SifreOlusturucu.tsx
- dependencies
- offline-password-manager/page.tsx
- EnFooter
- Waitlist.tsx
- en/page.tsx
- password-manager-comparison/page.tsx
- layout.tsx
- password-manager-with-authenticator/page.tsx
- scripts
- react
- tailwindcss
- EKİP FOTOĞRAFLARI — Adlandırma Kuralı
- Sosyal medya simgeleri: kaynak ve kullanım (okuma tarihi 2026-11-01)
- diasync/delete-account/page.tsx
- Üçüncü taraf bildirimleri (ostlertech.com)

## God Nodes (most connected - your core abstractions)
1. `next` - 56 edges
2. `LegalPage()` - 45 edges
3. `H2()` - 40 edges
4. `List()` - 37 edges
5. `Footer()` - 36 edges
6. `Navbar()` - 35 edges
7. `lucide-react` - 27 edges
8. `COMPANY` - 23 edges
9. `SellerBlock()` - 22 edges
10. `EnFooter()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `supabaseAdmin()`  [EXTRACTED]
  web/src/app/api/license/by-transaction/route.ts → web/src/lib/server/supabase-admin.ts
- `AreaPilotPage()` --calls--> `Footer()`  [EXTRACTED]
  web/src/app/areapilot/page.tsx → web/src/components/Footer.tsx
- `AreaPilotPage()` --calls--> `Navbar()`  [EXTRACTED]
  web/src/app/areapilot/page.tsx → web/src/components/Navbar.tsx
- `DijitalGuvenlikPlani()` --calls--> `Footer()`  [EXTRACTED]
  web/src/app/dijital-guvenlik-plani/page.tsx → web/src/components/Footer.tsx
- `DijitalGuvenlikPlani()` --calls--> `Navbar()`  [EXTRACTED]
  web/src/app/dijital-guvenlik-plani/page.tsx → web/src/components/Navbar.tsx

## Import Cycles
- None detected.

## Communities (27 total, 5 thin omitted)

### Community 0 - "site.ts"
Cohesion: 0.08
Nodes (61): nextConfig, next, CornerTabPrivacyPage(), metadata, AboutEnPage(), metadata, CornerTabPrivacyEnPage(), metadata (+53 more)

### Community 1 - "Footer"
Cohesion: 0.05
Nodes (58): lucide-react, metadata, PrivacyPolicy(), faqLd, GuvenliSifreOlusturucu(), kurallar, metadata, sss (+50 more)

### Community 2 - "bekleme/route.ts"
Cohesion: 0.07
Nodes (40): server-only@^0.0.1, server-only, DOWNLOADS, dynamic, json(), POST(), runtime, dynamic (+32 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.08
Nodes (33): Home(), jsonLd, metadata, AreaPilotBanner(), ConstellationBackground(), draw(), loop(), resize() (+25 more)

### Community 4 - "AreaPilotLanding.tsx"
Cohesion: 0.12
Nodes (20): AreaPilotPage(), metadata, jsonLd, metadata, VideosPage(), AreaPilotLanding(), BetaDownloadForm(), Downloads (+12 more)

### Community 5 - "satin-al/page.tsx"
Cohesion: 0.17
Nodes (19): @paddle/paddle-js, dynamic, metadata, PricingEnPage(), dynamic, metadata, PricingPage(), PaddlePricing() (+11 more)

### Community 6 - "package.json"
Cohesion: 0.13
Nodes (20): devDependencies, autoprefixer@^10.5.4, eslint@^9.0.0, eslint-config-next@15.5.25, postcss@^8.5.26, @types/node@^20.0.0, @types/react@^19.0.0, @types/react-dom@^19.0.0 (+12 more)

### Community 7 - "GuideChecklist.tsx"
Cohesion: 0.16
Nodes (16): DijitalGuvenlikPlani(), items, metadata, DigitalSecurityPlan(), items, metadata, GuvenlikKontrolListesi(), items (+8 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "SifreOlusturucu.tsx"
Cohesion: 0.29
Nodes (11): Ayar, gruplar(), guc(), rastgele(), SECENEKLER, SecimAnahtari, sembolTemizle(), SifreOlusturucu() (+3 more)

### Community 10 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, framer-motion@^13.1.1, lucide-react@^0.468.0, next@15.5.25, @paddle/paddle-js@^1.6.5, react-dom@^19.0.0, @supabase/supabase-js@^2.112.4, @vercel/analytics@^2.0.1 (+4 more)

### Community 11 - "offline-password-manager/page.tsx"
Cohesion: 0.18
Nodes (10): approaches, faq, ld, metadata, notFor, OfflinePasswordManager(), free, premium (+2 more)

### Community 12 - "EnFooter"
Cohesion: 0.33
Nodes (8): AreaPilotEnPage(), metadata, items, metadata, SecurityChecklist(), EnFooter(), EnHeader(), guides

### Community 13 - "Waitlist.tsx"
Cohesion: 0.27
Nodes (8): clsx@^2.1.1, tailwind-merge@^2.5.5, clsx, tailwind-merge, cn(), Waitlist(), WaitlistProps, getSupabase()

### Community 14 - "en/page.tsx"
Cohesion: 0.22
Nodes (8): EnglishHome(), faq, features, free, ld, leaves, metadata, premium

### Community 15 - "password-manager-comparison/page.tsx"
Cohesion: 0.25
Nodes (7): faq, ld, metadata, PasswordManagerComparison(), picks, products, rows

### Community 16 - "layout.tsx"
Cohesion: 0.25
Nodes (5): metadata, mono, sans, viewport, SITE_URL

### Community 17 - "password-manager-with-authenticator/page.tsx"
Cohesion: 0.29
Nodes (6): faq, ld, metadata, PasswordManagerWithAuthenticator(), steps, supports

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 19 - "react"
Cohesion: 0.50
Nodes (3): react@^19.0.0, react, Node

### Community 20 - "tailwindcss"
Cohesion: 0.50
Nodes (3): tailwindcss@^3.4.19, tailwindcss, config

### Community 21 - "EKİP FOTOĞRAFLARI — Adlandırma Kuralı"
Cohesion: 0.50
Nodes (3): EKİP FOTOĞRAFLARI — Adlandırma Kuralı, Hazır Portreler, Nasıl çalışır

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `site.ts` to `Footer`, `bekleme/route.ts`, `app/page.tsx`, `AreaPilotLanding.tsx`, `satin-al/page.tsx`, `package.json`, `GuideChecklist.tsx`, `dependencies`, `offline-password-manager/page.tsx`, `EnFooter`, `en/page.tsx`, `password-manager-comparison/page.tsx`, `layout.tsx`, `password-manager-with-authenticator/page.tsx`, `diasync/delete-account/page.tsx`?**
  _High betweenness centrality (0.372) - this node is a cross-community bridge._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Footer` to `app/page.tsx`, `AreaPilotLanding.tsx`, `satin-al/page.tsx`, `package.json`, `GuideChecklist.tsx`, `SifreOlusturucu.tsx`, `dependencies`, `offline-password-manager/page.tsx`, `Waitlist.tsx`, `en/page.tsx`, `password-manager-with-authenticator/page.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `Footer` be split into smaller, more focused modules?**
  _Cohesion score 0.0547945205479452 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `site.ts`, `Footer`, `app/page.tsx`, `AreaPilotLanding.tsx`, `satin-al/page.tsx`, `package.json`, `SifreOlusturucu.tsx`, `Waitlist.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `bekleme/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06966618287373004 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07560975609756097 - nodes in this community are weakly interconnected._