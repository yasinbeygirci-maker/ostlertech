import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { verifyPaddleSignature } from "@/lib/server/paddle-webhook";
import { newLicenseKey, planForPrice } from "@/lib/server/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Paddle > Developer tools > Notifications'ta bu adrese giden bir hedef tanımlanır:
// transaction.completed, subscription.*, adjustment.*, customer.created, customer.updated.
/* eslint-disable @typescript-eslint/no-explicit-any */
interface PaddleEvent {
  event_id: string;
  event_type: string;
  data: Record<string, any>;
}

export async function POST(req: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 500 });

  const raw = await req.text();
  if (!verifyPaddleSignature(req.headers.get("paddle-signature"), raw, secret)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as PaddleEvent;
  const db = supabaseAdmin();

  // Paddle aynı bildirimi yeniden gönderebilir; işlenmiş olanı atla.
  const seen = await db.from("sp_paddle_events").select("event_id").eq("event_id", event.event_id).maybeSingle();
  if (seen.data) return NextResponse.json({ ok: true, duplicate: true });

  try {
    await handle(event);
  } catch (e) {
    console.error("paddle webhook", event.event_type, event.event_id, e);
    // 5xx: Paddle bildirimi daha sonra yeniden dener.
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
  await db.from("sp_paddle_events").insert({ event_id: event.event_id, event_type: event.event_type });
  return NextResponse.json({ ok: true });
}

const SUBSCRIPTION_STATUS: Record<string, "active" | "past_due" | "paused" | "canceled"> = {
  active: "active",
  trialing: "active",
  past_due: "past_due",
  paused: "paused",
  canceled: "canceled",
};

async function handle({ event_type, data }: PaddleEvent) {
  const db = supabaseAdmin();
  const now = new Date().toISOString();

  if (event_type === "customer.created" || event_type === "customer.updated") {
    if (!data.email) return;
    await must(db.from("sp_paddle_customers").upsert({ paddle_customer_id: data.id, email: data.email, updated_at: now }));
    await must(db.from("sp_licenses").update({ email: data.email, updated_at: now }).eq("paddle_customer_id", data.id));
    return;
  }

  if (event_type === "transaction.completed") {
    const plan = (data.items ?? []).map((i: any) => planForPrice(i.price?.id)).find(Boolean);
    if (!plan) return; // başka bir ürünün satışı
    const customer = await db.from("sp_paddle_customers").select("email").eq("paddle_customer_id", data.customer_id).maybeSingle();
    const email = customer.data?.email ?? null;
    const periodEnd = data.billing_period?.ends_at ?? null;

    if (data.subscription_id) {
      const existing = await db.from("sp_licenses").select("id").eq("paddle_subscription_id", data.subscription_id).maybeSingle();
      if (existing.data) {
        // Yenileme ödemesi: dönem sonu ileri alınır.
        await must(db.from("sp_licenses").update({ status: "active", plan, current_period_end: periodEnd, updated_at: now }).eq("id", existing.data.id));
        return;
      }
    } else {
      const existing = await db.from("sp_licenses").select("id").eq("paddle_transaction_id", data.id).maybeSingle();
      if (existing.data) return;
    }
    await must(
      db.from("sp_licenses").insert({
        license_key: newLicenseKey(),
        plan,
        status: "active",
        email,
        paddle_customer_id: data.customer_id,
        paddle_transaction_id: data.id,
        paddle_subscription_id: data.subscription_id ?? null,
        current_period_end: plan === "lifetime" ? null : periodEnd,
      })
    );
    return;
  }

  if (event_type.startsWith("subscription.")) {
    const status = SUBSCRIPTION_STATUS[data.status];
    if (!status) return;
    const update: Record<string, unknown> = { status, updated_at: now };
    if (data.current_billing_period?.ends_at) update.current_period_end = data.current_billing_period.ends_at;
    // İptal yürürlüğe girdiğinde Paddle dönem bilgisini boşaltır; lisans o anda biter.
    if (status === "canceled") update.current_period_end = data.canceled_at ?? now;
    await must(db.from("sp_licenses").update(update).eq("paddle_subscription_id", data.id));
    return;
  }

  if (event_type === "adjustment.created" || event_type === "adjustment.updated") {
    if (data.action !== "refund" && data.action !== "chargeback") return;
    if (data.status !== "approved") return;
    await must(db.from("sp_licenses").update({ status: "refunded", updated_at: now }).eq("paddle_transaction_id", data.transaction_id));
  }
}

async function must<T extends { error: unknown }>(query: PromiseLike<T>): Promise<T> {
  const result = await query;
  if (result.error) throw result.error;
  return result;
}
