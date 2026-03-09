import { useSettingsStore } from '~/stores/settings'

export function useAlarm() {
  const settings = useSettingsStore()
  let audioCtx: AudioContext | null = null
  let lastAudioEl: HTMLAudioElement | null = null

  function getAudioContext() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContext()
      // Try to resume right away in case it was created after a user gesture
      try {
        audioCtx.resume().catch(() => {})
      } catch (_) {}
    }
    return audioCtx
  }

  function playTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    volume = 0.5,
  ) {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(frequency, startTime)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  }

  function playAlarm(volume = 0.6) {
    if (!import.meta.client) return
    // Prefer custom audio file if set
    try {
      const fileUrl = settings.alarmFileUrl
      const vol = settings.alarmVolume ?? volume
      if (fileUrl) {
        playAudioFile(fileUrl, vol)
        return
      }
      const ctx = getAudioContext()
      const now = ctx.currentTime

      // Ascending cheerful 4-beep fanfare
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        playTone(ctx, freq, now + i * 0.18, 0.22, vol)
      })
      // Final long sustain
      playTone(ctx, 1046.5, now + 0.72, 0.6, vol * 0.7)
    } catch (e) {
      console.warn('Alarm playback failed:', e)
    }
  }

  function playTickSound() {
    if (!import.meta.client) return
    try {
      const file = settings.tickFileUrl
      if (file) {
        playAudioFile(file, 0.12)
        return
      }
      const ctx = getAudioContext()
      playTone(ctx, 800, ctx.currentTime, 0.05, 0.1)
    } catch (_) {}
  }

  function playStartSound() {
    if (!import.meta.client) return
    try {
      const ctx = getAudioContext()
      const now = ctx.currentTime
      playTone(ctx, 440, now, 0.1, 0.3)
      playTone(ctx, 660, now + 0.12, 0.15, 0.3)
    } catch (_) {}
  }

  function playAudioFile(url: string, volume = 0.6) {
    try {
      // reuse last audio element to avoid multiple decoded contexts
      if (!lastAudioEl || lastAudioEl.src !== url) {
        lastAudioEl = new Audio(url)
        lastAudioEl.preload = 'auto'
      }
      lastAudioEl.volume = volume
      lastAudioEl.currentTime = 0
      lastAudioEl.play().catch((e) => {
        // If play() is blocked (no gesture), try to resume audio context then play
        try {
          const ctx = getAudioContext()
          ctx.resume().then(() => lastAudioEl!.play().catch(() => {}))
        } catch (_) {}
      })
    } catch (e) {
      console.warn('playAudioFile failed', e)
    }
  }

  return { playAlarm, playTickSound, playStartSound }
}
