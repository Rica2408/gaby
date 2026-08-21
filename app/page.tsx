"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/story";
import { vibrate } from "@/lib/haptics";
import EasterEggBackground from "@/components/EasterEggBackground";
import ProgressHearts from "@/components/ProgressHearts";
import AdminSkip from "@/components/AdminSkip";
import GateScreen from "@/components/GateScreen";
import ChapterIntro from "@/components/ChapterIntro";
import QuestionGate from "@/components/QuestionGate";
import ClueReveal from "@/components/ClueReveal";
import FinalReveal from "@/components/FinalReveal";
import TimedGame from "@/components/TimedGame";
import Queens from "@/components/games/Queens";
import Tango from "@/components/games/Tango";
import Sudoku from "@/components/games/Sudoku";
import Zip from "@/components/games/Zip";

const GAME_COMPONENTS = {
  queens: Queens,
  tango: Tango,
  sudoku: Sudoku,
  zip: Zip,
} as const;

type Phase = "intro" | "game" | "question" | "clue";
type Screen = "gate" | "journey" | "final";

interface AppState {
  screen: Screen;
  chapterIdx: number;
  phase: Phase;
  gameTimes: number[];
}

const STORAGE_KEY = "proposal-progress-v1";
const INITIAL_STATE: AppState = { screen: "gate", chapterIdx: 0, phase: "intro", gameTimes: [] };

export default function Home() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (!Array.isArray(parsed.gameTimes)) parsed.gameTimes = [];
        setState(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1") setAdminMode(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / circular data
    }
  }, [state, hydrated]);

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  const chapter = CHAPTERS[state.chapterIdx];
  const isLastChapter = state.chapterIdx === CHAPTERS.length - 1;
  const filledHearts =
    state.screen === "final"
      ? CHAPTERS.length
      : state.chapterIdx + (state.phase === "clue" ? 1 : 0);

  function goTo(next: Partial<AppState>) {
    setState((prev) => ({ ...prev, ...next }));
  }

  function handleGameComplete(elapsedMs = 0) {
    vibrate(30);
    const time = typeof elapsedMs === "number" && Number.isFinite(elapsedMs) ? elapsedMs : 0;
    setState((prev) => {
      const gameTimes = [...prev.gameTimes];
      gameTimes[prev.chapterIdx] = time;
      return { ...prev, phase: "question", gameTimes };
    });
  }

  function handleQuestionCorrect() {
    vibrate(30);
    goTo({ phase: "clue" });
  }

  function handleClueContinue() {
    if (isLastChapter) {
      vibrate([40, 60, 40, 60, 140]);
      goTo({ screen: "final" });
    } else {
      goTo({ chapterIdx: state.chapterIdx + 1, phase: "intro" });
    }
  }

  const GameComponent = chapter ? GAME_COMPONENTS[chapter.game] : null;

  return (
    <div className="relative flex flex-1 flex-col min-h-screen">
      <EasterEggBackground />

      {state.screen === "journey" && (
        <div className="relative z-10 flex justify-center pt-6">
          <ProgressHearts total={CHAPTERS.length} filled={filledHearts} />
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        {state.screen === "gate" && (
          <GateScreen
            onUnlock={() => {
              vibrate(30);
              goTo({ screen: "journey", chapterIdx: 0, phase: "intro" });
            }}
          />
        )}

        {adminMode && state.screen === "gate" && (
          <AdminSkip
            label="Saltar contraseña"
            onSkip={() => goTo({ screen: "journey", chapterIdx: 0, phase: "intro" })}
          />
        )}

        {state.screen === "journey" && chapter && state.phase === "intro" && (
          <ChapterIntro chapter={chapter} onStart={() => goTo({ phase: "game" })} />
        )}

        {state.screen === "journey" && chapter && state.phase === "game" && GameComponent && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
            <TimedGame key={state.chapterIdx} onComplete={handleGameComplete}>
              {(onComplete) => <GameComponent onComplete={onComplete} />}
            </TimedGame>
          </div>
        )}

        {adminMode && state.screen === "journey" && state.phase === "game" && (
          <AdminSkip label="Saltar juego" onSkip={handleGameComplete} />
        )}

        {state.screen === "journey" && chapter && state.phase === "question" && (
          <QuestionGate
            chapter={chapter}
            elapsedMs={state.gameTimes[state.chapterIdx]}
            onCorrect={handleQuestionCorrect}
          />
        )}

        {adminMode && state.screen === "journey" && state.phase === "question" && (
          <AdminSkip label="Saltar pregunta" onSkip={handleQuestionCorrect} />
        )}

        {state.screen === "journey" && chapter && state.phase === "clue" && (
          <ClueReveal chapter={chapter} isLast={isLastChapter} onContinue={handleClueContinue} />
        )}

        {state.screen === "final" && <FinalReveal gameTimes={state.gameTimes} />}
      </div>

      {adminMode && state.screen === "journey" && (
        <AdminSkip label="Ir al final" side="left" onSkip={() => goTo({ screen: "final" })} />
      )}
    </div>
  );
}
