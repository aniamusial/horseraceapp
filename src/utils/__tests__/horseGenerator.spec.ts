/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import {
  generateHorses,
  selectRandomHorses,
  generateRaceProgram,
  calculateHorseSpeed,
  simulateRace,
} from '../horseGenerator'
import type { Horse, Race } from '@/types'
import {
  COMMON_VALUES,
  createMockHorse,
  createMockRace,
} from '@/components/__tests__/fixtures/mocks'

describe('horseGenerator', () => {
  describe('generateHorses', () => {
    it('should generate 20 horses', () => {
      const horses = generateHorses()
      expect(horses).toHaveLength(20)
    })

    it('should generate horses with required properties', () => {
      const horses = generateHorses()
      horses.forEach((horse) => {
        expect(horse).toHaveProperty('id')
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('condition')
        expect(horse).toHaveProperty('color')
      })
    })

    it('should generate horses with unique IDs', () => {
      const horses = generateHorses()
      const ids = horses.map((h) => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(20)
    })

    it('should generate horses with conditions between 1 and 100', () => {
      const horses = generateHorses()
      horses.forEach((horse) => {
        expect(horse.condition).toBeGreaterThanOrEqual(1)
        expect(horse.condition).toBeLessThanOrEqual(100)
      })
    })

    it('should generate horses with valid color hex codes', () => {
      const horses = generateHorses()
      horses.forEach((horse) => {
        expect(horse.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })
  })

  describe('selectRandomHorses', () => {
    const allHorses: Horse[] = generateHorses()

    it('should select default 10 horses when count not specified', () => {
      const selected = selectRandomHorses(allHorses)
      expect(selected).toHaveLength(10)
    })

    it('should select specified number of horses', () => {
      const selected = selectRandomHorses(allHorses, 5)
      expect(selected).toHaveLength(5)
    })

    it('should reset position to 0 for selected horses', () => {
      const selected = selectRandomHorses(allHorses)
      selected.forEach((horse) => {
        expect(horse.position).toBe(0)
      })
    })

    it('should reset finishTime to undefined for selected horses', () => {
      const selected = selectRandomHorses(allHorses)
      selected.forEach((horse) => {
        expect(horse.finishTime).toBeUndefined()
      })
    })

    it('should not modify original horses array', () => {
      const originalLength = allHorses.length
      selectRandomHorses(allHorses)
      expect(allHorses).toHaveLength(originalLength)
    })
  })

  describe('generateRaceProgram', () => {
    const allHorses: Horse[] = generateHorses()

    it('should generate 6 races', () => {
      const program = generateRaceProgram(allHorses)
      expect(program).toHaveLength(6)
    })

    it('should generate races with correct distances', () => {
      const program = generateRaceProgram(allHorses)

      expect(program[0].distance).toBe(COMMON_VALUES.DISTANCES.D1200)
      expect(program[1].distance).toBe(COMMON_VALUES.DISTANCES.D1400)
      expect(program[2].distance).toBe(COMMON_VALUES.DISTANCES.D1600)
      expect(program[3].distance).toBe(COMMON_VALUES.DISTANCES.D1800)
      expect(program[4].distance).toBe(COMMON_VALUES.DISTANCES.D2000)
      expect(program[5].distance).toBe(COMMON_VALUES.DISTANCES.D2200)
    })

    it('should generate races with sequential round numbers', () => {
      const program = generateRaceProgram(allHorses)
      program.forEach((race, index) => {
        expect(race.roundNumber).toBe(index + 1)
      })
    })

    it('should generate races with 10 horses each', () => {
      const program = generateRaceProgram(allHorses)
      program.forEach((race) => {
        expect(race.horses).toHaveLength(10)
      })
    })

    it('should generate races with pending status', () => {
      const program = generateRaceProgram(allHorses)
      program.forEach((race) => {
        expect(race.status).toBe('pending')
      })
    })

    it('should generate races with undefined results', () => {
      const program = generateRaceProgram(allHorses)
      program.forEach((race) => {
        expect(race.results).toBeUndefined()
      })
    })
  })

  describe('calculateHorseSpeed', () => {
    it('should return higher speed for higher condition horses', () => {
      const lowConditionHorse: Horse = createMockHorse({
        id: 1,
        name: 'Slow Horse',
        condition: 10,
      })
      const highConditionHorse: Horse = createMockHorse({
        id: 2,
        name: 'Fast Horse',
        condition: COMMON_VALUES.CONDITIONS.HIGH,
        color: COMMON_VALUES.COLORS.GREEN,
      })

      // Run multiple times due to randomness
      const lowSpeeds: number[] = []
      const highSpeeds: number[] = []

      for (let i = 0; i < 100; i++) {
        lowSpeeds.push(calculateHorseSpeed(lowConditionHorse, COMMON_VALUES.DISTANCES.D1600))
        highSpeeds.push(calculateHorseSpeed(highConditionHorse, COMMON_VALUES.DISTANCES.D1600))
      }

      const avgLowSpeed = lowSpeeds.reduce((a, b) => a + b, 0) / lowSpeeds.length
      const avgHighSpeed = highSpeeds.reduce((a, b) => a + b, 0) / highSpeeds.length

      expect(avgHighSpeed).toBeGreaterThan(avgLowSpeed)
    })

    it('should return positive speed values', () => {
      const horse: Horse = createMockHorse({
        condition: COMMON_VALUES.CONDITIONS.LOW,
      })

      for (let i = 0; i < 50; i++) {
        const speed = calculateHorseSpeed(horse, COMMON_VALUES.DISTANCES.D1600)
        expect(speed).toBeGreaterThan(0)
      }
    })

    it('should produce different speeds due to randomness', () => {
      const horse: Horse = createMockHorse({
        condition: COMMON_VALUES.CONDITIONS.LOW,
      })

      const speeds = new Set<number>()
      for (let i = 0; i < 20; i++) {
        speeds.add(calculateHorseSpeed(horse, COMMON_VALUES.DISTANCES.D1600))
      }

      // Due to randomness, should have multiple different speeds
      expect(speeds.size).toBeGreaterThan(1)
    })

    it('should handle different race distances', () => {
      const horse: Horse = createMockHorse({
        condition: COMMON_VALUES.CONDITIONS.LOW,
      })

      const shortSpeed = calculateHorseSpeed(horse, COMMON_VALUES.DISTANCES.D1200)
      const longSpeed = calculateHorseSpeed(horse, COMMON_VALUES.DISTANCES.D2200)

      // Both should be valid positive numbers
      expect(shortSpeed).toBeGreaterThan(0)
      expect(longSpeed).toBeGreaterThan(0)
    })
  })

  describe('simulateRace', () => {
    it('should return horses sorted by finish time', () => {
      const horses: Horse[] = [
        createMockHorse({ id: 1, name: 'Horse 1', condition: COMMON_VALUES.CONDITIONS.MEDIUM }),
        createMockHorse({
          id: 2,
          name: 'Horse 2',
          condition: COMMON_VALUES.CONDITIONS.LOW,
          color: COMMON_VALUES.COLORS.GREEN,
        }),
        createMockHorse({
          id: 3,
          name: 'Horse 3',
          condition: COMMON_VALUES.CONDITIONS.HIGH,
          color: COMMON_VALUES.COLORS.BLUE,
        }),
      ]

      const race: Race = createMockRace({
        horses,
      })

      const result = simulateRace(race)

      // Should be sorted by finish time (fastest first)
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].finishTime).toBeLessThanOrEqual(result[i + 1].finishTime || Infinity)
      }
    })

    it('should assign finish times to all horses', () => {
      const horses: Horse[] = [
        createMockHorse({ id: 1, name: 'Horse 1', condition: COMMON_VALUES.CONDITIONS.MEDIUM }),
        createMockHorse({
          id: 2,
          name: 'Horse 2',
          condition: COMMON_VALUES.CONDITIONS.LOW,
          color: COMMON_VALUES.COLORS.GREEN,
        }),
      ]

      const race: Race = createMockRace({
        horses,
      })

      const result = simulateRace(race)

      result.forEach((horse) => {
        expect(horse.finishTime).toBeDefined()
        expect(horse.finishTime).toBeGreaterThan(0)
      })
    })

    it('should reset position to 0 for all horses', () => {
      const horses: Horse[] = [
        createMockHorse({
          id: 1,
          name: 'Horse 1',
          condition: COMMON_VALUES.CONDITIONS.MEDIUM,
          position: COMMON_VALUES.POSITIONS.HALF,
        }),
        createMockHorse({
          id: 2,
          name: 'Horse 2',
          condition: COMMON_VALUES.CONDITIONS.LOW,
          color: COMMON_VALUES.COLORS.GREEN,
          position: COMMON_VALUES.POSITIONS.THREE_QUARTERS,
        }),
      ]

      const race: Race = createMockRace({
        horses,
      })

      const result = simulateRace(race)

      result.forEach((horse) => {
        expect(horse.position).toBe(0)
      })
    })

    it('should return same number of horses as input', () => {
      const horses: Horse[] = generateHorses().slice(0, 10)

      const race: Race = createMockRace({
        horses,
      })

      const result = simulateRace(race)
      expect(result).toHaveLength(10)
    })
  })
})
