"use client";

import { useMemo, type CSSProperties } from "react";

const EMOJIS = ["❤️", "💜", "✨", "💕", "💖"];

interface Piece {
  id: number;
  left: string;
  emoji: string;
  duration: number;
  delay: number;
  size: number;
  rotate: number;
}

function generatePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    emoji: EMOJIS[i % EMOJIS.length],
    duration: 2.2 + Math.random() * 1.6,
    delay: Math.random() * 0.5,
    size: 14 + Math.random() * 16,
    rotate: Math.round(Math.random() * 360),
  }));
}

export default function Confetti() {
  const pieces = useMemo(() => generatePieces(36), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute top-[-10%]"
          style={
            {
              left: p.left,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--rot": `${p.rotate}deg`,
            } as CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
