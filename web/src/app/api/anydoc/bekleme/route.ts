import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

  const { error } = await supabase
    .from("anydoc_waitlist")
    .insert({ email, kaynak: "landing" });

  if (error) {
    // Unique kısıt ihlali = zaten kayıtlı — kullanıcı dostu mesaj
    if (error.code === "23505") {
      return NextResponse.json({
        mesaj: "Bu e-posta zaten listede — erken erişim başlayınca haberin olacak.",
      });
    }
    console.error("[anydoc-bekleme] supabase hatası:", error.message);
    return NextResponse.json(
      { hata: "Kayıt şu anda alınamıyor — lütfen birazdan tekrar dene." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    mesaj: "Erken erişim başladığında ilk haber sen olacak — kurucu fiyatın güvende.",
  });
}
