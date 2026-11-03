// "Telefonun çalınırsa ilk 5 adım" sayfası için yayın öncesi denetim.
// Yayın kapısı: kaynak dosyada TODO-DOGRULA işareti varken sayfa yayınlanmaz. YAYIN_KAPISI=1 ile koşulunca işaret varsa test kırılır;
// kapı kapalıyken normal koşuda "skipped" görünür (açık TODO-DOGRULA var).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { TR, EN, PLAY_TELEFON_CALINIRSA_INSTAGRAM, playHref, playOrganik, type Content } from "../src/lib/telefon-calinirsa.ts";

const kaynakYolu = path.join(process.cwd(), "src", "lib", "telefon-calinirsa.ts");

function gorunenMetin(c: Content): string {
  const parcalar: string[] = [c.title, c.description, c.h1, c.lead, c.calmNote, c.beforeTitle, c.beforeLead, c.helperTitle, c.helperText, c.ctaLabel, c.ctaNote, c.sourcesTitle, c.disclaimer, c.trademarks];
  for (const s of c.steps) parcalar.push(s.heading, ...(s.lines ?? []), ...(s.platforms ?? []).flatMap((p) => [p.name, p.text]), s.note ?? "");
  for (const b of c.before) parcalar.push(b.text);
  for (const s of c.sources) parcalar.push(s.name);
  return parcalar.join("\n");
}

const yasak = [
  /offline/i, /çevrimdışı/i, /internetsiz/i, /hesapsız/i, /hesap yok/i, /sunucumuz yok/i, /banka seviyesi/i, /kırılamaz/i, /%100/,
  /daha güvenli/i, /en güvenli/i, /most secure/i, /kasan güvende/i, /your vault is safe/i,
  // Korku dili
  /her şeyini kaybed/i, /boşal/i, /you will lose everything/i,
  // BTK / e-Devlet hizmet adı: resmî sayfadan doğrulanmadı (TODO-DOGRULA 1)
  /e-?devlet/i, /\b120\b/, /\bBTK\b/, /ihbar bildirimi/i,
  // Eski ad: Google'ın güncel adı
  /Cihazımı Bul/i, /Find My Device/i,
  // Defne/Zeynep 2026-11-03: "hattı kapattır" hat iptali gibi okunur, doğrusu "askıya aldır"; "ilk 5 dakika" kaynaksız
  /hattı(nı)? kapat/i, /(close|cancel|shut off) (the |your )?line/i, /ilk 5 dakika/i, /first 5 minutes/i,
  // Kaynak listesinde CISA yok (Zeynep): metinde de geçmez
  /\bCISA\b/,
];

for (const [ad, c] of [["TR", TR], ["EN", EN]] as const) {
  const s = gorunenMetin(c);
  test(`${ad}: yasak ifade, korku dili ve doğrulanmamış hizmet adı yok`, () => {
    for (const r of yasak) assert.ok(!r.test(s), `${ad}: ${r} bulundu`);
  });
  test(`${ad}: ekranda TODO-DOGRULA ya da iç not işareti yok`, () => {
    assert.ok(!/TODO/i.test(s));
    assert.ok(!/YASİN ONAYI/i.test(s));
  });
  test(`${ad}: 5 adım, her adımın kaynağı ya da genel öneri notu var`, () => {
    assert.equal(c.steps.length, 5);
    for (const st of c.steps) assert.ok(st.sources.length > 0 || st.note, `${ad}: ${st.heading} kaynaksız`);
    const kullanilan = new Set(c.steps.flatMap((st) => st.sources).concat(c.before.flatMap((b) => b.sources)));
    for (const k of kullanilan) assert.ok(c.sources.some((x) => x.key === k), `${ad}: ${k} kaynak listesinde yok`);
  });
  test(`${ad}: meta başlık ≤60 (| OstlerTech ile), açıklama ≤155, başlık ile H1 aynı`, () => {
    assert.ok(`${c.title} | OstlerTech`.length <= 60, `${ad}: başlık ${c.title.length + 13}`);
    assert.ok(c.description.length <= 155, `${ad}: açıklama ${c.description.length}`);
    assert.equal(c.title, c.h1);
  });
  test(`${ad}: Android™ ilk geçişte bir kez, başka simge yok; sahiplik satırı yalnız geçen adları anar`, () => {
    assert.equal((s.match(/Android™/g) ?? []).length, 1);
    assert.ok(!/[®©]/.test(s) && (s.match(/™/g) ?? []).length === 1);
    assert.equal(s.indexOf("Android"), s.indexOf("Android™"), `${ad}: ilk Android geçişi ™'li değil`);
    for (const ad2 of ["Google", "Android", "Apple", "iPhone"]) assert.ok(c.trademarks.includes(ad2), `${ad}: sahiplik satırında ${ad2} yok`);
    assert.ok(!/Microsoft|Autodesk|NIST/.test(c.trademarks));
  });
  test(`${ad}: kaynaksız adımlar ve bilinmeyen kaynak notu açıkça yazılı (banka, IMEI)`, () => {
    assert.match(c.lead, /IMEI/);
    for (const i of [2, 4]) assert.ok(c.steps[i].note && /\.$/.test(c.steps[i].note ?? ""), `${ad}: ${i + 1}. adım notu yok`);
  });
  test(`${ad}: kaynak bağlantıları resmî alan adlarında`, () => {
    for (const x of c.sources) assert.match(x.url, /^https:\/\/(support\.google\.com|support\.apple\.com|pages\.nist\.gov)\//);
  });
}

const referrer = (u: string) => decodeURIComponent(new URL(u).searchParams.get("referrer") ?? "");
const INSTAGRAM_UTM = "utm_source=instagram&utm_medium=dm&utm_campaign=2026-11-guvenlik&utm_content=reels-telefon-calinirsa";

test("Play bağlantısı: Reels/DM'den gelince pazarlama belgesindeki UTM", () => {
  for (const s of ["?utm_source=instagram&utm_medium=dm&utm_campaign=2026-11-guvenlik&utm_content=reels-telefon-calinirsa", "?k=ig", "?k=IG", "?utm_source=Instagram"]) {
    assert.equal(referrer(playHref(s, "tr")), INSTAGRAM_UTM, s);
    assert.equal(referrer(playHref(s, "en")), INSTAGRAM_UTM, s);
  }
});

test("Play bağlantısı: organik açılışta site UTM'si", () => {
  for (const s of ["", "?", "?utm_source=google", "?k=x", "?utm_medium=dm"]) {
    assert.equal(referrer(playHref(s, "tr")), "utm_source=ostlertech.com&utm_medium=site&utm_campaign=telefon-calinirsa&utm_content=sayfa_tr", s);
  }
  assert.equal(referrer(playOrganik("en")), "utm_source=ostlertech.com&utm_medium=site&utm_campaign=telefon-calinirsa&utm_content=sayfa_en");
  assert.equal(referrer(PLAY_TELEFON_CALINIRSA_INSTAGRAM), INSTAGRAM_UTM);
});

test("TR/EN çapraz bağlantıları tutarlı", () => {
  assert.equal(TR.enPath, EN.path);
  assert.equal(EN.trPath, TR.path);
});

const todoVar = fs.readFileSync(kaynakYolu, "utf8").includes("TODO-DOGRULA (yayına çıkmaz");

test("yayın kapısı: TODO-DOGRULA kalmadı", { skip: process.env.YAYIN_KAPISI ? false : "açık TODO-DOGRULA var, Yasin onayı + resmî sayfa teyidi bekliyor" }, () => {
  assert.ok(!todoVar, "kaynak dosyada TODO-DOGRULA bloğu duruyor: sayfa yayınlanmaz");
});
