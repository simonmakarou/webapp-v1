import type { GoalConfig, GoalOption } from '@/types/exercises'

export const GOAL_CONFIG: GoalConfig = {
  rehab: {
    factor: 0.75,
    title: 'Реабилитация',
    description: 'Мягкий объём, упор на восстановление и безопасность.',
  },
  prevent: {
    factor: 1.0,
    title: 'Профилактика',
    description: 'Базовая поддержка и снятие напряжений в течение недели.',
  },
  support: {
    factor: 1.15,
    title: 'Поддержка формы',
    description: 'Чуть больше объёма и прогрессии для регулярной практики.',
  },
}

export const GOAL_OPTIONS: GoalOption[] = [
  { id: 'rehab', title: 'Реабилитация', description: 'после травмы/болезни' },
  { id: 'prevent', title: 'Профилактика', description: 'сидячая работа, дискомфорт' },
  { id: 'support', title: 'Поддержка формы', description: 'регулярная практика' },
]
