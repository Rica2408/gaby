"use client";

import { useState, type FormEvent } from "react";

type IntervalUnit = "distance" | "time";

interface FormState {
  email: string;
  password: string;
  name: string;
  warmupMinutes: string;
  repeats: string;
  intervalType: IntervalUnit;
  intervalValue: string;
  recoveryType: IntervalUnit;
  recoveryValue: string;
  cooldownMinutes: string;
  scheduledDate: string;
  usePaceTarget: boolean;
  intervalPaceFast: string;
  intervalPaceSlow: string;
}

const INITIAL: FormState = {
  email: "",
  password: "",
  name: "",
  warmupMinutes: "10",
  repeats: "6",
  intervalType: "distance",
  intervalValue: "400",
  recoveryType: "distance",
  recoveryValue: "200",
  cooldownMinutes: "10",
  scheduledDate: "",
  usePaceTarget: false,
  intervalPaceFast: "4:50",
  intervalPaceSlow: "5:00",
};

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "success"; workoutId: string; scheduled: boolean } | { kind: "error"; message: string };

export default function CoachPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/coach/upload-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          intervalPaceFast: form.usePaceTarget ? form.intervalPaceFast : "",
          intervalPaceSlow: form.usePaceTarget ? form.intervalPaceSlow : "",
        }),
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
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 items-end">
          <label className="flex flex-col gap-1 text-sm text-foreground-dim min-w-0">
            Intervalo por
            <select
              value={form.intervalType}
              onChange={(e) => {
                const next = e.target.value as IntervalUnit;
                update("intervalType", next);
                update("intervalValue", next === "time" ? "1:30" : "400");
              }}
              className="input-field w-full rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            >
              <option value="distance">Distancia</option>
              <option value="time">Tiempo</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground-dim min-w-0">
            {form.intervalType === "time" ? "Duración del intervalo (mm:ss)" : "Distancia del intervalo (m)"}
            <input
              type={form.intervalType === "time" ? "text" : "number"}
              inputMode={form.intervalType === "time" ? "text" : "numeric"}
              min={form.intervalType === "time" ? undefined : 0}
              placeholder={form.intervalType === "time" ? "4:10" : undefined}
              value={form.intervalValue}
              onChange={(e) => update("intervalValue", e.target.value)}
              className="input-field w-full min-w-0 rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-foreground-dim min-w-0">
            Recuperación por
            <select
              value={form.recoveryType}
              onChange={(e) => {
                const next = e.target.value as IntervalUnit;
                update("recoveryType", next);
                update("recoveryValue", next === "time" ? "1:00" : "200");
              }}
              className="input-field w-full rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            >
              <option value="distance">Distancia</option>
              <option value="time">Tiempo</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground-dim min-w-0">
            {form.recoveryType === "time" ? "Duración de la recuperación (mm:ss)" : "Distancia de la recuperación (m)"}
            <input
              type={form.recoveryType === "time" ? "text" : "number"}
              inputMode={form.recoveryType === "time" ? "text" : "numeric"}
              min={form.recoveryType === "time" ? undefined : 0}
              placeholder={form.recoveryType === "time" ? "1:00" : undefined}
              value={form.recoveryValue}
              onChange={(e) => update("recoveryValue", e.target.value)}
              className="input-field w-full min-w-0 rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground-dim">
          <input
            type="checkbox"
            checked={form.usePaceTarget}
            onChange={(e) => update("usePaceTarget", e.target.checked)}
            className="h-4 w-4 accent-accent-purple"
          />
          Agregar ritmo objetivo al intervalo
        </label>

        {form.usePaceTarget && (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-foreground-dim min-w-0">
              Rápido (mm:ss/km)
              <input
                type="text"
                inputMode="text"
                placeholder="4:50"
                value={form.intervalPaceFast}
                onChange={(e) => update("intervalPaceFast", e.target.value)}
                className="input-field w-full min-w-0 rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-foreground-dim min-w-0">
              Lento (mm:ss/km)
              <input
                type="text"
                inputMode="text"
                placeholder="5:00"
                value={form.intervalPaceSlow}
                onChange={(e) => update("intervalPaceSlow", e.target.value)}
                className="input-field w-full min-w-0 rounded-md border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent-purple"
              />
            </label>
          </div>
        )}

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
