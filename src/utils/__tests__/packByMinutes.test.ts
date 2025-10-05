import { describe, expect, it } from 'vitest'
import { packByMinutes } from '../packByMinutes'

describe('packByMinutes', () => {
  it('groups consecutive durations within a limit', () => {
    const chunks = packByMinutes([10, 5, 20, 15], 25)

    expect(chunks).toEqual([[10, 5], [20], [15]])
  })

  it('ignores negative and non-finite values', () => {
    const chunks = packByMinutes([10, -5, Number.NaN, 8], 15)

    expect(chunks).toEqual([[10], [8]])
  })
})
