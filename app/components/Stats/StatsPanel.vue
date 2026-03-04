<template>
  <div>
    <!-- Stats summary cards -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="stat-card border-pomodoro">
        <div class="stat-value text-pomodoro">{{ stats.todayWorkFormatted }}</div>
        <div class="stat-label">Total Fokus Hari Ini</div>
      </div>
      <div class="stat-card border-work52">
        <div class="stat-value text-work52">{{ stats.todaySessionCount }}</div>
        <div class="stat-label">Sesi Selesai</div>
      </div>
    </div>

    <!-- Session history -->
    <div class="border-3 border-ink shadow-brutal bg-white">
      <div class="flex items-center justify-between px-4 py-2.5 border-b-3 border-ink bg-paper">
        <span class="font-bold text-sm uppercase tracking-wider text-ink">Riwayat Hari Ini</span>
        <button
          v-if="stats.todaySessions.length > 0"
          class="text-xs font-bold text-ink/50 hover:text-red-500 transition-colors"
          @click="showConfirmClear = true"
        >
          Hapus
        </button>
      </div>

      <div v-if="stats.todaySessions.length === 0" class="py-10 text-center text-ink/40 text-sm font-bold">
        Belum ada sesi hari ini.<br>Mulai timer dan raih produktivitas! 🚀
      </div>

      <div v-else class="max-h-56 overflow-y-auto divide-y-2 divide-ink/10">
        <div
          v-for="session in reversedSessions"
          :key="session.id"
          class="flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors"
        >
          <div class="flex items-center gap-2.5">
            <span
              class="w-2.5 h-2.5 border-2 border-ink inline-block flex-shrink-0"
              :style="{ backgroundColor: modeColor(session.mode) }"
            />
            <div>
              <div class="font-bold text-sm text-ink">{{ modeLabel(session.mode) }}</div>
              <div class="text-xs text-ink/50">{{ phaseLabel(session.phase) }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-sm text-ink">{{ formatDuration(session.duration) }}</div>
            <div class="text-xs text-ink/40">{{ formatTime(session.completedAt) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm clear modal -->
    <UIModal v-if="showConfirmClear" @close="showConfirmClear = false">
      <div class="p-6">
        <h3 class="font-black text-xl mb-3 text-ink">Hapus Semua Riwayat?</h3>
        <p class="text-ink/60 mb-5 text-sm">Tindakan ini tidak bisa dibatalkan.</p>
        <div class="flex gap-3">
          <button
            class="flex-1 py-2.5 border-3 border-ink font-bold text-sm bg-white hover:bg-muted transition-colors shadow-brutal-sm"
            @click="showConfirmClear = false"
          >Batal</button>
          <button
            class="flex-1 py-2.5 border-3 border-ink font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors shadow-brutal-sm"
            @click="clearHistory"
          >Hapus</button>
        </div>
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import { useStatsStore } from '~/stores/stats'
import { MODE_CONFIGS } from '~/stores/timer'
import type { TimerMode, TimerPhase } from '~/stores/timer'

const stats = useStatsStore()
const showConfirmClear = ref(false)

const reversedSessions = computed(() =>
  [...stats.todaySessions].reverse()
)

function modeColor(mode: TimerMode) {
  return MODE_CONFIGS[mode]?.color ?? '#888'
}

function modeLabel(mode: TimerMode) {
  return MODE_CONFIGS[mode]?.shortLabel ?? mode
}

function phaseLabel(phase: TimerPhase) {
  return phase === 'work' ? '🎯 Fokus' : '☕ Istirahat'
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function clearHistory() {
  stats.clearHistory()
  showConfirmClear.value = false
}
</script>

<style scoped>
.stat-card {
  @apply border-3 border-ink shadow-brutal bg-white px-4 py-3;
}
.stat-value {
  @apply font-black text-3xl leading-none font-mono;
}
.stat-label {
  @apply text-xs font-bold text-ink/50 uppercase tracking-wider mt-1;
}
</style>
