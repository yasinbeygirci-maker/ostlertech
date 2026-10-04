"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { Video } from "@/lib/videos";

// Oynat'a basılana kadar yalnızca yerel kapak görünür; YouTube'a istek gitmez, çerez yazılmaz.
// Basılınca çerezsiz alan adından (youtube-nocookie.com) oynatıcı yüklenir.
export default function YouTubeFacade({ video, priority = false }: { video: Video; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&hl=tr&cc_lang_pref=tr`}
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
          aria-label={`Videoyu oynat: ${video.title}`}
        >
          <img
            src={video.poster}
            alt=""
            width={1280}
            height={720}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-colors" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-primary-dark text-white shadow-[0_10px_40px_rgba(0,82,212,0.6)] transition-transform group-hover:scale-110">
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

export const YOUTUBE_NOTE = "Oynat'a bastığınızda video YouTube'dan (youtube-nocookie.com) yüklenir.";
