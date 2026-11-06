import { NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { verifyPaddleSignature } from "@/lib/server/paddle-webhook";
import { infoForPrice, newLicenseKey } from "@/lib/server/license";
import { purchaseMailer } from "@/lib/server/reset-mail";
import { processPaddleEvent, type PaddleEvent } from "@/lib/paddle-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Paddle > Developer tools > Notifications'ta bu adrese giden bir hedef tanımlanır:
// transaction.completed, subscription.*, adjustment.*, customer.created, customer.updated.
// İşleme mantığı lib/paddle-events.ts içindedir (birim testli); burada yalnız imza denetimi ve bağlantılar vardır.
export async function POST(req: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 500 });

  const raw = await req.text();
  if (!verifyPaddleSignature(req.headers.get("paddle-signature"), raw, secret)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as PaddleEvent;
  const result = await processPaddleEvent(event, {
    db: supabaseAdmin(),
    priceInfo: infoForPrice,
    newKey: newLicenseKey,
    mailer: purchaseMailer(),
    defer: (job) => after(job),
  });
  return NextResponse.json(result.body, { status: result.status });
}
