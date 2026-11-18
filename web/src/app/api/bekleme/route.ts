import { NextResponse } from "next/server";
import { AREAPILOT } from "@/lib/areapilot";
import { checkWaitlistRequest, waitlistSuccessBody, type WaitlistProduct } from "@/lib/waitlist-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// AreaPilot indirme bağlantıları. 2026-11-18: e-posta ve başka kişisel veri istenmez, hiçbir şey saklanmaz (veritabanı, günlük, IP özeti yok).
// Bağlantılar sayfa HTML'inde yer almaz, yalnız bu yanıtta döner. Koruma: bal küpü alanı + en kısa doldurma süresi (bot ayıklama).
// Eski site_waitlist tablosu ve işlevleri (supabase/*bekleme*.sql) bu rotadan çağrılmaz; eski kayıtların silinmesi ayrı iş (imha kaydıyla).

const DOWNLOADS: Record<WaitlistProduct, Record<string, string>> = {
  areapilot: AREAPILOT.downloads,
};

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const check = checkWaitlistRequest(body);
  // Bot: bağlantı yok, hata da yok.
  if (check.kind === "bot") return json({ ok: true });
  if (check.kind === "invalid") return json({ error: check.field }, 400);
  return json(waitlistSuccessBody(DOWNLOADS[check.product]));
}
