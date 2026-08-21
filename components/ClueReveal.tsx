import type { Chapter } from "@/lib/story";

interface ClueRevealProps {
  chapter: Chapter;
  isLast: boolean;
  onContinue: () => void;
}

export default function ClueReveal({ chapter, isLast, onContinue }: ClueRevealProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center gap-6">
      <p className="fade-up text-xs uppercase tracking-[0.3em] text-foreground-dim">
        Pista {chapter.id} de 4
      </p>
      <div className="fade-up heart-pop text-7xl">{chapter.clueEmoji}</div>
      <p className="fade-up font-serif-display italic text-2xl sm:text-3xl leading-snug max-w-sm">
        {chapter.clueText}
      </p>
      <button
        onClick={onContinue}
        className="fade-up btn-accent rounded-full px-6 py-3 font-medium mt-2"
      >
        {isLast ? "Ver el final" : "Siguiente capítulo"}
      </button>
    </div>
  );
}
