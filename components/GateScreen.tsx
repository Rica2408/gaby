"use client";

import { useState } from "react";
import { ENTRY_PASSCODE } from "@/lib/story";

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

interface GateScreenProps {
  onUnlock: () => void;
}

export default function GateScreen({ onUnlock }: GateScreenProps) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  function submit() {
    if (normalize(value) === normalize(ENTRY_PASSCODE)) {
      onUnlock();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center gap-6">
      <p className="fade-up text-xs uppercase tracking-[0.3em] text-foreground-dim">
        Antes de empezar
      </p>
      <h1 className="fade-up font-serif-display italic text-3xl sm:text-4xl leading-tight max-w-sm">
        Tengo algo que preguntarte.
        <br />
        Pero te lo vas a tener que ganar.
      </h1>
      <div className={`flex flex-col gap-3 w-full max-w-xs ${shake ? "shake" : ""}`}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="input-field rounded-full border border-line bg-background-soft px-5 py-3 text-center outline-none focus:border-accent-purple"
          placeholder="Palabra clave"
          autoFocus
        />
        <button
          onClick={submit}
          className="btn-accent rounded-full px-5 py-3 font-medium"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
