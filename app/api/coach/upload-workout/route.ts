import { NextRequest, NextResponse } from "next/server";
import { buildIntervalWorkoutPayload } from "@/lib/garminWorkout";
import { uploadWorkoutToGarmin } from "@/lib/garminClient";
import { parseMinSecToSeconds } from "@/lib/time";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    email,
    password,
    name,
    warmupMinutes,
    repeats,
    intervalType,
    intervalValue,
    recoveryType,
    recoveryValue,
    cooldownMinutes,
    scheduledDate,
    intervalPaceFast,
    intervalPaceSlow,
  } = body ?? {};

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Faltan datos: email, password y nombre del entrenamiento son requeridos." },
      { status: 400 }
    );
  }

  try {
    const isIntervalTime = intervalType === "time";
    const isRecoveryTime = recoveryType === "time";

    const fastSecondsPerKm = parseMinSecToSeconds(String(intervalPaceFast ?? ""));
    const slowSecondsPerKm = parseMinSecToSeconds(String(intervalPaceSlow ?? ""));

    const payload = buildIntervalWorkoutPayload({
      name,
      warmupMinutes: Number(warmupMinutes) || 0,
      repeats: Number(repeats) || 0,
      intervalType: isIntervalTime ? "time" : "distance",
      intervalValue: isIntervalTime
        ? parseMinSecToSeconds(String(intervalValue ?? ""))
        : Number(intervalValue) || 0,
      recoveryType: isRecoveryTime ? "time" : "distance",
      recoveryValue: isRecoveryTime
        ? parseMinSecToSeconds(String(recoveryValue ?? ""))
        : Number(recoveryValue) || 0,
      cooldownMinutes: Number(cooldownMinutes) || 0,
      intervalPace:
        fastSecondsPerKm > 0 && slowSecondsPerKm > 0
          ? { fastSecondsPerKm, slowSecondsPerKm }
          : undefined,
    });

    const result = await uploadWorkoutToGarmin(
      email,
      password,
      payload,
      typeof scheduledDate === "string" && scheduledDate ? scheduledDate : undefined
    );

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "No se pudo subir el entrenamiento a Garmin.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
