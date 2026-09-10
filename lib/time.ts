// Acepta "mm:ss" (ej. "4:10") o segundos planos (ej. "90") y devuelve el
// total en segundos. Cualquier otra cosa cae a 0.
export function parseMinSecToSeconds(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;

  if (trimmed.includes(":")) {
    const [minPart, secPart] = trimmed.split(":");
    const minutes = Number(minPart);
    const seconds = Number(secPart);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return 0;
    return Math.max(0, Math.round(minutes * 60 + seconds));
  }

  const seconds = Number(trimmed);
  return Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
}

// Inverso de parseMinSecToSeconds, para prellenar el input con "mm:ss".
export function formatSecondsToMinSec(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
