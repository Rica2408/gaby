interface ProgressHeartsProps {
  total: number;
  filled: number;
}

export default function ProgressHearts({ total, filled }: ProgressHeartsProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`Progreso: ${filled} de ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const isFilled = i < filled;
        const isLatest = i === filled - 1;
        return (
          <span
            key={i}
            className={`text-xl transition-all duration-300 ${
              isFilled ? "heart-pop text-gradient scale-110" : "text-foreground-dim/30"
            } ${isLatest ? "drop-shadow-[0_0_8px_rgba(225,29,72,0.65)]" : ""}`}
          >
            ♥
          </span>
        );
      })}
    </div>
  );
}
