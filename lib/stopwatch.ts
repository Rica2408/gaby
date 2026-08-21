"use client";

import { useEffect, useRef, useState } from "react";

export function formatClock(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatElapsed(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const tenths = Math.floor((clamped % 1000) / 100);
  return `${m}:${s.toString().padStart(2, "0")}.${tenths}`;
}

export function useStopwatch(
  running: boolean,
  resetKey = 0
): { ms: number; snapshot: () => number } {
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
    elapsedRef.current = 0;
    setElapsed(0);
  }, [resetKey]);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const next = Date.now() - startRef.current;
      elapsedRef.current = next;
      setElapsed(next);
    };
    tick();
    const id = window.setInterval(tick, 80);
    return () => window.clearInterval(id);
  }, [running, resetKey]);

  return {
    ms: elapsed,
    snapshot: () => elapsedRef.current,
  };
}
