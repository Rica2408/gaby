"use client";

import { useState } from "react";
import { checkAnswer, type Chapter } from "@/lib/story";

interface QuestionGateProps {
  chapter: Chapter;
  onCorrect: () => void;
}

export default function QuestionGate({ chapter, onCorrect }: QuestionGateProps) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  function submit() {
    if (checkAnswer(chapter, value)) {
      onCorrect();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center gap-6">
      <p className="fade-up text-xs uppercase tracking-[0.3em] text-foreground-dim">
        Para seguir
      </p>
      <h2 className="fade-up font-serif-display italic text-2xl sm:text-3xl leading-snug max-w-sm">
        {chapter.question}
      </h2>
      <div className={`flex flex-col gap-3 w-full max-w-xs ${shake ? "shake" : ""}`}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="input-field rounded-full border border-line bg-background-soft px-5 py-3 text-center outline-none focus:border-accent-purple"
          placeholder={chapter.answerHint ?? "Tu respuesta"}
          autoFocus
        />
        <button
          onClick={submit}
          className="btn-accent rounded-full px-5 py-3 font-medium"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
