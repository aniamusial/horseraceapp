/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { store } from '../index'
import { GameStatus } from '@/types'
import type { Horse, Race } from '@/types'

describe('Vuex Store', () => {
  beforeEach(() => {
    store.commit('races/RESET_GAME')
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.state.horses.allHorses).toEqual([])
      expect(store.state.races.raceProgram).toEqual([])
      expect(store.state.races.currentRoundIndex).toBe(0)
      expect(store.state.races.gameStatus).toBe(GameStatus.IDLE)
      expect(store.state.races.completedRaces).toEqual([])
      expect(store.state.races.currentRaceSimulation).toBeNull()
      expect(store.state.races.raceStartTime).toBeNull()
      expect(store.state.races.racePausedTime).toBeNull()
      expect(store.state.races.elapsedBeforePause).toBe(0)
      expect(store.state.races.animationFrameId).toBeNull()
    })
  })

  describe('Getters', () => {
    describe('currentRace', () => {
      it('should return null when no program exists', () => {
        expect(store.getters['races/currentRace']).toBeNull()
      })

      it('should return the current race from the program', () => {
        const mockRace: Race = {
          roundNumber: 1,
          distance: 1200,
          horses: [],
          status: 'pending',
        }
        store.state.races.raceProgram = [mockRace]
        store.state.races.currentRoundIndex = 0

        expect(store.getters['races/currentRace']).toEqual(mockRace)
      })

      it('should return null when currentRoundIndex is out of bounds', () => {
        store.state.races.raceProgram = []
        store.state.races.currentRoundIndex = 5

        expect(store.getters['races/currentRace']).toBeNull()
      })
    })

    describe('isRacing', () => {
      it('should return true when game status is RACING', () => {
        store.state.races.gameStatus = GameStatus.RACING

        expect(store.getters['races/isRacing']).toBe(true)
      })

      it('should return false when game status is not RACING', () => {
        store.state.races.gameStatus = GameStatus.IDLE

        expect(store.getters['races/isRacing']).toBe(false)
      })
    })

    describe('isPaused', () => {
      it('should return true when game status is PAUSED', () => {
        store.state.races.gameStatus = GameStatus.PAUSED

        expect(store.getters['races/isPaused']).toBe(true)
      })

      it('should return false when game status is not PAUSED', () => {
        store.state.races.gameStatus = GameStatus.RACING

        expect(store.getters['races/isPaused']).toBe(false)
      })
    })

    describe('canGenerate', () => {
      it('should return true when game status is IDLE', () => {
        store.state.races.gameStatus = GameStatus.IDLE

        expect(store.getters['races/canGenerate']).toBe(true)
      })

      it('should return true when game status is COMPLETED', () => {
        store.state.races.gameStatus = GameStatus.COMPLETED

        expect(store.getters['races/canGenerate']).toBe(true)
      })

      it('should return false when game status is RACING', () => {
        store.state.races.gameStatus = GameStatus.RACING

        expect(store.getters['races/canGenerate']).toBe(false)
      })
    })

    describe('canStart', () => {
      it('should return true when game status is PROGRAM_GENERATED', () => {
        store.state.races.gameStatus = GameStatus.PROGRAM_GENERATED

        expect(store.getters['races/canStart']).toBe(true)
      })

      it('should return true when game status is PAUSED', () => {
        store.state.races.gameStatus = GameStatus.PAUSED

        expect(store.getters['races/canStart']).toBe(true)
      })

      it('should return true when game status is RACING', () => {
        store.state.races.gameStatus = GameStatus.RACING

        expect(store.getters['races/canStart']).toBe(true)
      })

      it('should return false when game status is IDLE', () => {
        store.state.races.gameStatus = GameStatus.IDLE

        expect(store.getters['races/canStart']).toBe(false)
      })
    })
  })

  describe('Mutations', () => {
    describe('GENERATE_PROGRAM', () => {
      it('should generate race program and reset state', () => {
        store.commit('horses/INITIALIZE_HORSES')

        store.commit('races/GENERATE_PROGRAM', store.state.horses.allHorses)

        expect(store.state.races.raceProgram).toHaveLength(6)
        expect(store.state.races.currentRoundIndex).toBe(0)
        expect(store.state.races.completedRaces).toEqual([])
        expect(store.state.races.gameStatus).toBe(GameStatus.PROGRAM_GENERATED)
        expect(store.state.races.currentRaceSimulation).toBeNull()
        expect(store.state.races.raceStartTime).toBeNull()
        expect(store.state.races.racePausedTime).toBeNull()
        expect(store.state.races.elapsedBeforePause).toBe(0)
        expect(store.state.races.animationFrameId).toBeNull()
        expect(store.state.races.raceProgram[0].distance).toBe(1200)
        expect(store.state.races.raceProgram[1].distance).toBe(1400)
        expect(store.state.races.raceProgram[2].distance).toBe(1600)
        expect(store.state.races.raceProgram[3].distance).toBe(1800)
        expect(store.state.races.raceProgram[4].distance).toBe(2000)
        expect(store.state.races.raceProgram[5].distance).toBe(2200)
      })
    })

    describe('START_RACE', () => {
      it('should start a new race with simulated horses', () => {
        const mockHorse: Horse = {
          id: 1,
          name: 'Horse 1',
          condition: 80,
          color: '#FF0000',
          position: 0,
          finishTime: 5000,
        }
        const mockHorses: Horse[] = [mockHorse]
        const mockRace: Race = {
          roundNumber: 1,
          distance: 1200,
          horses: [mockHorse],
          status: 'pending',
        }

        store.state.races.raceProgram = [mockRace]
        store.state.races.currentRoundIndex = 0

        const beforeTime = Date.now()
        store.commit('races/START_RACE', mockHorses)
        const afterTime = Date.now()

        expect(store.state.races.gameStatus).toBe(GameStatus.RACING)
        expect(store.state.races.raceProgram[0].status).toBe('running')
        expect(store.state.races.currentRaceSimulation).toEqual(mockHorses)
        expect(store.state.races.raceStartTime).toBeGreaterThanOrEqual(beforeTime)
        expect(store.state.races.raceStartTime).toBeLessThanOrEqual(afterTime)
        expect(store.state.races.elapsedBeforePause).toBe(0)
      })

      it('should resume race from pause', () => {
        store.state.races.gameStatus = GameStatus.PAUSED
        store.state.races.raceStartTime = 1000
        store.state.races.racePausedTime = 2000
        store.state.races.elapsedBeforePause = 500

        const beforeTime = Date.now()
        store.commit('races/START_RACE')
        const afterTime = Date.now()

        expect(store.state.races.gameStatus).toBe(GameStatus.RACING)
        expect(store.state.races.elapsedBeforePause).toBe(1500) // 500 + (2000 - 1000)
        expect(store.state.races.raceStartTime).toBeGreaterThanOrEqual(beforeTime)
        expect(store.state.races.raceStartTime).toBeLessThanOrEqual(afterTime)
      })
    })

    describe('PAUSE_RACE', () => {
      it('should pause the race', () => {
        const beforeTime = Date.now()
        store.commit('races/PAUSE_RACE')
        const afterTime = Date.now()

        expect(store.state.races.gameStatus).toBe(GameStatus.PAUSED)
        expect(store.state.races.racePausedTime).toBeGreaterThanOrEqual(beforeTime)
        expect(store.state.races.racePausedTime).toBeLessThanOrEqual(afterTime)
      })
    })

    describe('UPDATE_HORSE_POSITION', () => {
      it('should update horse position in the race', () => {
        const mockHorse: Horse = {
          id: 1,
          name: 'Horse 1',
          condition: 80,
          color: '#FF0000',
          position: 0,
        }
        const mockRace: Race = {
          roundNumber: 1,
          distance: 1200,
          horses: [mockHorse],
          status: 'running',
        }
        store.state.races.raceProgram = [mockRace]

        store.commit('races/UPDATE_HORSE_POSITION', {
          roundIndex: 0,
          horseId: 1,
          position: 50,
        })

        expect(store.state.races.raceProgram[0].horses[0].position).toBe(50)
      })

      it('should do nothing if race does not exist', () => {
        store.state.races.raceProgram = []

        store.commit('races/UPDATE_HORSE_POSITION', {
          roundIndex: 0,
          horseId: 1,
          position: 50,
        })

        expect(store.state.races.raceProgram).toEqual([])
      })

      it('should do nothing if horse does not exist', () => {
        const mockHorse: Horse = {
          id: 1,
          name: 'Horse 1',
          condition: 80,
          color: '#FF0000',
          position: 0,
        }
        const mockRace: Race = {
          roundNumber: 1,
          distance: 1200,
          horses: [mockHorse],
          status: 'running',
        }
        store.state.races.raceProgram = [mockRace]

        store.commit('races/UPDATE_HORSE_POSITION', {
          roundIndex: 0,
          horseId: 999,
          position: 50,
        })

        expect(store.state.races.raceProgram[0].horses[0].position).toBe(0)
      })
    })

    describe('COMPLETE_RACE', () => {
      it('should complete a race and add to completed races', () => {
        const mockHorse: Horse = {
          id: 1,
          name: 'Horse 1',
          condition: 80,
          color: '#FF0000',
          position: 100,
        }
        const mockRace: Race = {
          roundNumber: 1,
          distance: 1200,
          horses: [mockHorse],
          status: 'running',
        }
        const results = [{ position: 1, horseName: 'Horse 1', horseId: 1, time: 5000 }]
        store.state.races.raceProgram = [mockRace]

        store.commit('races/COMPLETE_RACE', {
          roundIndex: 0,
          results,
        })

        expect(store.state.races.raceProgram[0].status).toBe('completed')
        expect(store.state.races.raceProgram[0].results).toEqual(results)
        expect(store.state.races.completedRaces).toHaveLength(1)
        expect(store.state.races.completedRaces[0]).toEqual({
          ...mockRace,
          status: 'completed',
          results,
        })
      })

      it('should do nothing if race does not exist', () => {
        store.state.races.raceProgram = []

        store.commit('races/COMPLETE_RACE', {
          roundIndex: 0,
          results: [],
        })

        expect(store.state.races.completedRaces).toHaveLength(0)
      })
    })

    describe('NEXT_ROUND', () => {
      it('should increment round index and reset timing state', () => {
        store.state.races.currentRoundIndex = 0
        store.state.races.raceProgram = [
          { roundNumber: 1, distance: 1200, horses: [], status: 'completed' },
          { roundNumber: 2, distance: 1400, horses: [], status: 'pending' },
        ]

        store.commit('races/NEXT_ROUND')

        expect(store.state.races.currentRoundIndex).toBe(1)
        expect(store.state.races.currentRaceSimulation).toBeNull()
        expect(store.state.races.raceStartTime).toBeNull()
        expect(store.state.races.racePausedTime).toBeNull()
        expect(store.state.races.elapsedBeforePause).toBe(0)
        expect(store.state.races.animationFrameId).toBeNull()
        expect(store.state.races.gameStatus).toBe(GameStatus.PROGRAM_GENERATED)
      })

      it('should set status to COMPLETED when all races are done', () => {
        store.state.races.currentRoundIndex = 0
        store.state.races.raceProgram = [
          { roundNumber: 1, distance: 1200, horses: [], status: 'completed' },
        ]

        store.commit('races/NEXT_ROUND')

        expect(store.state.races.currentRoundIndex).toBe(1)
        expect(store.state.races.gameStatus).toBe(GameStatus.COMPLETED)
      })
    })

    describe('RESET_GAME', () => {
      it('should reset all game state', () => {
        store.state.races.raceProgram = [
          { roundNumber: 1, distance: 1200, horses: [], status: 'completed' },
        ]
        store.state.races.currentRoundIndex = 3
        store.state.races.completedRaces = [
          { roundNumber: 1, distance: 1200, horses: [], status: 'completed' },
        ]
        store.state.races.gameStatus = GameStatus.RACING

        store.commit('races/RESET_GAME')

        expect(store.state.races.raceProgram).toEqual([])
        expect(store.state.races.currentRoundIndex).toBe(0)
        expect(store.state.races.completedRaces).toEqual([])
        expect(store.state.races.gameStatus).toBe(GameStatus.IDLE)
        expect(store.state.races.currentRaceSimulation).toBeNull()
        expect(store.state.races.raceStartTime).toBeNull()
        expect(store.state.races.racePausedTime).toBeNull()
        expect(store.state.races.elapsedBeforePause).toBe(0)
        expect(store.state.races.animationFrameId).toBeNull()
      })
    })
  })
})
