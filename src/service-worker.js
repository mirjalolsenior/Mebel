self.addEventListener('install', (event) => self.skipWaiting())
self.addEventListener('activate', (event) => self.clients.claim())
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Bildirishnoma'
  const options = { body: data.body || '', icon: '/icon.png' }
  event.waitUntil(self.registration.showNotification(title, options))
})
