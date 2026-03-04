<template>
  <div class="flex items-center justify-center gap-3 flex-wrap">
    <!-- Reset -->
    <button
      class="btn-icon"
      title="Reset (R)"
      @click="emit('reset')"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
      </svg>
    </button>

    <!-- Play / Pause — main CTA -->
    <button
      class="btn-primary"
      :style="{ backgroundColor: modeColor, borderColor: '#0D0D0D' }"
      :title="isRunning ? 'Pause (Space)' : 'Start (Space)'"
      @click="onPlayPause"
    >
      <!-- Play icon -->
      <svg v-if="!isRunning" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      <!-- Pause icon -->
      <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
      </svg>
    </button>

    <!-- Skip / Stop Flow -->
    <button
      v-if="timer.mode !== 'flow'"
      class="btn-icon"
      title="Skip phase (S)"
      @click="emit('skip')"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5"/>
      </svg>
    </button>

    <button
      v-else-if="isRunning || timer.isPaused"
      class="btn-icon"
      title="Stop Flow"
      @click="emit('stopFlow')"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTimerStore } from '~/stores/timer'

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
  (e: 'reset'): void
  (e: 'skip'): void
  (e: 'stopFlow'): void
}>()

const timer = useTimerStore()
const isRunning = computed(() => timer.isRunning)
const modeColor = computed(() => timer.modeConfig.color)

function onPlayPause() {
  if (timer.isRunning) {
    emit('pause')
  } else {
    emit('start')
  }
}
</script>

<style scoped>
.btn-primary {
  @apply w-20 h-20 flex items-center justify-center text-white border-3 border-ink
         shadow-brutal font-bold transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none
         hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg;
}

.btn-icon {
  @apply w-12 h-12 flex items-center justify-center bg-white text-ink border-3 border-ink
         shadow-brutal-sm transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none
         hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal;
}
</style>
