"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { Video } from "@/lib/videos";

// Oynat'a basılana kadar yalnızca yerel kapak görünür; YouTube'a istek gitmez, çerez yazılmaz.
// Basılınca çerezsiz alan adından (youtube-nocookie.com) oynatıcı yüklenir.
export default function YouTubeFacade({ video, priority = false, lang = "tr", playPosition = "center" }: { video: Video; priority?: boolean; lang?: "tr" | "en"; playPosition?: "center" | "left" }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-surface shadow-window">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&hl=${lang}&cc_lang_pref=${video.dil}`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`${lang === "tr" ? "Videoyu oynat" : "Play video"}: ${video.title}`}
        >
          <img
            src={video.poster}
            alt=""
            width={1280}
            height={720}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-background/10 group-hover:opacity-0 transition-opacity" />
          <span className={`absolute -translate-x-1/2 -translate-y-1/2 flex ${playPosition === "left" ? "h-10 w-10 left-[9%] top-[71%] sm:h-20 sm:w-20 sm:left-[17%] sm:top-[66%]" : "h-20 w-20 left-1/2 top-1/2"} items-center justify-center rounded-full bg-primary-dark text-white shadow-[0_10px_40px_rgba(0,82,212,0.6)] press transition-transform group-hover:scale-110`}>
            <Play size={34} className="ml-1" fill="currentColor" />
          </span>
          <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 font-mono text-xs text-white">
            {video.durationLabel}
          </span>
        </button>
      )}
    </div>
  );
}

export const YOUTUBE_NOTE = "Oynat'a bastığında video YouTube'dan (youtube-nocookie.com) yüklenir.";
export const YOUTUBE_NOTE_EN = "When you press play, the video loads from YouTube (youtube-nocookie.com).";
