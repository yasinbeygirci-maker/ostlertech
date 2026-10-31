import type { Config } from "tailwindcss";

// Palet SyncPass Android ve masaüstü uygulamalarıyla aynı: lacivert zemin, mavi vurgu.
// Durum renkleri (ok/weak/bad) yalnızca bir durumu anlatırken kullanılır. Renkler CSS belirteçlerinden gelir.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // mini-markdown.tsx gibi src/lib altındaki çizicilerin sınıfları da üretilsin.
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Consolas", "monospace"],
      },
      colors: {
        // Degerler globals.css'teki --c-* belirteclerinden gelir (varsayilan = SyncPass paleti).
        background: "rgb(var(--c-background) / <alpha-value>)",
        foreground: "rgb(var(--c-foreground) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        card: "rgb(var(--c-card) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        device: "rgb(var(--c-device) / <alpha-value>)",
        white: "rgb(var(--c-white) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          dark: "rgb(var(--c-primary-dark) / <alpha-value>)",
          light: "rgb(var(--c-primary-light) / <alpha-value>)",
          hover: "rgb(var(--c-primary-hover) / <alpha-value>)",
          glow: "rgb(var(--c-primary) / 0.15)",
        },
        secondary: {
          DEFAULT: "rgb(var(--c-surface) / <alpha-value>)",
          lighter: "rgb(var(--c-card) / <alpha-value>)",
        },
        accent: {
          blue: "rgb(var(--c-primary) / <alpha-value>)",
          purple: "rgb(var(--c-purple) / <alpha-value>)",
        },
        ok: "rgb(var(--c-ok) / <alpha-value>)",
        weak: "rgb(var(--c-weak) / <alpha-value>)",
        bad: "rgb(var(--c-bad) / <alpha-value>)",
        border: "rgb(var(--c-line) / <alpha-value>)",
      },
      // Yazı ölçeği globals.css'teki --text-* belirteçlerinden gelir (13px altı yok).
      fontSize: {
        xs: ["var(--text-caption)", { lineHeight: "1.45" }],
        sm: ["var(--text-small)", { lineHeight: "1.55" }],
        base: ["var(--text-body)", { lineHeight: "1.55" }],
        lg: ["var(--text-lead)", { lineHeight: "1.5" }],
        xl: ["var(--text-h4)", { lineHeight: "1.3" }],
        "2xl": ["var(--text-h3)", { lineHeight: "1.25" }],
        "3xl": ["var(--text-h2)", { lineHeight: "1.2" }],
        "4xl": ["var(--text-h2-lg)", { lineHeight: "1.18" }],
        "5xl": ["var(--text-display)", { lineHeight: "1.15" }],
        "6xl": ["var(--text-hero)", { lineHeight: "1.15" }],
        "7xl": ["clamp(3rem, 2.2rem + 3.4vw, 4.5rem)", { lineHeight: "1.12" }],
      },
      boxShadow: {
        device: "var(--shadow-device)",
        window: "var(--shadow-window)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 7s ease-in-out infinite",
        rise: "rise 0.6s cubic-bezier(0.2, 0.9, 0.25, 1) both",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
