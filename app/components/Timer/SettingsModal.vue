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

          <div class="flex items-center justify-between p-3 border-3 border-ink bg-white shadow-brutal-sm">
            <div>
              <div class="font-bold text-sm text-ink">Wake Lock (mobile)</div>
              <div class="text-xs text-ink/50">Coba mencegah layar mati saat timer berjalan</div>
            </div>
            <button
              class="w-12 h-6 border-3 border-ink transition-colors relative flex-shrink-0"
              :style="{ backgroundColor: settings.enableWakeLock ? '#00C896' : '#e5e5e5' }"
              @click="settings.toggleWakeLock()"
            >
              <span
                class="absolute top-0.5 w-4 h-3.5 bg-white border-2 border-ink transition-all"
                :class="settings.enableWakeLock ? 'left-5' : 'left-0.5'"
              />
            </button>
          </div>
        </section>

        <!-- Sounds -->
        <section>
          <h3 class="font-black text-sm uppercase tracking-wider text-ink">Sounds</h3>
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">Alarm file (relative)</label>
              <div class="flex gap-2 items-center">
                <input v-model="alarmFile" type="text" class="flex-1 border-3 border-ink px-3 py-2 bg-white"/>
                <button class="px-3 py-2 border-3 border-ink bg-white" @click="playPreview(alarmFile)">Play</button>
                <button class="px-3 py-2 border-3 border-ink bg-white" @click="saveAlarm()">Save</button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <input type="file" accept="audio/*" @change="onAlarmFileChange" />
                <div class="text-xs text-ink/50">Pilih file lokal untuk menyimpannya sebagai preferensi (disimpan di localStorage)</div>
              </div>
              <div class="text-xs text-ink/50 mt-1">Tempatkan file di <strong>/public/sounds/</strong> lalu isi mis. /sounds/my_alarm.mp3</div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">Tick file (relative)</label>
              <div class="flex gap-2 items-center">
                <input v-model="tickFile" type="text" class="flex-1 border-3 border-ink px-3 py-2 bg-white"/>
                <button class="px-3 py-2 border-3 border-ink bg-white" @click="playPreview(tickFile)">Play</button>
                <button class="px-3 py-2 border-3 border-ink bg-white" @click="saveTick()">Save</button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <input type="file" accept="audio/*" @change="onTickFileChange" />
                <div class="text-xs text-ink/50">Pilih file lokal untuk menyimpannya sebagai preferensi (disimpan di localStorage)</div>
              </div>
            </div>
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

// Local bindings for file inputs
const alarmFile = ref(settings.alarmFileUrl || '')
const tickFile = ref(settings.tickFileUrl || '')

function playPreview(url: string) {
  if (!import.meta.client || !url) return
  try {
    const a = new Audio(url)
    a.volume = settings.alarmVolume ?? 0.8
    a.play().catch(() => {})
  } catch (_) {}
}

function saveAlarm() {
  settings.setAlarmFile(alarmFile.value)
}

function saveTick() {
  settings.setTickFile(tickFile.value)
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('file read error'))
    reader.readAsDataURL(file)
  })
}

async function onAlarmFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files && input.files[0]
  if (!f) return
  try {
    const data = await readFileAsDataUrl(f)
    alarmFile.value = data
    settings.setAlarmFile(data)
  } catch (_) {}
}

async function onTickFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files && input.files[0]
  if (!f) return
  try {
    const data = await readFileAsDataUrl(f)
    tickFile.value = data
    settings.setTickFile(data)
  } catch (_) {}
}

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
