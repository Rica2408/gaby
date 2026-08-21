"use client";

import { useMemo, useState } from "react";
import { formatElapsed, useStopwatch } from "@/lib/stopwatch";

const N = 6;

// One valid full solution (1 = sol, 0 = luna), verified: 3/3 per row & col,
// no 3 consecutive equal in any row or column.
const SOLUTION = [
  [0, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 0],
  [1, 0, 1, 1, 0, 0],
  [0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 1],
];

// Pre-filled given cells (row, col), rest start empty.
const GIVENS: [number, number][] = [
  [0, 1],
  [0, 4],
  [1, 0],
  [1, 3],
  [2, 2],
  [2, 5],
  [3, 1],
  [3, 4],
  [4, 0],
  [4, 3],
  [5, 2],
  [5, 5],
];

type CellValue = 0 | 1 | null; // luna, sol, vacío

function buildInitial(): CellValue[][] {
  const board: CellValue[][] = Array.from({ length: N }, () => Array<CellValue>(N).fill(null));
  GIVENS.forEach(([r, c]) => {
    board[r][c] = SOLUTION[r][c] as CellValue;
  });
  return board;
}

function isGiven(r: number, c: number): boolean {
  return GIVENS.some(([gr, gc]) => gr === r && gc === c);
}

function noThreeConsecutive(arr: CellValue[]): boolean {
  for (let i = 0; i + 2 < arr.length; i++) {
    if (arr[i] !== null && arr[i] === arr[i + 1] && arr[i + 1] === arr[i + 2]) return false;
  }
  return true;
}

function checkWin(board: CellValue[][]): boolean {
  for (let r = 0; r < N; r++) {
    const row = board[r];
    if (row.some((v) => v === null)) return false;
    if (row.filter((v) => v === 1).length !== 3) return false;
    if (!noThreeConsecutive(row)) return false;
  }
  for (let c = 0; c < N; c++) {
    const col = board.map((row) => row[c]);
    if (col.filter((v) => v === 1).length !== 3) return false;
    if (!noThreeConsecutive(col)) return false;
  }
  return true;
}

interface TangoProps {
  onComplete: (elapsedMs: number) => void;
}

export default function Tango({ onComplete }: TangoProps) {
  const initial = useMemo(() => buildInitial(), []);
  const [board, setBoard] = useState<CellValue[][]>(initial);
  const [won, setWon] = useState(false);
  const timer = useStopwatch(!won);

  function handleTap(r: number, c: number) {
    if (won || isGiven(r, c)) return;
    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      const current = next[r][c];
      const order: CellValue[] = [null, 1, 0];
      const idx = order.indexOf(current);
      next[r][c] = order[(idx + 1) % order.length];
      if (checkWin(next)) {
        setWon(true);
        const ms = timer.snapshot();
        onComplete(ms);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-foreground-dim max-w-sm">
        Toca una celda vacía para alternar ☀️ / 🌙. 3 soles y 3 lunas por fila
        y columna, nunca 3 iguales seguidos.
      </p>
      <div className="grid grid-cols-6 gap-1 rounded-lg p-2 card-surface">
        {board.map((row, r) =>
          row.map((val, c) => {
            const given = isGiven(r, c);
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleTap(r, c)}
                disabled={given}
                className={`game-cell flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-md text-xl border border-line ${
                  given ? "bg-background-soft opacity-90" : "bg-background hover:bg-background-soft"
                }`}
                aria-label={`Celda fila ${r + 1} columna ${c + 1}`}
              >
                {val === 1 ? "☀️" : val === 0 ? "🌙" : ""}
              </button>
            );
          })
        )}
      </div>
      {won && (
        <p className="fade-up text-gradient font-serif-display italic text-lg text-center">
          Lo lograste en {formatElapsed(timer.ms)}
        </p>
      )}
    </div>
  );
}
