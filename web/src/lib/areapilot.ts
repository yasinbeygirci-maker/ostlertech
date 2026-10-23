// AreaPilot (AutoCAD eklentisi) açık beta: ad, sürüm ve indirme bağlantıları TEK YERDE.
// HER YENİ PAKETTE: version + packageDate burada, public/areapilot/surum.json'da "surum" aynı değer; GitHub sürümüne
// dosyalar SABİT adlarla yüklenir (aşağıdaki asset adları), böylece "latest/download" bağlantısı değişmez.
// Kaynak: D:\Development\SpaceCalc (DEGISIKLIKLER.md, paket/rehber.html), 0.9.7 paketi 2026-10-23.

const RELEASES = "https://github.com/yasinbeygirci-maker/areapilot-releases/releases";

export const AREAPILOT = {
  name: "AreaPilot",
  path: "/areapilot",
  enPath: "/en/areapilot",
  version: "0.9.7",
  /** Deneme süresi kurulumdan itibaren bu kadar gün; paket tarihinden en çok 90 gün (DEGISIKLIKLER 0.9.6). */
  trialDays: 30,
  /** Bu paketin çalışacağı son gün: paketle.ps1 $sonSinir = paket günü (2026-10-23) + 90 - 1. Yeni pakette değişir. */
  trialHardEndTr: "20 Ocak 2027",
  trialHardEndEn: "20 January 2027",
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
  feedbackEmail: "yasin@ostlertech.com",
  /** Aydınlatma metni ve uygulama gizliliği aynı sayfanın altında (hukuk/2026-10-23-areapilot-beta-gizlilik.md §3, §5). */
  privacyHref: "#aydinlatma",
  privacyHrefEn: "#privacy",
} as const;
