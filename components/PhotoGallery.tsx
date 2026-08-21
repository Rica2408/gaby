"use client";

import { useState } from "react";

// Coloca tus fotos en /public/photos con estos nombres (o cambia la lista).
const PHOTOS = [
  "/photos/1.jpg",
  "/photos/2.jpg",
  "/photos/3.jpg",
  "/photos/4.jpg",
  "/photos/5.jpg",
  "/photos/6.jpg",
];

export default function PhotoGallery() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [broken, setBroken] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const visiblePhotos = PHOTOS.filter((_, i) => !broken.has(i));
  if (visiblePhotos.length === 0) return null;

  return (
    <div className="w-full max-w-sm">
      <p className="text-xs text-foreground-dim text-center mb-2">
        Toca una foto para verla a color
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {PHOTOS.map((src, i) =>
          broken.has(i) ? null : (
            <button
              key={src}
              onClick={() => toggle(i)}
              className="group aspect-square overflow-hidden rounded-md border border-line transition-shadow duration-300 hover:shadow-[0_0_0_2px_var(--accent-purple)] active:scale-95"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                onError={() =>
                  setBroken((prev) => new Set(prev).add(i))
                }
                className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                  revealed.has(i) ? "grayscale-0 scale-105" : "grayscale group-hover:grayscale-0"
                }`}
              />
            </button>
          )
        )}
      </div>
    </div>
  );
}
