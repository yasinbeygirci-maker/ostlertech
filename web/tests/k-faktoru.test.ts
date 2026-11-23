// K faktörü hesabı: elle doğrulanmış örnek + gidiş-dönüş + hata/uyarı kuralları.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buk, duzBoy, kBul, acinim, sayiOku, ortalama, kUyarilari } from "../src/lib/k-faktoru.ts";

const yakin = (a: number, b: number, tol = 1e-9, ad = "") => assert.ok(Math.abs(a - b) <= tol, `${ad} ${a} != ${b}`);

test("elle hesap: t=2, R=2, θ=90°, K=0,4", () => {
  // BA = (π/2)(2 + 0,4·2) = (π/2)(2,8) = 4,39823; OSSB = 4·tan45° = 4; BD = 8 − 4,39823 = 3,60177
  const { BA, OSSB, BD } = buk(2, 0.4, 2, 90);
  yakin(BA, 4.398229715, 1e-8, "BA");
  yakin(OSSB, 4, 1e-12, "OSSB");
  yakin(BD, 3.601770285, 1e-8, "BD");
  // L1 = L2 = 50 -> L = 100 − 3,60177 = 96,39823
  yakin(duzBoy(50, 50, 2, 0.4, 2, 90), 96.398229715, 1e-8, "L");
  // Geri: K = (4,39823/(π/2) − 2)/2 = 0,4
  const r = kBul({ t: 2, R: 2, L: 96.39823, L1: 50, L2: 50, thetaDeg: 90 });
  assert.ok(r.ok);
  if (r.ok) {
    yakin(r.deger.K, 0.4, 1e-6, "K");
    yakin(r.deger.BA, 4.39823, 1e-5);
    assert.deepEqual(r.uyarilar, []);
  }
});

test("gidiş-dönüş: bilinen K ile L üretilir, kBul aynı K'yı bulur (t, R, θ, K taraması)", () => {
  let n = 0;
  for (const t of [0.5, 1, 1.5, 2, 3, 5, 8]) {
    for (const R of [0, 0.5, 1, 2, 4, 10]) {
      for (const th of [30, 60, 90, 120, 135, 150]) {
        for (const K of [0.2, 0.33, 0.4, 0.5]) {
          for (const [L1, L2] of [[50, 50], [120, 35.5], [18, 300]]) {
            const { BA, BD } = buk(R, K, t, th);
            if (BA <= 0 || BD <= 0) continue;
            const L = duzBoy(L1, L2, R, K, t, th);
            if (L <= 0) continue;
            const r = kBul({ t, R, L, L1, L2, thetaDeg: th });
            assert.ok(r.ok, `t=${t} R=${R} θ=${th} K=${K}`);
            if (r.ok) yakin(r.deger.K, K, 1e-9, `t=${t} R=${R} θ=${th}`);
            n++;
          }
        }
      }
    }
  }
  assert.ok(n > 500, `yeterli kombinasyon denendi (${n})`);
});

test("açınım: Σ dış ölçü − (n−1)·BD; tek büküm ve çok büküm", () => {
  // Elle: t=2, R=2, K=0,4, θ=90°: BD = 3,601770285. Dış ölçüler 30, 40, 30 (iki büküm): 100 − 2·3,601770285 = 92,79645943
  const r = acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [30, 40, 30] });
  assert.ok(r.ok);
  if (r.ok) {
    yakin(r.deger.acinim, 92.79645943, 1e-7);
    assert.equal(r.deger.bukumSayisi, 2);
    yakin(r.deger.BD, 3.601770285, 1e-8);
  }
  const tek = acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [50, 50] });
  assert.ok(tek.ok);
  if (tek.ok) yakin(tek.deger.acinim, 96.398229715, 1e-8);
  // Büküm yoksa (tek ölçü) açınım = ölçü
  const duz = acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [75] });
  assert.ok(duz.ok);
  if (duz.ok) yakin(duz.deger.acinim, 75, 1e-12);
});

test("açınım ile deneme aynı BD'yi kullanır (iki bölüm birbiriyle tutarlı)", () => {
  const t = 1.5, R = 1.5, th = 90, L1 = 40, L2 = 25, L = 61.2;
  const k = kBul({ t, R, L, L1, L2, thetaDeg: th });
  assert.ok(k.ok);
  if (!k.ok) return;
  const a = acinim({ t, R, K: k.deger.K, thetaDeg: th, dis: [L1, L2] });
  assert.ok(a.ok);
  if (a.ok) yakin(a.deger.acinim, L, 1e-9);
});

test("hata kuralları: L1+L2 <= L, BA <= 0, geçersiz girdiler", () => {
  assert.deepEqual(kBul({ t: 2, R: 2, L: 100, L1: 50, L2: 50, thetaDeg: 90 }), { ok: false, hata: "kenarlar" });
  assert.deepEqual(kBul({ t: 2, R: 2, L: 101, L1: 50, L2: 50, thetaDeg: 90 }), { ok: false, hata: "kenarlar" });
  // BA <= 0: büküm payı sıfırın altına düşer (BD, 2·OSSB'den büyük)
  assert.deepEqual(kBul({ t: 2, R: 2, L: 80, L1: 50, L2: 50, thetaDeg: 90 }), { ok: false, hata: "payi" });
  assert.deepEqual(kBul({ t: 0, R: 2, L: 90, L1: 50, L2: 50, thetaDeg: 90 }), { ok: false, hata: "kalinlik" });
  assert.deepEqual(kBul({ t: 2, R: -1, L: 90, L1: 50, L2: 50, thetaDeg: 90 }), { ok: false, hata: "yaricap" });
  assert.deepEqual(kBul({ t: 2, R: 2, L: 90, L1: 50, L2: 50, thetaDeg: 0 }), { ok: false, hata: "aci" });
  assert.deepEqual(kBul({ t: 2, R: 2, L: 90, L1: 50, L2: 50, thetaDeg: 180 }), { ok: false, hata: "aci" });
  assert.deepEqual(kBul({ t: NaN, R: 2, L: 90, L1: 50, L2: 50, thetaDeg: 90 }), { ok: false, hata: "sayi" });
  assert.deepEqual(acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [] }), { ok: false, hata: "bos" });
  assert.deepEqual(acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [10, -5] }), { ok: false, hata: "olcu" });
});

test("uyarı: K < 0 ya da K > 0,5 ölçümü kontrol ettirir, aralık içinde uyarı yok", () => {
  assert.deepEqual(kUyarilari(-0.01), ["k-dusuk"]);
  assert.deepEqual(kUyarilari(0.5001), ["k-yuksek"]);
  assert.deepEqual(kUyarilari(0), []);
  assert.deepEqual(kUyarilari(0.5), []);
  // Gerçek akış: BD biraz küçük ölçülünce K > 0,5 çıkar ve uyarı gelir
  const BDgercek = buk(2, 0.4, 2, 90).BD;
  const r = kBul({ t: 2, R: 2, L: 100 - (BDgercek - 1.2), L1: 50, L2: 50, thetaDeg: 90 });
  assert.ok(r.ok);
  if (r.ok) {
    assert.ok(r.deger.K > 0.5);
    assert.deepEqual(r.uyarilar, ["k-yuksek"]);
  }
});

test("sayiOku: virgül ve nokta, boş ve bozuk metin NaN", () => {
  assert.equal(sayiOku("2,5"), 2.5);
  assert.equal(sayiOku(" 2.5 "), 2.5);
  assert.equal(sayiOku("90"), 90);
  assert.ok(Number.isNaN(sayiOku("")));
  assert.ok(Number.isNaN(sayiOku("abc")));
  assert.ok(Number.isNaN(sayiOku("1,2,3")));
  yakin(ortalama([0.3, 0.4, 0.5]), 0.4, 1e-12);
});

test("teğet çizgileri ve flanş boyları: elle örnek t=2, R=2, K=0,4, 90°, dış ölçüler 30-40-30", () => {
  // OSSB = 4, BA = 4,398229715. Flanşlar: 30−4 = 26, 40−8 = 32, 30−4 = 26 (toplam 84 + 2·BA = 92,79645943 = açınım).
  const r = acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [30, 40, 30] });
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.deepEqual(r.deger.flans, [26, 32, 26]);
  const [b1, b2] = r.deger.bukumler;
  yakin(b1.bas, 26, 1e-12, "b1.bas");
  yakin(b1.bit, 30.398229715, 1e-8, "b1.bit");
  yakin(b2.bas, 62.398229715, 1e-8, "b2.bas");
  yakin(b2.bit, 66.79645943, 1e-7, "b2.bit");
  // Son teğet çizgisinden kenara kalan = son flanş
  yakin(r.deger.acinim - b2.bit, 26, 1e-7, "son flanş");
  // Tek büküm: 50 + 50 -> flanşlar 46 + 46
  const tek = acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [50, 50] });
  assert.ok(tek.ok);
  if (tek.ok) assert.deepEqual(tek.deger.flans, [46, 46]);
  // Dış ölçü OSSB'den kısaysa flanş yok: hata
  assert.deepEqual(acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [3, 40] }), { ok: false, hata: "flans" });
});

test("görüş çizgisi: birinci teğet çizgisinden bükümün içine R kadar", () => {
  const r = acinim({ t: 2, R: 2, K: 0.4, thetaDeg: 90, dis: [30, 40, 30] });
  assert.ok(r.ok);
  if (!r.ok) return;
  yakin(r.deger.bukumler[0].gorus, 28, 1e-12, "gorus1");            // 26 + R(2)
  yakin(r.deger.bukumler[1].gorus, 64.398229715, 1e-8, "gorus2");   // 62,398229715 + 2
  // R farklıysa konum R kadar kayar (t=1,5, R=6, K=0,33, 90°: OSSB = 7,5, BA = (π/2)(6+0,495) = 10,20...)
  const r2 = acinim({ t: 1.5, R: 6, K: 0.33, thetaDeg: 90, dis: [60, 60] });
  assert.ok(r2.ok);
  if (r2.ok) {
    yakin(r2.deger.bukumler[0].bas, 52.5, 1e-12);
    yakin(r2.deger.bukumler[0].gorus, 58.5, 1e-12);
  }
});

test("sağlama: 90° ve dar açıda açınım dış ölçülerin toplamından küçük; büyükse uyarı", () => {
  for (const th of [30, 60, 90]) {
    const r = acinim({ t: 2, R: 2, K: 0.4, thetaDeg: th, dis: [50, 50] });
    assert.ok(r.ok);
    if (r.ok) {
      assert.ok(r.deger.acinim < r.deger.toplamDis, `θ=${th}`);
      assert.ok(!r.uyarilar.includes("acinim-buyuk"));
    }
  }
  // Tutarsız girdi (K çok büyük: BD < 0) -> açınım toplamı aşar ve uyarı gelir
  const kotu = acinim({ t: 2, R: 0, K: 1.5, thetaDeg: 90, dis: [50, 50] });
  assert.ok(kotu.ok);
  if (kotu.ok) {
    assert.ok(kotu.deger.acinim >= kotu.deger.toplamDis);
    assert.ok(kotu.uyarilar.includes("acinim-buyuk"));
    assert.ok(kotu.uyarilar.includes("k-yuksek"));
  }
});

test("brief örneği: t=R=1,5, θ=90°, K=0,4, L1=30, L2=20 -> L=47,29867; ters hesap K=0,40", () => {
  yakin(duzBoy(30, 20, 1.5, 0.4, 1.5, 90), 47.29867, 1e-5, "L");
  const r = kBul({ t: 1.5, R: 1.5, L: 47.29867, L1: 30, L2: 20, thetaDeg: 90 });
  assert.ok(r.ok);
  if (r.ok) yakin(r.deger.K, 0.4, 1e-6, "K");
});
