"use client";

import { useRef, useState } from "react";
import { formatElapsed, useStopwatch } from "@/lib/stopwatch";

const N = 7;

const WALLS = new Set(["1,3", "2,1", "3,5", "4,2", "5,4"]);

const LABELS: (number | null)[][] = [
  [1, null, 3, null, null, null, null],
  [null, null, null, null, null, null, 7],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, 4, null, 6],
  [null, 2, null, null, null, null, null],
  [null, null, null, null, null, null, 5],
];

const OPEN_CELLS = N * N - WALLS.size;

const SEGMENT_COLORS = [
  "bg-rose-600 text-white",
  "bg-pink-500 text-white",
  "bg-fuchsia-500 text-white",
  "bg-violet-500 text-white",
  "bg-purple-600 text-white",
  "bg-indigo-500 text-white",
  "bg-red-500 text-white",
  "bg-orange-500 text-white",
];

type Cell = { r: number; c: number };

function keyOf(cell: Cell): string {
  return `${cell.r},${cell.c}`;
}

function isWall(cell: Cell): boolean {
  return WALLS.has(keyOf(cell));
}

function sameCell(a: Cell, b: Cell): boolean {
  return a.r === b.r && a.c === b.c;
}

function isAdjacent(a: Cell, b: Cell): boolean {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

function numberedOnPath(path: Cell[]): number {
  return path.filter((cell) => LABELS[cell.r][cell.c] !== null).length;
}

function canVisit(path: Cell[], cell: Cell): boolean {
  if (isWall(cell)) return false;
  const label = LABELS[cell.r][cell.c];
  if (label === null) return true;
  return label === numberedOnPath(path) + 1;
}

interface ZipProps {
  onComplete: (elapsedMs: number) => void;
}

export default function Zip({ onComplete }: ZipProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<Cell[]>([]);
  const [won, setWon] = useState(false);
  const wonRef = useRef(false);
  const drawingRef = useRef(false);
  const pathRef = useRef<Cell[]>([]);
  const timer = useStopwatch(!won);

  const pathIndex = new Map(path.map((cell, i) => [keyOf(cell), i]));
  const segmentByKey = new Map<string, number>();
  {
    let reached = 0;
    for (const cell of path) {
      if (LABELS[cell.r][cell.c] !== null) reached += 1;
      segmentByKey.set(keyOf(cell), Math.max(0, reached - 1));
    }
  }

  function applyPath(next: Cell[]) {
    pathRef.current = next;
    setPath(next);
    if (next.length === OPEN_CELLS && !wonRef.current) {
      wonRef.current = true;
      setWon(true);
      onComplete(timer.snapshot());
    }
  }

  function tryVisit(cell: Cell) {
    if (wonRef.current || isWall(cell)) return;
    const prev = pathRef.current;
    if (prev.length === 0) {
      if (LABELS[cell.r][cell.c] !== 1) return;
      applyPath([cell]);
      return;
    }

    const last = prev[prev.length - 1];
    if (sameCell(last, cell)) return;

    const prevCell = prev[prev.length - 2];
    if (prevCell && sameCell(prevCell, cell)) {
      applyPath(prev.slice(0, -1));
      return;
    }

    if (!isAdjacent(last, cell)) return;
    if (prev.some((p) => sameCell(p, cell))) return;
    if (!canVisit(prev, cell)) return;
    applyPath([...prev, cell]);
  }

  function cellFromPoint(clientX: number, clientY: number): Cell | null {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const c = Math.floor(((clientX - rect.left) / rect.width) * N);
    const r = Math.floor(((clientY - rect.top) / rect.height) * N);
    if (r < 0 || r >= N || c < 0 || c >= N) return null;
    const cell = { r, c };
    if (isWall(cell)) return null;
    return cell;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (wonRef.current) return;
    e.preventDefault();
    drawingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    const idx = pathRef.current.findIndex((p) => sameCell(p, cell));
    if (idx !== -1) {
      applyPath(pathRef.current.slice(0, idx + 1));
      return;
    }
    tryVisit(cell);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drawingRef.current || wonRef.current) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell) tryVisit(cell);
  }

  function stopDrawing() {
    drawingRef.current = false;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-foreground-dim max-w-sm">
        Une 1 a 7 en orden y llena cada casilla libre. Las oscuras están
        bloqueadas. El atajo obvio casi nunca es el bueno.
      </p>
      <div className="rounded-lg p-2 card-surface touch-none">
        <div
          ref={gridRef}
          className="grid grid-cols-7 gap-1"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
        >
          {LABELS.map((row, r) =>
            row.map((label, c) => {
              const cell = { r, c };
              const blocked = isWall(cell);
              const idx = pathIndex.get(keyOf(cell));
              const onPath = idx !== undefined;
              const isLast = onPath && idx === path.length - 1;
              const segment = onPath ? (segmentByKey.get(keyOf(cell)) ?? 0) : 0;
              const segmentColor = SEGMENT_COLORS[segment % SEGMENT_COLORS.length];
              return (
                <div
                  key={keyOf(cell)}
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md text-sm font-medium border select-none pointer-events-none ${
                    blocked
                      ? "border-transparent bg-foreground/20"
                      : onPath
                        ? `game-cell border-line ${segmentColor} ${isLast ? "ring-2 ring-white/70" : ""}`
                        : "game-cell border-line bg-background"
                  }`}
                >
                  {blocked ? "" : (label ?? "")}
                </div>
              );
            })
          )}
        </div>
      </div>
      {!won && (
        <button
          onClick={() => applyPath([])}
          className="text-xs text-foreground-dim underline-offset-2 hover:underline"
        >
          Reiniciar camino
        </button>
      )}
      {won && (
        <p className="fade-up text-gradient font-serif-display italic text-lg text-center">
          Lo lograste en {formatElapsed(timer.ms)}
        </p>
      )}
    </div>
  );
}
