import type { Horse, Race, RaceResult } from '@/types'

export const COMMON_VALUES = {
  COLORS: {
    RED: '#FF0000',
    GREEN: '#00FF00',
    BLUE: '#0000FF',
    TEAL: '#4ECDC4',
    YELLOW: '#FFE66D',
    MINT: '#A8E6CF',
    PINK: '#FF8B94',
    UNKNOWN: '#123456',
  },
  CONDITIONS: {
    LOW: 50,
    MEDIUM_LOW: 75,
    MEDIUM: 80,
    MEDIUM_HIGH: 85,
    HIGH: 90,
    VERY_HIGH: 95,
  },
  DISTANCES: {
    D1200: 1200,
    D1400: 1400,
    D1600: 1600,
    D1800: 1800,
    D2000: 2000,
    D2200: 2200,
  },
  FINISH_TIMES: {
    FAST: 4800,
    MEDIUM: 5000,
    SLOW: 5200,
    VERY_FAST: 4900,
    VERY_SLOW: 6000,
  },
  POSITIONS: {
    START: 0,
    QUARTER: 25,
    HALF: 50,
    THREE_QUARTERS: 75,
    FINISH: 100,
  },
}

export const TEXT_CONSTANTS = {
  LAP_LABELS: {
    FIRST: '1ST Lap',
    SECOND: '2ND Lap',
    THIRD: '3RD Lap',
    FOURTH: '4TH Lap',
    FIFTH: '5TH Lap',
    SIXTH: '6TH Lap',
  },
  DISTANCES: {
    D1200: '1200',
    D1400: '1400',
    D1600: '1600',
    D1800: '1800',
    D2000: '2000',
    D2200: '2200',
  },
  PLACEHOLDERS: {
    NO_PROGRAM: 'No program generated yet',
    NO_RESULTS: 'No results yet',
    GENERATE_TO_START: 'Generate a program to start racing!',
  },
  HORSE_NAMES: {
    THUNDER_BOLT: 'Thunder Bolt',
    LIGHTNING_SPEED: 'Lightning Speed',
    STORM_CHASER: 'Storm Chaser',
    HORSE_A: 'Horse A',
    HORSE_B: 'Horse B',
    HORSE_1: 'Horse 1',
    HORSE_2: 'Horse 2',
    HORSE_3: 'Horse 3',
  },
  CONTROL_PANEL: {
    TITLE: 'Horse Racing',
    ARIA_LABELS: {
      GENERATE: 'Generate race program',
      START: 'Start race',
      PAUSE: 'Pause race',
      RESUME: 'Resume race',
    },
    BUTTON_TEXT: {
      GENERATE: 'GENERATE PROGRAM',
      START: 'START',
      PAUSE: 'PAUSE',
      RESUME: 'RESUME',
    },
  },
}

export const threeHorsesForRaceResults: Horse[] = [
  { id: 1, name: 'Thunder Bolt', condition: 95, color: '#FF0000', position: 100 },
  { id: 2, name: 'Lightning Speed', condition: 90, color: '#00FF00', position: 100 },
  { id: 3, name: 'Storm Chaser', condition: 85, color: '#0000FF', position: 100 },
]

export const twoHorsesForMultipleRaces: Horse[] = [
  { id: 1, name: 'Horse A', condition: 90, color: '#FF0000', position: 100 },
  { id: 2, name: 'Horse B', condition: 85, color: '#00FF00', position: 100 },
]

export const threeHorsesForSchedule: Horse[] = [
  { id: 1, name: 'Horse 1', condition: 80, color: '#FF0000', position: 0 },
  { id: 2, name: 'Horse 2', condition: 90, color: '#00FF00', position: 0 },
  { id: 3, name: 'Horse 3', condition: 75, color: '#0000FF', position: 0 },
]

export const tenHorsesForRaceTrack: Horse[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Horse ${i + 1}`,
  condition: 80 + i,
  color: `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`,
  position: 0,
}))

export const threeHorsesWithProgress: Horse[] = [
  { id: 1, name: 'Lead Horse', condition: 95, color: '#FF0000', position: 75 },
  { id: 2, name: 'Middle Horse', condition: 85, color: '#00FF00', position: 50 },
  { id: 3, name: 'Back Horse', condition: 75, color: '#0000FF', position: 25 },
]

export const singleHorseForRaceState: Horse[] = [
  { id: 1, name: 'Horse 1', condition: 90, color: '#FF0000', position: 0 },
]

export const singleCompletedRace: Race = {
  roundNumber: 1,
  distance: 1200,
  horses: threeHorsesForRaceResults,
  status: 'completed',
  results: [
    { position: 1, horseName: 'Thunder Bolt', horseId: 1, time: 5000 },
    { position: 2, horseName: 'Lightning Speed', horseId: 2, time: 5100 },
    { position: 3, horseName: 'Storm Chaser', horseId: 3, time: 5200 },
  ],
}

export const twoCompletedRaces: Race[] = [
  {
    roundNumber: 1,
    distance: 1200,
    horses: twoHorsesForMultipleRaces,
    status: 'completed',
    results: [
      { position: 1, horseName: 'Horse A', horseId: 1, time: 5000 },
      { position: 2, horseName: 'Horse B', horseId: 2, time: 5100 },
    ],
  },
  {
    roundNumber: 2,
    distance: 1400,
    horses: twoHorsesForMultipleRaces,
    status: 'completed',
    results: [
      { position: 1, horseName: 'Horse B', horseId: 2, time: 5500 },
      { position: 2, horseName: 'Horse A', horseId: 1, time: 5600 },
    ],
  },
]

export const twoPendingRaces: Race[] = [
  {
    roundNumber: 1,
    distance: 1200,
    horses: threeHorsesForSchedule,
    status: 'pending',
  },
  {
    roundNumber: 2,
    distance: 1400,
    horses: threeHorsesForSchedule,
    status: 'pending',
  },
]

export const singleCompletedRaceInProgram: Race[] = [
  {
    roundNumber: 1,
    distance: 1200,
    horses: threeHorsesForSchedule,
    status: 'completed',
    results: [
      { position: 1, horseName: 'Horse 1', horseId: 1, time: 5000 },
      { position: 2, horseName: 'Horse 2', horseId: 2, time: 5100 },
      { position: 3, horseName: 'Horse 3', horseId: 3, time: 5200 },
    ],
  },
]

export const raceTrackRunningRace: Race = {
  roundNumber: 1,
  distance: 1600,
  horses: tenHorsesForRaceTrack,
  status: 'running',
}

export const raceTrackProgressRace: Race = {
  roundNumber: 1,
  distance: 1600,
  horses: threeHorsesWithProgress,
  status: 'running',
}

export const raceTrackSingleHorseRace: Race = {
  roundNumber: 1,
  distance: 1600,
  horses: singleHorseForRaceState,
  status: 'running',
}

// Utility functions for creating test data
export function createMockHorse(overrides?: Partial<Horse>): Horse {
  return {
    id: 1,
    name: 'Test Horse',
    condition: COMMON_VALUES.CONDITIONS.MEDIUM,
    color: COMMON_VALUES.COLORS.RED,
    position: COMMON_VALUES.POSITIONS.START,
    ...overrides,
  }
}

export function createMockRace(overrides?: Partial<Race>): Race {
  return {
    roundNumber: 1,
    distance: COMMON_VALUES.DISTANCES.D1600,
    horses: [],
    status: 'pending',
    ...overrides,
  }
}

export function createMockRaceResult(overrides?: Partial<RaceResult>): RaceResult {
  return {
    position: 1,
    horseName: 'Test Horse',
    horseId: 1,
    time: COMMON_VALUES.FINISH_TIMES.MEDIUM,
    ...overrides,
  }
}
