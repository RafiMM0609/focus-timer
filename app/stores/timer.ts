import { defineStore } from 'pinia'

export type TimerMode = 'pomodoro' | 'work52' | 'custom' | 'flow'

export interface ModeConfig {
  workDuration: number   // seconds
  breakDuration: number  // seconds
  label: string
  shortLabel: string
  color: string
  bgColor: string
  lightColor: string
}

export const MODE_CONFIGS: Record<TimerMode, ModeConfig> = {
  pomodoro: {
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    label: 'Pomodoro 25/5',
    shortLabel: 'Pomodoro',
    color: '#FF3A5C',
    bgColor: '#FF3A5C',
    lightColor: '#FFD6DD',
  },
  work52: {
    workDuration: 52 * 60,
    breakDuration: 17 * 60,
    label: '52/17 Method',
    shortLabel: '52/17',
    color: '#5B5BD6',
    bgColor: '#5B5BD6',
    lightColor: '#E0E0FF',
  },
  custom: {
    workDuration: 30 * 60,
    breakDuration: 10 * 60,
    label: 'Custom Timer',
    shortLabel: 'Custom',
    color: '#00C896',
    bgColor: '#00C896',
    lightColor: '#C6FFF0',
  },
  flow: {
    workDuration: 0,
    breakDuration: 0,
    label: 'Flow State',
    shortLabel: 'Flow',
    color: '#FF8800',
    bgColor: '#FF8800',
    lightColor: '#FFE8C0',
  },
}

export type TimerPhase = 'work' | 'break'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    mode: 'pomodoro' as TimerMode,
    phase: 'work' as TimerPhase,
    status: 'idle' as TimerStatus,
    timeLeft: 25 * 60,        // seconds
    totalTime: 25 * 60,       // for progress calculation
    sessionCount: 0,           // completed pomodoros/work sessions
    flowElapsed: 0,            // for flow mode: seconds elapsed
  }),

  getters: {
    progress: (state): number => {
      if (state.mode === 'flow') {
        // Progress cycles every 30 minutes for visual
        return (state.flowElapsed % (30 * 60)) / (30 * 60)
      }
      if (state.totalTime === 0) return 0
      return 1 - state.timeLeft / state.totalTime
    },
    modeConfig: (state): ModeConfig => MODE_CONFIGS[state.mode],
    formattedTime: (state): string => {
      const t = state.mode === 'flow' ? state.flowElapsed : state.timeLeft
      const m = Math.floor(t / 60)
      const s = t % 60
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    },
    tabTitle: (state): string => {
      const t = state.mode === 'flow' ? state.flowElapsed : state.timeLeft
      const m = Math.floor(t / 60)
      const s = t % 60
      const time = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      const phase = state.phase === 'work' ? 'Focus' : 'Break'
      return `${time} · ${phase} — FocusFlow`
    },
    isRunning: (state): boolean => state.status === 'running',
    isPaused: (state): boolean => state.status === 'paused',
    isIdle: (state): boolean => state.status === 'idle',
    isFinished: (state): boolean => state.status === 'finished',
  },

  actions: {
    setMode(mode: TimerMode) {
      this.mode = mode
      this.reset()
    },
    start() {
      this.status = 'running'
    },
    pause() {
      this.status = 'paused'
    },
    resume() {
      this.status = 'running'
    },
    reset() {
      this.status = 'idle'
      this.phase = 'work'
      this.flowElapsed = 0
      const config = MODE_CONFIGS[this.mode]
      this.timeLeft = config.workDuration
      this.totalTime = config.workDuration
    },
    tick() {
      if (this.mode === 'flow') {
        this.flowElapsed++
      } else {
        if (this.timeLeft > 0) {
          this.timeLeft--
        }
      }
    },
    finish() {
      this.status = 'finished'
    },
    nextPhase() {
      if (this.phase === 'work') {
        this.sessionCount++
        this.phase = 'break'
        const config = MODE_CONFIGS[this.mode]
        this.timeLeft = config.breakDuration
        this.totalTime = config.breakDuration
      } else {
        this.phase = 'work'
        const config = MODE_CONFIGS[this.mode]
        this.timeLeft = config.workDuration
        this.totalTime = config.workDuration
      }
      this.status = 'idle'
    },
    skipPhase() {
      this.nextPhase()
    },
  },
})
