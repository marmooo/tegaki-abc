const CACHE_NAME="2023-10-14 15:30",urlsToCache=["/tegaki-abc/","/tegaki-abc/index.js","/tegaki-abc/index.yomi","/tegaki-abc/worker.js","/tegaki-abc/model/model.json","/tegaki-abc/model/group1-shard1of1.bin","/tegaki-abc/mp3/end.mp3","/tegaki-abc/mp3/cat.mp3","/tegaki-abc/mp3/correct3.mp3","/tegaki-abc/kohacu.webp","/tegaki-abc/favicon/favicon.svg","https://marmooo.github.io/yomico/yomico.min.js","https://cdn.jsdelivr.net/npm/signature_pad@4.1.7/dist/signature_pad.umd.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.12.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})