import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { entitlementUntil, normalizeKey, signToken, type LicenseRow } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Masaüstü uygulaması lisansı ilk girişte ve sonra düzenli olarak buradan yeniler.
// Gelen tek bilgi: lisans kodu, uygulamanın ürettiği rastgele cihaz numarası ve sürüm. Kasa içeriği hiç gelmez.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const key = normalizeKey(body?.key);
  const deviceId = typeof body?.deviceId === "string" && /^[0-9a-f-]{36}$/i.test(body.deviceId) ? body.deviceId.toLowerCase() : null;
  const appVersion = typeof body?.appVersion === "string" ? body.appVersion.slice(0, 32) : null;
  if (!key || !deviceId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const db = supabaseAdmin();
  const { data: license } = await db
    .from("sp_licenses")
    .select("id, license_key, plan, status, current_period_end, max_devices")
    .eq("license_key", key)
    .maybeSingle<LicenseRow>();
  if (!license) return NextResponse.json({ error: "invalid_key" }, { status: 404 });

  const until = entitlementUntil(license);
  if (!until) return NextResponse.json({ error: "inactive", status: license.status }, { status: 403 });

  const { data: devices } = await db.from("sp_license_devices").select("device_id").eq("license_id", license.id);
  const known = devices?.some((d) => d.device_id === deviceId);
  if (!known && (devices?.length ?? 0) >= license.max_devices) {
    return NextResponse.json({ error: "device_limit", maxDevices: license.max_devices }, { status: 409 });
  }
  const { error } = await db
    .from("sp_license_devices")
    .upsert(
      { license_id: license.id, device_id: deviceId, app_version: appVersion, last_seen: new Date().toISOString() },
      { onConflict: "license_id,device_id" }
    );
  if (error) return NextResponse.json({ error: "server_error" }, { status: 500 });

  const token = signToken({ lid: license.id, plan: license.plan, dev: deviceId, exp: until });
  return NextResponse.json({ token, plan: license.plan, expiresAt: until });
}
