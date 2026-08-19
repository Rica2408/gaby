"use client";

import { useState } from "react";

interface Rung {
  clue: string;
  answers: string[];
}

const RUNGS: Rung[] = [
  {
    clue: "Lo primero que se nos escapa cuando estamos juntos, sin poder evitarlo.",
    answers: ["risa"],
  },
  {
    clue: "No hacen falta palabras, solo brazos alrededor del otro.",
    answers: ["abrazo"],
  },
  {
    clue: "Cuando decidimos escapar juntos a descubrir algo nuevo.",
    answers: ["viaje"],
  },
  {
    clue: "Lo que somos cuando cruzamos juntos una meta, una carrera, un mal día.",
    answers: ["equipo"],
  },
  {
    clue: "Ya no es un lugar. Eres tú.",
    answers: ["hogar"],
  },
];

const CONNECTOR = {
  clue: "¿Cómo se llama eso que arman estas cinco palabras juntas?",
  answers: ["nosotros", "amor", "tu y yo", "nosotros dos", "tú y yo"],
};

function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface CrossclimbProps {
  onComplete: () => void;
}

export default function Crossclimb({ onComplete }: CrossclimbProps) {
  const [solved, setSolved] = useState<boolean[]>(Array(RUNGS.length).fill(false));
  const [inputs, setInputs] = useState<string[]>(Array(RUNGS.length).fill(""));
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [connectorInput, setConnectorInput] = useState("");
  const [connectorShake, setConnectorShake] = useState(false);
  const [won, setWon] = useState(false);

  const activeIdx = solved.findIndex((s) => !s);
  const allRungsSolved = activeIdx === -1;

  function submitRung(idx: number) {
    const rung = RUNGS[idx];
    const val = normalize(inputs[idx]);
    if (rung.answers.some((a) => normalize(a) === val)) {
      setSolved((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    } else {
      setShakeIdx(idx);
      setTimeout(() => setShakeIdx(null), 400);
    }
  }

  function submitConnector() {
    const val = normalize(connectorInput);
    if (CONNECTOR.answers.some((a) => normalize(a) === val)) {
      setWon(true);
      setTimeout(onComplete, 900);
    } else {
      setConnectorShake(true);
      setTimeout(() => setConnectorShake(false), 400);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <p className="text-center text-sm text-foreground-dim">
        Sube la escalera un escalón a la vez. Cada palabra es una pista de
        nosotros.
      </p>
      <div className="flex flex-col-reverse gap-2 w-full">
        {RUNGS.map((rung, idx) => {
          const isSolved = solved[idx];
          const isActive = idx === activeIdx;
          const isLocked = !isSolved && !isActive;
          return (
            <div
              key={idx}
              className={`card-surface rounded-lg p-3 transition-opacity ${
                isLocked ? "opacity-30" : "opacity-100"
              } ${shakeIdx === idx ? "animate-pulse" : ""}`}
            >
              {isSolved ? (
                <p className="font-serif-display italic text-gradient text-lg text-center">
                  {RUNGS[idx].answers[0].toUpperCase()}
                </p>
              ) : isActive ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm">{rung.clue}</p>
                  <div className="flex gap-2">
                    <input
                      value={inputs[idx]}
                      onChange={(e) => {
                        const v = e.target.value;
                        setInputs((prev) => {
                          const next = [...prev];
                          next[idx] = v;
                          return next;
                        });
                      }}
                      onKeyDown={(e) => e.key === "Enter" && submitRung(idx)}
                      className="flex-1 rounded-md border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent-purple"
                      placeholder="Tu respuesta"
                    />
                    <button
                      onClick={() => submitRung(idx)}
                      className="btn-accent rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Subir
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground-dim">🔒 ??????</p>
              )}
            </div>
          );
        })}
      </div>

      {allRungsSolved && !won && (
        <div className="fade-up card-surface rounded-lg p-4 w-full flex flex-col gap-2 border-accent-purple/40">
          <p className="text-sm font-medium">{CONNECTOR.clue}</p>
          <div className={`flex gap-2 ${connectorShake ? "animate-pulse" : ""}`}>
            <input
              value={connectorInput}
              onChange={(e) => setConnectorInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitConnector()}
              className="flex-1 rounded-md border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent-purple"
              placeholder="Tu respuesta"
            />
            <button
              onClick={submitConnector}
              className="btn-accent rounded-md px-3 py-2 text-sm font-medium"
            >
              Cerrar el círculo
            </button>
          </div>
        </div>
      )}

      {won && (
        <p className="fade-up text-gradient font-serif-display italic text-lg">
          Eso es lo que somos.
        </p>
      )}
    </div>
  );
}
