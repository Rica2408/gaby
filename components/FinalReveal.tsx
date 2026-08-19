"use client";

import { useState } from "react";
import { CHAPTERS } from "@/lib/story";
import PhotoGallery from "./PhotoGallery";

export default function FinalReveal() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center gap-6">
      <p className="fade-up text-xs uppercase tracking-[0.3em] text-foreground-dim">
        Encontraste todas las pistas
      </p>

      <div className="fade-up flex items-center gap-3 text-4xl">
        {CHAPTERS.map((c) => (
          <span key={c.id}>{c.clueEmoji}</span>
        ))}
      </div>

      <h2 className="fade-up font-serif-display italic text-2xl sm:text-3xl leading-snug max-w-sm">
        Carro. Mochila. Cartera. Ahí está lo que estabas buscando.
      </h2>

      <p className="fade-up text-sm text-foreground-dim max-w-xs">
        Ve por ella. Ábrela. Y cuando termines de leer, regresa aquí.
      </p>

      <PhotoGallery />

      {!confirmed ? (
        <button
          onClick={() => setConfirmed(true)}
          className="fade-up btn-accent rounded-full px-6 py-3 font-medium"
        >
          Ya la encontré ❤️
        </button>
      ) : (
        <p className="fade-up font-serif-display italic text-xl text-gradient max-w-xs">
          Ahora solo falta que me des tu respuesta, en persona.
        </p>
      )}
    </div>
  );
}
