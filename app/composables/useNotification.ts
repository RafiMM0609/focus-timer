export function useNotification() {
  async function requestPermission(): Promise<boolean> {
    if (!import.meta.client || !('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  function sendNotification(title: string, body: string) {
    if (!import.meta.client || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'focusflow-timer',
      })
    } catch (e) {
      console.warn('Notification failed:', e)
    }
  }

  return { requestPermission, sendNotification }
}
