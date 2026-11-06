import { after, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { supabaseLicenseStore } from "@/lib/server/license";
import { sendResetMail } from "@/lib/server/reset-mail";
import { parseResetRequest, processDeviceReset, RESET_REQUEST_RESPONSE } from "@/lib/license-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// "Cihazlarımı sıfırla": lisansın kayıtlı e-postasına 30 dk geçerli, tek kullanımlık bağlantı gönderir (saatte en çok 1).
// Yanıt HER ZAMAN aynıdır ({ok:true}): e-posta var mı, kod gerçek mi, sıklık sınırı dolu mu sızmaz.
// İş yanıttan sonra yapılır (süre farkı da sızdırmasın).
export async function POST(req: Request) {
  const parsed = parseResetRequest(await req.json().catch(() => null), "areapilot");
  if (!parsed.ok) return NextResponse.json(parsed.result.body, { status: parsed.result.status });
  const store = supabaseLicenseStore(supabaseAdmin());
  after(() => processDeviceReset("areapilot", parsed.key, parsed.lang, store, sendResetMail));
  return NextResponse.json(RESET_REQUEST_RESPONSE.body, { status: RESET_REQUEST_RESPONSE.status, headers: { "Cache-Control": "no-store" } });
}
