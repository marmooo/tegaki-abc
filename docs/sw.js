var CACHE_NAME="2023-01-06 18:34",urlsToCache=["/tegaki-abc/","/tegaki-abc/index.js","/tegaki-abc/index.yomi","/tegaki-abc/worker.js","/tegaki-abc/model/model.json","/tegaki-abc/model/group1-shard1of1.bin","/tegaki-abc/mp3/incorrect1.mp3","/tegaki-abc/mp3/end.mp3","/tegaki-abc/mp3/cat.mp3","/tegaki-abc/mp3/correct3.mp3","/tegaki-abc/kohacu.webp","/tegaki-abc/eraser.svg","/tegaki-abc/refresh.svg","/tegaki-abc/favicon/favicon.svg","https://marmooo.github.io/yomico/yomico.min.js","https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css","https://cdn.jsdelivr.net/npm/signature_pad@4.1.4/dist/signature_pad.umd.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.2.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})