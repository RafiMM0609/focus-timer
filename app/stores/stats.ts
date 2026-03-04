import { defineStore } from 'pinia'
import type { TimerMode, TimerPhase } from './timer'

export interface Session {
  id: string
  mode: TimerMode
  phase: TimerPhase
  duration: number   // seconds actually elapsed
  completedAt: string  // ISO string
}

export const useStatsStore = defineStore('stats', {
  state: () => ({
    sessions: [] as Session[],
  }),

  getters: {
    todaySessions(): Session[] {
      const today = new Date().toDateString()
      return this.sessions.filter(
        (s) => new Date(s.completedAt).toDateString() === today,
      )
    },
    todayWorkSeconds(): number {
      return this.todaySessions
        .filter((s) => s.phase === 'work')
        .reduce((acc, s) => acc + s.duration, 0)
    },
    todayWorkFormatted(): string {
      const total = this.todayWorkSeconds
      const h = Math.floor(total / 3600)
      const m = Math.floor((total % 3600) / 60)
      if (h > 0) return `${h}j ${m}m`
      return `${m} menit`
    },
    todaySessionCount(): number {
      return this.todaySessions.filter((s) => s.phase === 'work').length
    },
  },

  actions: {
    addSession(session: Omit<Session, 'id' | 'completedAt'>) {
      this.sessions.push({
        ...session,
        id: Math.random().toString(36).slice(2),
        completedAt: new Date().toISOString(),
      })
      // Keep only last 200 sessions
      if (this.sessions.length > 200) {
        this.sessions = this.sessions.slice(-200)
      }
    },
    clearHistory() {
      this.sessions = []
    },
  },

  persist: true,
})
