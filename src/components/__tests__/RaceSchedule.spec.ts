import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import RaceSchedule from '@/components/RaceSchedule.vue'
import { store } from '@/store'
import { twoPendingRaces, singleCompletedRaceInProgram, TEXT_CONSTANTS } from './fixtures/mocks'

describe('RaceSchedule', () => {
  let wrapper: VueWrapper

  const mountComponent = () => mount(RaceSchedule, { global: { plugins: [store] } })

  beforeEach(() => {
    store.commit('races/RESET_GAME')
    wrapper = mountComponent()
  })

  describe('Empty State', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('shows placeholder when no program exists', () => {
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.PLACEHOLDERS.NO_PROGRAM)
    })
  })

  describe('With Program', () => {
    it('displays races when program exists', () => {
      store.state.races.raceProgram = twoPendingRaces
      wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.FIRST)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.SECOND)
    })

    it('shows race distances', () => {
      store.state.races.raceProgram = twoPendingRaces
      wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1200)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1400)
    })

    it('shows horse names in races', () => {
      store.state.races.raceProgram = twoPendingRaces
      wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.HORSE_1)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.HORSE_2)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.HORSE_3)
    })

    it('highlights current race', () => {
      store.state.races.raceProgram = twoPendingRaces
      store.state.races.currentRoundIndex = 0
      store.state.races.raceProgram[0].status = 'running'
      wrapper = mountComponent()

      const cards = wrapper.findAll('[class*="lap-card"]')

      expect(cards[0]?.classes()).toContain('hr-lap-card--active')
    })

    it('shows completed status for finished races', () => {
      store.state.races.raceProgram = singleCompletedRaceInProgram
      wrapper = mountComponent()

      const cards = wrapper.findAll('[class*="lap-card"]')

      expect(cards[0]?.classes()).toContain('hr-lap-card--completed')
    })
  })

  describe('Program Generation', () => {
    it('displays 6 races after full program generation', () => {
      store.commit('horses/INITIALIZE_HORSES')
      store.commit('races/GENERATE_PROGRAM', store.state.horses.allHorses)
      wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.FIRST)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.SECOND)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.THIRD)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.FOURTH)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.FIFTH)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.SIXTH)
    })

    it('shows all race distances correctly', () => {
      store.commit('horses/INITIALIZE_HORSES')
      store.commit('races/GENERATE_PROGRAM', store.state.horses.allHorses)
      wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1200)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1400)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1600)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1800)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D2000)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D2200)
    })
  })
})
