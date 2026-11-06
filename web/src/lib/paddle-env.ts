import type { Environments } from "@paddle/paddle-js";

// Paddle ortamı ve istemci belirteci yalnızca ortam değişkenlerinden okunur. Biri eksikse sayfa açıkça
// hata verir: yanlış Paddle hesabına (canlı yerine deneme ya da tersi) sessizce bağlanmak istemiyoruz.
// İstemci belirteci tarayıcıya gider ve gizli değildir; sunucu API anahtarı bu dosyada ve istemci kodunda yer almaz.
export function paddleConfig(env: Record<string, string | undefined> = process.env): { environment: Environments; token: string } {
  const environment = env.NEXT_PUBLIC_PADDLE_ENV;
  const token = env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (environment !== "production" && environment !== "sandbox") {
    throw new Error(`NEXT_PUBLIC_PADDLE_ENV "production" ya da "sandbox" olmalı (şu an: ${environment ?? "tanımsız"})`);
  }
  if (!token) throw new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN tanımsız");
  const expectedPrefix = environment === "production" ? "live_" : "test_";
  if (!token.startsWith(expectedPrefix)) {
    throw new Error(`NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ${expectedPrefix} ile başlamalı (${environment} ortamı)`);
  }
  return { environment, token };
}

// Satış anahtarı: yalnızca sunucu ortam değişkeni PADDLE_SALES_OPEN=1 iken /satin-al ve /en/pricing ödeme düğmelerini gösterir.
// Kapalıyken (varsayılan) yalnızca bilgi amaçlı PlansPreview görünür. Anahtar istek anında okunur; yeniden derleme gerekmez.
export function salesOpen(): boolean {
  return process.env.PADDLE_SALES_OPEN === "1";
}

// Ürün başına satış anahtarı. SyncPass: PADDLE_SALES_OPEN (yukarıdaki salesOpen). AreaPilot: PADDLE_SALES_OPEN_AREAPILOT=1.
// Kapalıyken (varsayılan) AreaPilot satış sayfası/ödeme düğmesi açılmaz. Webhook bu bayraktan ETKİLENMEZ: ödenmiş işlem her zaman işlenir.
// AreaPilot ayrıca fiyat kimlikleri sunucu eşlemesinde tanımlı olmalıdır (areapilotPricesReady, paddle-tiers.ts): eşleme boşken
// satış açılırsa müşteri öder ama webhook lisans üretmez. Bu bilgi verilmezse (varsayılan) AreaPilot satışı KAPALI kalır.
export function salesOpenFor(
  product: "syncpass_desktop" | "areapilot",
  opts: { env?: Record<string, string | undefined>; areapilotPricesReady?: boolean } = {}
): boolean {
  const env = opts.env ?? process.env;
  return product === "areapilot" ? env.PADDLE_SALES_OPEN_AREAPILOT === "1" && opts.areapilotPricesReady === true : env.PADDLE_SALES_OPEN === "1";
}
