import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // Custom mode durations (in minutes)
    customWorkMinutes: 30,
    customBreakMinutes: 10,
    // Notifications
    browserNotifications: false,
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
    setVolume(vol: number) {
      this.alarmVolume = Math.max(0, Math.min(1, vol))
    },
  },

  persist: true,
})
