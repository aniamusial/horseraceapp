import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '@/store/types'

export function useGameState() {
  const store = useStore<RootState>()
  const { getters, dispatch } = store

  // Races module getters
  const canGenerate = computed(() => getters['races/canGenerate'])
  const canStart = computed(() => getters['races/canStart'])
  const isRacing = computed(() => getters['races/isRacing'])
  const isPaused = computed(() => getters['races/isPaused'])
  const currentRace = computed(() => getters['races/currentRace'])
  const raceProgram = computed(() => getters['races/raceProgram'])
  const currentRoundIndex = computed(() => getters['races/currentRoundIndex'])
  const completedRaces = computed(() => getters['races/completedRaces'])
  const gameStatus = computed(() => getters['races/gameStatus'])

  // Horses module getters
  const allHorses = computed(() => getters['horses/allHorses'])

  // Actions
  const generateProgram = () => dispatch('races/generateProgram')
  const startRace = () => dispatch('races/startRace')
  const pauseRace = () => dispatch('races/pauseRace')

  return {
    canGenerate,
    canStart,
    isRacing,
    isPaused,
    currentRace,
    allHorses,
    raceProgram,
    currentRoundIndex,
    completedRaces,
    gameStatus,
    generateProgram,
    startRace,
    pauseRace,
  }
}
