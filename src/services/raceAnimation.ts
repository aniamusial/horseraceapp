import type { Horse } from '@/types'

const PROGRESS_COMPLETE = 100

export interface RaceAnimationCallbacks {
  onUpdatePosition: (horseId: number, position: number) => void
  onComplete: () => void
  shouldContinue: () => boolean
  onFrameRequested?: (frameId: number) => void
}

export interface RaceAnimationState {
  simulatedHorses: Horse[]
  startTime: number
  elapsedBeforePause: number
}

/**
 * Creates a race animator that handles the animation loop
 * Returns a function that starts the animation
 */
export function createRaceAnimator(
  state: RaceAnimationState,
  callbacks: RaceAnimationCallbacks,
): () => Promise<void> {
  const { simulatedHorses, startTime, elapsedBeforePause } = state
  const { onUpdatePosition, onComplete, shouldContinue, onFrameRequested } = callbacks

  const slowestTime = Math.max(...simulatedHorses.map((horse) => horse.finishTime || 0))

  return () => {
    return new Promise<void>((resolve) => {
      const animate = () => {
        const currentElapsed = Date.now() - startTime
        const totalElapsed = elapsedBeforePause + currentElapsed

        let allFinished = true

        simulatedHorses.forEach((horse) => {
          const finishTime = horse.finishTime || slowestTime
          const progress = Math.min(
            (totalElapsed / finishTime) * PROGRESS_COMPLETE,
            PROGRESS_COMPLETE,
          )

          onUpdatePosition(horse.id, progress)

          if (progress < PROGRESS_COMPLETE) {
            allFinished = false
          }
        })

        if (!allFinished && shouldContinue()) {
          const frameId = requestAnimationFrame(animate)
          onFrameRequested?.(frameId)
        } else if (allFinished) {
          // Ensure all horses are at 100%
          simulatedHorses.forEach((horse) => {
            onUpdatePosition(horse.id, PROGRESS_COMPLETE)
          })
          onComplete()
          resolve()
        } else {
          resolve()
        }
      }

      const frameId = requestAnimationFrame(animate)
      onFrameRequested?.(frameId)
    })
  }
}

/**
 * Checks if all horses in a race have finished
 */
export function areAllHorsesFinished(simulation: Horse[], currentRaceHorses: Horse[]): boolean {
  return simulation.every((horse) => {
    const raceHorse = currentRaceHorses.find((raceHorse) => raceHorse.id === horse.id)
    return raceHorse && (raceHorse.position ?? 0) >= PROGRESS_COMPLETE
  })
}
