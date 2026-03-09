export default defineNuxtPlugin(() => {
  if (!process.client) return
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(() => {
        // registered
      }).catch(() => {})
    })
  }
})
