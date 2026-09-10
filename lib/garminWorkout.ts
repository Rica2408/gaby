// Construye el JSON de un entrenamiento estructurado para el endpoint interno
// de Garmin Connect (workout-service). Este schema no es público -- fue
// reconstruido a partir del comportamiento observado de connect.garmin.com y
// de proyectos de la comunidad (garth, python-garminconnect) que documentan
// los mismos IDs de stepType/endCondition/targetType.

const SPORT_TYPE = { sportTypeId: 1, sportTypeKey: "running" } as const;

const STEP_TYPE = {
  warmup: { stepTypeId: 1, stepTypeKey: "warmup" },
  cooldown: { stepTypeId: 2, stepTypeKey: "cooldown" },
  interval: { stepTypeId: 3, stepTypeKey: "interval" },
  recovery: { stepTypeId: 4, stepTypeKey: "recovery" },
  repeat: { stepTypeId: 6, stepTypeKey: "repeat" },
} as const;

const END_CONDITION = {
  time: { conditionTypeId: 2, conditionTypeKey: "time" },
  distance: { conditionTypeId: 3, conditionTypeKey: "distance" },
} as const;

const NO_TARGET = { workoutTargetTypeId: 1, workoutTargetTypeKey: "no.target" } as const;

interface ExecutableStep {
  type: "ExecutableStepDTO";
  stepOrder: number;
  stepType: (typeof STEP_TYPE)[keyof typeof STEP_TYPE];
  endCondition: (typeof END_CONDITION)[keyof typeof END_CONDITION];
  endConditionValue: number;
  targetType: typeof NO_TARGET;
}

interface RepeatGroupStep {
  type: "RepeatGroupDTO";
  stepOrder: number;
  stepType: typeof STEP_TYPE.repeat;
  numberOfIterations: number;
  workoutSteps: ExecutableStep[];
}

type WorkoutStep = ExecutableStep | RepeatGroupStep;

export interface GarminIntervalWorkoutParams {
  name: string;
  warmupMinutes: number;
  repeats: number;
  intervalMeters: number;
  recoveryMeters: number;
  cooldownMinutes: number;
}

export interface GarminWorkoutPayload {
  workoutName: string;
  sportType: typeof SPORT_TYPE;
  workoutSegments: [{ segmentOrder: 1; sportType: typeof SPORT_TYPE; workoutSteps: WorkoutStep[] }];
}

export function buildIntervalWorkoutPayload(
  params: GarminIntervalWorkoutParams
): GarminWorkoutPayload {
  const { name, warmupMinutes, repeats, intervalMeters, recoveryMeters, cooldownMinutes } = params;

  let order = 1;
  const steps: WorkoutStep[] = [];

  if (warmupMinutes > 0) {
    steps.push({
      type: "ExecutableStepDTO",
      stepOrder: order++,
      stepType: STEP_TYPE.warmup,
      endCondition: END_CONDITION.time,
      endConditionValue: Math.round(warmupMinutes * 60),
      targetType: NO_TARGET,
    });
  }

  if (repeats > 0 && intervalMeters > 0) {
    const repeatOrder = order++;
    const children: ExecutableStep[] = [
      {
        type: "ExecutableStepDTO",
        stepOrder: order++,
        stepType: STEP_TYPE.interval,
        endCondition: END_CONDITION.distance,
        endConditionValue: intervalMeters,
        targetType: NO_TARGET,
      },
    ];

    if (recoveryMeters > 0) {
      children.push({
        type: "ExecutableStepDTO",
        stepOrder: order++,
        stepType: STEP_TYPE.recovery,
        endCondition: END_CONDITION.distance,
        endConditionValue: recoveryMeters,
        targetType: NO_TARGET,
      });
    }

    steps.push({
      type: "RepeatGroupDTO",
      stepOrder: repeatOrder,
      stepType: STEP_TYPE.repeat,
      numberOfIterations: repeats,
      workoutSteps: children,
    });
  }

  if (cooldownMinutes > 0) {
    steps.push({
      type: "ExecutableStepDTO",
      stepOrder: order++,
      stepType: STEP_TYPE.cooldown,
      endCondition: END_CONDITION.time,
      endConditionValue: Math.round(cooldownMinutes * 60),
      targetType: NO_TARGET,
    });
  }

  return {
    workoutName: name,
    sportType: SPORT_TYPE,
    workoutSegments: [{ segmentOrder: 1, sportType: SPORT_TYPE, workoutSteps: steps }],
  };
}
