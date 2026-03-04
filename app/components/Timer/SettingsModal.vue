<template>
  <UIModal @close="emit('close')">
    <div>
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b-3 border-ink bg-paper">
        <h2 class="font-black text-lg uppercase tracking-wider text-ink">⚙️ Pengaturan</h2>
        <button
          class="w-9 h-9 flex items-center justify-center border-3 border-ink bg-white font-bold text-lg hover:bg-red-100 transition-colors shadow-brutal-sm"
          @click="emit('close')"
        >✕</button>
      </div>

      <div class="px-5 py-5 space-y-6">
        <!-- Custom Timer Durations -->
        <section>
          <h3 class="font-black text-sm uppercase tracking-wider mb-3 text-ink flex items-center gap-2">
            <span class="w-4 h-4 inline-block" :style="{ backgroundColor: '#00C896' }" />
            Custom Timer
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">
                Waktu Fokus (menit)
              </label>
              <input
                v-model.number="customWork"
                type="number"
                min="1"
                max="180"
                class="w-full border-3 border-ink px-3 py-2 font-mono font-bold text-center text-ink bg-white focus:outline-none focus:bg-yellow-50 shadow-brutal-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">
                Istirahat (menit)
              </label>
              <input
                v-model.number="customBreak"
                type="number"
                min="1"
                max="60"
                class="w-full border-3 border-ink px-3 py-2 font-mono font-bold text-center text-ink bg-white focus:outline-none focus:bg-yellow-50 shadow-brutal-sm"
              />
            </div>
          </div>
        </section>

        <!-- Toggles -->
        <section class="space-y-3">
          <h3 class="font-black text-sm uppercase tracking-wider text-ink">Preferensi</h3>

          <div class="flex items-center justify-between p-3 border-3 border-ink bg-white shadow-brutal-sm">
            <div>
              <div class="font-bold text-sm text-ink">Auto-start fase berikutnya</div>
              <div class="text-xs text-ink/50">Otomatis mulai istirahat/fokus setelah selesai</div>
            </div>
            <button
              class="w-12 h-6 border-3 border-ink transition-colors relative flex-shrink-0"
              :style="{ backgroundColor: settings.autoStart ? '#00C896' : '#e5e5e5' }"
              @click="settings.toggleAutoStart()"
            >
              <span
                class="absolute top-0.5 w-4 h-3.5 bg-white border-2 border-ink transition-all"
                :class="settings.autoStart ? 'left-5' : 'left-0.5'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between p-3 border-3 border-ink bg-white shadow-brutal-sm">
            <div>
              <div class="font-bold text-sm text-ink">Notifikasi browser</div>
              <div class="text-xs text-ink/50">Notif muncul meski tab tidak aktif</div>
            </div>
            <button
              class="w-12 h-6 border-3 border-ink transition-colors relative flex-shrink-0"
              :style="{ backgroundColor: settings.browserNotifications ? '#5B5BD6' : '#e5e5e5' }"
              @click="toggleNotifications()"
            >
              <span
                class="absolute top-0.5 w-4 h-3.5 bg-white border-2 border-ink transition-all"
                :class="settings.browserNotifications ? 'left-5' : 'left-0.5'"
              />
            </button>
          </div>
        </section>

        <!-- Timer presets info -->
        <section>
          <h3 class="font-black text-sm uppercase tracking-wider text-ink mb-2">Mode Timer</h3>
          <div class="space-y-1.5">
            <div v-for="preset in presets" :key="preset.name" class="flex items-center gap-2 text-xs">
              <span class="w-3 h-3 border-2 border-ink flex-shrink-0" :style="{ backgroundColor: preset.color }" />
              <span class="font-bold text-ink">{{ preset.emoji }} {{ preset.name }}</span>
              <span class="text-ink/40 ml-auto">{{ preset.detail }}</span>
            </div>
          </div>
        </section>

        <!-- Shortcut keys -->
        <section>
          <h3 class="font-black text-sm uppercase tracking-wider text-ink mb-2">Keyboard Shortcuts</h3>
          <div class="grid grid-cols-2 gap-1.5 text-xs">
            <div v-for="sc in shortcuts" :key="sc.key" class="flex items-center gap-1.5">
              <kbd class="px-1.5 py-0.5 border-2 border-ink bg-white font-mono font-bold text-xs shadow-brutal-sm">{{ sc.key }}</kbd>
              <span class="text-ink/60">{{ sc.desc }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const settings = useSettingsStore()
const { requestPermission } = useNotification()

const presets = [
  { color: '#FF3A5C', emoji: '🍅', name: 'Pomodoro', detail: '25 min fokus · 5 min istirahat' },
  { color: '#5B5BD6', emoji: '⚡', name: '52/17', detail: '52 min fokus · 17 min istirahat' },
  { color: '#00C896', emoji: '⚙️', name: 'Custom', detail: 'Sesuai pengaturan di atas' },
  { color: '#FF8800', emoji: '🌊', name: 'Flow', detail: 'Tanpa batas · stopwatch mode' },
]

const shortcuts = [
  { key: 'Space', desc: 'Play / Pause' },
  { key: 'R', desc: 'Reset timer' },
  { key: 'S', desc: 'Skip fase' },
  { key: 'Esc', desc: 'Tutup modal' },
]

const customWork = computed({
  get: () => settings.customWorkMinutes,
  set: (v) => settings.setCustomWork(v),
})
const customBreak = computed({
  get: () => settings.customBreakMinutes,
  set: (v) => settings.setCustomBreak(v),
})

async function toggleNotifications() {
  if (!settings.browserNotifications) {
    const granted = await requestPermission()
    if (granted) settings.toggleNotifications()
  } else {
    settings.toggleNotifications()
  }
}
</script>

<!-- PresetRow and KbdRow are defined inline as template helpers above -->
