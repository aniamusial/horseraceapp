import type { Horse, Race } from '@/types'

// Game configuration constants
const HORSES_PER_RACE = 10
const MIN_CONDITION = 1
const MAX_CONDITION = 100
const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]

// Speed calculation constants
const BASE_CONDITION_MULTIPLIER = 1.0
const MIN_CONDITION_FACTOR = 0.5

// Distance normalization constants
// MID_DISTANCE = 1700 is the center point of race distances (average of 1200m and 2200m)
// This allows distances below 1700m to have negative normalized values and above to have positive
const MID_DISTANCE = 1700
// DISTANCE_NORMALIZATION_FACTOR scales the distance difference to a reasonable range
// Range of distances is 1000m (2200 - 1200), so dividing by 1000 normalizes to [-0.5, 0.5]
const DISTANCE_NORMALIZATION_FACTOR = 1000

const BASE_DISTANCE_FACTOR = 1
const DISTANCE_FACTOR_WEIGHT = 0.1
const DISTANCE_RANDOM_RANGE = 0.3
const MIN_RANDOM_FACTOR = 0.8
const RANDOM_FACTOR_RANGE = 0.4

// Animation constants
const MS_PER_METER = 8

const HORSE_NAMES = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Margaret Hamilton',
  'Donald Knuth',
  'John von Neumann',
  'Claude Shannon',
  'Barbara Liskov',
  'Edsger Dijkstra',
  'Frances Allen',
  'Tim Berners-Lee',
  'Dennis Ritchie',
  'Ken Thompson',
  'Joan Clarke',
  'Hedy Lamarr',
  'Katherine Johnson',
  'Annie Easley',
  'Ada Yonath',
  'Rear Admiral Hopper',
  'Dorothy Vaughan',
]

const HORSE_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#A8E6CF', // Mint
  '#FF8B94', // Pink
  '#C7CEEA', // Lavender
  '#FFDAC1', // Peach
  '#B4F8C8', // Light Green
  '#FBE7C6', // Cream
  '#A0E7E5', // Aqua
  '#FFAEBC', // Rose
  '#B4A7D6', // Purple
  '#FFD3B6', // Apricot
  '#DCEDC1', // Lime
  '#FFA8A8', // Coral
  '#A8DADC', // Sky Blue
  '#F4ACB7', // Salmon
  '#D4A5A5', // Dusty Rose
  '#9EE09E', // Sage
  '#FFB6B9', // Blush
]

export function generateHorses(): Horse[] {
  return HORSE_NAMES.map((name, index) => ({
    id: index + 1,
    name,
    condition: Math.floor(Math.random() * MAX_CONDITION) + MIN_CONDITION,
    color: HORSE_COLORS[index] || '#999999',
  }))
}

export function selectRandomHorses(allHorses: Horse[], count: number = HORSES_PER_RACE): Horse[] {
  const shuffled = [...allHorses].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((horse) => ({
    ...horse,
    position: 0,
    finishTime: undefined,
  }))
}

export function generateRaceProgram(allHorses: Horse[]): Race[] {
  return RACE_DISTANCES.map((distance, index) => ({
    roundNumber: index + 1,
    distance,
    horses: selectRandomHorses(allHorses),
    status: 'pending',
    results: undefined,
  }))
}

export function calculateHorseSpeed(horse: Horse, distance: number): number {
  // Base speed from condition (0.5 to 1.5)
  const conditionFactor =
    (horse.condition / MAX_CONDITION) * BASE_CONDITION_MULTIPLIER + MIN_CONDITION_FACTOR

  // Distance factor (longer distances slightly favor higher condition horses)
  // Normalize distance (1200-2200) to a factor (0.95-1.05)
  const normalizedDistance = (distance - MID_DISTANCE) / DISTANCE_NORMALIZATION_FACTOR
  const distanceFactor =
    BASE_DISTANCE_FACTOR +
    normalizedDistance * DISTANCE_FACTOR_WEIGHT +
    Math.random() * DISTANCE_RANDOM_RANGE

  // Random factor for unpredictability
  const randomFactor = MIN_RANDOM_FACTOR + Math.random() * RANDOM_FACTOR_RANGE

  return conditionFactor * distanceFactor * randomFactor
}

/**
 * Simulates a race and calculates finish times
 */
export function simulateRace(race: Race): Horse[] {
  const horsesWithTimes = race.horses.map((horse) => {
    const speed = calculateHorseSpeed(horse, race.distance)
    // Base time is distance dependent (in milliseconds for animation)
    const baseTime = race.distance * MS_PER_METER
    const finishTime = baseTime / speed

    return {
      ...horse,
      finishTime,
      position: 0,
    }
  })

  // Sort by finish time (fastest first)
  return horsesWithTimes.sort((a, b) => (a.finishTime || 0) - (b.finishTime || 0))
}
