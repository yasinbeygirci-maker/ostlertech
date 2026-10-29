// SyncSite (eski adı Projex): ad, adresler ve yayın öncesi bayraklar TEK YERDE.
// Kaynak metin: OstlerTech/hukuk/2026-10-29-syncsite-beta-kvkk.md (Zeynep) ve hukuk/projex-gizlilik-ve-aydinlatma.md.
// Sayfa adresleri uygulamaya gömülür (LegalLinks.PRIVACY_POLICY / ACCOUNT_DELETION) ve Play Veri güvenliği formuna girilir;
// yayından sonra DEĞİŞTİRME.
export const SYNCSITE = {
  name: "SyncSite",
  formerName: "Projex",
  privacyPath: "/syncsite/gizlilik",
  privacyEnPath: "/en/syncsite/privacy",
  deletePath: "/syncsite/hesap-silme",
  deleteEnPath: "/en/syncsite/delete-account",
  updatedTr: "29 Ekim 2026",
  updatedEn: "29 October 2026",
  // Hesap silme e-postayla istenirse silme süresi (iş günü). Yasin onaylar; değişirse iki sayfa birlikte değişir.
  deleteBusinessDays: 10,
} as const;

// YAYIN ÖNCESİ BAYRAKLAR: gerçek durum değişince true yapılır, metin kendiliğinden güncellenir.
// BREVO_BAGLI: Supabase Auth > SMTP'ye Brevo bağlandı ve hesap e-postaları onunla gidiyor (sozlesmeler.md satırı da doldurulmalı).
export const BREVO_BAGLI = true;
// TOMBSTONE_CANLI: supabase/migrations/006_tombstones.sql canlıya uygulandı (silinen kaydın fotoğrafı da buluttan silinir).
export const TOMBSTONE_CANLI = true;
