"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatClock, useStopwatch } from "@/lib/stopwatch";
import { vibrate } from "@/lib/haptics";
import GameTimer from "@/components/GameTimer";

const BASE_LIMIT_MS = 2 * 60 * 1000;
const EXTRA_PER_FAIL_MS = 30 * 1000;

interface TimedGameProps {
  children: (onComplete: (elapsedMs: number) => void) => ReactNode;
  onComplete: (elapsedMs: number) => void;
}

export default function TimedGame({ children, onComplete }: TimedGameProps) {
  const [fails, setFails] = useState(0);
  const [round, setRound] = useState(0);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const forwarded = useRef(false);

  const limitMs = BASE_LIMIT_MS + fails * EXTRA_PER_FAIL_MS;
  const nextLimitMs = limitMs + EXTRA_PER_FAIL_MS;
  const timer = useStopwatch(!lost && !won, round);
  const remaining = Math.max(0, limitMs - timer.ms);

  useEffect(() => {
    if (lost || won || remaining > 0) return;
    setLost(true);
    vibrate([80, 40, 80]);
  }, [remaining, lost, won]);

  function handleComplete(elapsedMs: number) {
    if (lost || won || forwarded.current) return;
    forwarded.current = true;
    setWon(true);
    window.setTimeout(() => onComplete(elapsedMs), 2200);
  }

  function retry() {
    forwarded.current = false;
    setFails((n) => n + 1);
    setLost(false);
    setWon(false);
    setRound((n) => n + 1);
  }

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center">
      {!lost && (
        <div className="mb-4">
          <GameTimer ms={remaining} frozen={won} countdown urgent={remaining <= 15_000 && !won} />
        </div>
      )}
      <div key={round} className={lost ? "pointer-events-none opacity-40" : ""}>
        {children(handleComplete)}
      </div>
      {lost && (
        <div className="fade-up absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-background/80 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground-dim">Se acabó el tiempo</p>
          <p className="font-serif-display italic text-2xl sm:text-3xl">
            Perdiste, marrana.
          </p>
          <p className="text-sm text-foreground-dim">
            Siguiente intento: {formatClock(nextLimitMs)}
          </p>
          <button onClick={retry} className="btn-accent rounded-full px-6 py-3 font-medium">
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}
