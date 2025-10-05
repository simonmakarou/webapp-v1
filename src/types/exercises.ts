export type EquipmentId =
  | 'none'
  | 'mat'
  | 'band'
  | 'wall'
  | 'towel'
  | 'foamroller'
  | 'kettlebell'
  | 'stick'
  | 'dumbbell'
  | 'ball'
  | 'bench'
  | 'board'
  | 'lightweight'
  | 'pad'
  | 'rope'
  | 'slider'
  | 'step'
  | 'strap';

export type ExerciseTag = string;

export interface ExerciseMetaDetail {
  id?: string;
  label?: string;
  title?: string;
  name?: string;
  text?: string;
  cue?: string;
  description?: string;
  detail?: string;
  note?: string;
}

export type ExerciseMeta = string | ExerciseMetaDetail;

export interface ExerciseAlternative {
  id: string;
  note?: string;
}

export interface Exercise {
  id: string;
  name: string;
  duration: number;
  equipment?: EquipmentId | string;
  tags: ExerciseTag[];
  steps?: string[];
  focus?: string[];
  mistakes?: string[];
  mechanism?: string;
  contraindications?: string;
  progressions?: string[];
  video_url: string | null;
  modifications: ExerciseMeta[];
  variations: ExerciseMeta[];
  cueing: ExerciseMeta[];
  red_flags: ExerciseMeta[];
  alternatives: Array<ExerciseAlternative | string>;
}

export type ExerciseSeed = Omit<
  Exercise,
  'video_url' | 'modifications' | 'variations' | 'cueing' | 'red_flags' | 'alternatives'
> &
  Partial<Pick<Exercise, 'video_url' | 'modifications' | 'variations' | 'cueing' | 'red_flags' | 'alternatives'>>;

export interface WalkingPreset {
  id: string;
  name: string;
  how: string[];
  note: string;
}

export interface DayTargets {
  walking: number;
  stretching: number;
  meditation: number;
  exercises: number;
}

export interface PlanEntry {
  stList: Exercise[];
  lfkList: Exercise[];
  medList: Exercise[];
  walking: WalkingPreset;
  whyBullets: string[];
  primaryArea: string;
  targets: DayTargets;
}

export type PlanStore = Record<string, PlanEntry>;

export type GoalId = 'rehab' | 'prevent' | 'support';

export interface GoalSettings {
  factor: number;
  title: string;
  description: string;
}

export type GoalConfig = Record<GoalId, GoalSettings>;

export interface Theme {
  id: string;
  dow: number;
  title: string;
  pools: string[];
  include: string[];
}

export interface GoalOption {
  id: GoalId;
  title: string;
  description: string;
}

export interface Profile {
  goal: GoalId;
  startDate: string;
  equipment: Record<string, boolean>;
}

export interface GeneratorContext {
  equipment: Record<string, boolean>;
  painAreas: string[];
  selectedMods?: ExerciseMeta[];
}
