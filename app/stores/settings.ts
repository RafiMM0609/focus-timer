import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // Custom mode durations (in minutes)
    customWorkMinutes: 30,
    customBreakMinutes: 10,
    // Notifications
    browserNotifications: false,
    // Custom audio files (relative to public/), e.g. '/sounds/default_alarm.mp3'
    alarmFileUrl: '/sounds/default_alarm.mp3',
    tickFileUrl: '/sounds/default_tick.mp3',
    // Try to keep screen awake on mobile while timer runs
    enableWakeLock: false,
    // Auto-start next phase
    autoStart: false,
    // Volume: 0–1
    alarmVolume: 0.8,
  }),

  actions: {
    setCustomWork(minutes: number) {
      this.customWorkMinutes = Math.max(1, Math.min(180, minutes))
    },
    setCustomBreak(minutes: number) {
      this.customBreakMinutes = Math.max(1, Math.min(60, minutes))
    },
    toggleNotifications() {
      this.browserNotifications = !this.browserNotifications
    },
    toggleAutoStart() {
      this.autoStart = !this.autoStart
    },
    setAlarmFile(url: string) {
      this.alarmFileUrl = url
    },
    setTickFile(url: string) {
      this.tickFileUrl = url
    },
    toggleWakeLock() {
      this.enableWakeLock = !this.enableWakeLock
    },
    setVolume(vol: number) {
      this.alarmVolume = Math.max(0, Math.min(1, vol))
    },
  },

  persist: true,
})
