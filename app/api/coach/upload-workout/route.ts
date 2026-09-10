import { NextRequest, NextResponse } from "next/server";
import { buildIntervalWorkoutPayload } from "@/lib/garminWorkout";
import { uploadWorkoutToGarmin } from "@/lib/garminClient";

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
  } = body ?? {};

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Faltan datos: email, password y nombre del entrenamiento son requeridos." },
      { status: 400 }
    );
  }

  try {
    const payload = buildIntervalWorkoutPayload({
      name,
      warmupMinutes: Number(warmupMinutes) || 0,
      repeats: Number(repeats) || 0,
      intervalType: intervalType === "time" ? "time" : "distance",
      intervalValue: Number(intervalValue) || 0,
      recoveryType: recoveryType === "time" ? "time" : "distance",
      recoveryValue: Number(recoveryValue) || 0,
      cooldownMinutes: Number(cooldownMinutes) || 0,
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
