const CACHE_NAME="2023-09-19 20:15",urlsToCache=["/tegaki-abc/","/tegaki-abc/index.js","/tegaki-abc/index.yomi","/tegaki-abc/worker.js","/tegaki-abc/model/model.json","/tegaki-abc/model/group1-shard1of1.bin","/tegaki-abc/mp3/end.mp3","/tegaki-abc/mp3/cat.mp3","/tegaki-abc/mp3/correct3.mp3","/tegaki-abc/kohacu.webp","/tegaki-abc/favicon/favicon.svg","https://marmooo.github.io/yomico/yomico.min.js","https://cdn.jsdelivr.net/npm/signature_pad@4.1.6/dist/signature_pad.umd.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",a=>{a.waitUntil(caches.open(CACHE_NAME).then(a=>a.addAll(urlsToCache)))}),self.addEventListener("fetch",a=>{a.respondWith(caches.match(a.request).then(b=>b||fetch(a.request)))}),self.addEventListener("activate",a=>{a.waitUntil(caches.keys().then(a=>Promise.all(a.filter(a=>a!==CACHE_NAME).map(a=>caches.delete(a)))))})