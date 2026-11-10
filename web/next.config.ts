import type { NextConfig } from "next";

// Paddle.js (cdn.paddle.com, ödeme penceresi *.paddle.com iframe, profitwell ölçümü), YouTube oynatıcısı (youtube-nocookie.com),
// Vercel Analytics (aynı alan adı /_vercel/insights) ve önizleme araç çubuğu (vercel.live) için.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.paddle.com https://public.profitwell.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://cdn.paddle.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.paddle.com https://public.profitwell.com https://vercel.live",
  "frame-src https://*.paddle.com https://www.youtube-nocookie.com https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // Kök düzen TR/EN diye ayrıldığı için eşleşmeyen adreslerin 404'ü src/app/global-not-found.tsx'ten gelir.
  experimental: { globalNotFound: true },
  images: {
    unoptimized: true, // Statik görseller için Vercel'de kolaylık sağlar
  },
  async redirects() {
    return [
      { source: "/privacy", destination: "/syncpass/privacy", permanent: true },
      // Uch Uch (eski adlar Vızvız ve Skimwing): eski gizlilik adresleri zincirsiz, doğrudan yeni adrese kalıcı yönlenir.
      { source: "/vizviz/privacy", destination: "/uchuch/privacy", permanent: true },
      { source: "/skimwing/privacy", destination: "/uchuch/privacy", permanent: true },
      { source: "/en/vizviz/privacy", destination: "/en/uchuch/privacy", permanent: true },
      { source: "/en/skimwing/privacy", destination: "/en/uchuch/privacy", permanent: true },
      // Satışları Paddle (Merchant of Record) yaptığı için bu iki belge Kullanım ve Satış Koşulları'na katıldı.
      { source: "/mesafeli-satis-sozlesmesi", destination: "/kullanim-sartlari", permanent: true },
      { source: "/on-bilgilendirme-formu", destination: "/kullanim-sartlari", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Burak O2 (2026-11-07): önce YALNIZ RAPOR kipi, hiçbir şeyi engellemez; tarayıcı konsolunda ihlal görünür.
          // Zorunlu kipe geçiş (Content-Security-Policy) Yasin onayıyla, bir hafta izlendikten sonra. Next satır içi betik
          // yazdığı için nonce'suz politikada 'unsafe-inline' gerekir; nonce her sayfayı dinamik yapar (statik sayfa kalmaz).
          { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
        ],
      },
      {
        // Görseller: 1 gün tarayıcı önbelleği + 7 gün eskiyken sun. Sürüm eki (?v=) olmayan dosya değişirse en geç 1 gün sonra yenilenir.
        // /_next/ (Next'in kendi kalıcı önbelleği) ve JSON (ör. /areapilot/surum.json sürüm denetimi) bu kurala girmez.
        source: "/:path((?!_next/).*\\.(?:png|jpe?g|webp|svg|ico))",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
