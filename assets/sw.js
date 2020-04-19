
importScripts('/cache-polyfill.js');

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('goose').then((cache) => (
      cache.addAll([
        '/',
        '/index.html',
        '/index.html?homescreen=1',
        '/?homescreen=1',
        '/styles/main.css',
        '/scripts/main.js',
        '/sounds/honk.mp3',
      ])
    )),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => (
      response || fetch(e.request)
    )),
  );
});
