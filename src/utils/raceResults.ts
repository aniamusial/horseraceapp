import type { Horse, RaceResult } from '@/types'

export function calculateRaceResults(simulatedHorses: Horse[]): RaceResult[] {
  return simulatedHorses.map((horse, index) => ({
    position: index + 1,
    horseName: horse.name,
    horseId: horse.id,
    time: horse.finishTime || 0,
  }))
}
