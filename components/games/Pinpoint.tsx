"use client";

import { useState } from "react";

const WORDS = ["Cartón", "Humedad", "Marrana", "Amigos gays", "Sarcasmo"];

const ACCEPTED_CATEGORY = [
  "chistes internos",
  "nuestros chistes",
  "nuestras bromas",
  "bromas internas",
  "sarcasmo",
  "nuestro sarcasmo",
  "humor nuestro",
];

function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface PinpointProps {
  onComplete: () => void;
}

export default function Pinpoint({ onComplete }: PinpointProps) {
  const [revealed, setRevealed] = useState(1);
  const [guess, setGuess] = useState("");
  const [shake, setShake] = useState(false);
  const [won, setWon] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);

  function submitGuess() {
    const val = normalize(guess);
    if (ACCEPTED_CATEGORY.some((c) => normalize(c) === val)) {
      setWon(true);
      setTimeout(onComplete, 900);
      return;
    }
    setWrongTries((t) => t + 1);
    setShake(true);
    setTimeout(() => setShake(false), 400);
    if (revealed < WORDS.length) {
      setRevealed((r) => r + 1);
    }
    setGuess("");
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <p className="text-center text-sm text-foreground-dim">
        Cinco palabras, un solo tema en común. Entre menos palabras
        necesites, mejor nos conoces.
      </p>
      <div className="flex flex-col gap-2 w-full">
        {WORDS.slice(0, revealed).map((w, i) => (
          <div
            key={i}
            className="fade-up card-surface rounded-lg px-4 py-2 text-center font-serif-display italic"
          >
            {w}
          </div>
        ))}
        {revealed < WORDS.length &&
          Array.from({ length: WORDS.length - revealed }).map((_, i) => (
            <div
              key={`hidden-${i}`}
              className="rounded-lg px-4 py-2 text-center border border-dashed border-line text-foreground-dim/40"
            >
              ??????
            </div>
          ))}
      </div>

      {!won && (
        <div className={`flex gap-2 w-full ${shake ? "animate-pulse" : ""}`}>
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            className="flex-1 rounded-md border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent-purple"
            placeholder="¿Cuál es el tema?"
          />
          <button
            onClick={submitGuess}
            className="btn-accent rounded-md px-3 py-2 text-sm font-medium"
          >
            Adivinar
          </button>
        </div>
      )}

      {!won && wrongTries > 0 && revealed >= WORDS.length && (
        <p className="text-xs text-foreground-dim">
          Pista: es justo el tipo de cosas que nos decimos en broma, con
          cariño.
        </p>
      )}

      {won && (
        <p className="fade-up text-gradient font-serif-display italic text-lg">
          Exacto. Nuestro sentido del humor, tal cual.
        </p>
      )}
    </div>
  );
}
