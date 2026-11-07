// AreaPilot (AutoCAD eklentisi) 1.x: ad, sürüm ve indirme bağlantıları TEK YERDE.
// HER YENİ PAKETTE: version + packageDate burada, public/areapilot/surum.json'da "surum" aynı değer; GitHub sürümüne
// dosyalar SABİT adlarla yüklenir (aşağıdaki asset adları), böylece "latest/download" bağlantısı değişmez.
// Kaynak: D:\Development\SpaceCalc (DEGISIKLIKLER.md, paket/rehber.html), 1.0.0 paketi 2026-11-07 (önceki dağıtılan: 0.9.26, açık beta sona erdi).

const RELEASES = "https://github.com/yasinbeygirci-maker/areapilot-releases/releases";

export const AREAPILOT = {
  name: "AreaPilot",
  path: "/areapilot",
  enPath: "/en/areapilot",
  version: "1.0.0",
  /** Deneme süresi ilk açılıştan itibaren bu kadar gün (istemci: Product.TrialDays varsayılanı 7, paketle.ps1 -Gun 7). Paket tarihine bağlı son gün YOK (TrialMaxDays 0). */
  trialDays: 7,
  /** Deneme/lisans yokken ücretsiz modda her çalıştırmada işlenen en çok alan (istemci: FreeMode.Limit). */
  freeLimit: 15,
  /** Kurulum dosyasının SHA-256 karması (D:Tempareapilot-1.0-sonkurulumSHA256.txt, imzasız paket, 2026-11-07). Yeni pakette değişir. */
  releaseDateTr: "07.11.2026",
  releaseDateEn: "2026-11-07",
  installerSha256: "3719B18C0D7E8B91D8B0029B0C4BD75C41FA93396B286E2861BFCA98A2AE3602",
  releasesUrl: RELEASES,
  /** Sayfa HTML'inde yer almaz; yalnız e-posta bırakılınca sunucu yanıtında döner (lib/server). */
  downloads: {
    installer: `${RELEASES}/latest/download/AreaPilot-Kurulum.exe`,
    guideTr: `${RELEASES}/latest/download/AreaPilot-Rehber.pdf`,
    guideEn: `${RELEASES}/latest/download/AreaPilot-Guide.pdf`,
  },
  requirementsTr: "Windows 10 ya da 11 (64 bit) ve AutoCAD 2013–2027 (64 bit). AutoCAD LT desteklenmez.",
  requirementsEn: "Windows 10 or 11 (64-bit) and AutoCAD 2013–2027 (64-bit). AutoCAD LT is not supported.",
  /** Rehberdeki geri bildirim adresi (Deniz/rehber.html). */
  feedbackEmail: "destek@ostlertech.com",
  /** Aydınlatma metni ve uygulama gizliliği aynı sayfanın altında (hukuk/2026-10-23-areapilot-beta-gizlilik.md §3, §5; 1.0 için aynı yapı). */
  privacyHref: "#aydinlatma",
  privacyHrefEn: "#privacy",
} as const;
