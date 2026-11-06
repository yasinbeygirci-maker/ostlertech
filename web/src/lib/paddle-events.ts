// Paddle bildirimlerinin işlenmesi (imza doğrulandıktan SONRA). Saf mantık: veritabanı, fiyat tablosu, anahtar üretici, e-posta ve günlük
// dışarıdan verilir; bu yüzden npm test sahte bağımlılıklarla çalıştırır (tests/paddle-events.test.ts). Route yalnız bağlantıyı kurar.
// KURALLAR: ürün/plan/cihaz sayısı yalnız sunucudaki fiyat tablosundan gelir (custom_data okunmaz, yalnız e-posta dili için
// custom_data.lang). Kişisel veri (e-posta, lisans kodu) hiçbir günlüğe yazılmaz.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PriceInfo } from "./paddle-tiers";

export type MailLang = "tr" | "en";

/** Satın alma sonrası lisans kodu e-postası. Başarısızlıkta fırlatır (çağıran yutar: kod /welcome sayfasında da görünür). */
export interface PurchaseMailer {
  sendPurchaseKey(to: string, key: string, lang: MailLang, maxDevices: number): Promise<void>;
}

interface Logger {
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
}

export interface PaddleEventDeps {
  db: SupabaseClient;
  priceInfo: (priceId: unknown) => PriceInfo | null;
  newKey: (product: PriceInfo["product"]) => string;
  /** null: e-posta ayarı yok (RESEND_API_KEY/MAIL_FROM). Lisans yine üretilir. */
  mailer: PurchaseMailer | null;
  /** Yanıttan sonra çalışacak iş (Next `after`). Yanıtı geciktirmez; hata yanıtı değiştirmez. */
  defer: (job: () => Promise<void>) => void;
  log?: Logger;
  now?: () => Date;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaddleEvent {
  event_id: string;
  event_type: string;
  data: Record<string, any>;
}

export interface HandlerResult {
  status: number;
  body: Record<string, unknown>;
}

const SUBSCRIPTION_STATUS: Record<string, "active" | "past_due" | "paused" | "canceled"> = {
  active: "active",
  trialing: "active",
  past_due: "past_due",
  paused: "paused",
  canceled: "canceled",
};

/** Ödeme sırasında seçilen dil (custom_data.lang, yalnız e-posta dili için; güvenlik kararı değil). Bilinmiyorsa Türkçe. */
export function mailLangFrom(customData: unknown): MailLang {
  const v = typeof customData === "object" && customData !== null ? (customData as Record<string, unknown>).lang : undefined;
  return v === "en" ? "en" : "tr";
}

export async function processPaddleEvent(event: PaddleEvent, deps: PaddleEventDeps): Promise<HandlerResult> {
  const log: Logger = deps.log ?? console;
  const db = deps.db;

  // Paddle aynı bildirimi yeniden gönderebilir; işlenmiş olanı atla (e-posta da ikinci kez gitmez).
  const seen = await db.from("sp_paddle_events").select("event_id").eq("event_id", event.event_id).maybeSingle();
  if (seen.data) return { status: 200, body: { ok: true, duplicate: true } };

  try {
    await handle(event, deps, log);
  } catch (e) {
    // Tam hata nesnesi yazılmaz (Supabase hataları satır içeriği, e-posta gibi kişisel veri taşıyabilir): yalnız kod.
    log.error("paddle webhook", event.event_type, event.event_id, (e as { code?: string } | null)?.code ?? "hata");
    // 5xx: Paddle bildirimi daha sonra yeniden dener.
    return { status: 500, body: { error: "processing_failed" } };
  }
  const logged = await db.from("sp_paddle_events").insert({ event_id: event.event_id, event_type: event.event_type });
  // 23505 = aynı bildirim eşzamanlı işlendi (zaten kayıtlı): sorun değil. Başka hata: 5xx, Paddle yeniden dener (işlem tekrar güvenlidir).
  if (logged.error && logged.error.code !== "23505") {
    log.error("paddle webhook olay kaydi", event.event_type, event.event_id, logged.error.code ?? "hata");
    return { status: 500, body: { error: "processing_failed" } };
  }
  return { status: 200, body: { ok: true } };
}

async function handle({ event_type, data }: PaddleEvent, deps: PaddleEventDeps, log: Logger) {
  const db = deps.db;
  const now = (deps.now?.() ?? new Date()).toISOString();

  if (event_type === "customer.created" || event_type === "customer.updated") {
    if (!data.email) return;
    await must(db.from("sp_paddle_customers").upsert({ paddle_customer_id: data.id, email: data.email, updated_at: now }));
    await must(db.from("sp_licenses").update({ email: data.email, updated_at: now }).eq("paddle_customer_id", data.id));
    // Adres işlemden sonra geldiyse: kodu henüz e-postalanmamış AreaPilot lisansları şimdi gönderilir (dil bilinmez: Türkçe).
    await claimAndSend(deps, log, { customerId: data.id }, "tr", now);
    return;
  }

  if (event_type === "transaction.completed") {
    // Ürün, plan ve cihaz sınırı yalnız sunucudaki fiyat kimliği tablosundan gelir (custom_data istemciden gelir, güvenilmez).
    const items: any[] = data.items ?? [];
    const info = items.map((i) => deps.priceInfo(i.price?.id)).find(Boolean);
    if (!info) {
      // Bilinmeyen fiyat: lisans üretilmez ama iş akışı bozulmaz (200 döner, Paddle yeniden denemez). Müşteri ödediyse
      // kod alamaz; bu satır günlükte aranır ve fiyat kimliği paddle-tiers.ts'e eklenir. Kişisel veri yazılmaz.
      log.error("paddle webhook: bilinmeyen fiyat kimligi, lisans uretilmedi", {
        transaction: data.id,
        prices: items.map((i) => i.price?.id).filter(Boolean),
      });
      return;
    }
    // Adet: ödeme çağrısı quantity 1 ile açılır ve Paddle'da fiyatın adet sınırı 1'dir. 1'den büyük bir adet görülürse (Burak O3)
    // lisans yine tek adet üretilir (cihaz sayısı fiyattan gelir); müşteri fazla ödemiş olabilir, bu yüzden günlüğe uyarı düşer.
    for (const i of items) {
      const q = Number(i.quantity);
      if (deps.priceInfo(i.price?.id) && Number.isFinite(q) && q > 1) {
        log.warn("paddle webhook: adet 1'den buyuk, tek lisans uretildi", { transaction: data.id, price: i.price?.id, quantity: q });
      }
    }
    const { plan, product, maxDevices } = info;
    const customer = await db.from("sp_paddle_customers").select("email").eq("paddle_customer_id", data.customer_id).maybeSingle();
    const email: string | null = (customer.data as { email?: string } | null)?.email ?? null;
    const periodEnd = data.billing_period?.ends_at ?? null;

    if (data.subscription_id) {
      const existing = await db.from("sp_licenses").select("id").eq("paddle_subscription_id", data.subscription_id).maybeSingle();
      if (existing.data) {
        // Yenileme ödemesi: dönem sonu ileri alınır.
        await must(db.from("sp_licenses").update({ status: "active", plan, current_period_end: periodEnd, updated_at: now }).eq("id", (existing.data as { id: string }).id));
        return;
      }
    } else {
      const existing = await db.from("sp_licenses").select("id").eq("paddle_transaction_id", data.id).maybeSingle();
      if (existing.data) return; // Aynı işlem daha önce işlendi: ikinci lisans da ikinci e-posta da yok.
    }
    const key = deps.newKey(product);
    await must(
      db.from("sp_licenses").insert({
        license_key: key,
        product,
        plan,
        max_devices: maxDevices,
        status: "active",
        email,
        paddle_customer_id: data.customer_id,
        paddle_transaction_id: data.id,
        paddle_subscription_id: data.subscription_id ?? null,
        current_period_end: plan === "lifetime" ? null : periodEnd,
      })
    );

    // Lisans kodu e-postası: yalnız AreaPilot (SyncPass e-postası ayrı iş). Yanıttan SONRA gönderilir; hata webhook yanıtını (200) ve
    // lisansı etkilemez, günlüğe yalnız hata sınıfı yazılır (adres ve kod yazılmaz). Kod her halde /welcome sayfasında da görünür.
    // Tek e-posta garantisi: gönderimden ÖNCE sp_licenses.key_email_sent_at atomik talep edilir (claimAndSend). Adres henüz yoksa
    // (müşteri bildirimi işlemden sonra gelebilir) önce bir kez daha okunur; yine yoksa e-posta, müşteri bildirimi gelince gider.
    if (product === "areapilot") {
      const lang = mailLangFrom(data.custom_data);
      let known = email;
      if (!known) {
        const again = await db.from("sp_paddle_customers").select("email").eq("paddle_customer_id", data.customer_id).maybeSingle();
        known = (again.data as { email?: string } | null)?.email ?? null;
        if (known) await must(db.from("sp_licenses").update({ email: known, updated_at: now }).eq("paddle_transaction_id", data.id));
      }
      if (known) await claimAndSend(deps, log, { transactionId: data.id }, lang, now);
      else log.warn("paddle webhook: alici e-postasi henuz yok, musteri bildirimi gelince gonderilecek", { transaction: data.id });
    }
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
    // Kısmi iade lisansı düşürmez (yalnız tam iade/itiraz).
    if (data.type !== "full") return;
    await must(db.from("sp_licenses").update({ status: "refunded", updated_at: now }).eq("paddle_transaction_id", data.transaction_id));
  }
}

/**
 * AreaPilot lisans kodu e-postası, TEK kez. Önce atomik talep: "key_email_sent_at is null" koşullu update, dönen satır sayısı kadar gönderilir;
 * eşzamanlı ya da yinelenen olaylar satır alamaz ve göndermez. Gönderim başarısızsa talep geri alınır (sonraki müşteri olayı yeniden dener;
 * döngü yok, her olay en çok bir deneme yapar). Hata webhook yanıtını bozmaz; günlüğe yalnız hata sınıfı (adres/kod yazılmaz).
 */
async function claimAndSend(
  deps: PaddleEventDeps,
  log: Logger,
  scope: { transactionId?: string; customerId?: string },
  lang: MailLang,
  now: string
) {
  const mailer = deps.mailer;
  if (!mailer) {
    log.warn("paddle webhook: e-posta ayari yok, lisans kodu e-postasi gonderilmedi", {});
    return;
  }
  let q = deps.db.from("sp_licenses").update({ key_email_sent_at: now }).eq("product", "areapilot").is("key_email_sent_at", null).not("email", "is", null);
  q = scope.transactionId ? q.eq("paddle_transaction_id", scope.transactionId) : q.eq("paddle_customer_id", scope.customerId as string);
  const claimed = await q.select("id, license_key, email, max_devices");
  if (claimed.error) {
    log.error("paddle webhook: e-posta talebi yazilamadi", { sinif: (claimed.error as { code?: string }).code ?? "hata" });
    return;
  }
  for (const row of (claimed.data ?? []) as { id: string; license_key: string; email: string; max_devices: number }[]) {
    deps.defer(async () => {
      try {
        await mailer.sendPurchaseKey(row.email, row.license_key, lang, row.max_devices);
      } catch (e) {
        log.error("paddle webhook: lisans e-postasi gonderilemedi", { sinif: (e as { name?: string } | null)?.name ?? "hata" });
        try {
          const back = await deps.db.from("sp_licenses").update({ key_email_sent_at: null }).eq("id", row.id);
          if (back.error) log.error("paddle webhook: e-posta talebi geri alinamadi", { sinif: (back.error as { code?: string }).code ?? "hata" });
        } catch (e2) {
          log.error("paddle webhook: e-posta talebi geri alinamadi", { sinif: (e2 as { name?: string } | null)?.name ?? "hata" });
        }
      }
    });
  }
}

async function must<T extends { error: unknown }>(query: PromiseLike<T>): Promise<T> {
  const result = await query;
  if (result.error) throw result.error;
  return result;
}
