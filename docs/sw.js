const CACHE_NAME="2024-11-04 13:29",urlsToCache=["/tegaki-abc/","/tegaki-abc/index.js","/tegaki-abc/index.yomi","/tegaki-abc/worker.js","/tegaki-abc/model/model.json","/tegaki-abc/model/group1-shard1of1.bin","/tegaki-abc/mp3/end.mp3","/tegaki-abc/mp3/cat.mp3","/tegaki-abc/mp3/correct3.mp3","/tegaki-abc/kohacu.webp","/tegaki-abc/favicon/favicon.svg","https://marmooo.github.io/yomico/yomico.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})