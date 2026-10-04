import type { Environments } from "@paddle/paddle-js";

// Paddle ortamı ve istemci belirteci yalnızca ortam değişkenlerinden okunur. Biri eksikse sayfa açıkça
// hata verir: yanlış Paddle hesabına (canlı yerine deneme ya da tersi) sessizce bağlanmak istemiyoruz.
// İstemci belirteci tarayıcıya gider ve gizli değildir; sunucu API anahtarı bu dosyada ve istemci kodunda yer almaz.
export function paddleConfig(): { environment: Environments; token: string } {
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENV;
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
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
