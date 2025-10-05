import type { Theme } from '@/types/exercises'

export const THEMES: Theme[] = [
  { id: 'mon_posture', dow: 1, title: 'Осанка и шея', pools: ['area:neck', 'area:tspine'], include: ['type:mobility', 'type:stability', 'type:balance'] },
  { id: 'tue_shoulders', dow: 2, title: 'Плечи и грудной', pools: ['area:shoulder', 'area:tspine'], include: ['type:mobility', 'type:stability'] },
  { id: 'wed_posterior', dow: 3, title: 'Таз и задняя цепь', pools: ['area:hips', 'area:hamstrings'], include: ['type:mobility', 'type:strength'] },
  { id: 'thu_ankle', dow: 4, title: 'Стопа и голеностоп', pools: ['area:ankle', 'area:balance'], include: ['type:mobility', 'type:strength'] },
  { id: 'fri_integration', dow: 5, title: 'Интеграция и координация', pools: ['area:core', 'area:balance'], include: ['type:stability', 'type:balance'] },
  { id: 'sat_deload', dow: 6, title: 'Длинная прогулка + мобилити', pools: ['area:hips', 'area:tspine'], include: ['type:mobility'] },
  { id: 'sun_active', dow: 7, title: 'Активное восстановление', pools: ['area:breath', 'area:balance', 'area:neck', 'area:tspine', 'area:shoulder', 'area:hips', 'area:hamstrings'], include: ['type:awareness', 'type:breath', 'type:mobility'] },
]
