"use client";

import { useState } from "react";
import type { Chapter } from "@/lib/story";

interface ChapterIntroProps {
  chapter: Chapter;
  onStart: () => void;
}

export default function ChapterIntro({ chapter, onStart }: ChapterIntroProps) {
  const [photoBroken, setPhotoBroken] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center gap-5">
      <p className="fade-up text-xs uppercase tracking-[0.3em] text-foreground-dim">
        Capítulo {chapter.id} · {chapter.gameTitle}
      </p>
      {chapter.introPhoto && !photoBroken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={chapter.introPhoto}
          alt=""
          onError={() => setPhotoBroken(true)}
          className="fade-up h-36 w-36 rounded-full border border-line object-cover shadow-[0_0_30px_-8px_rgba(124,58,237,0.5)] grayscale transition-all duration-500 hover:grayscale-0 sm:h-44 sm:w-44"
        />
      )}
      <p className="fade-up font-serif-display italic text-2xl sm:text-3xl leading-snug max-w-sm">
        {chapter.gameIntro}
      </p>
      <button
        onClick={onStart}
        className="fade-up btn-accent rounded-full px-6 py-3 font-medium mt-2"
      >
        Comenzar
      </button>
    </div>
  );
}
