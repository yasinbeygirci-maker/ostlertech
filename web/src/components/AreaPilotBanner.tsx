import { AREAPILOT } from "@/lib/areapilot";

// Ana sayfada Hero altında: AreaPilot (AutoCAD eklentisi, açık beta) için kısa duyuru şeridi.
export default function AreaPilotBanner() {
  return (
    <section aria-label="AreaPilot" className="px-6 pb-4">
      <div className="max-w-5xl mx-auto rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-card px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Yeni · Açık beta</p>
          <h2 className="text-lg md:text-xl font-bold text-white">AreaPilot: AutoCAD'de alan ve çevre metrajı</h2>
          <p className="text-sm text-muted">
            Kapalı alanları oda adına göre toplar, çizime yazar, Excel'e aktarır. İlk açılıştan itibaren {AREAPILOT.trialDays} gün ücretsiz deneme.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a href={AREAPILOT.path} className="btn-primary !py-2.5 !px-5 text-sm">Sayfaya git</a>
          <a href={`${AREAPILOT.path}#videolar`} className="inline-flex items-center rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-white hover:border-primary/60 press min-h-[44px]">Videoyu izle</a>
        </div>
      </div>
    </section>
  );
}
