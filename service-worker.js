
// Simple service worker for caching and notifications
const CACHE = 'mebel-cache-v1'
const ASSETS = [
  '/', '/index.html', '/admin.html', '/main.js', '/admin.js',
  '/manifest.json', '/favicon.ico', '/icons/icon-192.png', '/icons/icon-512.png'
]

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e)=>{
  e.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url)
  if (ASSETS.includes(url.pathname)) {
    e.respondWith(caches.match(e.request))
  }
})

self.addEventListener('notificationclick', (event)=>{
  event.notification.close()
  event.waitUntil(clients.matchAll({ type:'window' }).then(clis=>{
    if (clis.length > 0) { clis[0].focus(); return }
    clients.openWindow('/')
  }))
})
