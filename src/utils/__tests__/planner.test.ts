import { describe, expect, it, beforeEach } from 'vitest'

import { EQUIPMENT_DEFAULTS, EX_LFK, EX_MEDIT, EX_STRETCH } from '@/data'
import { rngFrom } from '@/utils/random'
import { LS } from '@/utils/localStorage'
import { packByMinutes, rankAlternatives, sanitizePlanStore } from '@/utils/planner'

const sumDuration = (list: { duration: number }[]): number => list.reduce((acc, item) => acc + item.duration, 0)

describe('packByMinutes', () => {
  it('respects tolerance window and keeps required types', () => {
    const rng = rngFrom('vitest-pack')
    const required = ['type:mobility', 'type:stability']
    const result = packByMinutes(rng, EX_STRETCH, required, 32, ['area:neck'], { tolerance: 0.15 })

    expect(result.length).toBeGreaterThanOrEqual(2)
    const total = sumDuration(result)
    expect(total).toBeGreaterThanOrEqual(Math.round(32 * (1 - 0.15)))
    expect(total).toBeLessThanOrEqual(Math.round(32 * (1 + 0.15)))

    const pickedTypes = new Set(result.map((ex) => ex.tags.find((tag) => tag.startsWith('type:'))))
    required.forEach((type) => {
      expect(pickedTypes.has(type)).toBe(true)
    })
  })
})

describe('rankAlternatives', () => {
  beforeEach(() => {
    LS.set('plan.log', ['neck_upper_trap_stretch', 'neck_upper_trap_stretch'])
  })

  it('prioritises matches by area/type and penalises recently used items', () => {
    const base = EX_STRETCH.find((ex) => ex.id === 'neck_decompress')
    expect(base).toBeDefined()
    if (!base) return

    const candidates = EX_STRETCH.filter((ex) => ex.id !== base.id && ex.tags.includes('area:neck')).slice(0, 5)
    const ranked = rankAlternatives(base, candidates, {
      equipment: { ...EQUIPMENT_DEFAULTS, towel: true },
      painAreas: ['шея'],
      selectedMods: base.modifications,
    })

    expect(ranked.length).toBeGreaterThan(0)
    expect(ranked[0].id).not.toBe('neck_upper_trap_stretch')
    expect(ranked[0].tags).toContain('area:neck')
    expect(ranked[0].tags.some((tag) => tag.startsWith('type:'))).toBe(true)
    expect(ranked[0].__score).toBeGreaterThanOrEqual(ranked.at(-1)?.__score ?? 0)
    expect(ranked[0].__why).toMatch(/уровень/)
  })
})

describe('sanitizePlanStore', () => {
  it('filters invalid records and normalises primitives', () => {
    const raw = {
      w1d1: {
        stList: [EX_STRETCH[0], null, { foo: 'bar' }],
        lfkList: [EX_LFK[0]],
        medList: [EX_MEDIT[0]],
        walking: { id: '', name: 123, note: null, how: ['шаг', '', 42] },
        whyBullets: ['тема дня', '', 7],
        primaryArea: null,
        targets: { walking: '45', stretching: 30.4, meditation: '18', exercises: -5 },
      },
      invalid: null,
    }

    const clean = sanitizePlanStore(raw)
    expect(Object.keys(clean)).toEqual(['w1d1'])
    const entry = clean.w1d1
    expect(entry.walking.id).toBe('session')
    expect(entry.walking.name).toBe('Прогулка')
    expect(entry.walking.how).toEqual(['шаг'])
    expect(entry.targets.walking).toBe(45)
    expect(entry.targets.meditation).toBe(18)
    expect(entry.targets.exercises).toBe(0)
    expect(entry.whyBullets).toEqual(['тема дня'])
  })
})
