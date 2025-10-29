import type { Module } from 'vuex'
import type { Horse, Race, RaceResult } from '@/types'
import { GameStatus } from '@/types'
import { generateRaceProgram, simulateRace } from '@/utils/horseGenerator'
import { calculateRaceResults } from '@/utils/raceResults'
import {
  createRaceAnimator,
  areAllHorsesFinished,
  type RaceAnimationState,
} from '@/services/raceAnimation'
import type { RootState } from '../types'

const INITIAL_ROUND_INDEX = 0

export interface RacesState {
  raceProgram: Race[]
  currentRoundIndex: number
  gameStatus: GameStatus
  completedRaces: Race[]
  currentRaceSimulation: Horse[] | null
  raceStartTime: number | null
  racePausedTime: number | null
  elapsedBeforePause: number
  animationFrameId: number | null
}

// Helper function to reset race timing state
const resetRaceTimingState = (state: RacesState) => {
  state.currentRaceSimulation = null
  state.raceStartTime = null
  state.racePausedTime = null
  state.elapsedBeforePause = 0
  if (state.animationFrameId !== null) {
    cancelAnimationFrame(state.animationFrameId)
    state.animationFrameId = null
  }
}

export interface UpdateHorsePositionPayload {
  roundIndex: number
  horseId: number
  position: number
}

export interface CompleteRacePayload {
  roundIndex: number
  results: RaceResult[]
}

export const racesModule: Module<RacesState, RootState> = {
  namespaced: true,

  state: {
    raceProgram: [],
    currentRoundIndex: 0,
    gameStatus: GameStatus.IDLE,
    completedRaces: [],
    currentRaceSimulation: null,
    raceStartTime: null,
    racePausedTime: null,
    elapsedBeforePause: 0,
    animationFrameId: null,
  },

  getters: {
    currentRace: (state): Race | null => {
      if (state.currentRoundIndex < state.raceProgram.length) {
        return state.raceProgram[state.currentRoundIndex] ?? null
      }
      return null
    },

    isRacing: (state): boolean => {
      return state.gameStatus === GameStatus.RACING
    },

    isPaused: (state): boolean => {
      return state.gameStatus === GameStatus.PAUSED
    },

    canGenerate: (state): boolean => {
      return state.gameStatus === GameStatus.IDLE || state.gameStatus === GameStatus.COMPLETED
    },

    canStart: (state): boolean => {
      return (
        state.gameStatus === GameStatus.PROGRAM_GENERATED ||
        state.gameStatus === GameStatus.PAUSED ||
        state.gameStatus === GameStatus.RACING
      )
    },

    raceProgram: (state): Race[] => state.raceProgram,
    currentRoundIndex: (state): number => state.currentRoundIndex,
    completedRaces: (state): Race[] => state.completedRaces,
    gameStatus: (state): GameStatus => state.gameStatus,
  },

  mutations: {
    GENERATE_PROGRAM(state, allHorses: Horse[]) {
      state.raceProgram = generateRaceProgram(allHorses)
      state.currentRoundIndex = INITIAL_ROUND_INDEX
      state.completedRaces = []
      state.gameStatus = GameStatus.PROGRAM_GENERATED
      resetRaceTimingState(state)
    },

    START_RACE(state, simulatedHorses?: Horse[]) {
      state.gameStatus = GameStatus.RACING
      if (state.currentRoundIndex < state.raceProgram.length) {
        const race = state.raceProgram[state.currentRoundIndex]
        if (race) {
          race.status = 'running'
        }
      }
      if (simulatedHorses) {
        state.currentRaceSimulation = simulatedHorses
        state.raceStartTime = Date.now()
        state.elapsedBeforePause = 0
      } else if (state.racePausedTime && state.raceStartTime) {
        state.elapsedBeforePause += state.racePausedTime - state.raceStartTime
        state.raceStartTime = Date.now()
      }
    },

    PAUSE_RACE(state) {
      state.gameStatus = GameStatus.PAUSED
      state.racePausedTime = Date.now()
    },

    UPDATE_HORSE_POSITION(state, payload: UpdateHorsePositionPayload) {
      const race = state.raceProgram[payload.roundIndex]
      if (!race) return

      const horse = race.horses.find((horse) => horse.id === payload.horseId)
      if (horse) {
        horse.position = payload.position
      }
    },

    COMPLETE_RACE(state, payload: CompleteRacePayload) {
      const race = state.raceProgram[payload.roundIndex]
      if (!race) return

      race.status = 'completed'
      race.results = payload.results
      state.completedRaces.push({ ...race })
    },

    NEXT_ROUND(state) {
      state.currentRoundIndex++
      resetRaceTimingState(state)
      if (state.currentRoundIndex >= state.raceProgram.length) {
        state.gameStatus = GameStatus.COMPLETED
      } else {
        state.gameStatus = GameStatus.PROGRAM_GENERATED
      }
    },

    SET_ANIMATION_FRAME_ID(state, frameId: number | null) {
      state.animationFrameId = frameId
    },

    CANCEL_ANIMATION(state) {
      if (state.animationFrameId !== null) {
        cancelAnimationFrame(state.animationFrameId)
        state.animationFrameId = null
      }
    },

    RESET_GAME(state) {
      state.raceProgram = []
      state.currentRoundIndex = INITIAL_ROUND_INDEX
      state.completedRaces = []
      state.gameStatus = GameStatus.IDLE
      resetRaceTimingState(state)
    },

    // Test helper mutation - sets game status without side effects
    SET_GAME_STATUS(state, status: GameStatus) {
      state.gameStatus = status
    },
  },

  actions: {
    generateProgram({ commit, rootState }) {
      const allHorses = rootState.horses.allHorses
      commit('GENERATE_PROGRAM', allHorses)
    },

    async startRace({ commit, state, dispatch }) {
      if (state.currentRoundIndex >= state.raceProgram.length) {
        return
      }

      const currentRace = state.raceProgram[state.currentRoundIndex]
      if (!currentRace) {
        return
      }

      if (!state.currentRaceSimulation) {
        const simulatedRace = simulateRace(currentRace)
        commit('START_RACE', simulatedRace)
      } else {
        commit('START_RACE')
      }

      await dispatch('animateRace')

      // Check if all horses finished
      if (
        state.currentRaceSimulation &&
        areAllHorsesFinished(state.currentRaceSimulation, currentRace.horses) &&
        state.gameStatus !== GameStatus.PAUSED
      ) {
        const results = calculateRaceResults(state.currentRaceSimulation)

        commit('COMPLETE_RACE', {
          roundIndex: state.currentRoundIndex,
          results,
        })

        commit('NEXT_ROUND')

        if (state.gameStatus === GameStatus.PROGRAM_GENERATED) {
          dispatch('startRace')
        }
      }
    },

    animateRace({ commit, state }) {
      if (!state.currentRaceSimulation || !state.raceStartTime) {
        return Promise.resolve()
      }

      const animationState: RaceAnimationState = {
        simulatedHorses: state.currentRaceSimulation,
        startTime: state.raceStartTime,
        elapsedBeforePause: state.elapsedBeforePause,
      }

      const animator = createRaceAnimator(animationState, {
        onUpdatePosition: (horseId: number, position: number) => {
          commit('UPDATE_HORSE_POSITION', {
            roundIndex: state.currentRoundIndex,
            horseId,
            position,
          })
        },
        onComplete: () => {
          commit('SET_ANIMATION_FRAME_ID', null)
        },
        shouldContinue: () => state.gameStatus === GameStatus.RACING,
        onFrameRequested: (frameId: number) => {
          commit('SET_ANIMATION_FRAME_ID', frameId)
        },
      })

      return animator()
    },

    pauseRace({ commit }) {
      commit('PAUSE_RACE')
      commit('CANCEL_ANIMATION')
    },

    cancelAnimation({ commit }) {
      commit('CANCEL_ANIMATION')
    },

    reset({ commit }) {
      commit('RESET_GAME')
    },
  },
}
