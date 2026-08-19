"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/story";
import EasterEggBackground from "@/components/EasterEggBackground";
import ProgressHearts from "@/components/ProgressHearts";
import GateScreen from "@/components/GateScreen";
import ChapterIntro from "@/components/ChapterIntro";
import QuestionGate from "@/components/QuestionGate";
import ClueReveal from "@/components/ClueReveal";
import FinalReveal from "@/components/FinalReveal";
import Queens from "@/components/games/Queens";
import Tango from "@/components/games/Tango";
import Crossclimb from "@/components/games/Crossclimb";
import Pinpoint from "@/components/games/Pinpoint";

const GAME_COMPONENTS = {
  queens: Queens,
  tango: Tango,
  crossclimb: Crossclimb,
  pinpoint: Pinpoint,
} as const;

type Phase = "intro" | "game" | "question" | "clue";
type Screen = "gate" | "journey" | "final";

interface AppState {
  screen: Screen;
  chapterIdx: number;
  phase: Phase;
}

const STORAGE_KEY = "proposal-progress-v1";
const INITIAL_STATE: AppState = { screen: "gate", chapterIdx: 0, phase: "intro" };

export default function Home() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      if (raw) setState(JSON.parse(raw) as AppState);
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  function handleGameComplete() {
    goTo({ phase: "question" });
  }

  function handleQuestionCorrect() {
    goTo({ phase: "clue" });
  }

  function handleClueContinue() {
    if (isLastChapter) {
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
          <GateScreen onUnlock={() => goTo({ screen: "journey", chapterIdx: 0, phase: "intro" })} />
        )}

        {state.screen === "journey" && chapter && state.phase === "intro" && (
          <ChapterIntro chapter={chapter} onStart={() => goTo({ phase: "game" })} />
        )}

        {state.screen === "journey" && chapter && state.phase === "game" && GameComponent && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
            <GameComponent onComplete={handleGameComplete} />
          </div>
        )}

        {state.screen === "journey" && chapter && state.phase === "question" && (
          <QuestionGate chapter={chapter} onCorrect={handleQuestionCorrect} />
        )}

        {state.screen === "journey" && chapter && state.phase === "clue" && (
          <ClueReveal chapter={chapter} isLast={isLastChapter} onContinue={handleClueContinue} />
        )}

        {state.screen === "final" && <FinalReveal />}
      </div>
    </div>
  );
}
