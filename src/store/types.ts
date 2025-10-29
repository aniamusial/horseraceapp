import type { HorsesState } from '@/store/modules/horses'
import type { RacesState } from '@/store/modules/races'

export interface RootState {
  horses: HorsesState
  races: RacesState
}

// Re-export module-specific types for convenience
export type { UpdateHorsePositionPayload, CompleteRacePayload } from '@/store/modules/races'
