import { GarminConnect } from "garmin-connect";
import type { IWorkoutDetail } from "garmin-connect/dist/garmin/types";
import type { GarminWorkoutPayload } from "./garminWorkout";

export interface UploadWorkoutResult {
  workoutId: string;
  scheduled: boolean;
}

// Nunca se guarda el email/password: se usan solo para este login puntual,
// no se persisten en disco, base de datos ni logs.
export async function uploadWorkoutToGarmin(
  email: string,
  password: string,
  payload: GarminWorkoutPayload,
  scheduledDate?: string
): Promise<UploadWorkoutResult> {
  const client = new GarminConnect({ username: email, password });
  await client.login();

  // El payload incluye pasos "RepeatGroupDTO" que el tipado público de la
  // librería no modela (solo cubre workouts simples de un solo paso), pero
  // el endpoint real de Garmin sí los acepta -- de ahí el cast.
  const created = await client.addWorkout(payload as unknown as IWorkoutDetail);
  if (!created.workoutId) {
    throw new Error("Garmin no devolvió un workoutId al crear el entrenamiento.");
  }
  const workoutId = String(created.workoutId);

  let scheduled = false;
  if (scheduledDate) {
    await client.post(`https://connectapi.garmin.com/workout-service/schedule/${workoutId}`, {
      date: scheduledDate,
    });
    scheduled = true;
  }

  return { workoutId, scheduled };
}
