"use client";

import { useState } from "react";
import { FINAL_GALLERY_PHOTOS } from "@/lib/story";

interface PhotoGalleryProps {
  photos?: string[];
}

export default function PhotoGallery({ photos = FINAL_GALLERY_PHOTOS }: PhotoGalleryProps) {
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

  const visiblePhotos = photos.filter((_, i) => !broken.has(i));
  if (visiblePhotos.length === 0) return null;

  return (
    <div className="w-full max-w-sm">
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((src, i) =>
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
