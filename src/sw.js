const CACHE_NAME = "2025-07-19 00:00";
const urlsToCache = [
  "/tegaki-abc/",
  "/tegaki-abc/index.js",
  "/tegaki-abc/index.yomi",
  "/tegaki-abc/worker.js",
  "/tegaki-abc/model/model.json",
  "/tegaki-abc/model/group1-shard1of1.bin",
  "/tegaki-abc/mp3/end.mp3",
  "/tegaki-abc/mp3/cat.mp3",
  "/tegaki-abc/mp3/correct3.mp3",
  "/tegaki-abc/kohacu.webp",
  "/tegaki-abc/favicon/favicon.svg",
  "https://marmooo.github.io/yomico/yomico.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js",
  "https://fonts.googleapis.com/css?family=Source+Code+Pro",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
