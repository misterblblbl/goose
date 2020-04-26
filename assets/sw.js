importScripts('/cache-polyfill.js');

const cacheName = 'goose-app-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/index.html?homescreen=1',
  '/?homescreen=1',
  '/styles/main.css',
  '/scripts/main.js',
  '/sounds/honk.mp3',
  '/images/icon/160.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => (cache.addAll(filesToCache))),
  );
});

const handleArrayBuffer = (request) => (buffer) => {
  const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
    request.headers.get('range'),
  );

  if (bytes) {
    const start = Number(bytes[1]);
    const end = Number(bytes[2]) || buffer.byteLength - 1;

    return new Response(buffer.slice(start, end + 1), {
      status: 206,
      statusText: 'Partial Content',
      headers: [
        ['Content-Range', `bytes ${start}-${end}/${buffer.byteLength}`],
      ],
    });
  }

  return new Response(null, {
    status: 416,
    statusText: 'Range Not Satisfiable',
    headers: [['Content-Range', `*/${buffer.byteLength}`]],
  });
};

self.addEventListener('fetch', (e) => {
  if (e.request.headers.get('range')) {
    e.respondWith(
      caches
        .open(cacheName)
        .then((cache) => cache.match(e.request.url))
        .then((res) => {
          if (!res) {
            return fetch(e.request)
              .then((res) => {
                const clonedRes = res.clone();
                return caches
                  .open(cacheName)
                  .then((cache) => cache.put(e.request, clonedRes))
                  .then(() => res);
              })
              .then((res) => res.arrayBuffer());
          }

          return res.arrayBuffer();
        })
        .then(handleArrayBuffer(e.request)),
    );
    console.log('RANGE', e.request.headers.get('range'));
  } else {
    e.respondWith(
      caches
        .match(e.request)
        .then((response) => (response || fetch(e.request))),
    );
  }
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((name) => name !== cacheName)
          .map((name) => caches.delete(name)),
      )),
  );
});
