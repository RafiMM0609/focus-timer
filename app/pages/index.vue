<template>
  <div class="min-h-screen bg-paper font-sans relative overflow-x-hidden">

    <!-- Decorative background blobs -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b-3 border-ink bg-paper/90 backdrop-blur-sm sticky top-0">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">⏱️</span>
          <div>
            <h1 class="font-black text-xl leading-none text-ink tracking-tight">FocusFlow</h1>
            <p class="text-xs font-bold text-ink/50 uppercase tracking-widest">Focus Timer</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Stats toggle -->
          <button
            class="icon-btn"
            :class="{ 'bg-work52 text-white border-ink': showStats }"
            title="Statistik"
            @click="showStats = !showStats"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/>
              <rect x="2" y="13" width="4" height="8"/>
            </svg>
          </button>
          <!-- Settings -->
          <button class="icon-btn" title="Pengaturan" @click="showSettings = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="relative z-10 max-w-2xl mx-auto px-4 py-8">

      <!-- Mode Selector -->
      <div class="mb-8">
        <TimerModeSelector :disabled="timer.isRunning || timer.isPaused" />
      </div>

      <!-- Timer Card -->
      <div
        class="border-3 border-ink shadow-brutal-xl bg-white mb-6 transition-all duration-300"
        :style="{ borderTopColor: timer.modeConfig.color, borderTopWidth: '8px' }"
      >
        <!-- Phase indicator bar -->
        <div
          class="h-1.5 transition-all duration-700"
          :style="{
            width: `${timer.progress * 100}%`,
            backgroundColor: timer.modeConfig.color,
          }"
        />

        <div class="p-6 sm:p-10 flex flex-col items-center gap-8">
          <!-- Timer Display -->
          <TimerDisplay />

          <!-- Controls -->
          <TimerControls
            @start="handleStart"
            @pause="handlePause"
            @reset="handleReset"
            @skip="handleSkip"
            @stop-flow="handleStopFlow"
          />
        </div>
      </div>

      <!-- Motivational message -->
      <div
        v-if="motivationalMsg"
        class="border-3 border-ink shadow-brutal text-center py-3 px-5 font-bold text-sm mb-6 transition-all duration-500"
        :style="{ backgroundColor: timer.modeConfig.lightColor, borderColor: timer.modeConfig.color }"
      >
        {{ motivationalMsg }}
      </div>

      <!-- Stats Panel -->
      <Transition name="slide-down">
        <div v-if="showStats">
          <StatsPanel />
        </div>
      </Transition>

      <!-- Keyboard shortcuts hint -->
      <div class="mt-8 text-center">
        <p class="text-xs text-ink/30 font-bold uppercase tracking-widest">
          Space · Start/Pause &nbsp;|&nbsp; R · Reset &nbsp;|&nbsp; S · Skip
        </p>
      </div>
    </main>

    <!-- Settings Modal -->
    <TimerSettingsModal v-if="showSettings" @close="showSettings = false" />

    <!-- Alarm overlay (shows when finished) -->
    <Transition name="pop">
      <div
        v-if="timer.isFinished"
        class="fixed inset-0 z-40 flex items-center justify-center p-4"
        @click="dismissFinished"
      >
        <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
        <div
          class="relative z-10 border-3 border-ink shadow-brutal-xl p-8 text-center max-w-sm w-full bg-white"
        >
          <div class="text-6xl mb-4">
            {{ timer.phase === 'break' ? '☕' : '🎯' }}
          </div>
          <h2 class="font-black text-2xl text-ink mb-2">
            {{ timer.phase === 'work' ? 'Waktu Istirahat!' : 'Waktu Fokus Lagi!' }}
          </h2>
          <p class="text-ink/60 text-sm mb-6">
            {{ timer.phase === 'work'
              ? `Kerja keras terbayar! Ambil istirahat ${formatBreak}.`
              : 'Istirahat selesai. Saatnya kembali fokus!' }}
          </p>
          <button
            class="w-full py-3 font-black text-white border-3 border-ink shadow-brutal uppercase tracking-wider transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
            :style="{ backgroundColor: timer.modeConfig.color }"
            @click.stop="startNextPhase"
          >
            {{ timer.phase === 'work' ? '☕ Mulai Istirahat' : '🎯 Lanjut Fokus' }}
          </button>
          <button class="mt-3 text-xs font-bold text-ink/40 hover:text-ink" @click.stop="dismissFinished">
            Nanti dulu
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useTimerStore, MODE_CONFIGS } from '~/stores/timer'
import { useSettingsStore } from '~/stores/settings'

const timer = useTimerStore()
const settings = useSettingsStore()
const { startTimer, pauseTimer, resetTimer, skipPhase, stopFlow } = useTimer()
const { playStartSound } = useAlarm()

const showStats = ref(false)
const showSettings = ref(false)

// Dynamic page title
useHead({
  title: computed(() => timer.isRunning || timer.isPaused ? timer.tabTitle : 'FocusFlow — Focus Timer'),
})

// Motivational messages per phase/mode
const motivationalMsgs: Record<string, string[]> = {
  work: [
    '💪 Tetap fokus, kamu bisa!',
    '🚀 Setiap detik menuju tujuanmu!',
    '🔥 Masuk ke zona fokus!',
    '🌟 Produktivitas dimulai dari satu langkah.',
    '📚 Deep work = hasil luar biasa.',
  ],
  break: [
    '☕ Minum air, regangkan tubuh!',
    '😌 Istirahat adalah bagian dari produktivitas.',
    '🧘 Tarik napas, kamu sudah kerja keras!',
    '🌿 Refresh pikiran sebelum babak berikutnya.',
  ],
}

const currentMsgIndex = ref(0)
const motivationalMsg = ref('')

watch(() => timer.phase, (phase) => {
  const msgs = motivationalMsgs[phase] ?? motivationalMsgs.work
  currentMsgIndex.value = Math.floor(Math.random() * msgs.length)
  motivationalMsg.value = msgs[currentMsgIndex.value]!
}, { immediate: true })

watch(() => timer.isRunning, (running) => {
  if (running && !motivationalMsg.value) {
    const msgs = motivationalMsgs[timer.phase] ?? motivationalMsgs.work
    motivationalMsg.value = msgs[Math.floor(Math.random() * msgs.length)]!
  }
})

// Format break duration for finished overlay
const formatBreak = computed(() => {
  const sec = MODE_CONFIGS[timer.mode]?.breakDuration ?? 0
  return `${Math.floor(sec / 60)} menit`
})

// Control handlers
function handleStart() {
  playStartSound()
  startTimer()
}
function handlePause() {
  pauseTimer()
}
function handleReset() {
  resetTimer()
  motivationalMsg.value = ''
}
function handleSkip() {
  skipPhase()
}
function handleStopFlow() {
  stopFlow()
}
function startNextPhase() {
  timer.nextPhase()
  if (settings.autoStart) {
    handleStart()
  }
}
function dismissFinished() {
  timer.nextPhase()
}

// Keyboard shortcuts
function onKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return

  switch (e.key.toLowerCase()) {
    case ' ':
      e.preventDefault()
      if (timer.isRunning) handlePause()
      else handleStart()
      break
    case 'r':
      handleReset()
      break
    case 's':
      if (timer.mode !== 'flow') handleSkip()
      break
    case 'escape':
      showSettings.value = false
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style>
/* Global font & reset */
*, *::before, *::after { box-sizing: border-box; }
body { background-color: #FAFF00; }

/* Decorative blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}
.blob-1 {
  width: 500px; height: 500px;
  background: #FF3A5C;
  top: -100px; right: -100px;
}
.blob-2 {
  width: 400px; height: 400px;
  background: #5B5BD6;
  bottom: -80px; left: -80px;
}
.blob-3 {
  width: 300px; height: 300px;
  background: #00C896;
  top: 40%; left: 50%;
  transform: translateX(-50%);
}

/* Icon button */
.icon-btn {
  @apply w-10 h-10 flex items-center justify-center border-3 border-ink bg-white text-ink
         shadow-brutal-sm transition-all duration-100
         hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal
         active:translate-x-0.5 active:translate-y-0.5 active:shadow-none;
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Pop transition for overlay */
.pop-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
