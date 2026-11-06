import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { revealDecision } from "@/lib/license-reveal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ödeme sonrası teşekkür sayfası lisans kodunu buradan alır. Yalnızca son 48 saatte oluşan, etkin ve SIFIRLANMAMIŞ lisans döner
// (sıfırlanmış lisansın yeni kodu işlem numarasıyla alınamaz: Burak D1); işlem numarası tahmin edilemeyecek uzunlukta (txn_ + 26 karakter).
export async function GET(req: Request) {
  const txn = new URL(req.url).searchParams.get("txn") ?? "";
  if (!/^txn_[a-z0-9]{26}$/.test(txn)) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("sp_licenses")
    .select("id, license_key, plan, product, status, max_devices, created_at")
    .eq("paddle_transaction_id", txn)
    .maybeSingle();
  if (error) {
    // Veritabanı hatası "kayıt yok" gibi görünmez (sayfa yeniden dener); günlüğe yalnız kod.
    console.error("by-transaction", error.code ?? "hata");
    return NextResponse.json({ error: "server_error" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const resets = await db.from("sp_license_resets").select("id", { count: "exact", head: true }).eq("license_id", data.id);
  if (resets.error) {
    console.error("by-transaction sifirlama", resets.error.code ?? "hata");
    return NextResponse.json({ error: "server_error" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
  const decision = revealDecision({
    status: data.status,
    resetCount: resets.count ?? 0,
    createdAtMs: Date.parse(data.created_at),
    nowMs: Date.now(),
  });
  if (decision === "hide") return NextResponse.json({ error: "not_found" }, { status: 404, headers: { "Cache-Control": "no-store" } });

  return NextResponse.json(
    { key: data.license_key, plan: data.plan, product: data.product, maxDevices: data.max_devices },
    { headers: { "Cache-Control": "no-store" } }
  );
}
