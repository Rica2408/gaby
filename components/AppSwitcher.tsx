"use client";

import { useRouter, usePathname } from "next/navigation";

const APPS = [
  { value: "novios", label: "💕 Novios", href: "/novios" },
  { value: "coach", label: "🏃 Coach", href: "/coach" },
];

export default function AppSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = APPS.find((a) => pathname.startsWith(a.href))?.value ?? "novios";

  return (
    <select
      value={current}
      onChange={(e) => {
        const app = APPS.find((a) => a.value === e.target.value);
        if (app) router.push(app.href);
      }}
      aria-label="Cambiar de app"
      className="fixed top-3 right-3 z-[60] rounded-full border border-line bg-background-soft/90 px-3 py-1.5 text-xs text-foreground-dim shadow-lg backdrop-blur outline-none"
    >
      {APPS.map((a) => (
        <option key={a.value} value={a.value}>
          {a.label}
        </option>
      ))}
    </select>
  );
}
