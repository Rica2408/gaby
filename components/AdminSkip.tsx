interface AdminSkipProps {
  label: string;
  onSkip: () => void;
  side?: "left" | "right";
}

export default function AdminSkip({ label, onSkip, side = "right" }: AdminSkipProps) {
  return (
    <button
      onClick={onSkip}
      className={`fixed bottom-4 z-50 rounded-full border border-line bg-background-soft/90 px-3 py-1.5 text-xs text-foreground-dim shadow-lg backdrop-blur ${
        side === "right" ? "right-4" : "left-4"
      }`}
    >
      🔧 {label}
    </button>
  );
}
