import type { Config } from "tailwindcss";

// Palet SyncPass Android ve masaüstü uygulamalarıyla aynı: lacivert zemin, mavi vurgu.
// Durum renkleri (ok/weak/bad) yalnızca bir durumu anlatırken kullanılır.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Consolas", "monospace"],
      },
      colors: {
        background: "#0E121A",
        foreground: "#E8EDF5",
        surface: "#111722",
        card: "#171E2B",
        line: "#263047",
        muted: "#8E9AB0",
        primary: {
          DEFAULT: "#4C8DFF",
          dark: "#0052D4",
          light: "#8AB4FF",
          glow: "rgba(76, 141, 255, 0.15)",
        },
        secondary: {
          DEFAULT: "#111722",
          lighter: "#171E2B",
        },
        accent: {
          blue: "#4C8DFF",
          purple: "#8B5CF6",
        },
        ok: "#10B981",
        weak: "#F5A524",
        bad: "#FF4D6D",
        border: "#263047",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 7s ease-in-out infinite",
        rise: "rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
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
