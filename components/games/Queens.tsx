"use client";

import { useMemo, useState } from "react";

const N = 6;

// 6x6 region map, hand-verified to have at least one valid non-adjacent
// one-per-row/col/region solution.
const REGIONS: number[][] = [
  [0, 0, 0, 1, 1, 2],
  [0, 0, 1, 1, 1, 2],
  [3, 0, 1, 1, 2, 2],
  [3, 3, 4, 1, 2, 2],
  [3, 4, 4, 4, 5, 2],
  [3, 4, 4, 5, 5, 5],
];

const REGION_COLORS = [
  "bg-rose-950/70",
  "bg-purple-950/70",
  "bg-indigo-950/70",
  "bg-fuchsia-950/70",
  "bg-pink-950/70",
  "bg-violet-950/70",
];

type CellState = 0 | 1 | 2; // empty, queen, marked X

function checkWin(cells: CellState[][]): boolean {
  const queens: [number, number][] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (cells[r][c] === 1) queens.push([r, c]);
    }
  }
  if (queens.length !== N) return false;

  const rows = new Set(queens.map((q) => q[0]));
  const cols = new Set(queens.map((q) => q[1]));
  const regions = new Set(queens.map(([r, c]) => REGIONS[r][c]));
  if (rows.size !== N || cols.size !== N || regions.size !== N) return false;

  for (let i = 0; i < queens.length; i++) {
    for (let j = i + 1; j < queens.length; j++) {
      const [r1, c1] = queens[i];
      const [r2, c2] = queens[j];
      if (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) return false;
    }
  }
  return true;
}

interface QueensProps {
  onComplete: () => void;
}

export default function Queens({ onComplete }: QueensProps) {
  const emptyBoard = useMemo<CellState[][]>(
    () => Array.from({ length: N }, () => Array<CellState>(N).fill(0)),
    []
  );
  const [cells, setCells] = useState<CellState[][]>(emptyBoard);
  const [won, setWon] = useState(false);

  function handleTap(r: number, c: number) {
    if (won) return;
    setCells((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = ((next[r][c] + 1) % 3) as CellState;
      if (checkWin(next)) {
        setWon(true);
        setTimeout(onComplete, 900);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-foreground-dim max-w-sm">
        Toca una celda: 1er toque = reina 👑, 2do = marca ✕, 3er = vacío. Una
        reina por fila, columna y color, sin tocarse entre sí.
      </p>
      <div
        className={`grid grid-cols-6 gap-1 rounded-lg p-2 card-surface transition-opacity ${
          won ? "opacity-90" : ""
        }`}
      >
        {cells.map((row, r) =>
          row.map((val, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleTap(r, c)}
              className={`game-cell flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-md text-xl ${REGION_COLORS[REGIONS[r][c]]} border border-line`}
              aria-label={`Celda fila ${r + 1} columna ${c + 1}`}
            >
              {val === 1 ? "👑" : val === 2 ? "✕" : ""}
            </button>
          ))
        )}
      </div>
      {won && (
        <p className="fade-up text-gradient font-serif-display italic text-lg">
          Perfecto equilibrio, como nosotros.
        </p>
      )}
    </div>
  );
}
