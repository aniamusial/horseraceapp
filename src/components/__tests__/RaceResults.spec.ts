import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import RaceResults from '@/components/RaceResults.vue'
import { store } from '@/store'
import { singleCompletedRace, twoCompletedRaces, TEXT_CONSTANTS } from './fixtures/mocks'

describe('RaceResults', () => {
  let wrapper: VueWrapper

  const mountComponent = () => mount(RaceResults, { global: { plugins: [store] } })

  beforeEach(() => {
    store.commit('races/RESET_GAME')
    wrapper = mountComponent()
  })

  describe('Empty State', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('shows placeholder when no results exist', () => {
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.PLACEHOLDERS.NO_RESULTS)
    })
  })

  describe('With Results', () => {
    it('displays completed races', () => {
      store.state.races.completedRaces = [singleCompletedRace]
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.FIRST)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1200)
    })

    it('shows race results in order', () => {
      store.state.races.completedRaces = [singleCompletedRace]
      const wrapper = mountComponent()

      const text = wrapper.text()
      const thunderIndex = text.indexOf(TEXT_CONSTANTS.HORSE_NAMES.THUNDER_BOLT)
      const lightningIndex = text.indexOf(TEXT_CONSTANTS.HORSE_NAMES.LIGHTNING_SPEED)
      const stormIndex = text.indexOf(TEXT_CONSTANTS.HORSE_NAMES.STORM_CHASER)

      expect(thunderIndex).toBeLessThan(lightningIndex)
      expect(lightningIndex).toBeLessThan(stormIndex)
    })

    it('displays all finishers', () => {
      store.state.races.completedRaces = [singleCompletedRace]
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.THUNDER_BOLT)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.LIGHTNING_SPEED)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.STORM_CHASER)
    })

    it('shows positions for all finishers', () => {
      store.state.races.completedRaces = [singleCompletedRace]
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('2')
      expect(wrapper.text()).toContain('3')
    })
  })

  describe('Multiple Races', () => {
    it('displays multiple completed races', () => {
      store.state.races.completedRaces = twoCompletedRaces
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.FIRST)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.LAP_LABELS.SECOND)
    })

    it('shows correct distances for each race', () => {
      store.state.races.completedRaces = twoCompletedRaces
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1200)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.DISTANCES.D1400)
    })

    it('displays different winners for different races', () => {
      store.state.races.completedRaces = twoCompletedRaces
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.HORSE_A)
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.HORSE_NAMES.HORSE_B)
    })
  })
})
