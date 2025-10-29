import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ControlPanel from '@/components/ControlPanel.vue'
import { store } from '@/store'
import { GameStatus } from '@/types'
import { TEXT_CONSTANTS } from './fixtures/mocks'

describe('ControlPanel', () => {
  let wrapper: VueWrapper

  const mountComponent = () => mount(ControlPanel, { global: { plugins: [store] } })

  const findButtonByAriaLabel = (ariaLabel: string) => {
    return wrapper.find(`button[aria-label="${ariaLabel}"]`)
  }

  beforeEach(() => {
    store.commit('races/RESET_GAME')
    wrapper = mountComponent()
  })

  describe('Rendering', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('displays the title', () => {
      expect(wrapper.text()).toContain(TEXT_CONSTANTS.CONTROL_PANEL.TITLE)
    })

    it('shows Generate Program button', () => {
      const generateButton = findButtonByAriaLabel(
        TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.GENERATE,
      )

      expect(generateButton.exists()).toBe(true)
      expect(generateButton.text()).toContain(TEXT_CONSTANTS.CONTROL_PANEL.BUTTON_TEXT.GENERATE)
    })

    it('shows Start/Pause button', () => {
      const startButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.START)

      expect(startButton.exists()).toBe(true)
      expect(startButton.text()).toContain(TEXT_CONSTANTS.CONTROL_PANEL.BUTTON_TEXT.START)
    })
  })

  describe('Button States', () => {
    it('enables Generate Program button in IDLE state', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.IDLE)

      await wrapper.vm.$nextTick()

      const generateButton = findButtonByAriaLabel(
        TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.GENERATE,
      )

      expect((generateButton.element as HTMLButtonElement).disabled).toBe(false)
    })

    it('disables Generate Program button in RACING state', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.RACING)

      await wrapper.vm.$nextTick()

      const generateButton = findButtonByAriaLabel(
        TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.GENERATE,
      )

      expect((generateButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('disables Start button in IDLE state', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.IDLE)

      await wrapper.vm.$nextTick()

      const startButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.START)

      expect((startButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('enables Start button after program is generated', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.PROGRAM_GENERATED)

      await wrapper.vm.$nextTick()

      const startButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.START)

      expect((startButton.element as HTMLButtonElement).disabled).toBe(false)
    })
  })

  describe('Button Labels', () => {
    it('shows START when not racing or paused', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.PROGRAM_GENERATED)
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const startButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.START)

      expect(startButton.text()).toBe(TEXT_CONSTANTS.CONTROL_PANEL.BUTTON_TEXT.START)
    })

    it('shows PAUSE when racing', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.RACING)
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const pauseButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.PAUSE)

      expect(pauseButton.text()).toBe(TEXT_CONSTANTS.CONTROL_PANEL.BUTTON_TEXT.PAUSE)
    })

    it('shows RESUME when paused', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.PAUSED)
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const resumeButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.RESUME)

      expect(resumeButton.text()).toBe(TEXT_CONSTANTS.CONTROL_PANEL.BUTTON_TEXT.RESUME)
    })
  })

  describe('User Interactions', () => {
    it('calls generateProgram when Generate button is clicked', async () => {
      store.commit('horses/INITIALIZE_HORSES')
      store.commit('races/SET_GAME_STATUS', GameStatus.IDLE)
      const spy = vi.spyOn(store, 'dispatch')
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const generateButton = findButtonByAriaLabel(
        TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.GENERATE,
      )
      await generateButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(spy).toHaveBeenCalledWith('races/generateProgram')
    })

    it('calls startRace when Start button is clicked', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.PROGRAM_GENERATED)
      const spy = vi.spyOn(store, 'dispatch')
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const startButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.START)
      await startButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(spy).toHaveBeenCalledWith('races/startRace')
    })

    it('calls pauseRace when Pause button is clicked', async () => {
      store.commit('races/SET_GAME_STATUS', GameStatus.RACING)
      const spy = vi.spyOn(store, 'dispatch')
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const pauseButton = findButtonByAriaLabel(TEXT_CONSTANTS.CONTROL_PANEL.ARIA_LABELS.PAUSE)
      await pauseButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(spy).toHaveBeenCalledWith('races/pauseRace')
    })
  })
})
