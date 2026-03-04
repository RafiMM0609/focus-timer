<template>
  <div class="flex gap-2 flex-wrap justify-center">
    <button
      v-for="mode in modes"
      :key="mode.id"
      :disabled="disabled"
      :class="[
        'relative px-4 py-2 font-bold text-sm uppercase tracking-wider border-3 border-ink rounded-none transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        activeMode === mode.id
          ? 'text-white shadow-brutal-sm translate-x-[-2px] translate-y-[-2px]'
          : 'bg-white text-ink hover:shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none',
      ]"
      :style="activeMode === mode.id ? { backgroundColor: mode.color } : {}"
      @click="selectMode(mode.id)"
    >
      <span class="flex items-center gap-1.5">
        <span class="text-base">{{ mode.emoji }}</span>
        {{ mode.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTimerStore } from '~/stores/timer'
import type { TimerMode } from '~/stores/timer'

const props = defineProps<{
  disabled?: boolean
}>()

const timer = useTimerStore()
const activeMode = computed(() => timer.mode)

const modes: Array<{ id: TimerMode; label: string; color: string; emoji: string }> = [
  { id: 'pomodoro', label: 'Pomodoro', color: '#FF3A5C', emoji: '🍅' },
  { id: 'work52', label: '52/17', color: '#5B5BD6', emoji: '⚡' },
  { id: 'custom', label: 'Custom', color: '#00C896', emoji: '⚙️' },
  { id: 'flow', label: 'Flow', color: '#FF8800', emoji: '🌊' },
]

function selectMode(mode: TimerMode) {
  if (!props.disabled) {
    timer.setMode(mode)
  }
}
</script>
