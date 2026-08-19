import type { Chapter } from "@/lib/story";

interface ChapterIntroProps {
  chapter: Chapter;
  onStart: () => void;
}

export default function ChapterIntro({ chapter, onStart }: ChapterIntroProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center gap-5">
      <p className="fade-up text-xs uppercase tracking-[0.3em] text-foreground-dim">
        Capítulo {chapter.id} · {chapter.gameTitle}
      </p>
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
