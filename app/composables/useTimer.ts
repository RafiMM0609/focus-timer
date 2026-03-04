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

  function startTicking() {
    if (intervalId) return
    intervalId = setInterval(() => {
      if (timer.status !== 'running') {
        clearInterval(intervalId!)
        intervalId = null
        return
      }

      // Flow mode: count up indefinitely
      if (timer.mode === 'flow') {
        timer.tick()
        return
      }

      // Normal countdown — tepat 1 detik per interval
      if (timer.timeLeft <= 0) {
        handlePhaseComplete()
        return
      }
      timer.tick()
      if (timer.timeLeft <= 0) {
        handlePhaseComplete()
      }
    }, 1000)
  }

  function stopTicking() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function handlePhaseComplete() {
    stopTicking()
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
    startTicking()
  }

  function pauseTimer() {
    timer.pause()
    stopTicking()
  }

  function resetTimer() {
    stopTicking()
    timer.reset()
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
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopTicking()
  })

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    skipPhase,
    stopFlow,
  }
}
