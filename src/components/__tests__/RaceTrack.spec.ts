import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceTrack from '@/components/RaceTrack.vue'
import { store } from '@/store'
import { GameStatus } from '@/types'
import {
  raceTrackRunningRace,
  raceTrackProgressRace,
  raceTrackSingleHorseRace,
  TEXT_CONSTANTS,
} from './fixtures/mocks'

describe('RaceTrack', () => {
  const mountComponent = () => mount(RaceTrack, { global: { plugins: [store] } })

  beforeEach(() => {
    store.commit('races/RESET_GAME')
  })

  describe('Empty State', () => {
    it('renders the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('shows placeholder when no race is active', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.PLACEHOLDERS.GENERATE_TO_START)
    })
  })

  describe('Race Track Structure', () => {
    it('displays race information when race exists', () => {
      store.state.races.raceProgram = [raceTrackRunningRace]
      store.state.races.currentRoundIndex = 0
      store.state.races.gameStatus = GameStatus.RACING

      const wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.FIRST)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1600)
    })

    it('shows 10 lanes for 10 horses', () => {
      store.state.races.raceProgram = [raceTrackRunningRace]
      store.state.races.currentRoundIndex = 0
      store.state.races.gameStatus = GameStatus.RACING

      const wrapper = mountComponent()

      const lanes = wrapper.findAll('.race-track__lane')

      expect(lanes.length).toBe(10)
    })

    it('displays lane numbers', () => {
      store.state.races.raceProgram = [raceTrackRunningRace]
      store.state.races.currentRoundIndex = 0
      store.state.races.gameStatus = GameStatus.RACING

      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('10')
    })

    it('shows horse icons for each racer', () => {
      store.state.races.raceProgram = [raceTrackRunningRace]
      store.state.races.currentRoundIndex = 0
      store.state.races.gameStatus = GameStatus.RACING

      const wrapper = mountComponent()

      const horseIcons = wrapper.findAll('[class*="race-track__horse-icon"]')

      expect(horseIcons.length).toBe(10)
    })
  })

  describe('Horse Positions', () => {
    it('positions horses based on their progress', () => {
      store.state.races.raceProgram = [raceTrackProgressRace]
      store.state.races.currentRoundIndex = 0
      store.state.races.gameStatus = GameStatus.RACING

      const wrapper = mountComponent()

      const horseIcons = wrapper.findAll('.race-track__horse-icon')
      const leadHorse = horseIcons[0]
      const backHorse = horseIcons[2]

      expect(leadHorse?.attributes('style')).toContain('--horse-position')
      expect(backHorse?.attributes('style')).toContain('--horse-position')
    })
  })

  describe('Race States', () => {
    it('shows track when race is running', () => {
      store.state.races.raceProgram = [raceTrackSingleHorseRace]
      store.state.races.currentRoundIndex = 0
      store.state.races.gameStatus = GameStatus.RACING

      const wrapper = mountComponent()

      expect(wrapper.find('[class*="race-track__track"]').exists()).toBe(true)
    })

    it('shows track when race is paused', () => {
      store.state.races.raceProgram = [raceTrackSingleHorseRace]
      store.state.races.currentRoundIndex = 0
      store.state.races.gameStatus = GameStatus.PAUSED

      const wrapper = mountComponent()

      expect(wrapper.find('[class*="race-track__track"]').exists()).toBe(true)
    })
  })
})
