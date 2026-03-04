<template>
  <div class="flex flex-col items-center">
    <!-- Mode badge -->
    <div
      class="mb-4 px-5 py-1.5 border-3 border-ink font-bold text-sm uppercase tracking-[0.2em] shadow-brutal-sm"
      :style="{ backgroundColor: timer.modeConfig.color, color: '#fff' }"
    >
      {{ phaseLabel }}
    </div>

    <!-- Circular progress -->
    <UIProgressRing
      :progress="timer.progress"
      :color="timer.modeConfig.color"
      :size="ringSize"
      :stroke-width="strokeWidth"
      :track-width="strokeWidth"
    >
      <div class="flex flex-col items-center gap-1 select-none">
        <!-- Time display -->
        <span
          class="font-mono font-bold text-ink leading-none tabular-nums"
          :class="timeFontSize"
          :style="timer.isFinished ? { color: timer.modeConfig.color } : {}"
        >
          {{ timer.formattedTime }}
        </span>

        <!-- Finished label  -->
        <span
          v-if="timer.isFinished"
          class="font-bold text-xs uppercase tracking-widest mt-1 animate-bounce"
          :style="{ color: timer.modeConfig.color }"
        >
          ✓ Selesai!
        </span>

        <!-- Status indicator -->
        <span
          v-else
          class="text-xs font-bold uppercase tracking-widest opacity-50 mt-1"
        >
          {{ statusLabel }}
        </span>
      </div>
    </UIProgressRing>

    <!-- Session dots (pomodoro & 52/17 & custom) -->
    <div v-if="timer.mode !== 'flow'" class="flex gap-2 mt-5">
      <div
        v-for="i in 4"
        :key="i"
        class="w-3.5 h-3.5 border-3 border-ink transition-colors duration-300"
        :style="i <= (timer.sessionCount % 4 || (timer.sessionCount > 0 && timer.sessionCount % 4 === 0 ? 4 : 0))
          ? { backgroundColor: timer.modeConfig.color }
          : { backgroundColor: 'white' }"
      />
    </div>

    <!-- Custom mode: inline duration editor (only when idle) -->
    <div
      v-if="timer.mode === 'custom' && timer.isIdle"
      class="mt-5 flex flex-col items-center gap-2"
    >
      <p class="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">Atur Durasi</p>
      <div class="flex items-end gap-3">
        <!-- Fokus minutes -->
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs font-bold text-ink/50 uppercase tracking-wider">Fokus</span>
          <div class="flex items-center border-3 border-ink shadow-brutal-sm bg-white overflow-hidden">
            <button
              class="w-8 h-9 font-black text-lg text-ink hover:bg-muted active:bg-gray-100 transition-colors"
              @click="settings.setCustomWork(settings.customWorkMinutes - 1)"
            >−</button>
            <input
              :value="settings.customWorkMinutes"
              type="number"
              min="1"
              max="180"
              class="w-10 text-center font-mono font-bold text-sm text-ink bg-white focus:outline-none focus:bg-yellow-50 h-9 border-x-2 border-ink/20"
              @change="settings.setCustomWork(Number(($event.target as HTMLInputElement).value))"
            />
            <button
              class="w-8 h-9 font-black text-lg text-ink hover:bg-muted active:bg-gray-100 transition-colors"
              @click="settings.setCustomWork(settings.customWorkMinutes + 1)"
            >+</button>
          </div>
          <span class="text-xs text-ink/40 font-bold">menit</span>
        </div>

        <span class="font-black text-ink/30 mb-6 text-lg">/</span>

        <!-- Istirahat minutes -->
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs font-bold text-ink/50 uppercase tracking-wider">Istirahat</span>
          <div class="flex items-center border-3 border-ink shadow-brutal-sm bg-white overflow-hidden">
            <button
              class="w-8 h-9 font-black text-lg text-ink hover:bg-muted active:bg-gray-100 transition-colors"
              @click="settings.setCustomBreak(settings.customBreakMinutes - 1)"
            >−</button>
            <input
              :value="settings.customBreakMinutes"
              type="number"
              min="1"
              max="60"
              class="w-10 text-center font-mono font-bold text-sm text-ink bg-white focus:outline-none focus:bg-yellow-50 h-9 border-x-2 border-ink/20"
              @change="settings.setCustomBreak(Number(($event.target as HTMLInputElement).value))"
            />
            <button
              class="w-8 h-9 font-black text-lg text-ink hover:bg-muted active:bg-gray-100 transition-colors"
              @click="settings.setCustomBreak(settings.customBreakMinutes + 1)"
            >+</button>
          </div>
          <span class="text-xs text-ink/40 font-bold">menit</span>
        </div>
      </div>
    </div>

    <!-- Flow elapsed label -->
    <div v-else-if="timer.mode === 'flow'" class="mt-5 font-bold text-ink/60 text-sm tracking-widest uppercase">
      Flow berjalan...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimerStore } from '~/stores/timer'
import { useSettingsStore } from '~/stores/settings'

const timer = useTimerStore()
const settings = useSettingsStore()

// Responsive sizing via matchMedia
const isLg = ref(false)
onMounted(() => {
  const mq = window.matchMedia('(min-width: 640px)')
  isLg.value = mq.matches
  mq.addEventListener('change', (e) => { isLg.value = e.matches })
})

const ringSize = computed(() => isLg.value ? 340 : 290)
const strokeWidth = computed(() => isLg.value ? 16 : 13)
const timeFontSize = computed(() => isLg.value ? 'text-7xl' : 'text-6xl')

const phaseLabel = computed(() => {
  if (timer.mode === 'flow') return '🌊 Flow State'
  return timer.phase === 'work' ? '🎯 Fokus' : '☕ Istirahat'
})

const statusLabel = computed(() => {
  if (timer.isRunning) return '● Berjalan'
  if (timer.isPaused) return '⏸ Dijeda'
  return 'Siap'
})
</script>
