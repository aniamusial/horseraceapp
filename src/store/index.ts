import { createStore } from 'vuex'
import type { RootState } from './types'
import { horsesModule } from './modules/horses'
import { racesModule } from './modules/races'

export const store = createStore<RootState>({
  modules: {
    horses: horsesModule,
    races: racesModule,
  },

  actions: {
    // Global initialization action
    async initializeGame({ dispatch }) {
      await dispatch('horses/initialize')
    },

    // Global reset action
    async resetGame({ dispatch }) {
      await dispatch('races/reset')
    },
  },
})
