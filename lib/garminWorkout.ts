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

export type IntervalUnit = "distance" | "time";

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
  // intervalValue/recoveryValue are meters when the matching *Type is
  // "distance", or seconds when it's "time".
  intervalType: IntervalUnit;
  intervalValue: number;
  recoveryType: IntervalUnit;
  recoveryValue: number;
  cooldownMinutes: number;
}

export interface GarminWorkoutPayload {
  workoutName: string;
  sportType: typeof SPORT_TYPE;
  workoutSegments: [{ segmentOrder: 1; sportType: typeof SPORT_TYPE; workoutSteps: WorkoutStep[] }];
}

function buildTimedOrDistanceStep(
  order: number,
  stepType: (typeof STEP_TYPE)[keyof typeof STEP_TYPE],
  unit: IntervalUnit,
  value: number
): ExecutableStep {
  return {
    type: "ExecutableStepDTO",
    stepOrder: order,
    stepType,
    endCondition: unit === "time" ? END_CONDITION.time : END_CONDITION.distance,
    endConditionValue: unit === "time" ? Math.round(value) : value,
    targetType: NO_TARGET,
  };
}

export function buildIntervalWorkoutPayload(
  params: GarminIntervalWorkoutParams
): GarminWorkoutPayload {
  const {
    name,
    warmupMinutes,
    repeats,
    intervalType,
    intervalValue,
    recoveryType,
    recoveryValue,
    cooldownMinutes,
  } = params;

  let order = 1;
  const steps: WorkoutStep[] = [];

  if (warmupMinutes > 0) {
    steps.push(buildTimedOrDistanceStep(order++, STEP_TYPE.warmup, "time", warmupMinutes * 60));
  }

  if (repeats > 0 && intervalValue > 0) {
    const repeatOrder = order++;
    const children: ExecutableStep[] = [
      buildTimedOrDistanceStep(order++, STEP_TYPE.interval, intervalType, intervalValue),
    ];

    if (recoveryValue > 0) {
      children.push(
        buildTimedOrDistanceStep(order++, STEP_TYPE.recovery, recoveryType, recoveryValue)
      );
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
    steps.push(buildTimedOrDistanceStep(order++, STEP_TYPE.cooldown, "time", cooldownMinutes * 60));
  }

  return {
    workoutName: name,
    sportType: SPORT_TYPE,
    workoutSegments: [{ segmentOrder: 1, sportType: SPORT_TYPE, workoutSteps: steps }],
  };
}
