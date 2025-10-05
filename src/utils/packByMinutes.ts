export function packByMinutes(durations: number[], limit: number): number[][] {
  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error('Limit must be a positive number of minutes')
  }

  const result: number[][] = []
  let current: number[] = []
  let total = 0

  for (const duration of durations) {
    if (!Number.isFinite(duration) || duration < 0) {
      continue
    }

    if (duration >= limit) {
      if (current.length) {
        result.push(current)
        current = []
        total = 0
      }
      result.push([duration])
      continue
    }

    if (total + duration > limit) {
      if (current.length) {
        result.push(current)
      }
      current = [duration]
      total = duration
    } else {
      current.push(duration)
      total += duration
    }
  }

  if (current.length) {
    result.push(current)
  }

  return result
}
