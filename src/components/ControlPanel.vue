<template>
  <div class="control-panel">
    <h1 class="control-panel__title">Horse Racing</h1>
    <div class="control-panel__buttons">
      <HrButton
        :variant="HrButtonVariant.PRIMARY"
        :disabled="!canGenerate"
        aria-label="Generate race program"
        @click="handleGenerate"
      >
        GENERATE PROGRAM
      </HrButton>
      <HrButton
        :variant="HrButtonVariant.SECONDARY"
        :disabled="!canStart"
        :aria-label="ariaLabelText"
        @click="handleStartPause"
      >
        {{ isRacing ? 'PAUSE' : isPaused ? 'RESUME' : 'START' }}
      </HrButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HrButton from './ui/HrButton/HrButton.vue'
import { HrButtonVariant } from './ui/HrButton/typings'
import { useGameState } from '@/composables/useGameState'

const { canGenerate, canStart, isRacing, isPaused, generateProgram, startRace, pauseRace } =
  useGameState()

const handleGenerate = () => {
  generateProgram()
}

const handleStartPause = () => {
  if (isRacing.value) {
    pauseRace()
  } else {
    startRace()
  }
}

const ariaLabelText = computed(() => {
  if (isRacing.value) {
    return 'Pause race'
  }
  if (isPaused.value) {
    return 'Resume race'
  }
  return 'Start race'
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.control-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: $spacing-md;
  background: $primary;
  gap: $spacing-md;

  &__title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $white;
    text-align: center;
  }

  &__buttons {
    display: flex;
    gap: $spacing-md;
    flex-wrap: wrap;
    justify-content: center;
  }

  // Tablet and up (1024px+)
  @media (min-width: $breakpoint-lg) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md $spacing-xl;

    &__title {
      font-size: $font-size-3xl;
      text-align: left;
    }

    &__buttons {
      justify-content: flex-start;
    }
  }
}
</style>
