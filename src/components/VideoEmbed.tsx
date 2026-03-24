"use client";

import { useState } from "react";
import Image from "next/image";

export default function VideoEmbed() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="md:col-span-2 lg:col-span-8 bg-black rounded-xl overflow-hidden">
      <div className="relative aspect-video">
        {playing ? (
          <iframe
            src="https://www.youtube.com/embed/ZMtaeucIsuQ?autoplay=1&rel=0"
            title="How To Debloat Your Face & Body"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group w-full h-full cursor-pointer"
          >
            <Image
              src="https://img.youtube.com/vi/ZMtaeucIsuQ/maxresdefault.jpg"
              alt="How To Debloat Your Face & Body"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover group-hover:brightness-110 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-tertiary-fixed/90 rounded-full flex items-center justify-center group-hover:bg-tertiary-fixed group-hover:scale-110 transition-all duration-300 shadow-2xl">
                <span className="material-symbols-outlined text-white text-3xl sm:text-4xl ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-tertiary-fixed text-base">smart_display</span>
                <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-white/60 uppercase tracking-widest">YouTube</span>
              </div>
              <h3 className="font-[var(--font-headline)] text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                How To Debloat Your Face & Body
              </h3>
              <p className="text-[0.6rem] sm:text-xs text-white/50 mt-1 uppercase tracking-wider">
                Click to play — Science-backed face debloat tutorial
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
