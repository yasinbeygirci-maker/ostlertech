"use client";

import { useState } from "react";
import { Command, ClipboardX, Columns3, SunMoon } from "lucide-react";
import Waitlist from "./Waitlist";

const shots = {
  vault: { label: "Kasa", dark: "desktop-vault-dark", light: "desktop-vault-light" },
  security: { label: "Şifre sağlığı", dark: "desktop-security-dark", light: "desktop-security-light" },
} as const;

type ShotKey = keyof typeof shots;

const points = [
  { icon: Columns3, title: "Üç sütun", desc: "Kategoriler, liste ve ayrıntı yan yana. Pencere daralınca ayrıntı listenin üstünde açılır." },
  { icon: Command, title: "Klavyeyle hızlı", desc: "Ctrl+Shift+P hızlı erişim penceresini açar; Ctrl+C şifreyi, Ctrl+B kullanıcı adını kopyalar." },
  { icon: ClipboardX, title: "Pano geçmişine düşmez", desc: "Kopyalanan şifre Windows pano geçmişine ve bulut panosuna yazılmaz." },
  { icon: SunMoon, title: "Windows temasına uyar", desc: "Açık ve koyu tema sistemi izler; isterseniz ayarlardan sabitleyin." },
];

export default function Desktop() {
  const [shot, setShot] = useState<ShotKey>("vault");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const current = shots[shot];

  return (
    <section id="masaustu" className="section-padding relative overflow-hidden border-y border-line bg-surface/60">
      <div className="absolute -z-10 left-1/2 top-40 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <p className="eyebrow">SyncPass Masaüstü · Windows</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Bilgisayarda da aynı kasa.</h2>
          <p className="text-lg text-muted">
            Android ile aynı şifreleme ve kasa biçimi, aynı güvenlik puanı. Masaüstü sürümü son testlerinde; çıktığında
            haber vermemizi isterseniz aşağıya e-postanızı bırakın.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div role="tablist" aria-label="Ekran" className="inline-flex rounded-full border border-line bg-background p-1">
            {(Object.keys(shots) as ShotKey[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={shot === k}
                onClick={() => setShot(k)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  shot === k ? "bg-card text-white" : "text-muted hover:text-white"
                }`}
              >
                {shots[k].label}
              </button>
            ))}
          </div>
          <div role="tablist" aria-label="Tema" className="inline-flex rounded-full border border-line bg-background p-1">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={theme === t}
                onClick={() => setTheme(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  theme === t ? "bg-card text-white" : "text-muted hover:text-white"
                }`}
              >
                {t === "dark" ? "Koyu" : "Açık"}
              </button>
            ))}
          </div>
        </div>

        <div className="device-window max-w-5xl mx-auto">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 bg-background">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-3 text-xs text-muted">SyncPass</span>
          </div>
          <img
            key={`${shot}-${theme}`}
            src={`/screens/${current[theme]}.webp`}
            alt={`SyncPass masaüstü, ${current.label.toLowerCase()} ekranı, ${theme === "dark" ? "koyu" : "açık"} tema`}
            width={1200}
            height={800}
            loading="lazy"
          />
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((p) => (
            <div key={p.title} className="space-y-2">
              <p.icon className="text-primary" size={22} />
              <h3 className="font-bold text-white">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-md mx-auto text-center space-y-4">
          <p className="text-sm font-semibold text-white">Windows sürümü çıkınca haber verelim</p>
          <Waitlist productName="SyncPass Desktop" />
        </div>
      </div>
    </section>
  );
}
