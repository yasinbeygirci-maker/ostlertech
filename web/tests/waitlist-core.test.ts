// Bekleme/beta listesi isteği denetimi. Çalıştırma: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { checkWaitlistRequest, ipHash, WAITLIST_MIN_FILL_MS } from "../src/lib/waitlist-core.ts";

const now = 1_800_000_000_000;
const ok = { product: "areapilot", email: " Deniz@Example.com ", lang: "en", t: now - WAITLIST_MIN_FILL_MS - 1 };

test("geçerli istek: e-posta küçük harf ve kırpılmış, dil, isteğe bağlı AutoCAD sürümü", () => {
  assert.deepEqual(checkWaitlistRequest({ ...ok, autocad: "2021" }, now), { kind: "ok", product: "areapilot", email: "deniz@example.com", lang: "en", autocadVersion: "2021" });
  const r = checkWaitlistRequest({ ...ok, autocad: "2099" }, now);
  assert.ok(r.kind === "ok" && r.autocadVersion === null);
  const u = checkWaitlistRequest({ ...ok, autocad: "unknown", lang: "xx" }, now);
  assert.ok(u.kind === "ok" && u.autocadVersion === "unknown" && u.lang === "tr");
});

test("bot: bal küpü dolu, çok hızlı gönderim ya da zaman yok", () => {
  assert.equal(checkWaitlistRequest({ ...ok, website: "http://spam" }, now).kind, "bot");
  assert.equal(checkWaitlistRequest({ ...ok, t: now - 500 }, now).kind, "bot");
  assert.equal(checkWaitlistRequest({ ...ok, t: undefined }, now).kind, "bot");
  assert.equal(checkWaitlistRequest(null, now).kind, "bot");
});

test("geçersiz: bilinmeyen ürün, bozuk e-posta", () => {
  assert.deepEqual(checkWaitlistRequest({ ...ok, product: "syncpass" }, now), { kind: "invalid", field: "product" });
  for (const email of ["x", "a@b", "a b@c.com", "a@b.c", "<a@b.com>"]) {
    assert.deepEqual(checkWaitlistRequest({ ...ok, email }, now), { kind: "invalid", field: "email" }, email);
  }
});

test("IP saklanmaz: anahtarlı özet, aynı IP aynı özet, anahtar ya da IP yoksa null", () => {
  const a = ipHash("203.0.113.7", "gizli");
  assert.match(a!, /^[0-9a-f]{32}$/);
  assert.equal(a, ipHash("203.0.113.7", "gizli"));
  assert.notEqual(a, ipHash("203.0.113.7", "baska"));
  assert.ok(!a!.includes("203"));
  assert.equal(ipHash("", "gizli"), null);
  assert.equal(ipHash("203.0.113.7", ""), null);
});
