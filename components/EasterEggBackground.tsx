"use client";

import { useMemo, type CSSProperties } from "react";
import { EASTER_EGGS } from "@/lib/story";

interface Placed {
  text: string;
  top: string;
  left: string;
  rotate: number;
  size: string;
  duration: number;
  dx: number;
  dy: number;
}

function seededPlacements(): Placed[] {
  const positions = [
    { top: "8%", left: "6%" },
    { top: "18%", left: "72%" },
    { top: "42%", left: "12%" },
    { top: "58%", left: "78%" },
    { top: "80%", left: "20%" },
  ];

  return EASTER_EGGS.map((text, i) => {
    const pos = positions[i % positions.length];
    return {
      text,
      top: pos.top,
      left: pos.left,
      rotate: (i % 2 === 0 ? -1 : 1) * (6 + i * 2),
      size: i % 3 === 0 ? "text-sm" : "text-xs",
      duration: 10 + i * 2,
      dx: (i % 2 === 0 ? 1 : -1) * (10 + i * 2),
      dy: (i % 2 === 0 ? -1 : 1) * (8 + i * 2),
    };
  });
}

export default function EasterEggBackground() {
  const placements = useMemo(() => seededPlacements(), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {placements.map((p) => (
        <span
          key={p.text}
          className={`easter-egg absolute font-serif-display italic text-foreground-dim/20 ${p.size}`}
          style={
            {
              top: p.top,
              left: p.left,
              "--rot": `${p.rotate}deg`,
              "--dur": `${p.duration}s`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              transform: `rotate(${p.rotate}deg)`,
            } as CSSProperties
          }
        >
          {p.text}
        </span>
      ))}
    </div>
  );
}
