import type { Module } from 'vuex'
import type { Horse } from '@/types'
import { generateHorses } from '@/utils/horseGenerator'
import type { RootState } from '@/store/types'

export interface HorsesState {
  allHorses: Horse[]
}

export const horsesModule: Module<HorsesState, RootState> = {
  namespaced: true,

  state: {
    allHorses: [],
  },

  getters: {
    allHorses: (state): Horse[] => state.allHorses,
    horsesCount: (state): number => state.allHorses.length,
  },

  mutations: {
    INITIALIZE_HORSES(state) {
      state.allHorses = generateHorses()
    },

    RESET_HORSES(state) {
      state.allHorses = []
    },
  },

  actions: {
    initialize({ commit, state }) {
      if (state.allHorses.length === 0) {
        commit('INITIALIZE_HORSES')
      }
    },

    reset({ commit }) {
      commit('RESET_HORSES')
    },
  },
}
