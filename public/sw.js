self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data.json()
  } catch (_) {
    data = { title: 'FocusFlow', body: 'Timer update' }
  }
  const title = data.title || 'FocusFlow'
  const options = {
    body: data.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.tag || 'focusflow-sw'
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
    if (clientList.length > 0) {
      return clientList[0].focus()
    }
    return clients.openWindow('/')
  }))
})
