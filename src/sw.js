var CACHE_NAME = "2022-06-08 00:25";
var urlsToCache = [
  "/tegaki-abc/",
  "/tegaki-abc/index.js",
  "/tegaki-abc/index.yomi",
  "/tegaki-abc/worker.js",
  "/tegaki-abc/model/model.json",
  "/tegaki-abc/model/group1-shard1of1.bin",
  "/tegaki-abc/mp3/incorrect1.mp3",
  "/tegaki-abc/mp3/end.mp3",
  "/tegaki-abc/mp3/cat.mp3",
  "/tegaki-abc/mp3/correct3.mp3",
  "/tegaki-abc/kohacu.webp",
  "/tegaki-abc/favicon/favicon.svg",
  "https://marmooo.github.io/yomico/yomico.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/signature_pad@4.0.4/dist/signature_pad.umd.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.17.0/dist/tf.min.js",
  "https://fonts.googleapis.com/css?family=Source+Code+Pro",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
