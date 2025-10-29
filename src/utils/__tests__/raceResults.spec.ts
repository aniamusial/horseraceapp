import { describe, it, expect } from 'vitest'
import { calculateRaceResults } from '../raceResults'
import type { Horse } from '@/types'
import { COMMON_VALUES, createMockHorse } from '@/components/__tests__/fixtures/mocks'

describe('raceResults', () => {
  describe('calculateRaceResults', () => {
    it('converts simulated horses to race results', () => {
      const simulatedHorses: Horse[] = [
        createMockHorse({
          id: 1,
          name: 'Winner',
          condition: COMMON_VALUES.CONDITIONS.VERY_HIGH,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: COMMON_VALUES.FINISH_TIMES.MEDIUM,
        }),
        createMockHorse({
          id: 2,
          name: 'Second Place',
          condition: COMMON_VALUES.CONDITIONS.HIGH,
          color: COMMON_VALUES.COLORS.GREEN,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: 5100,
        }),
        createMockHorse({
          id: 3,
          name: 'Third Place',
          condition: COMMON_VALUES.CONDITIONS.MEDIUM_HIGH,
          color: COMMON_VALUES.COLORS.BLUE,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: COMMON_VALUES.FINISH_TIMES.SLOW,
        }),
      ]

      const results = calculateRaceResults(simulatedHorses)

      expect(results).toHaveLength(3)
      expect(results[0]).toEqual({
        position: 1,
        horseName: 'Winner',
        horseId: 1,
        time: COMMON_VALUES.FINISH_TIMES.MEDIUM,
      })
      expect(results[1]).toEqual({
        position: 2,
        horseName: 'Second Place',
        horseId: 2,
        time: 5100,
      })
      expect(results[2]).toEqual({
        position: 3,
        horseName: 'Third Place',
        horseId: 3,
        time: COMMON_VALUES.FINISH_TIMES.SLOW,
      })
    })

    it('assigns positions based on array order', () => {
      const simulatedHorses: Horse[] = [
        createMockHorse({
          id: 3,
          name: 'First',
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: COMMON_VALUES.FINISH_TIMES.FAST,
        }),
        createMockHorse({
          id: 1,
          name: 'Second',
          condition: COMMON_VALUES.CONDITIONS.HIGH,
          color: COMMON_VALUES.COLORS.GREEN,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: COMMON_VALUES.FINISH_TIMES.VERY_FAST,
        }),
        createMockHorse({
          id: 2,
          name: 'Third',
          condition: COMMON_VALUES.CONDITIONS.MEDIUM_HIGH,
          color: COMMON_VALUES.COLORS.BLUE,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: COMMON_VALUES.FINISH_TIMES.MEDIUM,
        }),
      ]

      const results = calculateRaceResults(simulatedHorses)

      expect(results[0]?.position).toBe(1)
      expect(results[0]?.horseId).toBe(3)
      expect(results[1]?.position).toBe(2)
      expect(results[1]?.horseId).toBe(1)
      expect(results[2]?.position).toBe(3)
      expect(results[2]?.horseId).toBe(2)
    })

    it('handles horses without finish time', () => {
      const simulatedHorses: Horse[] = [
        createMockHorse({
          id: 1,
          name: 'Horse 1',
          condition: COMMON_VALUES.CONDITIONS.HIGH,
          position: COMMON_VALUES.POSITIONS.FINISH,
        }),
        createMockHorse({
          id: 2,
          name: 'Horse 2',
          condition: COMMON_VALUES.CONDITIONS.MEDIUM_HIGH,
          color: COMMON_VALUES.COLORS.GREEN,
          position: COMMON_VALUES.POSITIONS.HALF,
        }),
      ]

      const results = calculateRaceResults(simulatedHorses)

      expect(results[0]?.time).toBe(0)
      expect(results[1]?.time).toBe(0)
    })

    it('handles empty array', () => {
      const results = calculateRaceResults([])

      expect(results).toEqual([])
    })

    it('handles single horse', () => {
      const simulatedHorses: Horse[] = [
        createMockHorse({
          id: 1,
          name: 'Solo Runner',
          condition: COMMON_VALUES.CONDITIONS.HIGH,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: 5500,
        }),
      ]

      const results = calculateRaceResults(simulatedHorses)

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        position: 1,
        horseName: 'Solo Runner',
        horseId: 1,
        time: 5500,
      })
    })

    it('handles large number of horses', () => {
      const simulatedHorses: Horse[] = Array.from({ length: 20 }, (_, i) =>
        createMockHorse({
          id: i + 1,
          name: `Horse ${i + 1}`,
          condition: COMMON_VALUES.CONDITIONS.MEDIUM + i,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: COMMON_VALUES.FINISH_TIMES.MEDIUM + i * 100,
        }),
      )

      const results = calculateRaceResults(simulatedHorses)

      expect(results).toHaveLength(20)
      expect(results[0]?.position).toBe(1)
      expect(results[19]?.position).toBe(20)
      expect(results[9]?.horseName).toBe('Horse 10')
      expect(results[9]?.time).toBe(5900)
    })

    it('preserves all horse properties in the result', () => {
      const simulatedHorses: Horse[] = [
        createMockHorse({
          id: 42,
          condition: COMMON_VALUES.CONDITIONS.VERY_HIGH,
          color: COMMON_VALUES.COLORS.UNKNOWN,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: COMMON_VALUES.FINISH_TIMES.VERY_SLOW,
        }),
      ]

      const results = calculateRaceResults(simulatedHorses)

      expect(results[0]?.horseId).toBe(42)
      expect(results[0]?.horseName).toBe('Test Horse')
      expect(results[0]?.time).toBe(COMMON_VALUES.FINISH_TIMES.VERY_SLOW)
    })

    it('handles horses with finishTime of 0', () => {
      const simulatedHorses: Horse[] = [
        createMockHorse({
          id: 1,
          name: 'Horse 1',
          condition: COMMON_VALUES.CONDITIONS.HIGH,
          position: COMMON_VALUES.POSITIONS.FINISH,
          finishTime: 0,
        }),
      ]

      const results = calculateRaceResults(simulatedHorses)

      expect(results[0]?.time).toBe(0)
    })
  })
})
