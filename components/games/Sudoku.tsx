"use client";

import { useMemo, useState } from "react";
import { formatElapsed, useStopwatch } from "@/lib/stopwatch";

const N = 9;

const SOLUTION: number[][] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

// Pre-filled given cells (row, col), rest start empty.
const GIVENS: [number, number][] = [
  [0, 0], [0, 1], [0, 3], [0, 4], [0, 6], [0, 7],
  [1, 1], [1, 2], [1, 4], [1, 5], [1, 7], [1, 8],
  [2, 2], [2, 5], [2, 8],
  [3, 0], [3, 2], [3, 3], [3, 5], [3, 6], [3, 8],
  [4, 0], [4, 1], [4, 3], [4, 4], [4, 6], [4, 7],
  [5, 1], [5, 4], [5, 7],
  [6, 1], [6, 2], [6, 4], [6, 5], [6, 7], [6, 8],
  [7, 0], [7, 2], [7, 3], [7, 5], [7, 6], [7, 8],
  [8, 0], [8, 3], [8, 6],
];

type CellValue = number | null;

function buildInitial(): CellValue[][] {
  const board: CellValue[][] = Array.from({ length: N }, () => Array<CellValue>(N).fill(null));
  GIVENS.forEach(([r, c]) => {
    board[r][c] = SOLUTION[r][c];
  });
  return board;
}

function isGiven(r: number, c: number): boolean {
  return GIVENS.some(([gr, gc]) => gr === r && gc === c);
}

function checkWin(board: CellValue[][]): boolean {
  for (let i = 0; i < N; i++) {
    const row = new Set(board[i]);
    if (row.size !== N || board[i].some((v) => v === null)) return false;
    const col = new Set(board.map((row) => row[i]));
    if (col.size !== N) return false;
  }
  for (let br = 0; br < N; br += 3) {
    for (let bc = 0; bc < N; bc += 3) {
      const box = new Set<CellValue>();
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) box.add(board[r][c]);
      }
      if (box.size !== N) return false;
    }
  }
  return true;
}

interface SudokuProps {
  onComplete: (elapsedMs: number) => void;
}

export default function Sudoku({ onComplete }: SudokuProps) {
  const initial = useMemo(() => buildInitial(), []);
  const [board, setBoard] = useState<CellValue[][]>(initial);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [won, setWon] = useState(false);
  const timer = useStopwatch(!won);

  function selectCell(r: number, c: number) {
    if (won || isGiven(r, c)) return;
    setSelected([r, c]);
  }

  function placeNumber(n: number | null) {
    if (won || !selected) return;
    const [r, c] = selected;
    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = n;
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
        Toca una celda vacía y luego un número. Cada fila, columna y cuadro
        de 3x3 lleva del 1 al 9, sin repetir.
      </p>
      <div className="grid grid-cols-9 gap-[2px] rounded-lg p-2 card-surface">
        {board.map((row, r) =>
          row.map((val, c) => {
            const given = isGiven(r, c);
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const thickRight = c === 2 || c === 5;
            const thickBottom = r === 2 || r === 5;
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => selectCell(r, c)}
                disabled={given}
                className={`game-cell flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center text-xs sm:text-sm border border-line/60 ${
                  thickRight ? "border-r-2 border-r-line" : ""
                } ${thickBottom ? "border-b-2 border-b-line" : ""} ${
                  given
                    ? "bg-background-soft text-foreground font-medium"
                    : isSelected
                    ? "bg-accent-purple/30 text-foreground shadow-[inset_0_0_0_2px_var(--accent-purple)]"
                    : "bg-background text-gradient hover:bg-background-soft"
                }`}
                aria-label={`Celda fila ${r + 1} columna ${c + 1}`}
              >
                {val ?? ""}
              </button>
            );
          })
        )}
      </div>

      {!won && (
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => placeNumber(n)}
              disabled={!selected}
              aria-label={`Número ${n}`}
              className="btn-accent flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium disabled:opacity-30"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => placeNumber(null)}
            disabled={!selected}
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-md text-sm disabled:opacity-30"
            aria-label="Borrar"
          >
            ✕
          </button>
        </div>
      )}

      {won && (
        <p className="fade-up text-gradient font-serif-display italic text-lg text-center">
          Lo lograste en {formatElapsed(timer.ms)}
        </p>
      )}
    </div>
  );
}
