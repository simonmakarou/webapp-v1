export type ExerciseTag = 
  | 'area:neck'
  | 'area:tspine'
  | 'area:shoulder'
  | 'area:breath'
  | 'type:mobility'
  | 'type:stability'
  | 'type:balance'
  | 'type:breath'
  | 'lvl:1'
  | 'pos:standing';

export type Equipment = 'none' | 'mat' | 'band' | 'wall';

export interface Exercise {
  id: string;
  name: string;
  duration: number;
  equipment: Equipment;
  tags: ExerciseTag[];
  steps: string[];
  mechanism: string;
  focus?: string[];
  mistakes?: string[];
  contraindications?: string;
  progressions?: string[];
  video_url?: string;
  modifications?: any[]; // TODO: Define specific type
}

export interface ExerciseGroup {
  stretching: Exercise[];
  therapeutic: Exercise[];
  meditation: Exercise[];
}

export interface Theme {
  id: string;
  dow: number;
  title: string;
  pools: string[];
  include: string[];
}