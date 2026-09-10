"use client";

import { useState, type FormEvent } from "react";

interface FormState {
  email: string;
  password: string;
  name: string;
  warmupMinutes: string;
  repeats: string;
  intervalMeters: string;
  recoveryMeters: string;
  cooldownMinutes: string;
  scheduledDate: string;
}

const INITIAL: FormState = {
  email: "",
  password: "",
  name: "",
  warmupMinutes: "10",
  repeats: "6",
  intervalMeters: "400",
  recoveryMeters: "200",
  cooldownMinutes: "10",
  scheduledDate: "",
};

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "success"; workoutId: string; scheduled: boolean } | { kind: "error"; message: string };

export default function CoachPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/coach/upload-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo subir el entrenamiento.");
      }
      setStatus({ kind: "success", workoutId: data.workoutId, scheduled: data.scheduled });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Error inesperado.",
      });
    }
  }

  const loading = status.kind === "loading";

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16 gap-6">
      <div className="text-center max-w-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground-dim">Coach Running</p>
        <h1 className="font-serif-display italic text-2xl sm:text-3xl mt-2">
          Sube tu entrenamiento a Garmin
        </h1>
        <p className="text-sm text-foreground-dim mt-3">
          Mete tu usuario de Garmin Connect y los datos del entreno. Se crea directo en tu
          calendario, sin tener que armarlo a mano en la app.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface rounded-2xl p-5 w-full max-w-sm flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-foreground-dim">
          Email de Garmin Connect
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-foreground-dim">
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-foreground-dim">
          Nombre del entrenamiento
          <input
            type="text"
            required
            placeholder="Series 6x400m"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-foreground-dim">
            Calentamiento (min)
            <input
              type="number"
              min={0}
              value={form.warmupMinutes}
              onChange={(e) => update("warmupMinutes", e.target.value)}
              className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground-dim">
            Enfriamiento (min)
            <input
              type="number"
              min={0}
              value={form.cooldownMinutes}
              onChange={(e) => update("cooldownMinutes", e.target.value)}
              className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground-dim">
            Repeticiones
            <input
              type="number"
              min={0}
              value={form.repeats}
              onChange={(e) => update("repeats", e.target.value)}
              className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground-dim">
            Intervalo (m)
            <input
              type="number"
              min={0}
              value={form.intervalMeters}
              onChange={(e) => update("intervalMeters", e.target.value)}
              className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground-dim col-span-2">
            Recuperación entre series (m)
            <input
              type="number"
              min={0}
              value={form.recoveryMeters}
              onChange={(e) => update("recoveryMeters", e.target.value)}
              className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-foreground-dim">
          Programar para el día (opcional)
          <input
            type="date"
            value={form.scheduledDate}
            onChange={(e) => update("scheduledDate", e.target.value)}
            className="input-field rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
          />
        </label>

        <button type="submit" disabled={loading} className="btn-accent rounded-full px-5 py-3 font-medium mt-2 disabled:opacity-50">
          {loading ? "Subiendo..." : "Subir a Garmin"}
        </button>

        {status.kind === "success" && (
          <p className="fade-up text-sm text-gradient text-center">
            Listo — entrenamiento creado (#{status.workoutId})
            {status.scheduled ? " y programado en tu calendario." : "."}
          </p>
        )}
        {status.kind === "error" && (
          <p className="fade-up text-sm text-accent-red text-center">{status.message}</p>
        )}
      </form>

      <p className="text-xs text-foreground-dim max-w-sm text-center">
        Tu usuario y contraseña se usan solo en el momento para iniciar sesión en Garmin — no se
        guardan en ningún servidor ni log. Esta integración usa el endpoint interno que usa la web
        de Garmin Connect (no es una API oficial), así que puede dejar de funcionar si Garmin
        cambia algo de su lado.
      </p>
    </div>
  );
}
