const CACHE = 'mebel-deluxe-v1';
const ASSETS = [
  '/', '/index.html', '/manifest.json',
  '/src/styles.css'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const { request } = e;
  if(request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then(cached=> cached || fetch(request).then(resp=>{
      const copy = resp.clone();
      caches.open(CACHE).then(c=>c.put(request, copy));
      return resp;
    }).catch(()=> cached))
  );
});
self.addEventListener('notificationclick', (event)=>{
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(win=>{
      if (win.length) return win[0].focus();
      return clients.openWindow('/');
    })
  );
});