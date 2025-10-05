import type { Exercise, ExerciseMeta, ExerciseSeed } from '@/types/exercises'

export const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is T => item !== undefined && item !== null)
  }
  if (value === undefined || value === null) {
    return []
  }
  return [value]
}

export const metaLabel = (item: ExerciseMeta): string => {
  if (!item) return ''
  if (typeof item === 'string') return item
  return (
    item.label ||
    item.title ||
    item.name ||
    item.text ||
    item.cue ||
    item.description ||
    item.note ||
    item.detail ||
    (item.id ? String(item.id) : '')
  )
}

export const metaNote = (item: ExerciseMeta): string => {
  if (!item || typeof item === 'string') {
    return ''
  }
  return item.note || item.detail || item.description || item.text || ''
}

export const summarizeList = (items: ExerciseMeta[] | ExerciseMeta | null | undefined, max = 2): string => {
  const arr = ensureArray(items)
  if (!arr.length) return ''
  const labels = arr.map(metaLabel).filter(Boolean)
  if (!labels.length) return ''
  const shown = labels.slice(0, max).join(', ')
  return labels.length > max ? `${shown}…` : shown
}

export const withExerciseMeta = (list: ExerciseSeed[]): Exercise[] =>
  list.map((ex) => ({
    ...ex,
    video_url: ex.video_url ?? null,
    modifications: ensureArray(ex.modifications ?? []),
    variations: ensureArray(ex.variations ?? []),
    cueing: ensureArray(ex.cueing ?? []),
    red_flags: ensureArray(ex.red_flags ?? []),
    alternatives: ensureArray(ex.alternatives ?? []),
  }))
