// Paddle-Signature denetimi (Burak D5): birden çok h1, eski bildirim, bozuk başlık.
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyPaddleSignature } from "../src/lib/paddle-imza.ts";

const secret = "test-gizli-anahtar";
const body = '{"event_type":"transaction.completed"}';
const ts = 1_800_000_000;
const now = ts * 1000 + 10_000;
const sig = (key: string) => createHmac("sha256", key).update(`${ts}:${body}`).digest("hex");

test("tek h1: doğru imza geçer, yanlış imza ve yanlış gövde geçmez", () => {
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig(secret)}`, body, secret, now), true);
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig("baska")}`, body, secret, now), false);
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig(secret)}`, body + " ", secret, now), false);
});

test("anahtar döndürmede birden çok h1: herhangi biri eşleşirse geçer (sıra önemsiz)", () => {
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig(secret)};h1=${sig("yeni")}`, body, secret, now), true);
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig("eski")};h1=${sig(secret)}`, body, secret, now), true);
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig("eski")};h1=${sig("yeni")}`, body, secret, now), false);
});

test("5 dakikadan eski ya da ileri zaman damgası reddedilir", () => {
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig(secret)}`, body, secret, ts * 1000 + 301_000), false);
  assert.equal(verifyPaddleSignature(`ts=${ts};h1=${sig(secret)}`, body, secret, ts * 1000 - 301_000), false);
});

test("bozuk başlıklar reddedilir", () => {
  for (const h of [null, "", "ts=;h1=", `h1=${sig(secret)}`, `ts=${ts}`, `ts=${ts};h1=zz`, `ts=${ts};h1=${sig(secret).slice(0, 10)}`, "garip"]) {
    assert.equal(verifyPaddleSignature(h, body, secret, now), false, String(h));
  }
});
