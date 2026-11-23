// K faktörü hesaplama sayfasının metni (TR + EN). Tek yerde durur: sayfa, hesap arayüzü ve çizim buradan okur.
// Kaynaksız malzeme tablosu ya da "malzemeye göre K" sayısı BİLEREK yok: K her malzeme/kalıp/büküm yöntemi için ölçülür.
import type { HataKodu, UyariKodu } from "./k-faktoru";

export type Lang = "tr" | "en";

export type Metin = {
  path: string;
  trPath: string;
  enPath: string;
  title: string;
  description: string;
  label: string;
  h1: string;
  lead: string;
  privacy: string;
  tabs: { find: string; unfold: string };
  common: { t: string; R: string; theta: string; unit: string; deg: string };
  find: {
    heading: string;
    intro: string;
    sample: string;
    cols: { L: string; L1: string; L2: string };
    add: string;
    remove: string;
    loadExample: string;
    clear: string;
    resultK: string;
    mean: string;
    meanNote: string;
    useMean: string;
    needValues: string;
  };
  unfold: {
    heading: string;
    intro: string;
    K: string;
    dims: string;
    dim: string;
    addDim: string;
    removeDim: string;
    useMeanHint: string;
    result: string;
    bends: (n: number) => string;
    sumOuter: string;
    flat: string;
    needValues: string;
    plan: { heading: string; intro: string; bend: string; tan1: string; tan2: string; sight: string; flange: string; drawAlt: string; sightNote: string; edge: string; tanShort: string; sightShort: string };
  };
  outputs: { BA: string; BD: string; OSSB: string; K: string };
  errors: Record<HataKodu, string>;
  warnings: Record<UyariKodu, string>;
  diagram: {
    heading: string;
    intro: string;
    alt: string;
    neutral: string;
    virtual: string;
    note: string;
  };
  abbr: { heading: string; rows: { k: string; v: string }[] };
  formulas: { heading: string; intro: string; rows: { name: string; expr: string; note?: string }[]; outro: string };
  what: { heading: string; paras: string[] };
  howto: { heading: string; steps: string[]; tip: string };
  maker: string;
};

const ortak = (en: boolean) => ({
  BA: en ? "Bend allowance (BA)" : "Büküm payı (BA)",
  BD: en ? "Bend deduction (BD)" : "Büküm azalması (BD)",
  OSSB: en ? "Outside setback (OSSB)" : "Dış sanal köşe uzaklığı (OSSB)",
  K: en ? "K-factor (K)" : "K faktörü (K)",
});

export const TR: Metin = {
  path: "/k-faktoru-hesaplama",
  trPath: "/k-faktoru-hesaplama",
  enPath: "/en/k-factor-calculator",
  title: "K Faktörü Hesaplama: Deneme Bükümünden K ve Açınım (mm)",
  description:
    "Ücretsiz K faktörü hesaplama: deneme bükümünden K faktörünü bul, K biliniyorsa sacın açınım boyunu, büküm payını (BA) ve büküm azalmasını (BD) hesapla. Çizimli, formüllü, mm cinsinden; veri gönderilmez.",
  label: "Ücretsiz araç",
  h1: "K faktörü hesaplama",
  lead:
    "Sac bükümünde K faktörünü kendi deneme parçandan bul, ya da K'yı biliyorsan düz kesim (açınım) boyunu hesapla. Tüm ölçüler milimetre. Hesap tarayıcında yapılır; girdiğin hiçbir değer bir yere gönderilmez.",
  privacy: "Sunucu yok, kayıt yok: değerlerin yalnızca bu sayfada, tarayıcında kalır.",
  tabs: { find: "1. Deneme bükümünden K bul", unfold: "2. K biliniyor: açınım hesapla" },
  common: { t: "Sac kalınlığı (t)", R: "İç büküm yarıçapı (R)", theta: "Büküm açısı (θ)", unit: "mm", deg: "°" },
  find: {
    heading: "Deneme bükümünden K faktörünü bul",
    intro:
      "Bir parça sacı bu kalınlıkta ve bu kalıpla bük. Bükmeden önce kesilen düz boyu (L), büktükten sonra her iki kenarı dıştan, sanal köşeye kadar ölç (L1 ve L2). Aynı işi birkaç numuneyle yaparsan ortalama K daha güvenilir olur.",
    sample: "Numune",
    cols: { L: "Kesilen düz boy (L)", L1: "Dış ölçü 1 (L1)", L2: "Dış ölçü 2 (L2)" },
    add: "Numune ekle",
    remove: "Sil",
    loadExample: "Örnek değerleri yükle",
    clear: "Temizle",
    resultK: "Bu numunenin K'sı",
    mean: "Ortalama K",
    meanNote: "geçerli numune",
    useMean: "Ortalama K ile açınım hesapla",
    needValues: "Sonuç için kalınlığı, yarıçapı ve en az bir numunenin üç ölçüsünü gir.",
  },
  unfold: {
    heading: "K biliniyorsa açınım (düz kesim) boyu",
    intro:
      "Parçanın dıştan, sanal köşeden sanal köşeye ölçülen kenarlarını sırayla gir. Her büküm için aynı kalınlık, yarıçap, K ve açı kullanılır.",
    K: "K faktörü (K)",
    dims: "Dış ölçüler",
    dim: "Kenar",
    addDim: "Kenar ekle",
    removeDim: "Sil",
    useMeanHint: "Birinci bölümde bulunan ortalama K bu alana aktarılabilir.",
    result: "Açınım boyu",
    bends: (n) => `${n} büküm`,
    sumOuter: "Dış ölçülerin toplamı",
    flat: "Açınım boyu (kesilecek düz boy)",
    needValues: "Sonuç için kalınlığı, yarıçapı, K'yı ve en az bir dış ölçüyü gir.",
    plan: {
      heading: "Açınım üzerinde büküm çizgileri",
      intro: "Konumlar açınımın sol kenarından (birinci dış ölçünün başından) mm cinsindendir. Flanş düz boyu: ilk ve son flanşta dış ölçü − OSSB, ortadaki flanşta dış ölçü − 2 · OSSB. İki teğet çizgisi arası BA kadardır.",
      bend: "Büküm",
      tan1: "1. teğet çizgisi",
      tan2: "2. teğet çizgisi",
      sight: "Görüş çizgisi",
      flange: "Flanş düz boyu",
      drawAlt: "Açınım şeridi: flanşlar, büküm bölgeleri, teğet çizgileri ve görüş çizgileri",
      sightNote: "Görüş çizgisi (sight line): abkantta sacı hizalamak için işaretlenir. Her bükümde, soldan ölçülen 1. teğet çizgisinden bükümün içine doğru bir iç yarıçap (R) kadar ilerideki çizgidir.",
      edge: "kenar",
      tanShort: "T",
      sightShort: "G",
    },
  },
  outputs: ortak(false),
  errors: {
    kalinlik: "Sac kalınlığı sıfırdan büyük olmalı.",
    yaricap: "İç yarıçap sıfır ya da daha büyük olmalı.",
    aci: "Büküm açısı 0° ile 180° arasında olmalı.",
    sayi: "Alanlardan biri sayı değil. Ondalık için virgül ya da nokta kullanabilirsin.",
    kenarlar: "L1 + L2, kesilen L boyundan büyük olmalı. Büktükten sonra dış ölçülerin toplamı düz boydan kısa çıkmaz; ölçümleri kontrol et.",
    payi: "Hesaplanan büküm payı sıfır ya da negatif çıktı. L, L1, L2, t ve R değerlerini kontrol et.",
    olcu: "Ölçüler sıfırdan büyük olmalı ve açınım boyu pozitif çıkmalı.",
    flans: "Bir dış ölçü, bükümün dışarıya kaçırdığı OSSB payından kısa kaldı (ortadaki kenarlar için 2 · OSSB). Flanş düz boyu sıfırın altına iner; ölçüyü büyüt ya da yarıçapı küçült.",
    bos: "En az bir dış ölçü gir.",
  },
  warnings: {
    "k-dusuk": "K sıfırın altında çıktı. Nötr eksen iç yüzeyin içine inemez: ölçümü kontrol et.",
    "k-yuksek": "K 0,5'in üstünde çıktı. Nötr eksen sacın ortasını geçemez: ölçümü kontrol et.",
    "acinim-buyuk": "Açınım boyu dış ölçülerin toplamından küçük olmalı (90° ve dar açılarda). Küçük çıkmadı: hesabı ya da ölçüyü kontrol et.",
  },
  diagram: {
    heading: "Ölçüler çizimde nerede?",
    intro: "Çizim 90° bir bükümü gösterir; aynı adlar başka açılarda da geçerlidir.",
    alt: "90 derece bükülmüş sacın kesiti: kalınlık t, iç yarıçap R, dış ölçüler L1 ve L2, sanal köşe, OSSB ve nötr eksen",
    neutral: "nötr eksen",
    virtual: "sanal köşe",
    note: "L1 ve L2 sacın dış yüzeyinden, sanal köşeye (iki dış yüzeyin uzantılarının kesiştiği nokta) kadar ölçülür.",
  },
  abbr: {
    heading: "Kısaltmalar",
    rows: [
      { k: "t", v: "Sac kalınlığı (mm)." },
      { k: "R", v: "İç büküm yarıçapı (mm): bükümün iç yüzündeki yay yarıçapı." },
      { k: "θ", v: "Büküm açısı: sacın dönme açısı (düz sac 0°, dik köşe 90°)." },
      { k: "L", v: "Bükmeden önce kesilen düz boy (mm)." },
      { k: "L1, L2", v: "Büktükten sonra dıştan, sanal köşeye kadar ölçülen iki kenar (mm)." },
      { k: "K", v: "K faktörü: nötr eksenin iç yüzeyden uzaklığının sac kalınlığına oranı (K·t = nötr eksenin iç yüzeyden uzaklığı)." },
      { k: "BA", v: "Büküm payı (bend allowance): nötr eksen boyunca ölçülen yay uzunluğu (mm)." },
      { k: "OSSB", v: "Dış sanal köşe uzaklığı (outside setback): sanal köşeden bükümün başladığı çizgiye olan uzaklık (mm)." },
      { k: "BD", v: "Büküm azalması (bend deduction): iki dış ölçünün toplamından düz boyu bulmak için çıkarılan miktar (mm)." },
      { k: "Teğet çizgisi", v: "Düz flanşın bükümle birleştiği çizgi. Her büküm açınımda iki teğet çizgisi arasında, BA genişliğinde bir şerittir." },
      { k: "Görüş çizgisi", v: "Abkantta sacı hizalamak için 1. teğet çizgisinden bükümün içine bir iç yarıçap (R) kadar ilerisine işaretlenen çizgi (sight line)." },
    ],
  },
  formulas: {
    heading: "Formüller",
    intro: "θ radyan olarak kullanılır (θ_rad = θ° · π / 180). Tüm uzunluklar mm.",
    rows: [
      { name: "Dış sanal köşe uzaklığı", expr: "OSSB = (R + t) · tan(θ / 2)" },
      { name: "Büküm azalması (denemeden)", expr: "BD = L1 + L2 − L", note: "Düz boy L = L1 + L2 − BD" },
      { name: "Büküm payı", expr: "BA = 2 · OSSB − BD" },
      { name: "K faktörü", expr: "K = (BA / θ_rad − R) / t" },
      { name: "K biliniyorsa büküm payı", expr: "BA = θ_rad · (R + K · t)" },
      { name: "K biliniyorsa büküm azalması", expr: "BD = 2 · OSSB − BA" },
      { name: "Açınım boyu (n kenar, n−1 büküm)", expr: "Açınım = Σ dış ölçü − (n − 1) · BD" },
      { name: "Flanş düz boyu", expr: "ilk/son: dış ölçü − OSSB   ·   ortadaki: dış ölçü − 2 · OSSB" },
      { name: "Teğet çizgileri (soldan)", expr: "T1 = ilk flanş,   T2 = T1 + BA,   sonraki büküm: önceki T2 + flanş" },
      { name: "Görüş çizgisi", expr: "G = T1 + R" },
    ],
    outro: "BA sıfırdan büyük değilse ya da L1 + L2, L'den büyük değilse hesap hata verir; K 0'ın altında ya da 0,5'in üstündeyse ölçümü kontrol etmen için uyarır.",
  },
  what: {
    heading: "K faktörü nedir?",
    paras: [
      "Sac bükülürken iç yüzü sıkışır, dış yüzü uzar. Boyu değişmeyen bir çizgi vardır: nötr eksen. K faktörü bu çizginin iç yüzeyden uzaklığının sac kalınlığına oranıdır; yani nötr eksen iç yüzeyden K·t kadar içeridedir.",
      "Nötr eksen sacın içinde kaldığı için K genellikle 0 ile 0,5 arasında çıkar. Değer malzemeye, kalınlığa, iç yarıçapa, kalıba ve büküm yöntemine göre değişir; bu yüzden güvenilir yol, kendi tezgâhında bir deneme bükümü yapıp K'yı ölçmektir.",
    ],
  },
  howto: {
    heading: "Deneme bükümü nasıl yapılır?",
    steps: [
      "Gerçek üretimde kullanacağın sacdan, aynı kalınlık, aynı kalıp ve aynı iç yarıçapla bir şerit kes. Düz boyunu (L) kumpasla ya da metreyle ölç ve not et.",
      "Şeridi tek yerden, hedef açıyla (çoğu zaman 90°) bük. Büküm çizgisini şeridin ortasında tut.",
      "Büktükten sonra iki kenarı dıştan, dış yüzeyin sanal köşesine kadar ölç (L1 ve L2). Köşe yuvarlak olduğu için sanal köşeyi iki dış yüzeyin doğrusal uzantılarının kesiştiği nokta olarak düşün; açıyı doğrulamak için gönye kullan.",
      "Değerleri yukarıdaki forma gir. Aynı işi iki ya da üç numuneyle tekrarla ve ortalama K'yı kullan; numuneler birbirinden belirgin ayrılıyorsa ölçümü gözden geçir.",
    ],
    tip: "İpucu: K, yalnızca denediğin malzeme, kalınlık, kalıp ve yarıçap kombinasyonu için geçerlidir. Biri değişirse yeni deneme büküm yap.",
  },
  maker:
    "Not: Rhino ve Grasshopper için sac, lazer ve CNC eklentisi MakerKit üzerinde çalışıyoruz; bu sayfadaki tanımlar orada da aynı.",
};

export const EN: Metin = {
  path: "/en/k-factor-calculator",
  trPath: "/k-faktoru-hesaplama",
  enPath: "/en/k-factor-calculator",
  title: "K-Factor Calculator: Find K from a Test Bend and Flat Length (mm)",
  description:
    "Free K-factor calculator for sheet metal: work out the K-factor from a test bend, or, if you know K, the flat pattern length, bend allowance (BA) and bend deduction (BD). With a diagram and formulas, in mm. Nothing is sent anywhere.",
  label: "Free tool",
  h1: "K-factor calculator",
  lead:
    "Find the K-factor of your own sheet metal from a test bend, or, if you already know K, calculate the flat (unfolded) length. All dimensions are in millimetres. The maths runs in your browser; nothing you type is sent anywhere.",
  privacy: "No server, no records: your values stay on this page, in your browser.",
  tabs: { find: "1. Find K from a test bend", unfold: "2. K known: flat length" },
  common: { t: "Material thickness (t)", R: "Inside bend radius (R)", theta: "Bend angle (θ)", unit: "mm", deg: "°" },
  find: {
    heading: "Find the K-factor from a test bend",
    intro:
      "Bend a test strip in the same material, thickness and tooling you will use. Note the flat length you cut (L). After bending, measure both legs on the outside, to the virtual sharp corner (L1 and L2). Repeating with a few samples gives a more reliable mean K.",
    sample: "Sample",
    cols: { L: "Cut flat length (L)", L1: "Outside leg 1 (L1)", L2: "Outside leg 2 (L2)" },
    add: "Add sample",
    remove: "Remove",
    loadExample: "Load example values",
    clear: "Clear",
    resultK: "K of this sample",
    mean: "Mean K",
    meanNote: "valid samples",
    useMean: "Use mean K for flat length",
    needValues: "Enter the thickness, radius and all three measurements of at least one sample to see a result.",
  },
  unfold: {
    heading: "Flat length when K is known",
    intro:
      "Enter the outside dimensions of the part in order, each measured from virtual sharp corner to virtual sharp corner. Every bend uses the same thickness, radius, K and angle.",
    K: "K-factor (K)",
    dims: "Outside dimensions",
    dim: "Leg",
    addDim: "Add leg",
    removeDim: "Remove",
    useMeanHint: "The mean K from the first section can be copied into this field.",
    result: "Flat length",
    bends: (n) => (n === 1 ? "1 bend" : `${n} bends`),
    sumOuter: "Sum of outside dimensions",
    flat: "Flat length (the length to cut)",
    needValues: "Enter the thickness, radius, K and at least one outside dimension to see a result.",
    plan: {
      heading: "Bend lines on the flat pattern",
      intro: "Positions are in mm from the left edge of the flat pattern (the start of the first outside dimension). Flange flat length: first and last flange = outside dimension − OSSB, middle flange = outside dimension − 2 · OSSB. The two tangent lines of a bend are BA apart.",
      bend: "Bend",
      tan1: "Tangent line 1",
      tan2: "Tangent line 2",
      sight: "Sight line",
      flange: "Flange flat length",
      drawAlt: "Flat pattern strip: flanges, bend zones, tangent lines and sight lines",
      sightNote: "Sight line: marked to line the sheet up in the press brake. For each bend it lies one inside radius (R) from tangent line 1 (measured from the left), toward the inside of the bend.",
      edge: "edge",
      tanShort: "T",
      sightShort: "S",
    },
  },
  outputs: ortak(true),
  errors: {
    kalinlik: "Thickness must be greater than zero.",
    yaricap: "Inside radius must be zero or more.",
    aci: "Bend angle must be between 0° and 180°.",
    sayi: "One of the fields is not a number. You can use a comma or a dot as the decimal mark.",
    kenarlar: "L1 + L2 must be larger than the cut length L. After bending, the outside legs always add up to more than the flat length; check your measurements.",
    payi: "The calculated bend allowance is zero or negative. Check L, L1, L2, t and R.",
    olcu: "Dimensions must be greater than zero and the flat length must come out positive.",
    flans: "An outside dimension is shorter than the OSSB the bend takes up (2 · OSSB for middle legs). The flange flat length would be zero or negative; lengthen the leg or reduce the radius.",
    bos: "Enter at least one outside dimension.",
  },
  warnings: {
    "k-dusuk": "K came out below zero. The neutral axis cannot lie inside the inner surface: check your measurements.",
    "k-yuksek": "K came out above 0.5. The neutral axis cannot pass the middle of the sheet: check your measurements.",
    "acinim-buyuk": "The flat length should be smaller than the sum of the outside dimensions (at 90° and below). It is not: check the calculation or the measurements.",
  },
  diagram: {
    heading: "Where the dimensions are",
    intro: "The drawing shows a 90° bend; the same names apply at other angles.",
    alt: "Cross-section of a 90 degree sheet metal bend: thickness t, inside radius R, outside legs L1 and L2, virtual sharp corner, OSSB and neutral axis",
    neutral: "neutral axis",
    virtual: "virtual sharp",
    note: "L1 and L2 are measured on the outside surface to the virtual sharp corner (where the extensions of the two outside surfaces meet).",
  },
  abbr: {
    heading: "Abbreviations",
    rows: [
      { k: "t", v: "Material thickness (mm)." },
      { k: "R", v: "Inside bend radius (mm): the arc radius on the inner face of the bend." },
      { k: "θ", v: "Bend angle: how far the sheet turns (flat sheet 0°, right angle 90°)." },
      { k: "L", v: "Flat length cut before bending (mm)." },
      { k: "L1, L2", v: "The two legs measured on the outside after bending, to the virtual sharp corner (mm)." },
      { k: "K", v: "K-factor: the distance of the neutral axis from the inner face, divided by the thickness (K·t = distance of the neutral axis from the inner face)." },
      { k: "BA", v: "Bend allowance: the arc length measured along the neutral axis (mm)." },
      { k: "OSSB", v: "Outside setback: the distance from the virtual sharp corner to where the bend begins (mm)." },
      { k: "BD", v: "Bend deduction: the amount subtracted from the sum of the two outside dimensions to get the flat length (mm)." },
      { k: "Tangent line", v: "The line where a straight flange meets the bend. On the flat pattern each bend is a strip BA wide between two tangent lines." },
      { k: "Sight line", v: "A line marked to line the sheet up in the press brake: one inside radius (R) from tangent line 1, toward the inside of the bend." },
    ],
  },
  formulas: {
    heading: "Formulas",
    intro: "θ is used in radians (θ_rad = θ° · π / 180). All lengths in mm.",
    rows: [
      { name: "Outside setback", expr: "OSSB = (R + t) · tan(θ / 2)" },
      { name: "Bend deduction (from the test)", expr: "BD = L1 + L2 − L", note: "Flat length L = L1 + L2 − BD" },
      { name: "Bend allowance", expr: "BA = 2 · OSSB − BD" },
      { name: "K-factor", expr: "K = (BA / θ_rad − R) / t" },
      { name: "Bend allowance when K is known", expr: "BA = θ_rad · (R + K · t)" },
      { name: "Bend deduction when K is known", expr: "BD = 2 · OSSB − BA" },
      { name: "Flat length (n legs, n−1 bends)", expr: "Flat = Σ outside dimensions − (n − 1) · BD" },
      { name: "Flange flat length", expr: "first/last: outside dimension − OSSB   ·   middle: outside dimension − 2 · OSSB" },
      { name: "Tangent lines (from the left)", expr: "T1 = first flange,   T2 = T1 + BA,   next bend: previous T2 + flange" },
      { name: "Sight line", expr: "S = T1 + R" },
    ],
    outro: "The calculator reports an error when BA is not positive or L1 + L2 is not larger than L, and warns you to check the measurements when K is below 0 or above 0.5.",
  },
  what: {
    heading: "What is the K-factor?",
    paras: [
      "When sheet metal is bent, the inside face is compressed and the outside face stretches. One line keeps its length: the neutral axis. The K-factor is the distance of that line from the inner face divided by the thickness, so the neutral axis sits K·t inside the inner surface.",
      "Because the neutral axis stays within the sheet, K usually falls between 0 and 0.5. It depends on the material, thickness, inside radius, tooling and bending method, so the dependable way is to make a test bend on your own machine and measure K.",
    ],
  },
  howto: {
    heading: "How to make a test bend",
    steps: [
      "Cut a strip from the sheet you will really use, with the same thickness, tooling and inside radius. Measure its flat length (L) with calipers or a tape and write it down.",
      "Bend the strip once to the target angle (often 90°). Keep the bend line in the middle of the strip.",
      "After bending, measure both legs on the outside to the virtual sharp corner (L1 and L2). The corner is rounded, so treat the virtual sharp as the point where the straight extensions of the two outside faces meet; check the angle with a square.",
      "Enter the values in the form above. Repeat with two or three samples and use the mean K; if the samples differ clearly, recheck your measurements.",
    ],
    tip: "Tip: K is valid only for the material, thickness, tooling and radius you tested. If any of these change, make a new test bend.",
  },
  maker:
    "Note: we are working on MakerKit, a sheet metal, laser and CNC plug-in for Rhino and Grasshopper; the definitions on this page are the same there.",
};
