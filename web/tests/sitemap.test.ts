// public/sitemap.xml elle yazılır: yeni sayfa eklenip sitemap unutulmasın, olmayan adres girmesin (Kerem 2026-11-07 #4).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const WEB = process.cwd();
const APP = path.join(WEB, "src", "app");
const xml = fs.readFileSync(path.join(WEB, "public", "sitemap.xml"), "utf8");
const BASE = "https://www.ostlertech.com";

/** Sitemap'e BİLEREK girmeyen sayfalar ve nedeni. Yeni bir sayfa buraya ancak gerekçeyle eklenir. */
const DISARIDA: Record<string, string> = {
  "/welcome": "ödeme sonrası teşekkür sayfası, noindex",
  "/syncsite": "SyncSite e-posta doğrulama iniş sayfası, noindex",
  "/en/syncsite": "SyncSite e-posta doğrulama iniş sayfası, noindex",
  "/tilvora/kaynak": "Tilvora açık kaynak (Sparrow, jagua-rs) kaynak kodu sayfası; ürün henüz tanıtılmadı, noindex",
  "/en/tilvora/kaynak": "Tilvora açık kaynak (Sparrow, jagua-rs) kaynak kodu sayfası; ürün henüz tanıtılmadı, noindex",
};

function routes(dir = APP, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "api" || e.name.startsWith("[")) continue;
      routes(p, out);
    } else if (e.name === "page.tsx") {
      const rel = path.relative(APP, path.dirname(p)).split(path.sep).filter((s) => !/^\(.*\)$/.test(s));
      out.push("/" + rel.join("/"));
    }
  }
  return out;
}

const entries = [...xml.matchAll(/<url>(.*?)<\/url>/g)].map((m) => ({
  loc: /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1] ?? "",
  lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1],
}));

test("sitemap: her adres gerçek bir sayfa, yinelenen yok, hepsinde lastmod (YYYY-AA-GG)", () => {
  const all = new Set(routes());
  const seen = new Set<string>();
  assert.ok(entries.length > 40);
  for (const e of entries) {
    assert.ok(e.loc.startsWith(BASE), e.loc);
    const p = e.loc.slice(BASE.length) || "/";
    assert.ok(all.has(p), `rota yok: ${p}`);
    assert.ok(!seen.has(p), `iki kez: ${p}`);
    seen.add(p);
    assert.match(e.lastmod ?? "", /^20\d\d-\d\d-\d\d$/, `lastmod: ${p}`);
    assert.ok(!(p in DISARIDA), `dışarıda kalmalı: ${p} (${DISARIDA[p]})`);
  }
});

test("sitemap: dışarıda listesindekiler hariç her sayfa sitemap'te", () => {
  const inMap = new Set(entries.map((e) => e.loc.slice(BASE.length) || "/"));
  const eksik = routes().filter((r) => !inMap.has(r) && !(r in DISARIDA));
  assert.deepEqual(eksik, [], `sitemap'e eklenmemiş sayfa: ${eksik.join(", ")}`);
});

test("sitemap dışındaki sayfalar noindex", () => {
  for (const r of Object.keys(DISARIDA)) {
    const group = r === "/en" || r.startsWith("/en/") ? "(en)" : "(tr)";
    const f = path.join(APP, group, ...r.split("/").filter(Boolean), "page.tsx");
    assert.match(fs.readFileSync(f, "utf8"), /robots:\s*\{\s*index:\s*false/, r);
  }
});
