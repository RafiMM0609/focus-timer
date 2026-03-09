import { useTimerStore, MODE_CONFIGS } from '~/stores/timer'
import { useSettingsStore } from '~/stores/settings'
import { useStatsStore } from '~/stores/stats'

export function useTimer() {
  const timer = useTimerStore()
  const settings = useSettingsStore()
  const stats = useStatsStore()
  const { playAlarm } = useAlarm()
  const { sendNotification } = useNotification()

  let intervalId: ReturnType<typeof setInterval> | null = null
  // expected end timestamp in ms (wall clock) used for reconciliation
  let expectedEndMs: number | null = null
  let wakeLock: any = null

  // Apply custom durations when custom mode is set
  watch(() => timer.mode, (mode) => {
    if (mode === 'custom') {
      MODE_CONFIGS.custom.workDuration = settings.customWorkMinutes * 60
      MODE_CONFIGS.custom.breakDuration = settings.customBreakMinutes * 60
      timer.reset()
    }
  })

  watch(() => settings.customWorkMinutes, (val) => {
    if (timer.mode === 'custom' && timer.isIdle) {
      MODE_CONFIGS.custom.workDuration = val * 60
      timer.reset()
    }
  })

  watch(() => settings.customBreakMinutes, (val) => {
    if (timer.mode === 'custom' && timer.isIdle) {
      MODE_CONFIGS.custom.breakDuration = val * 60
      timer.reset()
    }
  })

  function reconcileTick() {
    if (timer.status !== 'running') return

    if (timer.mode === 'flow') {
      timer.tick()
      return
    }

    const now = Date.now()
    if (expectedEndMs == null) {
      // fallback to simple tick
      if (timer.timeLeft > 0) timer.tick()
      if (timer.timeLeft <= 0) handlePhaseComplete()
      return
    }

    const remainingMs = expectedEndMs - now
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000))
    if (remainingSec !== timer.timeLeft) {
      timer.timeLeft = remainingSec
    }
    if (timer.timeLeft <= 0) {
      handlePhaseComplete()
    }
  }

  function startTicking() {
    if (intervalId) return
    intervalId = setInterval(() => reconcileTick(), 1000)
    // attempt immediate reconcile so UI updates without waiting 1s
    reconcileTick()
  }

  function stopTicking() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function saveExpectedEnd() {
    if (expectedEndMs != null && import.meta.client) {
      localStorage.setItem('focusflow.expectedEndMs', String(expectedEndMs))
    }
  }

  function clearExpectedEnd() {
    expectedEndMs = null
    if (import.meta.client) localStorage.removeItem('focusflow.expectedEndMs')
  }

  function loadExpectedEnd() {
    if (!import.meta.client) return null
    const v = localStorage.getItem('focusflow.expectedEndMs')
    if (!v) return null
    const n = Number(v)
    if (Number.isFinite(n)) return n
    return null
  }

  function handlePhaseComplete() {
    stopTicking()
    clearExpectedEnd()
    timer.finish()
    const config = MODE_CONFIGS[timer.mode]
    const duration = timer.phase === 'work' ? config.workDuration : config.breakDuration

    stats.addSession({
      mode: timer.mode,
      phase: timer.phase,
      duration,
    })

    const phaseLabel = timer.phase === 'work' ? 'Fokus' : 'Istirahat'
    const nextLabel = timer.phase === 'work' ? 'Istirahat' : 'Fokus'
    playAlarm()
    sendNotification(`Sesi ${phaseLabel} selesai! 🎉`, `Waktunya ${nextLabel}`)

    // release wake lock if held
    if (wakeLock && typeof wakeLock.release === 'function') {
      try { wakeLock.release().catch?.(() => {}) } catch (_) {}
      wakeLock = null
    }

    if (settings.autoStart) {
      setTimeout(() => {
        timer.nextPhase()
        startTimer()
      }, 1500)
    }
  }

  function startTimer() {
    if (timer.mode === 'custom') {
      MODE_CONFIGS.custom.workDuration = settings.customWorkMinutes * 60
      MODE_CONFIGS.custom.breakDuration = settings.customBreakMinutes * 60
    }
    if (timer.isIdle) {
      timer.start()
    } else if (timer.isPaused) {
      timer.resume()
    }

    // For countdown modes compute expected end timestamp based on current timeLeft
    if (timer.mode !== 'flow') {
      expectedEndMs = Date.now() + timer.timeLeft * 1000
      saveExpectedEnd()
    }

    // Try request Wake Lock if user enabled it
    if (import.meta.client && settings.enableWakeLock && 'wakeLock' in navigator) {
      try {
        ;(navigator as any).wakeLock.request('screen').then((lock: any) => {
          wakeLock = lock
        }).catch(() => {})
      } catch (_) {}
    }

    startTicking()
  }

  function pauseTimer() {
    timer.pause()
    stopTicking()
    // persist remaining state and clear expected end
    clearExpectedEnd()
    if (wakeLock && typeof wakeLock.release === 'function') {
      try { wakeLock.release().catch?.(() => {}) } catch (_) {}
      wakeLock = null
    }
  }

  function resetTimer() {
    stopTicking()
    timer.reset()
    clearExpectedEnd()
    if (timer.mode === 'custom') {
      MODE_CONFIGS.custom.workDuration = settings.customWorkMinutes * 60
      MODE_CONFIGS.custom.breakDuration = settings.customBreakMinutes * 60
      timer.timeLeft = settings.customWorkMinutes * 60
      timer.totalTime = settings.customWorkMinutes * 60
    }
  }

  function skipPhase() {
    const elapsed = timer.mode === 'flow'
      ? timer.flowElapsed
      : MODE_CONFIGS[timer.mode].workDuration - timer.timeLeft

    stats.addSession({
      mode: timer.mode,
      phase: timer.phase,
      duration: elapsed,
    })

    stopTicking()
    timer.skipPhase()
  }

  function stopFlow() {
    stats.addSession({
      mode: 'flow',
      phase: 'work',
      duration: timer.flowElapsed,
    })
    stopTicking()
    timer.finish()
    playAlarm()
    clearExpectedEnd()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopTicking()
    clearExpectedEnd()
  })

  // Reconcile state when page becomes visible again
  if (import.meta.client) {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const v = loadExpectedEnd()
        if (v) {
          expectedEndMs = v
          reconcileTick()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    onUnmounted(() => document.removeEventListener('visibilitychange', handleVisibility))
    // load persisted expected end if any when composable is initialized
    const persisted = loadExpectedEnd()
    if (persisted) expectedEndMs = persisted
  }

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    skipPhase,
    stopFlow,
  }
}
