export function useAlarm() {
  let audioCtx: AudioContext | null = null

  function getAudioContext() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContext()
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
    try {
      const ctx = getAudioContext()
      const now = ctx.currentTime

      // Ascending cheerful 4-beep fanfare
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        playTone(ctx, freq, now + i * 0.18, 0.22, volume)
      })
      // Final long sustain
      playTone(ctx, 1046.5, now + 0.72, 0.6, volume * 0.7)
    } catch (e) {
      console.warn('Alarm playback failed:', e)
    }
  }

  function playTickSound() {
    if (!import.meta.client) return
    try {
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

  return { playAlarm, playTickSound, playStartSound }
}
