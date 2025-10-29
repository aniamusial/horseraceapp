<script setup lang="ts">
import { onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import ControlPanel from './components/ControlPanel.vue'
import HorseList from './components/HorseList.vue'
import './styles/main.scss'

const RaceTrack = defineAsyncComponent(() => import('./components/RaceTrack.vue'))
const RaceSchedule = defineAsyncComponent(() => import('./components/RaceSchedule.vue'))
const RaceResults = defineAsyncComponent(() => import('./components/RaceResults.vue'))

const store = useStore()

onMounted(() => {
  store.dispatch('initializeGame')
})

onUnmounted(() => {
  store.dispatch('races/cancelAnimation')
})
</script>

<template>
  <div class="app-container">
    <ControlPanel />
    <div class="main-content">
      <aside class="sidebar left">
        <HorseList />
      </aside>
      <main class="track-area">
        <RaceTrack />
      </main>
      <aside class="sidebar right">
        <div class="right-panels">
          <RaceSchedule />
          <RaceResults />
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './styles/variables.scss';

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: auto;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  gap: $spacing-md;
  padding: $spacing-md;
  flex: 1;
  overflow: visible;
}

.sidebar {
  overflow: visible;
  height: auto;

  &.left,
  &.right {
    min-width: unset;
    max-height: none;
  }
}

.track-area {
  min-height: 400px;
  height: auto;
  overflow: visible;
}

.right-panels {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  height: auto;

  > * {
    overflow: visible;
  }
}

// Tablet and up (1024px+)
@media (min-width: $breakpoint-lg) {
  .app-container {
    height: 100vh;
    overflow: hidden;
  }

  .main-content {
    grid-template-columns: $sidebar-left-width-md 1fr $sidebar-right-width-md;
    grid-template-rows: 1fr;
    overflow: hidden;
  }

  .sidebar {
    overflow-y: auto;

    &.left {
      min-width: $sidebar-left-width-md;
    }

    &.right {
      min-width: $sidebar-right-width-md;
      overflow: hidden;
    }
  }

  .track-area {
    min-height: unset;
    height: auto;
    overflow-y: auto;
  }

  .right-panels {
    display: grid;
    grid-template-rows: 1fr 1fr;
    height: 100%;

    > * {
      overflow: hidden;
    }
  }
}

// Desktop and up (1280px+)
@media (min-width: $breakpoint-xl) {
  .main-content {
    grid-template-columns: $sidebar-left-width 1fr $sidebar-right-width;
  }

  .sidebar {
    &.left {
      min-width: $sidebar-left-width;
    }

    &.right {
      min-width: $sidebar-right-width;
    }
  }
}
</style>
