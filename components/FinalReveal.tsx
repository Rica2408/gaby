"use client";

import { useState } from "react";
import { CHAPTERS } from "@/lib/story";
import { vibrate } from "@/lib/haptics";
import PhotoGallery from "./PhotoGallery";
import Confetti from "./Confetti";

export default function FinalReveal() {
  const [confirmed, setConfirmed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  function handleFound() {
    setConfirmed(true);
    setShowConfetti(true);
    vibrate([40, 60, 40, 60, 140]);
    setTimeout(() => setShowConfetti(false), 4000);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center gap-6">
      <p className="fade-up text-xs uppercase tracking-[0.3em] text-foreground-dim">
        Completaste el juego...
      </p>

      <div className="flex items-center gap-3 text-4xl">
        {CHAPTERS.map((c, i) => (
          <span
            key={c.id}
            className="sticker-pop inline-block"
            style={{ animationDelay: `${0.4 + i * 0.35}s` }}
          >
            {c.clueEmoji}
          </span>
        ))}
      </div>

      <h2
        className="fade-up font-serif-display italic text-2xl sm:text-3xl leading-snug max-w-sm"
        style={{ animationDelay: "1.9s" }}
      >
        Carro. Mochila. Cartera. Ahí está lo que estabas buscando.
      </h2>

      <p
        className="fade-up text-sm text-foreground-dim max-w-xs"
        style={{ animationDelay: "2.1s" }}
      >
        Ve por ella. Ábrela. Y cuando termines de leer, regresa aquí.
      </p>

      <div className="fade-up" style={{ animationDelay: "2.3s" }}>
        <PhotoGallery />
      </div>

      {!confirmed ? (
        <button
          onClick={handleFound}
          className="fade-up btn-accent rounded-full px-6 py-3 font-medium"
          style={{ animationDelay: "2.5s" }}
        >
          Ya la encontré ❤️
        </button>
      ) : (
        <p className="fade-up font-serif-display italic text-xl text-gradient max-w-xs">
          Ahora solo falta que me des tu respuesta, en persona.
        </p>
      )}

      {showConfetti && <Confetti />}
    </div>
  );
}
