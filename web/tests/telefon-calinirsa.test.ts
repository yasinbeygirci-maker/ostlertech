// "Telefonun çalınırsa ilk 5 adım" sayfası için yayın öncesi denetim.
// Yayın kapısı: kaynak dosyada TODO-DOGRULA işareti varken sayfa yayınlanmaz. YAYIN_KAPISI=1 ile koşulunca işaret varsa test kırılır;
// kapı kapalıyken normal koşuda "skipped" görünür (açık TODO-DOGRULA var).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { TR, EN, type Content } from "../src/lib/telefon-calinirsa.ts";
import {
  IG_TELEFON_CALINIRSA, PLAY_TELEFON_CALINIRSA_INSTAGRAM, playHrefFor, playHrefTelefon as playHref, playOrganikTelefon as playOrganik,
} from "../src/lib/play-utm.ts";

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
  // Burak 2026-11-03: e-Devlet hizmet adı doğrulandı (yasaktan çıktı); "120" ve BİM numarası doğrulanamadı, yazılmaz
  /\b120\b/, /\bBİM\b/, /\bBIM\b/, /\b0\s?312\b/,
  // Polis IMEI'yi kapatmaz izlenimi veren eski ifade
  /resmî kayıp\/çalıntı bildirim yoluyla/i, /official lost\/stolen reporting route/i,
  // Konum takibi hakkında söz verme (Burak Ş1: oturum kapatmanın konumu durdurup durdurmadığı doğrulanamadı)
  /konum(u)? (durur|durmaz|kapan)/i, /location (stops|will stop)/i,
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
  test(`${ad}: kaynaksız banka adımı notla açıkça belirtilmiş; IMEI adımı artık kaynaklı`, () => {
    assert.match(c.lead, /bank/i);
    assert.ok(!/IMEI/.test(c.lead), `${ad}: lead IMEI'ye kaynak yok diyor`);
    assert.equal(c.steps[2].sources.length, 0);
    assert.ok(c.steps[2].note && /\.$/.test(c.steps[2].note ?? ""), `${ad}: 3. adım (banka) notu yok`);
    assert.ok(c.steps[4].sources.includes("e-Devlet") && c.steps[4].sources.includes("Mevzuat"), `${ad}: 5. adım e-Devlet/Mevzuat kaynağı yok`);
  });
  test(`${ad}: kaynak bağlantıları resmî alan adlarında`, () => {
    for (const x of c.sources) assert.match(x.url, /^https:\/\/(support\.google\.com|support\.apple\.com|pages\.nist\.gov|www\.turkiye\.gov\.tr|www\.mevzuat\.gov\.tr)\//);
    for (const k of ["e-Devlet", "Mevzuat"] as const) assert.ok(c.sources.some((x) => x.key === k), `${ad}: ${k} kaynak listesinde yok`);
  });
  test(`${ad}: 4. adımda Google oturumunu kapatma satırı, konum sözü yok`, () => {
    const adim = [c.steps[3].heading, ...(c.steps[3].lines ?? [])].join("\n");
    assert.match(adim, ad === "TR" ? /Cihazlarınız[\s\S]*oturumu kapat/ : /Your devices[\s\S]*sign out/);
    assert.ok(!/konum|location/i.test(adim), `${ad}: 4. adımda konum sözü`);
  });
  test(`${ad}: 5. adım IMEI'yi hat sahibi e-Devlet'ten kapattırır; çift hat, iptal, polis karışmaz`, () => {
    const adim = [c.steps[4].heading, ...(c.steps[4].lines ?? []), c.steps[4].note ?? ""].join("\n");
    assert.match(adim, /Kayıp\/Çalıntı İhbar Bildirimi/);
    assert.match(adim, /Kayıp\/Çalıntı İhbar Sorgulama\/İptal/);
    assert.match(adim, ad === "TR" ? /kendi adına kayıtlı/ : /registered in your name/);
    assert.match(adim, ad === "TR" ? /iki IMEI/ : /two IMEIs|both IMEIs/);
    assert.match(adim, ad === "TR" ? /ayrı işlem/ : /separate actions/);
    assert.match(adim, /android\.com\/find/);
  });
  test(`${ad}: SIM PIN (PUK uyarısı) ve çift hat IMEI notu "çalınmadan önce" listesinde`, () => {
    const once = c.before.map((b) => b.text).join("\n");
    assert.match(once, /SIM PIN/);
    assert.match(once, /PUK/);
    assert.match(once, /\*#06#/);
    assert.match(once, ad === "TR" ? /iki IMEI/ : /two IMEIs/);
  });
  test(`${ad}: ücretsiz kayıt sınırı sayıdan bağımsız yazılı (4.5.23'te 15 -> 25)`, () => {
    assert.ok(!/\d/.test(c.ctaNote), `${ad}: ctaNote sayı içeriyor`);
    assert.ok(!/\b15\b/.test(s.replace(/15[ -](karakter|haneli|characters|digit)/g, "").replace(/\((madde|articles) [^)]*\)/g, "")), `${ad}: sayfada kayıt sınırı olarak 15 geçiyor`);
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

// Kontrol listesi sayfaları (TR /guvenlik-kontrol-listesi, EN /en/security-checklist) aynı mantığı kullanır (GuideChecklist -> PlayCta).
const LISTE_ORGANIK = "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dliste%26utm_content%3Dsayfa_tr";

test("Kontrol listesi: organik açılışta mevcut site UTM'si aynen kalır", () => {
  for (const s of ["", "?utm_source=google", "?k=x", "?utm_medium=dm"]) assert.equal(playHrefFor(s, LISTE_ORGANIK, IG_TELEFON_CALINIRSA), LISTE_ORGANIK, s);
});

test("Kontrol listesi: DM'deki 'Listeyi aç' bağlantısı (?utm_source=instagram&...) ya da ?k=ig Instagram UTM'li Play bağlantısı verir", () => {
  const dm = "?utm_source=instagram&utm_medium=dm&utm_campaign=2026-11-guvenlik&utm_content=reels-telefon-calinirsa";
  assert.equal(referrer(playHrefFor(dm, LISTE_ORGANIK, IG_TELEFON_CALINIRSA)), INSTAGRAM_UTM);
  assert.equal(referrer(playHrefFor("?k=ig", LISTE_ORGANIK, IG_TELEFON_CALINIRSA)), INSTAGRAM_UTM);
  // Başka otomasyonun kampanyası kendi adıyla kalır (LİSTE/PLAN eski akışları)
  assert.equal(
    referrer(playHrefFor("?utm_source=instagram&utm_medium=dm&utm_campaign=liste&utm_content=liste-tr", LISTE_ORGANIK)),
    "utm_source=instagram&utm_medium=dm&utm_campaign=liste&utm_content=liste-tr",
  );
  // Varsayılan yoksa ve adreste de yoksa yalnız kaynak ve ortam
  assert.equal(referrer(playHrefFor("?k=ig", LISTE_ORGANIK)), "utm_source=instagram&utm_medium=dm");
});

test("Play referrer: adresten gelen değer güvenli karakterlerle sınırlı (enjeksiyon yok)", () => {
  const kotu = playHrefFor("?utm_source=instagram&utm_campaign=a%26utm_source%3Devil&utm_content=" + "x".repeat(80), LISTE_ORGANIK, IG_TELEFON_CALINIRSA);
  assert.equal(referrer(kotu), INSTAGRAM_UTM);
  assert.equal((referrer(kotu).match(/utm_source=/g) ?? []).length, 1);
});

test("Kontrol listesi sayfaları: PlayCta üzerinden, yeni sayfaya iç bağlantı TR+EN", () => {
  const oku = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");
  const g = oku("src/components/GuideChecklist.tsx");
  assert.ok(g.includes("<PlayCta") && !g.includes("<a href={ctaHref}"), "GuideChecklist ham Play bağlantısı kullanıyor");
  const tr = oku("src/app/(tr)/guvenlik-kontrol-listesi/page.tsx");
  const en = oku("src/app/(en)/en/security-checklist/page.tsx");
  assert.ok(tr.includes("/telefon-calinirsa") && tr.includes("ig={IG_TELEFON_CALINIRSA}"));
  assert.ok(en.includes("/en/if-your-phone-is-stolen") && en.includes("ig={IG_TELEFON_CALINIRSA}"));
});

test("TR/EN çapraz bağlantıları tutarlı", () => {
  assert.equal(TR.enPath, EN.path);
  assert.equal(EN.trPath, TR.path);
});

// Yayın kapısı: YAYIN_KAPISI=1 ile koşulur (birleştirme/yayın öncesi). İki şart:
//  1. Kaynak dosyada TODO-DOGRULA işareti yok (Burak kapısı 2026-11-03 ile kapandı).
//  2. tests/DEFNE-BEKLIYOR dosyası yok: Defne dil denetimini bitirip bulgularını işleyince dosya silinir.
const todoVar = /TODO-DOGRULA/.test(fs.readFileSync(kaynakYolu, "utf8"));
const defneBekliyor = fs.existsSync(path.join(process.cwd(), "tests", "DEFNE-BEKLIYOR.md"));

test("yayın kapısı: TODO-DOGRULA kalmadı", { skip: process.env.YAYIN_KAPISI ? false : "kapı kapalı (YAYIN_KAPISI=1 ile koş)" }, () => {
  assert.ok(!todoVar, "kaynak dosyada TODO-DOGRULA işareti duruyor: sayfa yayınlanmaz");
});

test("yayın kapısı: Defne dil denetimi bitti (tests/DEFNE-BEKLIYOR.md yok)", { skip: process.env.YAYIN_KAPISI ? false : "kapı kapalı (YAYIN_KAPISI=1 ile koş)" }, () => {
  assert.ok(!defneBekliyor, "tests/DEFNE-BEKLIYOR.md duruyor: Defne bulgusu işlenmeden sayfa yayınlanmaz");
});
