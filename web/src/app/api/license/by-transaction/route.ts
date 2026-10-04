import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ödeme sonrası teşekkür sayfası lisans kodunu buradan alır. Yalnızca son 48 saatte oluşan lisans döner;
// işlem numarası tahmin edilemeyecek uzunlukta (txn_ + 26 karakter).
export async function GET(req: Request) {
  const txn = new URL(req.url).searchParams.get("txn") ?? "";
  if (!/^txn_[a-z0-9]{26}$/.test(txn)) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data } = await supabaseAdmin()
    .from("sp_licenses")
    .select("license_key, plan")
    .eq("paddle_transaction_id", txn)
    .gte("created_at", since)
    .maybeSingle();
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ key: data.license_key, plan: data.plan }, { headers: { "Cache-Control": "no-store" } });
}
