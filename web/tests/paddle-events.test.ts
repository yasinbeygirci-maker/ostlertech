// Paddle bildirimi işleme: lisans üretimi (ürün/plan/cihaz yalnız sunucu tablosundan), yinelenen bildirim, satın alma e-postası
// (sahte e-posta göndericiyle). Çalıştırma: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { processPaddleEvent, mailLangFrom, type PaddleEvent, type PurchaseMailer } from "../src/lib/paddle-events.ts";
import { AREAPILOT_PRICE_IDS, priceInfo } from "../src/lib/paddle-tiers.ts";

const SYNCPASS_LIFETIME = "pri_01m41q4dg3816kmsk2sd76npdy";
const OFFICE = AREAPILOT_PRICE_IDS.office as string;
const INDIVIDUAL = AREAPILOT_PRICE_IDS.individual as string;
const FIRM = AREAPILOT_PRICE_IDS.firm as string;

type Row = Record<string, unknown>;

// Yalnız webhook'un kullandığı sorgu zincirlerini taklit eden bellek içi veritabanı.
function fakeDb(opts: { failEventInsert?: boolean; failLicenseInsert?: boolean } = {}) {
  const tables: Record<string, Row[]> = { sp_paddle_events: [], sp_paddle_customers: [], sp_licenses: [] };
  const unique: Record<string, string[]> = { sp_paddle_events: ["event_id"], sp_licenses: ["paddle_transaction_id", "license_key"] };
  function from(name: string) {
    const filters: [string, unknown][] = [];
    let op: "select" | "insert" | "upsert" | "update" = "select";
    let payload: Row = {};
    const matches = () => (tables[name] ?? []).filter((r) => filters.every(([c, v]) => r[c] === v));
    const run = (single: boolean): { data: unknown; error: { code?: string } | null } => {
      if (op === "select") return { data: single ? (matches()[0] ?? null) : matches(), error: null };
      if (op === "insert") {
        if (name === "sp_paddle_events" && opts.failEventInsert) return { data: null, error: { code: "XX000" } };
        if (name === "sp_licenses" && opts.failLicenseInsert) return { data: null, error: { code: "XX001" } };
        for (const col of unique[name] ?? []) {
          if (payload[col] != null && tables[name].some((r) => r[col] === payload[col])) return { data: null, error: { code: "23505" } };
        }
        tables[name].push({ id: `${name}-${tables[name].length + 1}`, ...payload });
        return { data: null, error: null };
      }
      if (op === "upsert") {
        const i = tables[name].findIndex((r) => r.paddle_customer_id === payload.paddle_customer_id);
        if (i >= 0) tables[name][i] = { ...tables[name][i], ...payload };
        else tables[name].push({ ...payload });
        return { data: null, error: null };
      }
      for (const r of matches()) Object.assign(r, payload);
      return { data: null, error: null };
    };
    const b = {
      select: () => b,
      eq: (c: string, v: unknown) => (filters.push([c, v]), b),
      maybeSingle: () => Promise.resolve(run(true)),
      insert: (row: Row) => ((op = "insert"), (payload = row), b),
      upsert: (row: Row) => ((op = "upsert"), (payload = row), b),
      update: (row: Row) => ((op = "update"), (payload = row), b),
      then: (res: (v: unknown) => unknown, rej?: (e: unknown) => unknown) => Promise.resolve(run(false)).then(res, rej),
    };
    return b;
  }
  return { db: { from } as never, tables };
}

function harness(over: { db?: ReturnType<typeof fakeDb>; mailer?: PurchaseMailer | null; failMail?: boolean } = {}) {
  const store = over.db ?? fakeDb();
  const sent: { to: string; key: string; lang: string; maxDevices: number }[] = [];
  const logs: unknown[][] = [];
  const jobs: Promise<void>[] = [];
  const mailer: PurchaseMailer | null =
    over.mailer === undefined
      ? {
          async sendPurchaseKey(to, key, lang, maxDevices) {
            if (over.failMail) throw Object.assign(new Error(`resend 500 ${to} ${key}`), { name: "ResendError" });
            sent.push({ to, key, lang, maxDevices });
          },
        }
      : over.mailer;
  let n = 0;
  const deps = {
    db: store.db,
    priceInfo,
    newKey: (product: string) => `${product === "areapilot" ? "APL" : "SPD"}-KEY${++n}`,
    mailer,
    defer: (job: () => Promise<void>) => void jobs.push(job()),
    log: { error: (...a: unknown[]) => void logs.push(["error", ...a]), warn: (...a: unknown[]) => void logs.push(["warn", ...a]) },
    now: () => new Date("2026-11-07T10:00:00Z"),
  };
  return {
    store,
    sent,
    logs,
    async post(event: PaddleEvent) {
      const r = await processPaddleEvent(event, deps);
      await Promise.all(jobs);
      return r;
    },
  };
}

const customerEvent = (id = "ctm_1", email = "alici@example.com", event_id = "evt_c1"): PaddleEvent => ({
  event_id,
  event_type: "customer.created",
  data: { id, email },
});

const txn = (price: string, over: Partial<PaddleEvent["data"]> = {}, event_id = "evt_t1"): PaddleEvent => ({
  event_id,
  event_type: "transaction.completed",
  data: { id: "txn_01aaaaaaaaaaaaaaaaaaaaaaaa", customer_id: "ctm_1", items: [{ price: { id: price }, quantity: 1 }], custom_data: { app: "areapilot", lang: "tr" }, ...over },
});

test("AreaPilot ödemesi: lisans fiyat tablosundan üretilir ve kod alıcıya e-postalanır", async () => {
  const h = harness();
  await h.post(customerEvent());
  const r = await h.post(txn(OFFICE));
  assert.equal(r.status, 200);
  const lic = h.store.tables.sp_licenses[0];
  assert.equal(lic.product, "areapilot");
  assert.equal(lic.plan, "lifetime");
  assert.equal(lic.max_devices, 5);
  assert.equal(lic.email, "alici@example.com");
  assert.equal(lic.current_period_end, null);
  assert.deepEqual(h.sent, [{ to: "alici@example.com", key: lic.license_key as string, lang: "tr", maxDevices: 5 }]);
  assert.equal(h.sent[0].key.startsWith("APL-"), true);
  assert.equal(h.logs.length, 0);
});

test("üç katman: 1 / 5 / 20 bilgisayar", async () => {
  for (const [price, devices] of [[INDIVIDUAL, 1], [OFFICE, 5], [FIRM, 20]] as const) {
    const h = harness();
    await h.post(customerEvent());
    await h.post(txn(price));
    assert.equal(h.store.tables.sp_licenses[0].max_devices, devices);
    assert.equal(h.sent[0].maxDevices, devices);
  }
});

test("istemcinin custom_data'sı ürünü ve cihaz sayısını değiştiremez (yalnız e-posta dili)", async () => {
  const h = harness();
  await h.post(customerEvent());
  await h.post(txn(INDIVIDUAL, { custom_data: { app: "syncpass_desktop", product: "syncpass_desktop", max_devices: 99, maxDevices: 99, plan: "year", lang: "en" } }));
  const lic = h.store.tables.sp_licenses[0];
  assert.equal(lic.product, "areapilot");
  assert.equal(lic.max_devices, 1);
  assert.equal(lic.plan, "lifetime");
  assert.equal(h.sent[0].lang, "en");
  assert.equal(h.sent[0].maxDevices, 1);
});

test("dil ipucu: yalnız en/tr; bozuk değer Türkçe", () => {
  assert.equal(mailLangFrom({ lang: "en" }), "en");
  assert.equal(mailLangFrom({ lang: "tr" }), "tr");
  for (const v of [null, undefined, "en", 5, { lang: "EN" }, { lang: ["en"] }, { lang: "de" }, {}]) assert.equal(mailLangFrom(v), "tr");
});

test("aynı olay (event_id) yeniden gelirse ikinci lisans da ikinci e-posta da yok", async () => {
  const h = harness();
  await h.post(customerEvent());
  const ev = txn(OFFICE);
  const first = await h.post(ev);
  const second = await h.post(ev);
  assert.equal(first.status, 200);
  assert.deepEqual(second.body, { ok: true, duplicate: true });
  assert.equal(h.store.tables.sp_licenses.length, 1);
  assert.equal(h.sent.length, 1);
});

test("aynı işlem başka event_id ile gelirse (Paddle yeniden gönderimi) ikinci e-posta gitmez", async () => {
  const h = harness();
  await h.post(customerEvent());
  await h.post(txn(OFFICE, {}, "evt_a"));
  const again = await h.post(txn(OFFICE, {}, "evt_b"));
  assert.equal(again.status, 200);
  assert.equal(h.store.tables.sp_licenses.length, 1);
  assert.equal(h.sent.length, 1);
});

test("olay kaydı yazılamazsa 500 döner; Paddle yeniden dener ama lisans/e-posta çoğalmaz", async () => {
  const bad = fakeDb({ failEventInsert: true });
  const h = harness({ db: bad });
  await h.post(customerEvent("ctm_1", "alici@example.com", "evt_c1")).catch(() => {});
  bad.tables.sp_paddle_customers.push({ paddle_customer_id: "ctm_1", email: "alici@example.com" });
  const r1 = await h.post(txn(OFFICE));
  assert.equal(r1.status, 500);
  const r2 = await h.post(txn(OFFICE));
  assert.equal(r2.status, 500);
  assert.equal(bad.tables.sp_licenses.length, 1);
  assert.equal(h.sent.length, 1);
});

test("e-posta gönderimi başarısız: webhook yine 200, lisans durur, günlükte yalnız hata sınıfı (adres/kod yok)", async () => {
  const h = harness({ failMail: true });
  await h.post(customerEvent());
  const r = await h.post(txn(OFFICE));
  assert.equal(r.status, 200);
  assert.equal(h.store.tables.sp_licenses.length, 1);
  assert.equal(h.sent.length, 0);
  const text = JSON.stringify(h.logs);
  assert.match(text, /lisans e-postasi gonderilemedi/);
  assert.match(text, /ResendError/);
  assert.doesNotMatch(text, /alici@example\.com|APL-KEY|resend 500/);
  // yeniden denemede çift lisans/e-posta yok
  const again = await h.post(txn(OFFICE, {}, "evt_retry"));
  assert.equal(again.status, 200);
  assert.equal(h.store.tables.sp_licenses.length, 1);
});

test("alıcı e-postası henüz yoksa ya da e-posta ayarı yoksa: lisans üretilir, e-posta gitmez, uyarı günlüğe (kişisel veri yok)", async () => {
  const a = harness();
  await a.post(txn(OFFICE)); // müşteri kaydı henüz gelmedi
  assert.equal(a.store.tables.sp_licenses.length, 1);
  assert.equal(a.sent.length, 0);
  assert.match(JSON.stringify(a.logs), /alici e-postasi henuz yok/);

  const b = harness({ mailer: null });
  await b.post(customerEvent());
  const r = await b.post(txn(OFFICE));
  assert.equal(r.status, 200);
  assert.equal(b.store.tables.sp_licenses.length, 1);
  assert.match(JSON.stringify(b.logs), /e-posta ayari yok/);
  assert.doesNotMatch(JSON.stringify(b.logs), /alici@example\.com/);
});

test("SyncPass ödemesi e-posta göndermez (davranış değişmedi) ve 3 cihaz sınırı korunur", async () => {
  const h = harness();
  await h.post(customerEvent());
  await h.post(txn(SYNCPASS_LIFETIME, { custom_data: { app: "areapilot", lang: "en" } }));
  const lic = h.store.tables.sp_licenses[0];
  assert.equal(lic.product, "syncpass_desktop");
  assert.equal(lic.max_devices, 3);
  assert.equal(h.sent.length, 0);
});

test("adet 1'den büyükse tek lisans üretilir ve uyarı günlüğe düşer (kişisel veri yok)", async () => {
  const h = harness();
  await h.post(customerEvent());
  await h.post(txn(INDIVIDUAL, { items: [{ price: { id: INDIVIDUAL }, quantity: 3 }] }));
  assert.equal(h.store.tables.sp_licenses.length, 1);
  assert.equal(h.store.tables.sp_licenses[0].max_devices, 1);
  const warn = h.logs.find((l) => l[0] === "warn" && /adet 1'den buyuk/.test(String(l[1])));
  assert.ok(warn, "uyarı yazılmadı");
  assert.doesNotMatch(JSON.stringify(h.logs), /alici@example\.com|APL-KEY/);
  // adet 1: uyarı yok
  const h2 = harness();
  await h2.post(customerEvent());
  await h2.post(txn(INDIVIDUAL));
  assert.equal(h2.logs.length, 0);
});

test("bilinmeyen fiyat: lisans yok, e-posta yok, 200", async () => {
  const h = harness();
  await h.post(customerEvent());
  const r = await h.post(txn("pri_bilinmeyen000000000000000000"));
  assert.equal(r.status, 200);
  assert.equal(h.store.tables.sp_licenses.length, 0);
  assert.equal(h.sent.length, 0);
  assert.match(JSON.stringify(h.logs), /bilinmeyen fiyat/);
});

test("lisans yazılamazsa 500 (Paddle yeniden dener), e-posta gitmez", async () => {
  const h = harness({ db: fakeDb({ failLicenseInsert: true }) });
  await h.post(customerEvent());
  const r = await h.post(txn(OFFICE));
  assert.equal(r.status, 500);
  assert.equal(h.sent.length, 0);
  assert.equal(h.store.tables.sp_paddle_events.some((e) => e.event_id === "evt_t1"), false);
});

test("tam iade lisansı iade durumuna alır (mevcut davranış)", async () => {
  const h = harness();
  await h.post(customerEvent());
  await h.post(txn(OFFICE));
  await h.post({ event_id: "evt_adj", event_type: "adjustment.created", data: { action: "refund", status: "approved", type: "full", transaction_id: "txn_01aaaaaaaaaaaaaaaaaaaaaaaa" } });
  assert.equal(h.store.tables.sp_licenses[0].status, "refunded");
});
