// Play bağlantısı kaynağa göre: Reels/DM'den gelen ziyaretçi (sayfa adresinde utm_source=instagram ya da k=ig) Instagram
// UTM'li, diğer herkes sayfanın kendi (organik) bağlantısını alır. Saf fonksiyon; PlayCta tarayıcıda çağırır, testler doğrudan.
// DM'den gelen adresteki utm_medium/utm_campaign/utm_content (güvenli karakterlerle) olduğu gibi Play'e geçer, böylece
// her otomasyonun kendi kampanyası kayıt altında kalır; adreste yoksa sayfanın varsayılanı (ig) kullanılır.

export const PLAY_BASE = "https://play.google.com/store/apps/details?id=com.ostlertech.syncpass&referrer=";

export type IgDefaults = { campaign?: string; content?: string };

const guvenli = (v: string | null): string | undefined => (v && /^[A-Za-z0-9._-]{1,60}$/.test(v) ? v : undefined);

export function instagramGeldi(search: string): boolean {
  const q = new URLSearchParams(search);
  return (q.get("utm_source") ?? "").toLowerCase() === "instagram" || (q.get("k") ?? "").toLowerCase() === "ig";
}

export function instagramReferrer(search: string, ig: IgDefaults = {}): string {
  const q = new URLSearchParams(search);
  const kaynak = (q.get("utm_source") ?? "").toLowerCase() === "instagram";
  const medium = (kaynak && guvenli(q.get("utm_medium"))) || "dm";
  const campaign = (kaynak && guvenli(q.get("utm_campaign"))) || ig.campaign;
  const content = (kaynak && guvenli(q.get("utm_content"))) || ig.content;
  const parts = ["utm_source=instagram", `utm_medium=${medium}`];
  if (campaign) parts.push(`utm_campaign=${campaign}`);
  if (content) parts.push(`utm_content=${content}`);
  return encodeURIComponent(parts.join("&"));
}

/** `organicHref`: sayfanın kendi (site UTM'li) Play bağlantısı. Instagram'dan gelmediyse aynen döner. */
export function playHrefFor(search: string, organicHref: string, ig?: IgDefaults): string {
  return instagramGeldi(search) ? PLAY_BASE + instagramReferrer(search, ig) : organicHref;
}

// "Telefonun çalınırsa" kampanyası (pazarlama belgesi B4): DM adresinde utm_* yoksa (?k=ig) bu varsayılan kullanılır.
export const IG_TELEFON_CALINIRSA: IgDefaults = { campaign: "2026-11-guvenlik", content: "reels-telefon-calinirsa" };
export const PLAY_TELEFON_CALINIRSA_INSTAGRAM = PLAY_BASE + instagramReferrer("?k=ig", IG_TELEFON_CALINIRSA);
export const playOrganikTelefon = (lang: "tr" | "en") =>
  PLAY_BASE + `utm_source%3Dostlertech.com%26utm_medium%3Dsite%26utm_campaign%3Dtelefon-calinirsa%26utm_content%3Dsayfa_${lang}`;
export const playHrefTelefon = (search: string, lang: "tr" | "en") =>
  playHrefFor(search, playOrganikTelefon(lang), IG_TELEFON_CALINIRSA);
