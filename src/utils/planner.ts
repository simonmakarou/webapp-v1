import type {
  Exercise,
  GeneratorContext,
  PlanEntry,
  PlanStore,
} from '@/types/exercises'
import { EQUIPMENT_LABELS } from '@/data'
import { ensureArray, metaLabel, summarizeList } from '@/utils/filters'
import { LS } from '@/utils/localStorage'

const typeOf = (ex: Exercise): string =>
  ex.tags.find((tag) => tag.startsWith('type:')) ?? 'type:mobility'

const areaOf = (ex: Exercise): string =>
  ex.tags.find((tag) => tag.startsWith('area:')) ?? 'area:unknown'

const levelOf = (ex: Exercise): string =>
  ex.tags.find((tag) => tag.startsWith('lvl:')) ?? 'lvl:1'

const countUsage = (ids: string[]): Map<string, number> => {
  const log = LS.get<string[]>('plan.log', [])
  const map = new Map<string, number>()
  ids.forEach((id) => map.set(id, 0))
  log.forEach((id) => {
    if (map.has(id)) {
      map.set(id, (map.get(id) ?? 0) + 1)
    }
  })
  return map
}

export interface PackOptions {
  tolerance?: number
}

export const packByMinutes = (
  rng: () => number,
  candidates: Exercise[],
  requiredTypes: string[],
  targetMin: number,
  lastAreas: string[],
  options: PackOptions = {},
): Exercise[] => {
  const tol = options.tolerance ?? 0.1
  const minMin = Math.round(targetMin * (1 - tol))
  const maxMin = Math.round(targetMin * (1 + tol))
  if (targetMin <= 0 || (minMin <= 0 && maxMin <= 0)) {
    return []
  }

  let pool = candidates.slice()
  if (lastAreas && lastAreas.length > 0) {
    const [primary] = lastAreas
    pool.sort(
      (a, b) => (areaOf(a) === primary ? 1 : 0) - (areaOf(b) === primary ? 1 : 0) || a.duration - b.duration,
    )
  } else {
    pool.sort((a, b) => a.duration - b.duration)
  }

  const byType = (type: string) => pool.filter((ex) => typeOf(ex) === type)
  const picked: Exercise[] = []

  requiredTypes.forEach((type) => {
    const arr = byType(type)
    if (arr.length > 0) {
      const choice = arr[Math.floor(rng() * arr.length)]
      picked.push(choice)
      pool = pool.filter((ex) => ex.id !== choice.id)
    }
  })

  let sum = picked.reduce((acc, ex) => acc + ex.duration, 0)

  while (sum < minMin && pool.length > 0) {
    const remaining = minMin - sum
    pool.sort((a, b) => Math.abs(a.duration - remaining) - Math.abs(b.duration - remaining))
    const next = pool.shift()
    if (!next) break
    picked.push(next)
    sum += next.duration
  }

  while (sum > maxMin && picked.length > 1) {
    let removed = false
    for (let i = picked.length - 1; i >= 0; i -= 1) {
      const t = typeOf(picked[i])
      const countT = picked.filter((item) => typeOf(item) === t).length
      if (countT > 1) {
        sum -= picked[i].duration
        picked.splice(i, 1)
        removed = true
        if (sum <= maxMin) {
          break
        }
      }
    }
    if (!removed) {
      break
    }
  }

  return picked
}

export type RankedExercise = Exercise & { __score: number; __why: string }

export const rankAlternatives = (
  exercise: Exercise,
  candidates: Exercise[],
  context: GeneratorContext,
): RankedExercise[] => {
  const lvlNum = (lvl: string | undefined): number => {
    const raw = lvl?.split(':')[1]
    const parsed = raw ? Number.parseInt(raw, 10) : NaN
    return Number.isFinite(parsed) ? parsed : 1
  }

  const exerciseLevel = lvlNum(levelOf(exercise))
  const usage = countUsage(candidates.map((c) => c.id))
  const availableEquipment = Object.entries(context.equipment)
    .filter(([, value]) => value)
    .map(([key]) => EQUIPMENT_LABELS[key] ?? key)
  const painList = context.painAreas
  const selectedMods = ensureArray(context.selectedMods)

  return candidates
    .map((candidate) => {
      const modSummary = summarizeList(candidate.modifications, 2)
      const sharedMods = selectedMods.length && modSummary ? summarizeList(selectedMods, 1) : ''
      let score = 0
      if (areaOf(candidate) === areaOf(exercise)) score += 3
      if (typeOf(candidate) === typeOf(exercise)) score += 2
      score -= Math.abs(lvlNum(levelOf(candidate)) - exerciseLevel)
      score += 4 / (1 + (usage.get(candidate.id) ?? 0))
      if (modSummary) score += 0.5
      if (painList.length && (!candidate.red_flags || candidate.red_flags.length === 0)) {
        score += 0.25
      }
      const reasonParts: string[] = []
      if (areaOf(candidate) === areaOf(exercise)) {
        reasonParts.push('та же область')
      }
      if (typeOf(candidate) === typeOf(exercise)) {
        reasonParts.push('тот же тип')
      }
      reasonParts.push(`уровень ${levelOf(candidate).split(':')[1] ?? '1'}`)
      if (sharedMods) {
        reasonParts.push(`поддерживает выбранные модификации (${sharedMods} → ${modSummary})`)
      } else if (modSummary) {
        reasonParts.push(`есть модификации: ${modSummary}`)
      }
      if (availableEquipment.length) {
        const eqLabel = EQUIPMENT_LABELS[candidate.equipment ?? 'none'] ?? EQUIPMENT_LABELS.none
        reasonParts.push(`совместимо с вашим оборудованием (${eqLabel.toLowerCase()})`)
      }
      if (painList.length) {
        reasonParts.push(`учитывает ограничения по зонам боли (${painList.join(', ')})`)
      }
      if (candidate.red_flags && candidate.red_flags.length) {
        reasonParts.push(`обрати внимание: ${metaLabel(candidate.red_flags[0])}`)
      }
      return { ...candidate, __score: score, __why: reasonParts.filter(Boolean).join(', ') }
    })
    .sort((a, b) => b.__score - a.__score)
}

const ensureArrayOfStrings = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

const ensureExerciseList = (value: unknown): Exercise[] => {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Exercise => typeof item === 'object' && item !== null && 'id' in item)
    .map((item) => item)
}

const ensureNumber = (value: unknown): number => {
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isFinite(num) && num >= 0 ? Math.round(num) : 0
}

const sanitizeDayPlanEntry = (entry: unknown): PlanEntry | null => {
  if (!entry || typeof entry !== 'object') return null
  const plan = entry as Record<string, unknown>
  const walkingRaw = plan.walking
  const targetsRaw = plan.targets
  if (!walkingRaw || typeof walkingRaw !== 'object') return null
  if (!targetsRaw || typeof targetsRaw !== 'object') return null

  const walkingObj = walkingRaw as Record<string, unknown>
  const walkingId = typeof walkingObj.id === 'string' ? walkingObj.id.trim() : ''
  const walkingName = typeof walkingObj.name === 'string' ? walkingObj.name.trim() : ''
  const walking = {
    id: walkingId || 'session',
    name: walkingName || 'Прогулка',
    note: typeof walkingObj.note === 'string' ? walkingObj.note : '',
    how: ensureArrayOfStrings(walkingObj.how),
  }

  const targetsObj = targetsRaw as Record<string, unknown>
  const targets = {
    walking: ensureNumber(targetsObj.walking),
    stretching: ensureNumber(targetsObj.stretching),
    meditation: ensureNumber(targetsObj.meditation),
    exercises: ensureNumber(targetsObj.exercises),
  }

  return {
    stList: ensureExerciseList(plan.stList),
    lfkList: ensureExerciseList(plan.lfkList),
    medList: ensureExerciseList(plan.medList),
    walking,
    whyBullets: ensureArrayOfStrings(plan.whyBullets),
    primaryArea: typeof plan.primaryArea === 'string' ? plan.primaryArea : 'area:unknown',
    targets,
  }
}

export const sanitizePlanStore = (rawPlan: unknown): PlanStore => {
  if (!rawPlan || typeof rawPlan !== 'object') return {}
  const clean: PlanStore = {}
  Object.entries(rawPlan).forEach(([key, value]) => {
    const sanitized = sanitizeDayPlanEntry(value)
    if (sanitized) {
      clean[key] = sanitized
    }
  })
  return clean
}

export { areaOf, levelOf, typeOf }
