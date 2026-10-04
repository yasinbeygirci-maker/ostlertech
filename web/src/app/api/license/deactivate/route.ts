import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { normalizeKey } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bilgisayar değiştirirken eski cihazın yeri boşaltılır (en fazla 3 bilgisayar).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const key = normalizeKey(body?.key);
  const deviceId = typeof body?.deviceId === "string" ? body.deviceId.toLowerCase() : null;
  if (!key || !deviceId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const db = supabaseAdmin();
  const { data: license } = await db.from("sp_licenses").select("id").eq("license_key", key).maybeSingle();
  if (!license) return NextResponse.json({ error: "invalid_key" }, { status: 404 });
  await db.from("sp_license_devices").delete().eq("license_id", license.id).eq("device_id", deviceId);
  return NextResponse.json({ ok: true });
}
