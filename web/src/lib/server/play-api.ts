import "server-only";
import { ExternalAccountClient } from "google-auth-library";
import { getVercelOidcToken } from "@vercel/oidc";
import { createHttpVerifier, PLAY_TIMEOUT_MS, type FetchLike, type PlayVerifier } from "@/lib/play-core";

// Google Play Developer API erişimi: ANAHTAR DOSYASI YOK (Burak Ş1/Soru 1). Vercel OIDC belirteci Google STS'te kısa ömürlü erişim
// belirtecine çevrilir (Workload Identity Federation); sunucuda saklanacak uzun ömürlü sır yoktur. Ortam değişkenleri (hiçbiri sır değil):
// GCP_PROJECT_NUMBER, GCP_SERVICE_ACCOUNT_EMAIL, GCP_WORKLOAD_IDENTITY_POOL_ID, GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID.
// Federasyon yalnız Production ortamı öznesine bağlıdır (Yasin adımı §9/6-7): Preview/Development dağıtımları buraya ulaşamaz.
// GERÇEK GOOGLE'A BU DOSYA HİÇ DENENMEDİ: Yasin kurulumu bitince Ş20 sağlık ucuyla ilk canlı doğrulama yapılır.

const SCOPE = "https://www.googleapis.com/auth/androidpublisher";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} tanimli degil`);
  return v;
}

let cached: PlayVerifier | null = null;

/** Yapılandırma eksikse çağrı sırasında "auth" hatası olur (claim 503 not_configured döner); modül yüklemesi asla fırlatmaz. */
export function googlePlayVerifier(): PlayVerifier {
  if (cached) return cached;
  let client: ReturnType<typeof ExternalAccountClient.fromJSON> | null = null;
  const accessToken = async (): Promise<string> => {
    if (!client) {
      const audience = `//iam.googleapis.com/projects/${env("GCP_PROJECT_NUMBER")}/locations/global/workloadIdentityPools/${env("GCP_WORKLOAD_IDENTITY_POOL_ID")}/providers/${env("GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID")}`;
      client = ExternalAccountClient.fromJSON({
        type: "external_account",
        audience,
        subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
        token_url: "https://sts.googleapis.com/v1/token",
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${env("GCP_SERVICE_ACCOUNT_EMAIL")}:generateAccessToken`,
        subject_token_supplier: { getSubjectToken: () => getVercelOidcToken() },
        scopes: [SCOPE],
      });
      if (!client) throw new Error("federasyon istemcisi kurulamadi");
    }
    const { token } = await client.getAccessToken();
    if (!token) throw new Error("erisim belirteci yok");
    return token;
  };
  const doFetch: FetchLike = async (url, init) => {
    const res = await fetch(url, { method: init.method, headers: init.headers, signal: init.signal, cache: "no-store" });
    return { status: res.status, json: () => res.json() as Promise<unknown> };
  };
  cached = createHttpVerifier({ fetch: doFetch, accessToken, timeoutMs: PLAY_TIMEOUT_MS });
  return cached;
}
