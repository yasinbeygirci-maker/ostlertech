import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

// Basit bellek-içi hız sınırı: aynı IP'den 60 sn'de en fazla 5 istek.
// (Vercel'in sunucusuz ortamında instance başına çalışır; ek katman olarak
// Supabase unique kısıtı zaten mükerrer kaydı engeller.)
const SON_ISTEKLER = new Map<string, number[]>();
const PENCERE_MS = 60_000;
const PENCERE_LIMIT = 5;

function hizSiniriAsildi(ip: string): boolean {
  const simdi = Date.now();
  const liste = (SON_ISTEKLER.get(ip) || []).filter((t) => simdi - t < PENCERE_MS);
  if (liste.length >= PENCERE_LIMIT) {
    SON_ISTEKLER.set(ip, liste);
    return true;
  }
  liste.push(simdi);
  SON_ISTEKLER.set(ip, liste);
  return false;
}

const EPOSTA_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const KONTENJAN = 100;

// GET: kalan kurucu kontenjanı (RPC yoksa kalan:null — arayüz göstergesini gizler)
export async function GET() {
  try {
    const { data, error } = await getSupabase().rpc("anydoc_kalan_kontenjan");
    if (error) throw error;
    const kalan = Number(data);
    if (!Number.isFinite(kalan)) throw new Error("geçersiz rpc yanıtı");
    return NextResponse.json(
      { kalan, kontenjan: KONTENJAN, dolu: Math.max(0, KONTENJAN - kalan) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { kalan: null, kontenjan: KONTENJAN },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}

async function siraGetir(email: string): Promise<number | null> {
  try {
    const { data, error } = await getSupabase()
      .rpc("anydoc_sira_numarasi", { p_email: email });
    if (error) throw error;
    const sira = Number(data);
    return Number.isFinite(sira) && sira > 0 ? sira : null;
  } catch {
    return null; // fonksiyon henüz kurulmadıysa sessizce boş
  }
}

export async function POST(istek: Request) {
  let govde: { email?: string; website?: string };
  try {
    govde = await istek.json();
  } catch {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  // Honeypot dolduysa: bot — sessizce "başarılı" yanıtı ver (bot bilmesin)
  if (govde.website) {
    return NextResponse.json({ mesaj: "Listedesin!" });
  }

  const email = (govde.email || "").trim().toLowerCase();

  if (!EPOSTA_RE.test(email)) {
    return NextResponse.json({ hata: "Geçerli bir e-posta adresi gir." }, { status: 400 });
  }

  const ip =
    istek.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    istek.headers.get("x-real-ip") ||
    "bilinmeyen";

  if (hizSiniriAsildi(ip)) {
    return NextResponse.json(
      { hata: "Çok fazla deneme — bir dakika sonra tekrar dene." },
      { status: 429 },
    );
  }

  const { error } = await getSupabase()
    .from("anydoc_waitlist")
    .insert({ email, kaynak: "landing" });  if (error) {
    // Unique kısıt ihlali = zaten kayıtlı — kullanıcı dostu mesaj + sıra bilgisi
    if (error.code === "23505") {
      const sira = await siraGetir(email);
      const kurucu = sira !== null && sira <= KONTENJAN;
      return NextResponse.json({
        mesaj: kurucu
          ? `Bu e-posta zaten listede — ${sira}. sıradasin, kurucu fiyatın güvende.`
          : "Bu e-posta zaten listede — erken erişim başlayınca haberin olacak.",
        sira,
        kurucu,
      });
    }
    console.error("[anydoc-bekleme] supabase hatası:", error.message);
    return NextResponse.json(
      { hata: "Kayıt şu anda alınamıyor — lütfen birazdan tekrar dene." },
      { status: 500 },
    );
  }

  // Kayıt başarılı — sıra numarasını sor (RPC yoksa null, mesaj genel kalır)
  const sira = await siraGetir(email);
  const kurucu = sira !== null && sira <= KONTENJAN;

  return NextResponse.json({
    mesaj: kurucu
      ? `İlk 100'desin (${sira}. sıra) — ömür boyu %50 kurucu fiyatın güvende.`
      : "Erken erişim başladığında ilk haber sen olacak — kurucu fiyatın güvende.",
    sira,
    kurucu,
  });
}
