interface ProgressHeartsProps {
  total: number;
  filled: number;
}

export default function ProgressHearts({ total, filled }: ProgressHeartsProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`Progreso: ${filled} de ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <span
            key={i}
            className={`text-xl transition-all duration-300 ${
              isFilled ? "heart-pop text-gradient scale-110" : "text-foreground-dim/30"
            }`}
          >
            ♥
          </span>
        );
      })}
    </div>
  );
}
