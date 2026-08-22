import { formatClock, formatElapsed } from "@/lib/stopwatch";

interface GameTimerProps {
  ms: number;
  frozen?: boolean;
  countdown?: boolean;
  urgent?: boolean;
}

export default function GameTimer({ ms, frozen, countdown, urgent }: GameTimerProps) {
  return (
    <p
      className={`font-mono text-xl tabular-nums tracking-widest ${
        frozen ? "text-gradient" : urgent ? "text-accent-red" : "text-foreground"
      }`}
    >
      {countdown ? formatClock(ms) : formatElapsed(ms)}
    </p>
  );
}
